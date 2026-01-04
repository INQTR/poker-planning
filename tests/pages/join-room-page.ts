import { Page, Locator, expect } from "@playwright/test";
import { safeClick } from "../utils/test-helpers";

export class JoinRoomPage {
  readonly page: Page;
  readonly joinDialog: Locator;
  readonly nameInput: Locator;
  readonly participantRadio: Locator;
  readonly spectatorRadio: Locator;
  readonly joinButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;
  readonly dialogTitle: Locator;

  constructor(page: Page) {
    this.page = page;

    // Dialog elements - looking for the join room container
    this.joinDialog = page.locator(".max-w-md.w-full.space-y-6.bg-card").first();
    this.dialogTitle = page.getByRole("heading", { name: "Join Room" });

    // Form elements
    this.nameInput = page.getByPlaceholder("Enter your name");
    // Switch is used for spectator mode (find by id or by label association)
    this.spectatorRadio = page.locator("#spectator");
    this.participantRadio = page.locator(".dummy-participant-radio"); // Not used in current UI

    // Buttons
    this.joinButton = page.getByRole("button", { name: "Join Room" });
    this.cancelButton = page.locator(".dummy-cancel-button"); // Not present in current UI

    // Error handling - using alert for now as per the component
    this.errorMessage = page.locator(".dummy-error-message"); // Not present in current UI
  }

  async waitForDialog(): Promise<void> {
    await expect(this.joinDialog).toBeVisible({ timeout: 5000 });
  }

  async enterName(name: string): Promise<void> {
    await this.nameInput.fill(name);
  }

  async selectParticipantRole(): Promise<void> {
    // In current UI, participant is default when spectator switch is off
    // Check if switch exists and is checked - if so, turn it off
    try {
      const isVisible = await this.spectatorRadio.isVisible({ timeout: 2000 });
      if (isVisible) {
        // Base UI uses data-checked attribute when switch is on
        const hasDataChecked = await this.spectatorRadio.getAttribute("data-checked");
        const isSpectatorOn = hasDataChecked !== null;
        if (isSpectatorOn) {
          await this.spectatorRadio.click(); // Turn off spectator mode
        }
      }
      // If switch doesn't exist or isn't visible, participant is already default
    } catch {
      // Switch not available, participant is default
    }
  }

  async selectSpectatorRole(): Promise<void> {
    // Wait for switch to be visible first
    await expect(this.spectatorRadio).toBeVisible({ timeout: 5000 });
    // Base UI uses data-checked attribute when switch is on
    const hasDataChecked = await this.spectatorRadio.getAttribute("data-checked");
    const isSpectatorOn = hasDataChecked !== null;
    if (!isSpectatorOn) {
      await this.spectatorRadio.click(); // Turn on spectator mode
    }
    // Verify it's now checked (has data-checked attribute)
    await expect(this.spectatorRadio).toHaveAttribute("data-checked", "", { timeout: 2000 });
  }

  async clickJoin(): Promise<void> {
    await safeClick(this.joinButton);
  }

  async clickCancel(): Promise<void> {
    await safeClick(this.cancelButton);
  }

  async joinAsParticipant(name: string): Promise<void> {
    await this.waitForDialog();
    await this.enterName(name);
    await this.selectParticipantRole();
    await this.clickJoin();
  }

  async joinAsSpectator(name: string): Promise<void> {
    await this.waitForDialog();
    await this.enterName(name);
    await this.selectSpectatorRole();
    await this.clickJoin();
  }

  async expectErrorMessage(message: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }

  async expectNoErrorMessage(): Promise<void> {
    await expect(this.errorMessage).not.toBeVisible();
  }

  async isJoinButtonEnabled(): Promise<boolean> {
    return await this.joinButton.isEnabled();
  }

  async expectJoinButtonDisabled(): Promise<void> {
    await expect(this.joinButton).toBeDisabled();
  }

  async expectJoinButtonEnabled(): Promise<void> {
    await expect(this.joinButton).toBeEnabled();
  }

  async expectDialogClosed(): Promise<void> {
    await expect(this.joinDialog).not.toBeVisible();
  }

  async getNameInputValue(): Promise<string> {
    return await this.nameInput.inputValue();
  }

  async expectNameInputValue(value: string): Promise<void> {
    await expect(this.nameInput).toHaveValue(value);
  }

  async isParticipantSelected(): Promise<boolean> {
    // Participant is selected when spectator switch is off
    const hasDataChecked = await this.spectatorRadio.getAttribute("data-checked");
    return hasDataChecked === null;
  }

  async isSpectatorSelected(): Promise<boolean> {
    const hasDataChecked = await this.spectatorRadio.getAttribute("data-checked");
    return hasDataChecked !== null;
  }
}
