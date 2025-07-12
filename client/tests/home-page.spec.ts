import { test, expect } from "@playwright/test";

test("home page has correct elements", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await expect(
    page.getByRole("link", { name: "PokerPlanning.org Logo" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: /Estimate stories with.*Planning Poker/,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Toggle theme" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Start New Game" }),
  ).toBeVisible();

  // Check for new sections
  await expect(
    page.getByRole("heading", { name: /How.*Planning Poker.*Works/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Why Teams Choose PokerPlanning.org" }),
  ).toBeVisible();
  await expect(
    page.getByText("Everything you need for sprint planning"),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Frequently Asked Questions" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: /Ready to improve your.*sprint planning/,
    }),
  ).toBeVisible();
});
