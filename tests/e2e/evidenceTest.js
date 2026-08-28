import { test as base } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const test = base.extend({
  qaEvidence: async ({ page }, use, testInfo) => {
    const consoleMessages = [];
    const timeline = [];
    const metadata = {
      classificationBasis: []
    };

    page.on("console", (message) => {
      consoleMessages.push({
        type: message.type(),
        text: message.text(),
        location: message.location()
      });
    });

    await use({
      consoleMessages,
      setMetadata(nextMetadata) {
        Object.assign(metadata, nextMetadata);
      },
      addClassificationBasis(nextBasis) {
        metadata.classificationBasis.push(nextBasis);
      },
      recordStep(step) {
        timeline.push(normalizeTimelineEntry("step", step));
      },
      recordCriterion(criterion) {
        timeline.push(normalizeTimelineEntry("criterion", criterion));
      }
    });

    if (testInfo.status === testInfo.expectedStatus) {
      return;
    }

    const evidenceDir = path.join(
      "artifacts",
      "playwright-evidence",
      sanitize(`${testInfo.title}-retry-${testInfo.retry}`)
    );
    await mkdir(evidenceDir, { recursive: true });

    const screenshotPath = path.join(evidenceDir, "screenshot.png");
    await page.screenshot({
      fullPage: true,
      path: screenshotPath
    });

    const state = await page.evaluate(() => {
      if (!window.__QA_AUTOMATION__) {
        return {
          available: false,
          reason: "window.__QA_AUTOMATION__ API가 없음"
        };
      }

      return {
        available: true,
        value: window.__QA_AUTOMATION__.getState()
      };
    }).catch((error) => ({
      available: false,
      reason: error.message
    }));

    await writeJson(path.join(evidenceDir, "console-log.json"), consoleMessages);
    await writeJson(path.join(evidenceDir, "state.json"), state);
    await writeJson(path.join(evidenceDir, "metadata.json"), normalizeMetadata(metadata));
    await writeJson(path.join(evidenceDir, "timeline.json"), timeline);
    await writeJson(path.join(evidenceDir, "assertion-error.json"), normalizeAssertionErrors(testInfo.errors));
    await writeJson(path.join(evidenceDir, "test-info.json"), {
      title: testInfo.title,
      status: testInfo.status,
      expectedStatus: testInfo.expectedStatus,
      retry: testInfo.retry,
      project: testInfo.project.name,
      evidenceDir,
      screenshotPath
    });
  }
});

export { expect } from "@playwright/test";

async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function sanitize(value) {
  return value.replace(/[^a-zA-Z0-9가-힣_-]/g, "_");
}

function normalizeMetadata(metadata) {
  return {
    testCaseId: metadata.testCaseId ?? null,
    requirementId: metadata.requirementId ?? null,
    testGroupId: metadata.testGroupId ?? null,
    testGroupName: metadata.testGroupName ?? null,
    assertion: metadata.assertion ?? null,
    expected: metadata.expected ?? null,
    actual: metadata.actual ?? null,
    classificationBasis: metadata.classificationBasis ?? [],
    notes: metadata.notes ?? []
  };
}

function normalizeTimelineEntry(type, entry) {
  const expected = entry.expected ?? null;
  const actual = entry.actual ?? null;
  const result = entry.result ?? null;
  const passCriteria = entry.passCriteria ?? null;
  const failedBecause = entry.failedBecause ?? null;

  return {
    type,
    name: entry.name,
    status: entry.status ?? "recorded",
    comparison: createComparison({
      expected,
      actual,
      passCriteria,
      result,
      failedBecause
    }),
    expected,
    actual,
    passCriteria,
    result,
    failedBecause,
    state: entry.state ?? null,
    recordedAt: new Date().toISOString()
  };
}

function createComparison({ expected, actual, passCriteria, result, failedBecause }) {
  if (!passCriteria && !expected && !actual && !result && !failedBecause) {
    return null;
  }

  return {
    passCriteria,
    expectedResult: formatComparisonValue(expected),
    actualResult: formatComparisonValue(actual),
    result,
    failedBecause
  };
}

function formatComparisonValue(value) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== "object") {
    return String(value);
  }

  return Object.entries(value)
    .map(([key, nextValue]) => `${key}=${String(nextValue)}`)
    .join(", ");
}

function normalizeAssertionErrors(errors) {
  if (!Array.isArray(errors) || errors.length === 0) {
    return {
      available: false,
      reason: "Playwright assertion error가 없음",
      errors: []
    };
  }

  const normalizedErrors = errors.map((error) => {
    const message = stripAnsi(error.message ?? "");
    const stack = stripAnsi(error.stack ?? "");

    return {
      message,
      expected: extractErrorValue(message, "Expected"),
      received: extractErrorValue(message, "Received"),
      location: extractErrorLocation(stack),
      stack
    };
  });

  return {
    available: true,
    summary: createAssertionErrorSummary(normalizedErrors[0]),
    errors: normalizedErrors
  };
}

function createAssertionErrorSummary(error) {
  return {
    message: getFirstLine(error.message),
    expected: error.expected,
    received: error.received
  };
}

function extractErrorValue(message, label) {
  const pattern = new RegExp(`${label}:\\s+(.+)`);
  const match = message.match(pattern);

  if (!match) {
    return null;
  }

  return match[1].trim();
}

function extractErrorLocation(stack) {
  const lines = stack.split("\n");
  const locationLine = lines.find((line) => line.includes(".spec.js:") || line.includes(".test.js:"));

  return locationLine?.trim() ?? null;
}

function getFirstLine(value) {
  return value.split("\n")[0] ?? value;
}

function stripAnsi(value) {
  return value.replace(/\u001b\[[0-9;]*m/g, "");
}
