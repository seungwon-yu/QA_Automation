import { CLASSIFICATION, RESULT } from "./failureTypes.js";

const ENV_PATTERNS = [
  "Executable doesn't exist",
  "Failed to connect",
  "Could not connect",
  "ECONNREFUSED",
  "browserType.launch",
  "Cannot find module",
  "command not found",
  "not recognized as"
];

const TEST_PATTERNS = [
  "strict mode violation",
  "Playwright Test did not expect test() to be called here",
  "SyntaxError",
  "ReferenceError",
  "TypeError",
  "locator.click"
];

const PRODUCT_PATTERNS = [
  "Expected game state",
  "Expected collision",
  "Expected score",
  "PRODUCT_ASSERTION"
];

export class FailureClassifier {
  classify(context) {
    if (context.exitCode === 0) {
      return {
        result: RESULT.PASS,
        classification: null,
        observations: ["테스트 명령이 성공 종료됨"],
        reason: "실패 분류가 필요하지 않음"
      };
    }

    const output = `${context.stdout ?? ""}\n${context.stderr ?? ""}`;

    if (matchesAny(output, ENV_PATTERNS)) {
      return buildFail(CLASSIFICATION.ENV_FAIL, "실행 환경 오류 패턴이 발견됨", output, ENV_PATTERNS);
    }

    if (matchesAny(output, TEST_PATTERNS)) {
      return buildFail(CLASSIFICATION.TEST_FAIL, "테스트 코드 또는 테스트 도구 사용 오류 패턴이 발견됨", output, TEST_PATTERNS);
    }

    if (matchesAny(output, PRODUCT_PATTERNS)) {
      return buildFail(CLASSIFICATION.PRODUCT_FAIL, "제품 기대 동작 불일치 패턴이 발견됨", output, PRODUCT_PATTERNS);
    }

    return {
      result: RESULT.FAIL,
      classification: CLASSIFICATION.REVIEW_REQUIRED,
      observations: ["실패는 발생했지만 제품, 테스트, 환경 오류로 단정할 근거가 부족함"],
      reason: "추가 증거 또는 사람의 리뷰가 필요함"
    };
  }
}

function buildFail(classification, reason, output, patterns) {
  return {
    result: RESULT.FAIL,
    classification,
    observations: patterns.filter((pattern) => output.includes(pattern)),
    reason
  };
}

function matchesAny(output, patterns) {
  return patterns.some((pattern) => output.includes(pattern));
}
