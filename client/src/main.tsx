import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { checkApiHealth, autoDetectApiUrl, showRetryAlert } from './lib/apiHealth';

// Auto-détection de l'URL API au démarrage avec retry
(async function initApiUrl() {
  let apiUrl = import.meta.env.VITE_API_URL;

  async function tryConnect(url: string) {
    const ok = await checkApiHealth(url);
    if (ok) {
      console.log('[Startup] API connectée avec succès.');
      (window as any).__API_URL__ = url;
      return true;
    }
    return false;
  }

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
    // En dernier recours, utiliser l'origine actuelle
    apiUrl = window.location.origin;
    (window as any).__API_URL__ = apiUrl;
    console.log('[Startup] Utilisation de l\'origine actuelle comme fallback API.');
  }

  const connected = await tryConnect(apiUrl);
  if (!connected) {
    console.warn(`[Startup] API inaccessible à ${apiUrl}, tentative de re-détection…`);
    const detected = await autoDetectApiUrl();
    if (detected && detected !== apiUrl) {
      apiUrl = detected;
      const connected2 = await tryConnect(apiUrl);
      if (!connected2) {
        console.warn(`⚠ API inaccessible à ${apiUrl} - Mode dégradé activé`);
      }
    } else {
      console.warn(`⚠ API inaccessible à ${apiUrl} - Mode dégradé activé`);
    }
  }
})();

console.log('[Avyento] client boot', import.meta.env.MODE);
createRoot(document.getElementById("root")!).render(<App />);
