# Risk Analysis

| Risk | Likelihood | Impact | Test Response |
| --- | --- | --- | --- |
| Jump state breaks after physics changes | Medium | High | Harness loop validates y-position and grounded state |
| Collision detection misses edge cases | Medium | High | Forced obstacle placement validates intersection behavior |
| Score continues after game over | Low | Medium | Add regression test for score freeze after collision |
| Browser controls drift from engine behavior | Medium | Medium | Playwright verifies real page controls and exposed state |
