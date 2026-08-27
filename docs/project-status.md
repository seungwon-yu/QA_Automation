# 프로젝트 진행상황

## 현재 상태 요약

`QA_Automation`은 게임 QA 자동화 포트폴리오를 위한 러너 게임 프로젝트이다.

이 프로젝트는 QA 자동화 프로젝트를 직접 설계하고 구현하면서, 하네스 엔지니어링 기반으로 게임 상태를 제어하고 그 위에 Agent Loop를 연결해 실패 증거 수집, 실패 분류, 다음 행동 결정을 연습하기 위한 학습 프로젝트이다.

현재는 게임 실행, 하네스 루프 API, Sprint 1 기본 테스트, 테스트 실행 리포트, GitHub 연결까지 완료된 상태이다. Sprint 2에서는 QA Agent Loop 기반 실패 처리 파이프라인, Playwright 실패 증거 연동, evidence 판단 근거 metadata 저장까지 구현했다.

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
| Agent Loop 기본 모듈 | 완료 | Evidence, Classification, Decision, Log, Runner 기본 구조 추가 |
| Agent Loop 실패 fixture | 완료 | ENV, TEST, PRODUCT, REVIEW_REQUIRED 실패 샘플 추가 |
| Agent Loop 단위 테스트 | 완료 | 실패 증거 저장, 실패 분류, 결정 엔진, 실패 경로, evidence 분석 테스트 12개 통과 |
| Playwright 실패 증거 | 완료 | 실패 시 screenshot, console log, QA state, test info 저장 확인 |
| Evidence 기반 판단 연결 | 완료 | 최신 Playwright evidence를 읽어 분류, 결정, Decision Log 기록 |
| Evidence 판단 근거 metadata | 완료 | `testCaseId`, `testGroupId`, `expected`, `actual`, `assertion`, `classificationBasis` 저장 |
| 브라우저 PRODUCT_FAIL 샘플 | 완료 | `TC-005-01` 기준 Playwright evidence를 `PRODUCT_FAIL`로 분류하고 Decision Log 기록 |
| TC 상세 기준 문서화 | 완료 | `docs/test-cases/`에 대분류별 TC 문서 분리, `TC-GROUP-05`, `TC-GROUP-08` 상세화 |
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
| `tests/e2e/productFailEvidence.spec.js` | `TC-005-01` PRODUCT_FAIL evidence 의도 실패 샘플 |
| `tests/e2e/server.js` | Playwright E2E 전용 정적 서버 |
| `docs/harness-engineering.md` | 하네스와 루프 엔지니어링 전략 |
| `docs/test-classification.md` | 테스트 대분류와 Sprint 1 범위 |
| `docs/test-cases.md` | 테스트 케이스 목차와 공통 metadata 기준 |
| `docs/test-cases/` | 대분류별 테스트 케이스 상세 문서 |
| `docs/test-guardrails.md` | 테스트 수행 원칙과 실패 분류 기준 |
| `docs/test-report.md` | 마지막 테스트 실행 결과 |
| `docs/agent-loop-design.md` | Sprint 2 QA Agent Loop 설계 |
| `tests/agent/` | 실패 처리 파이프라인 기본 모듈 |
| `tests/agent/fixtures/` | 실패 분류 검증용 샘플 명령 |
| `tests/unit/agentLoop.test.js` | Agent Loop 분류와 결정 단위 테스트 |
| `tests/e2e/evidenceTest.js` | Playwright 실패 증거 수집 fixture |
| `tests/e2e/evidence.spec.js` | Playwright 증거 저장 검증용 의도된 실패 샘플 |
| `tests/agent/playwrightEvidenceReader.js` | 저장된 Playwright evidence 읽기 |
| `tests/agent/playwrightEvidenceAnalyzer.js` | evidence 기반 분류와 결정 연결 |

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

## 현재 실패 처리 루프 구조

```text
Playwright 테스트 실패
       ↓
Evidence Fixture
       ↓
screenshot.png
console-log.json
state.json
metadata.json
test-info.json
       ↓
Playwright Evidence Reader
       ↓
Failure Classifier
       ↓
Decision Engine
       ↓
Decision Log
```

현재 구현된 연결은 실제 브라우저 실패가 발생했을 때 저장된 evidence를 읽고, 해당 증거를 기반으로 실패 유형과 다음 행동을 결정하는 단계까지이다. 판단 근거가 부족한 경우에는 제품 버그로 단정하지 않고 `REVIEW_REQUIRED`와 `REVIEW` 결정으로 종료한다.

`metadata.json`은 모든 테스트 그룹이 공유하는 공통 판단 근거 구조이다. `testCaseId`, `requirementId`, `testGroupId`, `expected`, `actual`, `assertion`은 공통으로 저장하고, 대분류별 차이는 `classificationBasis`에 추가한다.

현재 Playwright evidence 샘플은 두 갈래로 구성되어 있다. `TC-GROUP-08` 브라우저 E2E 증거 저장 검증용 샘플은 제품 버그로 단정하지 않고 `REVIEW_REQUIRED`로 분류한다. `TC-005-01` 충돌 및 게임오버 의도 실패 샘플은 expected/actual과 `classificationBasis`를 근거로 `PRODUCT_FAIL`로 분류한다.

## 다음 작업 우선순위

### 1순위: Evidence 기반 판단 고도화

필요 작업:

- 필요하면 timeline 저장 구조와 연결
- E2E 실패에서 assertion error 상세 메시지 자동 추출 검토

### 2순위: Agent Loop 실사용 검증

필요 작업:

- `npm run test:agent -- npm test`를 정기 실행 경로로 정리
- 실패 fixture 실행 결과를 문서 예시로 정리
- Decision Log가 면접 설명에 쓸 수 있을 정도로 읽히는지 확인

### 3순위: 의존성 취약점 대응

필요 작업:

- `npm audit` 결과 검토
- Vitest/Vite/esbuild 업그레이드 영향 확인
- breaking change가 있는 경우 별도 브랜치 또는 별도 커밋으로 처리
- 업그레이드 후 `npm test`와 `npm run test:e2e` 재실행

### 4순위: Sprint 2 기능 테스트 후보 선정

필요 작업:

- 장애물 생성 및 이동 테스트 확장
- 점수와 최고 기록 테스트 확장
- 리그레션 플로우 반복 테스트 추가
- 브라우저 E2E 테스트 확장

### 5순위: CI 구성

필요 작업:

- GitHub Actions로 `npm test` 실행
- Playwright E2E 실행 여부 결정
- 테스트 리포트 산출물 업로드 검토

## 아직 하지 않은 작업

- 의존성 취약점 대응
- Sprint 2 상세 테스트 구현
- E2E 실패 evidence에 timeline 포함
- 실제 브라우저 실패를 `TEST_FAIL`, `ENV_FAIL`로 더 명확히 분류하는 샘플 확장
- GitHub Actions 또는 CI 구성

## 이어받는 방법

1. `AGENTS.md`를 먼저 읽는다.
2. 이 문서에서 현재 진행상황을 확인한다.
3. `docs/test-classification.md`에서 Sprint 1 범위를 확인한다.
4. `docs/test-cases.md`에서 테스트 케이스 목차와 공통 metadata 기준을 확인한다.
5. `docs/test-cases/`에서 작업 대상 대분류 문서를 확인한다.
6. `docs/harness-engineering.md`에서 추가 예정 하네스 API를 확인한다.
7. 테스트 실행 전 `docs/test-guardrails.md`를 확인한다.
8. `docs/agent-loop-design.md`에서 실패 처리 파이프라인을 확인한다.
9. `docs/test-report.md`에서 마지막 테스트 실행 결과를 확인한다.
10. `npm run test:agent -- npm test`로 Agent Loop 기본 동작을 확인한다.
11. `npm run test:e2e:evidence`로 의도된 Playwright 실패 증거 생성을 확인한다.
12. `npm run test:agent:evidence`로 최신 evidence 기반 판단 연결을 확인한다.
13. Sprint 2 범위를 정하고 필요한 QA 문서를 갱신한다.

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
| Agent Loop 실패 경로 | 통과 |
| Playwright 실제 screenshot 증거 | 통과 |
| Playwright QA state 증거 | 통과 |
| Playwright console log 증거 | 통과 |
| Playwright metadata 증거 | 통과 |
| Evidence 기반 Decision Log | 통과 |
| metadata 기반 PRODUCT_FAIL 단위 분류 | 통과 |
| Playwright PRODUCT_FAIL evidence 분류 | 통과 |

## 다음 추천 커밋

```text
Test: Playwright timeline evidence 연결

- Playwright 실패 시 timeline.json 저장
- TC metadata와 timeline을 Decision Log에 연결
- assertion 상세 메시지 자동 추출 검토
```
