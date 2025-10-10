import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, ChevronUp, User, Edit2, Check, X } from "lucide-react";
import useBookingWizard from "@/hooks/useBookingWizard";
import useSalonServices from "@/hooks/useSalonServices";
import useEffectiveService from '@/hooks/useEffectiveService';
import useUpdateSalonService from '@/hooks/useUpdateSalonService';
import { formatPrice, formatDuration } from "@/lib/utils";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface DaySchedule {
  date: string;
  dayName: string;
  expanded: boolean;
  slots: TimeSlot[];
}

export default function BookingDateTime() {
  const [, setLocation] = useLocation();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  
  // États pour la multi-sélection de prestations
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  // Initialiser les prestations depuis les données de session
  useEffect(() => {
    try {
      const preBookingData = sessionStorage.getItem('preBookingData');
      if (preBookingData) {
        const data = JSON.parse(preBookingData);
        if (data.selectedServices && Array.isArray(data.selectedServices)) {
          setSelectedServices(data.selectedServices);
        }
      }
    } catch (e) {
      console.warn('Erreur récupération prestations depuis session:', e);
    }
  }, []);
  const { bookingState, isWizardReady, shouldRequirePro } = useBookingWizard();
  const hasRedirectedRef = useRef(false);
  
  // États pour l'édition inline des services
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [isEditingDuration, setIsEditingDuration] = useState(false);
  const [editPrice, setEditPrice] = useState('');
  const [editDuration, setEditDuration] = useState('');
  
  // Hook pour la mise à jour des services
  const { updateService, isLoading: isUpdating } = useUpdateSalonService();

  // Récupération des services avec overrides de prix/durée  
  const salonId = "45a6fc7a-78ec-4ada-bd89-f6f3fc17ea8a"; // Salon AGAS3 où est créé jgcgh

  // Query pour récupérer tous les services disponibles
  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: [`/api/salons/salon/${salonId}/services/admin`]
  });
  
  const availableServices = (servicesData as any)?.services || [];
  
  // Nouveau hook pour récupérer les données effectives avec priorité pro → salon → base
  // Ne déclenche l'API que si wizard ready et service sélectionné
  const { 
    isLoading: effectiveServiceLoading, 
    error: effectiveServiceError, 
    data: effectiveServiceData 
  } = useEffectiveService(
    salonId, 
    isWizardReady && bookingState.selectedServiceId ? bookingState.selectedServiceId : undefined, 
    bookingState.selectedProId
  );

  // Debug logging + Garde-fou réseau obligatoire
  console.log('[BookingDateTime] State:', {
    salonId,
    selectedServiceId: bookingState.selectedServiceId,
    selectedProId: bookingState.selectedProId,
    effectiveServiceLoading,
    effectiveServiceError,
    effectiveServiceData,
    wizardReady: isWizardReady,
    hasSelectedService: !!bookingState.selectedServiceId
  });

  // Log source des données au montage du récap
  useEffect(() => {
    if (effectiveServiceData) {
      console.log('[BookingDateTime] SOURCE=data:network / placeholder:off', {
        name: effectiveServiceData.name,
        price: effectiveServiceData.price,
        duration: effectiveServiceData.duration,
        source: 'API_NETWORK'
      });
    } else if (!effectiveServiceLoading) {
      console.warn('[BookingDateTime] ATTENTION: Aucune donnée réseau disponible', {
        hasError: !!effectiveServiceError,
        isLoading: effectiveServiceLoading
      });
    }
  }, [effectiveServiceData, effectiveServiceLoading, effectiveServiceError]);



  // Plus de garde-fous de redirection - cette page est maintenant autonome

  // Selected professional/service: keep local state and sync with localStorage + bookingState
  const [selectedProfessionalData, setSelectedProfessionalData] = React.useState<any>(() => {
    try {
      const raw = localStorage.getItem('selectedProfessional');
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return { name: 'Sarah Martin', role: 'Coiffeuse experte', photo: '/api/placeholder/40/40' };
  });

  const [savedSelectedService, setSavedSelectedService] = React.useState<any>(() => {
    try {
      const raw = localStorage.getItem('selectedService');
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return null;
  });

  // Helpers to normalize different payload shapes
  const normalizeProfessional = (raw: any) => {
    if (!raw) return null;
    return {
      id: raw.id || raw.uuid || raw._id || null,
      name: raw.name || raw.nom || raw.full_name || raw.displayName || raw.title || 'Professionnel',
      role: raw.role || raw.metier || raw.title || raw.job || '',
      photo: raw.photo || raw.photoUrl || raw.avatarUrl || raw.avatar || raw.image || ''
    };
  };

  const normalizeService = (raw: any) => {
    if (!raw) return null;
    // Helper to parse price from many possible shapes (number, cents, string with symbols)
    const parsePrice = (v: any) => {
      if (v == null) return null;
      if (typeof v === 'number') {
        // if value looks like cents (e.g. 4000), convert
        if (v > 1000) return v / 100;
        return v;
      }
      if (typeof v === 'string') {
        const cleaned = v.replace(/[^0-9.,-]/g, '').replace(',', '.').trim();
        if (!cleaned) return null;
        const n = parseFloat(cleaned);
        if (isNaN(n)) return null;
        if (n > 1000) return n / 100;
        return n;
      }
      return null;
    };

    const candidates = [raw.price, raw.amount, raw.price_cents, raw.cost, raw.effective_price, raw.priceInCents];
    let price: number | null = null;
    for (const c of candidates) {
      const p = parsePrice(c);
      if (p != null) { price = p; break; }
    }

    // look into nested raw payload if present
    if (price == null && raw.raw && typeof raw.raw === 'object') {
      for (const k of ['price', 'amount', 'price_cents', 'cost']) {
        const p = parsePrice(raw.raw[k]);
        if (p != null) { price = p; break; }
      }
    }

    const duration = raw.duration ?? raw.length ?? raw.time ?? raw.effective_duration ?? (raw.raw && raw.raw.duration) ?? null;

    return {
      id: raw.id ?? raw.serviceId ?? raw.service_id ?? null,
      name: raw.name ?? raw.nom ?? raw.title ?? raw.service_name ?? 'Service sélectionné',
      duration,
      price
    };
  };

  // Direct localStorage read helper (synchronous) - prefer this when available after user selection
  const getLocalSelectedServiceRaw = () => {
    try {
      const raw = localStorage.getItem('selectedService');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  };

  // Read selectedService directly from localStorage as a final fallback (robust sync)
  const storageSelectedService = React.useMemo(() => {
    try {
      const raw = localStorage.getItem('selectedService');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return normalizeService(parsed);
    } catch (e) { return null; }
  }, [bookingState.selectedServiceId]);

  // Also keep the raw parsed object available for last-resort display
  const rawLocalSelectedService = React.useMemo(() => {
    try {
      const raw = localStorage.getItem('selectedService');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) { return null; }
  }, [bookingState.selectedServiceId]);

  // Keep component-level selectedServiceId in sync with bookingState and savedSelectedService
  useEffect(() => {
    // If bookingState provides the id, prefer it
    if (bookingState.selectedServiceId && bookingState.selectedServiceId !== selectedServiceId) {
      setSelectedServiceId(bookingState.selectedServiceId);
    }

    // If not, hydrate from savedSelectedService
    if (!selectedServiceId && savedSelectedService && savedSelectedService.id) {
      const idNum = typeof savedSelectedService.id === 'number' ? savedSelectedService.id : (parseInt(savedSelectedService.id) || undefined);
      if (idNum) setSelectedServiceId(idNum);
    }
  }, [bookingState.selectedServiceId, savedSelectedService]);

  // Sync selectedProfessionalData when bookingState or localStorage changes
  useEffect(() => {
    if (bookingState.selectedProId) {
      // try to read detailed pro from localStorage
      try {
        const raw = localStorage.getItem('selectedProfessional');
        if (raw) setSelectedProfessionalData(JSON.parse(raw));
        else setSelectedProfessionalData((prev: any) => prev);
      } catch (e) {
        // ignore
      }
    }
  }, [bookingState.selectedProId]);

  // If we don't have a savedSelectedService but the wizard has an id, try to fetch the service details
  useEffect(() => {
    if (!savedSelectedService && bookingState.selectedServiceId) {
      const id = bookingState.selectedServiceId;
      (async () => {
        const candidateUrls = [
          `/api/salons/salon/${salonId}/services/${id}`,
          `/api/services/${id}`,
          `/api/salon-services/${id}`
        ];
        for (const url of candidateUrls) {
          try {
            const res = await fetch(url);
            if (!res.ok) continue;
            const json = await res.json();
            // try common shapes
            const svc = json?.service || json?.data || json || null;
            if (svc && (svc.id || svc.serviceId || svc.service_id)) {
              try { localStorage.setItem('selectedService', JSON.stringify(svc)); } catch (e) { /* ignore */ }
              setSavedSelectedService(svc);
              break;
            }
          } catch (e) {
            // ignore and try next
          }
        }
      })();
    }
  }, [bookingState.selectedServiceId, savedSelectedService]);

  // Listen for storage changes coming from other tabs or pages
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (!e.key) return;
      if (e.key === 'selectedProfessional') {
        try { setSelectedProfessionalData(e.newValue ? JSON.parse(e.newValue) : null); } catch (err) { /* ignore */ }
      }
      if (e.key === 'selectedService') {
        try { setSavedSelectedService(e.newValue ? JSON.parse(e.newValue) : null); } catch (err) { /* ignore */ }
      }
    };
    window.addEventListener('storage', handler);
    // Also listen for same-tab custom events to react immediately
    const svcListener = (ev: any) => {
      try { setSavedSelectedService(ev?.detail ?? null); } catch (e) { /* ignore */ }
    };
    const proListener = (ev: any) => {
      try { setSelectedProfessionalData(ev?.detail ?? null); } catch (e) { /* ignore */ }
    };
    window.addEventListener('selectedServiceChanged', svcListener);
    window.addEventListener('selectedProfessionalChanged', proListener);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('selectedServiceChanged', svcListener);
      window.removeEventListener('selectedProfessionalChanged', proListener);
    };
  }, []);

  // Re-read localStorage when tab regains focus to ensure UI shows latest saved values
  useEffect(() => {
    const refresh = () => {
      try {
        const rawSvc = localStorage.getItem('selectedService');
        if (rawSvc) setSavedSelectedService(JSON.parse(rawSvc));
      } catch (e) { /* ignore */ }
      try {
        const rawPro = localStorage.getItem('selectedProfessional');
        if (rawPro) setSelectedProfessionalData(JSON.parse(rawPro));
      } catch (e) { /* ignore */ }
    };
    window.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  // Service sélectionné depuis notre liste
  const selectedService = availableServices.find((s: any) => s.id === selectedServiceId) || null;

  // Valeurs d'affichage basées sur (ordre de priorité): effectiveServiceData -> savedSelectedService -> selectedService -> first available -> fallback
  const serviceDisplay = React.useMemo(() => {
    if (effectiveServiceLoading) {
      return {
        effectiveName: 'Chargement des services...', 
        effectiveDuration: 'Chargement...',
        effectivePrice: 'Chargement...'
      };
    }

    if (effectiveServiceData) {
      return {
        effectiveName: effectiveServiceData.name || 'Service',
        effectiveDuration: `${effectiveServiceData.duration || 60} min`,
        effectivePrice: formatPrice(effectiveServiceData.price ?? 0)
      };
    }
    // Prefer the exact JSON that the user selected in localStorage (most reliable after selection)
    try {
      const localRaw = getLocalSelectedServiceRaw();
      if (localRaw) {
        const s = normalizeService(localRaw);
        return {
          effectiveName: s?.name || 'Service sélectionné',
          effectiveDuration: `${s?.duration || 60} min`,
          effectivePrice: typeof s?.price === 'number' ? formatPrice(s.price) : (s?.price ? String(s.price) + ' €' : 'N/A')
        };
      }
    } catch (e) { /* ignore parse errors and continue to other fallbacks */ }

    // prefer the service persisted in localStorage (robust) over transient savedSelectedService
    if (storageSelectedService) {
      const s = storageSelectedService;
      return {
        effectiveName: s?.name || 'Service sélectionné',
        effectiveDuration: `${s?.duration || 60} min`,
        effectivePrice: typeof s?.price === 'number' ? formatPrice(s.price) : (s?.price ? String(s.price) + ' €' : 'N/A')
      };
    }

    if (savedSelectedService) {
      const s = normalizeService(savedSelectedService);
      return {
        effectiveName: s?.name || 'Service sélectionné',
        effectiveDuration: `${s?.duration || 60} min`,
        effectivePrice: typeof s?.price === 'number' ? formatPrice(s.price) : (s?.price ? String(s.price) + ' €' : 'N/A')
      };
    }

    if (selectedService) {
      return {
        effectiveName: selectedService.name,
        effectiveDuration: `${selectedService.duration || 60} min`,
        effectivePrice: formatPrice(selectedService.price ?? 0)
      };
    }

    if (availableServices.length > 0) {
      const firstService = availableServices[0];
      // hydrate local selection if none
      if (!selectedServiceId) setSelectedServiceId(firstService.id);
      return {
        effectiveName: firstService.name,
        effectiveDuration: `${firstService.duration || 60} min`,
        effectivePrice: formatPrice(firstService.price ?? 0)
      };
    }
    // Final fallback: if we have a raw local selected service, try to display its fields directly
    if (rawLocalSelectedService) {
      const r = rawLocalSelectedService;
      const name = r.name || r.nom || r.service_name || 'Service sélectionné';
      let priceVal = r.price ?? r.amount ?? r.price_cents ?? r.cost;
      if (typeof priceVal === 'number' && priceVal > 1000) priceVal = priceVal / 100;
      const priceStr = typeof priceVal === 'number' ? formatPrice(priceVal) : (priceVal ? String(priceVal) + ' €' : 'N/A');
      return {
        effectiveName: name,
        effectiveDuration: `${r.duration || r.length || 60} min`,
        effectivePrice: priceStr
      };
    }

    // Fallback si pas de services
    return {
      effectiveName: 'Aucun service disponible', 
      effectiveDuration: 'N/A',
      effectivePrice: 'N/A'
    };
  }, [effectiveServiceData, effectiveServiceLoading, savedSelectedService, selectedService, servicesLoading, availableServices, selectedServiceId]);

  // Normalized professional for display
  const professionalDisplay = React.useMemo(() => {
    const p = normalizeProfessional(selectedProfessionalData);
    return {
      name: p?.name || 'Professionnel',
      role: p?.role || '',
      photo: p?.photo || '/api/placeholder/40/40'
    };
  }, [selectedProfessionalData]);

  // --- DEBUG PANEL (temporary) -------------------------------------------------
  // Shows localStorage selectedService/selectedProfessional and their normalized forms
  const debugLocalRaw = React.useMemo(() => {
    let svc = null; let pro = null;
    try { svc = localStorage.getItem('selectedService'); svc = svc ? JSON.parse(svc) : null; } catch (e) { svc = null; }
    try { pro = localStorage.getItem('selectedProfessional'); pro = pro ? JSON.parse(pro) : null; } catch (e) { pro = null; }
    return { svcRaw: svc, proRaw: pro, svcNormalized: normalizeService(svc), proNormalized: normalizeProfessional(pro) };
  }, [savedSelectedService, selectedProfessionalData]);

  const debugLog = () => {
    console.log('DEBUG selectedService raw:', debugLocalRaw.svcRaw);
    console.log('DEBUG selectedService normalized:', debugLocalRaw.svcNormalized);
    console.log('DEBUG selectedProfessional raw:', debugLocalRaw.proRaw);
    console.log('DEBUG selectedProfessional normalized:', debugLocalRaw.proNormalized);
    try {
      const s = JSON.stringify({ svcRaw: debugLocalRaw.svcRaw, svcNormalized: debugLocalRaw.svcNormalized, proRaw: debugLocalRaw.proRaw, proNormalized: debugLocalRaw.proNormalized }, null, 2);
      navigator.clipboard.writeText(s).then(() => console.log('DEBUG copied to clipboard'));
    } catch (e) { /* ignore */ }
  };
  // --- end debug panel --------------------------------------------------------

  // Fonction pour générer les créneaux basés sur le professionnel sélectionné et la durée totale
  const generateScheduleForProfessional = (professionalData: any, totalDuration: number = 60) => {
    if (!professionalData) {
      // Créneaux par défaut si aucun professionnel
      return [
        {
          date: "Samedi 16 août",
          dayName: "Samedi",
          expanded: true,
          slots: [
            { time: "09:00", available: true },
            { time: "09:30", available: true },
            { time: "12:30", available: true },
            { time: "13:00", available: true },
            { time: "17:30", available: true },
            { time: "18:00", available: true },
            { time: "18:30", available: true }
          ]
        }
      ];
    }

    // Récupérer les disponibilités du professionnel
    const availability = professionalData.availability || professionalData.horaires || {};
    const workingHours = professionalData.workingHours || professionalData.heures_travail || {};
    
    // Générer les prochains 7 jours
    const schedule: DaySchedule[] = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
      const formattedDate = date.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });
      
      // Récupérer les horaires de travail pour ce jour
      const dayKey = dayName.toLowerCase();
      const dayAvailability = availability[dayKey] || availability[dayName] || {};
      const dayWorkingHours = workingHours[dayKey] || workingHours[dayName] || {};
      
      // Horaires par défaut basés sur le professionnel
      let startHour = 9;
      let endHour = 18;
      let breakStart = 12;
      let breakEnd = 14;
      
      // Si le professionnel a des horaires spécifiques
      if (dayWorkingHours.start) {
        startHour = parseInt(dayWorkingHours.start.split(':')[0]);
      }
      if (dayWorkingHours.end) {
        endHour = parseInt(dayWorkingHours.end.split(':')[0]);
      }
      if (dayWorkingHours.breakStart) {
        breakStart = parseInt(dayWorkingHours.breakStart.split(':')[0]);
      }
      if (dayWorkingHours.breakEnd) {
        breakEnd = parseInt(dayWorkingHours.breakEnd.split(':')[0]);
      }
      
      // Générer les créneaux pour ce jour
      const slots: TimeSlot[] = [];
      
      // Créneaux du matin
      for (let hour = startHour; hour < breakStart; hour++) {
        slots.push({ time: `${hour.toString().padStart(2, '0')}:00`, available: true });
        slots.push({ time: `${hour.toString().padStart(2, '0')}:30`, available: true });
      }
      
      // Créneaux de l'après-midi
      for (let hour = breakEnd; hour < endHour; hour++) {
        slots.push({ time: `${hour.toString().padStart(2, '0')}:00`, available: true });
        slots.push({ time: `${hour.toString().padStart(2, '0')}:30`, available: true });
      }
      
      // Marquer les créneaux indisponibles selon les données du professionnel
      if (dayAvailability.unavailable) {
        const unavailableSlots = Array.isArray(dayAvailability.unavailable) 
          ? dayAvailability.unavailable 
          : [dayAvailability.unavailable];
        
        slots.forEach(slot => {
          if (unavailableSlots.includes(slot.time)) {
            slot.available = false;
          }
        });
      }
      
      schedule.push({
        date: formattedDate,
        dayName,
        expanded: i === 0, // Premier jour ouvert par défaut
        slots
      });
    }
    
    return schedule;
  };

  const [schedule, setSchedule] = useState<DaySchedule[]>(() => 
    generateScheduleForProfessional(selectedProfessionalData, totalDuration)
  );

  // Mettre à jour les créneaux quand le professionnel ou la durée totale change
  useEffect(() => {
    const newSchedule = generateScheduleForProfessional(selectedProfessionalData, totalDuration);
    setSchedule(newSchedule);
    console.log('🕒 Créneaux mis à jour pour le professionnel:', selectedProfessionalData?.name || selectedProfessionalData?.nom || 'Aucun', 'Durée totale:', totalDuration);
  }, [selectedProfessionalData, totalDuration]);

  // API call pour récupérer les créneaux réels du professionnel
  const { data: professionalSlots, isLoading: slotsLoading } = useQuery({
    queryKey: ['professional-slots', selectedProfessionalData?.id, totalDuration],
    queryFn: async () => {
      if (!selectedProfessionalData?.id) return null;
      
      const response = await fetch(`/api/professionals/${selectedProfessionalData.id}/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedServices.length > 0 ? selectedServices[0].id : null,
          totalDuration: totalDuration,
          dateRange: {
            start: new Date().toISOString().split('T')[0],
            end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        })
      });
      
      if (!response.ok) throw new Error('Erreur lors de la récupération des créneaux');
      return response.json();
    },
    enabled: !!selectedProfessionalData?.id && selectedServices.length > 0,
    retry: false
  });

  // Mettre à jour les créneaux avec les données réelles de l'API
  useEffect(() => {
    if (professionalSlots && professionalSlots.availability) {
      const updatedSchedule = schedule.map(day => {
        const dayData = professionalSlots.availability.find((d: any) => 
          d.date === day.date || d.dayName === day.dayName
        );
        
        if (dayData && dayData.slots) {
          // Filtrer les créneaux en fonction de la durée totale des prestations
          const availableSlots = dayData.slots.filter((slot: any) => {
            if (!slot.available || slot.booked) return false;
            
            // Vérifier si le créneau a assez de temps pour toutes les prestations
            const slotTime = new Date(`2000-01-01T${slot.time}`);
            const endTime = new Date(slotTime.getTime() + totalDuration * 60000);
            const endTimeString = endTime.toTimeString().slice(0, 5);
            
            // Vérifier qu'il n'y a pas de conflit avec d'autres créneaux
            const hasConflict = dayData.slots.some((otherSlot: any) => {
              if (otherSlot.time === slot.time || !otherSlot.booked) return false;
              const otherSlotTime = new Date(`2000-01-01T${otherSlot.time}`);
              const otherEndTime = new Date(otherSlotTime.getTime() + 60 * 60000); // 1h par défaut
              const otherEndTimeString = otherEndTime.toTimeString().slice(0, 5);
              
              return (slot.time < otherEndTimeString && endTimeString > otherSlot.time);
            });
            
            return !hasConflict;
          });
          
          return {
            ...day,
            slots: availableSlots.map((slot: any) => ({
              time: slot.time,
              available: true
            }))
          };
        }
        
        return day;
      });
      
      setSchedule(updatedSchedule);
      console.log('🕒 Créneaux mis à jour avec données API pour:', selectedProfessionalData?.name || selectedProfessionalData?.nom, 'Durée totale:', totalDuration);
    }
  }, [professionalSlots, selectedProfessionalData, totalDuration]);

  const toggleDay = (index: number) => {
    setSchedule(prev => prev.map((day, i) => 
      i === index ? { ...day, expanded: !day.expanded } : day
    ));
  };

  const selectTimeSlot = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime && selectedServices.length > 0) {
      // Stocker la sélection dans localStorage (legacy)
      localStorage.setItem('selectedDateTime', JSON.stringify({
        date: selectedDate,
        time: selectedTime
      }));
      
      // Stocker dans preBookingData pour le nouveau flux
      try {
        const existingData = sessionStorage.getItem('preBookingData');
        const parsed = existingData ? JSON.parse(existingData) : {};
        
        const updatedData = {
          ...parsed,
          selectedDate,
          selectedTime,
          selectedServices: selectedServices,
          totalDuration,
          totalPrice,
          serviceCount: selectedServices.length
        };
        
        sessionStorage.setItem('preBookingData', JSON.stringify(updatedData));
      } catch (e) {
        console.warn('Erreur sauvegarde preBookingData:', e);
      }
      
      // Rediriger vers la page de paiement BookingFix
      setLocation('/booking-fix');
    }
  };

  const handleBack = () => {
    // Retour vers la sélection de professionnel
    setLocation('/professional-selection');
  };

  // Fonctions pour la multi-sélection de prestations
  const toggleServiceSelection = (service: any) => {
    setSelectedServices(prev => {
      const isSelected = prev.some(s => s.id === service.id);
      if (isSelected) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const removeService = (serviceId: number) => {
    setSelectedServices(prev => prev.filter(s => s.id !== serviceId));
  };

  // Calculer la durée totale des prestations sélectionnées
  const totalDuration = selectedServices.reduce((total, service) => {
    return total + (service.duration || 60);
  }, 0);

  // Calculer le prix total des prestations sélectionnées
  const totalPrice = selectedServices.reduce((total, service) => {
    return total + (service.price || 0);
  }, 0);

  const handleAddService = () => {
    setShowServiceDropdown(!showServiceDropdown);
  };

  // Fonctions de gestion de l'édition
  const startEditPrice = () => {
    if (effectiveServiceData) {
      setEditPrice(effectiveServiceData.price.toString());
      setIsEditingPrice(true);
    }
  };

  const startEditDuration = () => {
    if (effectiveServiceData) {
      setEditDuration(effectiveServiceData.duration.toString());
      setIsEditingDuration(true);
    }
  };

  const cancelEdit = () => {
    setIsEditingPrice(false);
    setIsEditingDuration(false);
    setEditPrice('');
    setEditDuration('');
  };

  const savePrice = async () => {
    if (!bookingState.selectedServiceId || !effectiveServiceData) return;
    
    const newPrice = parseFloat(editPrice);
    if (isNaN(newPrice) || newPrice <= 0) return;

    const result = await updateService(salonId, bookingState.selectedServiceId, {
      price: newPrice
    });

    if (result.success) {
      setIsEditingPrice(false);
      // Invalidation ciblée du cache au lieu de reload
      // Le hook useEffectiveService se rechargera automatiquement
      console.log('[BookingDateTime] Prix mis à jour avec succès');
      // Note: Pour une invalidation propre, il faudrait useQueryClient ici
      window.location.reload(); // Temporaire - à remplacer par invalidateQueries
    }
  };

  const saveDuration = async () => {
    if (!bookingState.selectedServiceId || !effectiveServiceData) return;
    
    const newDuration = parseInt(editDuration);
    if (isNaN(newDuration) || newDuration <= 0) return;

    const result = await updateService(salonId, bookingState.selectedServiceId, {
      duration: newDuration
    });

    if (result.success) {
      setIsEditingDuration(false);
      // Invalidation ciblée du cache au lieu de reload
      console.log('[BookingDateTime] Durée mise à jour avec succès');
      // Note: Pour une invalidation propre, il faudrait useQueryClient ici
      window.location.reload(); // Temporaire - à remplacer par invalidateQueries
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <img 
              src="/avyento-logo.png" 
              alt="Avyento"
              className="w-auto"
              style={{ height: '115px' }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        {/* debug panel removed */}
        {/* Récapitulatif de réservation - style salon glassmorphism */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-sm p-4 lg:p-6 mx-4 lg:mx-0 mt-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{serviceDisplay.effectiveName}</h2>
          
          {/* Affichage du professionnel sélectionné (normalisé) */}
          <div className="mb-3 p-3 bg-violet-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={professionalDisplay.photo} 
                  alt={professionalDisplay.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">{professionalDisplay.name}</p>
                  <p className="text-sm text-gray-600">{professionalDisplay.role}</p>
                </div>
              </div>
              <button
                onClick={() => setLocation('/professional-selection')}
                className="text-violet-600 hover:text-violet-700 text-sm font-medium"
              >
                Changer
              </button>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            {/* Durée - éditable */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Durée :</span>
              {isEditingDuration ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    className="w-16 px-2 py-1 text-sm border rounded text-right"
                    placeholder="min"
                  />
                  <span className="text-xs text-gray-500">min</span>
                  <button onClick={saveDuration} disabled={isUpdating} className="p-1 text-green-600 hover:bg-green-50 rounded">
                    <Check size={14} />
                  </button>
                  <button onClick={cancelEdit} className="p-1 text-gray-400 hover:bg-gray-50 rounded">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <span className="font-medium">{serviceDisplay.effectiveDuration}</span>
                  <button 
                    onClick={startEditDuration} 
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <Edit2 size={12} />
                  </button>
                </div>
              )}
            </div>
            
            {/* Prix - éditable */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Prix :</span>
              {isEditingPrice ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-20 px-2 py-1 text-sm border rounded text-right"
                    placeholder="0.00"
                  />
                  <span className="text-xs text-gray-500">€</span>
                  <button onClick={savePrice} disabled={isUpdating} className="p-1 text-green-600 hover:bg-green-50 rounded">
                    <Check size={14} />
                  </button>
                  <button onClick={cancelEdit} className="p-1 text-gray-400 hover:bg-gray-50 rounded">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <span className="font-medium">{serviceDisplay.effectivePrice}</span>
                  <button 
                    onClick={startEditPrice} 
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <Edit2 size={12} />
                  </button>
                </div>
              )}
            </div>
            {selectedDate && selectedTime && (
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date :</span>
                  <span className="font-medium">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Heure :</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
              </div>
            )}
          </div>
        </div>


        {/* Sélection de prestations multiples */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-sm p-4 lg:p-6 mx-4 lg:mx-0 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Prestations sélectionnées</h3>
            <Button 
              onClick={handleAddService}
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-4 py-2"
            >
              {showServiceDropdown ? 'Masquer' : 'Ajouter une prestation'}
            </Button>
          </div>

          {/* Liste des prestations sélectionnées */}
          {selectedServices.length > 0 ? (
            <div className="space-y-2 mb-4">
              {selectedServices.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 bg-violet-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{service.name}</div>
                    <div className="text-sm text-gray-600">{service.duration || 60} min - {formatPrice(service.price || 0)}</div>
                  </div>
                  <button
                    onClick={() => removeService(service.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              
              {/* Résumé total */}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total :</span>
                  <span className="text-violet-600">{totalDuration} min - {formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Aucune prestation sélectionnée</p>
              <p className="text-sm">Cliquez sur "Ajouter une prestation" pour commencer</p>
            </div>
          )}

          {/* Liste déroulante des services disponibles */}
          {showServiceDropdown && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {servicesLoading ? (
                <div className="text-gray-500 text-center py-4">Chargement des services...</div>
              ) : (
                availableServices.map((service: any) => {
                  const isSelected = selectedServices.some(s => s.id === service.id);
                  return (
                    <div
                      key={service.id}
                      onClick={() => toggleServiceSelection(service)}
                      className={`p-3 rounded-lg cursor-pointer border-2 transition-colors ${
                        isSelected
                          ? 'border-violet-600 bg-violet-50'
                          : 'border-gray-200 bg-gray-50 hover:border-violet-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-900">{service.name}</div>
                          <div className="text-sm text-gray-600">{service.duration || 60} min</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-violet-600">{formatPrice(service.price || 0)}</div>
                          {isSelected && <Check className="w-5 h-5 text-violet-600" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Étape */}
        <div className="px-4 mb-4">
          <div className="text-sm text-violet-600 font-medium mb-1">2. Choix de la date & heure</div>
        </div>

        {/* Planning par jour - responsive */}
        <div className="space-y-1 mx-4 lg:mx-0">
          {schedule.map((day, index) => (
            <div key={day.date} className="bg-white/95 backdrop-blur-md rounded-xl border border-gray-200/50 shadow-sm overflow-hidden">
              {/* En-tête du jour */}
              <button
                onClick={() => toggleDay(index)}
                className="w-full px-4 lg:px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
              >
                <span className="font-medium text-gray-900">{day.date}</span>
                {day.expanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {/* Créneaux horaires - responsive grid */}
              {day.expanded && (
                <div className="px-4 lg:px-6 pb-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-3">
                    {day.slots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => selectTimeSlot(day.date, slot.time)}
                        disabled={!slot.available}
                        className={`h-10 lg:h-12 rounded-xl border text-sm font-medium transition-all ${
                          selectedDate === day.date && selectedTime === slot.time
                            ? 'bg-violet-600 text-white border-violet-600 shadow-lg'
                            : slot.available
                            ? 'bg-gray-50 text-gray-900 border-gray-200 hover:bg-gray-100 hover:border-violet-300'
                            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer avec bouton Continuer - responsive */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            <Button
              onClick={handleContinue}
              disabled={!selectedDate || !selectedTime || selectedServices.length === 0}
              className="w-full h-12 lg:h-14 bg-violet-600 hover:bg-violet-700 text-white font-semibold disabled:bg-gray-300 rounded-xl text-base lg:text-lg"
            >
              Continuer
            </Button>
          </div>
        </div>

        {/* Footer Avyento */}
        <div className="text-center py-4 text-xs text-gray-500">
          avyento.com
        </div>
      </div>
    </div>
  );
}