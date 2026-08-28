export class RetryEvidenceComparator {
  compare(attempts) {
    if (!Array.isArray(attempts) || attempts.length === 0) {
      return {
        totalAttempts: 0,
        comparedAttempts: 0,
        consistentFailure: false,
        consistentClassification: false,
        reproducibility: "NO_ATTEMPTS",
        summary: "비교할 attempt가 없음",
        comparedFields: []
      };
    }

    const failedAttempts = attempts.filter((attempt) => attempt.result === "FAIL");
    const fingerprints = failedAttempts.map((attempt) => createFailureFingerprint(attempt));
    const firstFingerprint = fingerprints[0] ?? null;
    const consistentFailure = fingerprints.length > 0
      && fingerprints.every((fingerprint) => fingerprint === firstFingerprint);
    const classifications = failedAttempts.map((attempt) => attempt.classification);
    const consistentClassification = classifications.length > 0
      && classifications.every((classification) => classification === classifications[0]);

    return {
      totalAttempts: attempts.length,
      comparedAttempts: failedAttempts.length,
      consistentFailure,
      consistentClassification,
      reproducibility: createReproducibility({
        failedAttempts,
        attempts,
        consistentFailure
      }),
      summary: createSummary({
        failedAttempts,
        attempts,
        consistentFailure,
        consistentClassification
      }),
      comparedFields: [
        "result",
        "classification",
        "observations",
        "failureSummary.expectedResult",
        "failureSummary.actualResult",
        "failureSummary.failedBecause"
      ]
    };
  }
}

function createFailureFingerprint(attempt) {
  return JSON.stringify({
    result: attempt.result ?? null,
    classification: attempt.classification ?? null,
    observations: attempt.observations ?? [],
    expectedResult: attempt.failureSummary?.expectedResult ?? null,
    actualResult: attempt.failureSummary?.actualResult ?? null,
    failedBecause: attempt.failureSummary?.failedBecause ?? null
  });
}

function createReproducibility({ failedAttempts, attempts, consistentFailure }) {
  if (failedAttempts.length === 0) {
    return "NO_FAILURE";
  }

  if (consistentFailure) {
    return `REPRODUCED_${failedAttempts.length}_OF_${attempts.length}`;
  }

  return `VARIED_${failedAttempts.length}_OF_${attempts.length}`;
}

function createSummary({ failedAttempts, attempts, consistentFailure, consistentClassification }) {
  if (failedAttempts.length === 0) {
    return "실패 attempt가 없어 재현성 비교가 필요하지 않음";
  }

  if (consistentFailure && consistentClassification) {
    return `동일 조건에서 ${attempts.length}회 중 ${failedAttempts.length}회 동일 실패가 반복됨`;
  }

  if (!consistentClassification) {
    return "attempt별 실패 분류가 서로 달라 추가 검토가 필요함";
  }

  return "attempt별 실패 양상이 서로 달라 flaky 가능성 또는 추가 검토가 필요함";
}
