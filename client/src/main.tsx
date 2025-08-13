import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { checkApiHealth, autoDetectApiUrl } from './lib/apiHealth';

// Auto-détection de l'URL API au démarrage
(async () => {
  let apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    console.warn('[Startup] VITE_API_URL manquant, tentative d\'auto-détection…');
    const detected = await autoDetectApiUrl();
    if (detected) {
      apiUrl = detected;
      (window as any).__API_URL__ = apiUrl;
      console.log(`[Startup] API détectée automatiquement : ${apiUrl}`);
    }
  }

  if (!apiUrl) {
    console.warn('Configuration API manquante, utilisation de l\'origine actuelle comme fallback.');
    apiUrl = window.location.origin;
    (window as any).__API_URL__ = apiUrl;
  }

  const ok = await checkApiHealth(apiUrl);
  if (!ok) {
    console.warn(`[Startup] API inaccessible à ${apiUrl}, tentative d'auto-détection…`);
    const detected = await autoDetectApiUrl();
    if (detected && detected !== apiUrl) {
      apiUrl = detected;
      (window as any).__API_URL__ = apiUrl;
      console.log(`[Startup] API re-détectée : ${apiUrl}`);
      const ok2 = await checkApiHealth(apiUrl);
      if (!ok2) {
        console.error(`Impossible de contacter l'API à ${apiUrl} (auto-détection échouée).`);
      }
    } else {
      console.error(`Impossible de contacter l'API à ${apiUrl}`);
    }
  } else {
    console.log('[Startup] API connectée avec succès.');
  }
})();

createRoot(document.getElementById("root")!).render(<App />);
