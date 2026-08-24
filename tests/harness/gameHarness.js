import { GameEngine } from "../../src/gameEngine.js";

export class GameHarness {
  constructor(options = {}) {
    this.engine = new GameEngine({
      rng: options.rng ?? (() => 0.5),
      width: options.width,
      height: options.height
    });
  }

  start() {
    this.engine.start();
    return this;
  }

  pressJump() {
    this.engine.jump();
    return this;
  }

  restart() {
    this.engine.restart();
    return this;
  }

  tick(frames = 1, fps = 60) {
    for (let i = 0; i < frames; i += 1) {
      this.engine.tick(1 / fps);
    }
    return this;
  }

  placeObstacleAtPlayer() {
    const state = this.engine.getState();
    this.engine.forceObstacle({
      x: state.player.x,
      y: state.player.y,
      width: state.player.width,
      height: state.player.height
    });
    return this;
  }

  getState() {
    return this.engine.getState();
  }
}
