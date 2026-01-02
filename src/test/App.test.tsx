import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import "@testing-library/jest-dom";

// Mock EmailJS to avoid actually sending emails during tests
vi.mock("@emailjs/browser", () => ({
  default: {
    send: vi.fn(),
  },
}));

// Mock the trackEvent function
vi.mock("../utils", () => ({
  trackPageView: vi.fn(),
  trackEvent: vi.fn(),
}));

describe("Email Functionality - Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits form and calls EmailJS with correct parameters", async () => {
    // Mock successful EmailJS response
    const emailjs = await import("@emailjs/browser");
    (emailjs.default.send as Mock).mockResolvedValueOnce({
      status: 200,
      text: "OK",
    });

    render(<App />);

    // Click the CTA button to show the form
    const ctaButton = screen.getByRole("button", {
      name: /start gratis risico check/i,
    });
    await userEvent.click(ctaButton);

    // Fill out all required questions to satisfy form validation
    const radioGroups = screen.getAllByRole("radiogroup");
    for (const radioGroup of radioGroups) {
      const radios = radioGroup.querySelectorAll('input[type="radio"]');
      if (radios.length > 0) {
        await userEvent.click(radios[0] as HTMLInputElement);
      }
    }

    // Fill out email
    const emailInput = screen.getByLabelText(/jouw e-mailadres/i);
    await userEvent.type(emailInput, "test@example.com");

    // Submit the form
    const submitButton = screen.getByRole("button", {
      name: /verstuur mijn gratis analyse/i,
    });
    await userEvent.click(submitButton);

    // Wait for the email API call
    await waitFor(async () => {
      const emailjs = await import("@emailjs/browser");
      expect(emailjs.default.send).toHaveBeenCalledWith(
        "service_e5sgqty",
        "template_nghge43",
        expect.objectContaining({
          to_email: "test@example.com",
          risk_score: expect.any(Number),
          risk_level: expect.any(String),
          insights: expect.any(String),
          form_data: expect.any(String),
          upsell_message: expect.any(String),
        }),
        "XgaQ6r0hi05rdDRA9"
      );
    });

    // Verify success state is shown
    expect(screen.getByText(/bedankt/i)).toBeInTheDocument();
  });

  it("handles EmailJS API errors gracefully and still shows success", async () => {
    // Mock failed EmailJS response
    const emailjs = await import("@emailjs/browser");
    (emailjs.default.send as Mock).mockRejectedValueOnce(
      new Error("EmailJS API error")
    );

    render(<App />);

    // Click CTA button to show form
    const ctaButton = screen.getByRole("button", {
      name: /start gratis risico check/i,
    });
    await userEvent.click(ctaButton);

    // Fill out all required questions
    const radioGroups = screen.getAllByRole("radiogroup");
    for (const radioGroup of radioGroups) {
      const radios = radioGroup.querySelectorAll('input[type="radio"]');
      if (radios.length > 0) {
        await userEvent.click(radios[0] as HTMLInputElement);
      }
    }

    // Fill out email
    const emailInput = screen.getByLabelText(/jouw e-mailadres/i);
    await userEvent.type(emailInput, "test@example.com");

    // Submit the form
    const submitButton = screen.getByRole("button", {
      name: /verstuur mijn gratis analyse/i,
    });
    await userEvent.click(submitButton);

    // Wait for the API call to complete (even though it fails)
    await waitFor(async () => {
      const emailjs = await import("@emailjs/browser");
      expect(emailjs.default.send).toHaveBeenCalled();
    });

    // Form should still show success even if email fails (current behavior)
    expect(screen.getByText(/bedankt/i)).toBeInTheDocument();
  });

  it("handles network errors from EmailJS API and still shows success", async () => {
    // Mock network error
    const emailjs = await import("@emailjs/browser");
    (emailjs.default.send as Mock).mockRejectedValueOnce(
      new Error("Network error")
    );

    render(<App />);

    // Click CTA button to show form
    const ctaButton = screen.getByRole("button", {
      name: /start gratis risico check/i,
    });
    await userEvent.click(ctaButton);

    // Fill out all required questions
    const radioGroups = screen.getAllByRole("radiogroup");
    for (const radioGroup of radioGroups) {
      const radios = radioGroup.querySelectorAll('input[type="radio"]');
      if (radios.length > 0) {
        await userEvent.click(radios[0] as HTMLInputElement);
      }
    }

    // Fill out email
    const emailInput = screen.getByLabelText(/jouw e-mailadres/i);
    await userEvent.type(emailInput, "test@example.com");

    // Submit the form
    const submitButton = screen.getByRole("button", {
      name: /verstuur mijn gratis analyse/i,
    });
    await userEvent.click(submitButton);

    // Wait for the API call to complete (even though it fails)
    await waitFor(async () => {
      const emailjs = await import("@emailjs/browser");
      expect(emailjs.default.send).toHaveBeenCalled();
    });

    // Form should still show success even with network error (current behavior)
    expect(screen.getByText(/bedankt/i)).toBeInTheDocument();
  });

  it("submits form with partial data and still calls EmailJS", async () => {
    // Mock successful EmailJS response
    const emailjs = await import("@emailjs/browser");
    (emailjs.default.send as Mock).mockResolvedValueOnce({
      status: 200,
      text: "OK",
    });

    render(<App />);

    // Click the CTA button to show the form
    const ctaButton = screen.getByRole("button", {
      name: /start gratis risico check/i,
    });
    await userEvent.click(ctaButton);

    // Fill out only a few questions
    const radioGroups = screen.getAllByRole("radiogroup");
    if (radioGroups.length > 0) {
      const radios = radioGroups[0].querySelectorAll('input[type="radio"]');
      if (radios.length > 0) {
        await userEvent.click(radios[0] as HTMLInputElement);
      }
    }

    // Fill out email
    const emailInput = screen.getByLabelText(/jouw e-mailadres/i);
    await userEvent.type(emailInput, "test@example.com");

    // Submit the form
    const submitButton = screen.getByRole("button", {
      name: /verstuur mijn gratis analyse/i,
    });
    await userEvent.click(submitButton);

    // Wait for the email API call
    await waitFor(async () => {
      const emailjs = await import("@emailjs/browser");
      expect(emailjs.default.send).toHaveBeenCalledWith(
        "service_e5sgqty",
        "template_nghge43",
        expect.objectContaining({
          to_email: "test@example.com",
          risk_score: expect.any(Number),
          risk_level: expect.any(String),
          insights: expect.any(String),
          form_data: expect.any(String),
          upsell_message: expect.any(String),
        }),
        "XgaQ6r0hi05rdDRA9"
      );
    });

    // Verify success state is shown
    expect(screen.getByText(/bedankt/i)).toBeInTheDocument();
  });

  it("submits form with high risk data and verifies risk level", async () => {
    // Mock successful EmailJS response
    const emailjs = await import("@emailjs/browser");
    (emailjs.default.send as Mock).mockResolvedValueOnce({
      status: 200,
      text: "OK",
    });

    render(<App />);

    // Click the CTA button to show the form
    const ctaButton = screen.getByRole("button", {
      name: /start gratis risico check/i,
    });
    await userEvent.click(ctaButton);

    // Fill out questions to simulate high risk (select options that increase score)
    // Find all question containers and fill them with high-risk answers
    const questionContainers = screen.getAllByRole("radiogroup");

    // q1: Hours worked - select "Meer dan 40" (+3)
    await userEvent.click(
      questionContainers[0].querySelector('input[value="Meer dan 40"]')!
    );
    // q2: Client thinks employee - select "Ja, expliciet gezegd" (+3)
    await userEvent.click(
      questionContainers[1].querySelector(
        'input[value="Ja, expliciet gezegd"]'
      )!
    );
    // q3: Client controls work - select "Ja" (+3)
    await userEvent.click(
      questionContainers[2].querySelector('input[value="Ja"]')!
    );
    // q4: Work on premises - select "Dagelijks" (+3)
    await userEvent.click(
      questionContainers[3].querySelector('input[value="Dagelijks"]')!
    );
    // q5: Use client software - select "Ja, allemaal" (+3)
    await userEvent.click(
      questionContainers[4].querySelector('input[value="Ja, allemaal"]')!
    );
    // q6: Fixed wage - select "Ja" (+3)
    await userEvent.click(
      questionContainers[5].querySelector('input[value="Ja"]')!
    );
    // q7: Benefits - select "Ja" (+3)
    await userEvent.click(
      questionContainers[6].querySelector('input[value="Ja"]')!
    );
    // q8: Required availability - select "Ja" (+3)
    await userEvent.click(
      questionContainers[7].querySelector('input[value="Ja"]')!
    );
    // q9: Can be replaced - select "Ja" (0 points)
    await userEvent.click(
      questionContainers[8].querySelector('input[value="Ja"]')!
    );
    // q10: Multiple clients - select "Nee" (0 points)
    await userEvent.click(
      questionContainers[9].querySelector('input[value="Nee"]')!
    );
    // q11: Set own hours - select "Nee" (+3)
    await userEvent.click(
      questionContainers[10].querySelector('input[value="Nee"]')!
    );
    // q12: Own tools - select "Nee" (+2)
    await userEvent.click(
      questionContainers[11].querySelector('input[value="Nee"]')!
    );
    // q13: KvK registration - select "Nee" (0 points)
    await userEvent.click(
      questionContainers[12].querySelector('input[value="Nee"]')!
    );
    // q14: Own website - select "Nee" (0 points)
    await userEvent.click(
      questionContainers[13].querySelector('input[value="Nee"]')!
    );
    // q15: Experience - select "Minder dan 1 jaar" (0 points)
    await userEvent.click(
      questionContainers[14].querySelector('input[value="Minder dan 1 jaar"]')!
    );

    // Fill out email
    const emailInput = screen.getByLabelText(/jouw e-mailadres/i);
    await userEvent.type(emailInput, "test@example.com");

    // Submit the form
    const submitButton = screen.getByRole("button", {
      name: /verstuur mijn gratis analyse/i,
    });
    await userEvent.click(submitButton);

    // Wait for the email API call and check for high risk level
    await waitFor(async () => {
      const emailjs = await import("@emailjs/browser");
      expect(emailjs.default.send).toHaveBeenCalledWith(
        "service_e5sgqty",
        "template_nghge43",
        expect.objectContaining({
          to_email: "test@example.com",
          risk_score: expect.any(Number),
          risk_level: "Hoog risico - Onmiddellijke actie nodig",
          insights: expect.any(String),
          form_data: expect.any(String),
          upsell_message: expect.any(String),
        }),
        "XgaQ6r0hi05rdDRA9"
      );
    });

    // Verify success state is shown
    expect(screen.getByText(/bedankt/i)).toBeInTheDocument();
  });

  it("renders the form correctly", async () => {
    render(<App />);

    // Form should be visible from the start
    expect(screen.getByLabelText(/jouw e-mailadres/i)).toBeInTheDocument();

    // Click the CTA button to scroll to the form
    const ctaButton = screen.getByRole("button", {
      name: /start gratis risico check/i,
    });
    await userEvent.click(ctaButton);

    // Form elements should be present
    expect(screen.getByLabelText(/jouw e-mailadres/i)).toBeInTheDocument();
    expect(screen.getAllByRole("radiogroup")).toHaveLength(15); // Assuming 15 questions
    expect(
      screen.getByRole("button", { name: /verstuur mijn gratis analyse/i })
    ).toBeInTheDocument();
  });

  it("updates form data on radio button change", async () => {
    render(<App />);

    // Click the CTA button to show the form
    const ctaButton = screen.getByRole("button", {
      name: /start gratis risico check/i,
    });
    await userEvent.click(ctaButton);

    const radioGroups = screen.getAllByRole("radiogroup");
    const firstRadioGroup = radioGroups[0];
    const radios = firstRadioGroup.querySelectorAll('input[type="radio"]');

    // Click a radio button
    if (radios.length > 0) {
      await userEvent.click(radios[0] as HTMLInputElement);
      expect(radios[0]).toBeChecked();
    }
  });
});
