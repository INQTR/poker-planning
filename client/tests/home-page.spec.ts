import { test, expect } from "@playwright/test";

test("home page has correct elements", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "PokerPlanning.org Logo" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Collaborate and Estimate Faster with Planning Poker",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Toggle theme" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Start New Game" }),
  ).toBeVisible();
  await expect(page.getByText("Elevate Your Scrum Planning")).toBeVisible();
});
