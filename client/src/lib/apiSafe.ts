import { safeFetch } from './safeFetch';
import type { Salon, Service } from '../types';

// En mode développement, utiliser l'URL par défaut du serveur local
const BASE = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || 'http://localhost:5000';

function assertBase() {
  // Plus d'erreur, on utilise toujours l'URL par défaut si pas définie
  return BASE;
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