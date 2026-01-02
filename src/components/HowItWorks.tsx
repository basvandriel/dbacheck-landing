import React from "react";
import {
  ClipboardDocumentListIcon,
  ChartBarIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Hoe werkt onze DBACheck?
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          In 3 eenvoudige stappen naar DBA-zekerheid
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-indigo-600">1</span>
            </div>
            <ClipboardDocumentListIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Beantwoord 15 vragen
            </h3>
            <p className="text-gray-600">
              Onze vragenlijst identificeert potentiële DBA-risico's.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-indigo-600">2</span>
            </div>
            <ChartBarIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Krijg je risico-score
            </h3>
            <p className="text-gray-600">
              Direct een rapport met je DBA-risico niveau.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-indigo-600">3</span>
            </div>
            <LightBulbIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Concrete actiepunten
            </h3>
            <p className="text-gray-600">Tips om je positie te versterken.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
