# 게임 루프 진행 테스트 케이스

## 개요

| 항목 | 내용 |
| --- | --- |
| 그룹 ID | TC-GROUP-03 |
| 대분류 | 게임 루프 진행 |
| 우선순위 | High |
| 주요 기법 | 상태 전이, 리그레션, 비기능 테스트 |
| 목적 | 반복 프레임 업데이트에 의존하는 동작을 검증한다. |

## 테스트 베이시스

| 항목 | 내용 |
| --- | --- |
| 관련 리스크 | 루프 진행이 불안정하면 점수, 장애물 이동, 충돌, 착지 등 대부분의 게임 기능이 연쇄적으로 실패한다. |
| 테스트 대상 | `GameEngine.tick()`, `GameHarness.runForFrames()`, `runForSeconds()`, `runUntil()`, `getTimeline()` |
| 테스트 레벨 | Harness 기반 Unit Test |
| 자동화 방식 | 실제 시간 대기 없이 프레임과 delta time을 직접 주입해 결정적으로 검증 |

## 테스트 설계 기준

| 기준 | 적용 |
| --- | --- |
| 상태 전이 | running 상태에서 루프가 진행되고, gameOver 상태에서는 루프가 정지되는지 확인한다. |
| 리그레션 | 루프 진행이 점수, 장애물, 플레이어 상태에 영향을 주므로 반복 검증한다. |
| 비기능 테스트 | 장시간 루프 안정성은 이후 별도 안정성 테스트로 확장한다. |
| 결정성 | 실제 `requestAnimationFrame`이 아니라 하네스의 고정 프레임 진행을 사용한다. |

## 공통 PASS/FAIL 기준

- 제품 코드와 요구사항은 테스트 중 수정하지 않는다.
- frame 수, fps, seconds 기준은 테스트 실행 중 변경하지 않는다.
- 실패 시 `state.json`, `timeline.json`, `metadata.json`에 expected와 actual을 남긴다.
- 같은 frame/time 조건에서 expected와 actual이 다르면 `PRODUCT_FAIL` 후보로 본다.
- 루프 실행 조건이나 frame 수 설정이 잘못되면 `TEST_FAIL` 후보로 본다.
- 시간 기반 오차 허용 기준이 불명확하면 `REVIEW_REQUIRED`로 둔다.

## 상세 테스트 케이스

### TC-003-01 고정 프레임 진행

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-003-01 |
| Test Condition | 지정한 프레임 수만큼 게임 루프를 진행하면 timeline이 같은 수만큼 기록되어야 한다. |
| 사전 조건 | 게임 상태는 `running`이다. |
| 절차 | `runForFrames(30)`을 실행하고 `getTimeline()`을 확인한다. |
| Expected Result | timeline 길이는 `30`이다. |
| Evidence | `timeline.json`, `metadata.json` |
| Classification Basis | timeline 길이가 frame 수와 다르면 하네스 또는 루프 기록 문제로 `TEST_FAIL` 또는 `PRODUCT_FAIL` 후보를 검토한다. |

### TC-003-02 초 단위 진행

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-003-02 |
| Test Condition | 초 단위 진행은 고정 FPS의 프레임 진행으로 변환되어 점수를 증가시켜야 한다. |
| 사전 조건 | 게임 상태는 `running`이다. |
| 절차 | `runForSeconds(1)`을 실행한다. |
| Expected Result | 표시 점수는 `11 이상 12 이하`이다. |
| Evidence | `state.json`, `timeline.json`, `metadata.json` |
| Classification Basis | 점수가 허용 범위 밖이면 TC-GROUP-06 기준과 함께 `PRODUCT_FAIL` 후보를 검토한다. |

### TC-003-03 장시간 루프 진행

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-003-03 |
| Test Condition | 장시간 루프 진행 중 상태 값이 비정상 범위로 벗어나지 않아야 한다. |
| 사전 조건 | 게임 상태는 `running`이다. |
| 절차 | 장시간 또는 많은 프레임을 진행하며 상태 값을 관찰한다. |
| Expected Result | 상태는 정의된 값 안에 있고, 점수는 감소하지 않으며, 위치 값은 비정상 숫자가 아니다. |
| Evidence | `state.json`, `timeline.json`, `metadata.json` |
| Classification Basis | 실패 원인이 여러 기능에 걸치면 `REVIEW_REQUIRED`로 둔다. |
| 구현 상태 | 후속 안정성 테스트 후보 |

### TC-003-04 게임오버 후 루프 진행 정지

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-003-04 |
| Test Condition | 게임오버 이후 루프를 진행해도 점수와 이동이 의도치 않게 계속되지 않아야 한다. |
| 사전 조건 | 게임 상태는 `gameOver`이다. |
| 절차 | 충돌을 발생시켜 게임오버를 만든 뒤 `runForSeconds(2)`를 실행한다. |
| Expected Result | `status`는 `gameOver`이고, 점수는 게임오버 시점과 같다. |
| Evidence | `state.json`, `timeline.json`, `metadata.json` |
| Classification Basis | 게임오버 이후 점수가 증가하거나 상태가 바뀌면 `PRODUCT_FAIL` 후보이다. |

## Evidence 기준

- `state.json`
- `timeline.json`
- `metadata.json`

## Timeline 기록 예시

```json
{
  "type": "criterion",
  "testCaseId": "TC-003-01",
  "evaluationTarget": "고정 프레임 timeline 기록",
  "passCriteria": "runForFrames(30) 이후 timeline.length === 30",
  "expected": {
    "timelineLength": 30
  },
  "actual": {
    "timelineLength": 30
  },
  "comparison": {
    "expectedResult": "timeline.length=30",
    "actualResult": "timeline.length=30"
  },
  "passed": true
}
```

## Classification Basis 방향

- 같은 frame/time 조건에서 expected와 actual이 다르면 `PRODUCT_FAIL` 후보이다.
- 루프 실행 조건이나 frame 수 설정이 잘못되면 `TEST_FAIL` 후보이다.
- 시간 기반 오차 허용 기준이 불명확하면 `REVIEW_REQUIRED`로 둔다.

## 구현 상태

이 그룹은 Sprint 1 하네스 기반 단위 테스트로 대부분 구현되었다.

현재 `TC-003-01`, `TC-003-02`, `TC-003-04`는 하네스 기반 단위 테스트로 구현되었다. `TC-003-03`은 장시간 안정성 성격이 강하므로 후속 안정성 테스트 후보로 둔다.
