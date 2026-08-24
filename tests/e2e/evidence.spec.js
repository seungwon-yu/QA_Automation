import { test, expect } from "./evidenceTest.js";

test.describe("Playwright evidence collector", () => {
  test("실패 시 screenshot, console log, QA state를 저장한다", async ({ page, qaEvidence }, testInfo) => {
    await page.goto("/");
    await page.evaluate(() => console.log("QA_EVIDENCE_SAMPLE_LOG"));

    expect(qaEvidence.consoleMessages.some((message) => message.text === "QA_EVIDENCE_SAMPLE_LOG")).toBe(true);

    testInfo.annotations.push({
      type: "expected-failure-sample",
      description: "증거 저장 검증을 위한 의도된 실패 샘플"
    });

    expect(false).toBe(true);
  });
});
