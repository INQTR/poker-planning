import { test, expect, type Page } from "@playwright/test";

test.describe("Planning Poker Estimation", () => {
  let pages: Page[];

  test.beforeAll(async ({ browser }) => {
    pages = await Promise.all(
      Array(4)
        .fill(null)
        .map(() => browser.newPage()),
    );
  });

  test.afterAll(async () => {
    await Promise.all(pages.map((page) => page.close()));
  });

  test("should allow multiple users to join a room and estimate a task", async () => {
    const [hostPage, ...guestPages] = pages;
    const roomUrl = await createRoom(hostPage);
    await joinRoom(hostPage, "User 1");

    for (const [index, page] of guestPages.entries()) {
      await joinRoom(page, `User ${index + 2}`, roomUrl);
    }

    await verifyAllUsersPresent(pages);
    await makeEstimations(pages);
    await revealEstimations(hostPage);
    await verifyResults(pages);
    await startNewRound(hostPage);
    await verifyNewRound(pages);
  });
});

async function createRoom(page: Page): Promise<string> {
  await page.goto("http://localhost:5173");
  await page.getByRole("button", { name: "Start New Game" }).click();
  await expect(page.getByLabel("Username", { exact: true })).toBeVisible();
  return page.url();
}

async function joinRoom(page: Page, username: string, url?: string) {
  if (url) {
    await page.goto(url);
  }
  await page.getByLabel("Username", { exact: true }).fill(username);
  await page.getByRole("button", { name: "Join room" }).click();
  await expect(page.getByText(username)).toBeVisible();
}

async function verifyAllUsersPresent(pages: Page[]) {
  for (const page of pages) {
    await expect(page.getByTestId("player")).toHaveCount(pages.length);
  }
}

async function makeEstimations(pages: Page[]) {
  const estimations = ["3", "5", "8", "13", "20", "40", "100"];
  await Promise.all(
    pages.map((page, index) =>
      page
        .getByRole("button", { name: estimations[index], exact: true })
        .click(),
    ),
  );
}

async function revealEstimations(hostPage: Page) {
  await hostPage.getByRole("button", { name: "Reveal cards" }).click();
}

async function verifyResults(pages: Page[]) {
  await Promise.all(
    pages.map(async (page) => {
      await expect(page.getByText("average")).toBeVisible();
    }),
  );
  await expect(pages[0].getByTestId("vote-distribution-chart")).toBeVisible();
}

async function startNewRound(hostPage: Page) {
  await hostPage.getByRole("button", { name: "Start New Game" }).click();
  await expect(
    hostPage.getByText("Are you sure you want to start a new game?"),
  ).toBeVisible();
  await hostPage.getByRole("button", { name: "Start New Game" }).click();
}

async function verifyNewRound(pages: Page[]) {
  await Promise.all(
    pages.map(async (page) => {
      await expect(page.getByText("average")).not.toBeVisible();
      await expect(
        page.getByTestId("vote-distribution-chart"),
      ).not.toBeVisible();
      await expect(page.getByText("Just start picking cards!")).toBeVisible();
    }),
  );
}
