export function summarizeVerification(unit, e2e) {
  const validUnit = unit && Number.isInteger(unit.numPassedTests) && Number.isInteger(unit.numFailedTests);
  const validE2e = e2e?.stats && Number.isInteger(e2e.stats.expected) && Number.isInteger(e2e.stats.unexpected);
  const unitState = !validUnit ? "NOT_RUN_OR_INVALID" : unit.numFailedTests || unit.success === false
    ? "failure" : unit.numPendingTests || unit.numPassedTests === 0 ? "incomplete" : "success";
  const e2eState = !validE2e ? "NOT_RUN_OR_INVALID" : e2e.stats.unexpected || e2e.errors?.length
    ? "failure" : e2e.stats.skipped || e2e.stats.flaky || e2e.stats.expected === 0 ? "incomplete" : "success";
  return [
    ["Unit", unitState, validUnit ? unit.numPassedTests : "미확인", validUnit ? unit.numFailedTests : "미확인"],
    ["E2E", e2eState, validE2e ? e2e.stats.expected : "미확인", validE2e ? e2e.stats.unexpected : "미확인"]
  ];
}
