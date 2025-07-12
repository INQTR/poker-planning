import { test, expect } from "@playwright/test";

test.describe("Technical SEO", () => {
  test("robots.txt is accessible and properly configured", async ({ page }) => {
    const response = await page.goto("http://localhost:5173/robots.txt");
    expect(response?.status()).toBe(200);

    const content = await response?.text();
    expect(content).toContain("User-agent: *");
    expect(content).toContain("Disallow: /room/");
    expect(content).toContain("Allow: /");
    expect(content).toContain("Sitemap: https://pokerplanning.org/sitemap.xml");
  });

  test("sitemap.xml is accessible and valid", async ({ page }) => {
    const response = await page.goto("http://localhost:5173/sitemap.xml");
    expect(response?.status()).toBe(200);

    const content = await response?.text();

    // Check XML declaration
    expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');

    // Check urlset namespace
    expect(content).toContain(
      'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    );

    // Check required URLs are present
    const requiredUrls = [
      "https://pokerplanning.org/",
      "https://pokerplanning.org/room/new",
      "https://pokerplanning.org/about",
      "https://pokerplanning.org/features",
      "https://pokerplanning.org/docs",
      "https://pokerplanning.org/blog",
      "https://pokerplanning.org/privacy",
      "https://pokerplanning.org/terms",
    ];

    for (const url of requiredUrls) {
      expect(content).toContain(`<loc>${url}</loc>`);
    }

    // Check for required sitemap elements
    expect(content).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
    expect(content).toContain("<changefreq>");
    expect(content).toContain("<priority>");
  });

  test("manifest.json is accessible", async ({ page }) => {
    const response = await page.goto("http://localhost:5173/manifest.json");
    expect(response?.status()).toBe(200);

    const manifest = await response?.json();
    expect(manifest).toBeTruthy();

    // If manifest exists, check basic properties
    if (manifest) {
      expect(manifest).toHaveProperty("name");
      expect(manifest).toHaveProperty("short_name");
      expect(manifest).toHaveProperty("theme_color");
    }
  });

  test("favicon and apple-touch-icon are accessible", async ({ page }) => {
    await page.goto("http://localhost:5173/");

    // Check favicon
    const favicon = page.locator('link[rel="icon"]');
    const faviconHref = await favicon.getAttribute("href");
    expect(faviconHref).toBe("/logo.svg");

    // Check apple touch icon
    const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]');
    const appleTouchIconHref = await appleTouchIcon.getAttribute("href");
    expect(appleTouchIconHref).toBe("/logo.svg");
  });

  test("page has proper meta viewport", async ({ page }) => {
    await page.goto("http://localhost:5173/");

    const viewport = page.locator('meta[name="viewport"]');
    const content = await viewport.getAttribute("content");
    expect(content).toBe("width=device-width, initial-scale=1.0");
  });

  test("page has proper language attribute", async ({ page }) => {
    await page.goto("http://localhost:5173/");

    const html = page.locator("html");
    const lang = await html.getAttribute("lang");
    expect(lang).toBe("en");
  });

  test("all internal links are valid", async ({ page }) => {
    await page.goto("http://localhost:5173/");

    // Get all internal links
    const internalLinks = page.locator('a[href^="/"], a[href^="#"]');
    const linkCount = await internalLinks.count();

    const brokenLinks: string[] = [];

    for (let i = 0; i < linkCount; i++) {
      const link = internalLinks.nth(i);
      const href = await link.getAttribute("href");

      if (href && href.startsWith("/") && !href.includes("room/")) {
        // Test navigation (skip room links as they need parameters)
        try {
          const response = await page.goto(`http://localhost:5173${href}`);
          if (response?.status() && response.status() >= 400) {
            brokenLinks.push(href);
          }
        } catch (error) {
          // For hash links, just check they don't error
          if (!href.startsWith("#")) {
            brokenLinks.push(href);
          }
        }
      }
    }

    expect(brokenLinks).toHaveLength(0);
  });

  test("external links have proper attributes", async ({ page }) => {
    await page.goto("http://localhost:5173/");

    // Get all external links
    const externalLinks = page.locator(
      'a[href^="http"]:not([href*="localhost"])',
    );
    const linkCount = await externalLinks.count();

    for (let i = 0; i < linkCount; i++) {
      const link = externalLinks.nth(i);
      const target = await link.getAttribute("target");
      const rel = await link.getAttribute("rel");

      // External links should open in new tab
      expect(target).toBe("_blank");

      // External links should have proper rel attributes
      expect(rel).toContain("noopener");
      expect(rel).toContain("noreferrer");
    }
  });

  test("page load performance metrics", async ({ page }) => {
    await page.goto("http://localhost:5173/");

    // Get performance timing
    const performanceTiming = await page.evaluate(() => {
      const timing = performance.timing;
      return {
        domContentLoaded:
          timing.domContentLoadedEventEnd - timing.navigationStart,
        loadComplete: timing.loadEventEnd - timing.navigationStart,
      };
    });

    // Check that page loads reasonably fast (adjust thresholds as needed)
    expect(performanceTiming.domContentLoaded).toBeLessThan(3000); // 3 seconds
    expect(performanceTiming.loadComplete).toBeLessThan(5000); // 5 seconds
  });
});
