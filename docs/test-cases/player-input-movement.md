# 입력 및 플레이어 동작 테스트 케이스

## 개요

| 항목 | 내용 |
| --- | --- |
| 그룹 ID | TC-GROUP-02 |
| 대분류 | 입력 및 플레이어 동작 |
| 우선순위 | High |
| 주요 기법 | 상태 전이, 동등 분할 |
| 목적 | 플레이어 입력과 이동 규칙을 검증한다. |

## 테스트 베이시스

| 항목 | 내용 |
| --- | --- |
| 관련 리스크 | 점프 입력과 착지 규칙이 깨지면 플레이어가 장애물을 회피할 수 없거나 비정상적인 연속 점프가 가능해진다. |
| 테스트 대상 | `GameEngine`의 점프 입력, 공중 상태, 착지, 재점프 동작 |
| 테스트 레벨 | Harness 기반 Unit Test, 추후 Browser E2E |
| 자동화 방식 | `GameHarness`로 점프 명령과 프레임 진행을 결정적으로 제어 |

## 테스트 설계 기준

| 기준 | 적용 |
| --- | --- |
| 상태 전이 | 지상, 공중, 착지 후 상태 변화를 검증한다. |
| 동등 분할 | 점프 가능한 지상 상태와 점프 불가능한 공중 상태를 구분한다. |
| 경계 조건 | 착지 직후 다시 점프 가능한지 확인한다. |
| 테스트 레벨 분리 | 엔진 점프 규칙은 Unit, 실제 키 입력 전달은 E2E에서 검증한다. |

## 공통 PASS/FAIL 기준

- 제품 코드와 요구사항은 테스트 중 수정하지 않는다.
- 점프 가능 조건과 중복 점프 금지 기준은 테스트 실행 중 변경하지 않는다.
- 실패 시 `state.json`, `metadata.json`, 필요 시 `timeline.json`에 expected와 actual을 남긴다.
- 입력 명령이 정상 전달됐는데 플레이어 상태가 expected와 다르면 `PRODUCT_FAIL` 후보로 본다.
- 브라우저 포커스, 키 입력 전달, locator 문제가 있으면 `TEST_FAIL` 후보로 본다.
- 입력 전달 여부를 확인할 근거가 부족하면 `REVIEW_REQUIRED`로 둔다.

## 상세 테스트 케이스

### TC-002-01 지상에서 점프

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-002-01 |
| Test Condition | 지상에 있는 플레이어는 점프 입력 후 위로 이동하고 공중 상태가 되어야 한다. |
| 사전 조건 | 게임 상태는 `running`이고 플레이어는 지면에 있다. |
| 절차 | 초기 y좌표를 기록하고 `pressJump()`, `runForFrames(6)`을 실행한다. |
| Expected Result | 플레이어 y좌표가 감소하고 `isGrounded`는 `false`이다. |
| Evidence | `state.json`, `metadata.json`, `timeline.json` |
| Classification Basis | 입력 후 위치가 변하지 않거나 공중 상태가 아니면 `PRODUCT_FAIL` 후보이다. |

### TC-002-02 공중에서 중복 점프 거부

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-002-02 |
| Test Condition | 공중 상태에서는 두 번째 점프 입력이 적용되지 않아야 한다. |
| 사전 조건 | 게임 상태는 `running`이고 플레이어는 공중에 있다. |
| 절차 | 첫 점프 후 velocity를 기록하고 다시 `pressJump()`를 호출한다. |
| Expected Result | 두 번째 점프 후 `velocityY`가 첫 점프 이후 값과 동일하다. |
| Evidence | `state.json`, `metadata.json`, `timeline.json` |
| Classification Basis | 공중에서 velocity가 다시 점프 속도로 바뀌면 `PRODUCT_FAIL` 후보이다. |

### TC-002-03 점프 후 착지

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-002-03 |
| Test Condition | 점프 후 충분한 프레임이 지나면 플레이어는 지면에 착지해야 한다. |
| 사전 조건 | 게임 상태는 `running`이고 플레이어가 점프한 상태이다. |
| 절차 | `runUntil((state) => state.player.isGrounded, 180)`을 실행한다. |
| Expected Result | 조건이 max frame 안에 충족되고, 플레이어 y좌표는 `groundY - player.height`이다. |
| Evidence | `state.json`, `metadata.json`, `timeline.json` |
| Classification Basis | max frame 안에 착지하지 않으면 `PRODUCT_FAIL` 후보이다. |

### TC-002-04 착지 후 재점프

| 항목 | 내용 |
| --- | --- |
| 테스트 ID | TC-002-04 |
| Test Condition | 착지한 플레이어는 다시 점프할 수 있어야 한다. |
| 사전 조건 | 점프 후 착지 완료 상태이다. |
| 절차 | 착지 y좌표를 기록한 뒤 `pressJump()`, `runForFrames(6)`을 실행한다. |
| Expected Result | 플레이어 y좌표가 착지 y좌표보다 작고 `isGrounded`는 `false`이다. |
| Evidence | `state.json`, `metadata.json`, `timeline.json` |
| Classification Basis | 착지 후 재점프가 되지 않으면 `PRODUCT_FAIL` 후보이다. 착지 조건이 불명확하면 `REVIEW_REQUIRED`로 둔다. |

## Evidence 기준

- `state.json`
- `metadata.json`
- 필요 시 `timeline.json`
- 브라우저 입력 검증에서는 `screenshot.png`, `console-log.json`

## Timeline 기록 예시

```json
{
  "type": "criterion",
  "testCaseId": "TC-002-01",
  "evaluationTarget": "지상 점프 후 플레이어 상태",
  "passCriteria": "player.y < initialY && player.isGrounded === false",
  "expected": {
    "playerY": "initialY보다 작음",
    "isGrounded": false
  },
  "actual": {
    "playerY": 200,
    "isGrounded": false
  },
  "comparison": {
    "expectedResult": "player.y < initialY, isGrounded=false",
    "actualResult": "player.y=200, isGrounded=false"
  },
  "passed": true
}
```

## Classification Basis 방향

- 입력이 정상 전달됐고 플레이어 위치나 속도가 expected와 다르면 `PRODUCT_FAIL` 후보이다.
- 브라우저 포커스, 키 입력 전달, locator 문제가 있으면 `TEST_FAIL` 후보이다.
- 입력 전달 여부를 확인할 근거가 부족하면 `REVIEW_REQUIRED`로 둔다.

## 구현 상태

이 그룹은 Sprint 1 하네스 기반 단위 테스트로 구현되었다.

현재 `TC-002-01`, `TC-002-02`, `TC-002-03`, `TC-002-04`는 하네스 기반 단위 테스트로 구현되었다.
