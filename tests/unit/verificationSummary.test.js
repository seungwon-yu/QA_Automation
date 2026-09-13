import { expect, it } from "vitest";
import { summarizeVerification } from "../agent/verificationSummary.js";

it("REPORT-001 누락·비정상 보고서를 성공으로 표시하지 않는다", () => {
  expect(summarizeVerification(null, {})[1][1]).toBe("NOT_RUN_OR_INVALID");
});

it("REPORT-002 global setup 오류를 0개 실패로 숨기지 않는다", () => {
  const rows = summarizeVerification(null, { stats: { expected: 0, unexpected: 0 }, errors: [{ message: "setup failed" }] });
  expect(rows[1][1]).toBe("failure");
});

it("REPORT-003 skip과 재시도 회복 결과를 완전 통과로 표시하지 않는다", () => {
  expect(summarizeVerification(null, { stats: { expected: 3, unexpected: 0, skipped: 1 } })[1][1]).toBe("incomplete");
  expect(summarizeVerification(null, { stats: { expected: 3, unexpected: 0, flaky: 1 } })[1][1]).toBe("incomplete");
});

it("REPORT-004 정상 두 계층의 결과를 별도로 유지한다", () => {
  const rows = summarizeVerification({ numPassedTests: 10, numFailedTests: 0, success: true }, { stats: { expected: 4, unexpected: 0 } });
  expect(rows).toEqual([["Unit", "success", 10, 0], ["E2E", "success", 4, 0]]);
});
