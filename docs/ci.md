# CI 검증 범위

`.github/workflows/ci.yml`은 의존성 설치→Unit→Chromium E2E→결과 요약→artifacts 업로드 순서이다. Unit 실패 후에도 E2E를 시도하며 앞 단계 미실행/실패 여부를 요약에 전달한다. 요약과 업로드는 always 조건으로 실행한다.

Unit/E2E 결과 JSON, `artifacts/playwright-evidence/`, HTML report, trace를 업로드한다. 실패 step을 continue-on-error로 통과 처리하지 않는다. screenshot 불가 시 capture-status와 남은 JSON을 보존한다.

로컬 확인:

```sh
npm ci
npx playwright install chromium
npm test -- --reporter=default --reporter=json --outputFile=artifacts/results/unit.json
npm run test:e2e
node scripts/summarize-results.js
```

의도 실패 실험은 정상 CI 필수 테스트에서 제외한다. 향후 전용 job을 만든다면 실패 exit만 허용하는 대신 실제 증거/분류도 assertion으로 검증해야 한다.
workflow 파일이 존재하는 것과 GitHub에서 성공한 것은 다르다. 원격 실행 URL·커밋·artifact 접근은 [완성도 판단](completion-review.md)의 별도 항목이다.

의도 실패 spec의 JSON/HTML은 experiments-e2e.json과 artifacts/experiment-report로 분리한다. 정상 보고서와 혼합하지 않는다.

## 게시 후 원격 검증

2026-09-14: 커밋 `3d47b0d`의 [GitHub Actions 실행](https://github.com/seungwon-yu/QA_Automation/actions/runs/34767022361)이 `success`로 완료됐다. `qa-automation-evidence` artifact 생성 및 미만료 상태를 API로 확인했다. 이 실행은 단위 테스트와 Chromium의 정상 E2E를 검증하며 의도 실패 실험은 제외한다.
