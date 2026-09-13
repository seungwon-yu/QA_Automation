# 실행 결과와 근거 보고

보고서는 검증 범위, 실행 상태, 기대/실제 결과, 판단 근거, 증거 경로, 남은 확인을 보여준다.

## 현재 결과 집계

```sh
npm test -- --reporter=default --reporter=json --outputFile=artifacts/results/unit.json
npm run test:e2e
node scripts/summarize-results.js
```

`artifacts/reports/verification-summary.md`는 Unit/E2E 원본 JSON을 별도로 집계한다. 누락은 미확인으로 표시한다. CI에서는 step outcome을 함께 전달한다. 로컬에서는 오래된 JSON이 남지 않도록 같은 실행에서 생성한 파일인지 시각을 확인한다.

기존 `npm run report:markdown`은 `artifacts/agent/last-summary.json`의 단일 분석 요약이다. 전체 TC 결과를 대표하지 않는다. 원본 assertion 오류와 QA 설명을 구분하고 분류기 판단을 확정 버그로 바꾸지 않는다.

공유 가능한 대표 결과는 [실행 리포트](test-report.md)와 [사례](case-study.md)에 연결한다. 파일이 없으면 존재하는 것처럼 링크하지 않는다.

의도 실패 spec의 JSON/HTML은 experiments-e2e.json과 artifacts/experiment-report로 분리한다. 정상 보고서와 혼합하지 않는다.
