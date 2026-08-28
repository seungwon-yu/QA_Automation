# Sprint 2 기능 테스트 후보

## 목적

이 문서는 Sprint 2에서 구현할 기능 테스트 후보와 우선순위를 정리한다.

Sprint 2의 중심은 테스트 개수를 늘리는 것이 아니라, 기능 실패가 발생했을 때 evidence를 기반으로 Agent Loop가 실패 원인과 다음 행동을 설명할 수 있게 만드는 것이다.

## 후보 선정 기준

| 기준 | 의미 |
| --- | --- |
| 판단 근거 명확성 | expected와 actual을 비교해 실패 사유를 설명하기 쉬운가 |
| 하네스 제어 가능성 | `GameHarness`가 상태, 시간, 프레임, 조건을 결정적으로 만들 수 있는가 |
| Evidence 연결성 | `state.json`, `timeline.json`, `metadata.json`에 판단 근거를 남기기 좋은가 |
| Agent Loop 적합성 | 실패 분류, retry, stop, review 결정으로 연결하기 좋은가 |
| 제품 코드 영향도 | 제품 코드를 수정하지 않고 테스트만 추가할 수 있는가 |

## Sprint 2 우선순위

| 우선순위 | 대분류 | 문서 | 선정 결과 |
| --- | --- | --- | --- |
| 1 | 점수 및 기록 | `docs/test-cases/score-record.md` | Sprint 2 첫 구현 대상 |
| 2 | 장애물 생성 및 이동 | `docs/test-cases/obstacle-spawn-movement.md` | 점수 테스트 이후 상세화 |
| 3 | 리그레션 플로우 | `docs/test-cases/regression-flow.md` | retry와 재현성 비교 검증용 |
| 4 | 브라우저 E2E 확장 | `docs/test-cases/browser-e2e.md` | 하네스 기능 테스트 안정화 후 확장 |
| 5 | 게임 루프 장시간 안정성 | `docs/test-cases/game-loop-progression.md` | 성능/안정성 성격으로 후순위 진행 |

## 1순위: 점수 및 기록

### 선정 이유

점수와 최고 기록은 숫자 expected/actual 비교가 명확하다.

실패가 발생하면 `score`, `bestScore`, `elapsedTime`, `status`를 evidence로 남겨 어떤 기준이 깨졌는지 설명할 수 있다. 따라서 timeline의 `comparison`, `passCriteria`, `failedBecause`를 훈련하기 가장 좋다.

### 후보 TC

| 테스트 ID | 시나리오 | Expected Result | 주요 Evidence | 분류 기준 |
| --- | --- | --- | --- | --- |
| TC-006-01 | 1초 생존 | running 상태에서 점수가 증가한다. | `state.json`, `timeline.json`, `metadata.json` | 점수 증가 기준 불일치 시 `PRODUCT_FAIL` 후보 |
| TC-006-02 | 점수 획득 후 게임오버 | 게임오버 시 최고 기록이 현재 점수 이상으로 갱신된다. | `state.json`, `timeline.json`, `metadata.json` | 최고 기록 갱신 불일치 시 `PRODUCT_FAIL` 후보 |
| TC-006-03 | 최고 기록 후 재시작 | 재시작 후 현재 점수는 초기화되고 최고 기록은 유지된다. | `state.json`, `timeline.json`, `metadata.json` | 재시작 상태 불일치 시 `PRODUCT_FAIL` 후보 |
| TC-006-04 | 이전 최고 기록보다 낮은 점수 | 최고 기록이 감소하지 않는다. | `state.json`, `timeline.json`, `metadata.json` | 기록 보존 불일치 시 `PRODUCT_FAIL` 후보 |

### 구현 방향

- 제품 코드는 수정하지 않는다.
- 기존 `GameHarness`의 `runForSeconds()`와 `runForFrames()`를 우선 사용한다.
- 부동소수점 오차 허용 기준은 테스트 구현 전에 문서에 명시한다.
- assertion 실패를 없애기 위해 기대값이나 assertion을 완화하지 않는다.
- 실패 시 timeline에 점수 기준, 기대결과, 실제결과, 실패 사유를 남긴다.

## 2순위: 장애물 생성 및 이동

### 선정 이유

장애물은 충돌 테스트의 선행 조건이다.

장애물이 언제, 어디에, 어떤 크기로 생성되고 이동하는지를 결정적으로 만들면 이후 충돌 실패를 더 정확히 설명할 수 있다.

### 후보 TC

| 테스트 ID | 시나리오 | Expected Result | 주요 Evidence | 분류 기준 |
| --- | --- | --- | --- | --- |
| TC-004-01 | 장애물 강제 생성 | 상태에 장애물이 추가된다. | `state.json`, `timeline.json` | 생성 조건 불일치 시 `PRODUCT_FAIL` 후보 |
| TC-004-02 | 장애물 생성 후 루프 진행 | 장애물이 왼쪽으로 이동한다. | `state.json`, `timeline.json` | 위치 변화 불일치 시 `PRODUCT_FAIL` 후보 |
| TC-004-03 | 장애물이 화면 밖으로 이동 | 장애물이 상태에서 제거된다. | `state.json`, `timeline.json` | 제거 기준 불일치 시 `PRODUCT_FAIL` 후보 |
| TC-004-04 | 고정 랜덤 소스 사용 | 생성 결과가 예측 가능하다. | `metadata.json`, `timeline.json` | 랜덤 통제 근거 부족 시 `REVIEW_REQUIRED` |

## 3순위: 리그레션 플로우

### 선정 이유

리그레션 플로우는 하나의 기능 실패를 찾는 목적보다, 여러 기능을 묶어 반복 실행했을 때 같은 문제가 재현되는지 확인하는 목적이 강하다.

Agent Loop의 retry와 `RetryEvidenceComparator`를 보여주기 좋은 영역이다.

### 후보 TC

| 테스트 ID | 시나리오 | Expected Result | 주요 Evidence | 분류 기준 |
| --- | --- | --- | --- | --- |
| TC-007-01 | 시작, 점프, 착지, 점수 증가 | 게임오버 없이 흐름이 완료된다. | `timeline.json`, `metadata.json` | 실패 단계의 원 TC-GROUP 기준 사용 |
| TC-007-02 | 충돌, 재시작, 재플레이 | 재시작된 세션이 정상 동작한다. | `state.json`, `timeline.json` | 실패 단계가 불명확하면 `REVIEW_REQUIRED` |
| TC-007-03 | 핵심 플로우 3회 반복 | 반복 중 상태가 안정적으로 유지된다. | `timeline.json`, `decision-log.json` | 동일 실패 반복 시 재현성 비교 |

## 4순위: 브라우저 E2E 확장

### 선정 이유

브라우저 E2E는 사용자의 실제 조작과 화면 상태를 검증한다.

다만 실행 속도와 환경 영향이 크므로, 하네스 기반 기능 테스트가 먼저 안정화된 뒤 대표 사용자 여정 중심으로 확장한다.

### 후보 TC

| 테스트 ID | 시나리오 | Expected Result | 주요 Evidence | 분류 기준 |
| --- | --- | --- | --- | --- |
| TC-008-02 | Start 버튼 클릭 | QA 상태가 `running`이 된다. | `screenshot.png`, `state.json`, `timeline.json` | UI와 엔진 상태 불일치 시 `PRODUCT_FAIL` 또는 `TEST_FAIL` 검토 |
| TC-008-03 | Space 키로 점프 | 플레이어 y좌표가 감소한다. | `state.json`, `timeline.json` | 입력 연결 불일치 시 `PRODUCT_FAIL` 후보 |
| TC-008-04 | Restart 버튼 클릭 | 점수 초기화와 running 상태를 확인한다. | `screenshot.png`, `state.json` | locator 문제는 `TEST_FAIL`, 상태 불일치는 `PRODUCT_FAIL` 후보 |

## 5순위: 게임 루프 장시간 안정성

### 선정 이유

장시간 루프는 상태 안정성, 점수 증가, 장애물 제거 누락 같은 누적 문제를 찾는 데 유용하다.

하지만 단순 기능 기대결과보다 비기능 성격이 강하므로 Sprint 2 후반 또는 이후 Sprint에서 진행한다.

### 후보 TC

| 테스트 ID | 시나리오 | Expected Result | 주요 Evidence | 분류 기준 |
| --- | --- | --- | --- | --- |
| TC-003-03 | 장시간 루프 진행 | 잘못된 상태 없이 안정적으로 유지된다. | `timeline.json`, `state.json` | 원인 불명확 시 `REVIEW_REQUIRED` |
| TC-003-04 | 게임오버 후 루프 진행 | 점수와 이동이 계속되지 않는다. | `state.json`, `timeline.json` | 정지 기준 불일치 시 `PRODUCT_FAIL` 후보 |

## 최종 선정

Sprint 2 기능 테스트의 첫 구현 대상은 `TC-GROUP-06 점수 및 기록`으로 한다.

이유는 다음과 같다.

- expected/actual 비교가 명확하다.
- 실패 판단 근거를 `metadata.json`과 `timeline.json`에 남기기 쉽다.
- 제품 코드를 수정하지 않고 기존 하네스 API로 구현할 가능성이 높다.
- Agent Loop가 `PRODUCT_FAIL`, `REVIEW_REQUIRED`, `RETRY`, `STOP` 판단을 설명하기 좋다.

## 다음 실행 작업

1. `docs/test-cases/score-record.md`를 상세 TC 형식으로 확장한다.
2. 점수 오차 허용 기준을 문서에 먼저 명시한다.
3. `TC-006-01`부터 하네스 기반 단위 테스트를 구현한다.
4. 실패 시 `timeline.json`에 점수 기준 불합 정보를 남길 수 있도록 evidence 예시를 추가한다.
5. 구현 후 `npm test`를 실행하고 결과를 `docs/test-report.md`에 기록한다.
