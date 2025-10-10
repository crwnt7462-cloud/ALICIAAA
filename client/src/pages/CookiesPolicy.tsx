import { useEffect } from "react";

export default function CookiesPolicy() {
  useEffect(() => {
    document.title = "Politique des cookies - Avyento";
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Politique des cookies</h1>
      <p className="text-gray-700 mb-4">
        Cette page explique comment nous utilisons les cookies et technologies similaires pour améliorer votre expérience.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Qu'est-ce qu'un cookie ?</h2>
      <p className="text-gray-700 mb-4">
        Un cookie est un petit fichier texte stocké sur votre appareil pour mémoriser vos préférences et améliorer la navigation.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Types de cookies utilisés</h2>
      <ul className="list-disc pl-6 text-gray-700 space-y-1">
        <li>Cookies strictement nécessaires (authentification, sécurité)</li>
        <li>Cookies de préférence (langue, paramètres)</li>
        <li>Cookies de performance (statistiques anonymes)</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">Gestion du consentement</h2>
      <p className="text-gray-700 mb-4">
        Vous pouvez accepter ou refuser les cookies depuis le bandeau d'information. Vous pouvez également les gérer via les paramètres de votre navigateur.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
      <p className="text-gray-700">Pour toute question, contactez-nous à support@avyento.com.</p>
    </div>
  );
}


