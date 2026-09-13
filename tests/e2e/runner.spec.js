import { test, expect } from "./evidenceTest.js";

test("TC-008-01 페이지 로드 시 게임 UI가 표시된다", async ({ page, qaEvidence }) => {
  qaEvidence.setMetadata({
    testCaseId: "TC-008-01",
    requirementId: "REQ-E2E-001",
    testGroupId: "TC-GROUP-08",
    testGroupName: "브라우저 E2E",
    assertion: {
      name: "페이지 로드 시 게임 UI 표시",
      message: "브라우저에서 페이지를 열면 canvas와 조작 버튼이 표시되어야 한다."
    },
    expected: {
      canvasVisible: true,
      startButtonVisible: true,
      jumpButtonVisible: true,
      restartButtonVisible: true
    }
  });

  await page.goto("/");

  await expect(page.locator("#game")).toBeVisible();
  await expect(page.getByRole("button", { name: "Start", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Jump", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Restart", exact: true })).toBeVisible();
});

test("TC-008-02 Start 버튼 클릭 시 게임이 running 상태가 된다", async ({ page, qaEvidence }) => {
  qaEvidence.setMetadata({
    testCaseId: "TC-008-02",
    requirementId: "REQ-E2E-002",
    testGroupId: "TC-GROUP-08",
    testGroupName: "브라우저 E2E",
    assertion: {
      name: "Start 버튼 상태 전이",
      message: "Start 버튼 클릭 후 UI와 QA state는 running 상태여야 한다."
    },
    expected: {
      uiState: "running",
      qaState: "running"
    }
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await expect(page.locator("#state")).toHaveText("running");

  const state = await page.evaluate(() => window.__QA_AUTOMATION__.getState());
  expect(state.status).toBe("running");
});

test("TC-008-03 Space 키 입력 시 플레이어가 점프한다", async ({ page, qaEvidence }) => {
  qaEvidence.setMetadata({
    testCaseId: "TC-008-03",
    requirementId: "REQ-E2E-003",
    testGroupId: "TC-GROUP-08",
    testGroupName: "브라우저 E2E",
    assertion: {
      name: "Space 키 점프 입력",
      message: "게임 실행 중 Space 키 입력 후 player.y는 입력 전보다 작아야 한다."
    },
    expected: {
      playerY: "beforeY보다 작음"
    }
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Start", exact: true }).click();

  const beforeY = await page.evaluate(() => window.__QA_AUTOMATION__.getState().player.y);
  await page.keyboard.press("Space");

  await page.waitForFunction((initialY) => {
    return window.__QA_AUTOMATION__.getState().player.y < initialY;
  }, beforeY);

  const afterY = await page.evaluate(() => window.__QA_AUTOMATION__.getState().player.y);
  expect(afterY).toBeLessThan(beforeY);
});

test("TC-008-04 Restart 버튼 클릭 시 상태와 점수가 초기화된다", async ({ page, qaEvidence }) => {
  qaEvidence.setMetadata({
    testCaseId: "TC-008-04",
    requirementId: "REQ-E2E-004",
    testGroupId: "TC-GROUP-08",
    testGroupName: "브라우저 E2E",
    assertion: {
      name: "Restart 버튼 상태 초기화",
      message: "Restart 버튼 클릭 후 상태는 running, 점수는 0이어야 한다."
    },
    expected: {
      status: "running",
      score: 0
    }
  });

  await page.clock.install({ time: new Date("2026-01-01T00:00:00Z") });
  await page.goto("/");
  await page.clock.pauseAt(new Date("2026-01-01T00:00:01Z"));
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await page.clock.runFor(200);
  expect(await page.evaluate(() => window.__QA_AUTOMATION__.getState().score)).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Restart", exact: true }).click();
  // HUD 갱신에 필요한 한 프레임만 진행하고 검증 중 시간은 멈춘다.
  await page.clock.runFor(16);

  await expect(page.locator("#state")).toHaveText("running");
  await expect(page.locator("#score")).toHaveText("0");

  const state = await page.evaluate(() => window.__QA_AUTOMATION__.getState());
  qaEvidence.setMetadata({ actual: { status: state.status, score: state.score } });
  expect(state.status).toBe("running");
  expect(state.score).toBe(0);
});
