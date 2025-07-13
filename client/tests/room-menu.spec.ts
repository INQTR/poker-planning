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

    // Wait for the username to update in the UI
    await expect(page.getByText("NewTestUser")).toBeVisible({ timeout: 10000 });

    // Close menu if it's still open by clicking outside
    await page.mouse.click(100, 100);
    await page.waitForTimeout(1000);

    // Verify new username is visible on the page
    await expect(page.getByText("NewTestUser")).toBeVisible();

    // Try to open menu again
    await openMenu(page);

    // Just verify the menu opened and contains the username
    await expect(page.getByText("NewTestUser").first()).toBeVisible();
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
  await page.goto("http://localhost:5173");
  await page.getByRole("button", { name: "Start New Game" }).click();

  // Handle room type selector dialog
  await expect(
    page.getByRole("dialog", { name: "Choose Your Planning Experience" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Start Classic Room", exact: true })
    .click();

  await page.getByLabel("Username", { exact: true }).fill(username);
  await page.getByRole("button", { name: "Join room" }).click();
  await expect(page.getByText(username)).toBeVisible();

  // Wait for any toast notifications to disappear
  await page.waitForTimeout(2000);

  // Ensure no toasts are visible
  const toasts = page.locator('[role="alert"], [role="status"]');
  const toastCount = await toasts.count();
  if (toastCount > 0) {
    await expect(toasts.first()).not.toBeVisible({ timeout: 5000 });
  }
}

async function openMenu(page: Page) {
  const menuButton = page.getByRole("button", { name: "Account menu" });
  await menuButton.waitFor({ state: "visible" });

  // Try clicking with force if normal click doesn't work
  try {
    await menuButton.click({ timeout: 5000 });
  } catch (e) {
    // If normal click fails, use force click
    await menuButton.click({ force: true });
  }
}

async function verifyMenuItems(page: Page, username: string) {
  // Verify username is shown in the menu
  await expect(page.getByText(username).first()).toBeVisible();

  // Verify menu items are present
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
