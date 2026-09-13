# 검증 기준: 러너 게임 규칙

이 문서는 학습용 게임의 테스트 계약이다. 외부 제품 명세가 아니며, 2026-09-13에 현재 의도된 동작을 명문화했다. 향후 규칙 변경은 먼저 이 문서와 TC를 검토하고 실행 도중 기대결과를 바꾸지 않는다.

| ID | 규칙 | 확인 방법 |
| --- | --- | --- |
| RULE-STATE | 생성 시 ready·0점·지면·장애물 없음. Start는 ready만 running으로 전환 | 초기/상태 전이 TC |
| RULE-JUMP | ready에서 Jump는 시작과 점프. running+지면은 상승, 공중·gameOver는 점프 거부 | 상태별 입력 |
| RULE-COLLISION | 플레이어의 각 경계에서 5px 안쪽을 사용. 장애물과 양 축에서 엄격하게 겹치면 충돌, 접촉만 하면 비충돌 | 좌표 고정 경계표 |
| RULE-LOOP | ready/gameOver에서는 tick으로 게임 상태가 바뀌지 않음 | 전후 전체 상태 |
| RULE-SCORE | running에서 유효 시뮬레이션 시간×12 누적, 표시는 내림. 1초 60프레임 누적 표현 오차에 따른 표시 11~12 허용 | 1초 진행·gameOver 정지 |
| RULE-RESTART | 재시작 시 running·0점·시작 플레이어·장애물 없음. 최고 기록 보존 | 충돌 후 재시작 |
| RULE-OBSTACLE | 왼쪽 이동. 오른쪽 끝이 -10 이하이면 제거. 랜덤 높이 34~61, 너비 22~37 | 고정 랜덤·좌표 관찰 |
| RULE-TIME | 단일 tick의 시간 상한은 0.05초. 하네스 기본 60fps이며 장시간 실제 성능을 대변하지 않음 | 제어 범위 설명 |

## 상태 전이

| 현재 | 행동 | 기대 |
| --- | --- | --- |
| ready | Start | running, 0점 |
| ready | Jump | running, 공중 |
| running·지면 | Jump | 음수 수직 속도, 이후 상승 |
| running·공중 | Jump | 기존 수직 속도 유지 |
| gameOver | Start 또는 Jump | 상태 불변 |
| gameOver | Restart | running·초기화, 최고 기록 유지 |

규칙별 코드·TC 연결은 [추적표](traceability-matrix.md)에 있다. 렌더링 정상 여부는 엔진 상태만으로 보장하지 않으므로 브라우저 검증을 별도로 둔다.
