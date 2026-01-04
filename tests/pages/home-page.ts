import { Page, Locator, expect } from "@playwright/test";
import { safeClick, waitForRoomNavigation } from "../utils/test-helpers";

export class HomePage {
  readonly page: Page;
  readonly heroHeading: Locator;
  readonly heroDescription: Locator;
  readonly startGameButton: Locator;
  readonly githubLink: Locator;
  readonly skipToMainLink: Locator;
  readonly trustIndicators: {
    freeForever: Locator;
    noAccount: Locator;
    realtime: Locator;
  };

  constructor(page: Page) {
    this.page = page;

    // Hero section elements
    this.heroHeading = page.locator("h1");
    this.heroDescription = page.locator("text=Join thousands of Agile teams");
    this.startGameButton = page.getByRole("button", {
      name: /start new game/i,
    });
    this.githubLink = page
      .getByRole("link", { name: /view on github/i })
      .first();
    this.skipToMainLink = page.getByRole("link", {
      name: /skip to main content/i,
    });

    // Trust indicators
    this.trustIndicators = {
      freeForever: page.locator("text=100% Free Forever").first(),
      noAccount: page.locator("text=No Account Required").first(),
      realtime: page.locator("text=Real-time Collaboration").first(),
    };
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
    await this.page.waitForLoadState("networkidle");
  }

  async verifyPageTitle(titlePattern: RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(titlePattern);
  }

  async verifyHeroSection(): Promise<void> {
    await expect(this.heroHeading).toBeVisible();
    await expect(this.heroHeading).toContainText("Estimate stories with");
    await expect(this.heroHeading).toContainText("AgileKit");

    await expect(this.heroDescription).toBeVisible();
    await expect(this.heroDescription).toContainText(
      "collaborative story point estimation"
    );
  }

  async verifyTrustIndicators(): Promise<void> {
    const mainContent = this.page.locator("main").first();

    await expect(
      mainContent.locator("text=100% Free Forever").first()
    ).toBeVisible();
    await expect(
      mainContent.locator("text=No Account Required").first()
    ).toBeVisible();
    await expect(
      mainContent.locator("text=Real-time Collaboration").first()
    ).toBeVisible();
  }

  async createNewRoom(): Promise<string> {
    // Wait for button to be ready
    await expect(this.startGameButton.first()).toBeVisible();
    await expect(this.startGameButton.first()).toBeEnabled();

    // Click and wait for navigation
    const navigationPromise = waitForRoomNavigation(this.page);
    await safeClick(this.startGameButton.first());
    await navigationPromise;

    // Extract and return room ID
    const url = this.page.url();
    const roomId = url.split("/room/")[1];
    return roomId;
  }

  async getClipboardText(): Promise<string> {
    return await this.page.evaluate(() => {
      return window.clipboardText || "";
    });
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight)
    );
    await this.page.waitForTimeout(500); // Wait for scroll animation
  }

  async countSections(): Promise<number> {
    const sections = this.page.locator("section");
    return await sections.count();
  }

  async verifyFooter(): Promise<void> {
    await expect(this.page.locator("footer")).toBeVisible();
  }

  async focusSkipLink(): Promise<void> {
    await this.page.keyboard.press("Tab");
    await expect(this.skipToMainLink).toBeVisible();
  }

  async clickSkipLink(): Promise<void> {
    await this.skipToMainLink.click({ force: true });
    const mainContent = this.page.locator("#main-content");
    await expect(mainContent).toBeInViewport();
  }

  async verifyGitHubLink(): Promise<void> {
    await expect(this.githubLink).toBeVisible();
    await expect(this.githubLink).toHaveAttribute(
      "href",
      "https://github.com/INQTR/poker-planning"
    );
    await expect(this.githubLink).toHaveAttribute("target", "_blank");
    await expect(this.githubLink).toHaveAttribute("rel", "noopener noreferrer");
  }

  async waitForToast(text: string): Promise<void> {
    // Sonner toasts are rendered in a specific container
    // Try multiple selectors to find the toast
    const toastSelectors = [
      `[data-sonner-toaster] >> text=${text}`,
      `[role="status"] >> text=${text}`,
      `li:has-text("${text}")`,
      `text=${text}`,
    ];

    let found = false;
    for (const selector of toastSelectors) {
      try {
        const toast = this.page.locator(selector);
        await expect(toast).toBeVisible({ timeout: 2000 });
        found = true;
        break;
      } catch {
        // Try next selector
      }
    }

    if (!found) {
      // Last resort: check if any toast-like element exists with partial text match
      const anyToast = this.page.locator(`text="${text}"`);
      await expect(anyToast).toBeVisible({ timeout: 3000 });
    }
  }

  async isButtonEnabled(): Promise<boolean> {
    return await this.startGameButton.first().isEnabled();
  }

  async getCallToActionButtonCount(): Promise<number> {
    const ctaButtons = this.page
      .locator("button")
      .filter({ hasText: /start|game/i });
    return await ctaButtons.count();
  }
}
