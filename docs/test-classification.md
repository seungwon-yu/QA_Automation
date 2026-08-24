# Test Classification

## Purpose

This document defines the large test groups before adding many detailed test cases.

The goal is to make automation work traceable from QA intent to harness capability and test code.

## Group Overview

| Group ID | Large Category | Priority | Main Technique |
| --- | --- | --- | --- |
| TC-GROUP-01 | 초기화 및 상태 관리 | High | 상태 전이 테스팅 |
| TC-GROUP-02 | 입력 및 플레이어 동작 | High | 상태 전이, 동등 분할 |
| TC-GROUP-03 | 게임 루프 진행 | High | 리그레션, 비기능 테스트 |
| TC-GROUP-04 | 장애물 생성 및 이동 | Medium | 동등 분할, 경계값 분석 |
| TC-GROUP-05 | 충돌 및 게임오버 | High | 경계값 분석, 상태 전이 |
| TC-GROUP-06 | 점수 및 기록 | Medium | 결정 테이블, 상태 전이 |
| TC-GROUP-07 | 리그레션 플로우 | Medium | 확인 테스팅, 리그레션 |
| TC-GROUP-08 | 브라우저 E2E | Low | 시스템 테스트 |

## TC-GROUP-01 Initialization And State Management

### Purpose

Verify that the game starts, stops, and resets through valid state transitions.

### Candidate Test Cases

| Test ID | Scenario | Expected Result |
| --- | --- | --- |
| TC-001-01 | Create game engine | Status is `ready` and score is `0`. |
| TC-001-02 | Start game | Status changes from `ready` to `running`. |
| TC-001-03 | Restart game | Score resets and status becomes `running`. |
| TC-001-04 | Game over state | Status remains `gameOver` after collision. |

## TC-GROUP-02 Input And Player Behavior

### Purpose

Verify player input and movement rules.

### Candidate Test Cases

| Test ID | Scenario | Expected Result |
| --- | --- | --- |
| TC-002-01 | Jump from ground | Player moves upward and becomes airborne. |
| TC-002-02 | Jump while airborne | Second jump is rejected. |
| TC-002-03 | Landing after jump | Player returns to ground after enough loop frames. |
| TC-002-04 | Jump after landing | Player can jump again after landing. |

## TC-GROUP-03 Game Loop Progression

### Purpose

Verify behavior that depends on repeated frame updates.

### Candidate Test Cases

| Test ID | Scenario | Expected Result |
| --- | --- | --- |
| TC-003-01 | Run for fixed frames | Elapsed state changes predictably. |
| TC-003-02 | Run for seconds | Score increases according to simulated time. |
| TC-003-03 | Long loop run | Game remains stable without invalid state. |
| TC-003-04 | Loop after game over | Score and movement do not continue unexpectedly. |

## TC-GROUP-04 Obstacle Spawn And Movement

### Purpose

Verify obstacle creation, movement, cleanup, and deterministic random behavior.

### Candidate Test Cases

| Test ID | Scenario | Expected Result |
| --- | --- | --- |
| TC-004-01 | Force obstacle creation | Obstacle is added to state. |
| TC-004-02 | Run loop after obstacle creation | Obstacle moves left. |
| TC-004-03 | Obstacle exits screen | Obstacle is removed from state. |
| TC-004-04 | Fixed random source | Generated obstacle dimensions are predictable. |

## TC-GROUP-05 Collision And Game Over

### Purpose

Verify collision detection and game-over state transitions.

### Candidate Test Cases

| Test ID | Scenario | Expected Result |
| --- | --- | --- |
| TC-005-01 | Obstacle intersects player | Status changes to `gameOver`. |
| TC-005-02 | Obstacle does not intersect player | Status remains `running`. |
| TC-005-03 | Collision boundary overlap | Boundary behavior matches the collision rule. |
| TC-005-04 | Restart after collision | Status becomes `running` and score resets. |

## TC-GROUP-06 Score And Record

### Purpose

Verify score progression and best score behavior.

### Candidate Test Cases

| Test ID | Scenario | Expected Result |
| --- | --- | --- |
| TC-006-01 | Survive for one second | Score increases. |
| TC-006-02 | Game over after scoring | Best score is updated. |
| TC-006-03 | Restart after best score | Best score remains. |
| TC-006-04 | Lower second score | Best score does not decrease. |

## TC-GROUP-07 Regression Flow

### Purpose

Verify core gameplay flows repeatedly after changes.

### Candidate Test Cases

| Test ID | Scenario | Expected Result |
| --- | --- | --- |
| TC-007-01 | Start, jump, land, score | Flow completes without game over. |
| TC-007-02 | Collision, restart, replay | Restarted session behaves normally. |
| TC-007-03 | Repeat core flow multiple times | State remains stable across repetitions. |

## TC-GROUP-08 Browser E2E

### Purpose

Verify that browser UI controls are connected to the engine and displayed state.

### Candidate Test Cases

| Test ID | Scenario | Expected Result |
| --- | --- | --- |
| TC-008-01 | Page load | Canvas and controls are visible. |
| TC-008-02 | Start button | QA state panel shows `running`. |
| TC-008-03 | Space key jump | Player y-position decreases. |
| TC-008-04 | Restart button | Score resets and state returns to `running`. |

## Sprint 1 Scope

The first automation expansion should cover:

- TC-GROUP-01 Initialization And State Management
- TC-GROUP-02 Input And Player Behavior
- TC-GROUP-03 Game Loop Progression
- TC-GROUP-05 Collision And Game Over

## Harness Features Needed For Sprint 1

| Feature | Supports |
| --- | --- |
| `runForFrames(frames)` | Frame-based loop tests |
| `runForSeconds(seconds, fps)` | Time-based loop tests |
| `runUntil(condition, maxFrames)` | Landing and state transition tests |
| `placeObstacleAtPlayer()` | Collision tests |
| `getTimeline()` | Loop observation and debugging |
