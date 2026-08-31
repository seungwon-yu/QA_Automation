# 리그레션 플로우 테스트 케이스

## 개요

| 항목 | 내용 |
| --- | --- |
| 그룹 ID | TC-GROUP-07 |
| 대분류 | 리그레션 플로우 |
| 우선순위 | Medium |
| 주요 기법 | 확인 테스팅, 리그레션, 상태 전이 |
| 목적 | 변경 이후 핵심 게임 플로우가 반복적으로 정상 동작하는지 검증한다. |

## 테스트 베이시스

| 항목 | 내용 |
| --- | --- |
| 관련 리스크 | 개별 기능은 통과해도 여러 기능을 연결한 실제 플레이 흐름에서 상태가 꼬일 수 있다. |
| 테스트 대상 | 시작, 점프, 착지, 점수 증가, 충돌, 게임오버, 재시작 흐름 |
| 테스트 레벨 | Harness 기반 Unit Test |
| 자동화 방식 | `GameHarness`로 사용자 여정을 결정적으로 재현하고 반복 실행한다. |

## 리그레션 플로우 기준

리그레션 플로우는 단일 기능의 제품 실패를 바로 단정하기 위한 테스트가 아니다.

목적은 다음과 같다.

- 이미 검증한 개별 기능이 연결된 흐름에서도 깨지지 않는지 확인한다.
- 실패가 발생했을 때 어느 단계에서 기대결과가 깨졌는지 추적한다.
- 동일 조건 재실행 시 같은 실패가 반복되는지 확인할 수 있는 기반을 만든다.
- Agent Loop의 retry evidence 비교 구조와 연결할 대표 시나리오를 만든다.

## 테스트 설계 기준

| 기준 | 적용 |
| --- | --- |
| 확인 테스팅 | 구현된 핵심 기능들이 함께 동작하는지 확인한다. |
| 리그레션 | 변경 이후 기존 핵심 흐름이 다시 깨지지 않는지 검증한다. |
| 상태 전이 | `ready`, `running`, `gameOver`, `running` 재시작 흐름을 확인한다. |
| 반복 실행 | 동일한 핵심 플로우를 여러 번 실행해 상태 안정성을 확인한다. |

## 공통 PASS/FAIL 기준

- 제품 코드와 요구사항은 테스트 중 수정하지 않는다.
- 리그레션 플로우 중 실패가 발생해도 expected, assertion, PASS/FAIL 기준을 변경하지 않는다.
- 동일 조건 재시도는 최대 3회까지만 허용한다.
- 실패 시 어느 단계에서 실패했는지 `timeline.json`과 `metadata.json`에 남긴다.
- 실패 단계가 특정 TC-GROUP과 명확히 연결되면 해당 그룹의 Classification Basis를 우선 사용한다.
- 실패 단계가 불명확하면 `REVIEW_REQUIRED`로 둔다.

## 상세 테스트 케이스

### TC-007-01 기본 플레이 흐름

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-007-01 |
| Test Condition | 시작, 점프, 착지, 점수 증가 흐름이 게임오버 없이 완료되어야 한다. |
| 사전 조건 | 게임 엔진은 초기 `ready` 상태이다. |
| 절차 | `start()`, `pressJump()`, 착지까지 `runUntil()`, 이후 `runForSeconds(1)`을 실행한다. |
| Expected Result | 최종 상태는 `running`, 플레이어는 지면에 있고, 점수는 0보다 크다. |
| Evidence | `state.json`, `timeline.json`, `metadata.json` |
| Classification Basis | 점프 실패는 TC-GROUP-02, 착지 실패는 TC-GROUP-02, 점수 실패는 TC-GROUP-06 기준으로 분류한다. |

### TC-007-02 게임오버 후 재시작 플로우

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-007-02 |
| Test Condition | 충돌로 게임오버가 된 뒤 재시작하면 다시 정상 플레이할 수 있어야 한다. |
| 사전 조건 | 게임 상태는 `running`이다. |
| 절차 | 점수 획득, 충돌, 게임오버 확인, `restart()`, 짧은 루프 진행을 실행한다. |
| Expected Result | 충돌 후 `gameOver`, 재시작 후 `running`, 현재 점수는 다시 증가한다. |
| Evidence | `state.json`, `timeline.json`, `metadata.json` |
| Classification Basis | 충돌 실패는 TC-GROUP-05, 재시작 실패는 TC-GROUP-01, 점수 재증가 실패는 TC-GROUP-06 기준으로 분류한다. |

### TC-007-03 핵심 플로우 3회 반복

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-007-03 |
| Test Condition | 핵심 플레이 세션을 3회 반복해도 상태가 안정적으로 유지되어야 한다. |
| 사전 조건 | 게임 엔진은 초기 `ready` 상태이다. |
| 절차 | 시작, 점수 획득, 충돌, 재시작 흐름을 3회 반복한다. |
| Expected Result | 각 반복에서 게임오버가 발생하고, 재시작 후 `running` 상태로 돌아온다. 최고 기록은 감소하지 않는다. |
| Evidence | `state.json`, `timeline.json`, `metadata.json`, `decision-log.json` |
| Classification Basis | 반복 중 동일 단계에서 실패가 반복되면 retry evidence 비교 대상으로 본다. 실패 단계가 불명확하면 `REVIEW_REQUIRED`로 둔다. |

## Evidence 기준

- `state.json`
- `timeline.json`
- `metadata.json`
- `decision-log.json`
- E2E 확장 시 `screenshot.png`, `console-log.json`

## Timeline 기록 예시

```json
{
  "type": "criterion",
  "testCaseId": "TC-007-02",
  "evaluationTarget": "재시작 후 상태 복귀",
  "passCriteria": "restart 이후 status === running && score가 다시 증가",
  "expected": {
    "status": "running",
    "score": "0보다 큼"
  },
  "actual": {
    "status": "running",
    "score": 4
  },
  "comparison": {
    "expectedResult": "status=running, score > 0",
    "actualResult": "status=running, score=4"
  },
  "passed": true
}
```

## Classification Basis 방향

- 리그레션 플로우는 실패 단계의 원인 그룹을 찾아 해당 TC-GROUP 기준으로 분류한다.
- 동일 단계가 3회 반복 실패하면 retry evidence 비교에서 재현성 있는 실패로 본다.
- 여러 단계가 동시에 실패하거나 원인 단계가 불명확하면 `REVIEW_REQUIRED`로 둔다.
- 환경 오류나 테스트 코드 오류는 `PRODUCT_FAIL`과 구분한다.

## 구현 상태

이 그룹은 Sprint 2 세 번째 기능 테스트 구현 대상으로 선정되었다.

현재 `TC-007-01`, `TC-007-02`, `TC-007-03`은 하네스 기반 단위 테스트로 구현되었다.
