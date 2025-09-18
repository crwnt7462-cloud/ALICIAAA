import { checkApiHealth, autoDetectApiUrl } from "@/lib/apiHealth";
// N2-AUDIT: urlParams doit être défini au top-level
const urlParams = new URLSearchParams(window.location.search);
// N2/N3-AUDIT: IMPORTS TOP-LEVEL UNIQUEMENT
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import HealthCheckPage from "@/pages/HealthCheckPage";
import { ErrorBoundary } from "@/components/ErrorBoundary";
// N2-AUDIT: auto-détection API (bloc corrigé, top-level, sans doublon)
async function initApiUrl() {
  let apiUrl = import.meta.env.VITE_API_URL;
  // ...rest of initApiUrl logic...
}

// Main render block
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}



