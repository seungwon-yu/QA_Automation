# Markdown 요약 리포트

## 목적

Markdown 요약 리포트는 JSON으로 저장된 evidence와 Decision Log를 사람이 읽기 쉬운 형태로 정리하기 위한 문서이다.

테스트 실행 후 남는 `metadata.json`, `timeline.json`, `assertion-error.json`, `state.json`, `decision-log.jsonl`, `last-summary.json`은 자동화 도구가 읽기에는 좋지만 사람이 한눈에 흐름을 파악하기에는 어렵다.

따라서 Markdown 리포트는 다음 정보를 표 형태로 정리한다.

- 어떤 테스트가 실행되었는지
- 최종 결과가 `PASS`인지 `FAIL`인지
- 실패했다면 어떤 유형으로 분류되었는지
- 어떤 기준을 만족하지 못했는지
- 기대결과와 실제결과가 어떻게 달랐는지
- Agent Loop가 다음 행동을 무엇으로 결정했는지
- 관련 evidence 파일이 어디에 저장되었는지

## 생성 명령

```bash
npm run report:markdown
```

기본 입력 파일은 다음과 같다.

```text
artifacts/agent/last-summary.json
```

기본 출력 파일은 다음과 같다.

```text
artifacts/reports/latest-summary.md
```

특정 summary 파일과 출력 파일을 지정할 수도 있다.

```bash
node tests/agent/generateMarkdownReport.js artifacts/agent/last-summary.json artifacts/reports/latest-summary.md
```

## 리포트 구성

### 실행 요약

테스트 ID, 실행 명령, 최종 결과, 최종 분류, 최종 결정, 실행 횟수를 보여준다.

### 실패 기준 요약

평가 대상, PASS 기준, 기대결과, 실제결과, 프레임워크 관찰값, 실패 사유를 보여준다.

이 영역은 코드 위치보다 QA 판단 기준을 먼저 보여주는 것을 목표로 한다.

### 판단 근거

분류기가 관찰한 내용, 다음 행동, 결정 이유, 재현성, 재시도 비교 결과를 보여준다.

### Attempt 기록

재시도가 발생했을 경우 각 attempt의 결과, 분류, 결정, evidence 경로를 비교할 수 있게 한다.

### Evidence 경로

실패 분석에 사용된 evidence 디렉터리와 screenshot 경로를 보여준다.

## 현재 한계

리포트는 `last-summary.json`에 저장된 정보를 기반으로 생성된다.

따라서 summary에 `failureSummary`, `expected`, `actual`, `screenshotPath`가 없으면 해당 항목은 `-`로 표시된다.

향후에는 여러 evidence 디렉터리를 한 번에 읽어 테스트 실행 회차별 종합 리포트를 생성하는 방식으로 확장할 수 있다.
