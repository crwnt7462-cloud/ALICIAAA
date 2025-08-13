import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSalonResolvedBySlug, getServicesForSalon } from '../lib/apiSafe';
import type { Salon, Service } from '../types';

function extractSlugFromPath(): string | undefined {
  // essaie de trouver un segment /salon-booking/:slug ou dernier segment non vide
  const path = location.pathname.replace(/\/+$/, '');
  const parts = path.split('/').filter(Boolean);
  const idx = Math.max(parts.lastIndexOf('salon-booking'), parts.lastIndexOf('booking'));
  if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
  return parts[parts.length - 1];
}

export function useSalonLoader() {
  const requestedSlug = useMemo(() => extractSlugFromPath(), []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`[SalonLoader] Chargement salon: ${requestedSlug}`);
      
      const s = await getSalonResolvedBySlug(requestedSlug ?? 'barbier-gentleman-marais');
      console.log(`[SalonLoader] Salon récupéré:`, s);
      
      // si le backend a résolu un autre salon (fallback), rediriger vers l'ID canonique
      if (requestedSlug && s.id && requestedSlug !== s.id) {
        const url = location.pathname.replace(requestedSlug, s.id);
        history.replaceState(null, '', url + location.search);
      }
      setSalon(s);
      
      console.log(`[SalonLoader] Chargement services pour salon: ${s.id}`);
      const svc = await getServicesForSalon(s.id);
      console.log(`[SalonLoader] Services récupérés:`, svc);
      setServices(svc);
    } catch (e: any) {
      console.error(`[SalonLoader] Erreur:`, e);
      setError(`Erreur de chargement: ${e?.message ?? 'Problème de connexion'}`);
    } finally {
      setLoading(false);
    }
  }, [requestedSlug]);

  useEffect(() => { load(); }, [load]);

  return { loading, error, salon, services, retry: load };
}