import React from "react";
import {
  ClockIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const ZZPPitfalls: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Herken je deze ZZP-valkuilen?
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          Ontdek of je positie als zelfstandige in gevaar is
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <ClockIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Te veel uren bij één opdrachtgever
            </h3>
            <p className="text-gray-600">
              Meer dan 30 uur per week? Dit kan als gezagsverhouding worden
              gezien.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <DocumentTextIcon className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Onduidelijke contracten
            </h3>
            <p className="text-gray-600">
              Mondelinge afspraken zijn niet meer voldoende na de nieuwe regels.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <MagnifyingGlassIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Angst voor controles
            </h3>
            <p className="text-gray-600">
              Vanaf 2026 worden controles strenger. Weet waar je staat.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ZZPPitfalls;
