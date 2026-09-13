import { test, expect } from "./evidenceTest.js";

test("EXP-001 결함 주입 시 충돌 상태 전이 실패를 검출한다", async ({ page, qaEvidence }) => {
  await page.goto("/");
  const actual = await page.evaluate(() => {
    const { engine } = window.__QA_AUTOMATION__;
    engine.start();
    engine.forceObstacle({ ...engine.getState().player });
    const collision = engine.intersects(engine.player, engine.obstacles[0]);
    engine.intersects = () => false;
    engine.tick(0);
    return { status: engine.getState().status, collision };
  });
  qaEvidence.setMetadata({
    testCaseId: "EXP-001", requirementId: "REQ-COLLISION-001", testGroupId: "TC-GROUP-05",
    expected: { status: "gameOver", collision: true }, actual,
    assertion: { name: "실제 겹침 조건에서 충돌 상태 전이" },
    notes: ["인위적 결함 주입 실험. 배포 게임에서 발견한 실제 결함이 아니다. 브라우저 인스턴스에만 적용한다."]
  });
  qaEvidence.addClassificationBasis({ basisType: "controlledMutation", supports: "PRODUCT_FAIL", reason: "겹침을 확인한 뒤 충돌 판정을 비활성화한 실험에서 gameOver 전이가 누락됨" });
  qaEvidence.recordCriterion({ name: "EXP-001", status: "failed", result: "FAIL", passCriteria: "충돌 시 gameOver", expected: { status: "gameOver" }, actual, failedBecause: "인위적으로 충돌 판정을 비활성화함" });
  expect(actual.collision).toBe(true);
  expect(actual.status).toBe("gameOver");
});
