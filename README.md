# QA_Automation

Automation test portfolio project built around a runner game and game QA harness.

The project separates game logic from rendering so automated tests can control the game loop through a harness.

## Run Locally

Open `index.html` directly in a browser, or run:

```bash
npm install
npm run serve
```

Then visit `http://127.0.0.1:4173`.

## Automation Focus

- `src/gameEngine.js`: deterministic game rules
- `tests/harness/gameHarness.js`: loop and state-control harness
- `tests/unit/gameEngine.test.js`: unit-level harness tests
- `tests/e2e/runner.spec.js`: browser-level Playwright test

## Project Docs

- `AGENTS.md`: project map for future agents and contributors
- `docs/harness-engineering.md`: harness and loop engineering strategy
- `docs/test-classification.md`: large test groups and Sprint 1 scope
- `docs/test-plan.md`: current test objective, scope, entry criteria, and exit criteria
- `docs/test-cases.md`: current detailed test cases
- `docs/risk-analysis.md`: product risks and test responses

## Test Commands

```bash
npm test
npm run test:e2e
```
