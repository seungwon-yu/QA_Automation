# QA_Automation

러너 게임과 게임 QA 하네스를 중심으로 만든 자동화 테스트 포트폴리오 프로젝트입니다.

이 프로젝트는 게임 로직과 렌더링을 분리해, 자동화 테스트가 하네스를 통해 게임 루프를 제어하고 실패 evidence를 기반으로 실패 유형을 분류할 수 있도록 구성합니다.

현재 목표는 단순히 테스트를 PASS시키는 것이 아니라, 실패가 발생했을 때 `screenshot`, `console log`, `QA state`, `metadata`, `timeline`을 저장하고 `PRODUCT_FAIL`, `TEST_FAIL`, `ENV_FAIL`, `REVIEW_REQUIRED`로 판단할 수 있는 QA Agent Loop 기반을 만드는 것입니다.

## 프로젝트 목적

이 프로젝트는 QA 자동화 프로젝트를 직접 설계하고 구현해보면서, 게임 QA에서 테스트 기준을 세우고 자동화 구조로 확장하는 과정을 연습하기 위한 학습 프로젝트입니다.

특히 하네스 엔지니어링을 기반으로 게임 상태, 입력, 시간, 프레임, 충돌 조건을 테스트가 제어할 수 있게 만들고, 그 위에 Agent Loop를 연결해 실패 발생 시 증거 수집, 실패 분류, 다음 행동 결정을 수행하는 구조를 구현해보는 것이 핵심 목표입니다.

이 프로젝트에서 연습하는 내용은 다음과 같습니다.

- 게임 QA 관점의 테스트 대분류와 TC 작성
- ISTQB 흐름에 맞춘 Test Condition, Expected Result, Actual Result 정리
- 하네스를 통한 게임 상태 제어와 관찰
- 루프 엔지니어링을 통한 프레임/시간 기반 테스트
- Playwright 기반 브라우저 E2E 테스트
- 실패 시 screenshot, log, state, metadata, timeline evidence 저장
- timeline 기반 PASS/FAIL 기준 불합 지점 추적
- evidence 기반 `PRODUCT_FAIL`, `TEST_FAIL`, `ENV_FAIL`, `REVIEW_REQUIRED` 분류
- Decision Log를 통한 판단 과정 기록

## 로컬 실행

`index.html`을 브라우저에서 직접 열거나 아래 명령으로 실행합니다.

```bash
npm install
npm run serve
```

그 다음 `http://127.0.0.1:4173`에 접속합니다.

## 자동화 핵심

- `src/gameEngine.js`: 결정 가능한 게임 규칙
- `tests/harness/gameHarness.js`: 루프와 상태 제어를 담당하는 하네스
- `tests/unit/gameEngine.test.js`: 하네스 기반 단위 테스트
- `tests/unit/agentLoop.test.js`: Agent Loop 실패 처리 단위 테스트
- `tests/agent/retryEvidenceComparator.js`: 재시도 attempt별 실패 일관성 비교
- `tests/e2e/runner.spec.js`: 브라우저 수준 Playwright 테스트
- `tests/e2e/server.js`: Playwright E2E 전용 정적 서버
- `tests/e2e/evidence.spec.js`: Playwright 실패 증거 저장 검증용 의도된 실패 샘플
- `tests/e2e/productFailEvidence.spec.js`: `TC-005-01` 기준 PRODUCT_FAIL 의도 실패 샘플
- `tests/agent/playwrightEvidenceAnalyzer.js`: 저장된 Playwright evidence 기반 실패 분류와 Decision Log 기록

## 현재 자동화 구조

```text
Game
 ↓
GameHarness
 ↓
Unit Test / E2E
 ↓
Evidence
 ↓
Failure Classification
 ↓
Retry Evidence Comparison
 ↓
Decision Log
```

실패 evidence에는 다음 파일을 저장합니다.

```text
screenshot.png
console-log.json
state.json
metadata.json
test-info.json
timeline.json
assertion-error.json
```

`metadata.json`에는 `testCaseId`, `requirementId`, `testGroupId`, `expected`, `actual`, `assertion`, `classificationBasis`를 저장합니다.

`timeline.json`에는 테스트 단계와 PASS/FAIL 기준 불합 지점을 저장합니다. 실패 기준 항목에는 `comparison`, `passCriteria`, `expected`, `actual`, `failedBecause`를 기록해 “어느 기준을 만족하지 못해서 FAIL이 되었는지”를 확인할 수 있게 합니다.

`comparison`은 사람이 한눈에 볼 수 있는 요약입니다. 예를 들어 기대결과는 `status=gameOver, collision=true`, 실제결과는 `status=running, collision=true`처럼 한 줄로 정리합니다.

`assertion-error.json`에는 Playwright가 남긴 원본 실패 메시지와 stack trace를 내부 evidence로 저장합니다. 사람이 보는 요약에서는 코드 위치보다 `failureSummary`의 평가 기준, 기대결과, 실제결과, 실패 사유를 우선 확인합니다.

## 프로젝트 문서

- `AGENTS.md`: 이후 작업자와 에이전트를 위한 프로젝트 지도
- `docs/project-status.md`: 현재 진행상황과 다음 작업
- `docs/harness-engineering.md`: 하네스와 루프 엔지니어링 전략
- `docs/agent-loop-design.md`: Sprint 2 QA Agent Loop 설계
- `docs/agent-loop-runbook.md`: Agent Loop 실행 명령과 결과 해석
- `docs/sprint-2-feature-test-candidates.md`: Sprint 2 기능 테스트 후보와 우선순위
- `docs/test-classification.md`: 테스트 대분류와 Sprint 1 범위
- `docs/test-plan.md`: 현재 테스트 목적, 범위, 시작 조건, 완료 조건
- `docs/test-cases.md`: 테스트 케이스 목차와 공통 metadata 기준
- `docs/test-cases/`: 대분류별 테스트 케이스 상세 문서
- `docs/risk-analysis.md`: 제품 리스크와 테스트 대응
- `docs/test-guardrails.md`: 테스트 수행 중 지켜야 할 가드레일
- `docs/test-report.md`: 테스트 실행 결과와 남은 작업

## 테스트 명령

```bash
npm test
npm run test:e2e
npm run test:e2e:evidence
npm run test:e2e:product-fail-evidence
npm run test:e2e:test-fail-evidence
npm run test:e2e:env-fail-evidence
npm run test:agent:evidence
```

`npm test`는 Vitest 기반 단위 테스트를 실행합니다.
`npm run test:e2e`는 Playwright 기반 정상 브라우저 E2E를 실행합니다.
`npm run test:e2e:evidence`는 실패 증거 저장을 확인하기 위한 의도된 실패 명령입니다.
`npm run test:e2e:product-fail-evidence`는 `TC-005-01` 기준 PRODUCT_FAIL evidence 분류를 확인하기 위한 의도된 실패 명령입니다.
`npm run test:e2e:test-fail-evidence`는 `TC-008-06` 기준 TEST_FAIL evidence 분류를 확인하기 위한 의도된 실패 명령입니다.
`npm run test:e2e:env-fail-evidence`는 `TC-008-07` 기준 ENV_FAIL evidence 분류를 확인하기 위한 의도된 실패 명령입니다.
`npm run test:agent:evidence`는 저장된 Playwright evidence를 읽어 실패 분류와 다음 행동 결정을 기록합니다.

## 현재 TC 문서 구조

테스트 케이스는 대분류별로 분리되어 있습니다.

```text
docs/test-cases/
├─ initial-state-management.md
├─ player-input-movement.md
├─ game-loop-progression.md
├─ obstacle-spawn-movement.md
├─ collision-game-over.md
├─ score-record.md
├─ regression-flow.md
└─ browser-e2e.md
```

현재 상세화가 완료된 주요 문서는 `collision-game-over.md`와 `browser-e2e.md`입니다.

## 다음 작업

다음 작업은 브라우저 E2E 확장 또는 JSON evidence 기반 Markdown 리포트 자동 생성 중 하나를 선택해 진행하는 것입니다.

추후 evidence 구조가 충분히 안정되면 JSON evidence와 Decision Log를 기반으로 사람이 읽기 좋은 Markdown 테스트 리포트를 자동 생성하는 작업을 진행할 예정입니다.
