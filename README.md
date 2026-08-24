# QA_Automation

러너 게임과 게임 QA 하네스를 중심으로 만든 자동화 테스트 포트폴리오 프로젝트입니다.

이 프로젝트는 게임 로직과 렌더링을 분리해, 자동화 테스트가 하네스를 통해 게임 루프를 제어할 수 있도록 구성합니다.

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
- `tests/e2e/runner.spec.js`: 브라우저 수준 Playwright 테스트

## 프로젝트 문서

- `AGENTS.md`: 이후 작업자와 에이전트를 위한 프로젝트 지도
- `docs/project-status.md`: 현재 진행상황과 다음 작업
- `docs/harness-engineering.md`: 하네스와 루프 엔지니어링 전략
- `docs/agent-loop-design.md`: Sprint 2 QA Agent Loop 설계
- `docs/test-classification.md`: 테스트 대분류와 Sprint 1 범위
- `docs/test-plan.md`: 현재 테스트 목적, 범위, 시작 조건, 완료 조건
- `docs/test-cases.md`: 현재 세부 테스트 케이스
- `docs/risk-analysis.md`: 제품 리스크와 테스트 대응
- `docs/test-guardrails.md`: 테스트 수행 중 지켜야 할 가드레일
- `docs/test-report.md`: 테스트 실행 결과와 남은 작업

## 테스트 명령

```bash
npm test
npm run test:e2e
```
