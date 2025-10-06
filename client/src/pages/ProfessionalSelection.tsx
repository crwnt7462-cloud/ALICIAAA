import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import useBookingWizard from "@/hooks/useBookingWizard";

export default function ProfessionalSelection() {
  const [, setLocation] = useLocation();
  const [location] = useLocation();
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const { bookingState, setSelectedPro } = useBookingWizard();
  const hasAutoRedirectedRef = useRef(false);
  
  // Récupérer le service sélectionné depuis localStorage
  const selectedServiceData = localStorage.getItem('selectedService');
  const selectedService = selectedServiceData ? JSON.parse(selectedServiceData) : null;
  // Slug detection: prefer URL then sessionStorage
  const urlMatch = location.match(/^\/salon\/([^/]+)/);
  const urlSlug = urlMatch?.[1] ?? null;
  const storedSlug = typeof window !== 'undefined' ? sessionStorage.getItem('salonSlug') : null;
  const slug = urlSlug || storedSlug || null;

  // Persist slug from URL into sessionStorage
  useEffect(() => {
    if (urlSlug) {
      try { sessionStorage.setItem('salonSlug', urlSlug); } catch (e) { /* ignore */ }
    }
  }, [urlSlug]);

  // Fetch public salon data (team_members) via public API
  const { data: salonPayload, isLoading, error } = useQuery({
    queryKey: ['public-salon', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Slug manquant');
      const res = await fetch(`/api/public/salon/${slug}`);
      if (!res.ok) throw new Error('Salon non trouvé');
      const payload = await res.json();
      return payload.salon ?? null;
    },
    enabled: !!slug,
    retry: false
  });

  // Map team_members to professionals expected by the UI (tolerant mapping)
  // If salonPayload is missing or has no team, try cached payloads (sessionStorage/localStorage)
  const cachedPayloadRaw = typeof window !== 'undefined' ? (sessionStorage.getItem('publicSalonPayload') || localStorage.getItem('salonPayload')) : null;
  let cachedPayload = null;
  try {
    cachedPayload = cachedPayloadRaw ? JSON.parse(cachedPayloadRaw) : null;
  } catch (e) {
    cachedPayload = null;
  }

  const teamSource = (salonPayload?.team_members && salonPayload.team_members.length > 0)
    ? salonPayload.team_members
    : (salonPayload?.teamMembers && salonPayload.teamMembers.length > 0)
      ? salonPayload.teamMembers
      : (cachedPayload?.team_members || cachedPayload?.teamMembers || []);

  const professionals = (teamSource || []).map((p: any) => ({
    id: String(p?.id ?? p?.professional_id ?? p?.uuid ?? ''),
    photo: p?.avatar ?? p?.photo ?? p?.image ?? '',
    name: p?.name ?? `${p?.firstName ?? ''} ${p?.lastName ?? ''}`.trim(),
    role: p?.role ?? p?.title ?? '',
    rating: p?.rating ?? 0,
    reviewCount: p?.review_count ?? p?.reviews ?? 0,
    specialties: Array.isArray(p?.specialties) ? p.specialties : typeof p?.specialties === 'string' ? p.specialties.split(',').map((s: string) => s.trim()) : [],
    nextAvailable: p?.next_available ?? p?.nextAvailable ?? '',
    bio: p?.bio ?? p?.description ?? ''
  }));

  // State to hold fallback professionals fetched from internal endpoint
  const [fallbackPros, setFallbackPros] = useState<any[]>([]);
  const [fallbackLoading, setFallbackLoading] = useState(false);

  // If no professionals from public payload, try internal endpoint /api/salons/:id/professionals
  useEffect(() => {
    const hasNoTeam = !teamSource || (Array.isArray(teamSource) && teamSource.length === 0);
    const salonId = salonPayload?.id || cachedPayload?.id || null;
    if (hasNoTeam && salonId && !isLoading) {
      // avoid duplicate calls
      if (fallbackLoading || fallbackPros.length > 0) return;
      setFallbackLoading(true);
      (async () => {
        try {
          const res = await fetch(`/api/salons/${salonId}/professionals`);
          if (!res.ok) throw new Error('no-pros');
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // map server response shape to UI shape
            const mapped = data.map((p: any) => ({
              id: String(p.id || p.uuid || p.professional_id || ''),
              photo: p.avatarUrl || p.avatar || p.photo || p.photo_url || p.image || '',
              name: p.name || p.nom || `${p.firstName || ''} ${p.lastName || ''}`.trim(),
              role: p.title || p.metier || p.role || '',
              rating: p.rating || p.note || 0,
              reviewCount: p.reviewsCount || p.reviews || p.avis || 0,
              specialties: p.tags || p.specialites || [],
              nextAvailable: p.nextAvailable || p.next_available || '',
              bio: p.bio || p.description || null
            }));
            setFallbackPros(mapped);
            console.log('professional_selection_fallback_ok', { salonId, count: mapped.length });
          } else {
            console.warn('professional_selection_fallback_empty', { salonId });
          }
        } catch (e: any) {
          console.warn('professional_selection_fallback_err', { salonId, err: e?.message || String(e) });
        } finally {
          setFallbackLoading(false);
        }
      })();
    }
  }, [teamSource, salonPayload, cachedPayload, isLoading]);

  // Final list to render: prefer public team, else fallbackPros
  const professionalsToRender = (teamSource && teamSource.length > 0) ? professionals : fallbackPros;

  // Logs for success/error/no-slug
  useEffect(() => {
    if (!slug) {
      console.warn('professional_selection_err_no_slug');
    }
  }, [slug]);

  useEffect(() => {
    if (salonPayload) {
      console.log('professional_selection_fetch_ok', { slug, count: professionals.length });
      if (professionals.length === 0) console.warn('professional_selection_missing_staff', { slug });
    }
    if (error) console.warn('professional_selection_fetch_err', { slug });
    // If error or no professionals, report that we're using cached payload
    if ((error || professionals.length === 0) && cachedPayload) {
      console.log('professional_selection_using_cached_payload', { from: cachedPayloadRaw ? 'session/local' : 'none', count: (cachedPayload.team_members || cachedPayload.teamMembers || []).length });
    }
  }, [salonPayload, professionals.length, error, slug]);

  // Log d'entrée sur la page
  useEffect(() => {
    console.log('booking_step_professional_enter', { serviceId: bookingState.selectedServiceId || selectedService?.id });
  }, [bookingState.selectedServiceId, selectedService?.id]);

  // Gestion du loading (skeleton existant)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des professionnels...</p>
        </div>
      </div>
    );
  }

  // Gestion d'erreur avec fallback (pas nécessaire car déjà géré dans le hook)
  if (error) {
    console.warn('pros_fallback_mock', { error: error.message });
  }

  // If single professional, auto-select and redirect (protect against loops)
  React.useEffect(() => {
    if (!isLoading && professionalsToRender.length === 1 && !hasAutoRedirectedRef.current) {
      hasAutoRedirectedRef.current = true;
      console.log('booking_auto_select_single_professional', { professionalId: professionalsToRender[0].id });
      localStorage.setItem('selectedProfessional', JSON.stringify(professionalsToRender[0]));
      setSelectedPro(professionalsToRender[0].id, professionalsToRender[0]);
      setLocation('/service-selection');
    }
  }, [professionalsToRender, setLocation, isLoading, setSelectedPro]);

  const handleProfessionalSelect = (professionalId: string) => {
    setSelectedProfessional(professionalId);
  const professional = professionalsToRender.find((p: any) => p.id === professionalId);
    if (professional) {
      // Mettre à jour le wizard state
      setSelectedPro(professionalId, professional);
      // Navigation immédiate vers l'étape suivante
      setLocation('/service-selection');
    }
  };

  const handleContinue = () => {
    if (selectedProfessional) {
  const professional = professionalsToRender.find((p: any) => p.id === selectedProfessional);
      if (professional) {
        setSelectedPro(selectedProfessional, professional);
        setLocation('/service-selection');
      }
    }
  };

  // If no slug -> show not found
  if (!slug) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Salon introuvable</p>
        </div>
      </div>
    );
  }

  // If loading, show loader (existing skeleton)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des professionnels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Choisir un professionnel</h1>
            {selectedService && (
              <p className="text-sm text-gray-600 mt-1">
                Service: <span className="font-medium">{selectedService.name}</span> • {selectedService.duration} • {selectedService.price}€
              </p>
            )}
          </div>
        </div>

        {/* Liste des professionnels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {professionalsToRender.map((professional: any) => (
            <Card
              key={professional.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                selectedProfessional === professional.id
                  ? 'border-violet-500 bg-violet-50'
                  : 'border-gray-200 hover:border-violet-300'
              }`}
              onClick={() => setSelectedProfessional(professional.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  {professional.photo && (
                    <img
                      src={professional.photo}
                      alt={professional.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{professional.name}</h3>
                    <p className="text-sm text-violet-600 font-medium">{professional.role}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{professional.rating}</span>
                      <span className="text-sm text-gray-500">({professional.reviewCount} avis)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Spécialités :</p>
                    <div className="flex flex-wrap gap-1">
                      {professional.specialties.slice(0, 3).map((specialty: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-violet-100 text-violet-700"
                        >
                          {specialty}
                        </Badge>
                      ))}
                      {professional.specialties.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{professional.specialties.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Prochaine disponibilité :</p>
                    <p className="text-sm font-medium text-green-600">{professional.nextAvailable}</p>
                  </div>

                  {professional.bio && (
                    <div>
                      <p className="text-sm text-gray-500 line-clamp-2">{professional.bio}</p>
                    </div>
                  )}
                </div>

                {selectedProfessional === professional.id && (
                  <div className="mt-4 pt-4 border-t border-violet-200">
                    <div className="flex items-center justify-center">
                      <Badge className="bg-violet-500 text-white">
                        Sélectionné
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bouton de continuation */}
        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedProfessional}
            className="w-full md:w-auto px-8 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-300"
          >
            Continuer
          </Button>
        </div>
      </div>
    </div>
  );
}