import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

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
    (emailjs.default.send as any).mockResolvedValueOnce({
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
    const selectElements = screen.getAllByRole("combobox");
    selectElements.forEach((select) => {
      // Select the first actual option for each question (skip the "Selecteer je antwoord" option)
      const options = within(select).getAllByRole("option");
      if (options.length > 1) {
        userEvent.selectOptions(select, options[1].value);
      }
    });

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
    (emailjs.default.send as any).mockRejectedValueOnce(
      new Error("EmailJS API error")
    );

    render(<App />);

    // Click CTA button to show form
    const ctaButton = screen.getByRole("button", {
      name: /start gratis risico check/i,
    });
    await userEvent.click(ctaButton);

    // Fill out all required questions
    const selectElements = screen.getAllByRole("combobox");
    selectElements.forEach((select) => {
      const options = within(select).getAllByRole("option");
      if (options.length > 1) {
        userEvent.selectOptions(select, options[1].value);
      }
    });

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
    (emailjs.default.send as any).mockRejectedValueOnce(
      new Error("Network error")
    );

    render(<App />);

    // Click CTA button to show form
    const ctaButton = screen.getByRole("button", {
      name: /start gratis risico check/i,
    });
    await userEvent.click(ctaButton);

    // Fill out all required questions
    const selectElements = screen.getAllByRole("combobox");
    selectElements.forEach((select) => {
      const options = within(select).getAllByRole("option");
      if (options.length > 1) {
        userEvent.selectOptions(select, options[1].value);
      }
    });

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
});
