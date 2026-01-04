import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import "@testing-library/jest-dom";

// Mock EmailJS
vi.mock("@emailjs/browser", () => ({
  default: {
    send: vi.fn(),
  },
}));

// Mock utils
vi.mock("../utils", () => ({
  trackPageView: vi.fn(),
  trackEvent: vi.fn(),
  trackCustomEvent: vi.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe("App Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("VITE_TEST_MODE", "true");
  });

  it("renders the app", () => {
    render(<App />);
    expect(screen.getByText(/DBA-Proof in 2026/i)).toBeInTheDocument();
  });

  it("shows form after clicking CTA", async () => {
    render(<App />);
    const ctaButton = screen.getByRole("button", { name: /start gratis risico check/i });
    await userEvent.click(ctaButton);
    expect(screen.getByText(/DBA Compliance Check/i)).toBeInTheDocument();
  });

  it("submits form successfully in test mode", async () => {
    render(<App />);

    // Click CTA to show form
    const ctaButton = screen.getByRole("button", { name: /start gratis risico check/i });
    await userEvent.click(ctaButton);

    // Fill form
    const radioGroups = screen.getAllByRole("radiogroup");
    for (const group of radioGroups) {
      const radios = group.querySelectorAll('input[type="radio"]');
      if (radios.length > 0) {
        await userEvent.click(radios[0]);
      }
    }

    const emailInput = screen.getByLabelText(/jouw e-mailadres/i);
    await userEvent.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", { name: /verstuur mijn gratis analyse/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith("testEmailData", expect.any(String));
    });

    expect(screen.getByText(/bedankt/i)).toBeInTheDocument();
  });
});
