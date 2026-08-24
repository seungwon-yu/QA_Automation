import { describe, expect, it } from "vitest";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { DecisionEngine } from "../agent/decisionEngine.js";
import { EvidenceCollector } from "../agent/evidenceCollector.js";
import { FailureClassifier } from "../agent/failureClassifier.js";
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
    const state = JSON.parse(await readFile(evidence.files.state, "utf8"));
    const timeline = JSON.parse(await readFile(evidence.files.timeline, "utf8"));

    expect(commandLog.testId).toBe("TC-AGENT-001");
    expect(state.status).toBe("gameOver");
    expect(timeline).toHaveLength(1);

    await rm(baseDir, { recursive: true, force: true });
  });
});
