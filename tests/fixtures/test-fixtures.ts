/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from "@playwright/test";
import { HomePage } from "../pages/home-page";

// Define custom fixtures
type TestFixtures = {
  homePage: HomePage;
};

// Extend base test with custom fixtures
export const test = base.extend<TestFixtures>({
  // Auto-initialize HomePage for tests
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  
  // Auto-setup for better test isolation
  page: async ({ page }, use) => {
    // Set default timeout for actions
    page.setDefaultTimeout(10000);
    
    // Set default navigation timeout
    page.setDefaultNavigationTimeout(15000);
    
    // Add request interceptor for better debugging
    page.on("request", (request) => {
      if (request.url().includes("/api/") || request.url().includes("convex")) {
        console.log("API Request:", request.method(), request.url());
      }
    });
    
    // Add response interceptor for error tracking
    page.on("response", (response) => {
      if (response.status() >= 400) {
        console.error("Error Response:", response.status(), response.url());
      }
    });
    
    // Ensure animations are disabled for stable tests
    await page.addInitScript(() => {
      // Disable animations
      const style = document.createElement("style");
      style.innerHTML = `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `;
      document.head.appendChild(style);
    });
    
    await use(page);
  },
});

export { expect } from "@playwright/test";