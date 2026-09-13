import { CLASSIFICATION, RESULT } from "./failureTypes.js";

// 도구가 보고한 구체적 오류만 사용한다. 제품 console은 원인 계층을 증명하지 않는다.
const ENV_PATTERNS = ["Executable doesn't exist", "ECONNREFUSED", "ERR_CONNECTION_REFUSED", "Cannot find module", "command not found", "not recognized as"];
const TEST_PATTERNS = ["strict mode violation", "Playwright Test did not expect test() to be called here"];

export class FailureClassifier {
  classify(context) {
    if (context.exitCode === 0) {
      return { result: RESULT.PASS, classification: null, observations: ["테스트 명령이 성공 종료됨"], reason: "실패 분류가 필요하지 않음" };
    }
    const evidence = context.evidence ?? {};
    const metadata = evidence.metadata ?? {};
    const toolErrors = (evidence.assertionError?.errors ?? []).map((error) => error.message ?? "").join("\n");
    const output = `${context.stdout ?? ""}\n${context.stderr ?? ""}\n${toolErrors}`;
    const candidates = new Set();
    const observations = [];
    for (const [classification, patterns] of [[CLASSIFICATION.ENV_FAIL, ENV_PATTERNS], [CLASSIFICATION.TEST_FAIL, TEST_PATTERNS]]) {
      const matched = patterns.filter((pattern) => output.includes(pattern));
      if (matched.length) {
        candidates.add(classification);
        observations.push(...matched.map((pattern) => `tool: ${pattern}`));
      }
    }
    // 명시적인 fixture 계약이다. 일반 assertion 문구를 제품 원인으로 해석하지 않는다.
    if (output.includes("PRODUCT_ASSERTION:")) {
      candidates.add(CLASSIFICATION.PRODUCT_FAIL);
      observations.push("fixture: PRODUCT_ASSERTION (합성 분류 검증 계약)");
    }
    const basis = Array.isArray(metadata.classificationBasis) ? metadata.classificationBasis : [];
    const supported = Object.values(CLASSIFICATION);
    for (const item of basis) {
      if (!supported.includes(item.supports) || !item.reason) {
        candidates.add(CLASSIFICATION.REVIEW_REQUIRED);
        continue;
      }
      const hasValues = metadata.expected != null && metadata.actual != null;
      const differs = JSON.stringify(metadata.expected) !== JSON.stringify(metadata.actual);
      if (item.supports === CLASSIFICATION.PRODUCT_FAIL && (!hasValues || !differs)) {
        candidates.add(CLASSIFICATION.REVIEW_REQUIRED);
        observations.push("제품 후보의 기대/실제 관찰값이 없거나 차이가 없음");
      } else {
        candidates.add(item.supports);
        observations.push(`${item.basisType ?? "basis"}: ${item.reason}`);
      }
    }
    if (metadata.testCaseId) {
      observations.push(`testCaseId=${metadata.testCaseId}`);
      observations.push(`testGroupId=${metadata.testGroupId ?? "UNKNOWN"}`);
    }
    const classification = candidates.size === 1 ? [...candidates][0] : CLASSIFICATION.REVIEW_REQUIRED;
    return {
      result: RESULT.FAIL,
      classification,
      observations: observations.length ? observations : ["실패 원인을 구분할 명시적인 근거가 부족함"],
      reason: classification === CLASSIFICATION.REVIEW_REQUIRED
        ? "근거가 부족하거나 충돌하여 오류 위치, 사전조건, 기대/실제 결과를 검토해야 함"
        : "도구 오류 또는 테스트 작성자가 제공한 구조화 근거에 따른 규칙 기반 후보 분류; 독립적인 원인 확정은 아님"
    };
  }
}
