import { readFile, mkdir, writeFile } from "node:fs/promises";
import { summarizeVerification } from "../tests/agent/verificationSummary.js";

async function load(file) {
  try { return JSON.parse(await readFile(file, "utf8")); } catch { return null; }
}
const unit = await load("artifacts/results/unit.json");
const e2e = await load("artifacts/results/e2e.json");
const rows = summarizeVerification(unit, e2e);
for (const [index, outcome] of [process.env.QA_UNIT_OUTCOME, process.env.QA_E2E_OUTCOME].entries()) {
  if (outcome && outcome !== "success") {
    rows[index][1] = outcome;
  }
}
const report = ["# 게임 QA 실행 요약", "", `생성 시각: ${new Date().toISOString()}`, "", "| 계층 | 실행 상태 | 통과 | 실패 |", "| --- | --- | --- | --- |", ...rows.map((row) => `| ${row.join(" | ")} |`), "", `E2E flaky: ${e2e?.stats?.flaky ?? "미확인"}, skipped: ${e2e?.stats?.skipped ?? "미확인"}`, "", "NOT_RUN/미확인은 통과가 아니다. 원본 결과와 artifacts/playwright-evidence의 screenshot·metadata·capture-status를 함께 검토한다.", "의도 실패 실험은 정상 E2E 실행과 분리하며, 이 요약은 자동 원인 확정을 수행하지 않는다."];
await mkdir("artifacts/reports", { recursive: true });
await writeFile("artifacts/reports/verification-summary.md", report.join("\n") + "\n", "utf8");
console.log(report.join("\n"));
