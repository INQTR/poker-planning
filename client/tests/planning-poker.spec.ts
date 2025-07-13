import { test, expect, type Page } from "@playwright/test";

test.describe("Planning Poker Estimation", () => {
  test.describe("Classic Room", () => {
    let pages: Page[];

    test.beforeAll(async ({ browser }) => {
      // First, verify backend connectivity
      const testPage = await browser.newPage();
      await testPage.goto("http://localhost:5173");

      // Check if the GraphQL endpoints are logged in console
      testPage.on("console", (msg) => {
        if (
          msg.text().includes("GRAPHQL_ENDPOINT") ||
          msg.text().includes("GRAPHQL_WS_ENDPOINT")
        ) {
          console.log(`GraphQL Config: ${msg.text()}`);
        }
      });

      // Wait a moment for the app to initialize
      await testPage.waitForTimeout(2000);
      await testPage.close();

      pages = await Promise.all(
        Array(4)
          .fill(null)
          .map(() => browser.newPage()),
      );
    });

    test.afterAll(async () => {
      await Promise.all(pages.map((page) => page.close()));
    });

    test("should allow multiple users to join a classic room and estimate a task", async () => {
      const [hostPage, ...guestPages] = pages;
      const roomUrl = await createRoom(hostPage, "classic");
      await joinRoom(hostPage, "User 1");

      for (const [index, page] of guestPages.entries()) {
        await joinRoom(page, `User ${index + 2}`, roomUrl);
      }

      await verifyAllUsersPresent(pages);
      await makeEstimations(pages);
      await revealEstimations(hostPage);
      await verifyResults(pages);
      await startNewRound(hostPage);
      await verifyNewRound(pages);
    });
  });

  test.describe("Canvas Room", () => {
    let page: Page;

    test.beforeEach(async ({ browser }) => {
      page = await browser.newPage();
    });

    test.afterEach(async () => {
      await page.close();
    });

    test("should create and join a canvas room", async () => {
      const roomUrl = await createRoom(page, "canvas");
      await joinRoom(page, "Canvas User");

      // Verify we're in a canvas room by checking for canvas-specific elements
      await expect(page.locator(".react-flow")).toBeVisible();
      // Verify floating navigation bar is present
      await expect(page.getByRole("button", { name: "Reveal" })).toBeVisible();
    });
  });
});

async function createRoom(
  page: Page,
  roomType: "classic" | "canvas" = "classic",
): Promise<string> {
  // Listen for console messages and errors
  page.on("console", (msg) =>
    console.log(`Browser console: ${msg.type()}: ${msg.text()}`),
  );
  page.on("pageerror", (error) =>
    console.log(`Browser error: ${error.message}`),
  );

  await page.goto("http://localhost:5173");

  // Wait for the button to be visible and clickable
  const startButton = page.getByRole("button", { name: "Start New Game" });
  await expect(startButton).toBeVisible();
  await startButton.click();

  // Handle room type selector dialog
  await expect(
    page.getByRole("dialog", { name: "Choose Your Planning Experience" }),
  ).toBeVisible();

  if (roomType === "classic") {
    await page
      .getByRole("button", { name: "Start Classic Room", exact: true })
      .click();
  } else {
    await page
      .getByRole("button", { name: "Try Canvas Room", exact: true })
      .click();
  }

  // Wait for navigation or username input with better error message
  try {
    await expect(page.getByLabel("Username", { exact: true })).toBeVisible({
      timeout: 10000,
    });
  } catch (error) {
    // Log current URL and page content for debugging
    console.log(`Current URL: ${page.url()}`);
    console.log(`Page title: ${await page.title()}`);

    // Check if there are any error toasts
    const toasts = await page.locator('[role="alert"]').all();
    for (const toast of toasts) {
      console.log(`Toast message: ${await toast.textContent()}`);
    }

    throw new Error(
      `Username input not found after clicking "Start ${roomType} Room". This likely means the createRoom mutation failed.`,
    );
  }

  return page.url();
}

async function joinRoom(page: Page, username: string, url?: string) {
  if (url) {
    await page.goto(url);
  }
  await page.getByLabel("Username", { exact: true }).fill(username);
  await page.getByRole("button", { name: "Join room" }).click();
  await expect(page.getByText(username)).toBeVisible();
}

async function verifyAllUsersPresent(pages: Page[]) {
  for (const page of pages) {
    await expect(page.getByTestId("player")).toHaveCount(pages.length);
  }
}

async function makeEstimations(pages: Page[]) {
  const estimations = ["3", "5", "8", "13"];
  await Promise.all(
    pages.map((page, index) =>
      page
        .getByRole("button", { name: estimations[index], exact: true })
        .click(),
    ),
  );
}

async function revealEstimations(hostPage: Page) {
  await hostPage.getByRole("button", { name: "Reveal cards" }).click();
}

async function verifyResults(pages: Page[]) {
  await Promise.all(
    pages.map(async (page) => {
      await expect(page.getByText("average")).toBeVisible();
    }),
  );
  await expect(pages[0].getByTestId("vote-distribution-chart")).toBeVisible();
}

async function startNewRound(hostPage: Page) {
  await hostPage.getByRole("button", { name: "Start New Game" }).click();
  await expect(
    hostPage.getByText("Are you sure you want to start a new game?"),
  ).toBeVisible();
  await hostPage.getByRole("button", { name: "Start New Game" }).click();
}

async function verifyNewRound(pages: Page[]) {
  await Promise.all(
    pages.map(async (page) => {
      await expect(page.getByText("average")).not.toBeVisible();
      await expect(
        page.getByTestId("vote-distribution-chart"),
      ).not.toBeVisible();
      await expect(page.getByText("Just start picking cards!")).toBeVisible();
    }),
  );
}
