import React, { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { trackPageView, trackEvent, trackCustomEvent } from "./utils";
import HeroSection from "./components/HeroSection";
import ZZPPitfalls from "./components/ZZPPitfalls";
import HowItWorks from "./components/HowItWorks";
import ComplianceForm from "./components/ComplianceForm";
import TestimonialSection from "./components/TestimonialSection";
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
      const wasEmpty = Object.keys(formData).filter(key => key !== "email" && formData[key]).length === 0;
      if (wasEmpty) {
        trackCustomEvent("form_started");
      }

      // Track progress milestones
      const answeredCount = Object.keys(newData).filter(key => key !== "email" && newData[key]).length;
      const totalQuestions = 15; // from questions array
      const progressPercent = Math.round((answeredCount / totalQuestions) * 100);
      const prevProgressPercent = Math.round(((answeredCount - 1) / totalQuestions) * 100);

      if (progressPercent >= 25 && prevProgressPercent < 25) {
        trackCustomEvent("form_progress", { progress: 25 });
      } else if (progressPercent >= 50 && prevProgressPercent < 50) {
        trackCustomEvent("form_progress", { progress: 50 });
      } else if (progressPercent >= 75 && prevProgressPercent < 75) {
        trackCustomEvent("form_progress", { progress: 75 });
      } else if (progressPercent >= 100 && prevProgressPercent < 100) {
        trackCustomEvent("form_progress", { progress: 100 });
      }
    } else {
      // Track email input
      trackCustomEvent("email_entered");
    }
  };

  useEffect(() => {
    trackPageView(window.location.pathname + window.location.search);
    trackEvent("page_view", "visit", "landing_page");
  }, []);

  const calculateRiskScore = (
    data: Record<string, string>
  ): {
    score: number;
    level: string;
    teaserInsights: string[];
  } => {
    let score = 0;
    const insights: string[] = [];

    // q1: Hours worked
    if (data.q1 === "Meer dan 40") {
      score += 3;
      insights.push(
        "Je werkt meer dan 40 uur per week - dit suggereert een werknemersrelatie"
      );
    } else if (data.q1 === "20-40") {
      score += 1;
      insights.push(
        "Je werkt 20-40 uur per week - let op de grens van zelfstandigheid"
      );
    }

    // q2: Client thinks you're employee
    if (data.q2 === "Ja, expliciet gezegd") {
      score += 3;
      insights.push(
        "Je opdrachtgever heeft expliciet gezegd dat je een werknemer zou moeten zijn"
      );
    } else if (data.q2 === "Ja, geïmpliceerd") {
      score += 2;
      insights.push(
        "Je opdrachtgever heeft geïmpliceerd dat je een werknemer zou moeten zijn"
      );
    }

    // q3: Client controls work method
    if (data.q3 === "Ja") {
      score += 3;
      insights.push(
        "Je opdrachtgever bepaalt hoe je je werk uitvoert - gebrek aan zelfstandigheid"
      );
    }

    // q4: Work on client premises
    if (data.q4 === "Dagelijks") {
      score += 3;
      insights.push("Je werkt dagelijks op locatie van je opdrachtgever");
    } else if (data.q4 === "Meerdere keren per week") {
      score += 2;
      insights.push(
        "Je werkt meerdere keren per week op locatie van je opdrachtgever"
      );
    }

    // q5: Use client software
    if (data.q5 === "Ja, allemaal") {
      score += 3;
      insights.push("Je gebruikt al je software van je opdrachtgever");
    } else if (data.q5 === "Ja, gedeeltelijk") {
      score += 2;
      insights.push("Je gebruikt gedeeltelijk software van je opdrachtgever");
    }

    // q6: Fixed hourly wage
    if (data.q6 === "Ja") {
      score += 3;
      insights.push("Je hebt een vast uurloon - werknemerskenmerk");
    } else if (data.q6 === "Soms") {
      score += 1;
      insights.push("Je hebt soms een vast uurloon - let op");
    }

    // q7: Holiday pay or benefits
    if (data.q7 === "Ja") {
      score += 3;
      insights.push("Je krijgt vakantiegeld of werknemersvoordelen");
    } else if (data.q7 === "Soms") {
      score += 1;
      insights.push("Je krijgt soms werknemersvoordelen");
    }

    // q8: Required availability
    if (data.q8 === "Ja") {
      score += 3;
      insights.push("Je bent verplicht op bepaalde tijden beschikbaar te zijn");
    } else if (data.q8 === "Soms") {
      score += 1;
      insights.push("Je bent soms verplicht beschikbaar te zijn");
    }

    // q9: Client can replace you
    if (data.q9 === "Nee") {
      score += 2;
      insights.push("Je opdrachtgever kan je niet gemakkelijk vervangen");
    }

    // q10: Multiple clients
    if (data.q10 === "3 of meer") {
      score -= 2;
      insights.push(
        "Je hebt meerdere opdrachtgevers - positief voor zelfstandigheid"
      );
    } else if (data.q10 === "1-2") {
      score -= 1;
      insights.push("Je hebt 1-2 opdrachtgevers");
    }

    // q11: Set own working hours
    if (data.q11 === "Nee") {
      score += 3;
      insights.push("Je bepaalt niet zelf je werktijden");
    } else if (data.q11 === "Gedeeltelijk") {
      score += 1;
      insights.push("Je bepaalt gedeeltelijk je werktijden");
    }

    // q12: Own tools
    if (data.q12 === "Nee") {
      score += 2;
      insights.push("Je gebruikt geen eigen gereedschappen");
    } else if (data.q12 === "Gedeeltelijk") {
      score += 1;
      insights.push("Je gebruikt gedeeltelijk eigen gereedschappen");
    }

    // q13: Chamber of Commerce registration
    if (data.q13 === "Ja, als eenmanszaak" || data.q13 === "Ja, als BV") {
      score -= 1;
      insights.push("Je bent ingeschreven bij de Kamer van Koophandel");
    }

    // q14: Own website/profile
    if (data.q14 === "Ja") {
      score -= 1;
      insights.push("Je hebt een eigen website of profiel als zelfstandige");
    }

    // q15: Experience as freelancer
    if (data.q15 === "Meer dan 3 jaar") {
      score -= 2;
      insights.push("Je werkt al meer dan 3 jaar als zelfstandige");
    } else if (data.q15 === "1-3 jaar") {
      score -= 1;
      insights.push("Je werkt 1-3 jaar als zelfstandige");
    }

    let level = "";
    if (score >= 15) {
      level = "Potentieel hoog risico - Overweeg actie";
    } else if (score >= 8) {
      level = "Gemiddeld risico - Mogelijke aandachtspunten";
    } else {
      level = "Laag risico - Goede DBA-indicatoren";
    }

    return {
      score,
      level,
      teaserInsights: insights.slice(0, 3),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { score, level, teaserInsights } = calculateRiskScore(formData);

    // Track risk score
    trackCustomEvent("risk_score_calculated", {
      risk_score: score,
      risk_level: level,
      questions_answered: Object.keys(formData).filter(key => key !== "email" && formData[key]).length,
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
      <TestimonialSection />
      <Footer />
    </div>
  );
}

export default App;
