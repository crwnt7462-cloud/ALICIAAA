/**
 * Utilitaires pour vérifier la santé de l'API et auto-détecter l'URL
 */

export async function checkApiHealth(apiUrl: string): Promise<boolean> {
  try {
    const cleanUrl = apiUrl.replace(/\/+$/, '');
    const res = await fetch(`${cleanUrl}/health`, { method: 'GET' });
    if (!res.ok) return false;
    const json = await res.json().catch(() => null);
    return Boolean(json && (json.ok === true || json.status === 'ok'));
  } catch {
    return false;
  }
}

export async function autoDetectApiUrl(): Promise<string | null> {
  try {
    const host = location.hostname;
    // Cas Replit
    if (host.includes('repl.co')) {
      const candidate = `${location.protocol}//${host}`;
      const ok = await checkApiHealth(candidate);
      if (ok) return candidate;
    }
    // Cas localhost
    const localhostUrl = 'http://localhost:3000';
    const okLocal = await checkApiHealth(localhostUrl);
    if (okLocal) return localhostUrl;
  } catch {
    return null;
  }
  return null;
}

export function showRetryAlert(message: string, retryFn: () => void) {
  const retry = confirm(`${message}\n\nVoulez-vous réessayer ?`);
  if (retry) retryFn();
}