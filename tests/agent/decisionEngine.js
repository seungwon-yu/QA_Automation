import { CLASSIFICATION, DECISION, RESULT } from "./failureTypes.js";

export class DecisionEngine {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries ?? 3;
  }

  decide(context) {
    if (context.result === RESULT.PASS) {
      return {
        decision: DECISION.STOP,
        reason: "테스트가 통과했으므로 재시도하지 않음",
        nextAction: "종료"
      };
    }

    if (context.classification === CLASSIFICATION.REVIEW_REQUIRED) {
      return {
        decision: DECISION.REVIEW,
        reason: "실패 원인을 단정할 근거가 부족함",
        nextAction: "REVIEW_REQUIRED로 종료하고 증거를 검토"
      };
    }

    if (context.classification === CLASSIFICATION.TEST_FAIL) {
      return {
        decision: DECISION.STOP,
        reason: "테스트 코드 또는 테스트 도구 사용 문제로 분류되어 제품 재실행으로 해결할 수 없음",
        nextAction: "테스트 코드 리뷰"
      };
    }

    if (context.attempt < this.maxRetries) {
      return {
        decision: DECISION.RETRY,
        reason: "동일 조건 재현성 확인을 위해 허용된 재시도 횟수 안에서 재실행",
        nextAction: "동일 명령 재실행"
      };
    }

    return {
      decision: DECISION.STOP,
      reason: "최대 재시도 횟수에 도달함",
      nextAction: `${context.classification}로 종료`
    };
  }
}
