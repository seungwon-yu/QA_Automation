# 테스트 케이스 지도

무엇을 검증하는가: [게임 규칙](game-rules.md). 왜 먼저 하는가: [리스크](risk-analysis.md). 어떻게 재현하는가: 아래 상세 TC. 어떤 결과인가: [실행 리포트](test-report.md).

| 그룹 | 상세 |
| --- | --- |
| 초기화 및 상태 | [문서](test-cases/initial-state-management.md) |
| 입력과 점프 | [문서](test-cases/player-input-movement.md) |
| 프레임과 진행 | [문서](test-cases/game-loop-progression.md) |
| 장애물 생성과 이동 | [문서](test-cases/obstacle-spawn-movement.md) |
| 충돌 경계와 게임오버 | [문서](test-cases/collision-game-over.md) |
| 점수와 기록 | [문서](test-cases/score-record.md) |
| 복합 회귀 흐름 | [문서](test-cases/regression-flow.md) |
| 브라우저 입력 연결 | [문서](test-cases/browser-e2e.md) |

공통 기록: TC ID, 테스트 베이시스, 사전조건, 행동, 기대값, 실제 관찰값, 결과, 증거 경로, 판단 근거. expectation과 실제 로그는 분리한다. [추적표](traceability-matrix.md)
