import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export class MarkdownReportGenerator {
  constructor(options = {}) {
    this.summaryFile = options.summaryFile ?? "artifacts/agent/last-summary.json";
    this.outputFile = options.outputFile ?? "artifacts/reports/latest-summary.md";
  }

  async generate(options = {}) {
    const summaryFile = options.summaryFile ?? this.summaryFile;
    const outputFile = options.outputFile ?? this.outputFile;
    const summary = JSON.parse(await readFile(summaryFile, "utf8"));
    const markdown = createMarkdownReport(summary);

    await mkdir(path.dirname(outputFile), { recursive: true });
    await writeFile(outputFile, `${markdown}\n`, "utf8");

    return {
      outputFile,
      markdown
    };
  }
}

export function createMarkdownReport(summary) {
  const attempts = Array.isArray(summary.attempts) ? summary.attempts : [];
  const firstAttempt = attempts[0] ?? {};
  const latestAttempt = attempts.at(-1) ?? {};
  const failureSummary = latestAttempt.failureSummary ?? {};
  const retryEvidenceComparison = summary.retryEvidenceComparison ?? {};

  return [
    "# QA 자동화 요약 리포트",
    "",
    "## 실행 요약",
    "",
    "| 항목 | 내용 |",
    "| --- | --- |",
    `| 테스트 ID | ${formatValue(summary.testId ?? latestAttempt.testId)} |`,
    `| 명령 | ${formatValue(summary.command ?? latestAttempt.command)} |`,
    `| 최종 결과 | ${formatValue(summary.finalResult ?? latestAttempt.result)} |`,
    `| 최종 분류 | ${formatValue(summary.finalClassification ?? latestAttempt.classification)} |`,
    `| 최종 결정 | ${formatValue(summary.finalDecision ?? latestAttempt.decision)} |`,
    `| 실행 횟수 | ${formatValue(attempts.length)} |`,
    "",
    "## 실패 기준 요약",
    "",
    "| 항목 | 내용 |",
    "| --- | --- |",
    `| 평가 대상 | ${formatValue(failureSummary.evaluationTarget ?? firstAttempt.assertion?.name)} |`,
    `| PASS 기준 | ${formatValue(failureSummary.passCriteria)} |`,
    `| 기대결과 | ${formatValue(failureSummary.expectedResult ?? formatObject(firstAttempt.expected))} |`,
    `| 실제결과 | ${formatValue(failureSummary.actualResult ?? formatObject(firstAttempt.actual))} |`,
    `| 프레임워크 관찰값 | ${formatValue(failureSummary.frameworkObserved)} |`,
    `| 실패 사유 | ${formatValue(failureSummary.failedBecause)} |`,
    "",
    "## 판단 근거",
    "",
    "| 항목 | 내용 |",
    "| --- | --- |",
    `| 관찰 내용 | ${formatList(latestAttempt.observations)} |`,
    `| 다음 행동 | ${formatValue(latestAttempt.nextAction)} |`,
    `| 결정 이유 | ${formatValue(latestAttempt.reason)} |`,
    `| 재현성 | ${formatValue(retryEvidenceComparison.reproducibility)} |`,
    `| 재시도 비교 | ${formatValue(retryEvidenceComparison.summary)} |`,
    "",
    "## Attempt 기록",
    "",
    createAttemptTable(attempts),
    "",
    "## Evidence 경로",
    "",
    "| 항목 | 경로 |",
    "| --- | --- |",
    `| Evidence 디렉터리 | ${formatValue(latestAttempt.evidenceDir)} |`,
    `| Screenshot | ${formatValue(latestAttempt.screenshotPath)} |`
  ].join("\n");
}

function createAttemptTable(attempts) {
  if (attempts.length === 0) {
    return "기록된 attempt가 없습니다.";
  }

  return [
    "| Attempt | 결과 | 분류 | 결정 | Evidence |",
    "| --- | --- | --- | --- | --- |",
    ...attempts.map((attempt) => (
      `| ${formatValue(attempt.attempt)} | ${formatValue(attempt.result)} | ${formatValue(attempt.classification)} | ${formatValue(attempt.decision)} | ${formatValue(attempt.evidenceDir)} |`
    ))
  ].join("\n");
}

function formatList(value) {
  if (!Array.isArray(value) || value.length === 0) {
    return "-";
  }

  return value.map((entry) => String(entry)).join("<br>");
}

function formatObject(value) {
  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.entries(value)
    .map(([key, nextValue]) => `${key}=${String(nextValue)}`)
    .join(", ");
}

function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return escapeTableValue(String(value));
}

function escapeTableValue(value) {
  return value.replaceAll("|", "\\|").replaceAll("\n", "<br>");
}
