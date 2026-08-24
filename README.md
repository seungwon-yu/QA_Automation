# QA_Automation

Runner game project built for a game QA automation portfolio.

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

## Test Commands

```bash
npm test
npm run test:e2e
```
