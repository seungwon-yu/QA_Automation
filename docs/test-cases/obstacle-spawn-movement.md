# 장애물 생성 및 이동 테스트 케이스

## 개요

| 항목 | 내용 |
| --- | --- |
| 그룹 ID | TC-GROUP-04 |
| 대분류 | 장애물 생성 및 이동 |
| 우선순위 | High |
| 주요 기법 | 동등 분할, 경계값 분석, 상태 전이 |
| 목적 | 장애물 생성, 이동, 제거, 랜덤 고정 동작을 검증한다. |

## 테스트 베이시스

| 항목 | 내용 |
| --- | --- |
| 관련 리스크 | 장애물이 생성되지 않거나 잘못 이동하면 게임 진행, 난이도, 충돌 판정이 모두 영향을 받는다. |
| 테스트 대상 | `GameEngine`의 장애물 생성, 강제 배치, 이동, 제거 동작 |
| 테스트 레벨 | Harness 기반 Unit Test |
| 자동화 방식 | `GameHarness`로 장애물 위치와 프레임 진행을 결정적으로 제어 |

## 테스트 설계 기준

| 기준 | 적용 |
| --- | --- |
| 동등 분할 | 화면 안 장애물, 플레이어 앞 장애물, 화면 밖 장애물을 구분한다. |
| 경계값 분석 | 장애물이 화면 왼쪽 제거 기준을 넘는 순간을 검증한다. |
| 상태 전이 | running 상태에서 장애물 상태가 생성, 이동, 제거되는 흐름을 확인한다. |
| 결정성 | 랜덤 소스를 고정해 장애물 크기를 예측 가능하게 만든다. |

## 공통 PASS/FAIL 기준

- 제품 코드와 요구사항은 테스트 중 수정하지 않는다.
- 장애물 위치, 크기, 이동, 제거 기준은 테스트 실행 중 변경하지 않는다.
- 동일 조건 재시도는 최대 3회까지만 허용한다.
- 실패 시 `state.json`, `timeline.json`, `metadata.json`에 expected와 actual을 남긴다.
- 장애물 조건을 테스트가 잘못 만든 경우 `TEST_FAIL` 후보로 본다.
- 제품 동작이 명시된 expected와 다르면 `PRODUCT_FAIL` 후보로 본다.
- 판단 근거가 부족하면 `REVIEW_REQUIRED`로 둔다.

## 상세 테스트 케이스

### TC-004-01 장애물 강제 생성

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-004-01 |
| Test Condition | 하네스가 플레이어 앞 특정 위치에 장애물을 배치할 수 있어야 한다. |
| 사전 조건 | 게임 상태는 `running`이다. |
| 절차 | `placeObstacleAhead(120, { width: 30, height: 50 })`를 호출한다. |
| Expected Result | 장애물 1개가 상태에 추가되고, x/y/width/height가 지정 기준과 일치한다. |
| Evidence | `state.json`, `timeline.json`, `metadata.json` |
| Classification Basis | 장애물 정보가 expected와 다르면 `PRODUCT_FAIL` 후보이다. 하네스 입력값이 잘못되면 `TEST_FAIL` 후보이다. |

### TC-004-02 장애물 이동

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-004-02 |
| Test Condition | running 상태에서 프레임이 진행되면 장애물은 왼쪽으로 이동해야 한다. |
| 사전 조건 | 게임 상태는 `running`이고, 플레이어 앞에 장애물이 1개 있다. |
| 절차 | 초기 장애물 x좌표를 기록하고 `runForFrames(10)`을 실행한다. |
| Expected Result | 실행 후 장애물 x좌표가 초기 x좌표보다 작다. |
| Evidence | `state.json`, `timeline.json`, `metadata.json` |
| Classification Basis | 프레임 진행 후 x좌표가 감소하지 않으면 `PRODUCT_FAIL` 후보이다. 게임이 running이 아니면 사전 조건 문제로 `TEST_FAIL` 후보이다. |

### TC-004-03 화면 밖 장애물 제거

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-004-03 |
| Test Condition | 장애물이 화면 왼쪽 제거 기준을 지나면 상태에서 제거되어야 한다. |
| 사전 조건 | 게임 상태는 `running`이고, 제거 경계 근처에 장애물이 있다. |
| 절차 | x좌표 `-25`, width `20`인 장애물을 배치하고 `runForFrames(1)`을 실행한다. |
| Expected Result | 장애물 배열이 비어 있다. |
| Evidence | `state.json`, `timeline.json`, `metadata.json` |
| Classification Basis | 제거 기준을 지난 장애물이 남아 있으면 `PRODUCT_FAIL` 후보이다. 제거 경계 설정 근거가 부족하면 `REVIEW_REQUIRED`로 둔다. |

### TC-004-04 고정 랜덤 소스

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-004-04 |
| Test Condition | 랜덤 소스를 고정하면 생성된 장애물 크기를 예측할 수 있어야 한다. |
| 사전 조건 | 하네스 생성 시 `rng`를 고정한다. |
| 절차 | `rng` 값을 `[0, 0.999, 0.123]` 순서로 제공하고 `spawnObstacle(480)`을 호출한다. |
| Expected Result | 장애물 x좌표는 `480`, height는 `34`, width는 `37`이다. |
| Evidence | `state.json`, `timeline.json`, `metadata.json` |
| Classification Basis | 고정 랜덤 조건에서 크기가 expected와 다르면 `PRODUCT_FAIL` 후보이다. 랜덤 호출 순서 근거가 부족하면 `REVIEW_REQUIRED`로 둔다. |

## Evidence 기준

- `state.json`
- `timeline.json`
- `metadata.json`

## Timeline 기록 예시

```json
{
  "type": "criterion",
  "testCaseId": "TC-004-02",
  "evaluationTarget": "장애물 x좌표 이동",
  "passCriteria": "프레임 진행 후 obstacle.x < initialObstacle.x",
  "expected": {
    "obstacleX": "initialObstacle.x보다 작음"
  },
  "actual": {
    "initialObstacleX": 350,
    "currentObstacleX": 297.5
  },
  "comparison": {
    "expectedResult": "obstacle.x < 350",
    "actualResult": "obstacle.x = 297.5"
  },
  "passed": true
}
```

## Classification Basis 방향

- 장애물 위치, 크기, 속도 expected와 actual이 다르면 `PRODUCT_FAIL` 후보이다.
- 테스트가 장애물 배치 조건을 잘못 만들면 `TEST_FAIL` 후보이다.
- 랜덤 소스 통제 근거가 부족하면 `REVIEW_REQUIRED`로 둔다.

## 구현 상태

이 그룹은 Sprint 2 첫 기능 테스트 구현 대상으로 선정되었다.

현재 `TC-004-01`, `TC-004-02`, `TC-004-03`, `TC-004-04`는 하네스 기반 단위 테스트로 구현되었다.
