# 프로젝트 진행상황

## 현재 상태 요약

`QA_Automation`은 게임 QA 자동화 포트폴리오를 위한 러너 게임 프로젝트이다.

현재는 게임 실행, 하네스 루프 API, Sprint 1 기본 테스트, 테스트 실행 리포트, GitHub 연결까지 완료된 상태이다. Sprint 2에서는 QA Agent Loop 기반 실패 처리 파이프라인 구축을 시작했다.

## 완료된 작업

| 구분 | 상태 | 내용 |
| --- | --- | --- |
| 프로젝트 생성 | 완료 | `QA_Automation` 폴더와 기본 파일 구조 생성 |
| 게임 구현 | 완료 | Canvas 기반 러너 게임 구현 |
| 로직 분리 | 완료 | `GameEngine`, `Renderer`, `Input`, `main` 구조로 분리 |
| 하네스 기본 구조 | 완료 | `GameHarness`로 시작, 점프, 재시작, 충돌 배치, 상태 확인 가능 |
| 하네스 루프 API | 완료 | `runForFrames`, `runForSeconds`, `runUntil`, `getTimeline` 추가 |
| 기본 단위 테스트 | 완료 | 초기 상태, 점프, 충돌, 재시작 테스트 작성 |
| Sprint 1 단위 테스트 | 완료 | 상태 관리, 입력, 루프 진행, 충돌/게임오버 테스트 확장 |
| 테스트 실행 환경 | 완료 | `npm install`, Vitest, Playwright Chromium 설치 완료 |
| 테스트 실행 리포트 | 완료 | `docs/test-report.md`에 Sprint 1 실행 결과 기록 |
| 테스트 수행 가드레일 | 완료 | 제품 코드, 기대결과, assertion 변경 금지와 실패 분류 기준 문서화 |
| Agent Loop 설계 | 완료 | `docs/agent-loop-design.md`에 실패 처리 파이프라인 정의 |
| Agent Loop 기본 모듈 | 진행 중 | Evidence, Classification, Decision, Log, Runner 기본 구조 추가 |
| Agent Loop 단위 테스트 | 완료 | 실패 증거 저장, 실패 분류, 결정 엔진 테스트 7개 통과 |
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
| `docs/test-guardrails.md` | 테스트 수행 원칙과 실패 분류 기준 |
| `docs/test-report.md` | 마지막 테스트 실행 결과 |
| `docs/agent-loop-design.md` | Sprint 2 QA Agent Loop 설계 |
| `tests/agent/` | 실패 처리 파이프라인 기본 모듈 |
| `tests/unit/agentLoop.test.js` | Agent Loop 분류와 결정 단위 테스트 |

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

### 1순위: Agent Loop 실사용 검증

필요 작업:

- `npm run test:agent -- npm test` 실행 결과 확인
- 실패 테스트 샘플을 별도로 만들어 Evidence 저장 구조 검증
- Decision Log가 면접 설명에 쓸 수 있을 정도로 읽히는지 확인

### 2순위: 의존성 취약점 대응

필요 작업:

- `npm audit` 결과 검토
- Vitest/Vite/esbuild 업그레이드 영향 확인
- breaking change가 있는 경우 별도 브랜치 또는 별도 커밋으로 처리
- 업그레이드 후 `npm test`와 `npm run test:e2e` 재실행

### 3순위: Sprint 2 기능 테스트 후보 선정

필요 작업:

- 장애물 생성 및 이동 테스트 확장
- 점수와 최고 기록 테스트 확장
- 리그레션 플로우 반복 테스트 추가
- 브라우저 E2E 테스트 확장

### 4순위: CI 구성

필요 작업:

- GitHub Actions로 `npm test` 실행
- Playwright E2E 실행 여부 결정
- 테스트 리포트 산출물 업로드 검토

## 아직 하지 않은 작업

- 의존성 취약점 대응
- Sprint 2 상세 테스트 구현
- Agent Loop와 Playwright 실패 증거 연동
- GitHub Actions 또는 CI 구성

## 이어받는 방법

1. `AGENTS.md`를 먼저 읽는다.
2. 이 문서에서 현재 진행상황을 확인한다.
3. `docs/test-classification.md`에서 Sprint 1 범위를 확인한다.
4. `docs/harness-engineering.md`에서 추가 예정 하네스 API를 확인한다.
5. 테스트 실행 전 `docs/test-guardrails.md`를 확인한다.
6. `docs/agent-loop-design.md`에서 실패 처리 파이프라인을 확인한다.
7. `docs/test-report.md`에서 마지막 테스트 실행 결과를 확인한다.
8. `npm run test:agent -- npm test`로 Agent Loop 기본 동작을 확인한다.
9. Sprint 2 범위를 정하고 필요한 QA 문서를 갱신한다.

## 마지막 확인 상태

| 항목 | 결과 |
| --- | --- |
| 게임 로컬 실행 | 확인 완료 |
| 로컬 URL | `http://127.0.0.1:4173/` |
| 엔진 스모크 테스트 | 통과 확인 |
| GitHub push | 완료 |
| 최신 문서 기준 | 한글 작성 |
| Sprint 1 코드 구현 | 완료 |
| Vitest 실제 실행 | 통과 |
| Playwright 실제 실행 | 통과 |
| Agent Loop PASS 경로 | 통과 |
| Agent Loop 실패 경로 | 미검증 |

## 다음 추천 커밋

```text
Chore: 테스트 의존성 취약점 대응

- Vitest와 Vite 계열 의존성 업그레이드 영향 검토
- 보안 취약점 대응 후 단위 테스트와 E2E 테스트 재실행
- 의존성 변경 사유와 검증 결과 문서화
```
