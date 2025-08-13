import { safeFetch } from './safeFetch';
import type { Salon, Service } from '../types';

// Configuration API avec auto-détection ou URL manuelle
function getApiBase(): string {
  // Essayer les sources dans l'ordre de priorité
  const sources = [
    (window as any).__API_URL__,
    import.meta.env.VITE_API_URL,
    window.location.origin, // Fallback sur l'origine actuelle
    'http://localhost:5000'  // Dernier recours
  ];
  
  for (const source of sources) {
    if (source && typeof source === 'string') {
      return source.replace(/\/+$/, '');
    }
  }
  
  return window.location.origin;
}

function assertBase() {
  return getApiBase();
}

export async function getSalonResolvedBySlug(slugOrId: string): Promise<Salon> {
  const baseUrl = assertBase();
  // côté serveur, /api/salons/by-slug/:slug renvoie le salon correspondant ou le salon par défaut (fallback)
  const data = await safeFetch<Salon>(`${baseUrl}/api/salons/by-slug/${encodeURIComponent(slugOrId)}`);
  // Normalisation minimale
  return {
    id: String((data as any)?.slug ?? (data as any)?.id ?? 'salon-default'),
    name: String((data as any)?.name ?? 'Salon Démo'),
    description: (data as any)?.description ?? null,
    address: (data as any)?.address ?? null,
  };
}

export async function getServicesForSalon(salonId: string): Promise<Service[]> {
  const baseUrl = assertBase();
  try {
    const list = await safeFetch<any[]>(`${baseUrl}/api/services?salonId=${encodeURIComponent(salonId)}`);
    return Array.isArray(list)
      ? list.map((s) => ({
          id: String(s?.id ?? crypto.randomUUID()),
          salonId: String(s?.salonId ?? salonId),
          name: String(s?.name ?? 'Service'),
          price: Number.isFinite(+s?.price) ? +s.price : 0,
        }))
      : [];
  } catch (e) {
    // Si pas de services, retourner liste vide plutôt qu'erreur
    return [];
  }
}