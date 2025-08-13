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
      const s = await getSalonResolvedBySlug(requestedSlug ?? 'salon-default');
      // si le backend a résolu un autre salon (fallback), rediriger vers l'ID canonique
      if (requestedSlug && s.id && requestedSlug !== s.id) {
        const url = location.pathname.replace(requestedSlug, s.id);
        history.replaceState(null, '', url + location.search);
      }
      setSalon(s);
      const svc = await getServicesForSalon(s.id);
      setServices(svc);
    } catch (e: any) {
      setError(e?.message ?? 'Erreur');
    } finally {
      setLoading(false);
    }
  }, [requestedSlug]);

  useEffect(() => { load(); }, [load]);

  return { loading, error, salon, services, retry: load };
}