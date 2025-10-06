// Utilitaires d'authentification pour l'API backend

/**
 * Récupère un token JWT Supabase valide pour l'API backend
 */
export async function getSupabaseToken(): Promise<string | null> {
  // Vérifier si on a déjà un token stocké
  const storedToken = localStorage.getItem("supabaseToken");
  if (storedToken) {
    return storedToken;
  }

  // Pour les tests/développement, récupérer un token automatiquement
  try {
    const response = await fetch('/auth/supabase-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'ag@gmail.com',
        password: 'demo123'
      })
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.access_token;
      if (token) {
        localStorage.setItem("supabaseToken", token);
        return token;
      }
    }
  } catch (error) {
    console.warn('Impossible de récupérer automatiquement le token Supabase:', error);
  }

  return null;
}

/**
 * Nettoie les tokens expirés
 */
export function clearExpiredTokens() {
  // Pour simplifier, nettoyer le token stocké après 1h
  const tokenTime = localStorage.getItem("supabaseTokenTime");
  if (tokenTime) {
    const elapsed = Date.now() - parseInt(tokenTime);
    if (elapsed > 3600000) { // 1 heure
      localStorage.removeItem("supabaseToken");
      localStorage.removeItem("supabaseTokenTime");
    }
  }
}