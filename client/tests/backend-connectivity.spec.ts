import { test, expect } from "@playwright/test";

test.describe("Backend Connectivity", () => {
  test("should connect to GraphQL endpoint", async ({ page }) => {
    // Enable console logging
    page.on("console", (msg) =>
      console.log(`Browser console [${msg.type()}]: ${msg.text()}`),
    );
    page.on("pageerror", (error) =>
      console.log(`Browser error: ${error.message}`),
    );

    // Navigate to the app
    await page.goto("http://localhost:5173");

    // Wait for the app to load
    await expect(
      page.getByRole("button", { name: "Start New Game" }),
    ).toBeVisible({ timeout: 10000 });

    // Try to create a room and check for errors
    const startButton = page.getByRole("button", { name: "Start New Game" });
    await startButton.click();

    // Check what happens after clicking
    await page.waitForTimeout(3000);

    // Check current URL
    const currentUrl = page.url();
    console.log(`Current URL after clicking Start: ${currentUrl}`);

    // Check for any error toasts
    const toasts = await page.locator('[role="alert"]').all();
    for (const toast of toasts) {
      const text = await toast.textContent();
      console.log(`Toast/Alert found: ${text}`);
    }

    // Check if we're on a room page or still on home page
    if (currentUrl.includes("/room/")) {
      console.log("Successfully navigated to room page");

      // Check if username dialog is visible
      const usernameInput = page.getByLabel("Username", { exact: true });
      const isUsernameVisible = await usernameInput
        .isVisible()
        .catch(() => false);

      if (isUsernameVisible) {
        console.log("Username dialog is visible - success!");
      } else {
        console.log(
          "Username dialog is NOT visible - user might already be logged in",
        );

        // Check if there's a user already in the room
        const players = await page.getByTestId("player").all();
        console.log(`Number of players found: ${players.length}`);
      }
    } else {
      console.log(
        "Failed to navigate to room page - likely GraphQL connection issue",
      );

      // Try to make a direct GraphQL request
      const graphqlResponse = await page.evaluate(async () => {
        try {
          const response = await fetch("http://localhost:8000/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: `
                mutation CreateRoom {
                  createRoom {
                    id
                  }
                }
              `,
            }),
          });

          const text = await response.text();
          return {
            status: response.status,
            statusText: response.statusText,
            body: text,
          };
        } catch (error) {
          return {
            error: error.message,
          };
        }
      });

      console.log(
        "Direct GraphQL request result:",
        JSON.stringify(graphqlResponse, null, 2),
      );
    }
  });
});
