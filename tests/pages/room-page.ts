import { Page, Locator, expect } from "@playwright/test";
import { safeClick } from "../utils/test-helpers";

export class RoomPage {
  readonly page: Page;
  readonly votingCards: Locator;
  readonly revealButton: Locator;
  readonly resetButton: Locator;
  readonly voteCountIndicator: Locator;
  readonly playerList: Locator;
  readonly roomTitle: Locator;
  readonly copyUrlButton: Locator;
  readonly timerButton: Locator;
  readonly resultsSection: Locator;
  readonly canvasContainer: Locator;
  readonly roomNameInHeader: Locator;
  readonly userCountInHeader: Locator;
  readonly autoRevealCountdown: Locator;

  constructor(page: Page) {
    this.page = page;

    // Voting elements - React Flow nodes have specific structure
    this.votingCards = page.locator('[role="button"][aria-label*="Vote"]');
    this.revealButton = page.getByRole("button", { name: "Reveal Cards" });
    this.resetButton = page.getByRole("button", { name: /New Round|Start new round/i });
    this.voteCountIndicator = page.locator('[aria-label="Voting progress"]').locator('..').locator('span.text-xs')

    // Room information
    this.roomTitle = page.locator('.font-semibold').filter({ hasText: "Planning Session" });
    this.copyUrlButton = page.getByRole("button", { name: "Copy room URL" });

    // Room name in navigation header (left nav bar)
    this.roomNameInHeader = page.locator('[data-testid="canvas-navigation"] .font-semibold');

    // User count in navigation header
    this.userCountInHeader = page.locator('[data-testid="canvas-navigation"]').locator('text=/\\d+ users?/');

    // Auto-reveal countdown display in session node
    this.autoRevealCountdown = page.locator('.react-flow__node-session').locator('text=/Revealing.../');

    // Player elements - these are React Flow nodes
    this.playerList = page.locator(".react-flow__node-player");

    // Timer and results
    this.timerButton = page.locator(".react-flow__node-timer");
    this.resultsSection = page.locator(".react-flow__node-results");

    // Canvas
    this.canvasContainer = page.locator(".react-flow");
  }

  async goto(roomId: string): Promise<void> {
    await this.page.goto(`/room/${roomId}`);
    await this.page.waitForLoadState("domcontentloaded");
  }

  async waitForRoomLoad(): Promise<void> {
    // Wait for the canvas or main room container to be visible
    await expect(
      this.canvasContainer.or(this.page.locator(".react-flow"))
    ).toBeVisible({ timeout: 10000 });
  }

  async selectCard(value: string): Promise<void> {
    const card = this.votingCards.filter({ hasText: value }).first();
    await safeClick(card);
    // Check if card is selected by its aria-pressed attribute
    await expect(card).toHaveAttribute("aria-pressed", "true");
  }

  async revealCards(): Promise<void> {
    await safeClick(this.revealButton);
    await expect(this.resultsSection).toBeVisible({ timeout: 5000 });
  }

  async resetVotes(): Promise<void> {
    await safeClick(this.resetButton);
    await expect(this.resultsSection).not.toBeVisible();
  }

  async expectVoteCount(count: number): Promise<void> {
    await expect(this.voteCountIndicator).toContainText(`${count}`);
  }

  async expectPlayerInList(playerName: string): Promise<void> {
    // Players are shown in React Flow nodes with class react-flow__node-player
    const player = this.page.locator(".react-flow__node-player").filter({ hasText: playerName });
    await expect(player).toBeVisible({ timeout: 10000 });
  }

  async expectVoteIndicator(
    playerName: string,
    hasVoted: boolean = true
  ): Promise<void> {
    // Vote indicators would be shown in player nodes
    const player = this.page.locator(".react-flow__node-player").filter({ hasText: playerName });
    if (hasVoted) {
      // Look for some visual indicator of voting
      await expect(player.locator(".voted-indicator, [data-voted='true']")).toBeVisible();
    } else {
      await expect(player.locator(".voted-indicator, [data-voted='true']")).not.toBeVisible();
    }
  }

  async copyRoomUrl(): Promise<void> {
    await safeClick(this.copyUrlButton);
  }

  async getRoomId(): Promise<string> {
    const url = this.page.url();
    const match = url.match(/\/room\/([a-z0-9]+)/);
    if (!match) {
      throw new Error("Could not extract room ID from URL");
    }
    return match[1];
  }

  async expectRoomTitle(title: string): Promise<void> {
    await expect(this.roomTitle).toContainText(title);
  }

  async isJoinDialogVisible(): Promise<boolean> {
    // Check for the join room container
    const joinDialog = this.page.locator(".max-w-md.w-full.space-y-6.bg-card").first();
    try {
      return await joinDialog.isVisible({ timeout: 1000 });
    } catch {
      return false;
    }
  }

  async expectCardSelected(value: string): Promise<void> {
    const card = this.votingCards.filter({ hasText: value }).first();
    await expect(card).toHaveAttribute("aria-pressed", "true");
  }

  async expectResultsVisible(): Promise<void> {
    await expect(this.resultsSection).toBeVisible();
  }

  async expectResultsNotVisible(): Promise<void> {
    await expect(this.resultsSection).not.toBeVisible();
  }

  async getVoteResults(): Promise<
    { value: string; count: number; voters: string[] }[]
  > {
    await this.expectResultsVisible();

    const results = await this.resultsSection
      .locator("[data-vote-result]")
      .all();
    const voteResults = [];

    for (const result of results) {
      const value = (await result.getAttribute("data-vote-value")) || "";
      const count = parseInt(
        (await result.getAttribute("data-vote-count")) || "0"
      );
      const votersText =
        (await result.locator("[data-voters]").textContent()) || "";
      const voters = votersText
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v);

      voteResults.push({ value, count, voters });
    }

    return voteResults;
  }

  async getRoomNameFromHeader(): Promise<string> {
    await expect(this.roomNameInHeader).toBeVisible({ timeout: 5000 });
    return (await this.roomNameInHeader.textContent()) || "";
  }

  async getParticipantCount(): Promise<number> {
    const text = await this.userCountInHeader.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  async expectRoomNameInHeader(name: string): Promise<void> {
    await expect(this.roomNameInHeader).toContainText(name, { timeout: 5000 });
  }

  async expectParticipantCount(count: number): Promise<void> {
    await expect(this.userCountInHeader).toContainText(`${count}`, { timeout: 5000 });
  }

  async expectAutoRevealCountdown(): Promise<void> {
    await expect(this.autoRevealCountdown).toBeVisible({ timeout: 5000 });
  }

  async expectNoAutoRevealCountdown(): Promise<void> {
    await expect(this.autoRevealCountdown).not.toBeVisible({ timeout: 3000 });
  }
}
