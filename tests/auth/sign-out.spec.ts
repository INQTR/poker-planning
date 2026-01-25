import { test, expect } from "@playwright/test";
import { RoomPage } from "../pages/room-page";
import { JoinRoomPage } from "../pages/join-room-page";
import {
  createRoom,
  navigateToRoom,
  joinExistingRoom,
} from "../utils/room-helpers";
import { mockClipboardAPI } from "../utils/test-helpers";

test.describe("Sign Out Flow", () => {
  test("should remove user from room when signing out", async ({ browser }) => {
    // User 1 creates and joins a room
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    await mockClipboardAPI(page1);

    const roomId = await createRoom(page1);
    const joinPage1 = new JoinRoomPage(page1);
    await joinPage1.waitForDialog();
    await joinPage1.joinAsParticipant("User1");
    await joinPage1.expectDialogClosed();

    const roomPage1 = new RoomPage(page1);
    await roomPage1.waitForRoomLoad();
    await roomPage1.expectPlayerInList("User1");

    // User 2 joins the same room (to observe User1 leaving)
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    await mockClipboardAPI(page2);

    await joinExistingRoom(page2, roomId, "User2");
    const roomPage2 = new RoomPage(page2);
    await roomPage2.waitForRoomLoad();

    // Both users should be visible
    await roomPage2.expectPlayerInList("User1");
    await roomPage2.expectPlayerInList("User2");

    // User 1 signs out
    await page1.getByRole("button", { name: /User1/i }).click();
    await page1.getByRole("menuitem", { name: /sign out/i }).click();

    // User 2 should no longer see User 1 in the room
    await expect(
      page2.locator(".react-flow__node-player").filter({ hasText: "User1" })
    ).not.toBeVisible({ timeout: 10000 });

    // User 2 should still be in the room
    await roomPage2.expectPlayerInList("User2");

    await context1.close();
    await context2.close();
  });

  test("should show join dialog after signing out and refreshing page", async ({
    browser,
  }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await mockClipboardAPI(page);

    // Create a room
    const roomId = await createRoom(page);

    // Join the room
    const joinPage = new JoinRoomPage(page);
    await joinPage.waitForDialog();
    await joinPage.joinAsParticipant("TestUser");
    await joinPage.expectDialogClosed();

    // Wait for room to load
    const roomPage = new RoomPage(page);
    await roomPage.waitForRoomLoad();
    await roomPage.expectPlayerInList("TestUser");

    // Sign out
    await page.getByRole("button", { name: /TestUser/i }).click();
    await page.getByRole("menuitem", { name: /sign out/i }).click();

    // Wait for sign out to complete
    await page.waitForTimeout(1000);

    // Navigate to the room again (or refresh)
    await navigateToRoom(page, roomId);

    // Should see join dialog again (user was deleted)
    await joinPage.waitForDialog();

    // Name field should be empty (session was cleared)
    await joinPage.expectNameInputEmpty();

    await context.close();
  });

  test("should delete user completely on sign out", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await mockClipboardAPI(page);

    // Create a room
    await createRoom(page);

    // Join the room
    const joinPage = new JoinRoomPage(page);
    await joinPage.waitForDialog();
    await joinPage.joinAsParticipant("DeleteMe");
    await joinPage.expectDialogClosed();

    // Wait for room to load
    const roomPage = new RoomPage(page);
    await roomPage.waitForRoomLoad();
    await roomPage.expectPlayerInList("DeleteMe");

    // Sign out
    await page.getByRole("button", { name: /DeleteMe/i }).click();
    await page.getByRole("menuitem", { name: /sign out/i }).click();

    // Wait for sign out to complete
    await page.waitForTimeout(1000);

    // The UserMenu should no longer be visible (user is signed out)
    // Instead, we should see "Get Started" button or similar
    await expect(page.getByRole("button", { name: /DeleteMe/i })).not.toBeVisible({ timeout: 5000 });

    await context.close();
  });
});
