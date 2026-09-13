# 실패 재현 실행 가이드

모든 명령은 저장소 루트에서 실행한다. 정상 검증과 의도 실패를 분리한다.

```sh
npm test
npm run test:e2e
npm run test:agent -- npm test
```

## 의도 실패 실험

```sh
npm run test:e2e:product-fail-evidence
npm run test:e2e:test-fail-evidence
npm run test:e2e:env-fail-evidence
npx playwright test tests/e2e/captureFailureEvidence.spec.js
```

위 명령은 assertion 실패를 일으켜 종료 코드 1이 나오는 것이 의도이다. 실패 자체만 보고 성공이라 하지 않고 생성된 metadata·원본 오류·capture-status를 확인한다. EXP-001은 브라우저 인스턴스의 충돌 판정을 비활성화하며 제품 파일을 수정하지 않는다.

```sh
npm run test:agent:evidence -- artifacts/playwright-evidence/<이번-실행-폴더>
npm run report:markdown
```

분석 대상은 가능하면 이번 실행의 고유 evidence 경로를 명시한다. 인자를 생략하면 최신 폴더 선택에 의존하므로 다른 실행 증거를 해석할 위험이 있다. UUID가 붙은 폴더는 같은 TC 재실행의 덮어쓰기를 방지한다.
EVID-001은 페이지를 닫아 screenshot을 얻을 수 없게 하고 로그/metadata가 남는지 확인한다. 실제 제품 결함 발견 사례로 제시하지 않는다.

## 이번 변경의 실험 검증 묶음

```sh
npx playwright test tests/e2e/captureFailureEvidence.spec.js tests/e2e/productFailEvidence.spec.js tests/e2e/testFailEvidence.spec.js tests/e2e/envFailEvidence.spec.js --workers=1
node scripts/verify-experiments.js
```

첫 명령의 예상 종료 코드는 1이다. 두 번째 명령은 해당 실행 시작 이후의 증거만 찾아 네 분류와 JSON 보존을 확인하고 성공 시 0으로 종료한다. 의도 실패 결과는 experiments-e2e.json, 정상 결과는 e2e.json으로 분리해 통합 요약을 덮어쓰지 않는다.
