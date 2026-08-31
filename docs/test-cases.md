# 테스트 케이스 목차

## 목적

이 문서는 테스트 케이스 상세 문서의 목차 역할을 한다.

각 TC 대분류의 상세 내용은 `docs/test-cases/` 아래에 분리한다. 파일명은 `GROUP-01` 같은 번호 중심 이름보다, 해당 대분류가 무엇을 검증하는지 드러나는 이름을 사용한다.

## 작성 기준

각 테스트 케이스 문서는 다음 항목을 기준으로 작성한다.

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

## 대분류별 문서

| 대분류 | 문서 | 현재 상태 |
| --- | --- | --- |
| 초기화 및 상태 관리 | [initial-state-management.md](test-cases/initial-state-management.md) | 후보 TC 정리 |
| 입력 및 플레이어 동작 | [player-input-movement.md](test-cases/player-input-movement.md) | 후보 TC 정리 |
| 게임 루프 진행 | [game-loop-progression.md](test-cases/game-loop-progression.md) | 후보 TC 정리 |
| 장애물 생성 및 이동 | [obstacle-spawn-movement.md](test-cases/obstacle-spawn-movement.md) | 상세 TC 정리 |
| 충돌 및 게임오버 | [collision-game-over.md](test-cases/collision-game-over.md) | 상세 TC 정리 |
| 점수 및 기록 | [score-record.md](test-cases/score-record.md) | 상세 TC 정리 |
| 리그레션 플로우 | [regression-flow.md](test-cases/regression-flow.md) | 후보 TC 정리 |
| 브라우저 E2E | [browser-e2e.md](test-cases/browser-e2e.md) | 상세 TC 정리 |

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

Sprint 2에서는 Agent Loop 판단 근거와 직접 연결되는 다음 문서를 우선 상세화했다.

| 문서 | 이유 |
| --- | --- |
| [collision-game-over.md](test-cases/collision-game-over.md) | 제품 동작 불일치인 `PRODUCT_FAIL`을 설명하기 가장 좋음 |
| [browser-e2e.md](test-cases/browser-e2e.md) | 실제 브라우저 E2E와 evidence 저장 흐름을 검증하기 좋음 |

나머지 그룹은 이후 Sprint에서 같은 형식으로 확장한다.

## Sprint 2 기능 테스트 후보 선정

Sprint 2 기능 테스트 후보와 구현 우선순위는 `docs/sprint-2-feature-test-candidates.md`에 정리한다.

첫 구현 대상은 `TC-GROUP-04 장애물 생성 및 이동`이다.

선정 이유는 장애물이 게임 진행, 충돌, 난이도에 직접 영향을 주는 핵심 리스크이며, 경계값 분석과 동등 분할을 적용하기 좋은 테스트 조건이기 때문이다.
