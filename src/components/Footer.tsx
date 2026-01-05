import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-2xl font-bold mb-4">DBA-Check 2026</h3>
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
          Professionele tool voor ZZP'ers om DBA-compliance te controleren.
          Ontwikkeld met zorg voor de Nederlandse markt.
        </p>
        <div className="border-t border-gray-800 pt-6">
          <div className="mb-6 max-w-3xl mx-auto">
            <h4 className="text-lg font-semibold mb-3 text-gray-200">
              Privacy & Cookies
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              We verzamelen je e-mailadres en antwoorden alleen om je rapport te
              sturen (max 30 dagen bewaard). De site gebruikt Google Analytics
              met geanonimiseerde IP-adressen om bezoek te meten – geen
              marketingcookies. Geen gegevens worden gedeeld met derden. Vragen?
              Mail naar{" "}
              <a
                href="mailto:contact@basvandriel.nl"
                className="text-indigo-400 hover:text-indigo-300 underline"
              >
                contact@basvandriel.nl
              </a>
            </p>
          </div>
          <div className="mb-6 max-w-3xl mx-auto">
            <h4 className="text-lg font-semibold mb-3 text-gray-200">
              Over deze tool
            </h4>
            <p className="text-sm text-gray-400">
              Dit is een ontwikkelversie voor validatie. De resultaten geven een
              indicatieve inschatting en zijn nog geen vervanging voor juridisch
              advies.
            </p>
          </div>
          <p className="text-sm text-gray-500">
            © 2026 DBA-Check. Alle rechten voorbehouden. | Privacy & Veiligheid
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
