# QA_Automation Harness Runner Test Plan

## Test Objective

Verify that the runner game core loop behaves correctly and can be controlled by an automation harness.

## Test Basis

- Game rules in `src/gameEngine.js`
- Browser behavior in `index.html` and `src/main.js`
- QA harness API exposed as `window.__QA_AUTOMATION__`

## Scope

- Initial state
- Start and restart
- Jump state transition
- Obstacle spawning and collision
- Score progression
- Browser control through Playwright

## Entry Criteria

- Game loads in a browser
- Canvas and control buttons are visible
- Game engine can expose state through `getState()`

## Exit Criteria

- Core harness tests pass
- E2E start and jump flow passes
- Any observed defect has a reproducible report
