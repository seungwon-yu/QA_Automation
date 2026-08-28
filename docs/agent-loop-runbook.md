# Agent Loop 실행 Runbook

## 목적

이 문서는 QA Agent Loop를 실제로 어떻게 실행하고, 실행 결과를 어떻게 해석하는지 정리한다.

Agent Loop는 테스트 명령을 실행한 뒤 결과를 다음 순서로 처리한다.

```text
Test Command
 ↓
PASS / FAIL
 ↓
Evidence 저장
 ↓
Failure Classification
 ↓
Decision
 ↓
Retry Evidence Comparison
 ↓
Decision Log
```

## 실행 전 원칙

- 제품 코드를 수정하지 않는다.
- Expected Result와 assertion을 실패 회피 목적으로 변경하지 않는다.
- 동일 조건 재시도는 최대 3회까지만 허용한다.
- `TEST_FAIL`과 `REVIEW_REQUIRED`는 기본적으로 재시도하지 않는다.
- `PRODUCT_FAIL`과 `ENV_FAIL`은 재현성 확인을 위해 재시도할 수 있다.
- 원인이 불명확하면 제품 버그로 단정하지 않고 `REVIEW_REQUIRED`로 종료한다.

## 기본 실행 명령

```bash
npm run test:agent -- npm test
```

이 명령은 단위 테스트 전체를 Agent Loop로 감싼다.

기대 결과:

```text
finalResult: PASS
finalClassification: null
finalDecision: STOP
reproducibility: NO_FAILURE
```

해석:

- 테스트가 통과했으므로 evidence 수집과 실패 분류가 필요하지 않다.
- Agent Loop는 재시도하지 않고 종료한다.

## TEST_FAIL 확인

```bash
npm run test:agent -- node tests/agent/fixtures/testFailCommand.js
```

기대 결과:

```text
finalResult: FAIL
finalClassification: TEST_FAIL
finalDecision: STOP
nextAction: 테스트 코드 리뷰
```

해석:

- 실패 원인이 제품 동작이 아니라 테스트 코드 또는 테스트 도구 사용 문제로 분류된다.
- 예시는 Playwright locator strict mode violation이다.
- 재실행해도 제품 상태가 바뀌는 문제가 아니므로 즉시 `STOP`한다.

## PRODUCT_FAIL 확인

```bash
npm run test:agent -- node tests/agent/fixtures/productFailCommand.js
```

기대 결과:

```text
finalResult: FAIL
finalClassification: PRODUCT_FAIL
finalDecision: STOP
reproducibility: REPRODUCED_3_OF_3
```

대표 요약:

```json
{
  "totalAttempts": 3,
  "comparedAttempts": 3,
  "consistentFailure": true,
  "consistentClassification": true,
  "reproducibility": "REPRODUCED_3_OF_3",
  "summary": "동일 조건에서 3회 중 3회 동일 실패가 반복됨"
}
```

해석:

- 1회차와 2회차는 `RETRY`한다.
- 3회차에서 최대 재시도 횟수에 도달해 `STOP`한다.
- 동일 실패가 3회 반복되면 재현성 있는 실패로 볼 수 있다.

## ENV_FAIL 확인

```bash
npm run test:agent -- node tests/agent/fixtures/envFailCommand.js
```

기대 결과:

```text
finalResult: FAIL
finalClassification: ENV_FAIL
finalDecision: STOP
reproducibility: REPRODUCED_3_OF_3
```

해석:

- 브라우저 실행 파일 없음, 서버 연결 실패 같은 실행 환경 문제가 감지된다.
- 일시적인 환경 문제일 가능성이 있으므로 최대 3회까지 재시도한다.
- 3회 모두 같은 환경 실패가 반복되면 환경 점검이 필요하다.

## REVIEW_REQUIRED 확인

```bash
npm run test:agent -- node tests/agent/fixtures/reviewRequiredCommand.js
```

기대 결과:

```text
finalResult: FAIL
finalClassification: REVIEW_REQUIRED
finalDecision: REVIEW
nextAction: REVIEW_REQUIRED로 종료하고 증거를 검토
```

해석:

- 실패는 발생했지만 제품, 테스트, 환경 중 하나로 단정할 근거가 부족하다.
- 이 상태에서는 자동 재시도보다 사람이 evidence를 검토해야 한다.

## 브라우저 Evidence 분석

브라우저 의도 실패 샘플을 먼저 실행한다.

```bash
npm run test:e2e:product-fail-evidence
```

그 다음 최신 Playwright evidence를 분석한다.

```bash
npm run test:agent:evidence
```

기대 결과 예시:

```text
classification: PRODUCT_FAIL
decision: RETRY
failureSummary.expectedResult: status=gameOver, collision=true
failureSummary.actualResult: status=running, collision=true
```

해석:

- 브라우저 실패 evidence의 `metadata.json`, `timeline.json`, `assertion-error.json`을 읽는다.
- 사람이 보는 요약은 `failureSummary`를 기준으로 한다.
- 코드 위치는 내부 evidence에만 보존하고, 요약에서는 평가 기준과 기대결과/실제결과를 우선한다.

## 산출물 위치

Agent Loop 실행 결과:

```text
artifacts/agent/decision-log.jsonl
artifacts/agent/last-summary.json
```

명령 기반 실패 evidence:

```text
artifacts/evidence/
```

브라우저 실패 evidence:

```text
artifacts/playwright-evidence/
```

## 판단 기준 요약

| 분류 | 재시도 | 최종 행동 |
| --- | --- | --- |
| `PASS` | 없음 | `STOP` |
| `PRODUCT_FAIL` | 최대 3회 | 재현성 확인 후 `STOP` |
| `ENV_FAIL` | 최대 3회 | 환경 문제 반복 확인 후 `STOP` |
| `TEST_FAIL` | 없음 | 테스트 코드 리뷰 |
| `REVIEW_REQUIRED` | 없음 | 사람이 evidence 검토 |
