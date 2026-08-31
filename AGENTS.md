# AGENTS.md

## 프로젝트 역할
이 저장소는 게임 QA 자동화 포트폴리오 프로젝트이다.
프로젝트의 중심 이름은 `QA_Automation`이다.
러너 게임은 자동화 테스트를 위한 제어 가능한 테스트 대상이다.
자동화 구조의 중심은 하네스 엔지니어링이다.
루프 엔지니어링은 하네스 내부에 포함된다.

## 읽는 순서
1. `README.md`에서 프로젝트 요약을 확인한다.
2. `docs/project-status.md`에서 현재 진행상황과 다음 작업을 확인한다.
3. `docs/harness-engineering.md`에서 자동화 전략을 확인한다.
4. `docs/agent-loop-design.md`에서 Sprint 2 실패 처리 파이프라인을 확인한다.
5. `docs/agent-loop-runbook.md`에서 Agent Loop 실행 명령과 결과 해석을 확인한다.
6. `docs/markdown-report.md`에서 요약 리포트 생성 방법을 확인한다.
7. `docs/ci.md`에서 GitHub Actions CI 구성을 확인한다.
8. `docs/sprint-2-feature-test-candidates.md`에서 Sprint 2 기능 테스트 우선순위를 확인한다.
9. `docs/test-classification.md`에서 테스트 대분류를 확인한다.
10. `docs/test-plan.md`에서 현재 테스트 범위를 확인한다.
11. 테스트 케이스를 변경하기 전에 `docs/test-cases.md`와 `docs/test-cases/`의 대분류별 문서를 확인한다.
12. 위험한 게임 동작을 변경하기 전에 `docs/risk-analysis.md`를 확인한다.
13. 테스트를 실행하기 전에 `docs/test-guardrails.md`를 확인한다.
14. 코드를 수정하기 전에 `docs/code-convention.md`를 확인한다.
15. 커밋하기 전에 `docs/commit-convention.md`를 확인한다.

## 저장소 지도
- `index.html`: 브라우저 진입점.
- `src/gameEngine.js`: 결정 가능한 게임 규칙.
- `src/renderer.js`: canvas 렌더링.
- `src/input.js`: 키보드와 버튼 입력 연결.
- `src/main.js`: 브라우저 조립과 QA API 노출.
- `tests/harness/gameHarness.js`: 엔진 제어 하네스.
- `tests/agent/`: Agent Loop 실패 처리 파이프라인.
- `tests/agent/fixtures/`: 실패 분류 검증용 샘플 명령.
- `tests/agent/playwrightEvidenceAnalyzer.js`: Playwright evidence 기반 판단 연결.
- `tests/agent/markdownReportGenerator.js`: JSON summary 기반 Markdown 요약 리포트 생성.
- `tests/unit/gameEngine.test.js`: 하네스 기반 루프 테스트.
- `tests/e2e/evidenceTest.js`: Playwright 실패 증거 수집 fixture.
- `tests/e2e/runner.spec.js`: 브라우저 수준 Playwright 테스트.
- `tests/e2e/server.js`: Playwright E2E 전용 정적 서버와 종료 안정성 처리.
- `.github/workflows/ci.yml`: GitHub Actions 자동 검증 workflow.
- `docs/project-status.md`: 진행상황과 다음 작업 기록.
- `docs/test-report.md`: 마지막 테스트 실행 결과.
- `docs/test-guardrails.md`: 테스트 수행 가드레일.
- `docs/agent-loop-design.md`: QA Agent Loop 설계.
- `docs/agent-loop-runbook.md`: Agent Loop 실행 명령과 결과 해석.
- `docs/sprint-2-feature-test-candidates.md`: Sprint 2 기능 테스트 후보와 구현 우선순위.
- `docs/test-cases/`: 대분류별 테스트 케이스 상세 문서.
- `docs/`: QA와 프로젝트 지식 문서.

## 아키텍처 규칙
게임 로직과 렌더링을 분리한다.
엔진은 브라우저 없이 테스트 가능해야 한다.
렌더러는 게임 규칙을 소유하지 않는다.
입력 계층은 사용자 행동을 엔진 명령으로 변환한다.
하네스는 테스트에서 엔진을 제어하고 관찰한다.

## 하네스 엔지니어링 규칙
하네스 엔지니어링은 최상위 자동화 구조이다.
하네스는 QA 의도가 드러나는 읽기 쉬운 메서드를 제공한다.
하네스는 시작, 점프, 재시작, 장애물, 상태를 제어한다.
하네스는 안정적인 테스트를 위해 랜덤 요소를 결정 가능하게 만든다.
프레임 진행으로 충분한 경우 실제 시간 대기를 피한다.
상세 전략은 `docs/harness-engineering.md`에 둔다.

## 루프 엔지니어링 규칙
루프 엔지니어링은 하네스 내부에서 구현한다.
루프 테스트는 프레임 또는 초 단위로 게임을 진행한다.
루프 테스트는 시뮬레이션 시간에 따른 상태 전이를 관찰한다.
루프 테스트는 반복 업데이트에 의존하는 동작을 검증한다.
임의 대기보다 결정적인 프레임 진행을 우선한다.
상세 계획은 `docs/test-classification.md`에 둔다.

## 테스트 설계 규칙
세부 테스트를 늘리기 전에 테스트를 대분류로 나눈다.
필요한 경우 각 테스트 그룹을 ISTQB 기법과 연결한다.
제품 리스크를 기준으로 테스트 우선순위를 정한다.
빠른 하네스 테스트와 느린 브라우저 E2E 테스트를 분리한다.
브라우저 E2E는 DOM, 입력 연결, 통합 검증이 필요할 때 사용한다.

## 현재 테스트 우선순위
1순위: 초기화 및 상태 관리.
1순위: 입력 및 플레이어 동작.
1순위: 게임 루프 진행.
1순위: 충돌 및 게임오버.
Sprint 2 1순위: 장애물 생성 및 이동.
Sprint 2 2순위: 점수 및 최고 기록.
Sprint 2 3순위: 리그레션 플로우.
Sprint 2 4순위: 브라우저 E2E 확장.
Sprint 2 5순위: 장시간 안정성 테스트.

## 코드 스타일
문자열은 쌍따옴표를 사용한다.
문장 끝에는 세미콜론을 사용한다.
변수명과 함수명은 camelCase를 사용한다.
클래스명은 UpperCamelCase를 사용한다.
한 줄에는 하나의 문장만 작성한다.
연산자 양쪽에는 공백을 추가한다.
콤마 뒤에는 공백을 추가한다.
주석은 설명하려는 코드에 맞춰 들여쓰기한다.

## 네이밍 규칙
명확한 도메인 이름을 사용한다.
좋은 이름의 예는 `GameEngine`, `GameHarness`, `player`, `obstacle`이다.
`Data`, `Manager`, `Info`처럼 모호한 이름은 피한다.
불필요한 약어를 피한다.
의도가 드러날 만큼 구체적인 이름을 사용한다.

## 커밋 규칙
`docs/commit-convention.md`를 따른다.
형식은 `Type: 한글 제목`을 사용한다.
제목과 본문은 빈 줄로 구분한다.
본문에는 무엇을 왜 변경했는지 설명한다.
한 커밋에는 하나의 개념적 변경만 담는다.

## 검증 규칙
테스트 중 제품 코드, 요구사항, 기대결과, assertion, PASS/FAIL 기준을 임의로 변경하지 않는다.
동일 조건 재시도는 최대 3회까지만 허용한다.
FAIL 발생 시 screenshot, log, state를 저장한다.
원인이 불명확하면 BUG로 단정하지 않고 `REVIEW_REQUIRED`로 종료한다.
테스트 환경 오류는 `PRODUCT_FAIL`과 구분한다.
상세 기준은 `docs/test-guardrails.md`를 따른다.
엔진 변경 후에는 스모크 테스트, 하네스 변경 후에는 단위 테스트, 브라우저 통합 변경 후에는 E2E 테스트를 실행한다.
실행하지 못한 테스트는 문서화한다.

## 문서 규칙
문서 내용은 한글로 작성한다.
이 파일은 짧은 지도 역할로 유지한다.
상세 설명은 `docs/`에 둔다.
테스트 전략이 바뀌면 문서도 함께 갱신한다.
작업을 마칠 때 `docs/project-status.md`를 갱신한다.
구현과 문서가 어긋나지 않게 관리한다.
