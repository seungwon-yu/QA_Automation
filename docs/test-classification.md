# 테스트 분류

제품 규칙 검증과 자동화 도구 검증을 구분한다.

| 그룹 | 목적 | 설계 |
| --- | --- | --- |
| TC-GROUP-01 | 초기화 및 상태 | [TC](test-cases/initial-state-management.md) |
| TC-GROUP-02 | 입력과 점프 | [TC](test-cases/player-input-movement.md) |
| TC-GROUP-03 | 프레임과 진행 | [TC](test-cases/game-loop-progression.md) |
| TC-GROUP-04 | 장애물 생성과 이동 | [TC](test-cases/obstacle-spawn-movement.md) |
| TC-GROUP-05 | 충돌 경계와 게임오버 | [TC](test-cases/collision-game-over.md) |
| TC-GROUP-06 | 점수와 기록 | [TC](test-cases/score-record.md) |
| TC-GROUP-07 | 복합 회귀 흐름 | [TC](test-cases/regression-flow.md) |
| TC-GROUP-08 | 브라우저 입력 연결 | [TC](test-cases/browser-e2e.md) |

HAR/DIAG/EVID는 하네스·분류·증거 신뢰성 검증, EXP는 인위적 결함 검출 실험이다. 테스트 수로 제품 기능 커버리지를 대신하지 않는다. 상태 전이·경계값 기법은 구체적 데이터가 있는 TC에서만 적용했다고 설명한다.
