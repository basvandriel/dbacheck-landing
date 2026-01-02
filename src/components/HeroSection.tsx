import React from "react";
import {
  ExclamationTriangleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

interface HeroSectionProps {
  onStartCheck: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartCheck }) => {
  return (
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
          onClick={onStartCheck}
          className="group bg-white text-indigo-600 font-bold py-3 px-8 rounded-full text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mb-4"
        >
          Start Gratis Risico Check
          <ArrowRightIcon className="inline h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-xs opacity-75">
          AVG Compliant • 4.8/5 Beoordeling • Ontwikkeld door Experts
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
