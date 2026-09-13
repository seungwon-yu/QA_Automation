import { test, expect } from "./evidenceTest.js";

test("EVID-001 페이지 종료 후에도 로그를 보존한다", async ({ page, qaEvidence }) => {
  await page.goto("/");
  qaEvidence.setMetadata({ testCaseId: "EVID-001", expected: { value: true }, actual: { value: false }, notes: ["캡처 불가 경로를 검증하는 의도 실패"] });
  await page.close();
  expect(false).toBe(true);
});
