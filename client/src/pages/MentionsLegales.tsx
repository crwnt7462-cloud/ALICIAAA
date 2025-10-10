import { useEffect } from "react";

export default function MentionsLegales() {
  useEffect(() => {
    document.title = "Mentions légales - Avyento";
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Mentions légales</h1>
      <div className="space-y-3 text-gray-700">
        <p><strong>Éditeur</strong>: Avyento SAS — 10 rue Exemple, 75000 Paris — contact@avyento.com</p>
        <p><strong>RCS/SIREN</strong>: 000 000 000 — Directeur de la publication: A. Del</p>
        <p><strong>Hébergeur</strong>: Vercel Inc. — 440 N Barranca Ave #4133, Covina, CA 91723, USA</p>
        <p><strong>Propriété intellectuelle</strong>: Le contenu de ce site est protégé. Toute reproduction est interdite sans autorisation.</p>
      </div>
    </div>
  );
}


