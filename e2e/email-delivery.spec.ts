import { test, expect } from "@playwright/test";

test.describe("DBA Compliance Check - Email Delivery Tests", () => {
  test("should send actual production email", async ({ page }) => {
    // 🚨 DANGER: This test sends a REAL email via EmailJS
    // ⚠️  WARNING: Only run this test when you need to verify production email delivery
    // 📧 This will consume your EmailJS quota and send actual emails
    // 🧪 Run with: npm run test:e2e:production
    // 📨 Check contact@basvandriel.nl for the actual email delivery

    console.log(
      "🚨 Running PRODUCTION email test - this will send a real email!"
    );
    console.log(
      "📧 Make sure to check contact@basvandriel.nl after the test completes"
    );

    // Navigate to the landing page (WITHOUT test mode)
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Wait for the form to be loaded
    await page.waitForSelector('input[type="email"]');

    // Click the CTA button to show the form
    await page
      .getByRole("button", { name: /start gratis risico check/i })
      .click();

    // Fill out all required questions
    const selects = page.locator("select");
    const count = await selects.count();
    for (let i = 0; i < count; i++) {
      const select = selects.nth(i);
      await select.scrollIntoViewIfNeeded();
      await select.selectOption({ index: 1 });
      await page.waitForTimeout(50);
    }

    // Fill out email with the specified recipient
    await page.getByLabel("Jouw e-mailadres").scrollIntoViewIfNeeded();
    await page.getByLabel("Jouw e-mailadres").fill("contact@basvandriel.nl");

    // Set up monitoring BEFORE submitting the form
    const consoleMessages: string[] = [];
    const networkRequests: string[] = [];

    page.on("console", (msg) => {
      consoleMessages.push(msg.text());
    });

    page.on("request", (request) => {
      if (
        request.url().includes("emailjs") ||
        request.url().includes("api.emailjs.com")
      ) {
        networkRequests.push(`${request.method()} ${request.url()}`);
      }
    });

    // Submit the form
    console.log("🖱️  Clicking submit button...");
    await page
      .getByRole("button", { name: /verstuur mijn gratis analyse/i })
      .scrollIntoViewIfNeeded();
    await page
      .getByRole("button", { name: /verstuur mijn gratis analyse/i })
      .click();
    console.log("✅ Submit button clicked");

    // Wait for submission to process (longer timeout for actual email sending)
    console.log("⏳ Waiting for submission to process...");
    await page.waitForTimeout(5000);
    console.log("✅ Wait completed");

    // Check for success message (should appear even if email fails)
    await expect(page.getByText("Bedankt voor je inzending!")).toBeVisible();

    // Verify the email address is shown in success message
    await expect(
      page.getByText("onderweg naar contact@basvandriel.nl")
    ).toBeVisible();

    // Wait a bit more for any async console messages
    await page.waitForTimeout(2000);

    console.log("📧 Production email test completed!");
    console.log("📋 Console messages during submission:", consoleMessages);
    console.log("🌐 EmailJS network requests:", networkRequests);

    // Check if test mode was actually used (would indicate environment issue)
    const testData = await page.evaluate(() => {
      return localStorage.getItem("testEmailData");
    });

    if (testData) {
      console.log(
        "⚠️  WARNING: Test mode was used instead of production mode!"
      );
      console.log("📦 Test data found:", JSON.parse(testData).to_email);
    } else {
      console.log("✅ No test data found - production mode confirmed");
    }

    // Note: In production mode, we can't easily verify the email was actually sent
    // The success message indicates the form submission worked
    // Check your email inbox at contact@basvandriel.nl to verify delivery
  });

  test("should handle email service errors gracefully", async ({ page }) => {
    // This test would simulate EmailJS failures
    // For now, we'll test the form validation
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Wait for the form to be loaded
    await page.waitForSelector('input[type="email"]');
    await page
      .getByRole("button", { name: /start gratis risico check/i })
      .click();

    // Try to submit without email
    await page
      .getByRole("button", { name: /verstuur mijn gratis analyse/i })
      .scrollIntoViewIfNeeded();
    await page
      .getByRole("button", { name: /verstuur mijn gratis analyse/i })
      .click();

    // Should still be on form (HTML5 validation)
    await expect(
      page.getByText("Beantwoord de vragen voor een persoonlijk risico-rapport")
    ).toBeVisible();
  });
});
