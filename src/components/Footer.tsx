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
          <p className="text-sm text-gray-500">
            © 2026 DBA-Check. Alle rechten voorbehouden. | Privacy & Veiligheid
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
