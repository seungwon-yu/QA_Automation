# 2026-09-13 개편 전 실행·진행 이력

이 문서는 과거 기록이다. 현재 구현·판정·통과 상태의 근거로 사용하지 않는다. 당시 판단값은 재해석하거나 현재 결과로 변환하지 않았다. 이전 문서의 상대 경로는 당시 docs/ 위치 기준이다.


---

## 원본: project-status.md

# 프로젝트 진행상황

## 포트폴리오 평가 추가 확인 — 2026-09-13

단위 테스트 42개와 정상 E2E 4개가 통과했다. 별도 경계 입력에서 `runUntil`의 마지막 프레임 조건 확인 누락을 재현했고, 실패 분류기가 제품 측 오류 로그와 테스트 측 오류 로그를 구분하지 못하는 사례를 확인했다. 상세 실행 기록은 `docs/test-report.md`의 2026-09-13 항목을 참조한다. 이번 작업은 평가와 검증이며 제품 코드 및 테스트 수정은 진행하지 않았다. 아래 완료/예정 목록은 기존 기록으로, 문서와 구현 상태 동기화가 후속 과제이다.

## 현재 상태 요약

`QA_Automation`은 게임 QA 자동화 포트폴리오를 위한 러너 게임 프로젝트이다.

이 프로젝트는 QA 자동화 프로젝트를 직접 설계하고 구현하면서, 하네스 엔지니어링 기반으로 게임 상태를 제어하고 그 위에 Agent Loop를 연결해 실패 증거 수집, 실패 분류, 다음 행동 결정을 연습하기 위한 학습 프로젝트이다.

현재는 게임 실행, 하네스 루프 API, Sprint 1 기본 테스트, 테스트 실행 리포트, GitHub 연결까지 완료된 상태이다. Sprint 2에서는 QA Agent Loop 기반 실패 처리 파이프라인, Playwright 실패 증거 연동, evidence 판단 근거 metadata 저장, timeline 기준 불합 기록, retry evidence 비교 구조까지 구현했다. 이후 ISTQB 기반으로 Sprint 2 기능 테스트 후보를 다시 선정하고, `TC-GROUP-04 장애물 생성 및 이동`, `TC-GROUP-06 점수 및 기록`, `TC-GROUP-07 리그레션 플로우` 상세 문서와 하네스 기반 단위 테스트를 구현했다. 현재는 `TC-GROUP-01`부터 `TC-GROUP-08`까지 모든 대분류 문서를 동일한 상세 수준으로 맞추고, 정상 브라우저 E2E를 `TC-008-01`부터 `TC-008-04`까지 확장했으며, JSON summary 기반 Markdown 요약 리포트와 GitHub Actions CI 구성을 추가했다.

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
| Agent Loop 단위 테스트 | 완료 | 실패 증거 저장, 실패 분류, 결정 엔진, 실패 경로, evidence 분석, retry 비교 테스트 통과 |
| Agent Loop 실사용 Runbook | 완료 | PASS/TEST_FAIL/PRODUCT_FAIL/ENV_FAIL/REVIEW_REQUIRED 실행 명령과 해석 문서화 |
| Retry Evidence Comparator | 완료 | attempt별 실패 분류와 failureSummary 일관성 비교, 재현성 요약 저장 |
| Playwright 실패 증거 | 완료 | 실패 시 screenshot, console log, QA state, test info 저장 확인 |
| Evidence 기반 판단 연결 | 완료 | 최신 Playwright evidence를 읽어 분류, 결정, Decision Log 기록 |
| Evidence 판단 근거 metadata | 완료 | `testCaseId`, `testGroupId`, `expected`, `actual`, `assertion`, `classificationBasis` 저장 |
| 브라우저 PRODUCT_FAIL 샘플 | 완료 | `TC-005-01` 기준 Playwright evidence를 `PRODUCT_FAIL`로 분류하고 Decision Log 기록 |
| 브라우저 TEST_FAIL 샘플 | 완료 | `TC-008-06` 기준 모호한 locator evidence를 `TEST_FAIL`로 분류하고 Decision Log 기록 |
| 브라우저 ENV_FAIL 샘플 | 완료 | `TC-008-07` 기준 서버 연결 실패 evidence를 `ENV_FAIL`로 분류하고 Decision Log 기록 |
| Timeline 기준 불합 기록 | 완료 | `timeline.json`에 단계 흐름, PASS/FAIL 기준, comparison, expected/actual, 불합 사유 저장 |
| Assertion Error 내부 증거 | 완료 | `assertion-error.json`에 Playwright 원본 실패 메시지와 stack trace 저장, `failureSummary`에는 QA 관점 요약 연결 |
| TC 상세 기준 문서화 | 완료 | `docs/test-cases/`에 `TC-GROUP-01`부터 `TC-GROUP-08`까지 모든 대분류 상세화 |
| Sprint 2 기능 테스트 후보 선정 | 완료 | ISTQB 기반으로 장애물, 점수 및 기록, 리그레션, 브라우저 E2E 확장 우선순위 정리 |
| TC-GROUP-04 장애물 테스트 | 완료 | 장애물 생성, 이동, 화면 밖 제거, 고정 랜덤 소스 단위 테스트 구현 |
| TC-GROUP-06 점수 및 기록 테스트 | 완료 | 1초 생존 점수, 최고 기록 갱신, 재시작 후 기록 유지, 낮은 점수 기록 보존 테스트 구현 |
| TC-GROUP-07 리그레션 플로우 테스트 | 완료 | 기본 플레이 흐름, 게임오버 후 재시작, 핵심 세션 3회 반복 테스트 구현 |
| TC 문서 수준 통일 | 완료 | 후보 수준으로 남아 있던 `TC-GROUP-01`, `TC-GROUP-02`, `TC-GROUP-03` 상세 문서화 |
| 브라우저 E2E 확장 | 완료 | 페이지 로드, Start, Space Jump, Restart 정상 E2E 4개 테스트 구현 |
| E2E 서버 안정성 조정 | 완료 | idle shutdown 기본값을 30초로 조정해 브라우저 기동 전 서버 종료 방지 |
| Markdown 요약 리포트 | 완료 | `last-summary.json`을 읽어 사람이 보기 좋은 Markdown 리포트 생성 |
| CI 구성 | 완료 | GitHub Actions에서 Unit, E2E, Agent Summary, Markdown 리포트 생성 자동 실행 |
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
| `tests/e2e/testFailEvidence.spec.js` | `TC-008-06` TEST_FAIL evidence 의도 실패 샘플 |
| `tests/e2e/envFailEvidence.spec.js` | `TC-008-07` ENV_FAIL evidence 의도 실패 샘플 |
| `tests/e2e/server.js` | Playwright E2E 전용 정적 서버 |
| `docs/harness-engineering.md` | 하네스와 루프 엔지니어링 전략 |
| `docs/test-classification.md` | 테스트 대분류와 Sprint 1 범위 |
| `docs/test-cases.md` | 테스트 케이스 목차와 공통 metadata 기준 |
| `docs/test-cases/` | 대분류별 테스트 케이스 상세 문서 |
| `docs/sprint-2-feature-test-candidates.md` | Sprint 2 기능 테스트 후보와 구현 우선순위 |
| `docs/test-guardrails.md` | 테스트 수행 원칙과 실패 분류 기준 |
| `docs/test-report.md` | 마지막 테스트 실행 결과 |
| `docs/agent-loop-design.md` | Sprint 2 QA Agent Loop 설계 |
| `docs/agent-loop-runbook.md` | Agent Loop 실행 명령과 결과 해석 |
| `tests/agent/` | 실패 처리 파이프라인 기본 모듈 |
| `tests/agent/retryEvidenceComparator.js` | 재시도 attempt별 실패 일관성 비교 |
| `tests/agent/fixtures/` | 실패 분류 검증용 샘플 명령 |
| `tests/unit/agentLoop.test.js` | Agent Loop 분류와 결정 단위 테스트 |
| `tests/e2e/evidenceTest.js` | Playwright 실패 증거 수집 fixture |
| `tests/e2e/evidence.spec.js` | Playwright 증거 저장 검증용 의도된 실패 샘플 |
| `tests/agent/playwrightEvidenceReader.js` | 저장된 Playwright evidence 읽기 |
| `tests/agent/playwrightEvidenceAnalyzer.js` | evidence 기반 분류와 결정 연결 |
| `tests/agent/markdownReportGenerator.js` | JSON summary 기반 Markdown 요약 리포트 생성 |
| `docs/markdown-report.md` | Markdown 요약 리포트 생성 목적과 사용 방법 |
| `.github/workflows/ci.yml` | GitHub Actions 자동 검증 workflow |
| `docs/ci.md` | CI 구성 목적과 실패 해석 기준 |

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
timeline.json
assertion-error.json
       ↓
Playwright Evidence Reader
       ↓
Failure Classifier
       ↓
Decision Engine
       ↓
Retry Evidence Comparator
       ↓
Decision Log
```

현재 구현된 연결은 실제 브라우저 실패가 발생했을 때 저장된 evidence를 읽고, 해당 증거를 기반으로 실패 유형과 다음 행동을 결정하는 단계까지이다. 판단 근거가 부족한 경우에는 제품 버그로 단정하지 않고 `REVIEW_REQUIRED`와 `REVIEW` 결정으로 종료한다.

`metadata.json`은 모든 테스트 그룹이 공유하는 공통 판단 근거 구조이다. `testCaseId`, `requirementId`, `testGroupId`, `expected`, `actual`, `assertion`은 공통으로 저장하고, 대분류별 차이는 `classificationBasis`에 추가한다.

`timeline.json`은 테스트 흐름과 기준 불합 지점을 저장한다. `step` 항목은 정상 진행된 단계와 상태를 남기고, `criterion` 항목은 `comparison`, `passCriteria`, `expected`, `actual`, `failedBecause`를 남겨 어느 기준 때문에 FAIL이 되었는지 확인하게 한다.

`comparison`은 사람이 보기 쉬운 요약이다. 기대결과와 실제결과를 각각 `status=gameOver, collision=true`, `status=running, collision=true`처럼 한 줄로 보여준다.

`assertion-error.json`은 Playwright 원본 실패 메시지와 stack trace를 내부 증거로 보존한다. 사람에게 보여주는 요약은 `failureSummary`로 분리해 코드 위치보다 평가 기준, 기대결과, 실제결과, 실패 사유를 먼저 보여준다.

현재 Playwright evidence 샘플은 네 갈래로 구성되어 있다. `TC-GROUP-08` 브라우저 E2E 증거 저장 검증용 샘플은 제품 버그로 단정하지 않고 `REVIEW_REQUIRED`로 분류한다. `TC-005-01` 충돌 및 게임오버 의도 실패 샘플은 expected/actual과 `classificationBasis`를 근거로 `PRODUCT_FAIL`로 분류한다. `TC-008-06` locator 모호성 샘플은 테스트 자동화 코드 문제로 보고 `TEST_FAIL`로 분류한다. `TC-008-07` 서버 연결 실패 샘플은 실행 환경 문제로 보고 `ENV_FAIL`로 분류한다.

`RetryEvidenceComparator`는 `AgentLoopRunner`가 생성한 attempt 목록을 비교한다. `PRODUCT_FAIL` fixture를 3회 재시도한 결과는 `REPRODUCED_3_OF_3`으로 요약되며, 동일 조건에서 동일 실패가 반복되었음을 보여준다.

## 다음 작업 우선순위

### 1순위: Markdown 리포트 자동 생성

현재 상태: 1차 구현 완료.

필요 작업:

- 단일 `last-summary.json` 기반 Markdown 요약 리포트 생성
- 테스트별 PASS 기준, 기대결과, 실제결과, 실패 사유를 표로 정리
- screenshot과 evidence 디렉터리 경로를 리포트에 연결
- 추후 여러 evidence 디렉터리를 묶는 종합 리포트로 확장

### 2순위: CI 구성

현재 상태: 1차 구현 완료.

필요 작업:

- GitHub Actions로 `npm test` 실행
- Playwright Chromium 설치 후 `npm run test:e2e` 실행
- Agent Summary와 Markdown 리포트 생성
- 테스트 리포트 산출물 업로드

### 3순위: 의존성 취약점 대응

필요 작업:

- `npm audit` 결과 검토
- Vitest/Vite/esbuild 업그레이드 영향 확인
- breaking change가 있는 경우 별도 브랜치 또는 별도 커밋으로 처리
- 업그레이드 후 `npm test`와 `npm run test:e2e` 재실행

### 4순위: Sprint 2 추가 기능 테스트 확장

필요 작업:

- 장애물 생성 및 이동 테스트 확장
- 리그레션 플로우 반복 테스트 추가
- 브라우저 E2E 테스트 확장

## 아직 하지 않은 작업

- 의존성 취약점 대응
- Sprint 2 추가 기능 테스트 구현
- 여러 evidence 디렉터리를 묶는 종합 Markdown 리포트 생성
- 의도 실패 샘플 전용 CI workflow 분리 검토

## 이어받는 방법

1. `AGENTS.md`를 먼저 읽는다.
2. 이 문서에서 현재 진행상황을 확인한다.
3. `docs/test-classification.md`에서 Sprint 1 범위를 확인한다.
4. `docs/test-cases.md`에서 테스트 케이스 목차와 공통 metadata 기준을 확인한다.
5. `docs/test-cases/`에서 작업 대상 대분류 문서를 확인한다.
6. `docs/sprint-2-feature-test-candidates.md`에서 Sprint 2 기능 테스트 우선순위를 확인한다.
7. `docs/harness-engineering.md`에서 추가 예정 하네스 API를 확인한다.
8. 테스트 실행 전 `docs/test-guardrails.md`를 확인한다.
9. `docs/agent-loop-design.md`에서 실패 처리 파이프라인을 확인한다.
10. `docs/agent-loop-runbook.md`에서 Agent Loop 실행 명령과 결과 해석을 확인한다.
11. `docs/test-report.md`에서 마지막 테스트 실행 결과를 확인한다.
12. `npm run test:agent -- npm test`로 Agent Loop 기본 동작을 확인한다.
13. `npm run test:e2e:evidence`로 의도된 Playwright 실패 증거 생성을 확인한다.
14. `npm run test:agent:evidence`로 최신 evidence 기반 판단 연결을 확인한다.
15. `npm run test:e2e:test-fail-evidence`로 TEST_FAIL evidence 생성을 확인한다.
16. `npm run test:e2e:env-fail-evidence`로 ENV_FAIL evidence 생성을 확인한다.
17. `npm run report:markdown`으로 최신 summary 기반 Markdown 요약 리포트를 생성한다.
18. 의존성 취약점 대응 또는 종합 Markdown 리포트 확장 중 다음 작업을 선택한다.

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
| Agent Loop 실사용 Runbook | 통과 |
| Playwright 실제 screenshot 증거 | 통과 |
| Playwright QA state 증거 | 통과 |
| Playwright console log 증거 | 통과 |
| Playwright metadata 증거 | 통과 |
| Evidence 기반 Decision Log | 통과 |
| metadata 기반 PRODUCT_FAIL 단위 분류 | 통과 |
| Playwright PRODUCT_FAIL evidence 분류 | 통과 |
| Playwright TEST_FAIL evidence 분류 | 통과 |
| Playwright ENV_FAIL evidence 분류 | 통과 |
| Playwright timeline 기준 불합 기록 | 통과 |
| Playwright assertion error 내부 증거 저장 | 통과 |
| Retry evidence 비교 | 통과 |
| Sprint 2 기능 테스트 후보 선정 | 완료 |
| TC-GROUP-04 장애물 생성 및 이동 | 통과 |
| TC-GROUP-06 점수 및 기록 | 통과 |
| TC-GROUP-07 리그레션 플로우 | 통과 |
| 전체 TC 대분류 상세 문서화 | 완료 |
| 브라우저 E2E 확장 | 통과 |
| Markdown 요약 리포트 생성 | 통과 |
| GitHub Actions CI 구성 | 로컬 파일 구성 완료 |

## 다음 추천 커밋

```text
Chore: CI 자동 검증 구성 추가

- GitHub Actions workflow 추가
- Unit, E2E, Agent Summary, Markdown 리포트 생성 자동화
- CI 구성과 실패 해석 기준 문서화
```

---

## 원본: test-report.md

# 테스트 실행 리포트

## 포트폴리오 평가 중 추가 검증 — 2026-09-13

- `npm test`: 42개 통과(게임 엔진 24개, Agent Loop 18개).
- `npm run test:e2e`: 정상 브라우저 E2E 4개 통과.
- 별도 메모리 내 재현: `new GameHarness().start().runUntil((state) => state.score > 0, 5)`가 최종 `score=1`인데 `matched=false`를 반환했다. 마지막 허용 프레임 이후 조건 재검사 누락으로 판단되는 하네스 `TEST_FAIL`이며, 기존 테스트에는 포함되지 않은 경계 사례이다.
- 별도 합성 입력 검증: `FailureClassifier`에 `exitCode=1`, console log `TypeError: product update crashed`를 전달하면 `TEST_FAIL`로 분류된다. 오류 발생 계층을 구분하지 않는 문자열 규칙의 한계이며 실제 게임 결함 보고는 아니다.
- 위 재현은 상태와 콘솔 출력으로 확인했고 별도 screenshot 또는 evidence 파일은 생성하지 않았다. 평가 과정에서 제품 코드와 assertion은 변경하지 않았다.

아래 실행 요약은 2026-08-31 당시의 이력이다.

## 실행 요약

| 항목 | 결과 |
| --- | --- |
| 실행 날짜 | 2026-08-31 |
| 테스트 범위 | Sprint 1 하네스 루프 테스트, Sprint 2 Agent Loop 실패 경로, TC-GROUP-04 장애물 생성 및 이동, TC-GROUP-06 점수 및 기록, TC-GROUP-07 리그레션 플로우, TC-GROUP-08 브라우저 E2E 확장, evidence metadata 판단 근거, timeline 기준 불합 기록, retry evidence 비교, Markdown 요약 리포트 생성, CI 구성 |
| 단위 테스트 | 통과 |
| E2E 테스트 | 통과 |
| Agent Loop 러너 | 통과 |
| 남은 주요 작업 | 의존성 취약점 대응, 여러 evidence를 묶는 종합 Markdown 리포트 확장, 의도 실패 샘플 전용 CI 검토 |

## 실행 명령과 결과

| 명령 | 결과 | 비고 |
| --- | --- | --- |
| `npm test` | 통과 | `tests/unit/gameEngine.test.js` 24개 테스트 통과 |
| `npm test` | 통과 | `tests/unit/agentLoop.test.js` 17개 테스트 통과 |
| `npm test` | 통과 | 2026-08-31 실행, 전체 단위 테스트 41개 통과 |
| `npm run test:e2e` | 통과 | 2026-08-31 실행, `tests/e2e/runner.spec.js` 4개 테스트 통과, 명령 자동 종료 확인 |
| `npm run test:agent -- npm test` | 통과 | PASS 상황에서 `STOP` 결정과 Decision Log 기록 확인 |
| `npm run test:agent -- node tests/agent/fixtures/productFailCommand.js` | 의도된 실패 | 3회 재시도 후 `REPRODUCED_3_OF_3`, `PRODUCT_FAIL`, `STOP` 확인 |
| `npm run test:agent -- node tests/agent/fixtures/testFailCommand.js` | 의도된 실패 | `TEST_FAIL`로 분류하고 재시도 없이 `STOP`, evidence 저장 확인 |
| `npm run test:e2e:evidence` | 의도된 실패 | Playwright 실패 시 screenshot, console log, QA state, metadata 저장 확인 |
| `npm run test:e2e:product-fail-evidence` | 의도된 실패 | `TC-005-01` expected/actual 불일치 metadata 저장 확인 |
| `npm run test:e2e:test-fail-evidence` | 의도된 실패 | `TC-008-06` locator 모호성 metadata 저장 확인 |
| `npm run test:e2e:env-fail-evidence` | 의도된 실패 | `TC-008-07` 서버 연결 실패 metadata 저장 확인 |
| `npm run test:agent:evidence` | 의도된 실패 분석 | 최신 Playwright evidence를 읽어 `ENV_FAIL`, `RETRY`, failureSummary 기록 |
| `npm run report:markdown` | 통과 | `artifacts/agent/last-summary.json`을 읽어 `artifacts/reports/latest-summary.md` 생성 |
| `.github/workflows/ci.yml` | 구성 완료 | GitHub Actions에서 Unit, E2E, Agent Summary, Markdown 리포트 생성 실행 |
| `npm audit --audit-level=moderate` | 실패 상태 반환 | 취약점 5개 확인, 자동 수정은 breaking change 가능 |

## Sprint 1 검증 내용

| 테스트 그룹 | 구현 상태 | 대표 검증 |
| --- | --- | --- |
| TC-GROUP-01 초기화 및 상태 관리 | 완료 | 초기 상태, 시작 상태 전이, 재시작 |
| TC-GROUP-02 입력 및 플레이어 동작 | 완료 | 점프, 공중 중복 점프 방지, 착지, 재점프 |
| TC-GROUP-03 게임 루프 진행 | 완료 | 프레임 진행, 초 단위 진행, 타임라인 기록, 게임오버 후 정지 |
| TC-GROUP-04 장애물 생성 및 이동 | 완료 | 장애물 강제 생성, 왼쪽 이동, 화면 밖 제거, 고정 랜덤 소스 |
| TC-GROUP-05 충돌 및 게임오버 | 완료 | 충돌 시 게임오버, 비충돌 유지, 충돌 후 재시작 |
| TC-GROUP-06 점수 및 기록 | 완료 | 1초 생존 점수, 최고 기록 갱신, 재시작 후 기록 유지, 낮은 점수 기록 보존 |
| TC-GROUP-07 리그레션 플로우 | 완료 | 기본 플레이 흐름, 게임오버 후 재시작, 핵심 세션 3회 반복 |

## 발견 및 조치

| 발견 내용 | 조치 |
| --- | --- |
| Vitest가 E2E 테스트 파일까지 수집해 Playwright 테스트와 충돌함 | `npm test`를 `vitest run tests/unit`으로 수정해 단위 테스트와 E2E 테스트를 분리 |
| Playwright가 `Start` 버튼을 찾을 때 `Restart`도 함께 매칭함 | E2E 테스트에서 `exact: true` 옵션을 사용해 정확한 버튼만 선택 |
| Playwright 브라우저 실행 파일이 없음 | `npx playwright install chromium`으로 Chromium 설치 |
| 1초 점수 증가 검증에서 부동소수점 누적 오차 가능성 확인 | 고정값 대신 허용 범위 검증으로 변경 |
| 실패 당시 기록만으로 제품 실패를 단정할 근거가 부족함 | `metadata.json`에 `testCaseId`, `testGroupId`, `expected`, `actual`, `assertion`, `classificationBasis` 저장 |
| `npm run test:e2e`에서 테스트 본문 통과 후 프로세스 종료가 지연됨 | E2E 전용 정적 서버를 추가하고 idle shutdown으로 서버 프로세스가 남지 않도록 조치 |
| `npm run test:e2e`에서 서버가 실제 테스트 시작 전에 종료될 수 있음 | idle shutdown 기본값을 30초로 늘려 서버가 테스트 중 먼저 종료되지 않도록 조정 |
| 실패 타임라인만으로 어떤 기준 때문에 FAIL인지 보기 어려움 | `timeline.json`에 `comparison`, `passCriteria`, `expected`, `actual`, `failedBecause`를 기록하고 Decision Log에 `failedCriteria`, `timelineSummary`를 추가 |
| Playwright 원본 실패와 QA 평가 기준이 분리되어 있음 | `assertion-error.json`에 원본 실패를 저장하고, Decision Log에는 코드 위치를 제외한 `failureSummary` 요약을 추가 |

## Sprint 2 초기 검증 내용

| 모듈 | 구현 상태 | 대표 검증 |
| --- | --- | --- |
| `EvidenceCollector` | 기본 구현 | 실패 시 command log, console log, screenshot placeholder, state, timeline 저장 테스트 통과 |
| `FailureClassifier` | 기본 구현 | 환경 오류, 테스트 오류, 제품 실패 의심, 판단 보류 분류 테스트 통과 |
| `DecisionEngine` | 기본 구현 | PASS, RETRY, STOP, REVIEW 결정 테스트 통과 |
| `DecisionLogger` | 기본 구현 | Decision Log와 요약 파일 저장 구조 추가 |
| `AgentLoopRunner` | 기본 구현 | 명령 실행 결과에 따라 분류, 결정, 로그 기록 수행 |
| `RetryEvidenceComparator` | 추가 | attempt별 실패 일관성과 재현성 요약 기록 |
| `docs/agent-loop-runbook.md` | 추가 | Agent Loop 실행 명령과 결과 해석 문서화 |
| `PlaywrightEvidenceReader` | 확장 | `metadata.json`을 읽어 판단 근거를 분류기에 전달 |
| `PlaywrightEvidenceAnalyzer` | 확장 | Decision Log에 `testCaseId`, `testGroupId`, `expected`, `actual`, `assertion`, `failedCriteria`, `timelineSummary`, `comparison`, `assertionError`, `failureSummary` 기록 |
| `MarkdownReportGenerator` | 추가 | `last-summary.json` 기반 사람이 읽기 쉬운 Markdown 요약 리포트 생성 |
| `tests/e2e/server.js` | 추가 | Playwright E2E용 정적 서버를 직접 실행하고 idle shutdown으로 종료 안정성 확보 |
| `tests/e2e/productFailEvidence.spec.js` | 추가 | `TC-005-01` 기준 PRODUCT_FAIL evidence 샘플 생성 |
| `tests/e2e/testFailEvidence.spec.js` | 추가 | `TC-008-06` 기준 TEST_FAIL evidence 샘플 생성 |
| `tests/e2e/envFailEvidence.spec.js` | 추가 | `TC-008-07` 기준 ENV_FAIL evidence 샘플 생성 |
| `docs/sprint-2-feature-test-candidates.md` | 추가 | ISTQB 기반 Sprint 2 기능 테스트 후보와 구현 우선순위 정리 |
| `docs/test-cases/obstacle-spawn-movement.md` | 상세화 | `TC-004-01`부터 `TC-004-04`까지 상세 TC 기준 정리 |
| `docs/test-cases/score-record.md` | 상세화 | `TC-006-01`부터 `TC-006-04`까지 상세 TC 기준 정리 |
| `docs/test-cases/regression-flow.md` | 상세화 | `TC-007-01`부터 `TC-007-03`까지 상세 TC 기준 정리 |
| `docs/test-cases/initial-state-management.md` | 상세화 | `TC-001-01`부터 `TC-001-04`까지 상세 TC 기준 정리 |
| `docs/test-cases/player-input-movement.md` | 상세화 | `TC-002-01`부터 `TC-002-04`까지 상세 TC 기준 정리 |
| `docs/test-cases/game-loop-progression.md` | 상세화 | `TC-003-01`부터 `TC-003-04`까지 상세 TC 기준 정리 |
| `tests/e2e/runner.spec.js` | 확장 | `TC-008-01`부터 `TC-008-04`까지 정상 브라우저 E2E 테스트 구현 |

## Sprint 2 주의사항

현재 Agent Loop는 PASS 상황과 분류/결정 단위 테스트를 검증한 초기 구조이다.

의도적으로 실패하는 fixture를 이용해 `ENV_FAIL`, `TEST_FAIL`, `PRODUCT_FAIL`, `REVIEW_REQUIRED` 분류와 Retry/Stop/Review 결정 흐름을 단위 테스트로 검증했다.

Playwright 실패 샘플을 이용해 실제 `screenshot.png`, `console-log.json`, `state.json`, `metadata.json`, `test-info.json` 저장을 확인했다.

`state.json`에는 `window.__QA_AUTOMATION__.getState()` 결과가 저장된다.

`metadata.json`에는 실패 판단 근거가 저장된다. 공통 필드는 `testCaseId`, `requirementId`, `testGroupId`, `expected`, `actual`, `assertion`이며, 대분류별 판단 차이는 `classificationBasis`에 기록한다.

`timeline.json`에는 테스트 진행 단계와 기준 불합 정보가 저장된다. `TC-005-01` 샘플에서는 `충돌 이후 status === "gameOver"` 기준에 대해 expected status는 `gameOver`, actual status는 `running`으로 기록되며, 불합 사유는 `actual.status가 expected.status와 다름`으로 남는다. 사람이 한눈에 볼 수 있도록 `comparison.expectedResult`와 `comparison.actualResult`도 함께 저장한다.

`assertion-error.json`에는 Playwright 원본 실패 메시지와 stack trace가 저장된다. 코드 위치는 내부 증거로만 보존하고, 사람용 요약은 `failureSummary`에서 평가 기준, 기대결과, 실제결과, 실패 사유 중심으로 확인한다.

현재 Playwright 의도 실패 샘플은 네 종류이다. `TC-GROUP-08` 증거 저장 검증용은 제품 요구사항 위반으로 단정하지 않고 `REVIEW_REQUIRED`로 분류한다. `TC-005-01` 충돌 및 게임오버 샘플은 expected/actual과 `classificationBasis`를 근거로 `PRODUCT_FAIL`로 분류한다. `TC-008-06` locator 모호성 샘플은 테스트 자동화 코드 문제로 보고 `TEST_FAIL`로 분류한다. `TC-008-07` 서버 연결 실패 샘플은 실행 환경 문제로 보고 `ENV_FAIL`로 분류한다.

`TC-008-07` 샘플의 Agent 분석 결과는 `ENV_FAIL`과 `RETRY`이다. 실패 기준은 브라우저 E2E 테스트가 테스트 대상 서버에 접속할 수 있어야 한다는 것이고, 실제 결과는 `ERR_CONNECTION_REFUSED`이다.

`RetryEvidenceComparator`는 Agent Loop 재시도 결과를 비교한다. `PRODUCT_FAIL` fixture를 실행한 결과, 3회 모두 동일 분류와 동일 observation이 반복되어 `REPRODUCED_3_OF_3`으로 요약되었다.

`docs/agent-loop-runbook.md`에는 PASS, TEST_FAIL, PRODUCT_FAIL, ENV_FAIL, REVIEW_REQUIRED 실행 명령과 기대 분류, 기대 결정, 해석 방법을 정리했다.

브라우저 실패 컨텍스트가 아닌 Agent Loop fixture에서는 `screenshot.json` placeholder를 저장한다.

## 후속 리포트 계획

현재 evidence와 Decision Log는 Agent Loop가 안정적으로 읽을 수 있도록 JSON으로 저장한다.

현재 `npm run report:markdown`으로 `artifacts/agent/last-summary.json`을 입력으로 사용해 Markdown 요약 리포트를 생성할 수 있다. Markdown 리포트에는 테스트 케이스, PASS 기준, 기대결과, 실제결과, 실패 사유, 실패 분류, 다음 행동, evidence 파일 경로를 사람이 읽기 쉬운 표와 요약으로 정리한다.

추후에는 여러 evidence 디렉터리를 한 번에 묶어 실행 회차별 종합 리포트를 생성하는 방식으로 확장한다.

## 의존성 보안 메모

`npm install` 이후 취약점 5개가 보고되었다.

`npm audit --audit-level=moderate` 결과, `vitest`가 의존하는 `vite`와 `esbuild` 계열 취약점이 확인되었다. `npm audit fix --force`는 `vitest@4.1.11`로의 breaking change를 포함하므로 이번 Sprint 1 구현 커밋에서는 적용하지 않는다.

후속 작업에서 테스트 실행 안정성을 확인한 뒤 의존성 업그레이드를 별도 커밋으로 처리한다.

## 결론

Sprint 1의 핵심 목표인 하네스 기능 강화와 루프 실행 기반 테스트 케이스 확장은 완료되었다.

Sprint 2의 첫 단계로 QA Agent Loop 실패 처리 파이프라인의 기본 모듈, 실패 경로 검증, Playwright 실패 증거 저장을 추가했다.

이후 Playwright evidence를 `FailureClassifier`, `DecisionEngine`, `DecisionLogger`와 연결했다.

이후 Playwright 실패 evidence에 `timeline.json`을 추가하고, 기준 불합 항목을 `failedCriteria`와 `timelineSummary`로 Decision Log에 연결했다.

이후 Playwright 원본 assertion error를 `assertion-error.json`으로 저장하고, 코드 위치가 아닌 QA 평가 기준 중심의 `failureSummary`를 Decision Log에 추가했다.

이후 retry attempt별 실패 일관성을 비교하는 `RetryEvidenceComparator`를 추가하고, `AgentLoopRunner` summary에 `retryEvidenceComparison`을 기록했다.

이후 Agent Loop를 실제로 실행하고 해석하는 방법을 `docs/agent-loop-runbook.md`에 정리했다.

이후 ISTQB 기반으로 Sprint 2 기능 테스트 후보를 다시 선정하고, 첫 구현 대상을 `TC-GROUP-04 장애물 생성 및 이동`으로 정했다.

이후 `TC-GROUP-04 장애물 생성 및 이동`을 상세 TC 문서로 확장하고, 하네스 기반 단위 테스트 4개를 추가했다.

이후 `TC-GROUP-06 점수 및 기록`을 상세 TC 문서로 확장하고, 하네스 기반 단위 테스트 4개를 추가했다. 1초 생존 점수 허용 범위는 표시 점수 내림과 부동소수점 누적 오차 기준에 따라 `11 이상 12 이하`로 문서화했다.

이후 `TC-GROUP-07 리그레션 플로우`를 상세 TC 문서로 확장하고, 기본 플레이 흐름, 게임오버 후 재시작, 핵심 세션 3회 반복 단위 테스트 3개를 추가했다.

이후 후보 수준으로 남아 있던 `TC-GROUP-01 초기화 및 상태 관리`, `TC-GROUP-02 입력 및 플레이어 동작`, `TC-GROUP-03 게임 루프 진행` 문서를 상세 TC 기준으로 확장해 모든 대분류 문서 수준을 맞췄다.

이후 정상 브라우저 E2E를 `TC-008-01`부터 `TC-008-04`까지 확장했다. 페이지 로드, Start 버튼, Space 키 점프, Restart 버튼 흐름을 각각 분리해 실패 시 원인 분류가 더 명확해지도록 했다.

이후 JSON summary를 사람이 읽기 좋은 Markdown 요약 리포트로 변환하는 기능을 추가했다.

이후 GitHub Actions CI를 추가해 push와 pull request에서 Unit, E2E, Agent Summary, Markdown 리포트 생성이 자동 실행되도록 구성했다.

현재 단위 테스트, 브라우저 E2E, Agent Loop evidence 분석, Markdown 요약 리포트 생성은 통과한다. CI는 GitHub에 push된 뒤 Actions 실행 결과로 최종 확인한다. 의도된 실패 샘플은 실패 증거 저장, `REVIEW_REQUIRED`, `PRODUCT_FAIL`, `TEST_FAIL`, `ENV_FAIL` 분류 흐름을 검증하기 위해 별도 명령으로 실행한다.
