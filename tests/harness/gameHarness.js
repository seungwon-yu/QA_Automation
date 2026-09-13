import { GameEngine } from "../../src/gameEngine.js";

export class GameHarness {
  constructor(options = {}) {
    this.engine = new GameEngine({
      rng: options.rng ?? (() => 0.5),
      width: options.width,
      height: options.height
    });
    this.defaultFps = options.fps ?? 60;
    this.timeline = [];
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

  tick(frames = 1, fps = this.defaultFps) {
    return this.runForFrames(frames, fps);
  }

  runForFrames(frames = 1, fps = this.defaultFps) {
    if (!Number.isInteger(frames) || frames < 0 || !Number.isFinite(fps) || fps <= 0) {
      throw new RangeError("frames는 0 이상의 정수, fps는 유한한 양수여야 한다.");
    }
    for (let i = 0; i < frames; i += 1) {
      this.engine.tick(1 / fps);
      this.recordFrame();
    }
    return this;
  }

  runForSeconds(seconds, fps = this.defaultFps) {
    const frames = Math.round(seconds * fps);
    return this.runForFrames(frames, fps);
  }

  runUntil(condition, maxFrames = 300, fps = this.defaultFps) {
    if (!Number.isInteger(maxFrames) || maxFrames < 0) {
      throw new RangeError("maxFrames는 0 이상의 정수여야 한다.");
    }
    for (let frame = 0; frame <= maxFrames; frame += 1) {
      if (condition(this.getState(), frame)) {
        return {
          matched: true,
          frames: frame,
          state: this.getState()
        };
      }

      if (frame < maxFrames) {
        this.runForFrames(1, fps);
      }
    }

    return {
      matched: false,
      frames: maxFrames,
      state: this.getState()
    };
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

  placeObstacleAhead(distance, size = {}) {
    const state = this.engine.getState();
    const width = size.width ?? 28;
    const height = size.height ?? 46;
    this.engine.forceObstacle({
      x: state.player.x + state.player.width + distance,
      y: state.groundY - height,
      width,
      height
    });
    return this;
  }

  placeObstacle(rect) {
    this.engine.forceObstacle(rect);
    return this;
  }

  spawnObstacle(x) {
    this.engine.spawnObstacle(x);
    return this;
  }

  getTimeline() {
    return this.timeline.map((entry) => ({
      frame: entry.frame,
      state: {
        ...entry.state,
        player: { ...entry.state.player },
        obstacles: entry.state.obstacles.map((obstacle) => ({ ...obstacle }))
      }
    }));
  }

  clearTimeline() {
    this.timeline = [];
    return this;
  }

  getState() {
    return this.engine.getState();
  }

  recordFrame() {
    this.timeline.push({
      frame: this.timeline.length + 1,
      state: this.getState()
    });
  }
}
