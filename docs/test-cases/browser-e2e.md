# 브라우저 E2E 테스트 케이스

## 개요

| 항목 | 내용 |
| --- | --- |
| 그룹 ID | TC-GROUP-08 |
| 대분류 | 브라우저 E2E |
| 우선순위 | Low |
| 주요 기법 | 시스템 테스트 |
| 목적 | 브라우저 UI 조작이 엔진과 화면 상태에 연결되어 있는지 검증한다. |

## TC-008-01 페이지 로드 시 게임 UI가 표시된다

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-008-01 |
| 요구사항 ID | REQ-E2E-001 |
| Test Condition | 브라우저에서 페이지를 열면 게임 화면과 조작 UI가 표시되어야 한다. |
| 사전 조건 | E2E 전용 서버가 실행 중이다. |
| 절차 | `/`에 접속한다. Canvas와 Start 버튼을 찾는다. |
| Expected Result | Canvas와 Start 버튼이 표시된다. |
| Evidence | 실패 시 `screenshot.png`, `console-log.json`, `test-info.json`, `metadata.json` |
| PASS 기준 | UI 요소가 표시됨 |
| FAIL 후보 | 페이지 접속 실패, UI 요소 미표시 |
| Classification Basis | 서버 접속 실패는 `ENV_FAIL`, selector/locator 문제는 `TEST_FAIL`, UI가 렌더링되지 않았고 state 근거가 있으면 `PRODUCT_FAIL` 후보 |

## TC-008-02 Start 버튼 클릭 시 게임이 running 상태가 된다

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-008-02 |
| 요구사항 ID | REQ-E2E-002 |
| Test Condition | 사용자가 Start 버튼을 클릭하면 게임 상태가 `running`으로 표시되어야 한다. |
| 사전 조건 | 페이지 로드 완료, 초기 상태는 `ready` |
| 절차 | Start 버튼을 클릭한다. `#state` 텍스트와 QA state를 확인한다. |
| Expected Result | UI와 QA state 모두 `running`이다. |
| Evidence | `screenshot.png`, `state.json`, `metadata.json`, `console-log.json` |
| PASS 기준 | `#state === "running"`이고 `state.value.status === "running"` |
| FAIL 후보 | 버튼 클릭 후 UI 또는 QA state가 `running`이 아님 |
| Classification Basis | locator 오류는 `TEST_FAIL`, 클릭이 정상이고 상태 전이가 없으면 `PRODUCT_FAIL` 후보 |

## TC-008-03 Space 키 입력 시 플레이어가 점프한다

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-008-03 |
| 요구사항 ID | REQ-E2E-003 |
| Test Condition | 게임 실행 중 Space 키 입력은 플레이어 점프와 연결되어야 한다. |
| 사전 조건 | 게임 상태는 `running`, 플레이어는 지면에 있다. |
| 절차 | 점프 전 `player.y`를 저장한다. Space 키를 입력한다. 짧은 시간 후 `player.y`를 다시 수집한다. |
| Expected Result | 점프 후 `player.y`가 점프 전보다 작다. |
| Evidence | `state.json`, `metadata.json`, `screenshot.png`, 필요 시 `timeline.json` |
| PASS 기준 | `afterY < beforeY` |
| FAIL 후보 | Space 입력 후 `player.y`가 감소하지 않음 |
| Classification Basis | 키 입력 실패나 포커스 문제는 `TEST_FAIL` 후보, 입력이 전달됐고 상태 변화가 없으면 `PRODUCT_FAIL` 후보 |

## TC-008-04 Restart 버튼 클릭 시 상태와 점수가 초기화된다

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-008-04 |
| 요구사항 ID | REQ-E2E-004 |
| Test Condition | 사용자가 Restart 버튼을 클릭하면 새 게임 세션이 시작되어야 한다. |
| 사전 조건 | 게임은 `running` 또는 `gameOver` 상태이다. |
| 절차 | Restart 버튼을 클릭한다. UI 상태, 점수, QA state를 확인한다. |
| Expected Result | `status`는 `running`, `score`는 `0`이다. |
| Evidence | `screenshot.png`, `state.json`, `metadata.json`, `console-log.json` |
| PASS 기준 | Restart 이후 상태와 점수가 expected와 일치 |
| FAIL 후보 | Restart 이후 상태가 바뀌지 않거나 점수가 초기화되지 않음 |
| Classification Basis | Restart locator 문제는 `TEST_FAIL`, 클릭이 정상이고 상태 초기화가 실패하면 `PRODUCT_FAIL` 후보 |

## TC-008-EVIDENCE-001 실패 시 브라우저 evidence를 저장한다

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-008-EVIDENCE-001 |
| 요구사항 ID | REQ-EVIDENCE-001 |
| Test Condition | Playwright E2E 실패 시 screenshot, console log, QA state, test info, metadata가 저장되어야 한다. |
| 사전 조건 | E2E 전용 서버가 실행 중이다. |
| 절차 | 페이지에 접속한다. console log를 남긴다. metadata를 설정한다. 의도된 assertion 실패를 발생시킨다. |
| Expected Result | 실패 후 evidence 파일이 생성된다. |
| Evidence | `screenshot.png`, `console-log.json`, `state.json`, `metadata.json`, `test-info.json` |
| PASS 기준 | 이 테스트는 의도 실패 샘플이므로 Playwright 명령은 실패를 반환한다. Agent 분석은 `REVIEW_REQUIRED`와 `REVIEW`를 기록한다. |
| FAIL 후보 | evidence 파일이 생성되지 않거나 Agent 분석이 evidence를 읽지 못함 |
| Classification Basis | 제품 요구사항 위반을 검증하는 테스트가 아니므로 `PRODUCT_FAIL`로 단정하지 않고 `REVIEW_REQUIRED` |

## TC-008-06 locator가 모호하면 TEST_FAIL로 분류한다

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-008-06 |
| 요구사항 ID | REQ-E2E-LOCATOR-001 |
| Test Condition | 자동화 테스트는 사용자 조작 대상 요소를 명확한 locator로 선택해야 한다. |
| 사전 조건 | 페이지 로드 완료, Start/Jump/Restart 버튼이 모두 표시되어 있다. |
| 절차 | `/`에 접속한다. 이름을 지정하지 않은 `button` role locator로 클릭을 시도한다. |
| Expected Result | locator는 조작 대상 요소 하나만 선택해야 한다. |
| Actual Result | `button` role locator가 Start, Jump, Restart 버튼을 모두 선택한다. |
| Evidence | `screenshot.png`, `state.json`, `metadata.json`, `timeline.json`, `assertion-error.json`, `test-info.json` |
| PASS 기준 | 자동화 locator가 단일 요소만 선택한다. |
| FAIL 후보 | locator가 여러 요소를 동시에 선택해 Playwright strict mode violation이 발생함 |
| Classification Basis | 제품 요구사항 위반이 아니라 테스트 자동화 코드의 locator 문제이므로 `TEST_FAIL` |
