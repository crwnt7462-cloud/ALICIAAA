export async function safeFetch<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    console.log(`[SafeFetch] Requête vers: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    console.log(`[SafeFetch] Réponse: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log(`[SafeFetch] Données reçues:`, data);
    return data as T;
  } catch (error) {
    console.error(`[SafeFetch] Erreur pour ${url}:`, error);
    throw new Error(`Connexion échouée: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}