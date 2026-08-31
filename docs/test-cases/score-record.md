# 점수 및 기록 테스트 케이스

## 개요

| 항목 | 내용 |
| --- | --- |
| 그룹 ID | TC-GROUP-06 |
| 대분류 | 점수 및 기록 |
| 우선순위 | Medium |
| 주요 기법 | 결정 테이블, 상태 전이 |
| 목적 | 점수 증가와 최고 기록 동작을 검증한다. |

## 테스트 베이시스

| 항목 | 내용 |
| --- | --- |
| 관련 리스크 | 점수와 최고 기록이 잘못 계산되면 사용자 성과 피드백과 재도전 동기가 영향을 받는다. |
| 테스트 대상 | `GameEngine`의 점수 증가, 게임오버 시 최고 기록 갱신, 재시작 시 기록 유지 동작 |
| 테스트 레벨 | Harness 기반 Unit Test |
| 자동화 방식 | `GameHarness`로 running 상태와 프레임 진행, 충돌 조건을 결정적으로 제어 |

## 점수 계산 기준

점수는 실제 벽시계 시간이 아니라 `tick(deltaSeconds)`에 전달된 경과 시간으로 계산한다.

현재 점수 증가 기준은 다음과 같다.

```text
score += deltaSeconds * 12
```

하네스는 `runForSeconds(1)`을 기본 60fps 기준으로 다음처럼 시뮬레이션한다.

```text
1초 = 60프레임
1프레임 = 1 / 60초
tick(1 / 60)을 60회 실행
```

이론상 1초 생존 시 내부 점수는 `12`가 된다. 다만 `getState()`는 표시 점수로 `Math.floor(score)`를 반환한다. 부동소수점 누적 오차로 내부 값이 `11.999999999`처럼 계산될 수 있으므로, 1초 생존 후 표시 점수의 허용 범위는 `11 이상 12 이하`로 둔다.

이 허용 범위는 실패를 피하기 위한 assertion 완화가 아니라, 표시 점수 산출 방식과 부동소수점 계산 특성을 테스트 기준에 반영한 것이다.

## 테스트 설계 기준

| 기준 | 적용 |
| --- | --- |
| 결정 테이블 | 현재 점수와 최고 기록의 관계에 따라 최고 기록 갱신 여부를 검증한다. |
| 상태 전이 | `running`, `gameOver`, `restart` 상태에서 점수와 최고 기록의 변화를 확인한다. |
| 경계 조건 | 현재 점수가 최고 기록보다 낮은 경우 최고 기록이 감소하지 않는지 확인한다. |
| 결정성 | 하네스로 시간 진행과 충돌 조건을 직접 제어해 실제 대기 시간을 사용하지 않는다. |

## 공통 PASS/FAIL 기준

- 제품 코드와 요구사항은 테스트 중 수정하지 않는다.
- 점수 증가, 최고 기록 갱신, 재시작 후 기록 유지 기준은 테스트 실행 중 변경하지 않는다.
- 1초 생존 점수의 허용 범위는 `11 이상 12 이하`로 고정한다.
- 동일 조건 재시도는 최대 3회까지만 허용한다.
- 실패 시 `state.json`, `timeline.json`, `metadata.json`에 expected와 actual을 남긴다.
- 점수 또는 최고 기록 expected와 actual이 다르면 `PRODUCT_FAIL` 후보로 본다.
- 시간 진행 조건이나 오차 허용 기준이 불명확하면 `REVIEW_REQUIRED`로 둔다.

## 상세 테스트 케이스

### TC-006-01 1초 생존 시 점수 증가

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-006-01 |
| Test Condition | running 상태에서 1초를 시뮬레이션하면 점수가 증가해야 한다. |
| 사전 조건 | 게임 상태는 `running`이다. |
| 절차 | `runForSeconds(1)`을 실행한다. |
| Expected Result | 표시 점수는 `11 이상 12 이하`이다. |
| Evidence | `state.json`, `timeline.json`, `metadata.json` |
| Classification Basis | 점수가 허용 범위 밖이면 `PRODUCT_FAIL` 후보이다. 시간 진행 조건이 불명확하면 `REVIEW_REQUIRED`로 둔다. |

### TC-006-02 점수 획득 후 게임오버 시 최고 기록 갱신

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-006-02 |
| Test Condition | 현재 점수가 최고 기록보다 높을 때 게임오버가 발생하면 최고 기록이 갱신되어야 한다. |
| 사전 조건 | 게임 상태는 `running`이고, 점수가 0보다 크다. |
| 절차 | `runForFrames(120)`으로 점수를 얻은 뒤 `placeObstacleAtPlayer()`와 `runForFrames(1)`을 실행한다. |
| Expected Result | 상태는 `gameOver`이고, `bestScore`는 게임오버 시점의 표시 점수와 같다. |
| Evidence | `state.json`, `timeline.json`, `metadata.json` |
| Classification Basis | 게임오버 이후 `bestScore`가 현재 점수와 다르면 `PRODUCT_FAIL` 후보이다. |

### TC-006-03 최고 기록 후 재시작 시 기록 유지

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-006-03 |
| Test Condition | 최고 기록이 있는 상태에서 재시작하면 현재 점수는 초기화되고 최고 기록은 유지되어야 한다. |
| 사전 조건 | 게임오버로 최고 기록이 저장되어 있다. |
| 절차 | 점수 획득 후 게임오버를 만든 다음 `restart()`를 호출한다. |
| Expected Result | 상태는 `running`, 현재 점수는 `0`, 최고 기록은 재시작 전 기록과 같다. |
| Evidence | `state.json`, `timeline.json`, `metadata.json` |
| Classification Basis | 재시작 후 최고 기록이 사라지거나 현재 점수가 0이 아니면 `PRODUCT_FAIL` 후보이다. |

### TC-006-04 낮은 점수로 재게임오버 시 최고 기록 보존

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-006-04 |
| Test Condition | 두 번째 플레이의 점수가 기존 최고 기록보다 낮으면 최고 기록은 감소하지 않아야 한다. |
| 사전 조건 | 첫 번째 플레이에서 최고 기록이 저장되어 있다. |
| 절차 | 첫 번째 플레이에서 높은 점수로 게임오버를 만들고, 재시작 후 더 낮은 점수로 다시 게임오버를 만든다. |
| Expected Result | 두 번째 게임오버 후 `bestScore`는 첫 번째 최고 기록과 같다. |
| Evidence | `state.json`, `timeline.json`, `metadata.json` |
| Classification Basis | 낮은 점수로 최고 기록이 덮어써지면 `PRODUCT_FAIL` 후보이다. |

## Evidence 기준

- `state.json`
- `timeline.json`
- `metadata.json`

## Timeline 기록 예시

```json
{
  "type": "criterion",
  "testCaseId": "TC-006-01",
  "evaluationTarget": "1초 생존 시 표시 점수",
  "passCriteria": "score >= 11 && score <= 12",
  "expected": {
    "scoreRange": "11 이상 12 이하"
  },
  "actual": {
    "score": 12
  },
  "comparison": {
    "expectedResult": "11 <= score <= 12",
    "actualResult": "score = 12"
  },
  "passed": true
}
```

## Classification Basis 방향

- 점수 또는 최고 기록 expected와 actual이 다르면 `PRODUCT_FAIL` 후보이다.
- 테스트가 running 상태나 게임오버 조건을 잘못 만들면 `TEST_FAIL` 후보이다.
- 시간 진행 조건, FPS, 표시 점수 내림 기준이 불명확하면 `REVIEW_REQUIRED`로 둔다.

## 구현 상태

이 그룹은 Sprint 2 두 번째 기능 테스트 구현 대상으로 선정되었다.

현재 `TC-006-01`, `TC-006-02`, `TC-006-03`, `TC-006-04`는 하네스 기반 단위 테스트로 구현되었다.
