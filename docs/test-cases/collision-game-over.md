# 충돌 및 게임오버 테스트 케이스

## 개요

| 항목 | 내용 |
| --- | --- |
| 그룹 ID | TC-GROUP-05 |
| 대분류 | 충돌 및 게임오버 |
| 우선순위 | High |
| 주요 기법 | 경계값 분석, 상태 전이 |
| 목적 | 충돌 판정과 게임오버 상태 전이를 검증한다. |

## TC-005-01 장애물이 플레이어와 겹치면 게임오버가 된다

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-005-01 |
| 요구사항 ID | REQ-COLLISION-001 |
| Test Condition | 장애물과 플레이어 충돌이 발생하면 게임 상태가 `gameOver`로 전이되어야 한다. |
| 사전 조건 | 게임 상태는 `running`이다. 플레이어는 지면에 있다. |
| 절차 | 게임을 시작한다. 장애물을 플레이어 충돌 영역에 배치한다. 게임 루프를 1프레임 이상 진행한다. QA state를 수집한다. |
| Expected Result | `status`가 `gameOver`이다. |
| Evidence | `state.json`, `metadata.json`, `timeline.json`, 필요 시 `screenshot.png` |
| PASS 기준 | 충돌 이후 `status === "gameOver"` |
| FAIL 후보 | 충돌 조건이 true인데 `status`가 `running` 또는 `ready`로 유지됨 |
| Classification Basis | 환경 오류와 테스트 코드 오류가 없고, `expected.status = "gameOver"`, `actual.status != "gameOver"`이면 `PRODUCT_FAIL` 후보 |

예상 metadata 핵심:

```json
{
  "testCaseId": "TC-005-01",
  "requirementId": "REQ-COLLISION-001",
  "testGroupId": "TC-GROUP-05",
  "expected": {
    "status": "gameOver",
    "collision": true
  },
  "actual": {
    "status": "running",
    "collision": true
  },
  "classificationBasis": [
    {
      "basisType": "collisionStateMismatch",
      "supports": "PRODUCT_FAIL",
      "reason": "충돌 조건이 true인데 게임 상태가 gameOver로 전이되지 않음"
    }
  ]
}
```

## TC-005-02 장애물이 플레이어와 겹치지 않으면 게임은 계속 진행된다

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-005-02 |
| 요구사항 ID | REQ-COLLISION-002 |
| Test Condition | 장애물이 플레이어와 겹치지 않으면 게임 상태는 `running`으로 유지되어야 한다. |
| 사전 조건 | 게임 상태는 `running`이다. 장애물은 플레이어 충돌 영역 밖에 있다. |
| 절차 | 게임을 시작한다. 장애물을 비충돌 위치에 배치한다. 게임 루프를 진행한다. QA state를 수집한다. |
| Expected Result | `status`가 `running`으로 유지된다. |
| Evidence | `state.json`, `metadata.json`, `timeline.json` |
| PASS 기준 | 비충돌 조건에서 `status === "running"` |
| FAIL 후보 | 비충돌 조건인데 `status`가 `gameOver`로 전이됨 |
| Classification Basis | 비충돌 조건이 명확하고 테스트 배치 오류가 없으면 `PRODUCT_FAIL` 후보. 장애물 위치 계산 근거가 부족하면 `REVIEW_REQUIRED` |

## TC-005-03 충돌 경계값은 충돌 규칙과 일치한다

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-005-03 |
| 요구사항 ID | REQ-COLLISION-003 |
| Test Condition | 플레이어와 장애물의 경계가 겹치는 경우 충돌 판정이 기대 규칙과 일치해야 한다. |
| 사전 조건 | 게임 상태는 `running`이다. 플레이어와 장애물의 좌표를 제어할 수 있다. |
| 절차 | 장애물을 충돌 경계값 위치에 배치한다. 1프레임 진행한다. 충돌 결과와 상태를 수집한다. |
| Expected Result | 경계값 규칙에 따라 충돌이면 `gameOver`, 비충돌이면 `running`이다. |
| Evidence | `state.json`, `metadata.json`, `timeline.json` |
| PASS 기준 | 경계값 expected와 actual이 일치 |
| FAIL 후보 | 경계값 expected와 actual이 불일치 |
| Classification Basis | 경계값 좌표와 expected가 metadata에 충분히 있으면 `PRODUCT_FAIL` 후보. 좌표 근거가 부족하면 `REVIEW_REQUIRED` |

## TC-005-04 충돌 후 재시작하면 새 세션이 시작된다

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-005-04 |
| 요구사항 ID | REQ-COLLISION-004 |
| Test Condition | 게임오버 이후 재시작하면 상태와 점수가 새 세션 기준으로 초기화되어야 한다. |
| 사전 조건 | 게임 상태는 `gameOver`이다. |
| 절차 | 충돌을 발생시킨다. Restart를 실행한다. QA state를 수집한다. |
| Expected Result | `status`는 `running`, `score`는 `0`, 플레이어는 시작 위치이다. |
| Evidence | `state.json`, `metadata.json`, `timeline.json`, 필요 시 `screenshot.png` |
| PASS 기준 | 재시작 이후 상태와 점수가 초기화됨 |
| FAIL 후보 | 상태가 `gameOver`로 남거나 점수가 초기화되지 않음 |
| Classification Basis | 재시작 입력이 정상 수행됐고 actual이 expected와 다르면 `PRODUCT_FAIL` 후보 |
