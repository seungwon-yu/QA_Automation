import { test, expect } from "./evidenceTest.js";

test.describe("Playwright evidence collector", () => {
  test("실패 시 screenshot, console log, QA state를 저장한다", async ({ page, qaEvidence }, testInfo) => {
    await page.goto("/");
    await page.evaluate(() => console.log("QA_EVIDENCE_SAMPLE_LOG"));

    qaEvidence.setMetadata({
      testCaseId: "TC-008-EVIDENCE-001",
      requirementId: "REQ-EVIDENCE-001",
      testGroupId: "TC-GROUP-08",
      testGroupName: "브라우저 E2E",
      assertion: {
        name: "Playwright 실패 증거 저장",
        message: "의도된 실패가 발생하면 screenshot, console log, QA state, test info, metadata를 저장한다."
      },
      expected: {
        evidenceSaved: true,
        productBehavior: "판정 대상 아님"
      },
      actual: {
        evidenceSaved: "실패 이후 fixture에서 확인",
        productBehavior: "판정 대상 아님"
      },
      notes: [
        "이 테스트는 evidence 저장 검증용 의도된 실패 샘플이다.",
        "제품 요구사항 위반 여부를 판단하는 테스트 케이스가 아니다."
      ]
    });
    qaEvidence.addClassificationBasis({
      testGroupId: "TC-GROUP-08",
      basisType: "evidenceCollectionSample",
      supports: "REVIEW_REQUIRED",
      reason: "의도된 실패 샘플이므로 제품, 테스트, 환경 실패로 단정하지 않는다."
    });

    expect(qaEvidence.consoleMessages.some((message) => message.text === "QA_EVIDENCE_SAMPLE_LOG")).toBe(true);

    testInfo.annotations.push({
      type: "expected-failure-sample",
      description: "증거 저장 검증을 위한 의도된 실패 샘플"
    });

    expect(false).toBe(true);
  });
});
