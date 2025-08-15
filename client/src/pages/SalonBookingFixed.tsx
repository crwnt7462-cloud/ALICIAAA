import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { getGenericGlassButton } from "@/lib/salonColors";
import { useNavigation } from "@/hooks/useNavigation";
import { useLogger } from "@/logger";
import { getSalonBySlug, getProfessionals, getServices, createPaymentIntent, ApiRequestError } from "@/api";
import type { Salon, Professional, Service, PreBookingData } from "@/types";
import {
  ArrowLeft, ChevronDown, ChevronUp, Eye, EyeOff, X
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import BookingConfirmationModal from '@/components/BookingConfirmationModal';

// Configuration Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

// Fonction utilitaire pour gérer les spécialités de manière robuste
const getSpecialtiesText = (specialties: any): string => {
  if (Array.isArray(specialties)) {
    return specialties.length > 0 ? specialties.join(', ') : 'Spécialiste';
  }
  if (typeof specialties === 'string' && specialties.trim()) {
    return specialties;
  }
  return 'Spécialiste';
};

const getSpecialtiesArray = (specialties: any): string[] => {
  if (Array.isArray(specialties)) {
    return specialties.filter(s => s && typeof s === 'string');
  }
  if (typeof specialties === 'string' && specialties.trim()) {
    return specialties.split(',').map(s => s.trim()).filter(s => s);
  }
  return ['Spécialiste'];
};

// Composant de paiement Stripe intégré
function StripePaymentForm({ onSuccess, clientSecret, selectedService }: { onSuccess: () => void, clientSecret: string, selectedService?: Service | null }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements || !clientSecret) return;
    
    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    try {
      // Confirmer le paiement avec Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: "Client",
            email: "client@example.com",
          },
        },
      });

      if (error) {
        setError(error.message || "Erreur lors du paiement");
      } else if (paymentIntent?.status === 'succeeded') {
        // Paiement réussi
        onSuccess();
      }
    } catch (err) {
      setError("Erreur lors du paiement. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <Button 
        type="submit"
        disabled={!stripe || isProcessing}
        className={`w-full ${getGenericGlassButton(0)} text-white py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all`}
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Traitement en cours...
          </div>
        ) : (
          `Confirmer & Payer ${selectedService ? ((selectedService.depositAmount || (selectedService.price * 0.3) || selectedService.price).toFixed(2)) : '20,00'} €`
        )}
      </Button>
    </form>
  );
}

function SalonBookingFixed() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { navigate, location } = useNavigation();
  const logger = useLogger('SalonBooking');
  
  // ✅ TOUS LES HOOKS AU DÉBUT - ORDRE FIXE GARANTI
  const [match, params] = useRoute('/salon-booking/:slug');
  const salonSlug = params?.slug;
  
  // États pour le processus de réservation
  const [preBooking, setPreBooking] = useState<PreBookingData | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ time: string; date: string } | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'partial' | 'full' | 'gift'>('partial');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: ''
  });
  const [formData, setFormData] = useState({
    staffMember: '',
    phone: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    acceptCGU: false,
    saveCard: false
  });

  // État pour les dates disponibles
  const availableDates = [
    { date: '2024-01-15', day: 'Lun', expanded: false },
    { date: '2024-01-16', day: 'Mar', expanded: false },
    { date: '2024-01-17', day: 'Mer', expanded: false }
  ];
  const [dateStates, setDateStates] = useState(availableDates);

  // Effet pour vérifier si l'utilisateur est connecté
  useEffect(() => {
    const token = localStorage.getItem('clientToken');
    if (token) {
      setIsUserLoggedIn(true);
    }
  }, []);

  // Effet pour récupérer les données de pré-réservation
  useEffect(() => {
    const preBookingData = sessionStorage.getItem('preBookingData');
    const parsedData = preBookingData ? JSON.parse(preBookingData) : null;
    setPreBooking(parsedData);
    logger.debug('Pre-booking data retrieved from sessionStorage', { parsedData });
  }, [logger]);

  // Effet pour sauvegarder le slug du salon
  useEffect(() => {
    if (salonSlug) {
      sessionStorage.setItem('currentSalonSlug', salonSlug);
      logger.debug('Salon slug saved to sessionStorage', { salonSlug });
    }
  }, [salonSlug, logger]);

  // Requêtes API - TOUS DÉFINIS AVANT EARLY RETURNS
  const { data: realSalonData, isLoading: salonLoading, error: salonError } = useQuery({
    queryKey: ['salon', salonSlug],
    queryFn: () => getSalonBySlug(salonSlug!),
    enabled: !!salonSlug,
    retry: 1,
  });

  const { data: professionals = [], isLoading: professionalsLoading } = useQuery({
    queryKey: ['professionals', realSalonData?.id || salonSlug],
    queryFn: () => getProfessionals({ salonId: (realSalonData?.id || salonSlug)! }),
    enabled: !!salonSlug && !!realSalonData,
    retry: 1
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['services', realSalonData?.id || salonSlug],
    queryFn: () => getServices({ salonId: (realSalonData?.id || salonSlug)! }),
    enabled: !!salonSlug && !!realSalonData,
    retry: 1
  });

  // Effet pour charger les données sauvegardées après chargement des données
  useEffect(() => {
    // Attendre que preBooking soit chargé
    if (preBooking === null) return;
    
    // Vérifier d'abord s'il y a des données de pré-réservation
    if (preBooking && typeof preBooking === 'object' && preBooking.serviceId) {
      console.log('✅ Service trouvé dans pré-réservation:', preBooking.serviceName);
      const serviceData = {
        id: preBooking.serviceId,
        name: preBooking.serviceName,
        price: preBooking.servicePrice,
        duration: preBooking.serviceDuration
      };
      setSelectedService(serviceData);
      
      // Pré-remplir la date et l'heure si disponibles
      if (preBooking.selectedDate) setSelectedDate(preBooking.selectedDate);
      if (preBooking.selectedTime) {
        setSelectedSlot({ time: preBooking.selectedTime, date: preBooking.selectedDate });
      }
      
      // Aller directement à l'étape de sélection du professionnel
      setCurrentStep(2);
      return;
    }
    
    // Fallback sur sessionStorage
    const savedService = sessionStorage.getItem('selectedService');
    console.log('🔍 Service dans sessionStorage:', savedService);
    
    if (savedService) {
      try {
        const serviceData = JSON.parse(savedService);
        console.log('💰 Service sélectionné au rendu:', serviceData);
        setSelectedService(serviceData);
        // Aller directement à l'étape de sélection du professionnel
        setCurrentStep(2);
      } catch (error) {
        console.error('Erreur lors de la récupération du service:', error);
      }
    } else {
      console.log('⚠️ Aucun service trouvé dans sessionStorage - récupération des services réels');
      // Ne pas utiliser de service par défaut - forcer l'utilisateur à sélectionner un service réel
      setSelectedService(null);
    }

    // Restaurer l'état de réservation si l'utilisateur revient de la connexion
    const savedBooking = sessionStorage.getItem('currentBooking');
    if (savedBooking) {
      try {
        const bookingState = JSON.parse(savedBooking);
        if (bookingState.currentStep) {
          setCurrentStep(bookingState.currentStep);
          setSelectedDate(bookingState.selectedDate);
          if (bookingState.selectedTime) {
            setSelectedSlot({ time: bookingState.selectedTime, date: bookingState.selectedDate });
          }
          // Restaurer le professionnel sélectionné (sera fait quand professionals sera chargé)
          if (bookingState.professionalName) {
            // Stocker le nom pour le restaurer plus tard
            sessionStorage.setItem('pendingProfessionalName', bookingState.professionalName);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la restauration de la réservation:', error);
      }
    }

    // Vérifier si l'utilisateur est connecté
    const userToken = localStorage.getItem('clientToken');
    if (userToken) {
      setIsUserLoggedIn(true);
    }
  }, [preBooking]);

  // Données dérivées - CALCULÉES APRÈS LES HOOKS
  const salon: Salon | null = realSalonData || null;
  const salonId = realSalonData?.id || salonSlug;
  const professionalsArray = Array.isArray(professionals) ? professionals : [];
  const professionalsCount = professionalsArray.length;
  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
  const service = selectedService;

  // Effet pour restaurer le professionnel après chargement des données
  useEffect(() => {
    if (professionalsArray.length > 0) {
      const pendingProfName = sessionStorage.getItem('pendingProfessionalName');
      if (pendingProfName) {
        const prof = professionalsArray.find((p: any) => p?.name === pendingProfName);
        if (prof) {
          setSelectedProfessional(prof);
          sessionStorage.removeItem('pendingProfessionalName');
        }
      }
    }
  }, [professionalsArray]);

  // Logging centralisé
  logger.info('Salon data loaded', {
    salonSlug,
    salonId,
    salonName: realSalonData?.name,
    salonLoading,
    hasError: !!salonError
  });

  logger.info('Professionals data loaded', {
    professionalsCount,
    professionalsLoading,
    hasPendingRestore: !!sessionStorage.getItem('pendingProfessionalName')
  });

  // EARLY RETURNS - APRÈS TOUS LES HOOKS
  if (salonLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement du salon {salonSlug}...</p>
        </div>
      </div>
    );
  }

  if (!realSalonData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Salon non trouvé</h1>
          <p className="text-gray-400 mb-4">Le salon {salonSlug} n'existe pas dans nos données.</p>
          <button 
            onClick={() => {
              navigate('/search', 'salon-not-found', { salonSlug });
            }}
            className="bg-violet-600 hover:bg-violet-700 px-6 py-2 rounded-lg transition-colors"
          >
            Rechercher un salon
          </button>
        </div>
      </div>
    );
  }

  // FONCTIONS UTILITAIRES
  const toggleDateExpansion = (index: number) => {
    setDateStates((prev: any[]) => prev.map((date: any, i: number) => 
      i === index ? { ...date, expanded: !date.expanded } : date
    ));
  };

  const handleServiceSelect = (service: Service) => {
    logger.info('Service selected', {
      serviceId: service.id,
      serviceName: service.name,
      servicePrice: service.price,
      professionalsStatus: {
        loaded: Array.isArray(professionalsArray),
        count: professionalsCount,
        loading: professionalsLoading
      }
    });
    setSelectedService(service);
    setCurrentStep(3);
  };

  const handleProfessionalSelect = (professional: Professional) => {
    logger.info('Professional selected', {
      professionalId: professional.id,
      professionalName: professional.name,
      salonSlug,
      salonId,
      professionalsCount
    });
    setSelectedProfessional(professional);
    setCurrentStep(2);
  };

  // RENDU PRINCIPAL - Page de réservation complète avec toutes les étapes
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        
        {/* Header avec titre du salon */}
        <div className="text-center py-4">
          <button
            onClick={() => navigate(`/salon/${salonSlug}`, 'booking-back')}
            className="absolute left-4 top-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">{salon?.name || 'Salon'}</h1>
          <p className="text-gray-400 text-sm">{salon?.address || salon?.location || 'Adresse'}</p>
        </div>

        {/* Indicateur d'étapes */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div 
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step 
                  ? 'bg-violet-600 text-white' 
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              {step}
            </div>
          ))}
        </div>

        {/* Étape 1: Sélection du service */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Choisissez votre service</h2>
            
            {servicesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-400">Chargement des services...</p>
              </div>
            ) : services.length > 0 ? (
              <div className="space-y-3">
                {services.map((service: any) => (
                  <Card
                    key={service.id}
                    className="bg-white/5 border-white/10 hover:border-violet-500/50 cursor-pointer transition-all"
                    onClick={() => handleServiceSelect(service)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-white">{service.name}</h3>
                          <p className="text-sm text-gray-400">{service.duration} min</p>
                          {service.description && (
                            <p className="text-sm text-gray-300 mt-1">{service.description}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-violet-400">{service.price}€</p>
                          {service.depositAmount && (
                            <p className="text-xs text-gray-400">Acompte: {service.depositAmount}€</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">Aucun service disponible pour ce salon.</p>
              </div>
            )}
          </div>
        )}

        {/* Étape 2: Sélection du professionnel */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-xl font-semibold">Choisissez votre professionnel</h2>
            </div>

            {professionalsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-400">Chargement des professionnels...</p>
              </div>
            ) : professionalsArray.length > 0 ? (
              <div className="space-y-3">
                {professionalsArray.map((professional: any) => (
                  <Card
                    key={professional.id}
                    className="bg-white/5 border-white/10 hover:border-violet-500/50 cursor-pointer transition-all"
                    onClick={() => handleProfessionalSelect(professional)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-white">
                            {professional.name?.charAt(0) || 'P'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{professional.name}</h3>
                          <p className="text-sm text-gray-400">
                            {getSpecialtiesText(professional.specialties)}
                          </p>
                          {professional.experience && (
                            <p className="text-xs text-gray-500">
                              {professional.experience} ans d'expérience
                            </p>
                          )}
                        </div>
                        {professional.rating && (
                          <div className="text-right">
                            <div className="flex items-center space-x-1">
                              <span className="text-yellow-400">★</span>
                              <span className="text-sm text-gray-300">{professional.rating}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">Aucun professionnel disponible.</p>
                <Button
                  onClick={() => setCurrentStep(3)}
                  className="mt-4 bg-violet-600 hover:bg-violet-700"
                >
                  Continuer sans sélection
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Étape 3: Sélection de la date et heure */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-xl font-semibold">Choisissez votre créneau</h2>
            </div>

            {/* Sélection de date */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Date</h3>
              {dateStates.map((dateInfo, index) => (
                <Card key={dateInfo.date} className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <button
                      onClick={() => toggleDateExpansion(index)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <div>
                        <p className="font-medium text-white">{dateInfo.day}</p>
                        <p className="text-sm text-gray-400">{dateInfo.date}</p>
                      </div>
                      {dateInfo.expanded ? 
                        <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      }
                    </button>
                    
                    {dateInfo.expanded && (
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => {
                              setSelectedDate(dateInfo.date);
                              setSelectedSlot({ date: dateInfo.date, time });
                              setCurrentStep(4);
                            }}
                            className="p-2 rounded-lg bg-violet-600/20 hover:bg-violet-600 text-sm transition-colors"
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Étape 4: Informations client et paiement */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <button
                onClick={() => setCurrentStep(3)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-xl font-semibold">Finaliser la réservation</h2>
            </div>

            {/* Résumé de la réservation */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-violet-400 mb-3">Résumé de votre réservation</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Service:</span>
                    <span className="text-white">{service?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Professionnel:</span>
                    <span className="text-white">{selectedProfessional?.name || 'À assigner'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date:</span>
                    <span className="text-white">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Heure:</span>
                    <span className="text-white">{selectedSlot?.time}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 mt-3">
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-400">Total:</span>
                      <span className="text-violet-400">{service?.price}€</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Acompte à payer:</span>
                      <span className="text-white">{service?.depositAmount || Math.round((service?.price || 0) * 0.3)}€</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Formulaire d'informations client */}
            {!isUserLoggedIn && (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 space-y-4">
                  <h3 className="font-semibold text-white mb-3">Vos informations</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Prénom"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                    <Input
                      placeholder="Nom"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Input
                    placeholder="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                  <Input
                    placeholder="Téléphone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                  <div className="relative">
                    <Input
                      placeholder="Mot de passe"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? 
                        <EyeOff className="w-4 h-4 text-gray-400" /> : 
                        <Eye className="w-4 h-4 text-gray-400" />
                      }
                    </button>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="cgu"
                      checked={formData.acceptCGU}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptCGU: checked as boolean }))}
                    />
                    <label htmlFor="cgu" className="text-sm text-gray-400 leading-relaxed">
                      J'accepte les conditions générales d'utilisation et la politique de confidentialité
                    </label>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Paiement avec Stripe */}
            {clientSecret && (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white mb-4">Paiement sécurisé</h3>
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <StripePaymentForm
                      clientSecret={clientSecret}
                      selectedService={selectedService}
                      onSuccess={() => {
                        toast({
                          title: "Paiement réussi !",
                          description: "Votre réservation est confirmée."
                        });
                        navigate('/client-dashboard', 'booking-success');
                      }}
                    />
                  </Elements>
                </CardContent>
              </Card>
            )}

            {/* Bouton de finalisation */}
            <Button
              onClick={async () => {
                if (!isUserLoggedIn) {
                  // Créer le compte d'abord
                  if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password || !formData.acceptCGU) {
                    toast({
                      title: "Informations manquantes",
                      description: "Veuillez remplir tous les champs obligatoires.",
                      variant: "destructive"
                    });
                    return;
                  }
                  
                  try {
                    const response = await fetch('/api/client/register', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        phone: formData.phone
                      }),
                    });

                    const data = await response.json();
                    
                    if (data.success) {
                      localStorage.setItem('clientToken', data.client.token);
                      localStorage.setItem('clientData', JSON.stringify(data.client));
                      setIsUserLoggedIn(true);
                      
                      toast({
                        title: "Compte créé avec succès !",
                        description: "Vous pouvez maintenant finaliser votre réservation."
                      });
                    } else {
                      toast({
                        title: "Erreur",
                        description: data.error || "Erreur lors de la création du compte",
                        variant: "destructive"
                      });
                      return;
                    }
                  } catch (error) {
                    toast({
                      title: "Erreur",
                      description: "Erreur de connexion. Veuillez réessayer.",
                      variant: "destructive"
                    });
                    return;
                  }
                }
                
                // Créer le Payment Intent
                try {
                  const amount = service?.depositAmount || Math.round((service?.price || 0) * 0.3);
                  const { clientSecret } = await createPaymentIntent({
                    amount,
                    currency: 'eur',
                    metadata: {
                      salonName: salon?.name || "Salon",
                      serviceName: service?.name || "",
                      servicePrice: (service?.price || 0).toString(),
                      depositAmount: amount.toString(),
                      clientEmail: formData.email,
                      appointmentDate: selectedDate,
                      appointmentTime: selectedSlot?.time || ''
                    }
                  });
                  
                  setClientSecret(clientSecret);
                  
                } catch (error) {
                  toast({
                    title: "Erreur",
                    description: "Erreur lors de la préparation du paiement",
                    variant: "destructive"
                  });
                }
              }}
              disabled={!service || !selectedSlot}
              className={`w-full ${getGenericGlassButton(0)} text-white py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all`}
            >
              {!isUserLoggedIn ? 'Créer le compte et payer' : 'Procéder au paiement'}
            </Button>
          </div>
        )}

        {/* Modal de confirmation */}
        {showConfirmationPopup && (
          <BookingConfirmationModal
            isOpen={showConfirmationPopup}
            onClose={() => setShowConfirmationPopup(false)}
            onConfirm={() => {
              setShowConfirmationPopup(false);
              // Procéder au paiement
            }}
            bookingData={{
              salonName: salon?.name || "Salon",
              serviceName: service?.name || "",
              servicePrice: service?.price || 0,
              selectedDate: selectedDate,
              selectedTime: selectedSlot?.time || "",
              clientName: `${formData.firstName} ${formData.lastName}`,
              professionalName: selectedProfessional?.name || "À assigner"
            }}
          />
        )}
      </div>
    </div>
  );
}

export default SalonBookingFixed;