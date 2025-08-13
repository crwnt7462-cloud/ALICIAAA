/**
 * Utilitaires pour vérifier la santé de l'API et auto-détecter l'URL
 */

export async function checkApiHealth(apiUrl: string): Promise<boolean> {
  try {
    const response = await fetch(`${apiUrl}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Timeout de 5 secondes
      signal: AbortSignal.timeout(5000)
    });
    
    return response.ok;
  } catch (error) {
    console.warn(`[API Health] Échec de connexion à ${apiUrl}:`, error);
    return false;
  }
}

export async function autoDetectApiUrl(): Promise<string | null> {
  // Heuristique simple : détecter l'URL correcte selon l'environnement
  try {
    const host = location.hostname;
    
    // Si on est sur une preview Replit (ex: myapp.username.repl.co)
    if (host.includes('repl.co')) {
      // On suppose que l'API est sur la même base
      const candidate = `${location.protocol}//${host}`;
      const ok = await checkApiHealth(candidate);
      if (ok) return candidate;
    }
    
    // Si on est en développement local, l'API est généralement sur le même host avec Vite
    if (host === 'localhost' || host === '127.0.0.1') {
      const currentOrigin = window.location.origin;
      const ok = await checkApiHealth(currentOrigin);
      if (ok) return currentOrigin;
      
      // Fallback sur port 5000 explicite
      const localhostUrl = 'http://localhost:5000';
      const okLocal = await checkApiHealth(localhostUrl);
      if (okLocal) return localhostUrl;
    }
    
    // Pour les autres cas, essayer l'origine actuelle
    const currentOrigin = window.location.origin;
    const ok = await checkApiHealth(currentOrigin);
    if (ok) return currentOrigin;
    
  } catch {
    return null;
  }
  return null;
}