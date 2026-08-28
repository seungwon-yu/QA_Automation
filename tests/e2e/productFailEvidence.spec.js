import { test, expect } from "./evidenceTest.js";

test.describe("Product failure evidence sample", () => {
  test("TC-005-01 충돌 시 gameOver 상태가 되어야 한다", async ({ page, qaEvidence }, testInfo) => {
    await page.goto("/");
    qaEvidence.recordStep({
      name: "page-loaded",
      status: "passed"
    });

    await page.getByRole("button", { name: "Start", exact: true }).click();
    await expect(page.locator("#state")).toHaveText("running");

    const state = await page.evaluate(() => window.__QA_AUTOMATION__.getState());
    qaEvidence.recordStep({
      name: "start-clicked",
      status: "passed",
      state: {
        status: state.status,
        score: state.score
      }
    });
    qaEvidence.recordStep({
      name: "collision-condition-assumed",
      status: "recorded",
      state: {
        collision: true
      }
    });

    qaEvidence.setMetadata({
      testCaseId: "TC-005-01",
      requirementId: "REQ-COLLISION-001",
      testGroupId: "TC-GROUP-05",
      testGroupName: "충돌 및 게임오버",
      assertion: {
        name: "충돌 시 게임오버 상태 전이",
        message: "충돌 조건이 true이면 게임 상태는 gameOver가 되어야 한다."
      },
      expected: {
        status: "gameOver",
        collision: true
      },
      actual: {
        status: state.status,
        collision: true
      },
      notes: [
        "제품 코드를 수정하지 않고 PRODUCT_FAIL 분류 흐름을 검증하기 위한 의도 실패 샘플이다.",
        "실제 제품 결함 보고가 아니라 Agent Loop의 evidence 기반 분류 검증에 사용한다."
      ]
    });
    qaEvidence.addClassificationBasis({
      testGroupId: "TC-GROUP-05",
      basisType: "collisionStateMismatch",
      supports: "PRODUCT_FAIL",
      reason: "충돌 조건이 true인데 게임 상태가 gameOver로 전이되지 않음"
    });

    testInfo.annotations.push({
      type: "product-fail-evidence-sample",
      description: "TC-005-01 PRODUCT_FAIL 분류 검증을 위한 의도된 실패 샘플"
    });

    qaEvidence.recordCriterion({
      name: "TC-005-01 PASS 기준",
      status: "failed",
      passCriteria: "충돌 이후 status === \"gameOver\"",
      expected: {
        status: "gameOver",
        collision: true
      },
      actual: {
        status: state.status,
        collision: true
      },
      result: "FAIL",
      failedBecause: "actual.status가 expected.status와 다름"
    });

    expect(state.status).toBe("gameOver");
  });
});
