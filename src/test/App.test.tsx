import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { calculateRiskScore } from "../scoring";
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

Object.defineProperty(window, "localStorage", {
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
    const ctaButton = screen.getByRole("button", {
      name: /start gratis risico check/i,
    });
    await userEvent.click(ctaButton);
    expect(screen.getByText(/DBA Compliance Check/i)).toBeInTheDocument();
  });

  it("submits form successfully in test mode", async () => {
    render(<App />);

    // Click CTA to show form
    const ctaButton = screen.getByRole("button", {
      name: /start gratis risico check/i,
    });
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

    const submitButton = screen.getByRole("button", {
      name: /verstuur mijn gratis analyse/i,
    });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "testEmailData",
        expect.any(String)
      );
    });

    expect(screen.getByText(/bedankt/i)).toBeInTheDocument();
  });
});

describe("calculateRiskScore", () => {
  it("returns high risk for immediate high risk indicators", () => {
    const data = { q2: "Ja, expliciet gezegd" };
    const result = calculateRiskScore(data);
    expect(result.score).toBe(25);
    expect(result.level).toBe("Hoog risico - Onmiddellijke actie vereist");
  });

  it("calculates score correctly for low risk scenario", () => {
    const data = {
      q1: "Minder dan 20",
      q2: "Nee",
      q3: "Nee",
      q4: "Nooit",
      q5: "Nee",
      q6: "Nee",
      q7: "Nee",
      q8: "Nee",
      q9: "Ja",
      q10: "3 of meer",
      q11: "Ja",
      q12: "Ja",
      q13: "Ja, als eenmanszaak",
      q14: "Ja",
      q15: "Meer dan 3 jaar",
    };
    const result = calculateRiskScore(data);
    expect(result.score).toBe(0); // All positive indicators cancel out negatives
    expect(result.level).toBe("Laag risico - Goede DBA-indicatoren");
  });

  it("calculates score correctly for medium risk scenario", () => {
    const data = {
      q1: "20-40",
      q2: "Nee",
      q3: "Nee",
      q4: "Nooit",
      q5: "Nee",
      q6: "Nee",
      q7: "Nee",
      q8: "Nee",
      q9: "Ja",
      q10: "1-2",
      q11: "Ja",
      q12: "Ja",
      q13: "Ja, als eenmanszaak",
      q14: "Ja",
      q15: "1-3 jaar",
    };
    const result = calculateRiskScore(data);
    // q1: +1, q10: -1, q13: -1, q14: -1, q15: -1 = 1 - 4 = -3, Math.max(0) = 0
    expect(result.score).toBe(0);
    expect(result.level).toBe("Laag risico - Goede DBA-indicatoren");
  });

  it("calculates score correctly for high risk scenario", () => {
    const data = {
      q1: "Meer dan 40",
      q2: "Nee",
      q3: "Ja",
      q4: "Dagelijks",
      q5: "Nee",
      q6: "Nee",
      q7: "Nee",
      q8: "Ja",
      q9: "Nee",
      q10: "Geen",
      q11: "Nee",
      q12: "Nee",
      q13: "Ja, als eenmanszaak",
      q14: "Nee",
      q15: "Minder dan 1 jaar",
    };
    const result = calculateRiskScore(data);
    // q1: +3, q3: +3, q4: +3, q8: +3, q9: +2, q11: +3, q12: +2 = 3+3+3+3+2+3+2 = 19
    // q13: -1 = 18
    expect(result.score).toBe(18);
    expect(result.level).toBe("Potentieel hoog risico - Overweeg actie");
  });

  it("prevents negative scores", () => {
    const data = {
      q1: "Minder dan 20",
      q2: "Nee",
      q3: "Nee",
      q4: "Nooit",
      q5: "Nee",
      q6: "Nee",
      q7: "Nee",
      q8: "Nee",
      q9: "Ja",
      q10: "3 of meer",
      q11: "Ja",
      q12: "Ja",
      q13: "Ja, als eenmanszaak",
      q14: "Ja",
      q15: "Meer dan 3 jaar",
    };
    const result = calculateRiskScore(data);
    // All negatives: q10: -2, q13: -1, q14: -1, q15: -2 = -6, Math.max(0) = 0
    expect(result.score).toBe(0);
    expect(result.level).toBe("Laag risico - Goede DBA-indicatoren");
  });

  it("returns teaser insights limited to 3", () => {
    const data = {
      q1: "Meer dan 40",
      q2: "Nee",
      q3: "Ja",
      q4: "Dagelijks",
      q5: "Nee",
      q6: "Nee",
      q7: "Nee",
      q8: "Ja",
      q9: "Nee",
      q10: "Geen",
      q11: "Nee",
      q12: "Nee",
      q13: "Ja, als eenmanszaak",
      q14: "Nee",
      q15: "Minder dan 1 jaar",
    };
    const result = calculateRiskScore(data);
    expect(result.teaserInsights.length).toBeLessThanOrEqual(3);
    expect(Array.isArray(result.teaserInsights)).toBe(true);
  });
});
