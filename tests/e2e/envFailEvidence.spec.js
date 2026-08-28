import { test } from "./evidenceTest.js";

test.describe("Environment failure evidence sample", () => {
  test("TC-008-07 테스트 서버에 연결할 수 없으면 ENV_FAIL로 분류한다", async ({ page, qaEvidence }, testInfo) => {
    const unavailableUrl = "http://127.0.0.1:59999";

    qaEvidence.setMetadata({
      testCaseId: "TC-008-07",
      requirementId: "REQ-E2E-ENV-001",
      testGroupId: "TC-GROUP-08",
      testGroupName: "브라우저 E2E",
      assertion: {
        name: "브라우저 테스트 서버 연결성",
        message: "E2E 테스트는 테스트 대상 서버에 연결할 수 있어야 한다."
      },
      expected: {
        serverConnection: "available",
        url: unavailableUrl
      },
      actual: {
        serverConnection: "refused",
        url: unavailableUrl
      },
      notes: [
        "제품 기능 실패가 아니라 테스트 실행 환경 문제를 검증하기 위한 의도 실패 샘플이다.",
        "서버 연결 실패는 제품 재실행이나 테스트 코드 리뷰보다 환경 점검이 먼저 필요하다."
      ]
    });
    qaEvidence.addClassificationBasis({
      testGroupId: "TC-GROUP-08",
      basisType: "serverConnectionRefused",
      supports: "ENV_FAIL",
      reason: "테스트 대상 URL에 연결할 수 없어 브라우저 E2E 실행 환경이 준비되지 않음"
    });

    qaEvidence.recordCriterion({
      name: "TC-008-07 PASS 기준",
      status: "failed",
      passCriteria: "브라우저 E2E 테스트는 테스트 대상 서버에 접속할 수 있어야 한다.",
      expected: {
        serverConnection: "available",
        url: unavailableUrl
      },
      actual: {
        serverConnection: "refused",
        url: unavailableUrl
      },
      result: "FAIL",
      failedBecause: "테스트 대상 서버 연결이 거부됨"
    });

    testInfo.annotations.push({
      type: "env-fail-evidence-sample",
      description: "TC-008-07 ENV_FAIL 분류 검증을 위한 의도된 실패 샘플"
    });

    await page.goto(unavailableUrl);
  });
});
