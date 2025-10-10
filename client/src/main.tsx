import { checkApiHealth, autoDetectApiUrl } from "@/lib/apiHealth";
// N2-AUDIT: urlParams doit être défini au top-level
const urlParams = new URLSearchParams(window.location.search);
// N2/N3-AUDIT: IMPORTS TOP-LEVEL UNIQUEMENT
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
// N2-AUDIT: auto-détection API (bloc corrigé, top-level, sans doublon)
async function initApiUrl() {
  let apiUrl = import.meta.env.VITE_API_URL;
  // ...rest of initApiUrl logic...
}

// Main render block
const container = document.getElementById("root");
if (container) {
  // Monkey-patch localStorage.setItem for 'selectedService' to auto-dispatch an event
  try {
    const _origSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key: string, value: string) {
      _origSetItem.apply(this, [key, value]);
      try {
        if (key === 'selectedService') {
          try { window.dispatchEvent(new CustomEvent('selectedServiceChanged', { detail: JSON.parse(value) })); } catch (e) { try { window.dispatchEvent(new CustomEvent('selectedServiceChanged', { detail: value })); } catch (e2) { /* ignore */ } }
        }
      } catch (e) { /* ignore */ }
    };
  } catch (e) {
    // ignore patching errors
  }

  const root = createRoot(container);
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}



