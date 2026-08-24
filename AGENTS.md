# AGENTS.md

## Project Role
This repository is a game QA automation portfolio project.
The main subject is `QA_Automation`.
The game is a runner used as a controllable automation target.
The project demonstrates harness engineering.
Loop engineering lives inside the harness.

## Reading Order
1. Read `README.md` for the project summary.
2. Read `docs/harness-engineering.md` for the automation strategy.
3. Read `docs/test-classification.md` for test group planning.
4. Read `docs/test-plan.md` for the current scope.
5. Read `docs/test-cases.md` before changing test cases.
6. Read `docs/risk-analysis.md` before changing risky behavior.
7. Read `docs/code-convention.md` before editing code.
8. Read `docs/commit-convention.md` before committing.

## Repository Map
- `index.html`: browser entry point.
- `src/gameEngine.js`: deterministic game rules.
- `src/renderer.js`: canvas rendering.
- `src/input.js`: keyboard and button input binding.
- `src/main.js`: browser composition and QA API exposure.
- `tests/harness/gameHarness.js`: engine control harness.
- `tests/unit/gameEngine.test.js`: harness-level loop tests.
- `tests/e2e/runner.spec.js`: browser-level Playwright tests.
- `docs/`: detailed QA and project knowledge.

## Architecture Rules
Keep game logic separate from rendering.
The engine must be testable without a browser.
The renderer must not own game rules.
The input layer translates user actions into engine commands.
The harness controls and observes the engine from tests.

## Harness Engineering Rules
Harness engineering is the top-level automation structure.
The harness should expose readable QA-intent methods.
The harness controls start, jump, restart, obstacles, and state.
The harness should make randomness deterministic for stable tests.
The harness should avoid real-time waiting when frame stepping is enough.
Detailed strategy lives in `docs/harness-engineering.md`.

## Loop Engineering Rules
Loop engineering is implemented inside the harness.
Loop tests should advance the game by frames or seconds.
Loop tests should observe state transitions across simulated time.
Loop tests should verify repeated update behavior.
Loop tests should prefer deterministic frame stepping over arbitrary sleeps.
Detailed loop planning lives in `docs/test-classification.md`.

## Test Design Rules
Classify tests before adding many individual cases.
Map each test group to an ISTQB technique when useful.
Prioritize tests by product risk.
Keep fast harness tests separate from slower browser E2E tests.
Use browser E2E only for DOM, input binding, or integration checks.

## Current Test Priorities
Priority 1: initialization and state management.
Priority 1: input and player behavior.
Priority 1: game loop progression.
Priority 1: collision and game over.
Priority 2: scoring and best record.
Priority 2: obstacle spawn and movement.
Priority 2: regression flows.
Priority 3: browser E2E expansion.
Priority 3: long-running stability checks.

## Code Style
Use double quotes for strings.
Use semicolons at statement endings.
Use camelCase for variables and functions.
Use UpperCamelCase for classes.
Write one statement per line.
Add spaces around operators.
Add a space after commas.
Indent comments with the code they explain.

## Naming Rules
Use clear domain names.
Good names include `GameEngine`, `GameHarness`, `player`, and `obstacle`.
Avoid vague names such as `Data`, `Manager`, and `Info`.
Avoid unnecessary abbreviations.
Keep names specific enough to explain intent.

## Commit Rules
Follow `docs/commit-convention.md`.
Use the format `Type: 한글 제목`.
Separate title and body with one blank line.
Explain what changed and why in the body.
Keep one conceptual change per commit.

## Validation Rules
Run a focused smoke test after engine changes.
Run unit tests after harness or loop changes.
Run E2E tests after browser integration changes.
Document any test that cannot be run.

## Documentation Rules
Keep this file short and map-like.
Put detailed explanations in `docs/`.
Update docs when the test strategy changes.
Do not let implementation and documentation drift apart.
