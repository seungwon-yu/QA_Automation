# 게임 루프 진행 테스트 케이스

## 개요

| 항목 | 내용 |
| --- | --- |
| 그룹 ID | TC-GROUP-03 |
| 대분류 | 게임 루프 진행 |
| 우선순위 | High |
| 주요 기법 | 리그레션, 비기능 테스트 |
| 목적 | 반복 프레임 업데이트에 의존하는 동작을 검증한다. |

## 후보 테스트 케이스

| 테스트 ID | 시나리오 | 기대 결과 | 상세화 상태 |
| --- | --- | --- | --- |
| TC-003-01 | 고정 프레임 진행 | 경과 상태가 예측 가능하게 변경된다. | 후보 |
| TC-003-02 | 초 단위 진행 | 시뮬레이션 시간에 따라 점수가 증가한다. | 후보 |
| TC-003-03 | 장시간 루프 진행 | 잘못된 상태 없이 안정적으로 유지된다. | 후보 |
| TC-003-04 | 게임오버 후 루프 진행 | 점수와 이동이 의도치 않게 계속되지 않는다. | 후보 |

## Evidence 기준

- `state.json`
- `timeline.json`
- `metadata.json`

## Classification Basis 방향

- 같은 frame/time 조건에서 expected와 actual이 다르면 `PRODUCT_FAIL` 후보이다.
- 루프 실행 조건이나 frame 수 설정이 잘못되면 `TEST_FAIL` 후보이다.
- 시간 기반 오차 허용 기준이 불명확하면 `REVIEW_REQUIRED`로 둔다.

## 상세화 예정

이 그룹은 `runForFrames`, `runForSeconds`, `runUntil`, `getTimeline`과 직접 연결된다. 이후 timeline evidence 저장 구조가 확장될 때 상세 TC를 완성한다.
