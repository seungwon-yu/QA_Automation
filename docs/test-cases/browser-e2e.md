# TC-GROUP-08: 브라우저 입력 연결

검증 근거: [게임 규칙](../game-rules.md)의 RULE-STATE/RULE-JUMP/RULE-RESTART. 최신 통과 여부는 [실행 리포트](../test-report.md)에 기록한다.

## 사전조건·관찰·판단

각 단위 테스트는 새 GameHarness를 사용하고 기본 랜덤을 고정한다. 브라우저 테스트는 새 page에서 시작한다. 절차의 행동을 수행한 뒤 기대값을 비교한다. 실패하면 입력 조건·이전/이후 상태·원본 assertion을 확보해 제품/하네스/환경을 구분한다. 단위 테스트는 자동 screenshot 저장 대상이 아니다.

| TC | 절차 | 기대결과 |
| --- | --- | --- |
| TC-008-01 | 페이지 진입 | canvas/버튼 표시 |
| TC-008-02 | Start 버튼 클릭 | UI와 상태 running |
| TC-008-03 | Space 키 입력 | 플레이어 y 감소 |
| TC-008-04 | 점수 획득 후 Restart 버튼 | UI/상태 running, score=0 |

## 재현 근거

TC ID로 코드 테스트를 찾고 같은 좌표·상태·프레임으로 재실행한다. 실행별 actual은 원본 결과 또는 브라우저 evidence에서 확인하며 이 설계표에 통과값을 미리 적지 않는다.

## 제품 TC와 분리한 도구 실험

TC-008-EVIDENCE-001(기존 증거 샘플), TC-008-06(locator 모호성), TC-008-07(연결 실패), EXP-001(충돌 결함 주입), EVID-001(페이지 종료 후 캡처 실패)을 별도 명령으로 실행한다. 정상 E2E 개수에 합산하지 않는다. [runbook](../agent-loop-runbook.md)

TC-008-04는 browser clock을 정지하고 시작 후 200ms, 재시작 후 HUD 갱신 16ms만 진행한다. 검증 중 시간 경과로 0점이 1점이 되는 경쟁을 제거한다.
