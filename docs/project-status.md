# 프로젝트 진행상황

## 현재 상태 요약

`QA_Automation`은 게임 QA 자동화 포트폴리오를 위한 러너 게임 프로젝트이다.

현재는 게임 실행, 기본 하네스 구조, 테스트 문서 구조, GitHub 연결까지 완료된 상태이다. 다음 핵심 작업은 하네스 기능을 강화하고, Sprint 1 테스트 범위에 맞춰 루프 기반 자동화 테스트를 확장하는 것이다.

## 완료된 작업

| 구분 | 상태 | 내용 |
| --- | --- | --- |
| 프로젝트 생성 | 완료 | `QA_Automation` 폴더와 기본 파일 구조 생성 |
| 게임 구현 | 완료 | Canvas 기반 러너 게임 구현 |
| 로직 분리 | 완료 | `GameEngine`, `Renderer`, `Input`, `main` 구조로 분리 |
| 하네스 기본 구조 | 완료 | `GameHarness`로 시작, 점프, 재시작, 충돌 배치, 상태 확인 가능 |
| 기본 단위 테스트 | 완료 | 초기 상태, 점프, 충돌, 재시작 테스트 작성 |
| 기본 E2E 테스트 | 완료 | Playwright 기반 시작과 점프 흐름 테스트 작성 |
| QA 문서 구조 | 완료 | 테스트 계획, 테스트 케이스, 리스크 분석, 테스트 분류 작성 |
| 컨벤션 문서 | 완료 | 코드 컨벤션과 커밋 메시지 컨벤션 작성 |
| 프로젝트 지도 | 완료 | `AGENTS.md`로 읽는 순서와 작업 규칙 정리 |
| Git 연결 | 완료 | 로컬 git 초기화, GitHub 원격 연결, `main` push 완료 |

## 현재 주요 파일

| 파일 | 역할 |
| --- | --- |
| `AGENTS.md` | 다음 작업자를 위한 프로젝트 지도 |
| `README.md` | 프로젝트 소개와 실행 방법 |
| `src/gameEngine.js` | 게임 규칙과 상태 전이 |
| `tests/harness/gameHarness.js` | 자동화 테스트용 하네스 |
| `tests/unit/gameEngine.test.js` | 하네스 기반 단위 테스트 |
| `tests/e2e/runner.spec.js` | 브라우저 E2E 테스트 |
| `docs/harness-engineering.md` | 하네스와 루프 엔지니어링 전략 |
| `docs/test-classification.md` | 테스트 대분류와 Sprint 1 범위 |

## 현재 자동화 구조

```text
테스트 코드
└─ GameHarness
   └─ GameEngine
      ├─ 상태 관리
      ├─ 점프 처리
      ├─ 루프 진행
      ├─ 장애물 처리
      └─ 충돌 판정
```

하네스 엔지니어링은 테스트가 게임 엔진을 직접 제어하고 관찰하는 구조이다. 루프 엔지니어링은 하네스 내부에서 프레임과 시간을 시뮬레이션해 반복 동작을 검증하는 방식으로 확장할 예정이다.

## 다음 작업 우선순위

### 1순위: 하네스 기능 강화

추가할 메서드:

- `runForFrames(frames)`
- `runForSeconds(seconds, fps)`
- `runUntil(condition, maxFrames)`
- `placeObstacleAhead(distance)`
- `getTimeline()`
- `clearTimeline()`

목적:

- 테스트 코드가 프레임 루프를 직접 작성하지 않게 한다.
- 점프, 착지, 점수 증가, 게임오버 유지 같은 시간 기반 동작을 명확하게 검증한다.
- 루프 중 상태 변화를 타임라인으로 확인할 수 있게 한다.

### 2순위: Sprint 1 테스트 구현

Sprint 1 범위:

- TC-GROUP-01 초기화 및 상태 관리
- TC-GROUP-02 입력 및 플레이어 동작
- TC-GROUP-03 게임 루프 진행
- TC-GROUP-05 충돌 및 게임오버

우선 추가할 테스트:

- 점프 후 충분한 프레임이 지나면 착지하는지 검증
- 공중에서 중복 점프가 거부되는지 검증
- 초 단위 루프 진행 시 점수가 증가하는지 검증
- 게임오버 이후 루프를 진행해도 점수가 증가하지 않는지 검증
- 플레이어 앞 장애물이 루프 진행에 따라 이동하는지 검증

### 3순위: 테스트 실행 환경 정리

필요 작업:

- `npm install` 실행
- `npm test`로 Vitest 테스트 실행
- `npm run test:e2e`로 Playwright 테스트 실행
- 테스트 결과를 `docs/test-report.md`로 정리

## 아직 하지 않은 작업

- 의존성 설치
- Vitest 실제 실행
- Playwright 실제 실행
- 하네스 루프 API 확장
- Sprint 1 상세 테스트 구현
- 테스트 리포트 작성
- GitHub Actions 또는 CI 구성

## 이어받는 방법

1. `AGENTS.md`를 먼저 읽는다.
2. 이 문서에서 현재 진행상황을 확인한다.
3. `docs/test-classification.md`에서 Sprint 1 범위를 확인한다.
4. `docs/harness-engineering.md`에서 추가 예정 하네스 API를 확인한다.
5. `tests/harness/gameHarness.js`에 하네스 메서드를 추가한다.
6. `tests/unit/gameEngine.test.js`에 Sprint 1 테스트를 추가한다.
7. 테스트 실행 후 `docs/project-status.md`와 필요한 QA 문서를 갱신한다.

## 마지막 확인 상태

| 항목 | 결과 |
| --- | --- |
| 게임 로컬 실행 | 확인 완료 |
| 로컬 URL | `http://127.0.0.1:4173/` |
| 엔진 스모크 테스트 | 통과 확인 |
| GitHub push | 완료 |
| 최신 문서 기준 | 한글 작성 |

## 다음 추천 커밋

```text
Test: 루프 엔지니어링 기반 하네스 테스트 추가

- 하네스에 프레임과 초 단위 루프 실행 메서드 추가
- 점프 착지와 게임오버 유지 테스트 추가
- Sprint 1 테스트 범위에 맞춰 루프 검증 확장
```
