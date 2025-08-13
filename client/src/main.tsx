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
    showRetryAlert(
      '⚠ Impossible de trouver l\'URL API.\nVérifie VITE_API_URL ou démarre le serveur.',
      () => initApiUrl()
    );
    return;
  }

  const connected = await tryConnect(apiUrl);
  if (!connected) {
    console.warn(`[Startup] API inaccessible à ${apiUrl}, tentative de re-détection…`);
    const detected = await autoDetectApiUrl();
    if (detected && detected !== apiUrl) {
      apiUrl = detected;
      const connected2 = await tryConnect(apiUrl);
      if (!connected2) {
        showRetryAlert(
          `⚠ Impossible de contacter l'API à ${apiUrl} (même après détection).\nVérifie que le serveur est démarré.`,
          () => initApiUrl()
        );
      }
    } else {
      showRetryAlert(
        `⚠ Impossible de contacter l'API à ${apiUrl}.\nVérifie que le serveur est démarré et accessible.`,
        () => initApiUrl()
      );
    }
  }
})();

createRoot(document.getElementById("root")!).render(<App />);
