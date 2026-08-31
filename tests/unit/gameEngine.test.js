import { describe, expect, it } from "vitest";
import { GameHarness } from "../harness/gameHarness.js";

describe("GameEngine harness loop", () => {
  it("TC-001-01 초기 상태는 ready와 0점이다", () => {
    const harness = new GameHarness();

    expect(harness.getState().status).toBe("ready");
    expect(harness.getState().score).toBe(0);
  });

  it("TC-001-02 start 호출 시 running 상태로 전이된다", () => {
    const harness = new GameHarness();

    harness.start();

    expect(harness.getState().status).toBe("running");
  });

  it("TC-002-01 점프 입력 후 플레이어가 상승하고 공중 상태가 된다", () => {
    const harness = new GameHarness().start();
    const initialY = harness.getState().player.y;

    harness.pressJump().runForFrames(6);

    expect(harness.getState().player.y).toBeLessThan(initialY);
    expect(harness.getState().player.isGrounded).toBe(false);
  });

  it("TC-002-02 공중에서는 중복 점프가 거부된다", () => {
    const harness = new GameHarness().start();

    harness.pressJump().runForFrames(6);
    const airborneVelocity = harness.getState().player.velocityY;
    harness.pressJump();

    expect(harness.getState().player.velocityY).toBe(airborneVelocity);
  });

  it("TC-002-03 점프 후 충분한 루프가 지나면 착지한다", () => {
    const harness = new GameHarness().start().pressJump();
    const result = harness.runUntil((state) => state.player.isGrounded, 180);

    expect(result.matched).toBe(true);
    expect(result.state.player.y).toBe(result.state.groundY - result.state.player.height);
  });

  it("TC-002-04 착지 후 다시 점프할 수 있다", () => {
    const harness = new GameHarness().start().pressJump();
    harness.runUntil((state) => state.player.isGrounded, 180);
    const landedY = harness.getState().player.y;

    harness.pressJump().runForFrames(6);

    expect(harness.getState().player.y).toBeLessThan(landedY);
    expect(harness.getState().player.isGrounded).toBe(false);
  });

  it("TC-003-01 runForFrames는 지정한 프레임만큼 타임라인을 기록한다", () => {
    const harness = new GameHarness().start();

    harness.runForFrames(30);

    expect(harness.getTimeline()).toHaveLength(30);
  });

  it("TC-003-02 runForSeconds는 시뮬레이션 시간만큼 점수를 증가시킨다", () => {
    const harness = new GameHarness().start();

    harness.runForSeconds(1);

    expect(harness.getState().score).toBeGreaterThanOrEqual(11);
    expect(harness.getState().score).toBeLessThanOrEqual(12);
  });

  it("TC-003-04 게임오버 후 루프를 진행해도 점수가 증가하지 않는다", () => {
    const harness = new GameHarness().start();

    harness.placeObstacleAtPlayer().runForFrames(1);
    const gameOverScore = harness.getState().score;
    harness.runForSeconds(2);

    expect(harness.getState().status).toBe("gameOver");
    expect(harness.getState().score).toBe(gameOverScore);
  });

  it("TC-004-01 장애물 강제 생성 시 상태에 장애물이 추가된다", () => {
    const harness = new GameHarness().start();
    const stateBeforePlacement = harness.getState();

    harness.placeObstacleAhead(120, { width: 30, height: 50 });

    const obstacle = harness.getState().obstacles[0];
    expect(harness.getState().obstacles).toHaveLength(1);
    expect(obstacle.x).toBe(stateBeforePlacement.player.x + stateBeforePlacement.player.width + 120);
    expect(obstacle.y).toBe(stateBeforePlacement.groundY - 50);
    expect(obstacle.width).toBe(30);
    expect(obstacle.height).toBe(50);
  });

  it("TC-004-02 장애물은 루프 진행에 따라 왼쪽으로 이동한다", () => {
    const harness = new GameHarness().start().placeObstacleAhead(220);
    const initialObstacleX = harness.getState().obstacles[0].x;

    harness.runForFrames(10);

    expect(harness.getState().obstacles[0].x).toBeLessThan(initialObstacleX);
  });

  it("TC-004-03 화면 밖으로 이동한 장애물은 상태에서 제거된다", () => {
    const harness = new GameHarness().start();

    harness.placeObstacle({
      id: "near-left-boundary",
      x: -25,
      y: harness.getState().groundY - 40,
      width: 20,
      height: 40
    });
    harness.runForFrames(1);

    expect(harness.getState().obstacles).toHaveLength(0);
  });

  it("TC-004-04 고정 랜덤 소스를 사용하면 장애물 크기를 예측할 수 있다", () => {
    const randomValues = [0, 0.999, 0.123];
    const harness = new GameHarness({
      rng: () => randomValues.shift() ?? 0.5
    }).start();

    harness.spawnObstacle(480);

    const obstacle = harness.getState().obstacles[0];
    expect(obstacle.x).toBe(480);
    expect(obstacle.height).toBe(34);
    expect(obstacle.width).toBe(37);
  });

  it("TC-005-01 장애물이 플레이어와 겹치면 gameOver가 된다", () => {
    const harness = new GameHarness().start();

    harness.placeObstacleAtPlayer().runForFrames(1);

    expect(harness.getState().status).toBe("gameOver");
  });

  it("TC-005-02 장애물이 플레이어와 겹치지 않으면 running이 유지된다", () => {
    const harness = new GameHarness().start();

    harness.placeObstacleAhead(220).runForFrames(1);

    expect(harness.getState().status).toBe("running");
  });

  it("TC-005-04 충돌 후 재시작하면 점수와 상태가 초기화된다", () => {
    const harness = new GameHarness().start().runForFrames(120);

    expect(harness.getState().score).toBeGreaterThan(0);

    harness.placeObstacleAtPlayer().runForFrames(1);
    harness.restart();

    expect(harness.getState().status).toBe("running");
    expect(harness.getState().score).toBe(0);
  });

  it("타임라인은 clearTimeline으로 초기화할 수 있다", () => {
    const harness = new GameHarness().start().runForFrames(10);

    harness.clearTimeline();

    expect(harness.getTimeline()).toHaveLength(0);
  });
});
