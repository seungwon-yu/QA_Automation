import { describe, expect, it } from "vitest";
import { GameHarness } from "../harness/gameHarness.js";
import { FailureClassifier } from "../agent/failureClassifier.js";

describe("하네스 경계와 게임 규칙 회귀", () => {
  it.each([0, 3, 5])("HAR-001 목표가 %i번째 프레임에 충족된다", (targetFrame) => {
    const harness = new GameHarness().start();
    const result = harness.runUntil((state, frame) => frame === targetFrame, 5);
    expect(result.matched).toBe(true);
    expect(result.frames).toBe(targetFrame);
    expect(harness.getTimeline()).toHaveLength(targetFrame);
  });

  it("HAR-001 마지막 프레임 점수 조건과 미충족을 구분한다", () => {
    expect(new GameHarness().start().runUntil((state) => state.score > 0, 5).matched).toBe(true);
    expect(new GameHarness().start().runUntil(() => false, 5).matched).toBe(false);
    expect(new GameHarness().runUntil(() => false, 0).frames).toBe(0);
  });

  it("HAR-002 잘못된 프레임과 FPS를 거부한다", () => {
    expect(() => new GameHarness().runForFrames(-1)).toThrow(RangeError);
    expect(() => new GameHarness().runForFrames(1, 0)).toThrow(RangeError);
    expect(() => new GameHarness().runUntil(() => false, 1.5)).toThrow(RangeError);
  });

  it("TC-001-05 ready 상태의 시간 진행은 게임을 변경하지 않는다", () => {
    const harness = new GameHarness();
    const before = harness.getState();
    harness.runForFrames(120);
    expect(harness.getState()).toEqual(before);
  });

  it("TC-002-05 ready 점프는 시작과 점프를 함께 수행한다", () => {
    const harness = new GameHarness().pressJump();
    expect(harness.getState().status).toBe("running");
    expect(harness.getState().player.isGrounded).toBe(false);
  });

  it("TC-002-06 gameOver에서 Start와 Jump는 상태를 변경하지 않는다", () => {
    const harness = new GameHarness().start().placeObstacleAtPlayer().runForFrames(1);
    const before = harness.getState();
    harness.start().pressJump().runForFrames(120);
    expect(harness.getState()).toEqual(before);
  });

  // player=(86,238,44,54), padding=5. dt=0으로 이동 효과를 분리한다.
  it.each([
    ["오른쪽 내부", 124, 238, true], ["오른쪽 접촉", 125, 238, false], ["오른쪽 외부", 126, 238, false],
    ["왼쪽 내부", 72, 238, true], ["왼쪽 접촉", 71, 238, false], ["왼쪽 외부", 70, 238, false],
    ["아래 내부", 100, 286, true], ["아래 접촉", 100, 287, false], ["아래 외부", 100, 288, false],
    ["위 내부", 100, 224, true], ["위 접촉", 100, 223, false], ["위 외부", 100, 222, false]
  ])("TC-005-03 %s 경계 판정", (label, x, y, collision) => {
    const harness = new GameHarness().start().placeObstacle({ x, y, width: 20, height: 20 });
    harness.engine.tick(0);
    expect(harness.getState().status).toBe(collision ? "gameOver" : "running");
  });

  it("TC-005-05 실제 한 프레임 이동으로 경계 안에 진입하면 충돌한다", () => {
    const harness = new GameHarness().start().placeObstacle({ x: 130, y: 238, width: 20, height: 20 });
    harness.runForFrames(1);
    expect(harness.getState().status).toBe("gameOver");
  });

  it("TC-001-03 재시작은 플레이어와 장애물도 초기화한다", () => {
    const harness = new GameHarness().start().pressJump().placeObstacleAhead(200).runForFrames(3);
    harness.restart();
    expect(harness.getState().player).toEqual(new GameHarness().getState().player);
    expect(harness.getState().obstacles).toEqual([]);
  });

  it("HAR-003 같은 랜덤 입력은 장애물 ID를 포함해 같은 상태를 만든다", () => {
    const first = new GameHarness().start().runForFrames(70);
    const second = new GameHarness().start().runForFrames(70);
    expect(first.getState()).toEqual(second.getState());
  });
});

describe("실패 원인 분류의 반례", () => {
  const classifier = new FailureClassifier();
  it.each(["TypeError: product update crashed", "locator.click: Timeout 30000ms exceeded"])("DIAG-001 불명확한 오류 %s", (stderr) => {
    expect(classifier.classify({ exitCode: 1, stderr }).classification).toBe("REVIEW_REQUIRED");
  });

  it("DIAG-002 제품 콘솔 문자열을 도구 오류로 사용하지 않는다", () => {
    const result = classifier.classify({ exitCode: 1, evidence: { consoleLog: [{ text: "TypeError: product update crashed" }] } });
    expect(result.classification).toBe("REVIEW_REQUIRED");
  });

  it("DIAG-003 서로 충돌하는 metadata 근거는 검토한다", () => {
    const result = classifier.classify({ exitCode: 1, evidence: { metadata: {
      expected: { status: "gameOver" }, actual: { status: "running" },
      classificationBasis: [{ supports: "PRODUCT_FAIL", reason: "상태 불일치" }, { supports: "ENV_FAIL", reason: "환경 불명확" }]
    } } });
    expect(result.classification).toBe("REVIEW_REQUIRED");
  });

  it("DIAG-004 제품 분류 라벨만 있고 관찰값이 없으면 검토한다", () => {
    const result = classifier.classify({ exitCode: 1, evidence: { metadata: {
      classificationBasis: [{ supports: "PRODUCT_FAIL", reason: "제품 오류라고 주장" }]
    } } });
    expect(result.classification).toBe("REVIEW_REQUIRED");
  });
});
