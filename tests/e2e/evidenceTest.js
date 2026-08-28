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
  return {
    type,
    name: entry.name,
    status: entry.status ?? "recorded",
    expected: entry.expected ?? null,
    actual: entry.actual ?? null,
    passCriteria: entry.passCriteria ?? null,
    result: entry.result ?? null,
    failedBecause: entry.failedBecause ?? null,
    state: entry.state ?? null,
    recordedAt: new Date().toISOString()
  };
}
