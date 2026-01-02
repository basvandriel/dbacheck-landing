import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
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
    const selectElements = screen.getAllByRole("combobox");
    for (const select of selectElements) {
      const options = within(select).getAllByRole("option");
      if (options.length > 1) {
        const value = (options[1] as HTMLOptionElement).value;
        await userEvent.selectOptions(select as HTMLSelectElement, value);
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
    const selectElements = screen.getAllByRole("combobox");
    for (const select of selectElements) {
      const options = within(select).getAllByRole("option");
      if (options.length > 1) {
        const value = (options[1] as HTMLOptionElement).value;
        await userEvent.selectOptions(select as HTMLSelectElement, value);
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
    const selectElements = screen.getAllByRole("combobox");
    for (const select of selectElements) {
      const options = within(select).getAllByRole("option");
      if (options.length > 1) {
        const value = (options[1] as HTMLOptionElement).value;
        await userEvent.selectOptions(select as HTMLSelectElement, value);
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
    const selectElements = screen.getAllByRole("combobox");
    if (selectElements.length > 0) {
      const options = within(selectElements[0]).getAllByRole("option");
      if (options.length > 1) {
        const value = (options[1] as HTMLOptionElement).value;
        await userEvent.selectOptions(
          selectElements[0] as HTMLSelectElement,
          value
        );
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
    const selectElements = screen.getAllByRole("combobox");
    for (const select of selectElements) {
      const options = within(select).getAllByRole("option");
      // Select high-risk options where possible
      if (options.length > 2) {
        const value = (options[1] as HTMLOptionElement).value;
        await userEvent.selectOptions(select as HTMLSelectElement, value); // Assuming first option after placeholder is high risk
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

  it("renders the form correctly after CTA click", async () => {
    render(<App />);

    // Initially, form should not be visible or questions not present
    expect(
      screen.queryByLabelText(/jouw e-mailadres/i)
    ).not.toBeInTheDocument();

    // Click the CTA button to show the form
    const ctaButton = screen.getByRole("button", {
      name: /start gratis risico check/i,
    });
    await userEvent.click(ctaButton);

    // Now form elements should be present
    expect(screen.getByLabelText(/jouw e-mailadres/i)).toBeInTheDocument();
    expect(screen.getAllByRole("combobox")).toHaveLength(15); // Assuming 15 questions
    expect(
      screen.getByRole("button", { name: /verstuur mijn gratis analyse/i })
    ).toBeInTheDocument();
  });

  it("updates form data on select change", async () => {
    render(<App />);

    // Click the CTA button to show the form
    const ctaButton = screen.getByRole("button", {
      name: /start gratis risico check/i,
    });
    await userEvent.click(ctaButton);

    const selectElements = screen.getAllByRole("combobox");
    const firstSelect = selectElements[0] as HTMLSelectElement;
    const options = within(firstSelect).getAllByRole("option");

    // Select an option
    if (options.length > 1) {
      const value = (options[1] as HTMLOptionElement).value;
      await userEvent.selectOptions(firstSelect, value);
      expect(firstSelect).toHaveValue(value);
    }
  });
});
