# 테스트 케이스

## 목적

이 문서는 테스트 대분류를 실제 자동화 테스트와 Agent Loop 판단 근거로 연결하기 위한 상세 테스트 케이스 문서이다.

테스트 케이스는 단순히 절차와 기대 결과만 기록하지 않는다. 실패가 발생했을 때 evidence와 metadata를 통해 왜 실패인지 설명할 수 있도록 작성한다.

## 작성 기준

각 테스트 케이스는 다음 항목을 가진다.

| 항목 | 의미 |
| --- | --- |
| 테스트 ID | 테스트를 추적하기 위한 고유 ID |
| 그룹 ID | `docs/test-classification.md`의 TC-GROUP ID |
| Test Condition | 검증하려는 조건 |
| 사전 조건 | 테스트 시작 전에 만족해야 하는 상태 |
| 절차 | 자동화가 수행할 동작 |
| Expected Result | PASS 판단 기준 |
| Evidence | 실패 시 저장해야 할 증거 |
| Classification Basis | 실패 분류에 사용할 판단 근거 |

## 공통 Evidence Metadata

E2E 실패 evidence에는 다음 공통 metadata를 저장한다.

```json
{
  "testCaseId": "TC-005-01",
  "requirementId": "REQ-COLLISION-001",
  "testGroupId": "TC-GROUP-05",
  "testGroupName": "충돌 및 게임오버",
  "assertion": {
    "name": "충돌 시 게임오버 상태 전이",
    "message": "충돌이 발생하면 게임 상태는 gameOver가 되어야 한다."
  },
  "expected": {
    "status": "gameOver"
  },
  "actual": {
    "status": "running"
  },
  "classificationBasis": [
    {
      "testGroupId": "TC-GROUP-05",
      "basisType": "collisionStateMismatch",
      "supports": "PRODUCT_FAIL",
      "reason": "충돌 조건이 true인데 상태가 gameOver로 전이되지 않음"
    }
  ]
}
```

공통 필드는 모든 TC-GROUP에서 공유한다. 대분류별 차이는 `classificationBasis`에 추가한다.

## Sprint 2 우선 상세화 범위

Sprint 2에서는 Agent Loop 판단 근거와 직접 연결되는 다음 그룹을 우선 상세화한다.

| 그룹 ID | 이유 |
| --- | --- |
| TC-GROUP-05 | 제품 동작 불일치인 `PRODUCT_FAIL`을 설명하기 가장 좋음 |
| TC-GROUP-08 | 실제 브라우저 E2E와 evidence 저장 흐름을 검증하기 좋음 |

나머지 그룹은 이후 Sprint에서 같은 형식으로 확장한다.

## TC-GROUP-05 충돌 및 게임오버

### TC-005-01 장애물이 플레이어와 겹치면 게임오버가 된다

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-005-01 |
| 요구사항 ID | REQ-COLLISION-001 |
| 그룹 ID | TC-GROUP-05 |
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

### TC-005-02 장애물이 플레이어와 겹치지 않으면 게임은 계속 진행된다

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-005-02 |
| 요구사항 ID | REQ-COLLISION-002 |
| 그룹 ID | TC-GROUP-05 |
| Test Condition | 장애물이 플레이어와 겹치지 않으면 게임 상태는 `running`으로 유지되어야 한다. |
| 사전 조건 | 게임 상태는 `running`이다. 장애물은 플레이어 충돌 영역 밖에 있다. |
| 절차 | 게임을 시작한다. 장애물을 비충돌 위치에 배치한다. 게임 루프를 진행한다. QA state를 수집한다. |
| Expected Result | `status`가 `running`으로 유지된다. |
| Evidence | `state.json`, `metadata.json`, `timeline.json` |
| PASS 기준 | 비충돌 조건에서 `status === "running"` |
| FAIL 후보 | 비충돌 조건인데 `status`가 `gameOver`로 전이됨 |
| Classification Basis | 비충돌 조건이 명확하고 테스트 배치 오류가 없으면 `PRODUCT_FAIL` 후보. 장애물 위치 계산 근거가 부족하면 `REVIEW_REQUIRED` |

### TC-005-03 충돌 경계값은 충돌 규칙과 일치한다

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-005-03 |
| 요구사항 ID | REQ-COLLISION-003 |
| 그룹 ID | TC-GROUP-05 |
| Test Condition | 플레이어와 장애물의 경계가 겹치는 경우 충돌 판정이 기대 규칙과 일치해야 한다. |
| 사전 조건 | 게임 상태는 `running`이다. 플레이어와 장애물의 좌표를 제어할 수 있다. |
| 절차 | 장애물을 충돌 경계값 위치에 배치한다. 1프레임 진행한다. 충돌 결과와 상태를 수집한다. |
| Expected Result | 경계값 규칙에 따라 충돌이면 `gameOver`, 비충돌이면 `running`이다. |
| Evidence | `state.json`, `metadata.json`, `timeline.json` |
| PASS 기준 | 경계값 expected와 actual이 일치 |
| FAIL 후보 | 경계값 expected와 actual이 불일치 |
| Classification Basis | 경계값 좌표와 expected가 metadata에 충분히 있으면 `PRODUCT_FAIL` 후보. 좌표 근거가 부족하면 `REVIEW_REQUIRED` |

### TC-005-04 충돌 후 재시작하면 새 세션이 시작된다

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-005-04 |
| 요구사항 ID | REQ-COLLISION-004 |
| 그룹 ID | TC-GROUP-05 |
| Test Condition | 게임오버 이후 재시작하면 상태와 점수가 새 세션 기준으로 초기화되어야 한다. |
| 사전 조건 | 게임 상태는 `gameOver`이다. |
| 절차 | 충돌을 발생시킨다. Restart를 실행한다. QA state를 수집한다. |
| Expected Result | `status`는 `running`, `score`는 `0`, 플레이어는 시작 위치이다. |
| Evidence | `state.json`, `metadata.json`, `timeline.json`, 필요 시 `screenshot.png` |
| PASS 기준 | 재시작 이후 상태와 점수가 초기화됨 |
| FAIL 후보 | 상태가 `gameOver`로 남거나 점수가 초기화되지 않음 |
| Classification Basis | 재시작 입력이 정상 수행됐고 actual이 expected와 다르면 `PRODUCT_FAIL` 후보 |

## TC-GROUP-08 브라우저 E2E

### TC-008-01 페이지 로드 시 게임 UI가 표시된다

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-008-01 |
| 요구사항 ID | REQ-E2E-001 |
| 그룹 ID | TC-GROUP-08 |
| Test Condition | 브라우저에서 페이지를 열면 게임 화면과 조작 UI가 표시되어야 한다. |
| 사전 조건 | E2E 전용 서버가 실행 중이다. |
| 절차 | `/`에 접속한다. Canvas와 Start 버튼을 찾는다. |
| Expected Result | Canvas와 Start 버튼이 표시된다. |
| Evidence | 실패 시 `screenshot.png`, `console-log.json`, `test-info.json`, `metadata.json` |
| PASS 기준 | UI 요소가 표시됨 |
| FAIL 후보 | 페이지 접속 실패, UI 요소 미표시 |
| Classification Basis | 서버 접속 실패는 `ENV_FAIL`, selector/locator 문제는 `TEST_FAIL`, UI가 렌더링되지 않았고 state 근거가 있으면 `PRODUCT_FAIL` 후보 |

### TC-008-02 Start 버튼 클릭 시 게임이 running 상태가 된다

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-008-02 |
| 요구사항 ID | REQ-E2E-002 |
| 그룹 ID | TC-GROUP-08 |
| Test Condition | 사용자가 Start 버튼을 클릭하면 게임 상태가 `running`으로 표시되어야 한다. |
| 사전 조건 | 페이지 로드 완료, 초기 상태는 `ready` |
| 절차 | Start 버튼을 클릭한다. `#state` 텍스트와 QA state를 확인한다. |
| Expected Result | UI와 QA state 모두 `running`이다. |
| Evidence | `screenshot.png`, `state.json`, `metadata.json`, `console-log.json` |
| PASS 기준 | `#state === "running"`이고 `state.value.status === "running"` |
| FAIL 후보 | 버튼 클릭 후 UI 또는 QA state가 `running`이 아님 |
| Classification Basis | locator 오류는 `TEST_FAIL`, 클릭이 정상이고 상태 전이가 없으면 `PRODUCT_FAIL` 후보 |

### TC-008-03 Space 키 입력 시 플레이어가 점프한다

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-008-03 |
| 요구사항 ID | REQ-E2E-003 |
| 그룹 ID | TC-GROUP-08 |
| Test Condition | 게임 실행 중 Space 키 입력은 플레이어 점프와 연결되어야 한다. |
| 사전 조건 | 게임 상태는 `running`, 플레이어는 지면에 있다. |
| 절차 | 점프 전 `player.y`를 저장한다. Space 키를 입력한다. 짧은 시간 후 `player.y`를 다시 수집한다. |
| Expected Result | 점프 후 `player.y`가 점프 전보다 작다. |
| Evidence | `state.json`, `metadata.json`, `screenshot.png`, 필요 시 `timeline.json` |
| PASS 기준 | `afterY < beforeY` |
| FAIL 후보 | Space 입력 후 `player.y`가 감소하지 않음 |
| Classification Basis | 키 입력 실패나 포커스 문제는 `TEST_FAIL` 후보, 입력이 전달됐고 상태 변화가 없으면 `PRODUCT_FAIL` 후보 |

### TC-008-04 Restart 버튼 클릭 시 상태와 점수가 초기화된다

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-008-04 |
| 요구사항 ID | REQ-E2E-004 |
| 그룹 ID | TC-GROUP-08 |
| Test Condition | 사용자가 Restart 버튼을 클릭하면 새 게임 세션이 시작되어야 한다. |
| 사전 조건 | 게임은 `running` 또는 `gameOver` 상태이다. |
| 절차 | Restart 버튼을 클릭한다. UI 상태, 점수, QA state를 확인한다. |
| Expected Result | `status`는 `running`, `score`는 `0`이다. |
| Evidence | `screenshot.png`, `state.json`, `metadata.json`, `console-log.json` |
| PASS 기준 | Restart 이후 상태와 점수가 expected와 일치 |
| FAIL 후보 | Restart 이후 상태가 바뀌지 않거나 점수가 초기화되지 않음 |
| Classification Basis | Restart locator 문제는 `TEST_FAIL`, 클릭이 정상이고 상태 초기화가 실패하면 `PRODUCT_FAIL` 후보 |

### TC-008-EVIDENCE-001 실패 시 브라우저 evidence를 저장한다

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-008-EVIDENCE-001 |
| 요구사항 ID | REQ-EVIDENCE-001 |
| 그룹 ID | TC-GROUP-08 |
| Test Condition | Playwright E2E 실패 시 screenshot, console log, QA state, test info, metadata가 저장되어야 한다. |
| 사전 조건 | E2E 전용 서버가 실행 중이다. |
| 절차 | 페이지에 접속한다. console log를 남긴다. metadata를 설정한다. 의도된 assertion 실패를 발생시킨다. |
| Expected Result | 실패 후 evidence 파일이 생성된다. |
| Evidence | `screenshot.png`, `console-log.json`, `state.json`, `metadata.json`, `test-info.json` |
| PASS 기준 | 이 테스트는 의도 실패 샘플이므로 Playwright 명령은 실패를 반환한다. Agent 분석은 `REVIEW_REQUIRED`와 `REVIEW`를 기록한다. |
| FAIL 후보 | evidence 파일이 생성되지 않거나 Agent 분석이 evidence를 읽지 못함 |
| Classification Basis | 제품 요구사항 위반을 검증하는 테스트가 아니므로 `PRODUCT_FAIL`로 단정하지 않고 `REVIEW_REQUIRED` |

## 다음 상세화 후보

다음 Sprint에서 상세화할 후보는 다음과 같다.

| 우선순위 | 그룹 | 이유 |
| --- | --- | --- |
| 1 | TC-GROUP-06 점수 및 기록 | 실제 게임 진행 결과와 expected/actual 비교가 명확함 |
| 2 | TC-GROUP-07 리그레션 플로우 | 하네스 루프와 E2E Journey를 연결하기 좋음 |
| 3 | TC-GROUP-04 장애물 생성 및 이동 | 충돌 테스트의 선행 조건을 더 정확히 만들 수 있음 |
