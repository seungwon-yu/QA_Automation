# 초기화 및 상태 관리 테스트 케이스

## 개요

| 항목 | 내용 |
| --- | --- |
| 그룹 ID | TC-GROUP-01 |
| 대분류 | 초기화 및 상태 관리 |
| 우선순위 | High |
| 주요 기법 | 상태 전이 테스팅 |
| 목적 | 게임이 유효한 상태 전이에 따라 시작, 종료, 초기화되는지 검증한다. |

## 테스트 베이시스

| 항목 | 내용 |
| --- | --- |
| 관련 리스크 | 초기 상태나 재시작 상태가 잘못되면 이후 모든 게임 플레이와 테스트 조건이 신뢰성을 잃는다. |
| 테스트 대상 | `GameEngine`의 `ready`, `running`, `gameOver`, `restart` 상태 전이 |
| 테스트 레벨 | Harness 기반 Unit Test |
| 자동화 방식 | `GameHarness`로 상태를 직접 시작, 충돌, 재시작하고 결과 상태를 관찰 |

## 테스트 설계 기준

| 기준 | 적용 |
| --- | --- |
| 상태 전이 | `ready -> running`, `running -> gameOver`, `gameOver -> running` 흐름을 검증한다. |
| 사전 조건 검증 | 각 테스트가 기대하는 시작 상태를 먼저 명확히 만든다. |
| 리그레션 | 상태 초기화가 다른 기능 테스트의 선행 조건이므로 반복적으로 확인한다. |

## 공통 PASS/FAIL 기준

- 제품 코드와 요구사항은 테스트 중 수정하지 않는다.
- 상태 전이 기준은 테스트 실행 중 변경하지 않는다.
- 실패 시 `state.json`, `metadata.json`, 필요 시 `timeline.json`에 expected와 actual을 남긴다.
- 상태 전이 expected와 actual이 명확히 다르면 `PRODUCT_FAIL` 후보로 본다.
- 테스트가 사전 상태를 잘못 만들었으면 `TEST_FAIL` 후보로 본다.
- 상태 전이 근거가 부족하면 `REVIEW_REQUIRED`로 둔다.

## 상세 테스트 케이스

### TC-001-01 게임 엔진 생성 초기 상태

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-001-01 |
| Test Condition | 게임 엔진 생성 직후 초기 상태가 준비 상태여야 한다. |
| 사전 조건 | 새 `GameHarness`를 생성한다. |
| 절차 | `getState()`로 현재 상태와 점수를 확인한다. |
| Expected Result | `status`는 `ready`, `score`는 `0`이다. |
| Evidence | `state.json`, `metadata.json` |
| Classification Basis | 새 엔진의 초기 상태가 expected와 다르면 `PRODUCT_FAIL` 후보이다. |

### TC-001-02 게임 시작 상태 전이

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-001-02 |
| Test Condition | 시작 명령을 실행하면 게임은 `running` 상태가 되어야 한다. |
| 사전 조건 | 게임 상태는 `ready`이다. |
| 절차 | `start()`를 호출한 뒤 `getState()`를 확인한다. |
| Expected Result | `status`는 `running`이다. |
| Evidence | `state.json`, `metadata.json`, `timeline.json` |
| Classification Basis | 시작 명령 이후 상태가 `running`이 아니면 `PRODUCT_FAIL` 후보이다. |

### TC-001-03 게임 재시작 상태 초기화

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-001-03 |
| Test Condition | 재시작하면 새 세션 기준으로 상태와 점수가 초기화되어야 한다. |
| 사전 조건 | 게임은 진행 중이거나 게임오버 상태이다. |
| 절차 | 점수를 얻은 뒤 `restart()`를 호출하고 상태를 확인한다. |
| Expected Result | `status`는 `running`, `score`는 `0`이다. |
| Evidence | `state.json`, `metadata.json`, `timeline.json` |
| Classification Basis | 재시작 후 상태 또는 점수가 초기화되지 않으면 `PRODUCT_FAIL` 후보이다. |

### TC-001-04 게임오버 상태 유지

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-001-04 |
| Test Condition | 충돌 후 게임오버가 되면 추가 루프 진행에도 게임오버 상태가 유지되어야 한다. |
| 사전 조건 | 게임 상태는 `running`이고 충돌 조건을 만들 수 있다. |
| 절차 | 플레이어 위치에 장애물을 배치하고 루프를 진행한 뒤 추가 루프를 진행한다. |
| Expected Result | `status`는 `gameOver`로 유지된다. |
| Evidence | `state.json`, `metadata.json`, `timeline.json` |
| Classification Basis | 게임오버 이후 상태가 임의로 `running`으로 돌아가면 `PRODUCT_FAIL` 후보이다. 충돌 조건이 불명확하면 `REVIEW_REQUIRED`로 둔다. |

## Evidence 기준

- `state.json`
- `metadata.json`
- 필요 시 `timeline.json`

## Timeline 기록 예시

```json
{
  "type": "criterion",
  "testCaseId": "TC-001-02",
  "evaluationTarget": "시작 후 상태 전이",
  "passCriteria": "start 이후 status === running",
  "expected": {
    "status": "running"
  },
  "actual": {
    "status": "running"
  },
  "comparison": {
    "expectedResult": "status=running",
    "actualResult": "status=running"
  },
  "passed": true
}
```

## Classification Basis 방향

- 상태 전이 expected와 actual이 명확히 다르면 `PRODUCT_FAIL` 후보이다.
- 테스트가 시작 상태를 잘못 만들었거나 하네스 사용이 잘못되면 `TEST_FAIL` 후보이다.
- 상태 전이 근거가 부족하면 `REVIEW_REQUIRED`로 둔다.

## 구현 상태

이 그룹은 Sprint 1 하네스 기반 단위 테스트로 구현되었다.

현재 `TC-001-01`, `TC-001-02`, `TC-001-03`, `TC-001-04` 기준 동작은 단위 테스트 또는 관련 충돌/재시작 테스트에서 검증된다.
