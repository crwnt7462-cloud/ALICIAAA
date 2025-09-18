// N2/N3-AUDIT: utilitaires audit/overlay/watchdog

export function showAuditBanner(message: string): void {
  if (typeof document === "undefined") return;
  let el = document.getElementById("n2-audit-banner");
  if (!el) {
    el = document.createElement("div");
    el.id = "n2-audit-banner";
    el.style.position = "fixed";
    el.style.top = "0";
    el.style.left = "0";
    el.style.width = "100vw";
    el.style.zIndex = "99999";
    el.style.background = "#ffefef";
    el.style.color = "#b00";
    el.style.fontWeight = "bold";
    el.style.fontSize = "18px";
    el.style.padding = "12px 24px";
    el.style.textAlign = "center";
    document.body.appendChild(el);
  }
  el.textContent = `[AUDIT] ${message}`;
}

export function shouldShowHealth(urlParams: URLSearchParams): boolean {
  return import.meta.env.VITE_HEALTHCHECK === "1" || urlParams.has("health");
}

export function bootAuditMarks(label: string): void {
  if (typeof console !== "undefined") {
    console.log(`[AUDIT] ${label}`);
  }
}

export function installGlobalAuditHandlers(opts?: { enableOverlay?: boolean }): void {
  if (typeof window === "undefined") return;
  if ((window as any).__AUDIT_HANDLERS_INSTALLED) return;
  (window as any).__AUDIT_HANDLERS_INSTALLED = true;
  let firstError: string | null = null;
  function showOverlay(msg: string) {
    if (!opts?.enableOverlay) return;
    if (typeof document === "undefined") return;
    if (document.getElementById("n3-audit-overlay")) return;
    const overlay = document.createElement("div");
    overlay.id = "n3-audit-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.background = "#b00";
    overlay.style.color = "#fff";
    overlay.style.zIndex = "999999";
    overlay.style.fontSize = "16px";
    overlay.style.fontWeight = "bold";
    overlay.style.padding = "12px 24px";
    overlay.style.boxShadow = "0 2px 8px rgba(0,0,0,0.12)";
    overlay.textContent = `[AUDIT] ${msg}`;
    document.body.appendChild(overlay);
  }
  window.onerror = function(msg, src, line, col, err) {
    if (!firstError) {
      firstError = `[AUDIT onerror] ${msg} @${src}:${line}:${col}`;
      showAuditBanner(firstError);
      showOverlay(firstError);
    }
    if (typeof console !== "undefined") {
      console.error("[AUDIT onerror]", { msg, src, line, col, err });
    }
  };
  window.onunhandledrejection = function(event) {
    const msg = `[AUDIT unhandledrejection] ${String(event?.reason ?? event)}`;
    if (!firstError) {
      firstError = msg;
      showAuditBanner(firstError);
      showOverlay(firstError);
    }
    if (typeof console !== "undefined") {
      console.error("[AUDIT unhandledrejection]", event?.reason ?? event);
    }
  };
}
