# 재현을 위한 게임 하네스

하네스는 테스트의 도구이다. 목적은 정해진 입력·시간·장애물 조건으로 게임 문제를 재현하는 것이다. `GameHarness`가 `GameEngine`을 제어하며 엔진은 브라우저 없이 실행된다.

| API | 계약 |
| --- | --- |
| start / pressJump / restart | 게임 규칙의 입력 전달 |
| runForFrames / tick | 지정한 프레임 진행, 기본 fps 설정 사용 |
| runForSeconds | seconds×fps를 반올림한 프레임 수 진행 |
| runUntil | 초기 상태와 마지막 허용 프레임을 포함해 조건 검사, matched/frames/state 반환 |
| placeObstacle / placeObstacleAtPlayer / placeObstacleAhead | 명시적인 테스트 좌표 배치 |
| getState / getTimeline | 관찰용 복사 반환 |

```js
const result = new GameHarness().start().runUntil((state) => state.score > 0, 5);
// 마지막 허용 프레임에서도 matched=true여야 한다.
```

랜덤 기본값은 고정하고 장애물 ID는 인스턴스 내부 순번을 사용한다. 서로 다른 실제 시간에 실행해도 같은 랜덤·행동은 같은 상태를 만든다. 실제 브라우저 시간/프레임 성능은 별도 범위이다.
하네스가 관찰과 조작을 담당하고 assertion은 테스트에 둔다. API 확장보다 [경계 결함 사례](case-study.md)의 재현 계약을 우선한다.
