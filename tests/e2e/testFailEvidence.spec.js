import { test, expect } from "./evidenceTest.js";

test.describe("Test failure evidence sample", () => {
  test("TC-008-06 locator가 모호하면 TEST_FAIL로 분류한다", async ({ page, qaEvidence }, testInfo) => {
    await page.goto("/");
    qaEvidence.recordStep({
      name: "page-loaded",
      status: "passed"
    });

    qaEvidence.setMetadata({
      testCaseId: "TC-008-06",
      requirementId: "REQ-E2E-LOCATOR-001",
      testGroupId: "TC-GROUP-08",
      testGroupName: "브라우저 E2E",
      assertion: {
        name: "브라우저 버튼 locator 명확성",
        message: "자동화 테스트는 사용자 조작 대상 버튼을 명확한 locator로 선택해야 한다."
      },
      expected: {
        locator: "단일 버튼만 선택",
        productBehavior: "판정 대상 아님"
      },
      actual: {
        locator: "여러 버튼이 동시에 선택됨",
        productBehavior: "판정 대상 아님"
      },
      notes: [
        "제품 기능 실패가 아니라 테스트 자동화 코드 문제를 검증하기 위한 의도 실패 샘플이다.",
        "locator가 명확하지 않으면 제품 재실행으로 해결할 수 없으므로 TEST_FAIL로 분류해야 한다."
      ]
    });
    qaEvidence.addClassificationBasis({
      testGroupId: "TC-GROUP-08",
      basisType: "locatorAmbiguity",
      supports: "TEST_FAIL",
      reason: "button role locator가 Start, Jump, Restart 버튼을 모두 선택하므로 테스트 코드의 locator가 모호함"
    });

    qaEvidence.recordCriterion({
      name: "TC-008-06 PASS 기준",
      status: "failed",
      passCriteria: "자동화 locator는 조작 대상 요소를 하나만 선택해야 한다.",
      expected: {
        matchedElements: 1,
        locator: "명확한 버튼 locator"
      },
      actual: {
        matchedElements: 3,
        locator: "page.getByRole(\"button\")"
      },
      result: "FAIL",
      failedBecause: "button role locator가 여러 버튼을 동시에 선택함"
    });

    testInfo.annotations.push({
      type: "test-fail-evidence-sample",
      description: "TC-008-06 TEST_FAIL 분류 검증을 위한 의도된 실패 샘플"
    });

    await page.getByRole("button").click();

    await expect(page.locator("#state")).toHaveText("running");
  });
});
