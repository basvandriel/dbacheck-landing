import React from "react";
import { StarIcon } from "@heroicons/react/24/outline";

const TestimonialSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">
          Wat onze gebruikers zeggen
        </h2>
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className="h-5 w-5 text-yellow-400 fill-current"
              />
            ))}
          </div>
          <blockquote className="text-lg text-gray-700 mb-4 italic">
            "Deze check heeft me geholpen om mijn DBA-compliance te verbeteren.
            Ik wist niet dat ik zoveel risico liep!"
          </blockquote>
          <cite className="text-gray-600 font-medium">
            Sarah K., Grafisch Ontwerper
          </cite>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
