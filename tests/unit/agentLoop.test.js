import { describe, expect, it } from "vitest";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { DecisionEngine } from "../agent/decisionEngine.js";
import { EvidenceCollector } from "../agent/evidenceCollector.js";
import { FailureClassifier } from "../agent/failureClassifier.js";
import { AgentLoopRunner } from "../agent/agentLoopRunner.js";
import { DecisionLogger } from "../agent/decisionLogger.js";
import { PlaywrightEvidenceAnalyzer } from "../agent/playwrightEvidenceAnalyzer.js";
import { PlaywrightEvidenceReader } from "../agent/playwrightEvidenceReader.js";
import { CLASSIFICATION, DECISION, RESULT } from "../agent/failureTypes.js";

describe("QA Agent Loop failure handling", () => {
  it("환경 오류 패턴을 ENV_FAIL로 분류한다", () => {
    const classifier = new FailureClassifier();

    const result = classifier.classify({
      exitCode: 1,
      stderr: "browserType.launch: Executable doesn't exist"
    });

    expect(result.classification).toBe(CLASSIFICATION.ENV_FAIL);
  });

  it("locator strict mode 문제를 TEST_FAIL로 분류한다", () => {
    const classifier = new FailureClassifier();

    const result = classifier.classify({
      exitCode: 1,
      stderr: "locator.click: Error: strict mode violation"
    });

    expect(result.classification).toBe(CLASSIFICATION.TEST_FAIL);
  });

  it("근거가 부족한 실패는 REVIEW_REQUIRED로 분류한다", () => {
    const classifier = new FailureClassifier();

    const result = classifier.classify({
      exitCode: 1,
      stderr: "AssertionError: expected true to be false"
    });

    expect(result.classification).toBe(CLASSIFICATION.REVIEW_REQUIRED);
  });

  it("metadata의 충돌 판단 근거로 PRODUCT_FAIL을 분류한다", () => {
    const classifier = new FailureClassifier();

    const result = classifier.classify({
      exitCode: 1,
      evidence: {
        metadata: {
          testCaseId: "TC-005-01",
          testGroupId: "TC-GROUP-05",
          expected: {
            status: "gameOver"
          },
          actual: {
            status: "running",
            collision: true
          },
          classificationBasis: [
            {
              testGroupId: "TC-GROUP-05",
              basisType: "collisionStateMismatch",
              supports: CLASSIFICATION.PRODUCT_FAIL,
              reason: "충돌 조건이 true인데 상태가 gameOver로 전이되지 않음"
            }
          ]
        }
      }
    });

    expect(result.classification).toBe(CLASSIFICATION.PRODUCT_FAIL);
    expect(result.observations).toContain("testCaseId=TC-005-01");
    expect(result.observations).toContain("testGroupId=TC-GROUP-05");
  });

  it("PASS 결과는 STOP으로 결정한다", () => {
    const engine = new DecisionEngine();

    const decision = engine.decide({
      result: RESULT.PASS,
      attempt: 1
    });

    expect(decision.decision).toBe(DECISION.STOP);
  });

  it("재시도 가능 실패는 최대 횟수 전까지 RETRY로 결정한다", () => {
    const engine = new DecisionEngine({ maxRetries: 3 });

    const decision = engine.decide({
      result: RESULT.FAIL,
      classification: CLASSIFICATION.ENV_FAIL,
      attempt: 1
    });

    expect(decision.decision).toBe(DECISION.RETRY);
  });

  it("REVIEW_REQUIRED는 재시도하지 않고 REVIEW로 결정한다", () => {
    const engine = new DecisionEngine({ maxRetries: 3 });

    const decision = engine.decide({
      result: RESULT.FAIL,
      classification: CLASSIFICATION.REVIEW_REQUIRED,
      attempt: 1
    });

    expect(decision.decision).toBe(DECISION.REVIEW);
  });

  it("EvidenceCollector는 실패 증거 파일을 저장한다", async () => {
    const baseDir = await mkdtemp(path.join(tmpdir(), "qa-agent-evidence-"));
    const collector = new EvidenceCollector({ baseDir });

    const evidence = await collector.collect({
      testId: "TC-AGENT-001",
      attempt: 1,
      command: "npm test",
      exitCode: 1,
      stdout: "stdout sample",
      stderr: "stderr sample",
      state: { status: "gameOver" },
      timeline: [{ frame: 1, status: "running" }]
    });

    const commandLog = JSON.parse(await readFile(evidence.files.commandLog, "utf8"));
    const consoleLog = JSON.parse(await readFile(evidence.files.consoleLog, "utf8"));
    const screenshot = JSON.parse(await readFile(evidence.files.screenshot, "utf8"));
    const state = JSON.parse(await readFile(evidence.files.state, "utf8"));
    const timeline = JSON.parse(await readFile(evidence.files.timeline, "utf8"));

    expect(commandLog.testId).toBe("TC-AGENT-001");
    expect(consoleLog.stderr).toBe("stderr sample");
    expect(screenshot.available).toBe(false);
    expect(state.status).toBe("gameOver");
    expect(timeline).toHaveLength(1);

    await rm(baseDir, { recursive: true, force: true });
  });

  it("ENV_FAIL은 최대 재시도 횟수까지 증거를 저장하고 STOP으로 종료한다", async () => {
    const baseDir = await mkdtemp(path.join(tmpdir(), "qa-agent-env-"));
    const runner = createRunner({
      baseDir,
      maxRetries: 3,
      stderr: "browserType.launch: Executable doesn't exist"
    });

    const summary = await runner.run({
      testId: "TC-ENV-FAIL",
      command: "fixture env fail"
    });

    expect(summary.finalClassification).toBe(CLASSIFICATION.ENV_FAIL);
    expect(summary.finalDecision).toBe(DECISION.STOP);
    expect(summary.attempts).toHaveLength(3);
    expect(summary.attempts[0].decision).toBe(DECISION.RETRY);
    expect(summary.attempts[2].decision).toBe(DECISION.STOP);
    expect(summary.attempts.every((attempt) => attempt.evidenceDir)).toBe(true);

    await rm(baseDir, { recursive: true, force: true });
  });

  it("TEST_FAIL은 재시도하지 않고 STOP으로 종료한다", async () => {
    const baseDir = await mkdtemp(path.join(tmpdir(), "qa-agent-test-"));
    const runner = createRunner({
      baseDir,
      stderr: "locator.click: Error: strict mode violation"
    });

    const summary = await runner.run({
      testId: "TC-TEST-FAIL",
      command: "fixture test fail"
    });

    expect(summary.finalClassification).toBe(CLASSIFICATION.TEST_FAIL);
    expect(summary.finalDecision).toBe(DECISION.STOP);
    expect(summary.attempts).toHaveLength(1);

    await rm(baseDir, { recursive: true, force: true });
  });

  it("PRODUCT_FAIL은 재현성 확인 후 최대 재시도에서 STOP으로 종료한다", async () => {
    const baseDir = await mkdtemp(path.join(tmpdir(), "qa-agent-product-"));
    const runner = createRunner({
      baseDir,
      maxRetries: 2,
      stderr: "PRODUCT_ASSERTION: Expected game state gameOver but received running"
    });

    const summary = await runner.run({
      testId: "TC-PRODUCT-FAIL",
      command: "fixture product fail"
    });

    expect(summary.finalClassification).toBe(CLASSIFICATION.PRODUCT_FAIL);
    expect(summary.finalDecision).toBe(DECISION.STOP);
    expect(summary.attempts).toHaveLength(2);
    expect(summary.attempts[0].decision).toBe(DECISION.RETRY);

    await rm(baseDir, { recursive: true, force: true });
  });

  it("REVIEW_REQUIRED는 재시도하지 않고 REVIEW로 종료한다", async () => {
    const baseDir = await mkdtemp(path.join(tmpdir(), "qa-agent-review-"));
    const runner = createRunner({
      baseDir,
      stderr: "AssertionError: expected true to be false"
    });

    const summary = await runner.run({
      testId: "TC-REVIEW-REQUIRED",
      command: "fixture review required"
    });

    expect(summary.finalClassification).toBe(CLASSIFICATION.REVIEW_REQUIRED);
    expect(summary.finalDecision).toBe(DECISION.REVIEW);
    expect(summary.attempts).toHaveLength(1);

    await rm(baseDir, { recursive: true, force: true });
  });

  it("Playwright evidence를 읽어 REVIEW_REQUIRED 판단과 Decision Log를 남긴다", async () => {
    const baseDir = await mkdtemp(path.join(tmpdir(), "qa-playwright-evidence-"));
    const evidenceDir = path.join(baseDir, "evidence", "sample");
    await mkdir(evidenceDir, { recursive: true });
    await writeJson(path.join(evidenceDir, "console-log.json"), [
      {
        type: "log",
        text: "QA_EVIDENCE_SAMPLE_LOG"
      }
    ]);
    await writeJson(path.join(evidenceDir, "state.json"), {
      available: true,
      value: {
        status: "ready"
      }
    });
    await writeJson(path.join(evidenceDir, "test-info.json"), {
      title: "sample evidence failure",
      status: "failed",
      expectedStatus: "passed",
      retry: 0,
      screenshotPath: path.join(evidenceDir, "screenshot.png")
    });
    await writeJson(path.join(evidenceDir, "metadata.json"), {
      testCaseId: "TC-008-EVIDENCE-001",
      requirementId: "REQ-EVIDENCE-001",
      testGroupId: "TC-GROUP-08",
      expected: {
        evidenceSaved: true
      },
      actual: {
        evidenceSaved: "실패 이후 fixture에서 확인"
      },
      assertion: {
        name: "Playwright 실패 증거 저장"
      },
      classificationBasis: [
        {
          testGroupId: "TC-GROUP-08",
          basisType: "evidenceCollectionSample",
          supports: CLASSIFICATION.REVIEW_REQUIRED,
          reason: "의도된 실패 샘플이므로 제품, 테스트, 환경 실패로 단정하지 않음"
        }
      ]
    });
    await writeJson(path.join(evidenceDir, "timeline.json"), [
      {
        type: "step",
        name: "page-loaded",
        status: "passed"
      },
      {
        type: "criterion",
        name: "TC-008-EVIDENCE-001 의도 실패 기준",
        status: "failed",
        passCriteria: "의도 실패 샘플은 실패 후 evidence 저장을 확인한다.",
        expected: {
          evidenceSavedAfterFailure: true
        },
        actual: {
          assertionFailureTriggered: true
        },
        failedBecause: "evidence 저장 검증을 위해 의도적으로 assertion을 실패시킴"
      }
    ]);
    await writeFile(path.join(evidenceDir, "screenshot.png"), "fake screenshot", "utf8");

    const analyzer = new PlaywrightEvidenceAnalyzer({
      reader: new PlaywrightEvidenceReader(),
      decisionLogger: new DecisionLogger({
        logDir: path.join(baseDir, "agent")
      })
    });

    const entry = await analyzer.analyze({
      evidenceDir
    });

    expect(entry.classification).toBe(CLASSIFICATION.REVIEW_REQUIRED);
    expect(entry.decision).toBe(DECISION.REVIEW);
    expect(entry.testId).toBe("TC-008-EVIDENCE-001");
    expect(entry.testGroupId).toBe("TC-GROUP-08");
    expect(entry.expected).toEqual({
      evidenceSaved: true
    });
    expect(entry.timelineSummary).toEqual({
      totalEvents: 2,
      failedCriteria: 1,
      lastEvent: "TC-008-EVIDENCE-001 의도 실패 기준"
    });
    expect(entry.failedCriteria).toEqual([
      {
        name: "TC-008-EVIDENCE-001 의도 실패 기준",
        passCriteria: "의도 실패 샘플은 실패 후 evidence 저장을 확인한다.",
        expected: {
          evidenceSavedAfterFailure: true
        },
        actual: {
          assertionFailureTriggered: true
        },
        failedBecause: "evidence 저장 검증을 위해 의도적으로 assertion을 실패시킴"
      }
    ]);
    expect(entry.evidenceDir).toBe(evidenceDir);
    expect(entry.screenshotPath).toContain("screenshot.png");

    await rm(baseDir, { recursive: true, force: true });
  });
});

function createRunner({ baseDir, maxRetries = 3, stderr }) {
  return new AgentLoopRunner({
    maxRetries,
    evidenceCollector: new EvidenceCollector({
      baseDir: path.join(baseDir, "evidence")
    }),
    decisionLogger: new DecisionLogger({
      logDir: path.join(baseDir, "agent")
    }),
    commandExecutor: async () => ({
      exitCode: 1,
      stdout: "",
      stderr
    })
  });
}

async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
