import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { FailureClassifier } from "./failureClassifier.js";
import { DecisionEngine } from "./decisionEngine.js";
import { DecisionLogger } from "./decisionLogger.js";
import { PlaywrightEvidenceReader } from "./playwrightEvidenceReader.js";

export class PlaywrightEvidenceAnalyzer {
  constructor(options = {}) {
    this.reader = options.reader ?? new PlaywrightEvidenceReader();
    this.classifier = options.classifier ?? new FailureClassifier();
    this.decisionEngine = options.decisionEngine ?? new DecisionEngine();
    this.decisionLogger = options.decisionLogger ?? new DecisionLogger();
  }

  async analyze(options = {}) {
    const evidenceDir = options.evidenceDir ?? await findLatestEvidenceDir(options.baseDir ?? "artifacts/playwright-evidence");
    const evidence = await this.reader.read(evidenceDir);
    const classification = this.classifier.classify({
      exitCode: 1,
      stdout: "",
      stderr: "",
      evidence
    });
    const attempt = options.attempt ?? getAttemptFromEvidence(evidence);
    const decision = this.decisionEngine.decide({
      ...classification,
      attempt
    });
    const entry = {
      testId: options.testId ?? evidence.metadata.testCaseId ?? evidence.testInfo.title ?? "PLAYWRIGHT-EVIDENCE",
      testTitle: evidence.testInfo.title ?? null,
      requirementId: evidence.metadata.requirementId ?? null,
      testGroupId: evidence.metadata.testGroupId ?? null,
      expected: evidence.metadata.expected ?? null,
      actual: evidence.metadata.actual ?? null,
      assertion: evidence.metadata.assertion ?? null,
      failedCriteria: getFailedCriteria(evidence.timeline),
      timelineSummary: summarizeTimeline(evidence.timeline),
      assertionError: summarizeAssertionError(evidence.assertionError),
      failureSummary: createFailureSummary({
        metadata: evidence.metadata,
        timeline: evidence.timeline,
        assertionError: evidence.assertionError,
        classification,
        decision
      }),
      attempt,
      result: classification.result,
      classification: classification.classification,
      observations: classification.observations,
      evidenceDir,
      screenshotPath: evidence.screenshotPath,
      decision: decision.decision,
      reason: decision.reason,
      nextAction: decision.nextAction,
      createdAt: new Date().toISOString()
    };

    await this.decisionLogger.write(entry);
    await this.decisionLogger.writeSummary({
      testId: entry.testId,
      finalResult: entry.result,
      finalClassification: entry.classification,
      finalDecision: entry.decision,
      attempts: [entry]
    });

    return entry;
  }
}

function getFailedCriteria(timeline) {
  if (!Array.isArray(timeline)) {
    return [];
  }

  return timeline
    .filter((entry) => entry.type === "criterion" && entry.status === "failed")
    .map((entry) => ({
      name: entry.name,
      passCriteria: entry.passCriteria,
      comparison: entry.comparison ?? null,
      expected: entry.expected,
      actual: entry.actual,
      failedBecause: entry.failedBecause
    }));
}

function summarizeTimeline(timeline) {
  if (!Array.isArray(timeline)) {
    return {
      totalEvents: 0,
      failedCriteria: 0,
      lastEvent: null
    };
  }

  const failedCriteria = timeline.filter((entry) => entry.type === "criterion" && entry.status === "failed");

  return {
    totalEvents: timeline.length,
    failedCriteria: failedCriteria.length,
    lastEvent: timeline.at(-1)?.name ?? null
  };
}

function summarizeAssertionError(assertionError) {
  if (!assertionError?.available) {
    return {
      available: false,
      message: assertionError?.reason ?? "assertion-error evidence가 없음"
    };
  }

  return {
    available: true,
    message: assertionError.summary?.message ?? null,
    expected: assertionError.summary?.expected ?? null,
    received: assertionError.summary?.received ?? null
  };
}

function createFailureSummary({ metadata, timeline, assertionError, classification, decision }) {
  const failedCriterion = getFailedCriteria(timeline)[0] ?? {};
  const comparison = failedCriterion.comparison ?? {};

  return {
    evaluationTarget: metadata.assertion?.name ?? failedCriterion.name ?? null,
    passCriteria: comparison.passCriteria ?? failedCriterion.passCriteria ?? null,
    expectedResult: comparison.expectedResult ?? formatComparisonValue(metadata.expected),
    actualResult: comparison.actualResult ?? formatComparisonValue(metadata.actual),
    frameworkObserved: createFrameworkObserved(assertionError),
    failedBecause: comparison.failedBecause ?? failedCriterion.failedBecause ?? null,
    classification: classification.classification,
    decision: decision.decision,
    nextAction: decision.nextAction
  };
}

function createFrameworkObserved(assertionError) {
  if (!assertionError?.available) {
    return null;
  }

  const expected = assertionError.summary?.expected;
  const received = assertionError.summary?.received;

  if (!expected && !received) {
    return assertionError.summary?.message ?? null;
  }

  return `Expected ${expected}, Received ${received}`;
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

function getAttemptFromEvidence(evidence) {
  if (typeof evidence.testInfo?.retry === "number") {
    return evidence.testInfo.retry + 1;
  }

  return 1;
}

async function findLatestEvidenceDir(baseDir) {
  const entries = await readdir(baseDir, { withFileTypes: true });
  const directories = await Promise.all(entries
    .filter((entry) => entry.isDirectory())
    .map(async (entry) => {
      const fullPath = path.join(baseDir, entry.name);
      const info = await stat(fullPath);
      return {
        fullPath,
        mtimeMs: info.mtimeMs
      };
    }));

  if (directories.length === 0) {
    throw new Error(`Playwright evidence 디렉터리가 비어 있음: ${baseDir}`);
  }

  directories.sort((a, b) => b.mtimeMs - a.mtimeMs);
  return directories[0].fullPath;
}
