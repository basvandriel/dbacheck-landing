import React, { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { trackPageView, trackEvent, trackCustomEvent } from "./utils";
import { calculateRiskScore } from "./scoring";
import HeroSection from "./components/HeroSection";
import ZZPPitfalls from "./components/ZZPPitfalls";
import HowItWorks from "./components/HowItWorks";
import ComplianceForm from "./components/ComplianceForm";
import Footer from "./components/Footer";

function App() {
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView?.({ behavior: "smooth" });
    trackEvent("navigation", "click", "cta_button");
  };

  const handleInputChange = (question: string, value: string) => {
    const newData = { ...formData, [question]: value };
    setFormData(newData);

    // Track question answer
    if (question !== "email") {
      trackCustomEvent("question_answered", {
        question_id: question,
        answer: value,
      });

      // Track form start on first question
      const wasEmpty =
        Object.keys(formData).filter((key) => key !== "email" && formData[key])
          .length === 0;
      if (wasEmpty) {
        trackCustomEvent("form_started");
      }

      // Track progress milestones
      const answeredCount = Object.keys(newData).filter(
        (key) => key !== "email" && newData[key]
      ).length;
      const totalQuestions = 15; // from questions array
      const progressPercent = Math.round(
        (answeredCount / totalQuestions) * 100
      );
      const prevProgressPercent = Math.round(
        ((answeredCount - 1) / totalQuestions) * 100
      );

      if (progressPercent >= 25 && prevProgressPercent < 25) {
        trackCustomEvent("form_progress", { progress: 25 });
      } else if (progressPercent >= 50 && prevProgressPercent < 50) {
        trackCustomEvent("form_progress", { progress: 50 });
      } else if (progressPercent >= 75 && prevProgressPercent < 75) {
        trackCustomEvent("form_progress", { progress: 75 });
      } else if (progressPercent >= 100 && prevProgressPercent < 100) {
        trackCustomEvent("form_progress", { progress: 100 });
      }
    }
  };

  useEffect(() => {
    trackPageView(window.location.pathname + window.location.search);
    trackEvent("page_view", "visit", "landing_page");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { score, level, teaserInsights } = calculateRiskScore(formData);

    // Track risk score
    trackCustomEvent("risk_score_calculated", {
      risk_score: score,
      risk_level: level,
      questions_answered: Object.keys(formData).filter(
        (key) => key !== "email" && formData[key]
      ).length,
    });

    const templateParams = {
      email: formData.email,
      risk_score: score,
      risk_level: level,
      insights: teaserInsights.join("\n• "),
      form_data: Object.entries(formData)
        .filter(([key]) => key !== "email")
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n"),
    };

    // In test mode, store data in localStorage instead of sending email
    if (import.meta.env.VITE_TEST_MODE === "true") {
      localStorage.setItem(
        "testEmailData",
        JSON.stringify({
          to_email: formData.email,
          risk_score: score,
          risk_level: level,
          insights: teaserInsights.join("\n• "),
          form_data: templateParams.form_data,
        })
      );
      setIsSubmitted(true);
      trackEvent("form", "submit", "test_mode");
      setIsSubmitting(false);
      return;
    }

    try {
      await emailjs.send(
        "service_e5sgqty",
        "template_nghge43",
        templateParams,
        "XgaQ6r0hi05rdDRA9"
      );
      setIsSubmitted(true);
      trackEvent("form", "submit", "success");
    } catch (error) {
      console.error("EmailJS error:", error);
      // Still show success to user as per current behavior
      setIsSubmitted(true);
      trackEvent("form", "submit", "email_error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <HeroSection onStartCheck={scrollToForm} />
      <ZZPPitfalls />
      <HowItWorks />
      <div ref={formRef}>
        <ComplianceForm
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isSubmitted={isSubmitted}
        />
      </div>
      <Footer />
    </div>
  );
}

export default App;
