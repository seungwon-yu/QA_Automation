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

    const output = `${context.stdout ?? ""}\n${context.stderr ?? ""}\n${extractEvidenceText(context.evidence)}`;

    if (matchesAny(output, ENV_PATTERNS)) {
      return buildFail(CLASSIFICATION.ENV_FAIL, "실행 환경 오류 패턴이 발견됨", output, ENV_PATTERNS);
    }

    if (matchesAny(output, TEST_PATTERNS)) {
      return buildFail(CLASSIFICATION.TEST_FAIL, "테스트 코드 또는 테스트 도구 사용 오류 패턴이 발견됨", output, TEST_PATTERNS);
    }

    if (matchesAny(output, PRODUCT_PATTERNS)) {
      return buildFail(CLASSIFICATION.PRODUCT_FAIL, "제품 기대 동작 불일치 패턴이 발견됨", output, PRODUCT_PATTERNS);
    }

    const metadataResult = classifyByMetadata(context.evidence);
    if (metadataResult) {
      return metadataResult;
    }

    if (context.evidence?.testInfo?.status === "failed") {
      return {
        result: RESULT.FAIL,
        classification: CLASSIFICATION.REVIEW_REQUIRED,
        observations: [
          "Playwright 실패 evidence가 있지만 제품, 테스트, 환경 오류로 단정할 패턴이 부족함",
          `evidenceDir=${context.evidence.evidenceDir}`
        ],
        reason: "저장된 screenshot, console log, state를 사람 또는 상위 Agent가 검토해야 함"
      };
    }

    return {
      result: RESULT.FAIL,
      classification: CLASSIFICATION.REVIEW_REQUIRED,
      observations: ["실패는 발생했지만 제품, 테스트, 환경 오류로 단정할 근거가 부족함"],
      reason: "추가 증거 또는 사람의 리뷰가 필요함"
    };
  }
}

function extractEvidenceText(evidence) {
  if (!evidence) {
    return "";
  }

  const consoleText = Array.isArray(evidence.consoleLog)
    ? evidence.consoleLog.map((message) => message.text).join("\n")
    : "";
  const stateText = evidence.state?.available
    ? JSON.stringify(evidence.state.value)
    : JSON.stringify(evidence.state ?? {});
  const testInfoText = JSON.stringify(evidence.testInfo ?? {});
  const metadataText = JSON.stringify(evidence.metadata ?? {});
  const assertionErrorText = JSON.stringify(evidence.assertionError ?? {});

  return `${consoleText}\n${stateText}\n${testInfoText}\n${metadataText}\n${assertionErrorText}`;
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

function classifyByMetadata(evidence) {
  const metadata = evidence?.metadata;

  if (!metadata || metadata.available === false) {
    return null;
  }

  const basis = Array.isArray(metadata.classificationBasis)
    ? metadata.classificationBasis
    : [];
  const productBasis = basis.filter((item) => item.supports === CLASSIFICATION.PRODUCT_FAIL);
  const testBasis = basis.filter((item) => item.supports === CLASSIFICATION.TEST_FAIL);

  if (productBasis.length > 0) {
    return {
      result: RESULT.FAIL,
      classification: CLASSIFICATION.PRODUCT_FAIL,
      observations: buildMetadataObservations(metadata, productBasis),
      reason: "metadata의 expected/actual과 대분류별 판단 근거가 제품 기대 동작 불일치를 지지함"
    };
  }

  if (testBasis.length > 0) {
    return {
      result: RESULT.FAIL,
      classification: CLASSIFICATION.TEST_FAIL,
      observations: buildMetadataObservations(metadata, testBasis),
      reason: "metadata의 대분류별 판단 근거가 테스트 코드 또는 테스트 도구 사용 문제를 지지함"
    };
  }

  const reviewBasis = basis.filter((item) => item.supports === CLASSIFICATION.REVIEW_REQUIRED);

  if (reviewBasis.length > 0) {
    return {
      result: RESULT.FAIL,
      classification: CLASSIFICATION.REVIEW_REQUIRED,
      observations: buildMetadataObservations(metadata, reviewBasis),
      reason: "metadata가 제품, 테스트, 환경 실패로 단정하지 말아야 할 근거를 제공함"
    };
  }

  return null;
}

function buildMetadataObservations(metadata, basis) {
  const observations = [
    `testCaseId=${metadata.testCaseId ?? "UNKNOWN"}`,
    `testGroupId=${metadata.testGroupId ?? "UNKNOWN"}`
  ];

  for (const item of basis) {
    observations.push(`${item.basisType ?? "basis"}: ${item.reason ?? "판단 근거 설명 없음"}`);
  }

  return observations;
}
