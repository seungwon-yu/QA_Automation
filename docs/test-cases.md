# Test Cases

| ID | Objective | Preconditions | Steps | Expected Result |
| --- | --- | --- | --- | --- |
| TC-001 | Verify initial state | Page loaded | Inspect engine state | Status is `ready`, score is `0` |
| TC-002 | Verify game start | Initial state | Click Start | Status changes to `running` |
| TC-003 | Verify jump | Game running | Press Space | Player y-position decreases and grounded is false |
| TC-004 | Verify collision | Game running | Place obstacle at player position and tick loop | Status changes to `gameOver` |
| TC-005 | Verify scoring | Game running | Advance loop for 120 frames | Score is greater than `0` |
| TC-006 | Verify restart | Game over or running | Click Restart | Status is `running`, score is `0` |
