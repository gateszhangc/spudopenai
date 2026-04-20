const { test, expect } = require("@playwright/test");

test.describe("Spud OpenAI official site", () => {
  test("desktop homepage renders core content and seo metadata", async ({ page, request }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Spud OpenAI Official Website \| Prompt Ops And Evals/i);
    await expect(page.locator("h1")).toHaveText(/Spud OpenAI makes prompt ops readable\./i);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /official website for an OpenAI-native workspace/i
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://spudopenai.lol/");
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", "Spud OpenAI");
    await expect(page.getByRole("link", { name: "Request access" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Built to keep model work legible." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Answers for the first conversation." })).toBeVisible();
    await page.getByText("Is this the official Spud OpenAI website?").click();
    await expect(
      page.getByText("This is the official Spud OpenAI website for the product, its workflow, and its brand materials.")
    ).toBeVisible();
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(4);

    for (const image of await page.locator("img").all()) {
      await image.scrollIntoViewIfNeeded();
    }

    const imagesLoaded = await page.evaluate(() =>
      Array.from(document.images).every((image) => image.complete && image.naturalWidth > 0)
    );
    expect(imagesLoaded).toBe(true);

    const healthz = await request.get("/healthz");
    expect(healthz.ok()).toBe(true);
    await expect(await healthz.json()).toEqual({ ok: true });

    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBe(true);
    expect(await robots.text()).toContain("Sitemap: https://spudopenai.lol/sitemap.xml");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBe(true);
    expect(await sitemap.text()).toContain("<loc>https://spudopenai.lol/</loc>");
  });

  test("mobile homepage stays within viewport and keeps faq usable", async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true
    });
    const page = await context.newPage();

    await page.goto("/");

    await expect(page.locator("h1")).toBeVisible();
    await page.getByRole("link", { name: "FAQ" }).first().click();
    await expect(page.locator("#faq")).toBeInViewport();

    await page.getByText("What is Spud OpenAI?").click();
    await expect(page.getByText(/Spud OpenAI is an OpenAI-native operating surface/i)).toBeVisible();
    await page.getByText("Is this the official Spud OpenAI website?").click();
    await expect(page.locator("#faq details").nth(1).locator("p")).toContainText("official Spud OpenAI website");

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);

    await context.close();
  });
});
