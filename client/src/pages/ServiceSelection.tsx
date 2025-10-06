import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useBookingWizard from '@/hooks/useBookingWizard';

interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category?: string;
  requiresDeposit: boolean;
  depositPercentage: number;
}

export default function ServiceSelection() {
  const [location, setLocation] = useLocation();
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const { setSelectedService: setWizardService, shouldRequirePro } = useBookingWizard();

  // Récupération dynamique des services depuis l'API
  // 1) tenter d'extraire le slug depuis l'URL via wouter/location
  // 2) fallback vers sessionStorage('salonSlug')
  // Si trouvé dans l'URL, on synchronise sessionStorage
  const urlMatch = typeof location === 'string' ? location.match(/^\/salon\/([^/]+)/) : null;
  const urlSlug = urlMatch ? urlMatch[1] : null;
  const sessionSlug = typeof window !== 'undefined' ? sessionStorage.getItem('salonSlug') : null;
  let slug = urlSlug || sessionSlug || null;
  // If we still don't have a slug, try to derive it from cached public payloads
  if (!slug && typeof window !== 'undefined') {
    try {
      const raw = sessionStorage.getItem('publicSalonPayload') || localStorage.getItem('salonPayload');
      if (raw) {
        const parsed = JSON.parse(raw);
        slug = parsed?.slug || parsed?.salon?.slug || parsed?.salon?.id || parsed?.id || slug;
        if (slug && typeof window !== 'undefined') sessionStorage.setItem('salonSlug', String(slug));
      }
    } catch (e) {
      // ignore malformed payloads
    }
  }
  if (urlSlug && typeof window !== 'undefined') {
    try { sessionStorage.setItem('salonSlug', urlSlug); } catch (e) { /* ignore */ }
  }

  const queryClient = useQueryClient();
  const { data: servicesData, isLoading, refetch } = useQuery({
    queryKey: ['public-salon', slug],
    queryFn: async () => {
      if (!slug) {
        // no slug: avoid throwing, return empty payload
        console.warn('service_selection_fetch_err_no_slug');
        return { salon: null };
      }
      try {
        const res = await fetch(`/api/public/salon/${slug}`);
        if (!res.ok) {
          console.warn('service_selection_fetch_err', { slug });
          return { salon: null };
        }
        const json = await res.json();
        if (json && json.salon && !Array.isArray(json.salon.services)) {
          // API returned a salon but no services array
          console.log('service_selection_fetch_ok_missing_services', { slug });
        }
        console.log('service_selection_fetch_ok', { slug });
        return json;
      } catch (err) {
        console.warn('service_selection_fetch_err', { slug });
        return { salon: null };
      }
    },
    enabled: !!slug,
    // small stale time to avoid excessive refetches in UI
    staleTime: 1000 * 30
  });

  // Listen for 'services-sync' broadcast and refetch services, log refetch
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    let storageListener: ((e: StorageEvent) => void) | null = null;
    const win: Window = window;
    const doRefetch = () => {
      console.log('services_refetch slug=' + (slug || 'none'));
      refetch();
    };
    if ('BroadcastChannel' in win) {
      channel = new BroadcastChannel('services-sync');
      channel.onmessage = (event) => {
        doRefetch();
      };
    } else {
      // Fallback for browsers without BroadcastChannel
      storageListener = (e: StorageEvent) => {
        if (e.key === 'services-sync' && e.newValue) {
          doRefetch();
        }
      };
      win.addEventListener('storage', storageListener);
    }
    return () => {
      if (channel) channel.close();
      if (storageListener) win.removeEventListener('storage', storageListener);
    };
  }, [refetch, slug]);

  // Mapping robuste des services (plus de N/A)
  // Map services from the public salon payload. Be tolerant to missing fields.
  const services: Service[] = Array.isArray((servicesData as any)?.salon?.services)
    ? (servicesData as any).salon.services.map((svc: any) => ({
        id: svc.id || svc.serviceId || svc.service_id || 0,
        name: svc.name || svc.service_name || '',
        price: svc.price || svc.effective_price || 0,
        duration: svc.duration || svc.effective_duration || 0,
        description: svc.description || '',
        requiresDeposit: svc.requiresDeposit || svc.requires_deposit || false,
        depositPercentage: svc.depositPercentage || svc.deposit_percentage || 30,
      }))
    : [];

  // Try to read a previously selected service from localStorage for fallback display
  const [savedServiceFromStorage, setSavedServiceFromStorage] = useState<any>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('selectedService') : null;
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return {
        id: parsed.id || parsed.serviceId || parsed.service_id || null,
        name: parsed.name || parsed.nom || parsed.service_name || 'Service sauvegardé',
        price: parsed.price ?? parsed.amount ?? (parsed.price_cents ? parsed.price_cents / 100 : null),
        duration: parsed.duration || parsed.length || null,
        raw: parsed
      };
    } catch (e) {
      return null;
    }
  });

  const readSavedServiceFromStorage = () => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('selectedService') : null;
      if (!raw) {
        setSavedServiceFromStorage(null);
        return;
      }
      const parsed = JSON.parse(raw);
      setSavedServiceFromStorage({
        id: parsed.id || parsed.serviceId || parsed.service_id || null,
        name: parsed.name || parsed.nom || parsed.service_name || 'Service sauvegardé',
        price: parsed.price ?? parsed.amount ?? (parsed.price_cents ? parsed.price_cents / 100 : null),
        duration: parsed.duration || parsed.length || null,
        raw: parsed
      });
    } catch (e) {
      setSavedServiceFromStorage(null);
    }
  };

  // If services are empty, try to hydrate a more detailed saved service by id
  const [hydratedSavedService, setHydratedSavedService] = useState<any>(null);
  useEffect(() => {
    if (services.length > 0) return; // only run when API returned nothing
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('selectedService') : null;
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed) return;
      // If parsed contains name/price already, use it
      if (parsed.name || parsed.price || parsed.duration) {
        setHydratedSavedService(parsed);
        return;
      }
      const svcId = parsed.id || parsed.serviceId || parsed.service_id;
      if (!svcId) return;

      // Try cached payloads first
      const cachedRaw = sessionStorage.getItem('publicSalonPayload') || localStorage.getItem('salonPayload');
      if (cachedRaw) {
        try {
          const payload = JSON.parse(cachedRaw);
          const list = payload?.salon?.services || payload?.services || payload?.salon?.data?.services || null;
          if (Array.isArray(list)) {
            const found = list.find((s: any) => String(s.id) === String(svcId) || String(s.serviceId) === String(svcId));
            if (found) {
              const normalized = {
                id: found.id ?? found.serviceId ?? svcId,
                name: found.name ?? found.nom ?? found.title ?? 'Service sauvegardé',
                price: found.price ?? found.amount ?? (found.price_cents ? found.price_cents / 100 : null),
                duration: found.duration ?? found.length ?? null,
                raw: found
              };
              setHydratedSavedService(normalized);
              return;
            }
          }
        } catch (e) { /* ignore */ }
      }

      // Try fetching the service by id from public endpoints
      (async () => {
        const candidateUrls = [`/api/services/${svcId}`, `/api/salon-services/${svcId}`];
        for (const url of candidateUrls) {
          try {
            const res = await fetch(url);
            if (!res.ok) continue;
            const json = await res.json();
            const svc = json?.service || json?.data || json || null;
            if (svc && (svc.id || svc.serviceId || svc.service_id)) {
              const normalized = {
                id: svc.id ?? svc.serviceId ?? svc.service_id ?? svcId,
                name: svc.name ?? svc.nom ?? svc.title ?? 'Service sauvegardé',
                price: svc.price ?? svc.amount ?? (svc.price_cents ? svc.price_cents / 100 : null),
                duration: svc.duration ?? svc.length ?? null,
                raw: svc
              };
              setHydratedSavedService(normalized);
              return;
            }
          } catch (e) { /* ignore */ }
        }
      })();
    } catch (e) { /* ignore */ }
  }, [services.length]);

  // Listen for selectedService changes from other pages/tabs or same-tab custom events
  useEffect(() => {
    const storageHandler = (e: StorageEvent) => {
      if (!e.key) return;
      if (e.key === 'selectedService') {
        try {
          readSavedServiceFromStorage();
        } catch (err) { /* ignore */ }
      }
    };
    const svcListener = (ev: any) => {
      try {
        // ev.detail should contain the normalized service
        if (ev?.detail) setSavedServiceFromStorage(ev.detail);
        else readSavedServiceFromStorage();
      } catch (err) { /* ignore */ }
    };

    window.addEventListener('storage', storageHandler);
    window.addEventListener('selectedServiceChanged', svcListener as EventListener);

    // on mount ensure we have the latest value
    readSavedServiceFromStorage();

    // Fallback: some users run console scripts that write localStorage without dispatching events.
    // Poll briefly (1s window) to catch same-tab writes and update the UI.
  let pollTimer: number | null = null;
  let lastRaw: string | null = null;
    try { lastRaw = typeof window !== 'undefined' ? localStorage.getItem('selectedService') : null; } catch (e) { lastRaw = null; }
  let polls = 0;
    pollTimer = (setInterval(() => {
      try {
        const current = localStorage.getItem('selectedService');
        if (current !== lastRaw) {
          lastRaw = current;
          readSavedServiceFromStorage();
        }
      } catch (e) { /* ignore */ }
      polls += 1;
      if (polls > 6) { // stop after ~3 seconds
        if (pollTimer) clearInterval(pollTimer as unknown as number);
      }
    }, 500) as unknown) as number;

    return () => {
      window.removeEventListener('storage', storageHandler);
      window.removeEventListener('selectedServiceChanged', svcListener as EventListener);
      if (pollTimer) clearInterval(pollTimer);
    };
  }, []);

  // Re-read storage when the tab becomes visible/focused (covers console edits without events)
  useEffect(() => {
    const onVis = () => { readSavedServiceFromStorage(); };
    window.addEventListener('visibilitychange', onVis);
    window.addEventListener('focus', onVis);
    return () => {
      window.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('focus', onVis);
    };
  }, []);

  const displaySaved = hydratedSavedService || savedServiceFromStorage;

  // Final fallback: if no saved service, try to pick the first service from cached publicSalonPayload
  const payloadFirstService = React.useMemo(() => {
    try {
      const raw = sessionStorage.getItem('publicSalonPayload') || localStorage.getItem('salonPayload');
      if (!raw) return null;
      const payload = JSON.parse(raw);
      const list = payload?.salon?.services || payload?.services || null;
      if (Array.isArray(list) && list.length > 0) {
        const s = list[0];
        return {
          id: s.id ?? s.serviceId ?? s.service_id ?? null,
          name: s.name ?? s.nom ?? s.title ?? 'Service',
          price: s.price ?? s.amount ?? (s.price_cents ? s.price_cents / 100 : null),
          duration: s.duration ?? s.length ?? null,
          raw: s
        };
      }
    } catch (e) { /* ignore */ }
    return null;
  }, []);

  const displayPrimary = displaySaved || payloadFirstService;

  const handleSavedServiceSelect = (saved: any) => {
    if (!saved || !saved.id) return;
    const id = saved.id;
    setSelectedService(id);
    const full = saved.raw || saved;
    // normalize similarly to handleServiceSelect
    const normalize = (s: any) => {
      const id = s.id || s.serviceId || s.service_id;
      let price = s.price ?? s.amount ?? s.effective_price ?? s.price_cents ?? s.cost;
      if (typeof price === 'number' && price > 1000) price = price / 100;
      if (typeof price === 'string' && price.match(/^\d+$/)) price = parseFloat(price) / 100;
      const duration = s.duration || s.effective_duration || s.length || null;
      return { id, name: s.name || s.service_name || s.title || 'Service', price: price ?? null, duration, raw: s };
    };
    const normalized = normalize(full);
    try { setWizardService(id, normalized); } catch (e) { /* ignore */ }
    try { localStorage.setItem('selectedService', JSON.stringify(normalized)); } catch (e) { /* ignore */ }
    try { window.dispatchEvent(new CustomEvent('selectedServiceChanged', { detail: normalized })); } catch (e) { /* ignore */ }
    try {
      const requiresPro = shouldRequirePro(full);
      if (requiresPro && import.meta.env.VITE_BOOKING_REQUIRE_PRO !== 'false') {
        setLocation('/professional-selection');
      } else {
        setLocation('/booking-datetime');
      }
    } catch (e) { /* ignore */ }
  };

  // (no-op) fallback handled by savedServiceFromStorage declared above

  // TODO: remove truth-logs once fixed
  if (services.length > 0) {
    // Log de vérité côté UI
  // eslint-disable-next-line no-console
  console.log('[ui_services_normalized] slug=' + (slug || 'none') + ' count=' + services.length + ' sample=' + JSON.stringify(services[0]));
  }

  const handleServiceSelect = (serviceId: number) => {
    setSelectedService(serviceId);
    // Persist selection immediately so other pages (pro selection, recap) can read it
    const fullService = services.find((s: any) => s.id === serviceId);
    if (fullService) {
      try {
        // normalize shape for persistence (id, name, price in euros, duration)
        const normalize = (s: any) => {
          const id = s.id || s.serviceId || s.service_id;
          let price = s.price ?? s.amount ?? s.effective_price ?? s.price_cents ?? s.cost;
          if (typeof price === 'number' && price > 1000) price = price / 100;
          if (typeof price === 'string' && price.match(/^\d+$/)) price = parseFloat(price) / 100;
          const duration = s.duration || s.effective_duration || s.length || null;
          return { id, name: s.name || s.service_name || s.title || 'Service', price: price ?? null, duration, raw: s };
        };
        const normalized = normalize(fullService);
        // update wizard state and persist normalized object
        setWizardService(serviceId, normalized);
        try { localStorage.setItem('selectedService', JSON.stringify(normalized)); } catch (e) { /* ignore */ }
        try { window.dispatchEvent(new CustomEvent('selectedServiceChanged', { detail: normalized })); } catch (e) { /* ignore */ }
      } catch (e) {
        // ignore
      }

      // Auto-navigate to next step based on whether a professional is required
      try {
        const requiresPro = shouldRequirePro(fullService);
        if (requiresPro && import.meta.env.VITE_BOOKING_REQUIRE_PRO !== 'false') {
          setLocation('/professional-selection');
        } else {
          setLocation('/booking-datetime');
        }
      } catch (e) {
        // ignore navigation errors
      }
    }
  };

  const handleContinue = () => {
    if (selectedService) {
      // Trouver le service complet avec toutes ses données (y compris depositPercentage)
      const fullService = services.find(s => s.id === selectedService);
      if (fullService) {
        // Normaliser le service pour consistency avec handleServiceSelect
        const normalize = (s: any) => {
          const id = s.id || s.serviceId || s.service_id;
          let price = s.price ?? s.amount ?? s.effective_price ?? s.price_cents ?? s.cost;
          if (typeof price === 'number' && price > 1000) price = price / 100;
          if (typeof price === 'string' && price.match(/^\d+$/)) price = parseFloat(price) / 100;
          const duration = s.duration || s.effective_duration || s.length || null;
          return { id, name: s.name || s.service_name || s.title || 'Service', price: price ?? null, duration, raw: s };
        };
        const normalized = normalize(fullService);
        
        // Mettre à jour le wizard state avec le service normalisé
        setWizardService(selectedService, normalized);
        
        // Persister le service normalisé (pas le service brut)
        try {
          localStorage.setItem('selectedService', JSON.stringify(normalized));
        } catch (e) {
          /* ignore storage errors */
        }
        try { window.dispatchEvent(new CustomEvent('selectedServiceChanged', { detail: normalized })); } catch (e) { /* ignore */ }
        
        const requiresPro = shouldRequirePro(fullService);
        const destination = requiresPro ? 'professional' : 'datetime';
        
        // Log du clic réserver avec décision
        console.log('booking_cta_reserve_decision', { 
          serviceId: selectedService, 
          requiresPro,
          to: destination,
          serviceName: normalized.name
        });
        
        // Navigation basée sur la configuration
        if (requiresPro && import.meta.env.VITE_BOOKING_REQUIRE_PRO !== 'false') {
          setLocation('/professional-selection');
        } else {
          setLocation('/booking-datetime');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <h1 className="text-lg font-semibold text-gray-900">avec Justine</h1>
          </div>
        </div>
      </div>

      {/* Services réels de l'API */}
      <div className="max-w-md mx-auto">
        {isLoading ? (
          <div className="bg-white p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des services...</p>
          </div>
        ) : !slug ? (
          <div className="bg-white p-8 text-center">
            <p className="text-gray-600">Salon introuvable</p>
          </div>
        ) : services.length === 0 ? (
          // If no services from API, prefer hydratedSavedService (from localStorage/cache/fetch)
          hydratedSavedService ? (
            <div className="bg-white mb-1">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm">Service sélectionné</h3>
                <p className="text-xs text-gray-500 mt-1">Pré-sélection depuis votre visite précédente</p>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{hydratedSavedService.name}</h4>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="font-semibold text-gray-900">{hydratedSavedService.price ?? 'N/A'}€</span>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        {hydratedSavedService.duration || '—'} min
                      </div>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleSavedServiceSelect(hydratedSavedService)}>Utiliser</Button>
                </div>
              </div>
            </div>
          ) : savedServiceFromStorage ? (
            <div className="bg-white mb-1">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm">Service sélectionné</h3>
                <p className="text-xs text-gray-500 mt-1">Pre-sélection depuis votre visite précédente</p>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{savedServiceFromStorage.name}</h4>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="font-semibold text-gray-900">{savedServiceFromStorage.price ?? 'N/A'}€</span>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        {savedServiceFromStorage.duration || '—'} min
                      </div>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleSavedServiceSelect(savedServiceFromStorage)}>Utiliser</Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 text-center">
              <p className="text-gray-600">Aucun service disponible pour le moment</p>
            </div>
          )
        ) : (
          <div className="bg-white mb-1">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm">SERVICES DISPONIBLES</h3>
              <p className="text-xs text-gray-500 mt-1">{services.length} service{services.length > 1 ? 's' : ''} proposé{services.length > 1 ? 's' : ''}</p>
            </div>

            {/* Saved / primary service banner (saved or first cached) */}
            {displayPrimary && (
              <div className="p-4 border-b bg-yellow-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Service choisi</div>
                    <div className="font-medium text-gray-900">{displayPrimary.name}</div>
                    <div className="text-sm text-gray-700">{displayPrimary.price ?? 'N/A'}€ • {displayPrimary.duration ?? '—'} min</div>
                  </div>
                  <div>
                    <Button size="sm" onClick={() => handleSavedServiceSelect(displayPrimary)}>Utiliser</Button>
                  </div>
                </div>
              </div>
            )}
            {/* If we have a previously saved service, surface it first for quick reuse */}
            {savedServiceFromStorage && (
              <div className={`p-4 cursor-pointer border-b bg-yellow-50`} onClick={() => handleSavedServiceSelect(savedServiceFromStorage)}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Service sauvegardé: {savedServiceFromStorage.name}</h4>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="font-semibold text-gray-900">{savedServiceFromStorage.price}€</span>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        {savedServiceFromStorage.duration || '—'} min
                      </div>
                    </div>
                  </div>
                  <Button size="sm">Utiliser</Button>
                </div>
              </div>
            )}

            <div className="divide-y divide-gray-100">
              {services.map((service) => (
                <div 
                  key={service.id}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedService === service.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleServiceSelect(service.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{service.name}</h4>
                      {service.description && (
                        <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <span className="font-semibold text-gray-900">{service.price}€</span>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-3 h-3" />
                          {service.duration} min
                        </div>
                        {service.requiresDeposit && (
                          <div className="text-xs text-violet-600 font-medium">
                            Acompte {service.depositPercentage}%
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant={selectedService === service.id ? "default" : "outline"}
                      size="sm"
                      className={`ml-4 ${
                        selectedService === service.id 
                          ? 'bg-black text-white hover:bg-gray-800' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                      children={selectedService === service.id ? '✓' : 'Choisir'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informations additionnelles */}
        <div className="bg-white mt-6">
          <button className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 border-b border-gray-100" type="button">
            <span className="font-medium text-gray-900">Informations</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Bouton continuer fixe en bas */}
        {selectedService && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <div className="max-w-md mx-auto">
              <Button 
                onClick={handleContinue}
                className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium"
                children="Continuer"
              />
            </div>
          </div>
        )}

        {/* Footer style Avyento */}
        <div className="text-center py-8 text-xs text-gray-500">
          avyento.com
        </div>
      </div>
    </div>
  );
}