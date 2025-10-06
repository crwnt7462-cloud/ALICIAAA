import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, User, Clock } from 'lucide-react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  specialist: string;
}

interface StaffMember {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  specialties?: string;
  serviceIds?: string[];
  isActive: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface BookingData {
  selectedService: Service | null;
  selectedDate: string;
  selectedTime: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
}

export default function BookingPage() {
  console.log('🚀 BOOKING PAGE LOADED! Component is mounting...');
  
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedStaffMember, setSelectedStaffMember] = useState<StaffMember | null>(null);
  
  const [bookingData, setBookingData] = useState<BookingData>({
    selectedService: null,
    selectedDate: '',
    selectedTime: '',
    clientName: '',
    clientPhone: '',
    clientEmail: ''
  });

  // Extraire le public_slug depuis l'URL /salon/:public_slug/reserver ou /book/:public_slug/reserver
  // Utiliser window.location.pathname comme fallback plus fiable
  const currentPath = window.location.pathname;
  const slugMatchFromWindow = currentPath.match(/^\/(salon|book)\/([^/]+)\/reserver$/);
  const slugMatchFromWouter = location.match(/^\/(salon|book)\/([^/]+)\/reserver$/);

  // Follow ServiceSelection behaviour: prefer URL slug, fallback to sessionStorage
  const urlSlug = slugMatchFromWindow?.[2] || slugMatchFromWouter?.[2];
  const storedSlug = typeof window !== 'undefined' ? sessionStorage.getItem('salonSlug') : null;
  const publicSlug = urlSlug || storedSlug || null;

  // Persist slug found in URL to sessionStorage so other pages can reuse it
  useEffect(() => {
    if (urlSlug) {
      try { sessionStorage.setItem('salonSlug', urlSlug); } catch (e) { /* ignore */ }
    }
  }, [urlSlug]);

  // Debug: afficher les valeurs pour diagnostic
  console.log('🔍 BookingPage DEBUG:');
  console.log('- location (wouter):', location);
  console.log('- window.location.pathname:', currentPath);
  console.log('- slugMatchFromWindow:', slugMatchFromWindow);
  console.log('- slugMatchFromWouter:', slugMatchFromWouter);
  console.log('- publicSlug final:', publicSlug);

  // Récupérer les données du salon par son slug public
  const { data: salonData, isLoading: salonLoading, error: salonError } = useQuery({
    queryKey: ['public-salon', publicSlug],
    queryFn: async () => {
      if (!publicSlug) throw new Error('Slug public manquant');
      const response = await fetch(`/api/public/salon/${publicSlug}`);
      if (!response.ok) {
        throw new Error('Salon non trouvé');
      }
      const payload = await response.json();
      // API returns { ok: true, salon: {...} }
      return payload.salon ?? null;
    },
    enabled: !!publicSlug,
    retry: false
  });

  const salonId = salonData?.id;

  // Log when salon data loads and emit missing indicators
  useEffect(() => {
    if (!publicSlug) return;
    if (salonData) {
      const sCount = Array.isArray(salonData.services) ? salonData.services.length : 0;
      const tCount = Array.isArray(salonData.team_members) ? salonData.team_members.length : 0;
      console.log('booking_page_fetch_ok', { slug: publicSlug, services: sCount, staff: tCount });
      if (sCount === 0) console.log('booking_page_missing_services', { slug: publicSlug });
      if (tCount === 0) console.log('booking_page_missing_staff', { slug: publicSlug });
    }
  }, [publicSlug, salonData]);

  // Map services from salonData (tolerant mapping)
  const services: Service[] = (salonData?.services || []).map((s: any) => {
    const id = String(s?.id ?? s?.serviceId ?? s?.service_id ?? s?.slug ?? '');
    const name = s?.name ?? s?.service_name ?? '';
    const priceRaw = s?.price ?? s?.amount ?? s?.price_cents ?? 0;
    const priceNum = Number(priceRaw);
    const price = Number.isNaN(priceNum) ? 0 : priceNum;
    const durationRaw = s?.duration ?? s?.duration_minutes ?? s?.effective_duration ?? 0;
    const durationNum = Number(durationRaw);
    const duration = Number.isNaN(durationNum) ? 0 : durationNum;
    return {
      id,
      name,
      price,
      duration,
      specialist: s?.specialist ?? 'À sélectionner'
    } as Service;
  });

  // Map staff members from salonData.team_members
  const staffMembers: StaffMember[] = (salonData?.team_members || salonData?.teamMembers || []).map((p: any) => {
    // tolerant name split
    const full = p?.name ?? `${p?.firstName ?? ''} ${p?.lastName ?? ''}`.trim();
    const parts = full.split(' ').filter(Boolean);
    const firstName = parts.shift() ?? '';
    const lastName = parts.join(' ') ?? '';
    return {
      id: p?.id ?? p?.professional_id ?? 0,
      firstName,
      lastName,
      email: p?.email ?? undefined,
      phone: p?.phone ?? undefined,
      specialties: p?.specialties ?? p?.bio ?? undefined,
      serviceIds: p?.service_ids ?? p?.serviceIds ?? p?.services ?? [],
      isActive: p?.is_active ?? p?.isActive ?? true
    } as StaffMember;
  });

  // We don't have a dedicated staff loading query; reuse salonLoading as staffLoading
  const staffLoading = salonLoading;

  const timeSlots: TimeSlot[] = [
    { time: '09:00', available: true },
    { time: '10:30', available: false },
    { time: '12:00', available: true },
    { time: '14:00', available: true },
    { time: '15:30', available: false },
    { time: '17:00', available: true }
  ];

  const handleServiceSelect = (service: Service) => {
    setBookingData(prev => ({ ...prev, selectedService: service }));
    setStep(2); // Aller à l'étape sélection du professionnel
    // Persist to sessionStorage.currentBooking
    try {
      console.log("handleServiceSelect called with:", service);
      const prev = JSON.parse(sessionStorage.getItem('currentBooking') || '{}');
      const next = {
        ...(typeof prev === 'object' ? prev : {}),
        slug: publicSlug,
        serviceId: service.id,
        serviceName: service.name,
        price: service.price,
        duration: service.duration
      };
      sessionStorage.setItem('currentBooking', JSON.stringify(next));
    } catch (e) { /* ignore */ }
  };

  const handleStaffSelect = (staff: StaffMember) => {
    setSelectedStaffMember(staff);
    setStep(3); // Aller à l'étape sélection du créneau
    try {
      console.log("handleStaffSelect called with:", staff);
      const prev = JSON.parse(sessionStorage.getItem('currentBooking') || '{}');
      const next = {
        ...(typeof prev === 'object' ? prev : {}),
        proId: staff.id,
        proName: `${staff.firstName} ${staff.lastName}`.trim()
      };
      sessionStorage.setItem('currentBooking', JSON.stringify(next));
    } catch (e) { /* ignore */ }
  };

  const handleTimeSelect = (date: string, time: string) => {
    setBookingData(prev => ({ ...prev, selectedDate: date, selectedTime: time }));
    setStep(4); // Aller à l'étape informations client
    try {
      const prev = JSON.parse(sessionStorage.getItem('currentBooking') || '{}');
      // Compose ISO datetime (assume local date string YYYY-MM-DD)
      const iso = new Date(`${date}T${time}:00`).toISOString();
      const dateTimeISO = iso;
      console.log("handleTimeSelect called with:", dateTimeISO);
      const next = {
        ...(typeof prev === 'object' ? prev : {}),
        datetimeISO: iso
      };
      sessionStorage.setItem('currentBooking', JSON.stringify(next));
    } catch (e) { /* ignore */ }
  };

  const handleBookingSubmit = () => {
    if (!bookingData.clientName || !bookingData.clientPhone) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir votre nom et téléphone",
        variant: "destructive"
      });
      return;
    }
    
    // Simuler paiement
    toast({
      title: "Paiement en cours...",
      description: "Redirection vers Stripe"
    });
    
    setTimeout(() => {
      setStep(5); // Étape de confirmation finale
    }, 2000);
  };

  // Gestion des erreurs et du chargement
  if (!publicSlug) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto m-4">
          <CardContent className="text-center py-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Erreur d'URL
            </h2>
            <p className="text-gray-600 mb-4">
              Le lien de réservation semble invalide.
            </p>
            <Button onClick={() => window.history.back()}>
              Retour
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (salonLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du salon...</p>
        </div>
      </div>
    );
  }

  if (salonError || !salonData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto m-4">
          <CardContent className="text-center py-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Salon non trouvé
            </h2>
            <p className="text-gray-600 mb-4">
              Ce salon n'existe pas ou n'est plus disponible.
            </p>
            <Button onClick={() => window.history.back()}>
              Retour
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Debug Info - À SUPPRIMER PLUS TARD */}
      <div className="bg-red-100 p-4 border-b-2 border-red-300">
        <p><strong>DEBUG:</strong></p>
        <p>publicSlug: {publicSlug || 'MANQUANT'}</p>
        <p>salonLoading: {salonLoading ? 'OUI' : 'NON'}</p>
        <p>salonError: {salonError ? 'OUI' : 'NON'}</p>
        <p>salonData: {salonData ? 'TROUVÉ' : 'MANQUANT'}</p>
        <p>URL: {window.location.pathname}</p>
      </div>
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">Réservation - {salonData.name}</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Progress indicator */}
        <div className="flex items-center mb-6">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= num 
                    ? 'bg-violet-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {num}
              </div>
              {num < 4 && (
                <div 
                  className={`h-0.5 w-8 mx-2 ${
                    step > num ? 'bg-violet-600' : 'bg-gray-200'
                  }`} 
                />
              )}
            </div>
          ))}
        </div>

        {/* Étape 1: Services */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Choisissez votre service
            </h2>
            {services.map((service) => (
              <Card
                key={service.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleServiceSelect(service)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-600">{service.duration} min • {service.specialist}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">{service.price}€</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Étape 2: Sélection du professionnel */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Choisissez votre professionnel
            </h2>
            
            {staffLoading ? (
              <div className="space-y-3">
                <div className="h-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-16 bg-gray-200 rounded animate-pulse" />
              </div>
            ) : staffMembers.length > 0 ? (
              <div className="space-y-3">
                {staffMembers.map((staff) => (
                  <Card
                    key={staff.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleStaffSelect(staff)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-violet-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {staff.firstName} {staff.lastName}
                            </h3>
                            {staff.specialties && (
                              <p className="text-sm text-gray-600">
                                Spécialités: {Array.isArray(staff.specialties) ? staff.specialties.join(', ') : staff.specialties}
                              </p>
                            )}
                          </div>
                        </div>
                        <ArrowLeft className="w-5 h-5 text-violet-600 rotate-180" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun professionnel disponible
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Le salon n'a pas encore configuré son équipe.
                  </p>
                  <Button 
                    onClick={() => setStep(3)}
                    className="bg-violet-600 hover:bg-violet-700"
                  >
                    Continuer sans sélection
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Étape 3: Date & Heure */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Choisissez une date
            </h2>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Aujourd'hui - 25 Janvier</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={slot.available ? "outline" : "secondary"}
                      disabled={!slot.available}
                      onClick={() => handleTimeSelect('2025-01-25', slot.time)}
                      className="h-10"
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Étape 4: Informations client */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Vos informations
            </h2>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Service:</span>
                  <span className="text-sm font-medium">{bookingData.selectedService?.name}</span>
                </div>
                {selectedStaffMember && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Professionnel:</span>
                    <span className="text-sm font-medium">{selectedStaffMember.firstName} {selectedStaffMember.lastName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Date:</span>
                  <span className="text-sm font-medium">{bookingData.selectedDate} à {bookingData.selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Prix:</span>
                  <span className="text-sm font-medium">{bookingData.selectedService?.price}€</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Nom complet *"
                  value={bookingData.clientName}
                  onChange={(e) => setBookingData(prev => ({ ...prev, clientName: e.target.value }))}
                  className="h-9 text-sm"
                />
                <Input
                  placeholder="Téléphone *"
                  value={bookingData.clientPhone}
                  onChange={(e) => setBookingData(prev => ({ ...prev, clientPhone: e.target.value }))}
                  className="h-9 text-sm"
                />
                <Input
                  placeholder="Email"
                  value={bookingData.clientEmail}
                  onChange={(e) => setBookingData(prev => ({ ...prev, clientEmail: e.target.value }))}
                  className="h-9 text-sm"
                />
              </CardContent>
            </Card>

            <Button
              onClick={handleBookingSubmit}
              disabled={!bookingData.clientName || !bookingData.clientPhone}
              className="w-full h-10 bg-gray-900 hover:bg-gray-800 text-white rounded-xl"
            >
              Payer l'acompte ({Math.round((bookingData.selectedService?.price || 0) * 0.3)}€)
            </Button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Paiement sécurisé par Stripe • Total: {bookingData.selectedService?.price}€
              </p>
            </div>
          </div>
        )}

        {/* Étape 5: Confirmation */}
        {step === 5 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Réservation confirmée !
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Vous recevrez un SMS de confirmation
            </p>
            <Button
              onClick={() => window.history.back()}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              Retour
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}