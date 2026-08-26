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
