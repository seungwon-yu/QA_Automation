import { readdir, readFile, stat, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { FailureClassifier } from "../tests/agent/failureClassifier.js";
import { PlaywrightEvidenceReader } from "../tests/agent/playwrightEvidenceReader.js";

const expected = { "EVID-001": "REVIEW_REQUIRED", "EXP-001": "PRODUCT_FAIL", "TC-008-06": "TEST_FAIL", "TC-008-07": "ENV_FAIL" };
const base = "artifacts/playwright-evidence";
const run = JSON.parse(await readFile("artifacts/results/experiments-e2e.json", "utf8"));
const startedAt = Date.parse(run.stats.startTime);
const candidates = await Promise.all((await readdir(base, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map(async (entry) => {
  const directory = path.join(base, entry.name);
  return { directory, modified: (await stat(directory)).mtimeMs };
}));
candidates.sort((a, b) => b.modified - a.modified);
const rows = [];
for (const [testId, classification] of Object.entries(expected)) {
  let found = null;
  for (const candidate of candidates) {
    if (candidate.modified < startedAt) {
      continue;
    }
    const evidence = await new PlaywrightEvidenceReader().read(candidate.directory);
    if (evidence.metadata?.testCaseId === testId) {
      found = evidence;
      break;
    }
  }
  if (!found) {
    throw new Error(`이번 실험 증거 없음: ${testId}`);
  }
  const actual = new FailureClassifier().classify({ exitCode: 1, evidence: found });
  const capture = JSON.parse(await readFile(path.join(found.evidenceDir, "capture-status.json"), "utf8"));
  if (actual.classification !== classification || (testId === "EVID-001" && capture.screenshotAvailable !== false)) {
    throw new Error(`${testId}: 분류 또는 캡처 불가 기록 불일치: ${JSON.stringify(actual)}`);
  }
  for (const file of ["metadata.json", "console-log.json", "state.json", "test-info.json", "assertion-error.json"]) {
    JSON.parse(await readFile(path.join(found.evidenceDir, file), "utf8"));
  }
  rows.push({ testId, expected: classification, actual: actual.classification, capture, evidenceDir: found.evidenceDir });
}
await mkdir("artifacts/results", { recursive: true });
await writeFile("artifacts/results/experiments.json", JSON.stringify({ createdAt: new Date().toISOString(), scope: "의도 실패 증거·분류 검증, 실제 제품 결함 발견 아님", verified: rows }, null, 2));
console.log(JSON.stringify(rows, null, 2));
