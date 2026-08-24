# Harness Engineering Strategy

## Purpose

This project uses harness engineering as the main automation structure.

The harness exists so tests can control the game without depending only on manual play or visual observation. It gives automated tests a stable way to start the game, inject inputs, advance time, place obstacles, and inspect game state.

## Relationship Between Harness And Loop Engineering

Harness engineering is the outer structure.

Loop engineering is placed inside the harness.

```text
Harness Engineering
└─ Loop Engineering
   ├─ Frame stepping
   ├─ Time simulation
   ├─ State observation
   ├─ Input injection
   └─ Repeated behavior verification
```

In this project, `tests/harness/gameHarness.js` controls `src/gameEngine.js`. The harness can run the game loop by calling engine ticks directly. This lets tests verify behavior across many frames without waiting for the browser animation loop.

## Harness Responsibilities

- Create an isolated `GameEngine` instance.
- Make random behavior deterministic when needed.
- Start, restart, and control the game.
- Inject player inputs such as jump.
- Place obstacles in controlled positions.
- Advance the game loop by frames or seconds.
- Return current state for assertions.
- Record state timelines when loop behavior needs deeper analysis.

## Loop Engineering Responsibilities

- Advance the game by a fixed number of frames.
- Simulate seconds by converting time into frame ticks.
- Continue running until a target condition is met.
- Stop when a maximum frame count is reached.
- Compare state before, during, and after loop execution.
- Detect unintended changes after game over or restart.

## Why This Matters For Game QA

Game defects often appear over time instead of at a single input moment. Jump arcs, collision timing, score progression, speed increases, obstacle cleanup, and game-over behavior all depend on repeated loop updates.

Manual testing can observe these behaviors, but it is slow and hard to reproduce exactly. A harness with loop engineering makes these checks repeatable, deterministic, and suitable for regression testing.

## ISTQB Mapping

| Harness Activity | ISTQB Connection |
| --- | --- |
| Controlled input injection | Test implementation and execution |
| Deterministic random values | Test data control |
| Frame-based loop execution | Test procedure and repeatability |
| State inspection | Test result evaluation |
| Collision and restart checks | State transition testing |
| Repeated game flow checks | Regression testing |
| Risk-focused scenario selection | Risk-based testing |

## Current Harness API

| Method | Purpose |
| --- | --- |
| `start()` | Start the game from ready state. |
| `pressJump()` | Inject a jump command. |
| `restart()` | Reset and start the game again. |
| `tick(frames, fps)` | Advance the game loop by frame count. |
| `placeObstacleAtPlayer()` | Force a collision scenario. |
| `getState()` | Return current game state. |

## Planned Harness API

| Method | Purpose |
| --- | --- |
| `runForFrames(frames)` | Advance a fixed number of frames. |
| `runForSeconds(seconds, fps)` | Advance simulated time. |
| `runUntil(condition, maxFrames)` | Loop until a state condition is met. |
| `placeObstacleAhead(distance)` | Place an obstacle at a controlled distance. |
| `getTimeline()` | Return recorded frame snapshots. |
| `clearTimeline()` | Reset recorded loop history. |

## Design Principle

The harness should express test intent clearly.

Prefer this:

```js
harness.start().pressJump().runForSeconds(1);
```

Over this:

```js
for (let i = 0; i < 60; i += 1) {
  engine.tick(1 / 60);
}
```

The second example is still useful internally, but tests should read like QA scenarios.
