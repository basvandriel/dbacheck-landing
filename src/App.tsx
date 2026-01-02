import React, { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { trackPageView, trackEvent, debugAnalytics } from "./utils";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ShieldCheckIcon,
  StarIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

function App() {
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track page view on component mount
  useEffect(() => {
    trackPageView("/");
    trackEvent("page_load", "view", "landing_page");
    // Debug analytics setup (remove in production)
    setTimeout(() => debugAnalytics(), 1000);
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
    trackEvent("navigation", "click", "cta_button");
  };

  const handleInputChange = (question: string, value: string) => {
    setFormData((prev) => ({ ...prev, [question]: value }));
  };

  useEffect(() => {
    // Track page view on mount
    import("./utils").then(({ trackPageView }) => {
      trackPageView(window.location.pathname + window.location.search);
    });
  }, []);

  const calculateRiskScore = (
    data: Record<string, string>
  ): {
    score: number;
    level: string;
    teaserInsights: string[];
    emailInsights: string[];
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

    // q6: Attend team meetings
    if (data.q6 === "Ja, regelmatig") {
      score += 3;
      insights.push("Je neemt regelmatig deel aan teamvergaderingen");
    } else if (data.q6 === "Ja, soms") {
      score += 1;
      insights.push("Je neemt soms deel aan teamvergaderingen");
    }

    // q7: Performance feedback
    if (data.q7 === "Ja, formeel") {
      score += 3;
      insights.push("Je krijgt formeel feedback over je prestaties");
    } else if (data.q7 === "Ja, informeel") {
      score += 2;
      insights.push("Je krijgt informeel feedback over je prestaties");
    }

    // q8: Income dependency
    if (data.q8 === "Meer dan 80%") {
      score += 3;
      insights.push("Meer dan 80% van je inkomen komt van één opdrachtgever");
    } else if (data.q8 === "50-80%") {
      score += 2;
      insights.push("50-80% van je inkomen komt van één opdrachtgever");
    }

    // q9: Non-compete agreement
    if (data.q9 === "Ja") {
      score += 3;
      insights.push("Je hebt een concurrentiebeding - dit is werknemersrecht");
    } else if (data.q9 === "Mondeling afgesproken") {
      score += 2;
      insights.push("Je hebt mondeling een concurrentiebeding afgesproken");
    }

    // q10: Tax authority correction
    if (data.q10 === "Ja") {
      score += 3;
      insights.push("Je bent al eens gecorrigeerd door de Belastingdienst");
    } else if (data.q10 === "Bijna") {
      score += 2;
      insights.push("Je bent bijna gecorrigeerd door de Belastingdienst");
    }

    // q11: Client can reject work
    if (data.q11 === "Ja, regelmatig") {
      score += 3;
      insights.push(
        "Je opdrachtgever kan je werk regelmatig corrigeren of afkeuren"
      );
    } else if (data.q11 === "Ja, soms") {
      score += 2;
      insights.push("Je opdrachtgever kan je werk soms corrigeren of afkeuren");
    }

    // q12: Client sets rates
    if (data.q12 === "Ja") {
      score += 3;
      insights.push(
        "Je opdrachtgever bepaalt je tarief - gebrek aan ondernemerschap"
      );
    }

    // q13: What happens if client stops
    if (data.q13 === "Ik moet snel nieuwe vinden") {
      score += 3;
      insights.push(
        "Als je opdracht stopt, moet je snel nieuwe klanten vinden"
      );
    } else if (data.q13 === "Ik weet het niet") {
      score += 2;
      insights.push("Je weet niet wat er gebeurt als je opdracht stopt");
    }

    // q14: Own liability insurance
    if (data.q14 === "Nee") {
      score += 2;
      insights.push("Je hebt geen eigen aansprakelijkheidsverzekering");
    } else if (data.q14 === "Via opdrachtgever") {
      score += 1;
      insights.push("Je bent verzekerd via je opdrachtgever");
    }

    // q15: Own website/portfolio
    if (data.q15 === "Nee") {
      score += 2;
      insights.push("Je hebt geen eigen website of portfolio");
    } else if (data.q15 === "In ontwikkeling") {
      score += 1;
      insights.push("Je website/portfolio is nog in ontwikkeling");
    }

    let level = "Laag risico";
    if (score >= 25) level = "Hoog risico - Onmiddellijke actie nodig";
    else if (score >= 15) level = "Gemiddeld tot hoog risico";
    else if (score >= 8) level = "Gemiddeld risico";

    // Create teaser insights (valuable but incomplete for free users)
    const teaserInsights = [];
    if (score >= 25) {
      teaserInsights.push(
        `Je risicoscore: ${score} van de 45 punten (hoog risico)`
      );
      teaserInsights.push(
        "Je loopt aanzienlijke DBA-risico's die professionele aandacht vereisen"
      );
    } else if (score >= 15) {
      teaserInsights.push(
        `Je risicoscore: ${score} van de 45 punten (gemiddeld risico)`
      );
      teaserInsights.push(
        "Er zijn enkele aandachtspunten voor je DBA-compliance"
      );
    } else {
      teaserInsights.push(
        `Je risicoscore: ${score} van de 45 punten (laag risico)`
      );
      teaserInsights.push("Je positie lijkt basaal in orde");
    }

    // Add top 3-5 red flags
    const topFlags = insights.slice(0, Math.min(5, insights.length));
    if (topFlags.length > 0) {
      teaserInsights.push(""); // empty line for spacing
      teaserInsights.push("⚠️ Belangrijkste aandachtspunten:");
      topFlags.forEach((flag) => teaserInsights.push(`• ${flag}`));
    }

    // Add general tips
    teaserInsights.push(""); // empty line for spacing
    teaserInsights.push("💡 Algemene tips om je risico te verlagen:");
    teaserInsights.push(
      "• Zorg voor schriftelijke contracten met duidelijke afspraken"
    );
    teaserInsights.push("• Beperk je afhankelijkheid van één opdrachtgever");
    teaserInsights.push("• Houd je eigen materialen en werkplek");
    teaserInsights.push("• Stel je eigen tarieven vast en onderhandel zelf");
    teaserInsights.push("• Neem deel aan commerciële acquisitie");

    return { score, level, teaserInsights, emailInsights: insights };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calculate risk score
      const { score, level, emailInsights } = calculateRiskScore(formData);

      // Send email using EmailJS
      const upsellMessage = `
Wil je échte zekerheid?
Upgrade naar onze Automatische DBA-Check voor €49:

• Directe PDF-levering met je persoonlijke actieplan
• Contract templates aangepast aan je situatie
• Concrete verbeterpunten voor elk aandachtspunt
• Implementatie checklist om compliant te worden
• Bonus: Discussie-script voor je opdrachtgever

Early bird prijs: €49 (normaal €99) – volledig automatisch, direct in je mailbox.

Voor complexe gevallen met persoonlijke contractreview en adviesgesprek: €149
Reply op deze mail als je dit wilt, dan stuur ik een betaallink.`;

      const templateParams = {
        to_email: formData.email,
        risk_score: score,
        risk_level: level,
        insights: emailInsights.join("\n• "),
        form_data: JSON.stringify(formData, null, 2),
        upsell_message: upsellMessage,
      };

      await emailjs.send(
        "service_your_service_id", // You'll need to set this up in EmailJS
        "template_your_template_id", // You'll need to create a template
        templateParams,
        "your_public_key" // You'll need to get this from EmailJS
      );

      console.log("Form submitted successfully:", {
        score,
        level,
        emailInsights,
      });

      // Track successful form submission
      trackEvent("form", "submit", "dba_check", score);
    } catch (error) {
      console.error("Error submitting form:", error);
      // For now, still show success even if email fails
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const questions = [
    {
      id: "q1",
      text: "Hoeveel uur werk je gemiddeld per week voor je grootste opdrachtgever?",
      options: ["Minder dan 20", "20-40", "Meer dan 40", "Varieert sterk"],
    },
    {
      id: "q2",
      text: "Is je opdrachtgever ooit van mening geweest dat je eigenlijk een werknemer zou moeten zijn?",
      options: [
        "Ja, expliciet gezegd",
        "Ja, geïmpliceerd",
        "Nee",
        "Weet ik niet",
      ],
    },
    {
      id: "q3",
      text: "Bepalen je opdrachtgevers hoe je je werk uitvoert?",
      options: ["Ja", "Nee", "Soms", "Niet van toepassing"],
    },
    {
      id: "q4",
      text: "Werk je regelmatig op de locatie van je opdrachtgever?",
      options: ["Dagelijks", "Meerdere keren per week", "Soms", "Nooit"],
    },
    {
      id: "q5",
      text: "Gebruik je de software/licenties van je opdrachtgever?",
      options: [
        "Ja, allemaal",
        "Ja, gedeeltelijk",
        "Nee, ik heb mijn eigen",
        "Niet van toepassing",
      ],
    },
    {
      id: "q6",
      text: "Neem je deel aan teamvergaderingen van je opdrachtgever?",
      options: ["Ja, regelmatig", "Ja, soms", "Nee", "Alleen als freelancer"],
    },
    {
      id: "q7",
      text: "Krijg je feedback over je prestaties van je opdrachtgever?",
      options: ["Ja, formeel", "Ja, informeel", "Nee", "Niet van toepassing"],
    },
    {
      id: "q8",
      text: "Hoeveel procent van je inkomen komt van één opdrachtgever?",
      options: ["Minder dan 50%", "50-80%", "Meer dan 80%", "Varieert"],
    },
    {
      id: "q9",
      text: "Heb je een concurrentiebeding met je opdrachtgever?",
      options: ["Ja", "Nee", "Mondeling afgesproken", "Niet van toepassing"],
    },
    {
      id: "q10",
      text: "Ben je ooit door de Belastingdienst gecorrigeerd op je DBA-status?",
      options: ["Ja", "Nee", "Bijna", "Weet ik niet"],
    },
    {
      id: "q11",
      text: "Kan je opdrachtgever je werk corrigeren of afkeuren?",
      options: ["Ja, regelmatig", "Ja, soms", "Nee", "Niet van toepassing"],
    },
    {
      id: "q12",
      text: "Bepalen je opdrachtgevers je uurtarief of dagtarief?",
      options: ["Ja", "Nee", "Onderhandelbaar", "Niet van toepassing"],
    },
    {
      id: "q13",
      text: "Wat gebeurt er met je inkomen als deze opdracht stopt?",
      options: [
        "Ik heb genoeg andere klanten",
        "Ik moet snel nieuwe vinden",
        "Ik weet het niet",
        "Niet van toepassing",
      ],
    },
    {
      id: "q14",
      text: "Heb je je eigen aansprakelijkheidsverzekering als ZZP'er?",
      options: ["Ja", "Nee", "Via opdrachtgever", "Niet nodig voor mijn werk"],
    },
    {
      id: "q15",
      text: "Heb je een eigen website of portfolio om nieuwe klanten te werven?",
      options: ["Ja", "Nee", "In ontwikkeling", "Niet nodig"],
    },
  ];

  const filledQuestions = Object.keys(formData).filter(
    (key) => key !== "email" && formData[key]
  ).length;
  const progress = (filledQuestions / questions.length) * 100;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-indigo-600 via-blue-600 to-cyan-500 py-16 px-4">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4 text-xs">
            <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
            <span className="font-medium">
              Urgent: DBA-handhaving vanaf 1 januari 2026
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            DBA-Proof in 2026?
          </h1>
          <p className="text-lg md:text-xl mb-6 opacity-90 max-w-2xl mx-auto">
            Geen waarschuwingen meer bij controles. Ontdek gratis je risico in 2
            minuten.
          </p>
          <button
            onClick={scrollToForm}
            className="group bg-white text-indigo-600 font-bold py-3 px-8 rounded-full text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mb-4"
          >
            Start Gratis Risico Check
            <ArrowRightIcon className="inline h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-xs opacity-75">
            ✓ Gratis ✓ Anoniem ✓ Direct Resultaat
          </p>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-4 px-4 bg-white border-b">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-gray-600">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-4 w-4 text-green-500 mr-2" />
              <span>AVG Compliant</span>
            </div>
            <div className="flex items-center">
              <StarIcon className="h-4 w-4 text-yellow-500 mr-2" />
              <span>4.8/5 Beoordeling</span>
            </div>
            <div className="flex items-center">
              <CheckCircleIcon className="h-4 w-4 text-blue-500 mr-2" />
              <span>Ontwikkeld door Experts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pijnpunten Sectie */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10">
            Herken je deze{" "}
            <span className="text-indigo-600">ZZP-valkuilen</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group bg-linear-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-red-200">
              <ClockIcon className="h-12 w-12 text-red-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold mb-2 text-gray-900">
                Te veel uren bij één opdrachtgever
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Meer dan 30 uur per week? Dit kan als gezagsverhouding worden
                gezien.
              </p>
            </div>
            <div className="group bg-linear-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-yellow-200">
              <ExclamationTriangleIcon className="h-12 w-12 text-yellow-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold mb-2 text-gray-900">
                Onduidelijke contracten
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Mondelinge afspraken zijn niet meer voldoende na de nieuwe
                regels.
              </p>
            </div>
            <div className="group bg-linear-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-orange-200">
              <CheckCircleIcon className="h-12 w-12 text-orange-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold mb-2 text-gray-900">
                Angst voor controles
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Vanaf 2026 worden controles strenger. Weet waar je staat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hoe het werkt Sectie */}
      <section className="py-12 px-4 bg-linear-to-br from-gray-50 to-blue-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10">
            Hoe werkt onze <span className="text-indigo-600">DBACheck</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-indigo-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">
                Beantwoord 15 vragen
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Onze vragenlijst identificeert potentiële DBA-risico's.
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-indigo-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">
                Krijg je risico-score
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Direct een rapport met je DBA-risico niveau.
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-indigo-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">
                Concrete actiepunten
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Tips om je positie te versterken.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-linear-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200">
            <div className="flex justify-center mb-3">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className="h-4 w-4 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <blockquote className="text-lg font-medium text-gray-900 mb-3">
              "Deze check heeft me geholpen om mijn contracten aan te passen
              voordat het te laat was."
            </blockquote>
            <cite className="text-sm text-gray-600">
              - Sarah K., Grafisch Ontwerper
            </cite>
          </div>
        </div>
      </section>

      {/* Formulier Sectie */}
      <section
        id="check"
        ref={formRef}
        className="py-12 px-4 bg-linear-to-br from-slate-50 to-indigo-50"
      >
        <div className="max-w-2xl mx-auto">
          {!isSubmitted ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Start je{" "}
                  <span className="text-indigo-600">Gratis DBACheck</span>
                </h2>
                <p className="text-lg text-gray-700 mb-4">
                  Beantwoord de vragen voor een persoonlijk risico-rapport
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600">
                  {filledQuestions} van {questions.length} vragen ingevuld
                </p>
              </div>
              <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
              >
                {questions.map((q, index) => (
                  <div
                    key={q.id}
                    className={`pb-6 ${
                      index < questions.length - 1
                        ? "border-b border-gray-100 mb-6"
                        : ""
                    }`}
                  >
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      {index + 1}. {q.text}
                    </label>
                    <select
                      value={formData[q.id] || ""}
                      onChange={(e) => handleInputChange(q.id, e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm bg-gray-50 focus:bg-white"
                      required
                    >
                      <option value="">Selecteer je antwoord</option>
                      {q.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                <div className="pt-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-900 mb-3"
                  >
                    Jouw e-mailadres voor het rapport
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50 focus:bg-white"
                    placeholder="naam@voorbeeld.nl"
                    required
                  />
                  <p className="text-xs text-gray-600 mt-2 mb-6">
                    We gebruiken je e-mail alleen voor het versturen van je
                    rapport.
                  </p>
                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:transform-none disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Analyseert je antwoorden...
                        </div>
                      ) : (
                        "Verstuur mijn gratis analyse"
                      )}
                    </button>
                    <p className="text-xs text-gray-600 mt-3">
                      ✓ Gratis rapport ✓ Direct in je mailbox ✓ Early bird:
                      uitgebreide automatische PDF-analyse voor €49
                    </p>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-green-200">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Bedankt voor je deelname!
              </h2>
              <p className="text-base text-gray-700 mb-4">
                Je persoonlijke DBA-risico analyse is onderweg naar{" "}
                <strong>{formData.email}</strong>
              </p>

              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200 mb-6">
                <h3 className="text-lg font-bold text-indigo-900 mb-3">
                  Wat kun je verwachten?
                </h3>
                <div className="text-left space-y-2">
                  <p className="text-sm text-indigo-700 flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Je persoonlijke risico-score (0-45 punten)
                  </p>
                  <p className="text-sm text-indigo-700 flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Top 3 aandachtspunten voor je situatie
                  </p>
                  <p className="text-sm text-indigo-700 flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Concrete verbeter-tips
                  </p>
                  <p className="text-sm text-indigo-700 flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Upgrade-optie naar professionele PDF-analyse (€49)
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                Controleer je inbox (en spam folder) voor je rapport. Het kan
                enkele minuten duren.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="font-bold text-lg mb-3">DBA-Check 2026</h3>
              <p className="text-gray-400 text-sm">
                Professionele tool voor ZZP'ers om DBA-risico's te identificeren
                en te mitigeren.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Privacy & Veiligheid</h3>
              <p className="text-gray-400 text-sm">
                Je gegevens worden AVG-compliant verwerkt en nooit gedeeld met
                derden.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Contact</h3>
              <p className="text-gray-400 text-sm">
                contact@basvandriel.nl
                <br />
                Ontwikkeld door ZZP'ers, voor ZZP'ers
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              &copy; 2026 DBACheck. Alle rechten voorbehouden.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
