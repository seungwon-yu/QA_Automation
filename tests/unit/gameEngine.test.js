import { describe, expect, it } from "vitest";
import { GameHarness } from "../harness/gameHarness.js";

describe("GameEngine harness loop", () => {
  it("starts in ready state", () => {
    const harness = new GameHarness();

    expect(harness.getState().status).toBe("ready");
    expect(harness.getState().score).toBe(0);
  });

  it("moves the player upward after jump input", () => {
    const harness = new GameHarness().start();
    const initialY = harness.getState().player.y;

    harness.pressJump().tick(6);

    expect(harness.getState().player.y).toBeLessThan(initialY);
    expect(harness.getState().player.isGrounded).toBe(false);
  });

  it("sets game over when an obstacle intersects the player", () => {
    const harness = new GameHarness().start();

    harness.placeObstacleAtPlayer().tick(1);

    expect(harness.getState().status).toBe("gameOver");
  });

  it("resets score and status after restart", () => {
    const harness = new GameHarness().start().tick(120);

    expect(harness.getState().score).toBeGreaterThan(0);

    harness.restart();

    expect(harness.getState().status).toBe("running");
    expect(harness.getState().score).toBe(0);
  });
});
