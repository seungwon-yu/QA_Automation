import { defineConfig } from "@playwright/test";

const evidenceRun = process.argv.some((argument) => /[Ee]vidence\.spec\.js$/.test(argument));

export default defineConfig({
  testDir: "./tests/e2e",
  reporter: [["list"], ["json", { outputFile: evidenceRun ? "artifacts/results/experiments-e2e.json" : "artifacts/results/e2e.json" }], ["html", { open: "never", outputFolder: evidenceRun ? "artifacts/experiment-report" : "playwright-report" }]],
  use: {
    trace: "retain-on-failure",
    baseURL: "http://127.0.0.1:4173"
  },
  webServer: {
    command: "node tests/e2e/server.js",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false
  }
});
