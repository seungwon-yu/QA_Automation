# CI 구성

## 목적

CI는 코드가 GitHub에 올라갔을 때 같은 기준으로 자동 검증을 실행하기 위한 구성이다.

로컬에서 사람이 직접 `npm test`, `npm run test:e2e`, `npm run report:markdown`을 실행하는 대신, GitHub Actions가 push와 pull request 시점에 동일한 검증을 수행한다.

## 현재 CI 도구

현재 프로젝트는 GitHub 저장소를 사용하므로 GitHub Actions를 CI 도구로 사용한다.

설정 파일은 다음 위치에 있다.

```text
.github/workflows/ci.yml
```

## 실행 시점

CI는 다음 상황에서 실행된다.

- `main` 브랜치에 push
- `main` 브랜치를 대상으로 pull request 생성 또는 갱신

## 실행 흐름

```text
GitHub push 또는 pull request
↓
GitHub Actions runner 시작
↓
npm ci
↓
Playwright Chromium 설치
↓
npm test
↓
npm run test:e2e
↓
npm run test:agent -- npm test
↓
npm run report:markdown
↓
결과와 artifact 저장
```

## 검증 범위

| 단계 | 명령 | 목적 |
| --- | --- | --- |
| 의존성 설치 | `npm ci` | `package-lock.json` 기준으로 동일한 의존성 설치 |
| 브라우저 설치 | `npx playwright install --with-deps chromium` | E2E 실행에 필요한 Chromium 설치 |
| 단위 테스트 | `npm test` | GameHarness, GameEngine, Agent Loop 단위 검증 |
| 브라우저 E2E | `npm run test:e2e` | 실제 브라우저 UI, 버튼, 키보드 입력, QA state 연결 검증 |
| Agent Summary | `npm run test:agent -- npm test` | CI 환경에서 `last-summary.json` 생성 |
| Markdown 리포트 | `npm run report:markdown` | JSON summary를 사람이 읽기 좋은 리포트로 변환 |

## Artifact

CI가 끝나면 다음 산출물을 업로드한다.

```text
artifacts/agent/last-summary.json
artifacts/reports/latest-summary.md
playwright-report/
test-results/
```

`last-summary.json`은 Agent Loop가 읽기 좋은 구조화 결과이고, `latest-summary.md`는 사람이 읽기 좋은 요약 리포트이다.

## 실패 해석 기준

CI 실패는 바로 제품 버그를 의미하지 않는다.

실패 위치에 따라 다음처럼 구분한다.

| 실패 위치 | 우선 분류 |
| --- | --- |
| `npm ci` | `ENV_FAIL` |
| `npx playwright install --with-deps chromium` | `ENV_FAIL` |
| `npm test` | `PRODUCT_FAIL`, `TEST_FAIL`, `REVIEW_REQUIRED` 후보 |
| `npm run test:e2e` | `PRODUCT_FAIL`, `TEST_FAIL`, `ENV_FAIL`, `REVIEW_REQUIRED` 후보 |
| `npm run report:markdown` | `TEST_FAIL` 후보 |

원인이 명확하지 않은 경우에는 제품 문제로 단정하지 않고 `REVIEW_REQUIRED`로 판단한다.

## 현재 한계

현재 CI는 정상 테스트 흐름과 summary 리포트 생성을 검증한다.

의도된 실패 샘플인 `npm run test:e2e:product-fail-evidence`, `npm run test:e2e:test-fail-evidence`, `npm run test:e2e:env-fail-evidence`는 실패 증거 생성용 명령이므로 기본 CI에는 포함하지 않는다.

향후에는 별도 workflow 또는 수동 실행 workflow로 의도 실패 샘플을 분리할 수 있다.
