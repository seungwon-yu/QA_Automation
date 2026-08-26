# QA_Automation

러너 게임과 게임 QA 하네스를 중심으로 만든 자동화 테스트 포트폴리오 프로젝트입니다.

이 프로젝트는 게임 로직과 렌더링을 분리해, 자동화 테스트가 하네스를 통해 게임 루프를 제어하고 실패 evidence를 기반으로 실패 유형을 분류할 수 있도록 구성합니다.

현재 목표는 단순히 테스트를 PASS시키는 것이 아니라, 실패가 발생했을 때 `screenshot`, `console log`, `QA state`, `metadata`를 저장하고 `PRODUCT_FAIL`, `TEST_FAIL`, `ENV_FAIL`, `REVIEW_REQUIRED`로 판단할 수 있는 QA Agent Loop 기반을 만드는 것입니다.

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
- `tests/e2e/runner.spec.js`: 브라우저 수준 Playwright 테스트
- `tests/e2e/server.js`: Playwright E2E 전용 정적 서버
- `tests/e2e/evidence.spec.js`: Playwright 실패 증거 저장 검증용 의도된 실패 샘플
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
Decision Log
```

실패 evidence에는 다음 파일을 저장합니다.

```text
screenshot.png
console-log.json
state.json
metadata.json
test-info.json
```

`metadata.json`에는 `testCaseId`, `requirementId`, `testGroupId`, `expected`, `actual`, `assertion`, `classificationBasis`를 저장합니다.

## 프로젝트 문서

- `AGENTS.md`: 이후 작업자와 에이전트를 위한 프로젝트 지도
- `docs/project-status.md`: 현재 진행상황과 다음 작업
- `docs/harness-engineering.md`: 하네스와 루프 엔지니어링 전략
- `docs/agent-loop-design.md`: Sprint 2 QA Agent Loop 설계
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
npm run test:agent:evidence
```

`npm test`는 Vitest 기반 단위 테스트를 실행합니다.
`npm run test:e2e`는 Playwright 기반 정상 브라우저 E2E를 실행합니다.
`npm run test:e2e:evidence`는 실패 증거 저장을 확인하기 위한 의도된 실패 명령입니다.
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

다음 작업은 문서화된 `TC-005-01` 충돌 및 게임오버 기준을 실제 Playwright evidence 샘플에 연결해, 브라우저 실패 evidence가 `PRODUCT_FAIL`로 분류되는 흐름을 구현하는 것입니다.
