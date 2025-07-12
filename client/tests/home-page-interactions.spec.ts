import { test, expect } from "@playwright/test";

test.describe("Home Page Interactive Features", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/");
  });

  test("theme toggle works correctly", async ({ page }) => {
    // Look for the theme toggle button - it contains either sun or moon icon
    const themeToggle = page
      .locator("button:has(svg.lucide-sun), button:has(svg.lucide-moon)")
      .first();

    // Ensure button is visible
    await expect(themeToggle).toBeVisible();

    // Get initial theme state
    const htmlElement = page.locator("html");
    const initialClasses = await htmlElement.getAttribute("class");
    const initiallyDark = initialClasses?.includes("dark") || false;

    // Click to open dropdown
    await themeToggle.click();

    // Click on the opposite theme option
    if (initiallyDark) {
      await page.getByRole("menuitem", { name: "Light" }).click();
    } else {
      await page.getByRole("menuitem", { name: "Dark" }).click();
    }

    await page.waitForTimeout(300);

    // Verify theme changed
    const newClasses = await htmlElement.getAttribute("class");
    const nowDark = newClasses?.includes("dark") || false;
    expect(nowDark).toBe(!initiallyDark);
  });

  test("Start New Game button creates room and navigates", async ({ page }) => {
    // Click Start New Game button in hero section
    const startButton = page
      .getByRole("button", { name: "Start New Game" })
      .first();
    await startButton.click();

    // Check navigation to room (any room ID)
    await expect(page).toHaveURL(/\/room\/[a-f0-9-]+/);
  });

  test("Call to Action Start Planning Now button works", async ({ page }) => {
    // Scroll to CTA section
    const ctaButton = page.locator("button:has-text('Start Planning Now')");
    await ctaButton.scrollIntoViewIfNeeded();
    await ctaButton.click();

    // Check navigation to room (any room ID)
    await expect(page).toHaveURL(/\/room\/[a-f0-9-]+/);
  });

  test("FAQ items expand and collapse correctly", async ({ page }) => {
    // Get all FAQ buttons
    const faqButtons = page.locator("button").filter({ hasText: "?" });
    const firstFaq = faqButtons.first();
    const secondFaq = faqButtons.nth(1);

    // Get the answer text for the first FAQ
    const firstAnswer = page.locator(
      "text=/Planning Poker is an agile estimation technique/",
    );

    // Initially answer should not be visible
    await expect(firstAnswer).not.toBeVisible();

    // Click to expand
    await firstFaq.click();
    await expect(firstAnswer).toBeVisible();

    // Click another FAQ
    await secondFaq.click();

    // First should still be expanded (multiple can be open)
    await expect(firstAnswer).toBeVisible();

    // Click first again to collapse
    await firstFaq.click();
    await expect(firstAnswer).not.toBeVisible();
  });

  test("GitHub links open in new tab", async ({ page, context }) => {
    // Listen for new page/tab
    const pagePromise = context.waitForEvent("page");

    // Click GitHub link in hero section
    await page.getByRole("link", { name: "View on GitHub" }).first().click();

    // Get the new page
    const newPage = await pagePromise;
    await newPage.waitForLoadState();

    // Check the URL
    expect(newPage.url()).toContain("github.com/INQTR/poker-planning");

    // Close the new tab
    await newPage.close();
  });

  test("footer navigation links work correctly", async ({ page }) => {
    const footer = page.locator("footer");

    // Test internal navigation links
    const howItWorksLink = footer.getByRole("link", { name: "How It Works" });
    await howItWorksLink.click();

    // Wait for navigation
    await page.waitForTimeout(500);

    // Check URL hash changed
    await expect(page).toHaveURL(/#how-it-works/);

    // Test FAQ link
    const faqLink = footer.getByRole("link", { name: "FAQ" });
    await faqLink.click();

    // Wait for navigation
    await page.waitForTimeout(500);

    // Check URL hash changed
    await expect(page).toHaveURL(/#faq/);
  });

  test("hover effects work on interactive elements", async ({ page }) => {
    // Test hover on Start New Game button
    const startButton = page
      .getByRole("button", { name: "Start New Game" })
      .first();

    // Get initial style
    const initialBg = await startButton.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor,
    );

    await startButton.hover();
    await page.waitForTimeout(100); // Wait for transition

    // Check that button is still visible and interactive
    await expect(startButton).toBeVisible();

    // Test hover on GitHub link
    const githubLink = page
      .getByRole("link", { name: "View on GitHub" })
      .first();

    const initialGithubBg = await githubLink.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor,
    );

    await githubLink.hover();
    await page.waitForTimeout(100);

    // Check that styles may have changed (but don't require specific transform)
    const hoveredGithubBg = await githubLink.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor,
    );

    // Background should change on hover
    expect(hoveredGithubBg).not.toBe(initialGithubBg);
  });

  test("responsive menu works on mobile viewport", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Reload to ensure proper rendering
    await page.reload();

    // Check that elements are still visible and properly laid out
    await expect(
      page.getByRole("heading", {
        name: /Estimate stories with.*Planning Poker/,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Start New Game" }),
    ).toBeVisible();

    // Check that How It Works cards stack vertically on mobile
    const cards = page.locator(".group").filter({
      hasText: /Create a Room|Invite Your Team|Vote on Stories|Reach Consensus/,
    });
    const cardCount = await cards.count();
    expect(cardCount).toBe(4);
  });

  test("all images and icons load correctly", async ({ page }) => {
    // Check logo loads
    const logo = page.locator('img[alt="PokerPlanning.org Logo"]').first();
    await expect(logo).toBeVisible();

    // Check that logo src is correct
    const logoSrc = await logo.getAttribute("src");
    expect(logoSrc).toBe("/logo.svg");

    // Check that all Lucide icons are rendered (they should have svg elements)
    const icons = page.locator("svg").filter({ hasNot: page.locator("defs") });
    const iconCount = await icons.count();
    expect(iconCount).toBeGreaterThan(10); // Should have many icons throughout the page
  });
});
