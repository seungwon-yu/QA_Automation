# QA Agent Loop 설계

## 목적

Sprint 2의 목표는 테스트 실패가 발생했을 때 무조건 제품 결함으로 단정하지 않고, 하네스 가드레일 안에서 증거 수집, 실패 분류, 다음 행동 결정을 수행하는 실패 처리 파이프라인을 구축하는 것이다.

Sprint 1은 테스트를 신뢰성 있게 실행할 수 있는 기반을 만들었다.

Sprint 2는 실패를 신뢰성 있게 다루는 기반을 만든다.

## Sprint 1과 Sprint 2의 구분

```text
Sprint 1
"테스트를 신뢰성 있게 실행할 수 있는가?"

Game
 ↓
GameHarness
 ↓
Unit Test / E2E
 ↓
PASS / FAIL
```

```text
Sprint 2
"실패가 발생했을 때 어떻게 처리할 것인가?"

FAIL
 ↓
Evidence
 ↓
Classification
 ↓
Decision
 ↓
Retry / Stop / Review
 ↓
Decision Log
```

현재 프로젝트의 루프 상태는 `Loop Engineering 완료`가 아니라 `Loop 실행 기반 구축 완료`로 표현한다. `runForFrames`, `runForSeconds`, `runUntil`은 게임 루프를 결정론적으로 실행하는 기반이며, Agent Loop는 Sprint 2에서 별도로 구축한다.

## 실패 처리 파이프라인

```text
Test Execution
      │
┌─────▼─────┐
│   PASS?   │
└─────┬─────┘
      │ FAIL
      ▼
┌───────────────────┐
│ EvidenceCollector │
└─────────┬─────────┘
          ▼
  screenshot / log / state / metadata / timeline
          ▼
┌───────────────────┐
│ FailureClassifier │
└─────────┬─────────┘
          ▼
 PRODUCT_FAIL / TEST_FAIL / ENV_FAIL / REVIEW_REQUIRED
          ▼
┌───────────────────┐
│  DecisionEngine   │
└─────────┬─────────┘
          ▼
 RETRY / STOP / REVIEW
          │
    RETRY └──────────↺

모든 판단은 DecisionLog에 기록한다.
```

## 책임 분리

### Deterministic 영역

이 영역은 AI 판단에 맡기지 않는다.

- 테스트 실행
- assertion 판정
- 상태 수집
- screenshot, log, state 저장
- 최대 재시도 횟수 제한
- PASS/FAIL 원본 결과 보존

### Agent 영역

이 영역은 수집된 증거 안에서만 판단한다.

- 실패 증거 요약
- 실패 유형 분류 보조
- 재시도, 중단, 리뷰 요청 판단 보조
- Decision Log의 판단 사유 작성

Agent는 제품 코드, 요구사항, 기대결과, assertion을 변경할 수 없다.

## 실패 분류

| 분류 | 의미 | 예시 |
| --- | --- | --- |
| `PRODUCT_FAIL` | 제품 동작이 기대결과를 만족하지 못한 것으로 판단할 근거가 충분한 경우 | 충돌이 발생했지만 게임 상태가 `running`으로 유지됨 |
| `TEST_FAIL` | 테스트 코드, locator, fixture, 하네스 사용 방식의 문제 | Playwright locator strict mode violation |
| `ENV_FAIL` | 실행 환경 문제 | 브라우저 실행 파일 없음, 로컬 서버 연결 실패 |
| `REVIEW_REQUIRED` | 근거가 부족해 단정할 수 없음 | assertion 실패는 있으나 state와 log가 부족함 |

## 결정 유형

| 결정 | 의미 |
| --- | --- |
| `RETRY` | 동일 조건으로 재시도한다. 최대 3회까지만 허용한다. |
| `STOP` | 재시도하지 않고 종료한다. |
| `REVIEW` | 사람이 검토해야 하므로 `REVIEW_REQUIRED`로 종료한다. |

## Decision Log 예시

```json
{
  "testId": "TC-COLLISION-003",
  "attempt": 2,
  "result": "FAIL",
  "classification": "PRODUCT_FAIL",
  "observations": [
    "collision=true",
    "gameState=running"
  ],
  "decision": "RETRY",
  "reason": "제품 실패 가능성이 있으나 동일 조건 재현 확인이 필요함",
  "nextAction": "동일 초기 상태로 테스트를 재실행한다"
}
```

## Sprint 2 구현 범위

### 이번 단계에서 구현할 것

- `EvidenceCollector`
- `FailureClassifier`
- `DecisionEngine`
- `DecisionLogger`
- `AgentLoopRunner`
- 실패 처리 파이프라인 문서화
- 실패 fixture 기반 분류와 결정 흐름 검증

### 이번 단계에서 하지 않을 것

- 게임 제품 코드 수정
- 기존 기대결과 변경
- 기존 assertion 완화
- LLM 기반 자동 판단 연결
- GitHub Actions 연결

## 실패 fixture

Agent Loop 실패 경로 검증을 위해 제품 코드와 분리된 fixture를 사용한다.

| fixture | 목적 | 기대 분류 |
| --- | --- | --- |
| `tests/agent/fixtures/envFailCommand.js` | 브라우저 실행 파일 없음과 같은 환경 오류 샘플 | `ENV_FAIL` |
| `tests/agent/fixtures/testFailCommand.js` | locator strict mode와 같은 테스트 코드 오류 샘플 | `TEST_FAIL` |
| `tests/agent/fixtures/productFailCommand.js` | 제품 기대 동작 불일치 샘플 | `PRODUCT_FAIL` |
| `tests/agent/fixtures/reviewRequiredCommand.js` | 근거가 부족한 assertion 실패 샘플 | `REVIEW_REQUIRED` |

fixture는 실패 처리 파이프라인 검증용이며, 제품 게임 코드나 실제 요구사항을 변경하지 않는다.

## Playwright 실패 증거 연결

브라우저 E2E 실패 증거는 `tests/e2e/evidenceTest.js`에서 수집한다.

일반 E2E 테스트는 `tests/e2e/runner.spec.js`만 실행한다.

의도된 실패 증거 저장 검증은 `tests/e2e/evidence.spec.js`를 별도로 실행한다.

| 파일 | 역할 |
| --- | --- |
| `tests/e2e/evidenceTest.js` | Playwright 커스텀 fixture로 실패 후 증거 저장 |
| `tests/e2e/evidence.spec.js` | 증거 저장 검증용 의도된 실패 샘플 |
| `artifacts/playwright-evidence/` | 실패 시 생성되는 브라우저 증거 저장 위치 |

저장되는 증거는 다음과 같다.

- `screenshot.png`
- `console-log.json`
- `state.json`
- `metadata.json`
- `test-info.json`
- `timeline.json`

`state.json`은 브라우저에서 `window.__QA_AUTOMATION__.getState()`를 호출해 저장한다.

`metadata.json`은 실패 기록에 판단 근거를 연결하기 위해 저장한다.

`timeline.json`은 테스트 실행 흐름과 PASS/FAIL 기준 불합 지점을 연결하기 위해 저장한다. 단순히 언제 무엇을 했는지뿐 아니라, 어떤 기준이 실패했는지까지 남긴다.

공통 구조는 다음과 같다.

```json
{
  "testCaseId": "TC-008-EVIDENCE-001",
  "requirementId": "REQ-EVIDENCE-001",
  "testGroupId": "TC-GROUP-08",
  "testGroupName": "브라우저 E2E",
  "assertion": {
    "name": "Playwright 실패 증거 저장",
    "message": "의도된 실패가 발생하면 screenshot, console log, QA state, test info, metadata를 저장한다."
  },
  "expected": {
    "evidenceSaved": true
  },
  "actual": {
    "evidenceSaved": "실패 이후 fixture에서 확인"
  },
  "classificationBasis": [
    {
      "testGroupId": "TC-GROUP-08",
      "basisType": "evidenceCollectionSample",
      "supports": "REVIEW_REQUIRED",
      "reason": "의도된 실패 샘플이므로 제품, 테스트, 환경 실패로 단정하지 않는다."
    }
  ]
}
```

모든 테스트 그룹을 한 번에 별도 형식으로 만들지 않는다. 대신 공통 필드인 `testCaseId`, `requirementId`, `testGroupId`, `expected`, `actual`, `assertion`은 공유하고, `classificationBasis`에 대분류별 판단 근거를 추가한다.

예를 들어 충돌 테스트인 `TC-GROUP-05`는 충돌 여부와 게임 상태 전이를 근거로 삼고, 브라우저 E2E인 `TC-GROUP-08`은 UI 조작, 브라우저 로그, QA state 노출 여부를 근거로 삼는다.

`npm run test:e2e:evidence`는 증거 저장을 검증하기 위한 의도된 실패 명령이다. 따라서 종료 코드 1이 발생하는 것이 정상이며, PASS/FAIL 기준을 완화하기 위한 명령이 아니다.

`npm run test:e2e:product-fail-evidence`는 `TC-005-01` 기준 PRODUCT_FAIL 분류 흐름을 검증하기 위한 의도된 실패 명령이다. 제품 코드를 수정하지 않고 metadata의 expected/actual과 `classificationBasis`를 통해 Agent Loop가 `PRODUCT_FAIL`을 기록하는지 확인한다.

## Timeline 기준 불합 기록

`tests/e2e/evidenceTest.js`는 테스트 중 `qaEvidence.recordStep()`과 `qaEvidence.recordCriterion()`을 사용할 수 있게 한다.

`recordStep()`은 테스트 흐름을 기록한다.

예시:

```json
{
  "type": "step",
  "name": "start-clicked",
  "status": "passed",
  "state": {
    "status": "running",
    "score": 0
  }
}
```

`recordCriterion()`은 PASS/FAIL 기준과 실제 불합 사유를 기록한다.

예시:

```json
{
  "type": "criterion",
  "name": "TC-005-01 PASS 기준",
  "status": "failed",
  "passCriteria": "충돌 이후 status === \"gameOver\"",
  "expected": {
    "status": "gameOver",
    "collision": true
  },
  "actual": {
    "status": "running",
    "collision": true
  },
  "result": "FAIL",
  "failedBecause": "actual.status가 expected.status와 다름"
}
```

이 구조를 통해 타임라인에서 테스트가 어느 단계까지 정상 진행되었고, 어느 PASS 기준에서 실패했는지 확인할 수 있다.

## Evidence 기반 판단 연결

`tests/agent/playwrightEvidenceReader.js`는 저장된 Playwright evidence 디렉터리에서 `console-log.json`, `state.json`, `metadata.json`, `test-info.json`, `timeline.json`, `screenshot.png` 경로를 읽는다.

`tests/agent/playwrightEvidenceAnalyzer.js`는 읽은 evidence를 `FailureClassifier`와 `DecisionEngine`에 전달하고, 판단 결과를 `DecisionLogger`에 기록한다. 이때 `timeline.json`에서 실패한 기준만 모아 `failedCriteria`로 남기고, 전체 이벤트 수와 마지막 이벤트를 `timelineSummary`로 요약한다.

실행 명령:

```bash
npm run test:agent:evidence
```

이 명령은 가장 최근의 `artifacts/playwright-evidence/` 디렉터리를 읽어 실패 분류와 다음 행동 결정을 수행한다.

현재 의도된 실패 샘플은 `TC-GROUP-08` 브라우저 E2E evidence 저장 검증용이다. 제품 요구사항 위반을 검증하는 테스트가 아니므로 `metadata.json`의 판단 근거에 따라 `REVIEW_REQUIRED`로 분류하고 `REVIEW`로 종료한다.

`TC-005-01` PRODUCT_FAIL 샘플은 충돌 조건이 true일 때 expected status를 `gameOver`, actual status를 `running`으로 기록한다. 이 샘플은 실제 제품 결함 보고가 아니라, 하네스 가드레일 안에서 evidence 기반 제품 실패 분류가 동작하는지 검증하기 위한 테스트 전용 실패 샘플이다.

제품 실패 판단은 다음 조건을 만족할 때만 수행한다.

- 환경 오류 패턴이 없어야 한다.
- 테스트 코드 오류 패턴이 없어야 한다.
- `testCaseId`와 `testGroupId`가 있어야 한다.
- `expected`와 `actual`의 차이가 제품 요구사항과 연결되어야 한다.
- `classificationBasis`가 `PRODUCT_FAIL`을 명시적으로 지지해야 한다.

## 가드레일 연결

상세한 테스트 수행 제한은 `docs/test-guardrails.md`를 따른다.

Agent Loop는 가드레일을 우회하기 위한 구조가 아니라, 가드레일 안에서 실패를 안전하게 다루기 위한 구조이다.
