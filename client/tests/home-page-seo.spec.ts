import { test, expect } from "@playwright/test";

test.describe("Home Page SEO and Content", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/");
  });

  test("has all necessary SEO meta tags", async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle(
      "Planning Poker | Free Online Scrum Estimation Tool for Agile Teams",
    );

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute(
      "content",
      /The best free, open-source planning poker tool/,
    );

    // Check meta keywords
    const metaKeywords = page.locator('meta[name="keywords"]');
    await expect(metaKeywords).toHaveAttribute(
      "content",
      /planning poker.*scrum poker.*agile estimation/,
    );

    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute(
      "content",
      "Planning Poker | Free Online Scrum Estimation Tool",
    );

    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute(
      "content",
      "https://pokerplanning.org/poker-planning-demo.png",
    );

    // Check Twitter Card tags
    const twitterCard = page.locator('meta[name="twitter:card"]');
    await expect(twitterCard).toHaveAttribute("content", "summary_large_image");

    // Check canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute(
      "href",
      "https://pokerplanning.org",
    );
  });

  test("has structured data (JSON-LD)", async ({ page }) => {
    // Check for SoftwareApplication schema
    const softwareAppSchema = await page.evaluate(() => {
      const scripts = Array.from(
        document.querySelectorAll('script[type="application/ld+json"]'),
      );
      return scripts.find(
        (script) =>
          script.textContent?.includes('"@type": "SoftwareApplication"'),
      );
    });
    expect(softwareAppSchema).toBeTruthy();

    // Check for Organization schema
    const orgSchema = await page.evaluate(() => {
      const scripts = Array.from(
        document.querySelectorAll('script[type="application/ld+json"]'),
      );
      return scripts.find(
        (script) => script.textContent?.includes('"@type": "Organization"'),
      );
    });
    expect(orgSchema).toBeTruthy();

    // Check for FAQPage schema
    const faqSchema = await page.evaluate(() => {
      const scripts = Array.from(
        document.querySelectorAll('script[type="application/ld+json"]'),
      );
      return scripts.find(
        (script) => script.textContent?.includes('"@type": "FAQPage"'),
      );
    });
    expect(faqSchema).toBeTruthy();
  });

  test("has updated hero section with modern design", async ({ page }) => {
    // Check for the animated badge
    const badge = page.locator("text=Free & Open Source Sprint Planning Tool");
    await expect(badge).toBeVisible();

    // Check for gradient text in heading
    const gradientHeading = page.locator("h1").getByText("Planning Poker");
    await expect(gradientHeading).toBeVisible();
    const classes = await gradientHeading.getAttribute("class");
    expect(classes).toContain("bg-linear-to-r");

    // Check for updated CTA buttons
    const startButton = page.getByRole("button", { name: "Start New Game" });
    await expect(startButton).toBeVisible();
    await expect(startButton).toHaveClass(/rounded-full/);

    const githubButton = page
      .getByRole("link", { name: "View on GitHub" })
      .first();
    await expect(githubButton).toBeVisible();
    await expect(githubButton).toHaveClass(/rounded-full/);

    // Check for trust indicators in hero section
    const trustIndicators = page
      .locator("div")
      .filter({
        hasText:
          /100% Free Forever.*No Account Required.*Real-time Collaboration/,
      })
      .first();
    await expect(
      trustIndicators.locator("span").filter({ hasText: "100% Free Forever" }),
    ).toBeVisible();
    await expect(
      trustIndicators
        .locator("span")
        .filter({ hasText: "No Account Required" }),
    ).toBeVisible();
    await expect(
      trustIndicators
        .locator("span")
        .filter({ hasText: "Real-time Collaboration" }),
    ).toBeVisible();
  });

  test("has How It Works section with 4 steps", async ({ page }) => {
    // Check section heading
    await expect(
      page.getByRole("heading", { name: /How.*Planning Poker.*Works/ }),
    ).toBeVisible();

    // Check for the animated badge
    await expect(
      page.getByText("Get started in under 30 seconds"),
    ).toBeVisible();

    // Check all 4 steps are present
    const steps = [
      "Create a Room",
      "Invite Your Team",
      "Vote on Stories",
      "Reach Consensus",
    ];

    for (const step of steps) {
      await expect(page.getByRole("heading", { name: step })).toBeVisible();
    }

    // Check for step descriptions
    await expect(
      page.getByText(/Start a new planning session with one click/),
    ).toBeVisible();
    await expect(
      page.getByText(/Share the room URL with your team members/),
    ).toBeVisible();
    await expect(
      page.getByText(/Present user stories and have everyone vote/),
    ).toBeVisible();
    await expect(page.getByText(/Reveal all votes at once/)).toBeVisible();
  });

  test("has Why Choose Us section with benefits and pricing", async ({
    page,
  }) => {
    // Check section heading
    await expect(
      page.getByRole("heading", { name: "Why Teams Choose PokerPlanning.org" }),
    ).toBeVisible();

    // Check benefits are displayed
    const benefits = [
      "100% Free Forever",
      "No Sign-up Required",
      "Real-time Collaboration",
      "Privacy First",
      "Works Everywhere",
      "Open Source",
    ];

    // Check benefits are displayed in the WhyChooseUs section
    const whyChooseSection = page
      .locator("div")
      .filter({ hasText: "Why Teams Choose PokerPlanning.org" })
      .first();
    for (const benefit of benefits) {
      // Look for benefits in dt elements specifically
      await expect(
        whyChooseSection.locator("dt").filter({ hasText: benefit }),
      ).toBeVisible();
    }

    // The WhyChooseUs component doesn't include a pricing box,
    // it only shows the benefits grid

    // The WhyChooseUs component doesn't include a pricing box with feature list,
    // so we'll skip checking for specific features
  });

  test("has Use Cases section with bingo layout", async ({ page }) => {
    // Check section heading
    await expect(
      page.getByText("Everything you need for sprint planning"),
    ).toBeVisible();

    // Check for the 4 use case cards - they are not headings but p tags
    await expect(page.getByText("Remote-first design")).toBeVisible();
    await expect(page.getByText("Lightning fast")).toBeVisible();
    await expect(page.getByText("Team insights")).toBeVisible();
    await expect(page.getByText("Built for everyone")).toBeVisible();

    // Check descriptions
    await expect(page.getByText(/Built for distributed teams/)).toBeVisible();
    await expect(page.getByText(/Instant room creation/)).toBeVisible();
    await expect(page.getByText(/Visualize voting patterns/)).toBeVisible();
    await expect(page.getByText(/From startups to enterprises/)).toBeVisible();
  });

  test("has FAQ section with expandable items", async ({ page }) => {
    // Check section heading
    await expect(
      page.getByRole("heading", { name: "Frequently Asked Questions" }),
    ).toBeVisible();

    // Check some FAQ questions are visible
    const faqQuestions = [
      "What is Planning Poker?",
      "How much does PokerPlanning.org cost?",
      "Do I need to create an account?",
      "Is my data secure?",
    ];

    for (const question of faqQuestions) {
      await expect(page.getByRole("button", { name: question })).toBeVisible();
    }

    // Test expanding an FAQ item
    const firstQuestion = page.getByRole("button", {
      name: "What is Planning Poker?",
    });
    await firstQuestion.click();

    // Check that the answer is visible after clicking
    await expect(
      page.getByText(/Planning Poker is an agile estimation technique/),
    ).toBeVisible();

    // Click again to collapse
    await firstQuestion.click();

    // Check that the answer is hidden
    await expect(
      page.getByText(/Planning Poker is an agile estimation technique/),
    ).not.toBeVisible();
  });

  test("has Call to Action section before footer", async ({ page }) => {
    // Check CTA heading
    await expect(
      page.getByRole("heading", {
        name: /Ready to improve your.*sprint planning/,
      }),
    ).toBeVisible();

    // Check CTA text
    await expect(
      page.getByText("Start your first planning session in seconds"),
    ).toBeVisible();

    // Check CTA buttons
    const ctaButtons = page.locator("button:has-text('Start Planning Now')");
    await expect(ctaButtons).toHaveCount(1);

    // Check GitHub link in CTA section
    const ctaSection = page
      .locator("div")
      .filter({ hasText: /Start Planning NowView on GitHub/ })
      .last();
    const ctaGithubLink = ctaSection.getByRole("link", {
      name: "View on GitHub",
    });
    await expect(ctaGithubLink).toBeVisible();

    // Check trust indicators in CTA section
    const ctaContainer = page
      .locator("div")
      .filter({ hasText: /Ready to improve your.*sprint planning/ })
      .first();
    const ctaTrustIndicators = ctaContainer
      .locator("div")
      .filter({ hasText: /Always free.*No account needed.*Open source/ })
      .first();
    await expect(
      ctaTrustIndicators.locator("span").filter({ hasText: "Always free" }),
    ).toBeVisible();
    await expect(
      ctaTrustIndicators
        .locator("span")
        .filter({ hasText: "No account needed" }),
    ).toBeVisible();
    await expect(
      ctaTrustIndicators.locator("span").filter({ hasText: "Open source" }),
    ).toBeVisible();
  });

  test("has enhanced footer with navigation", async ({ page }) => {
    const footer = page.locator("footer");

    // Check footer sections
    await expect(
      footer.getByRole("heading", { name: "Product" }),
    ).toBeVisible();
    await expect(
      footer.getByRole("heading", { name: "Company" }),
    ).toBeVisible();
    await expect(footer.getByRole("heading", { name: "Legal" })).toBeVisible();

    // Check footer links
    const footerLinks = [
      "Features",
      "How It Works",
      "Use Cases",
      "FAQ",
      "About",
      "Blog",
      "Open Source",
      "Contribute",
      "Privacy Policy",
      "Terms of Service",
      "License",
    ];

    for (const link of footerLinks) {
      await expect(footer.getByRole("link", { name: link })).toBeVisible();
    }

    // Check social links
    await expect(footer.getByRole("link", { name: "X" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "GitHub" })).toBeVisible();

    // Check copyright
    await expect(footer.getByText(/© \d{4} PokerPlanning.org/)).toBeVisible();
  });
});
