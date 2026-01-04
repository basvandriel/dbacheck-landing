import React from "react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface ComplianceFormProps {
  formData: Record<string, string>;
  onInputChange: (question: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

const questions = [
  {
    id: "q1",
    text: "Hoeveel uur per week werk je gemiddeld voor deze opdrachtgever?",
    options: ["Minder dan 20", "20-40", "Meer dan 40"],
  },
  {
    id: "q2",
    text: "Heeft je opdrachtgever ooit gezegd of geïmpliceerd dat je een werknemer zou moeten zijn?",
    options: ["Nee", "Ja, geïmpliceerd", "Ja, expliciet gezegd"],
  },
  {
    id: "q3",
    text: "Bepaalt je opdrachtgever hoe je je werk uitvoert?",
    options: ["Nee", "Soms", "Ja"],
  },
  {
    id: "q4",
    text: "Hoe vaak werk je op de locatie van je opdrachtgever?",
    options: ["Nooit", "Soms", "Meerdere keren per week", "Dagelijks"],
  },
  {
    id: "q5",
    text: "Gebruik je software/materialen van je opdrachtgever?",
    options: ["Nee", "Ja, gedeeltelijk", "Ja, allemaal"],
  },
  {
    id: "q6",
    text: "Heb je een vast uurloon?",
    options: ["Nee", "Soms", "Ja"],
  },
  {
    id: "q7",
    text: "Krijg je vakantiegeld of andere werknemersvoordelen?",
    options: ["Nee", "Soms", "Ja"],
  },
  {
    id: "q8",
    text: "Ben je verplicht om op bepaalde tijden beschikbaar te zijn?",
    options: ["Nee", "Soms", "Ja"],
  },
  {
    id: "q9",
    text: "Kan je opdrachtgever je vervangen door iemand anders?",
    options: ["Ja", "Moeilijk", "Nee"],
  },
  {
    id: "q10",
    text: "Heb je meerdere opdrachtgevers tegelijk?",
    options: ["Nee", "1-2", "3 of meer"],
  },
  {
    id: "q11",
    text: "Bepaal je zelf je werktijden?",
    options: ["Ja", "Gedeeltelijk", "Nee"],
  },
  {
    id: "q12",
    text: "Gebruik je je eigen gereedschappen?",
    options: ["Ja", "Gedeeltelijk", "Nee"],
  },
  {
    id: "q13",
    text: "Ben je ingeschreven bij de Kamer van Koophandel?",
    options: ["Nee", "Ja, als eenmanszaak", "Ja, als BV"],
  },
  {
    id: "q14",
    text: "Heb je een eigen website/profiel als zelfstandige?",
    options: ["Nee", "Ja"],
  },
  {
    id: "q15",
    text: "Hoe lang werk je al als zelfstandige?",
    options: ["Minder dan 1 jaar", "1-3 jaar", "Meer dan 3 jaar"],
  },
];

const ComplianceForm: React.FC<ComplianceFormProps> = ({
  formData,
  onInputChange,
  onSubmit,
  isSubmitting,
  isSubmitted,
}) => {
  const filledQuestions = Object.keys(formData).filter(
    (key) => key !== "email" && formData[key]
  ).length;
  const progress = (filledQuestions / questions.length) * 100;

  if (isSubmitted) {
    return (
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Bedankt voor je inzending!
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Je persoonlijke DBA-analyse is onderweg naar{" "}
            <strong>{formData.email}</strong>.
          </p>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Wat gebeurt er nu?
            </h3>
            <div className="text-left space-y-3">
              <p className="flex items-center text-gray-700">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                Controleer je inbox (en spam folder)
              </p>
              <p className="flex items-center text-gray-700">
                <ClockIcon className="h-5 w-5 text-blue-500 mr-3 shrink-0" />
                Analyse wordt binnen 5 minuten verzonden
              </p>
              <p className="flex items-center text-gray-700">
                <ExclamationTriangleIcon className="h-5 w-5 text-orange-500 mr-3 shrink-0" />
                Upgrade naar professionele PDF-analyse (€49)
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            DBA Compliance Check
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Beantwoord de volgende vragen om een DBA-risico te bepalen.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 mr-3 mt-0.5 shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">
                  Conceptversie - Geen juridisch advies
                </p>
                <p>
                  Dit is een ontwikkelversie voor business validatie. De
                  resultaten geven een indicatieve inschatting en zijn geen
                  vervanging voor professioneel advies. AVG-compliance volgt in
                  de definitieve versie.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {filledQuestions} van {questions.length} vragen ingevuld
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progress)}% compleet
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-8" role="form">
          {questions.map((question, index) => (
            <div key={question.id} className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {index + 1}. {question.text}
              </h3>
              <div className="space-y-3" role="radiogroup">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      checked={formData[question.id] === option}
                      onChange={(e) =>
                        onInputChange(question.id, e.target.value)
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-linear-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
            <label
              htmlFor="email"
              className="text-lg font-bold text-indigo-900 mb-3"
            >
              Jouw e-mailadres
            </label>
            <p className="text-sm text-indigo-700 mb-4">
              Hiernaartoe sturen we je persoonlijke DBA-analyse.
            </p>
            <input
              type="email"
              id="email"
              placeholder="voorbeeld@email.nl"
              value={formData.email || ""}
              onChange={(e) => onInputChange("email", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-4"
              required
            />
            <div className="text-left space-y-2">
              <p className="text-sm text-indigo-700 flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                Je persoonlijke risico-score (0-45 punten)
              </p>
              <p className="text-sm text-indigo-700 flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                Top 3 aandachtspunten voor je situatie
              </p>
              <p className="text-sm text-indigo-700 flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                Concrete verbeter-tips
              </p>
              <p className="text-sm text-indigo-700 flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                Upgrade naar professionele PDF-analyse (€49)
              </p>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting || !formData.email}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-12 rounded-lg text-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Verzenden..." : "Verstuur Mijn Gratis Analyse"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ComplianceForm;
