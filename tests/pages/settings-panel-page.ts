import { Page, Locator, expect } from "@playwright/test";
import { safeClick } from "../utils/test-helpers";

export class SettingsPanelPage {
  readonly page: Page;
  readonly settingsButton: Locator;
  readonly settingsPanel: Locator;
  readonly closeButton: Locator;
  readonly roomNameInput: Locator;
  readonly saveButton: Locator;
  readonly autoRevealSwitch: Locator;
  readonly themeButtons: {
    light: Locator;
    dark: Locator;
    system: Locator;
  };
  readonly userList: Locator;
  readonly participantCount: Locator;

  constructor(page: Page) {
    this.page = page;

    // Settings button in navigation
    this.settingsButton = page.getByRole("button", {
      name: "Room settings",
    });

    // The floating settings panel
    this.settingsPanel = page.getByRole("dialog", {
      name: "Room settings",
    });

    // Close button
    this.closeButton = page.getByRole("button", { name: "Close settings" });

    // Room name section
    this.roomNameInput = page.locator("#room-name");
    this.saveButton = this.settingsPanel.getByRole("button", { name: "Save" });

    // Auto-reveal toggle
    this.autoRevealSwitch = page.locator("#auto-reveal");

    // Theme buttons
    this.themeButtons = {
      light: this.settingsPanel.getByRole("button", { name: "Light" }),
      dark: this.settingsPanel.getByRole("button", { name: "Dark" }),
      system: this.settingsPanel.getByRole("button", { name: "System" }),
    };

    // User list
    this.userList = this.settingsPanel.locator(
      ".space-y-1.max-h-32.overflow-y-auto"
    );

    // Participant count in settings header
    this.participantCount = this.settingsPanel.locator(
      'span:has-text("user"), span:has-text("users")'
    );
  }

  async openSettings(): Promise<void> {
    await safeClick(this.settingsButton);
    await expect(this.settingsPanel).toBeVisible({ timeout: 5000 });
  }

  async closeSettings(): Promise<void> {
    await safeClick(this.closeButton);
    await expect(this.settingsPanel).not.toBeVisible({ timeout: 5000 });
  }

  async closeByClickingOutside(): Promise<void> {
    // Click on the canvas area outside the panel
    await this.page.locator(".react-flow").click({ position: { x: 50, y: 300 } });
    await expect(this.settingsPanel).not.toBeVisible({ timeout: 5000 });
  }

  async closeByEscape(): Promise<void> {
    await this.page.keyboard.press("Escape");
    await expect(this.settingsPanel).not.toBeVisible({ timeout: 5000 });
  }

  async isOpen(): Promise<boolean> {
    return await this.settingsPanel.isVisible();
  }

  async getRoomName(): Promise<string> {
    return await this.roomNameInput.inputValue();
  }

  async renameRoom(newName: string): Promise<void> {
    await this.roomNameInput.clear();
    await this.roomNameInput.fill(newName);
    await safeClick(this.saveButton);
    // Wait for save to complete - button becomes disabled when name matches saved value
    await this.page.waitForTimeout(500);
    await expect(this.saveButton).toBeDisabled({ timeout: 5000 });
  }

  async renameRoomWithEnter(newName: string): Promise<void> {
    await this.roomNameInput.clear();
    await this.roomNameInput.fill(newName);
    await this.roomNameInput.press("Enter");
    // Wait for save to complete - button becomes disabled when name matches saved value
    await this.page.waitForTimeout(500);
    await expect(this.saveButton).toBeDisabled({ timeout: 5000 });
  }

  async isSaveButtonDisabled(): Promise<boolean> {
    return await this.saveButton.isDisabled();
  }

  async isAutoRevealEnabled(): Promise<boolean> {
    const checked = await this.autoRevealSwitch.getAttribute("data-state");
    return checked === "checked";
  }

  async toggleAutoReveal(): Promise<void> {
    const wasEnabled = await this.isAutoRevealEnabled();
    await safeClick(this.autoRevealSwitch);
    // Wait for toggle to take effect
    if (wasEnabled) {
      await expect(this.autoRevealSwitch).toHaveAttribute(
        "data-state",
        "unchecked",
        { timeout: 3000 }
      );
    } else {
      await expect(this.autoRevealSwitch).toHaveAttribute(
        "data-state",
        "checked",
        { timeout: 3000 }
      );
    }
  }

  async setTheme(theme: "light" | "dark" | "system"): Promise<void> {
    await safeClick(this.themeButtons[theme]);
  }

  async getUserNames(): Promise<string[]> {
    const userItems = this.userList.locator(
      ".flex.items-center.justify-between"
    );
    const count = await userItems.count();
    const names: string[] = [];

    for (let i = 0; i < count; i++) {
      const nameEl = userItems.nth(i).locator("span.truncate");
      const name = await nameEl.textContent();
      if (name) names.push(name.trim());
    }

    return names;
  }

  async removeUser(userName: string): Promise<void> {
    const removeButton = this.settingsPanel.getByRole("button", {
      name: `Remove ${userName}`,
    });
    await safeClick(removeButton);
    // Wait for user to be removed from the list
    await expect(removeButton).not.toBeVisible({ timeout: 5000 });
  }

  async getParticipantCountText(): Promise<string> {
    return (await this.participantCount.textContent()) || "";
  }

  async expectUserInList(userName: string): Promise<void> {
    const userItem = this.userList.locator(`text="${userName}"`);
    await expect(userItem).toBeVisible({ timeout: 5000 });
  }

  async expectUserNotInList(userName: string): Promise<void> {
    const userItem = this.userList.locator(`text="${userName}"`);
    await expect(userItem).not.toBeVisible({ timeout: 5000 });
  }

  async expectNoOtherParticipants(): Promise<void> {
    const noParticipantsText = this.settingsPanel.locator(
      'text="No other participants"'
    );
    await expect(noParticipantsText).toBeVisible({ timeout: 5000 });
  }
}
