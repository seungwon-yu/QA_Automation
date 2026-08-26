# 초기화 및 상태 관리 테스트 케이스

## 개요

| 항목 | 내용 |
| --- | --- |
| 그룹 ID | TC-GROUP-01 |
| 대분류 | 초기화 및 상태 관리 |
| 우선순위 | High |
| 주요 기법 | 상태 전이 테스팅 |
| 목적 | 게임이 유효한 상태 전이에 따라 시작, 종료, 초기화되는지 검증한다. |

## 후보 테스트 케이스

| 테스트 ID | 시나리오 | 기대 결과 | 상세화 상태 |
| --- | --- | --- | --- |
| TC-001-01 | 게임 엔진 생성 | 상태는 `ready`, 점수는 `0`이다. | 후보 |
| TC-001-02 | 게임 시작 | 상태가 `ready`에서 `running`으로 변경된다. | 후보 |
| TC-001-03 | 게임 재시작 | 점수가 초기화되고 상태가 `running`이 된다. | 후보 |
| TC-001-04 | 게임오버 상태 | 충돌 후 상태가 `gameOver`로 유지된다. | 후보 |

## Evidence 기준

- `state.json`
- `metadata.json`
- 필요 시 `timeline.json`

## Classification Basis 방향

- 상태 전이 expected와 actual이 명확히 다르면 `PRODUCT_FAIL` 후보이다.
- 테스트가 시작 상태를 잘못 만들었거나 하네스 사용이 잘못되면 `TEST_FAIL` 후보이다.
- 상태 전이 근거가 부족하면 `REVIEW_REQUIRED`로 둔다.

## 상세화 예정

이 그룹은 Sprint 1 단위 테스트로 이미 일부 검증되어 있다. 이후 Agent Loop evidence와 연결할 때 각 TC의 사전 조건, 절차, expected/actual metadata를 상세화한다.
