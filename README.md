# 러너 게임 QA 자동화 포트폴리오

게임 QA 신입 지원을 위해 **무엇을 검증해야 하는지 판단하고, 문제를 재현하며, 판단 근거를 설명하는 과정**을 구현한 프로젝트입니다. 직접 만든 러너 게임은 통제 가능한 테스트 대상이며, 게임 제작 규모보다 테스트 설계와 재현성이 중심입니다.

## 먼저 확인할 결과

| 질문 | 대표 자료 |
| --- | --- |
| 무엇을 왜 검증하는가? | [게임 규칙](docs/game-rules.md), [리스크 분석](docs/risk-analysis.md) |
| 경계값·상태 전이를 어떻게 검증하는가? | [충돌 TC](docs/test-cases/collision-game-over.md), [추적표](docs/traceability-matrix.md) |
| 문제를 어떻게 재현하고 설명했는가? | [하네스 결함 개선 사례](docs/case-study.md) |
| 현재 어디까지 완료했는가? | [현재 상태](docs/project-status.md), [실행 리포트](docs/test-report.md), [완성도 판단](docs/completion-review.md) |

## 구현 범위

- 엔진·렌더링·입력 분리와 프레임/랜덤 입력을 제어하는 하네스.
- 초기 상태, 점프, 충돌 경계, 점수, 재시작, 브라우저 입력 연결 테스트.
- 실패 시 screenshot·로그·상태·metadata 수집 및 캡처 실패 기록.
- 규칙 기반 실패 분류 보조와 최대 **총 3회 실행**. AI가 원인을 독립적으로 확정하거나 코드를 자동 수정하는 구조는 아닙니다.
- CI용 원본 결과·Markdown 요약 생성. 실제 GitHub 실행 여부는 실행 리포트에서 구분합니다.

## 실행

Node.js 24와 npm을 사용합니다. 저장소 루트에서 실행합니다.

```sh
npm ci
npx playwright install chromium
npm test
npm run test:e2e
```

게임 직접 확인: `npm run serve` 후 `http://127.0.0.1:4173`에 접속합니다.
결과 JSON과 통합 요약 명령은 [CI 문서](docs/ci.md), 의도 실패 실험은 [실행 가이드](docs/agent-loop-runbook.md)에 있습니다.

## 읽을 때 주의할 범위

단위 테스트 수는 게임 TC 수와 다릅니다. 하네스·분류기 검증을 포함합니다. EXP-001은 별도 브라우저에 결함을 주입한 검출 실험이며 실제 출시 게임의 결함 발견 사례가 아닙니다. 다중 브라우저·장시간 성능·보안 검증은 현재 제출 범위 밖입니다.

[전체 문서 지도](docs/index.md) · [작업 규칙](AGENTS.md)
