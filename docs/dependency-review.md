# 개발 도구 의존성 검증

2026-09-14 npm audit에서 6건(critical 1, high 1, moderate 4)을 확인했다. 배포 제품에서 악용됐다는 의미는 아니며 개발 도구 의존성의 공개 advisory 결과이다.

Vitest를 Node 24와 호환되는 4.1.11로 갱신하고 qs 간접 의존성을 수정 버전으로 갱신했다. 자동 강제 수정 대신 버전을 확인하고 package.json/package-lock.json을 함께 반영했다.

현재 버전: {'vitest': '4.1.11', 'vite': '8.3.0', 'qs': '6.16.0'}. 이후 npm audit 결과 **총 0건**. 알려진 advisory 기준의 점검 결과이며 모든 보안 결함 부재를 보장하지 않는다.

재검증: Vitest 4.1.11에서 단위 74개 통과. 정상 브라우저 E2E 4개×3회=12개 통과. [audit 요약](samples/dependency-audit.json)
