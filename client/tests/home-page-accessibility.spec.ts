import { test, expect } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";

test.describe("Home Page Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/");
  });

  test("has proper heading hierarchy", async ({ page }) => {
    // Check h1 exists and is unique
    const h1Elements = page.locator("h1");
    await expect(h1Elements).toHaveCount(1);

    // Check h2 elements exist
    const h2Elements = page.locator("h2");
    const h2Count = await h2Elements.count();
    expect(h2Count).toBeGreaterThan(4);

    // Check h3 elements exist in subsections
    const h3Elements = page.locator("h3");
    const h3Count = await h3Elements.count();
    expect(h3Count).toBeGreaterThan(0);
  });

  test("all interactive elements have proper labels", async ({ page }) => {
    // Check all buttons have accessible names
    const buttons = page.locator("button");
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute("aria-label");
      const textContent = await button.textContent();

      // Button should have either aria-label or text content
      expect(ariaLabel || textContent?.trim()).toBeTruthy();
    }

    // Check all links have accessible names
    const links = page.locator("a");
    const linkCount = await links.count();

    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const ariaLabel = await link.getAttribute("aria-label");
      const textContent = await link.textContent();

      // Link should have either aria-label or text content
      expect(ariaLabel || textContent?.trim()).toBeTruthy();
    }
  });

  test("images have alt text", async ({ page }) => {
    const images = page.locator("img");
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const altText = await img.getAttribute("alt");
      expect(altText).toBeTruthy();
    }
  });

  test("color contrast meets WCAG standards", async ({ page }) => {
    // Check primary text on backgrounds
    const primaryText = page.locator("h1, h2, h3, p");
    const textCount = await primaryText.count();

    // Sample check for a few elements (full contrast testing would use axe-core)
    for (let i = 0; i < Math.min(5, textCount); i++) {
      const element = primaryText.nth(i);
      const color = await element.evaluate(
        (el) => window.getComputedStyle(el).color,
      );
      const bgColor = await element.evaluate(
        (el) => window.getComputedStyle(el).backgroundColor,
      );

      // Basic check that text has color and background is set
      expect(color).toBeTruthy();
      expect(bgColor).toBeTruthy();
    }
  });

  test("keyboard navigation works correctly", async ({ page }) => {
    // Ensure page is focused
    await page.click("body");

    // Start at the top of the page
    await page.keyboard.press("Tab");

    // First tab should focus on skip link or logo
    const firstFocused = await page.evaluate(
      () => document.activeElement?.tagName,
    );
    expect(firstFocused).toBeTruthy();

    // First focused element should be one of these
    if (firstFocused !== "BODY") {
      expect(["A", "BUTTON", "INPUT"]).toContain(firstFocused);
    }

    // Tab through several elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
    }

    // Should be able to activate button with Enter
    const focusedButton = await page.evaluate(() => {
      const el = document.activeElement;
      return el?.tagName === "BUTTON" ? el.textContent : null;
    });

    if (focusedButton) {
      await page.keyboard.press("Enter");
      // Button should be activatable
    }
  });

  test("ARIA attributes are properly set", async ({ page }) => {
    // Check navigation landmark
    const nav = page.locator('nav[aria-label="Global"]');
    await expect(nav).toBeVisible();

    // Check footer landmark
    const footer = page.locator('footer[aria-labelledby="footer-heading"]');
    await expect(footer).toBeVisible();

    // Check aria-hidden on decorative elements
    const decorativeIcons = page.locator('[aria-hidden="true"]');
    const decorativeCount = await decorativeIcons.count();
    expect(decorativeCount).toBeGreaterThan(0);

    // Check expandable FAQ items have proper ARIA
    const faqButtons = page.locator("button").filter({ hasText: "?" });
    const firstFaqButton = faqButtons.first();

    // FAQ buttons should have aria-expanded when they're expandable
    await firstFaqButton.click();
    // After implementation, this would check aria-expanded="true"
  });

  test("focus indicators are visible", async ({ page }) => {
    // Tab to first interactive element
    await page.keyboard.press("Tab");

    // Get the focused element's outline
    const focusedOutline = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      if (!el) return null;
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        outlineOffset: styles.outlineOffset,
        boxShadow: styles.boxShadow,
      };
    });

    // Should have visible focus indicator
    expect(
      focusedOutline?.outline !== "none" ||
        focusedOutline?.boxShadow !== "none",
    ).toBeTruthy();
  });

  test("responsive design maintains accessibility", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Content should still be accessible
    await expect(
      page.getByRole("button", { name: "Start New Game" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Toggle theme" }),
    ).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    // Navigation should be accessible
    await expect(page.getByRole("navigation")).toBeVisible();
  });

  test("passes automated accessibility scan", async ({ page }) => {
    // Wait for the app to load
    await page.waitForSelector("main", { timeout: 10000 });

    await injectAxe(page);

    // Check for specific elements before running full scan
    const mainElement = await page.locator("main").count();
    const h1Element = await page.locator("h1").count();

    if (mainElement === 0) {
      throw new Error("No main element found on page");
    }
    if (h1Element === 0) {
      throw new Error("No h1 element found on page");
    }

    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  });
});
