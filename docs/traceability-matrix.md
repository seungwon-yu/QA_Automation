# 기준→TC→코드→결과 추적

TC-001-04는 TC-002-06이 같은 상태 불변 계약을 검증한다. 같은 테스트를 서로 다른 실행 건수로 중복 집계하지 않는다.

| TC | 규칙 | 설계 | 구현 | 상태 |
| --- | --- | --- | --- | --- |
| TC-001-01 | RULE-STATE/RULE-RESTART | [설계](test-cases/initial-state-management.md) | [코드](../tests/unit/gameEngine.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-001-02 | RULE-STATE/RULE-RESTART | [설계](test-cases/initial-state-management.md) | [코드](../tests/unit/gameEngine.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-001-03 | RULE-STATE/RULE-RESTART | [설계](test-cases/initial-state-management.md) | [코드](../tests/unit/portfolioRegression.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-001-04 | RULE-STATE/RULE-RESTART | [설계](test-cases/initial-state-management.md) | [코드](../tests/unit/portfolioRegression.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-001-05 | RULE-STATE/RULE-RESTART | [설계](test-cases/initial-state-management.md) | [코드](../tests/unit/portfolioRegression.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-002-01 | RULE-JUMP | [설계](test-cases/player-input-movement.md) | [코드](../tests/unit/gameEngine.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-002-02 | RULE-JUMP | [설계](test-cases/player-input-movement.md) | [코드](../tests/unit/gameEngine.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-002-03 | RULE-JUMP | [설계](test-cases/player-input-movement.md) | [코드](../tests/unit/gameEngine.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-002-04 | RULE-JUMP | [설계](test-cases/player-input-movement.md) | [코드](../tests/unit/gameEngine.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-002-05 | RULE-JUMP | [설계](test-cases/player-input-movement.md) | [코드](../tests/unit/portfolioRegression.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-002-06 | RULE-JUMP | [설계](test-cases/player-input-movement.md) | [코드](../tests/unit/portfolioRegression.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-003-01 | RULE-LOOP/RULE-SCORE | [설계](test-cases/game-loop-progression.md) | [코드](../tests/unit/gameEngine.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-003-02 | RULE-LOOP/RULE-SCORE | [설계](test-cases/game-loop-progression.md) | [코드](../tests/unit/gameEngine.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-003-04 | RULE-LOOP/RULE-SCORE | [설계](test-cases/game-loop-progression.md) | [코드](../tests/unit/gameEngine.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| HAR-001 | RULE-LOOP/RULE-SCORE | [설계](test-cases/game-loop-progression.md) | [코드](../tests/unit/portfolioRegression.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| HAR-002 | RULE-LOOP/RULE-SCORE | [설계](test-cases/game-loop-progression.md) | [코드](../tests/unit/portfolioRegression.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| HAR-003 | RULE-LOOP/RULE-SCORE | [설계](test-cases/game-loop-progression.md) | [코드](../tests/unit/portfolioRegression.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-004-01 | RULE-OBSTACLE | [설계](test-cases/obstacle-spawn-movement.md) | [코드](../tests/unit/gameEngine.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-004-02 | RULE-OBSTACLE | [설계](test-cases/obstacle-spawn-movement.md) | [코드](../tests/unit/gameEngine.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-004-03 | RULE-OBSTACLE | [설계](test-cases/obstacle-spawn-movement.md) | [코드](../tests/unit/gameEngine.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-004-04 | RULE-OBSTACLE | [설계](test-cases/obstacle-spawn-movement.md) | [코드](../tests/unit/gameEngine.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-005-01 | RULE-COLLISION | [설계](test-cases/collision-game-over.md) | [코드](../tests/unit/gameEngine.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-005-02 | RULE-COLLISION | [설계](test-cases/collision-game-over.md) | [코드](../tests/unit/gameEngine.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-005-03 | RULE-COLLISION | [설계](test-cases/collision-game-over.md) | [코드](../tests/unit/portfolioRegression.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-005-04 | RULE-COLLISION | [설계](test-cases/collision-game-over.md) | [코드](../tests/unit/gameEngine.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-005-05 | RULE-COLLISION | [설계](test-cases/collision-game-over.md) | [코드](../tests/unit/portfolioRegression.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-006-01 | RULE-SCORE/RULE-RESTART | [설계](test-cases/score-record.md) | [코드](../tests/unit/gameEngine.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-006-02 | RULE-SCORE/RULE-RESTART | [설계](test-cases/score-record.md) | [코드](../tests/unit/gameEngine.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-006-03 | RULE-SCORE/RULE-RESTART | [설계](test-cases/score-record.md) | [코드](../tests/unit/gameEngine.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-006-04 | RULE-SCORE/RULE-RESTART | [설계](test-cases/score-record.md) | [코드](../tests/unit/gameEngine.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-007-01 | RULE-STATE/RULE-JUMP/RULE-RESTART | [설계](test-cases/regression-flow.md) | [코드](../tests/unit/gameEngine.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-007-02 | RULE-STATE/RULE-JUMP/RULE-RESTART | [설계](test-cases/regression-flow.md) | [코드](../tests/unit/gameEngine.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-007-03 | RULE-STATE/RULE-JUMP/RULE-RESTART | [설계](test-cases/regression-flow.md) | [코드](../tests/unit/gameEngine.test.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-008-01 | RULE-STATE/RULE-JUMP/RULE-RESTART | [설계](test-cases/browser-e2e.md) | [코드](../tests/e2e/runner.spec.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-008-02 | RULE-STATE/RULE-JUMP/RULE-RESTART | [설계](test-cases/browser-e2e.md) | [코드](../tests/e2e/runner.spec.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-008-03 | RULE-STATE/RULE-JUMP/RULE-RESTART | [설계](test-cases/browser-e2e.md) | [코드](../tests/e2e/runner.spec.js) | 구현됨 / 최신 결과는 실행 리포트 |
| TC-008-04 | RULE-STATE/RULE-JUMP/RULE-RESTART | [설계](test-cases/browser-e2e.md) | [코드](../tests/e2e/runner.spec.js) | 구현됨 / 최신 결과는 실행 리포트 |

DIAG-001~004는 portfolioRegression.test.js, 기존 Agent Loop는 agentLoop.test.js에서 검증한다. 현재 실행 결과는 [리포트](test-report.md), 원격 CI와 제외 범위는 [완성도](completion-review.md)에 있다.
