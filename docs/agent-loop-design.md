# 규칙 기반 실패 처리 설계

기존 Agent Loop라는 파일 이름을 유지한다. 실제 구현은 명령 실행→증거→규칙 기반 후보 분류→재시도/종료→기록이다. LLM 호출, 독립적인 근본 원인 분석, 자동 코드 수정은 없다.

| 결과 | 처리 |
| --- | --- |
| PASS | 명령 성공 종료, STOP |
| PRODUCT_FAIL | 구조화된 기대/실제 불일치 근거 또는 명시적 합성 fixture 계약에 따른 후보 |
| TEST_FAIL | strict locator 오류 등 구체적인 도구 근거 |
| ENV_FAIL | 브라우저 파일 누락·연결 거부 등 구체적인 실행 근거 |
| REVIEW_REQUIRED | 일반 TypeError/timeout, 근거 누락, 서로 충돌하는 근거 |

브라우저 console과 tool 오류를 구분한다. 제품 콘솔의 단어만으로 도구 오류를 확정하지 않는다. metadata의 supports는 작성자가 제공한 근거이고 독립적 사실 검증을 대체하지 않는다. PRODUCT_ASSERTION은 합성 fixture용 계약이다.

PRODUCT/ENV 후보는 최초 실행을 포함해 최대 3 attempts, TEST/REVIEW는 재시도하지 않는다. 옵션명 maxRetries는 호환성을 위해 남았으나 의미는 총 실행 수이다. 재시도로 통과한 이력도 attempts에 남긴다.
RetryEvidenceComparator는 제공된 관찰 필드만 비교한다. CLI 실행에서는 screenshot의 시각적 동일성을 비교하지 않으므로 같은 분류가 같은 원인을 증명하지 않는다.

실제 실행법: [runbook](agent-loop-runbook.md). 반례 검증: DIAG-001~004. [완성도](completion-review.md)
