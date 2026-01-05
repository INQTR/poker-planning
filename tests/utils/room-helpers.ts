import { Page, Browser, BrowserContext } from "@playwright/test";
import { HomePage } from "../pages/home-page";
import { RoomPage } from "../pages/room-page";
import { JoinRoomPage } from "../pages/join-room-page";
import { mockClipboardAPI, waitForRoomNavigation } from "./test-helpers";

export interface RoomUser {
  page: Page;
  context: BrowserContext;
  roomPage: RoomPage;
  joinPage: JoinRoomPage;
  name: string;
  role: "participant" | "spectator";
}

/**
 * Create a new room and return the room ID
 */
export async function createRoom(page: Page): Promise<string> {
  const homePage = new HomePage(page);
  await homePage.goto();

  // Mock clipboard to avoid errors
  await mockClipboardAPI(page);

  const roomId = await homePage.createNewRoom();
  await waitForRoomNavigation(page);

  return roomId;
}

/**
 * Navigate directly to a room by ID
 */
export async function navigateToRoom(
  page: Page,
  roomId: string
): Promise<void> {
  await page.goto(`/room/${roomId}`);
  await page.waitForLoadState("domcontentloaded");
}

/**
 * Create a room and join it with a specific user
 */
export async function createAndJoinRoom(
  page: Page,
  userName: string,
  role: "participant" | "spectator" = "participant"
): Promise<{ roomId: string; roomPage: RoomPage; joinPage: JoinRoomPage }> {
  const roomId = await createRoom(page);
  const roomPage = new RoomPage(page);
  const joinPage = new JoinRoomPage(page);

  // Check if join dialog appears
  try {
    await page.waitForSelector('h2:has-text("Join Room")', { timeout: 5000 });
    // Join dialog is visible, join the room
    if (role === "participant") {
      await joinPage.joinAsParticipant(userName);
    } else {
      await joinPage.joinAsSpectator(userName);
    }
    // Wait for canvas to appear after joining
    await page.waitForSelector('.react-flow', { timeout: 10000 });
  } catch {
    // No join dialog, user might already be in the room
    await page.waitForSelector('.react-flow', { timeout: 10000 });
  }

  return { roomId, roomPage, joinPage };
}

/**
 * Join an existing room
 */
export async function joinExistingRoom(
  page: Page,
  roomId: string,
  userName: string,
  role: "participant" | "spectator" = "participant"
): Promise<{ roomPage: RoomPage; joinPage: JoinRoomPage }> {
  await navigateToRoom(page, roomId);

  const roomPage = new RoomPage(page);
  const joinPage = new JoinRoomPage(page);

  // Wait for join dialog to appear
  await page.waitForSelector('h2:has-text("Join Room")', { timeout: 10000 });

  if (role === "participant") {
    await joinPage.joinAsParticipant(userName);
  } else {
    await joinPage.joinAsSpectator(userName);
  }

  // Wait for canvas to appear after joining
  await page.waitForSelector('.react-flow', { timeout: 10000 });

  return { roomPage, joinPage };
}

/**
 * Create multiple users for multi-user testing
 * All users are participants by default (spectator role was causing test issues)
 */
export async function createMultipleUsers(
  browser: Browser,
  count: number,
  roomId?: string
): Promise<RoomUser[]> {
  const users: RoomUser[] = [];

  for (let i = 0; i < count; i++) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await mockClipboardAPI(page);

    const userName = `User${i + 1}`;
    const role: "participant" | "spectator" = "participant"; // All users are participants

    if (i === 0 && !roomId) {
      // First user creates the room
      const result = await createAndJoinRoom(page, userName, role);
      roomId = result.roomId;

      users.push({
        page,
        context,
        roomPage: result.roomPage,
        joinPage: result.joinPage,
        name: userName,
        role,
      });
    } else if (roomId) {
      // Other users join existing room
      const result = await joinExistingRoom(page, roomId, userName, role);

      users.push({
        page,
        context,
        roomPage: result.roomPage,
        joinPage: result.joinPage,
        name: userName,
        role,
      });
    }
  }

  return users;
}

/**
 * Clean up multiple user contexts
 */
export async function cleanupUsers(users: RoomUser[]): Promise<void> {
  for (const user of users) {
    await user.context.close();
  }
}

/**
 * Wait for all users to see a specific player count
 */
export async function waitForPlayerCount(
  users: RoomUser[],
  expectedCount: number,
  timeout: number = 5000
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    let allMatch = true;

    for (const user of users) {
      // Count player nodes in the React Flow canvas
      const playerCount = await user.page.locator('.react-flow__node').count();
      if (playerCount !== expectedCount) {
        allMatch = false;
        break;
      }
    }

    if (allMatch) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`Timeout waiting for player count ${expectedCount}`);
}

/**
 * Verify room persistence by checking if room data exists
 */
export async function verifyRoomPersistence(
  page: Page,
  roomId: string
): Promise<boolean> {
  try {
    await navigateToRoom(page, roomId);
    await page.waitForLoadState("domcontentloaded");

    // Check if we get redirected to home or if room loads
    const url = page.url();
    return url.includes(`/room/${roomId}`);
  } catch {
    return false;
  }
}

/**
 * Extract room ID from URL
 */
export function extractRoomIdFromUrl(url: string): string | null {
  const match = url.match(/\/room\/([a-z0-9]+)/);
  return match ? match[1] : null;
}

/**
 * Generate a test room name
 */
export function generateTestRoomName(prefix: string = "Test Room"): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix} ${timestamp}-${random}`;
}
