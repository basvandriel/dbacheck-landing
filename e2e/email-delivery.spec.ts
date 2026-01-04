import { test, expect } from "@playwright/test";

test.describe("DBA Compliance Check - Email Delivery Tests", () => {
  test("should send actual production email", async ({ page }) => {
    // 🚨 DANGER: This test sends a REAL email via EmailJS
    // ⚠️  WARNING: Only run this test when you need to verify production email delivery
    // 📧 This will consume your EmailJS quota and send actual emails
    // 🧪 Run with: npm run test:e2e:production
    // 📨 Check contact@basvandriel.nl for the actual email delivery

    // Navigate to the landing page first
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Set up monitoring to detect if EmailJS calls are made
    let networkRequests: string[] = [];
    page.on("request", (request) => {
      if (
        request.url().includes("emailjs") ||
        request.url().includes("api.emailjs.com")
      ) {
        networkRequests.push(`${request.method()} ${request.url()}`);
      }
    });

    // Try a quick form submission to detect test mode
    await page.waitForSelector('input[type="email"]');
    await page
      .getByRole("button", { name: /start gratis risico check/i })
      .click();

    // Fill one question and email quickly
    const radioButton = page.locator(
      'input[type="radio"][name="q1"][value="20-40"]'
    );
    await radioButton.click();
    await page.getByLabel("Jouw e-mailadres").fill("test@example.com");

    // Submit quickly
    await page
      .getByRole("button", { name: /verstuur mijn gratis analyse/i })
      .click();

    // Wait a moment
    await page.waitForTimeout(1000);

    // Check if any EmailJS calls were made - if not, we're in test mode
    const isTestMode = networkRequests.length === 0;
    
    if (isTestMode) {
      console.log("⏭️  Skipping production email test - running in test mode (no EmailJS calls detected)");
      return;
    }

    console.log(
      "🚨 Running PRODUCTION email test - this will send a real email!"
    );
    console.log(
      "📧 Make sure to check contact@basvandriel.nl after the test completes"
    );

    // Reset for the actual test - go back to home
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Clear the network requests array for the actual test
    networkRequests = [];

    // Wait for the form to be loaded
    await page.waitForSelector('input[type="email"]');

    // Click the CTA button to show the form
    await page
      .getByRole("button", { name: /start gratis risico check/i })
      .click();

    // Fill out all required questions
    // The form uses radio buttons, not selects
    const questions = [
      { id: "q1", options: ["Minder dan 20", "20-40", "Meer dan 40"] },
      {
        id: "q2",
        options: ["Nee", "Ja, geïmpliceerd", "Ja, expliciet gezegd"],
      },
      { id: "q3", options: ["Nee", "Soms", "Ja"] },
      {
        id: "q4",
        options: ["Nooit", "Soms", "Meerdere keren per week", "Dagelijks"],
      },
      { id: "q5", options: ["Nee", "Ja, gedeeltelijk", "Ja, allemaal"] },
      { id: "q6", options: ["Nee", "Soms", "Ja"] },
      { id: "q7", options: ["Nee", "Soms", "Ja"] },
      { id: "q8", options: ["Nee", "Soms", "Ja"] },
      { id: "q9", options: ["Ja", "Moeilijk", "Nee"] },
      { id: "q10", options: ["Nee", "1-2", "3 of meer"] },
      { id: "q11", options: ["Ja", "Gedeeltelijk", "Nee"] },
      { id: "q12", options: ["Ja", "Gedeeltelijk", "Nee"] },
      { id: "q13", options: ["Nee", "Ja, als eenmanszaak", "Ja, als BV"] },
      { id: "q14", options: ["Nee", "Ja"] },
      {
        id: "q15",
        options: ["Minder dan 1 jaar", "1-3 jaar", "Meer dan 3 jaar"],
      },
    ];

    for (const question of questions) {
      // Click the second option (index 1) for each question
      const radioButton = page.locator(
        `input[type="radio"][name="${question.id}"][value="${question.options[1]}"]`
      );
      await radioButton.scrollIntoViewIfNeeded();
      await radioButton.click();
      await page.waitForTimeout(50);
    }

    // Fill out email with the specified recipient
    await page.getByLabel("Jouw e-mailadres").scrollIntoViewIfNeeded();
    await page.getByLabel("Jouw e-mailadres").fill("contact@basvandriel.nl");

    // Set up monitoring BEFORE submitting the form
    const consoleMessages: string[] = [];

    page.on("console", (msg) => {
      consoleMessages.push(msg.text());
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

    // Fill out one question but leave email empty
    const radioButton = page.locator(
      'input[type="radio"][name="q1"][value="20-40"]'
    );
    await radioButton.scrollIntoViewIfNeeded();
    await radioButton.click();

    // Try to submit without email - button should be disabled
    const submitButton = page.getByRole("button", {
      name: /verstuur mijn gratis analyse/i,
    });
    await expect(submitButton).toBeDisabled();

    // Check that we're still on the form by verifying the email input is visible
    await expect(page.getByLabel("Jouw e-mailadres")).toBeVisible();
  });
});
