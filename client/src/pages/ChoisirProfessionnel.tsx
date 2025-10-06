import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import useBookingWizard from '@/hooks/useBookingWizard';

// Exemple de type pour un professionnel
interface Pro {
  id: string;
  nom: string;
  metier: string;
  note: number;
  avis: number;
  specialites: string[];
  prochaineDispo: string;
  description: string;
  photoUrl?: string;
  // aliases from various payload shapes
  title?: string;
  avatarUrl?: string;
}

const ChoisirProfessionnel: React.FC = () => {
  const [, setLocation] = useLocation();
  const { setSelectedPro, setSelectedService, bookingState } = useBookingWizard();
  const [selectedServiceDisplay, setSelectedServiceDisplay] = useState<any>(null);
  const [pros, setPros] = useState<Pro[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isEditingService, setIsEditingService] = useState<boolean>(false);
  const [editedDuration, setEditedDuration] = useState<string>('');
  const [editedPrice, setEditedPrice] = useState<string>('');
  // transient debug state removed

  useEffect(() => {
    // Simplified logic to load team members for each salon automatically
    setLoading(true);
    (async () => {
      try {
        // 1. First try to get salon slug from URL
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
        const urlMatch = currentPath.match(/^\/salon\/([^/]+)/);
        const urlSlug = urlMatch?.[1] ?? null;
        
        // 2. Also check sessionStorage for salon slug
        const storedSlug = typeof window !== 'undefined' ? sessionStorage.getItem('salonSlug') : null;
        const slug = urlSlug || storedSlug;

        console.log('[ChoisirProfessionnel] Detected salon slug:', { urlSlug, storedSlug, finalSlug: slug });

        // 3. If we have a slug, load the salon's team directly
        if (slug) {
          try {
            const res = await fetch(`/api/public/salon/${slug}`);
            if (res.ok) {
              const payload = await res.json();
              console.log('[ChoisirProfessionnel] API response for salon:', slug, payload);
              
              // Store the payload for other components
              try { 
                sessionStorage.setItem('publicSalonPayload', JSON.stringify(payload));
                sessionStorage.setItem('salonSlug', slug);
              } catch (e) { /* ignore */ }
              
              // Find team members in the response
              let team = [];
              if (payload.team_members) team = payload.team_members;
              else if (payload.teamMembers) team = payload.teamMembers;
              else if (payload.staff) team = payload.staff;
              else if (payload.members) team = payload.members;
              else if (payload.team) team = payload.team;
              else if (payload.salon?.team_members) team = payload.salon.team_members;
              else if (payload.salon?.staff) team = payload.salon.staff;
              
              console.log('[ChoisirProfessionnel] Found team members:', team);
              
              if (Array.isArray(team) && team.length > 0) {
                const adapted = team.map((prof: any) => ({
                  id: String(prof.id || prof.professional_id || prof.uuid || prof.nom || prof.name || Math.random()),
                  nom: prof.name || prof.nom || `${prof.firstName || ''} ${prof.lastName || ''}`.trim() || 'Membre',
                  metier: prof.role || prof.title || prof.metier || 'Professionnel',
                  note: prof.rating || prof.note || 4.5,
                  avis: prof.review_count || prof.reviews || prof.avis || 0,
                  specialites: Array.isArray(prof.specialties) ? prof.specialties : (typeof prof.specialties === 'string' ? prof.specialties.split(',').map((s: string) => s.trim()) : (prof.tags || prof.specialites || [])),
                  prochaineDispo: prof.next_available || prof.nextAvailable || 'Aujourd\'hui',
                  description: prof.bio || prof.description || prof.description_full || 'Professionnel expérimenté',
                  photoUrl: prof.avatar || prof.avatarUrl || prof.photo || prof.image || ''
                }));
                
                setPros(adapted);
                setError(null);
                console.log('[ChoisirProfessionnel] Successfully loaded team for salon:', slug, 'Count:', adapted.length);
                return;
              }
            }
          } catch (e) {
            console.error('[ChoisirProfessionnel] Error loading salon team:', e);
          }
        }

        // 4. Fallback: try to load from cached data
        const cachedRaw = typeof window !== 'undefined' ? (sessionStorage.getItem('publicSalonPayload') || localStorage.getItem('salonPayload')) : null;
        if (cachedRaw) {
          try {
            const cachedPayload = JSON.parse(cachedRaw);
            let team = [];
            if (cachedPayload.team_members) team = cachedPayload.team_members;
            else if (cachedPayload.teamMembers) team = cachedPayload.teamMembers;
            else if (cachedPayload.staff) team = cachedPayload.staff;
            else if (cachedPayload.members) team = cachedPayload.members;
            else if (cachedPayload.team) team = cachedPayload.team;
            
            if (Array.isArray(team) && team.length > 0) {
              const adapted = team.map((prof: any) => ({
                id: String(prof.id || prof.professional_id || prof.uuid || prof.nom || prof.name || Math.random()),
                nom: prof.name || prof.nom || `${prof.firstName || ''} ${prof.lastName || ''}`.trim() || 'Membre',
                metier: prof.role || prof.title || prof.metier || 'Professionnel',
                note: prof.rating || prof.note || 4.5,
                avis: prof.review_count || prof.reviews || prof.avis || 0,
                specialites: Array.isArray(prof.specialties) ? prof.specialties : (typeof prof.specialties === 'string' ? prof.specialties.split(',').map((s: string) => s.trim()) : (prof.tags || prof.specialites || [])),
                prochaineDispo: prof.next_available || prof.nextAvailable || 'Aujourd\'hui',
                description: prof.bio || prof.description || prof.description_full || 'Professionnel expérimenté',
                photoUrl: prof.avatar || prof.avatarUrl || prof.photo || prof.image || ''
              }));
              
              setPros(adapted);
              setError(null);
              console.log('[ChoisirProfessionnel] Used cached team data, Count:', adapted.length);
              return;
            }
          } catch (e) {
            console.error('[ChoisirProfessionnel] Error parsing cached data:', e);
          }
        }

        // 5. Last resort: show error message
        setError('Aucune équipe trouvée pour ce salon.');
        console.log('[ChoisirProfessionnel] No team found - no slug, no cached data');
        
      } catch (err) {
        console.error('[ChoisirProfessionnel] General error:', err);
        setError('Erreur lors du chargement de l\'équipe.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Keep track of the currently selected service for display (name/price/duration)
  useEffect(() => {
    // Helper to normalize service objects from many shapes
    const normalizeService = (raw: any) => {
      if (!raw) return null;
      const parsePrice = (v: any) => {
        if (v == null) return null;
        if (typeof v === 'number') return v > 1000 ? v / 100 : v;
        if (typeof v === 'string') {
          const cleaned = v.replace(/[^0-9.,-]/g, '').replace(',', '.').trim();
          if (!cleaned) return null;
          const n = parseFloat(cleaned);
          if (isNaN(n)) return null;
          return n > 1000 ? n / 100 : n;
        }
        return null;
      };
      const id = raw.id ?? raw.serviceId ?? raw.service_id ?? null;
      const name = raw.name ?? raw.nom ?? raw.title ?? raw.service_name ?? 'Service';
      let price = parsePrice(raw.price ?? raw.amount ?? raw.price_cents ?? raw.cost ?? raw.priceInCents ?? null);
      // If price still null, try nested raw
      if (price == null && raw.raw && typeof raw.raw === 'object') {
        price = parsePrice(raw.raw.price ?? raw.raw.amount ?? raw.raw.price_cents ?? raw.raw.cost ?? null);
      }
      let duration = raw.duration ?? raw.length ?? raw.time ?? raw.effective_duration ?? null;
      // Normalize duration strings like '45min' or '1h'
      if (typeof duration === 'string') {
        const m = duration.match(/(\d+)\s*h/);
        if (m) duration = parseInt(m[1], 10) * 60;
        else {
          const mm = duration.match(/(\d+)/);
          duration = mm ? parseInt(mm[1], 10) : null;
        }
      }
      return { id, name, price, duration, raw };
    };

    // Helper to hydrate the selected service from various sources
    const hydrateSelectedService = async (svcId?: any) => {
      try {
        // First prefer localStorage full object
        const raw = localStorage.getItem('selectedService');
        if (raw) {
          try { const parsed = JSON.parse(raw); setSelectedServiceDisplay(normalizeService(parsed)); return; } catch (e) { /* ignore */ }
        }

        // If svcId provided, try cached payloads
        const id = svcId ?? (bookingState as any)?.selectedServiceId;
        if (!id) { setSelectedServiceDisplay(null); return; }

        try {
          const cachedRaw = sessionStorage.getItem('publicSalonPayload') || localStorage.getItem('salonPayload');
          if (cachedRaw) {
            const payload = JSON.parse(cachedRaw);
            const list = payload?.salon?.services || payload?.services || null;
            if (Array.isArray(list)) {
              const found = list.find((s: any) => String(s.id) === String(id) || String(s.serviceId) === String(id));
        if (found) {
          const normalized = normalizeService(found);
          setSelectedServiceDisplay(normalized);
                return;
              }
            }
          }
        } catch (e) { /* ignore */ }

        // Try public endpoints
        const candidateUrls = [`/api/services/${id}`, `/api/salon-services/${id}`];
        for (const url of candidateUrls) {
          try {
            const res = await fetch(url);
            if (!res.ok) continue;
            const json = await res.json();
            const svc = json?.service || json?.data || json || null;
            if (svc && (svc.id || svc.serviceId || svc.service_id)) {
              const normalized = normalizeService(svc);
              setSelectedServiceDisplay(normalized);
              try { localStorage.setItem('selectedService', JSON.stringify(normalized)); } catch (e) { /* ignore */ }
              return;
            }
          } catch (e) { /* ignore */ }
        }

        // last resort: minimal
        setSelectedServiceDisplay({ id, name: 'Service sélectionné', price: null, duration: null });
      } catch (e) { setSelectedServiceDisplay(null); }
    };

    // initial read
    hydrateSelectedService((bookingState as any)?.selectedServiceId);

  const storageHandler = (e: StorageEvent) => { if (e.key === 'selectedService') hydrateSelectedService((bookingState as any)?.selectedServiceId); };
  const svcListener = (ev: any) => { if (ev?.detail) setSelectedServiceDisplay(normalizeService(ev.detail)); else hydrateSelectedService((bookingState as any)?.selectedServiceId); };
    window.addEventListener('storage', storageHandler);
    window.addEventListener('selectedServiceChanged', svcListener as EventListener);

    const focusHandler = () => hydrateSelectedService((bookingState as any)?.selectedServiceId);
    window.addEventListener('visibilitychange', focusHandler);
    window.addEventListener('focus', focusHandler);

    return () => {
      window.removeEventListener('storage', storageHandler);
      window.removeEventListener('selectedServiceChanged', svcListener as EventListener);
      window.removeEventListener('visibilitychange', focusHandler);
      window.removeEventListener('focus', focusHandler);
    };
  }, [bookingState]);

  // Manual loader: bind the column from salon payload into this page (debug / explicit action)
  const loadTeamFromSalonPayload = () => {
    try {
      const cachedRaw = typeof window !== 'undefined' ? (sessionStorage.getItem('publicSalonPayload') || localStorage.getItem('salonPayload')) : null;
      if (!cachedRaw) {
        setInfoMessage('Aucun payload public en cache (visite la page salon d\'abord).');
        return;
      }
      const payload = JSON.parse(cachedRaw);
      // try common locations
      const maybe = payload?.salon || payload;
      const keys = ['team_members','teamMembers','staff','staffMembers','staff_list','employees','members','team','professionals','professionnels'];
      let team = null;
      for (const k of keys) {
        if (Array.isArray(maybe[k]) && maybe[k].length > 0) { team = maybe[k]; break; }
      }
      if (!team) {
        // shallow scan
        for (const v of Object.values(maybe)) {
          if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'object' && (v[0].name || v[0].id || v[0].nom)) { team = v; break; }
        }
      }
      if (!team) { setInfoMessage('Aucune liste de membres trouvée dans le payload.'); return; }
      const adapted = team.map((prof: any) => ({
        id: String(prof.id || prof.professional_id || prof.uuid || prof.nom || prof.name || Math.random()),
        nom: prof.name || prof.nom || `${prof.firstName || ''} ${prof.lastName || ''}`.trim() || 'Membre',
        metier: prof.role || prof.title || prof.metier || 'Professionnel',
        note: prof.rating || prof.note || 4.5,
        avis: prof.review_count || prof.reviews || prof.avis || 0,
        specialites: Array.isArray(prof.specialties) ? prof.specialties : (typeof prof.specialties === 'string' ? prof.specialties.split(',').map((s: string) => s.trim()) : (prof.tags || prof.specialites || [])),
        prochaineDispo: prof.next_available || prof.nextAvailable || 'Aujourd\'hui',
        description: prof.bio || prof.description || prof.description_full || 'Professionnel expérimenté',
        photoUrl: prof.avatar || prof.avatarUrl || prof.photo || prof.image || ''
      }));
      setPros(adapted);
      setError(null);
      setInfoMessage(`Équipe chargée depuis le payload (${adapted.length} membres).`);
    } catch (e) {
      setInfoMessage('Erreur lors du chargement du payload.');
    }
  };

  // Force refresh team from API (clear cache and reload)
  const refreshTeamFromAPI = async () => {
    try {
      setLoading(true);
      setInfoMessage('Actualisation de l\'équipe...');
      
      // Detect current salon slug
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      const urlMatch = currentPath.match(/^\/salon\/([^/]+)/);
      const urlSlug = urlMatch?.[1] ?? null;
      const storedSlug = typeof window !== 'undefined' ? sessionStorage.getItem('salonSlug') : null;
      const slug = urlSlug || storedSlug;
      
      if (!slug) {
        setError('Impossible de déterminer le salon actuel.');
        setInfoMessage('');
        return;
      }
      
      // Clear cache
      sessionStorage.removeItem('publicSalonPayload');
      localStorage.removeItem('salonPayload');
      
      // Force fetch from API
      const res = await fetch(`/api/public/salon/${slug}`);
      
      if (!res.ok) {
        throw new Error('Erreur API');
      }
      
      const payload = await res.json();
      
      // Store in cache for other pages
      sessionStorage.setItem('publicSalonPayload', JSON.stringify(payload));
      sessionStorage.setItem('salonSlug', slug);
      
      // Extract team members from multiple possible locations
      let team = [];
      if (payload.team_members) team = payload.team_members;
      else if (payload.teamMembers) team = payload.teamMembers;
      else if (payload.staff) team = payload.staff;
      else if (payload.members) team = payload.members;
      else if (payload.team) team = payload.team;
      else if (payload.salon?.team_members) team = payload.salon.team_members;
      else if (payload.salon?.staff) team = payload.salon.staff;
      
      if (team.length === 0) {
        setInfoMessage('Aucun membre d\'équipe trouvé pour ce salon.');
        setPros([]);
        return;
      }
      
      const adapted = team.map((prof: any) => ({
        id: String(prof.id || prof.professional_id || prof.uuid || prof.nom || prof.name || Math.random()),
        nom: prof.name || prof.nom || `${prof.firstName || ''} ${prof.lastName || ''}`.trim() || 'Membre',
        metier: prof.role || prof.title || prof.metier || 'Professionnel',
        note: prof.rating || prof.note || 4.5,
        avis: prof.review_count || prof.reviews || prof.avis || 0,
        specialites: Array.isArray(prof.specialties) ? prof.specialties : (typeof prof.specialties === 'string' ? prof.specialties.split(',').map((s: string) => s.trim()) : (prof.tags || prof.specialites || [])),
        prochaineDispo: prof.next_available || prof.nextAvailable || 'Aujourd\'hui',
        description: prof.bio || prof.description || prof.description_full || 'Professionnel expérimenté',
        photoUrl: prof.avatar || prof.avatarUrl || prof.photo || prof.image || ''
      }));
      
      setPros(adapted);
      setError(null);
      setInfoMessage(`Équipe actualisée pour ${slug} ! ${adapted.length} membres trouvés.`);
      
    } catch (e) {
      setError('Erreur lors de l\'actualisation de l\'équipe.');
      setInfoMessage('');
    } finally {
      setLoading(false);
    }
  };

  // Functions for editing service details
  const handleEditService = () => {
    if (selectedServiceDisplay) {
      setEditedDuration(selectedServiceDisplay.duration?.toString() || '');
      setEditedPrice(selectedServiceDisplay.price?.toString() || '');
      setIsEditingService(true);
    }
  };

  const handleSaveServiceEdit = () => {
    if (selectedServiceDisplay) {
      const updatedService = {
        ...selectedServiceDisplay,
        duration: editedDuration ? parseInt(editedDuration, 10) : selectedServiceDisplay.duration,
        price: editedPrice ? parseFloat(editedPrice) : selectedServiceDisplay.price
      };
      
      // Update local state
      setSelectedServiceDisplay(updatedService);
      
      // Persist to localStorage
      try {
        localStorage.setItem('selectedService', JSON.stringify(updatedService));
        window.dispatchEvent(new CustomEvent('selectedServiceChanged', { detail: updatedService }));
      } catch (e) { /* ignore */ }
      
      // Update wizard state
      try {
        setSelectedService(updatedService.id, updatedService);
      } catch (e) { /* ignore */ }
      
      setIsEditingService(false);
    }
  };

  const handleCancelServiceEdit = () => {
    setIsEditingService(false);
    setEditedDuration('');
    setEditedPrice('');
  };

  // debug helpers removed

  // Shared helper: ensure a full selectedService object (with price/duration) is persisted
  const ensureSelectedServicePersisted = async (svcId: any) => {
    if (!svcId) return;
    // If something already exists and has a price, keep it
    try {
      const existingRaw = localStorage.getItem('selectedService');
      if (existingRaw) {
        try {
          const ex = JSON.parse(existingRaw);
          if (ex && (ex.price != null || ex.amount != null || ex.price_cents != null)) return; // already has price
        } catch (e) { /* ignore parse */ }
      }
    } catch (e) { /* ignore */ }

    const parsePrice = (v: any) => {
      if (v == null) return null;
      if (typeof v === 'number') return v > 1000 ? v / 100 : v;
      if (typeof v === 'string') {
        const cleaned = v.replace(/[^0-9.,-]/g, '').replace(',', '.').trim();
        if (!cleaned) return null;
        const n = parseFloat(cleaned);
        if (isNaN(n)) return null;
        return n > 1000 ? n / 100 : n;
      }
      return null;
    };

    // Try cached payloads first (session/local)
    try {
      const raw = sessionStorage.getItem('publicSalonPayload') || localStorage.getItem('salonPayload');
      if (raw) {
        const payload = JSON.parse(raw);
        const list = payload?.salon?.services || payload?.services || payload?.salon?.data?.services || null;
        if (Array.isArray(list)) {
          const found = list.find((s: any) => String(s.id) === String(svcId) || String(s.serviceId) === String(svcId));
          if (found) {
            const normalized = {
              id: found.id ?? found.serviceId ?? found.service_id ?? svcId,
              name: found.name ?? found.nom ?? found.title ?? 'Service sélectionné',
              price: parsePrice(found.price ?? found.amount ?? found.price_cents ?? found.cost ?? found.effective_price),
              duration: found.duration ?? found.length ?? found.time ?? found.effective_duration ?? null,
              raw: found
            };
            try { localStorage.setItem('selectedService', JSON.stringify(normalized)); } catch (e) { /* ignore */ }
            try { window.dispatchEvent(new CustomEvent('selectedServiceChanged', { detail: normalized })); } catch (e) { /* ignore */ }
            return;
          }
        }
      }
    } catch (e) { /* ignore */ }

    // Try public service endpoints to fetch details
    const candidateUrls = [
      `/api/services/${svcId}`,
      `/api/salon-services/${svcId}`
    ];
    for (const url of candidateUrls) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const json = await res.json();
        const svc = json?.service || json?.data || json || null;
        if (svc && (svc.id || svc.serviceId || svc.service_id)) {
          const normalized = {
            id: svc.id ?? svc.serviceId ?? svc.service_id ?? svcId,
            name: svc.name ?? svc.nom ?? svc.title ?? 'Service sélectionné',
            price: parsePrice(svc.price ?? svc.amount ?? svc.price_cents ?? svc.cost ?? svc.effective_price),
            duration: svc.duration ?? svc.length ?? svc.time ?? svc.effective_duration ?? null,
            raw: svc
          };
          try { localStorage.setItem('selectedService', JSON.stringify(normalized)); } catch (e) { /* ignore */ }
          try { window.dispatchEvent(new CustomEvent('selectedServiceChanged', { detail: normalized })); } catch (e) { /* ignore */ }
          return;
        }
      } catch (e) { /* ignore */ }
    }

    // Last resort: write a minimal placeholder (id only) so the recap can at least show the id
    try {
      const minimal = { id: svcId, name: 'Service sélectionné', price: null, duration: null };
      localStorage.setItem('selectedService', JSON.stringify(minimal));
      try { window.dispatchEvent(new CustomEvent('selectedServiceChanged', { detail: minimal })); } catch (e) { /* ignore */ }
    } catch (e) { /* ignore */ }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Choisir un professionnel</h2>
      {/* Selected service banner */}
      {selectedServiceDisplay && (
        <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: 12, borderRadius: 10, marginBottom: 16 }}>
          {!isEditingService ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, color: '#b45309' }}>Service sélectionné</div>
                <div style={{ fontWeight: 700 }}>{selectedServiceDisplay.name || 'Service'}</div>
                <div style={{ color: '#6b7280' }}>{(selectedServiceDisplay.price != null) ? `${selectedServiceDisplay.price}€ • ${selectedServiceDisplay.duration ?? '—'} min` : 'Prix / durée non définis'}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleEditService} style={{ background: 'none', border: '1px solid #e5e7eb', padding: '8px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>
                  Éditer
                </button>
                <button onClick={() => setLocation('/service-selection')} style={{ background: 'none', border: '1px solid #e5e7eb', padding: '8px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>
                  Changer
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 13, color: '#b45309', marginBottom: 8 }}>Modifier le service</div>
              <div style={{ fontWeight: 700, marginBottom: 12 }}>{selectedServiceDisplay.name || 'Service'}</div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Prix (€)</label>
                  <input
                    type="number"
                    value={editedPrice}
                    onChange={(e) => setEditedPrice(e.target.value)}
                    placeholder="Prix en euros"
                    style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 14 }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Durée (min)</label>
                  <input
                    type="number"
                    value={editedDuration}
                    onChange={(e) => setEditedDuration(e.target.value)}
                    placeholder="Durée en minutes"
                    style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 14 }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button onClick={handleCancelServiceEdit} style={{ background: 'none', border: '1px solid #e5e7eb', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                  Annuler
                </button>
                <button onClick={handleSaveServiceEdit} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                  Sauvegarder
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <button
          onClick={loadTeamFromSalonPayload}
          style={{
            background: '#eef2ff',
            color: '#4c1d95',
            border: '1px solid #e0e7ff',
            padding: '8px 12px',
            borderRadius: 8,
            cursor: 'pointer'
          }}
        >
          Charger l'équipe du salon
        </button>
        <button
          onClick={refreshTeamFromAPI}
          style={{
            background: '#f0fdf4',
            color: '#15803d',
            border: '1px solid #bbf7d0',
            padding: '8px 12px',
            borderRadius: 8,
            cursor: 'pointer'
          }}
        >
          🔄 Actualiser l'équipe
        </button>
        {infoMessage && <div style={{ color: '#374151', fontSize: 14 }}>{infoMessage}</div>}
      </div>
      {/* debug panel removed */}
      {loading && <div>Chargement des membres...</div>}
      {error && <div style={{ color: '#ef4444', marginBottom: 16 }}>{error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        {pros.map(pro => (
          <div
            key={pro.id}
            style={{
              border: selectedId === pro.id ? '2px solid #6366f1' : '1px solid #e5e7eb',
              borderRadius: 16,
              background: '#fff',
              boxShadow: '0 2px 8px #e5e7eb',
              padding: 24,
              cursor: 'pointer',
              transition: 'border 0.2s',
            }}
            onClick={async () => {
              // Select visually and persist the professional immediately (stay on this page)
              setSelectedId(pro.id);
              const professionalData = {
                id: pro.id,
                name: pro.nom,
                role: pro.metier || pro.title,
                photo: pro.photoUrl || pro.avatarUrl || pro.photo || '',
                title: pro.metier,
                rating: pro.note,
                reviewsCount: pro.avis,
                tags: pro.specialites,
                nextAvailable: pro.prochaineDispo,
                bio: pro.description,
                avatarUrl: pro.photoUrl
              };
                // Preserve currently selected service - DO NOT override with fallback service
              try {
                let svcId = bookingState.selectedServiceId;
                // try existing localStorage selectedService
                if (!svcId) {
                  const raw = localStorage.getItem('selectedService');
                  if (raw) {
                    try { const parsed = JSON.parse(raw); svcId = parsed?.id ?? svcId; } catch (e) { /* ignore */ }
                  }
                }

                // Only ensure persistence if we have a valid service ID (preserve user selection)
                if (svcId) await ensureSelectedServicePersisted(svcId);
              } catch (e) { /* ignore */ }

              // Update wizard state and localStorage so other pages/recap can read it
              try { setSelectedPro(pro.id, professionalData); } catch (e) { /* ignore */ }
              try { localStorage.setItem('selectedProfessional', JSON.stringify(professionalData)); } catch (e) { /* ignore */ }
              try { window.dispatchEvent(new CustomEvent('selectedProfessionalChanged', { detail: professionalData })); } catch (e) { /* ignore */ }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              {pro.photoUrl && (
                <img src={pro.photoUrl} alt={pro.nom} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', marginRight: 16 }} />
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: 20 }}>{pro.nom}</div>
                <div style={{ color: '#6366f1', fontWeight: 500 }}>{pro.metier}</div>
                <div style={{ color: '#f59e42', fontWeight: 500, fontSize: 16 }}>
                  ★ {pro.note} <span style={{ color: '#6b7280', fontWeight: 400, fontSize: 14 }}>({pro.avis} avis)</span>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 500 }}>Spécialités :</span>
              <div style={{ marginTop: 4, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {Array.isArray(pro.specialites) && pro.specialites.map((spec: string, i: number) => (
                  <span key={i} style={{ background: '#eef2ff', color: '#6366f1', borderRadius: 8, padding: '2px 10px', fontSize: 13 }}>{spec}</span>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 500 }}>Prochaine disponibilité :</span>
              <span style={{ color: '#22c55e', marginLeft: 8 }}>{pro.prochaineDispo}</span>
            </div>
            <div style={{ color: '#6b7280', fontSize: 15 }}>{pro.description}</div>
          </div>
        ))}
      </div>
      <button
        style={{
          marginTop: 32,
          width: '100%',
          padding: '14px 0',
          fontSize: 18,
          fontWeight: 600,
          background: selectedId ? '#6366f1' : '#e5e7eb',
          color: selectedId ? '#fff' : '#9ca3af',
          border: 'none',
          borderRadius: 10,
          cursor: selectedId ? 'pointer' : 'not-allowed',
          transition: 'background 0.2s',
        }}
  disabled={!selectedId}
  onClick={async () => {
          if (selectedId) {
            const selectedPro = pros.find(p => p.id === selectedId);
            if (selectedPro) {
              // Intégrer avec le système de wizard
              const professionalData = {
                id: selectedPro.id,
                // canonical fields used across the app
                name: selectedPro.nom,
                role: selectedPro.metier || selectedPro.title,
                photo: selectedPro.photoUrl || selectedPro.avatarUrl || selectedPro.photo || '',
                // extras (kept for downstream code)
                title: selectedPro.metier,
                rating: selectedPro.note,
                reviewsCount: selectedPro.avis,
                tags: selectedPro.specialites,
                nextAvailable: selectedPro.prochaineDispo,
                bio: selectedPro.description,
                avatarUrl: selectedPro.photoUrl
              };
              
              // L'ID du service doit venir de la sélection utilisateur (pas hardcodé)
              let selectedServiceId = bookingState.selectedServiceId;
              if (!selectedServiceId) {
                // fallback to localStorage saved selectedService
                try {
                  const raw = localStorage.getItem('selectedService');
                  if (raw) {
                    const parsed = JSON.parse(raw);
                    selectedServiceId = parsed?.id ?? selectedServiceId;
                  }
                } catch (e) {
                  // ignore
                }
              }
              if (!selectedServiceId) {
                console.error('[ChoisirProfessionnel] ERREUR: Aucun service sélectionné. Redirection vers sélection service.');
                setLocation('/service-selection');
                return;
              }

              // Pas de nouvelle sélection de service ici - utiliser l'existant
              console.log('[ChoisirProfessionnel] Service déjà sélectionné:', selectedServiceId);
              // Ensure the selected service is persisted (try several caches) before continuing
              const ensureSelectedServicePersisted = async (svcId: any) => {
                // If something already exists and has a price, keep it
                try {
                  const existingRaw = localStorage.getItem('selectedService');
                  if (existingRaw) {
                    try {
                      const ex = JSON.parse(existingRaw);
                      if (ex && (ex.price != null || ex.amount != null || ex.price_cents != null)) return; // already has price
                    } catch (e) { /* ignore parse */ }
                  }
                } catch (e) { /* ignore */ }

                const parsePrice = (v: any) => {
                  if (v == null) return null;
                  if (typeof v === 'number') return v > 1000 ? v / 100 : v;
                  if (typeof v === 'string') {
                    const cleaned = v.replace(/[^0-9.,-]/g, '').replace(',', '.').trim();
                    if (!cleaned) return null;
                    const n = parseFloat(cleaned);
                    if (isNaN(n)) return null;
                    return n > 1000 ? n / 100 : n;
                  }
                  return null;
                };

                // Try cached payloads first (session/local)
                try {
                  const raw = sessionStorage.getItem('publicSalonPayload') || localStorage.getItem('salonPayload');
                  if (raw) {
                    const payload = JSON.parse(raw);
                    const list = payload?.salon?.services || payload?.services || payload?.salon?.data?.services || null;
                    if (Array.isArray(list)) {
                      const found = list.find((s: any) => String(s.id) === String(svcId) || String(s.serviceId) === String(svcId));
                      if (found) {
                        const normalized = {
                          id: found.id ?? found.serviceId ?? found.service_id ?? svcId,
                          name: found.name ?? found.nom ?? found.title ?? 'Service sélectionné',
                          price: parsePrice(found.price ?? found.amount ?? found.price_cents ?? found.cost ?? found.effective_price),
                          duration: found.duration ?? found.length ?? found.time ?? found.effective_duration ?? null,
                          raw: found
                        };
                        try { localStorage.setItem('selectedService', JSON.stringify(normalized)); } catch (e) { /* ignore */ }
                        try { window.dispatchEvent(new CustomEvent('selectedServiceChanged', { detail: normalized })); } catch (e) { /* ignore */ }
                        return;
                      }
                    }
                  }
                } catch (e) { /* ignore */ }

                // Try public service endpoints to fetch details
                const candidateUrls = [
                  `/api/services/${svcId}`,
                  `/api/salon-services/${svcId}`
                ];
                for (const url of candidateUrls) {
                  try {
                    const res = await fetch(url);
                    if (!res.ok) continue;
                    const json = await res.json();
                    const svc = json?.service || json?.data || json || null;
                    if (svc && (svc.id || svc.serviceId || svc.service_id)) {
                      const normalized = {
                        id: svc.id ?? svc.serviceId ?? svc.service_id ?? svcId,
                        name: svc.name ?? svc.nom ?? svc.title ?? 'Service sélectionné',
                        price: parsePrice(svc.price ?? svc.amount ?? svc.price_cents ?? svc.cost ?? svc.effective_price),
                        duration: svc.duration ?? svc.length ?? svc.time ?? svc.effective_duration ?? null,
                        raw: svc
                      };
                      try { localStorage.setItem('selectedService', JSON.stringify(normalized)); } catch (e) { /* ignore */ }
                      try { window.dispatchEvent(new CustomEvent('selectedServiceChanged', { detail: normalized })); } catch (e) { /* ignore */ }
                      return;
                    }
                  } catch (e) { /* ignore */ }
                }

                // Last resort: write a minimal placeholder (id only) so the recap can at least show the id
                try {
                  const minimal = { id: svcId, name: 'Service sélectionné', price: null, duration: null };
                  localStorage.setItem('selectedService', JSON.stringify(minimal));
                  try { window.dispatchEvent(new CustomEvent('selectedServiceChanged', { detail: minimal })); } catch (e) { /* ignore */ }
                } catch (e) { /* ignore */ }
              };

              // Persist pro and service, then navigate
              await ensureSelectedServicePersisted(selectedServiceId);
              setSelectedPro(selectedPro.id, professionalData);
              // Store canonical fields so BookingDateTime can read them (name, role, photo)
              localStorage.setItem('selectedProfessional', JSON.stringify(professionalData));
              try { window.dispatchEvent(new CustomEvent('selectedProfessionalChanged', { detail: professionalData })); } catch (e) { /* ignore */ }

              try { window.dispatchEvent(new CustomEvent('selectedProfessionalChanged', { detail: professionalData })); } catch (e) { /* ignore */ }

              // Ensure there's at least a minimal selectedService stored so the recap
              // page can read which service was chosen. Some flows may have bookingState
              // populated with selectedServiceId but no full object persisted.
              try {
                const existing = localStorage.getItem('selectedService');
                if (!existing && selectedServiceId) {
                  localStorage.setItem('selectedService', JSON.stringify({ id: selectedServiceId }));
                }
              } catch (e) {
                // ignore storage errors
              }

              console.log('booking_professional_selected_simple', {
                professionalId: selectedPro.id,
                professionalName: selectedPro.nom,
                selectedServiceId: selectedServiceId
              });

              // Navigation directe vers la page de choix date/heure (récap)
              setLocation('/booking-datetime');
            }
          }
        }}
      >Continuer</button>
    </div>
  );
};

export default ChoisirProfessionnel;
