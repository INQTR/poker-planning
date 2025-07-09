import { test, expect, type Page } from "@playwright/test";

test.describe("Room Account Menu Functionality", () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await createRoomAndJoin(page, "TestUser");
  });

  test.afterEach(async () => {
    await page.close();
  });

  test("should open menu and display correct username and menu items", async () => {
    await openMenu(page);
    await verifyMenuItems(page, "TestUser");
  });

  test("should allow changing username", async () => {
    await openMenu(page);
    await changeUsername(page, "NewTestUser");
    await expect(page.getByText("NewTestUser")).toBeVisible();
    await openMenu(page);
    await verifyMenuItems(page, "NewTestUser");
  });

  test("should allow logging out", async () => {
    await openMenu(page);
    await logout(page);
    await verifyLoggedOut(page);
  });

  test("should allow joining room after logout", async () => {
    await openMenu(page);
    await logout(page);
    await verifyLoggedOut(page);

    const newUsername = "UserComeBack";
    await page.getByLabel("Username", { exact: true }).fill(newUsername);
    await page.getByRole("button", { name: "Join room" }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(page.getByText(newUsername)).toBeVisible();

    await openMenu(page);
    await verifyMenuItems(page, newUsername);
  });
});

async function createRoomAndJoin(page: Page, username: string) {
  await page.goto("/");
  await page.getByRole("button", { name: "Start New Game" }).click();
  await page.getByLabel("Username", { exact: true }).fill(username);
  await page.getByRole("button", { name: "Join room" }).click();
  await expect(page.getByText(username)).toBeVisible();
}

async function openMenu(page: Page) {
  await page.getByRole("button", { name: "Account menu" }).click();
}

async function verifyMenuItems(page: Page, username: string) {
  const firstLetter = username.charAt(0);
  await expect(
    page.getByLabel(firstLetter, { exact: true }).getByText(username),
  ).toBeVisible();
  await expect(
    page.getByRole("menuitem", { name: "Change username" }),
  ).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Logout" })).toBeVisible();
}

async function changeUsername(page: Page, newUsername: string) {
  await page.getByRole("menuitem", { name: "Change username" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByLabel("Username", { exact: true }).fill(newUsername);
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
}

async function logout(page: Page) {
  await page.getByRole("menuitem", { name: "Logout" }).click();
}

async function verifyLoggedOut(page: Page) {
  await expect(
    page.getByRole("button", { name: "Start New Game" }),
  ).not.toBeVisible();
  await expect(
    page.getByText("Enter your username to join the room"),
  ).toBeVisible();
}
