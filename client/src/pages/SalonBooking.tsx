import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { getGenericGlassButton } from "@/lib/salonColors";
import { apiRequest } from "@/lib/queryClient";
import {
  ArrowLeft, ChevronDown, ChevronUp, Eye, EyeOff, X
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import BookingConfirmationPopup from '@/components/BookingConfirmationPopup';

// Configuration Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_51Rn0zHQbSa7XrNpDpM6MD9LPmkUAPzClEdnFW34j3evKDrUxMud0I0p6vk3ESOBwxjAwmj1cKU5VrKGa7pef6onE00eC66JjRo");

// Composant de paiement Stripe intégré
function StripePaymentForm({ onSuccess, clientSecret }: { onSuccess: () => void, clientSecret: string }) {
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
          'Confirmer & Payer 20,50 €'
        )}
      </Button>
    </form>
  );
}

export default function SalonBooking() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('partial'); // partial, full, gift
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Vérifier si l'utilisateur est connecté au chargement initial seulement
  useEffect(() => {
    const token = localStorage.getItem('clientToken');
    if (token) {
      setIsUserLoggedIn(true);
    }
  }, []);
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

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Restaurer l'état de réservation si l'utilisateur revient de la connexion
  useEffect(() => {
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
          // Restaurer le professionnel et service sélectionnés
          if (bookingState.professionalName) {
            const prof = professionals.find(p => p.name === bookingState.professionalName);
            if (prof) setSelectedProfessional(prof);
          }
          if (bookingState.serviceName) {
            setSelectedService(defaultService);
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
      // L'utilisateur est connecté mais on n'ouvre PAS automatiquement le paiement
      // Il faut qu'il passe par le flux normal de réservation
    }
  }, []);

  // Données du salon
  const salon = {
    name: "Bonhomme",
    location: "Paris Archives"
  };

  // Service par défaut
  const service = {
    id: 1,
    name: "Coupe Bonhomme",
    duration: 30,
    price: 39
  };

  // Créneaux horaires disponibles par jour
  const timeSlots = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00'];
  
  // Dates disponibles
  const availableDates = [
    { date: 'lundi 28 juillet', full: 'lundi 28 juillet 2025', expanded: false },
    { date: 'mardi 29 juillet', full: 'mardi 29 juillet 2025', expanded: false },
    { date: 'mercredi 30 juillet', full: 'mercredi 30 juillet 2025', expanded: false },
    { date: 'jeudi 31 juillet', full: 'jeudi 31 juillet 2025', expanded: false },
    { date: 'vendredi 1 août', full: 'vendredi 1 août 2025', expanded: false },
    { date: 'samedi 2 août', full: 'samedi 2 août 2025', expanded: false },
    { date: 'lundi 4 août', full: 'lundi 4 août 2025', expanded: false }
  ];

  // Simple service pour l'étape 1 (suppression complète de "Choix de la prestation")
  const defaultService = {
    id: 1,
    name: "Coupe Bonhomme",
    price: 39,
    duration: "30min"
  };

  // Professionnels disponibles
  const professionals = [
    {
      id: 1,
      name: "Lucas",
      specialties: ["Coupe", "Barbe"],
      rating: 4.9,
      nextSlot: "Aujourd'hui 10:00",
      image: "👨‍💼"
    },
    {
      id: 2,
      name: "Emma",
      specialties: ["Coloration", "Soin"],
      rating: 4.8,
      nextSlot: "Aujourd'hui 11:30",
      image: "👩‍💼"
    },
    {
      id: 3,
      name: "Alex",
      specialties: ["Coupe Moderne", "Style"],
      rating: 4.7,
      nextSlot: "Demain 9:00",
      image: "👨‍🎨"
    },
    {
      id: 4,
      name: "Sophie",
      specialties: ["Permanente", "Défrisage"],
      rating: 4.9,
      nextSlot: "Demain 14:00",
      image: "👩‍🔬"
    }
  ];

  const [dateStates, setDateStates] = useState(availableDates);

  const toggleDateExpansion = (index: number) => {
    setDateStates(prev => prev.map((date, i) => 
      i === index ? { ...date, expanded: !date.expanded } : date
    ));
  };

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setCurrentStep(3);
  };

  const handleProfessionalSelect = (professional: any) => {
    setSelectedProfessional(professional);
    setCurrentStep(2);
  };

  const handleTimeSlotSelect = (time: string) => {
    setSelectedSlot({ time, date: selectedDate });
    // Aller à l'étape de connexion/inscription
    setCurrentStep(3);
  };

  const handleDateSelect = (dateInfo: any) => {
    setSelectedDate(dateInfo.full);
    setSelectedSlot({ date: dateInfo.full, time: '10:00' });
    setCurrentStep(4);
  };

  // Créer un Payment Intent quand l'utilisateur se connecte/s'inscrit
  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 20.50, // Montant de l'acompte
          currency: 'eur',
          metadata: {
            salonName: salon.name,
            serviceName: service.name,
            clientEmail: formData.email,
            appointmentDate: selectedDate,
            appointmentTime: selectedSlot?.time
          }
        }),
      });

      const data = await response.json();
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Erreur lors de la préparation du paiement",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Erreur de connexion. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  // Fonction pour créer le compte et afficher la section de paiement
  const handleAccountCreation = async () => {
    try {
      // Simuler la création de compte
      const response = await fetch('/api/client/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        // Stocker le token
        localStorage.setItem('clientToken', data.client.token);
        localStorage.setItem('clientData', JSON.stringify(data.client));
        
        setIsUserLoggedIn(true);
        setCurrentStep(4);
        
        toast({
          title: "Compte créé avec succès !",
          description: "Vous pouvez maintenant finaliser votre réservation."
        });

        // Créer le Payment Intent pour Stripe
        await createPaymentIntent();

        // Sauvegarder les données de réservation pour la confirmation
        const bookingData = {
          salonId: 'bonhomme-paris-archives',
          salonName: salon.name,
          salonLocation: salon.location,
          serviceName: service.name,
          servicePrice: service.price,
          serviceDuration: service.duration,
          selectedDate: selectedDate || 'lundi 28 juillet 2025',
          selectedTime: selectedSlot?.time || '10:00',
          clientName: `${formData.firstName} ${formData.lastName}`,
          clientEmail: formData.email,
          clientPhone: formData.phone,
          professionalName: selectedProfessional?.name || 'Lucas',
          totalPrice: service.price
        };
        sessionStorage.setItem('currentBooking', JSON.stringify(bookingData));

        // Déclencher l'affichage du popup de confirmation AVANT le paiement
        setTimeout(() => {
          setShowConfirmationPopup(true);
        }, 500);
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Erreur lors de la création du compte",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur création compte:', error);
      toast({
        title: "Erreur",
        description: "Erreur de connexion. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  // Fonction pour rediriger vers le paiement
  const handlePayment = () => {
    setLocation('/stripe-payment');
  };

  // Fonction pour valider le paiement depuis le bottom sheet
  const handlePaymentConfirm = () => {
    // Validation basique
    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvc) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs de paiement.",
        variant: "destructive"
      });
      return;
    }

    // Simuler le traitement du paiement
    setShowPaymentSheet(false);
    
    toast({
      title: "Paiement en cours...",
      description: "Traitement de votre paiement sécurisé."
    });

    // Rediriger vers la confirmation après 2 secondes
    setTimeout(() => {
      setLocation('/stripe-payment');
    }, 2000);
  };

  // Fonction pour formater le numéro de carte
  const formatCardNumber = (value: string) => {
    return value.replace(/\s+/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  // Fonction pour formater la date d'expiration
  const formatExpiryDate = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
  };

  // Fonction pour gérer la confirmation du popup
  const handleConfirmationPopupConfirm = () => {
    setShowConfirmationPopup(false);
    // Déclencher l'affichage du bottom sheet de paiement après validation du popup
    setTimeout(() => {
      setShowPaymentSheet(true);
    }, 300);
  };

  // Fonction pour fermer le popup de confirmation
  const handleConfirmationPopupClose = () => {
    setShowConfirmationPopup(false);
  };

  // Étape 1: Sélection du professionnel
  const renderProfessionalSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      {/* Header simple avec retour */}
      <div className="bg-white/40 backdrop-blur-md border-b border-white/30 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="h-10 w-10 p-0 rounded-full glass-button hover:glass-effect transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-semibold text-gray-900">{salon.name}</h1>
              <p className="text-sm text-gray-700">{salon.location}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Choisir un professionnel</h2>
        
        <div className="space-y-3">
          {professionals.map((pro) => (
            <Card 
              key={pro.id}
              className="glass-card hover:border-violet-300/50 hover:shadow-lg hover:glass-effect transition-all duration-300 cursor-pointer"
              onClick={() => handleProfessionalSelect(pro)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{pro.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{pro.name}</h3>
                      <div className="flex items-center gap-1">
                        <span className="text-amber-400">★</span>
                        <span className="text-sm text-gray-600">{pro.rating}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {pro.specialties.map((specialty, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-violet-600">{pro.nextSlot}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  // Étape 2: Affichage du service par défaut et redirection vers dates
  const renderServiceSelection = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header simple avec retour */}
      <div className="bg-white/40 backdrop-blur-md border-b border-white/30 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep(1)}
              className="h-10 w-10 p-0 rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-semibold text-gray-900">Service sélectionné</h1>
              <p className="text-sm text-gray-600">Choisir la date</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4">
        <div className="bg-white rounded-lg p-4 border border-gray-100 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-xl">{selectedProfessional?.image}</div>
            <div>
              <h3 className="font-semibold text-gray-900">{selectedProfessional?.name}</h3>
              <p className="text-sm text-gray-600">{selectedProfessional?.specialties?.join(', ')}</p>
            </div>
          </div>
          <div className="border-t pt-3">
            <h4 className="font-medium text-gray-900">{defaultService.name}</h4>
            <p className="text-sm text-gray-600">{defaultService.duration} • {defaultService.price}€</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-6">Choisir un créneau</h2>
        
        <div className="space-y-3">
          {dateStates.map((dateInfo, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200">
              <div 
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => toggleDateExpansion(index)}
              >
                <span className="font-medium text-gray-900">{dateInfo.date}</span>
                {dateInfo.expanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
              
              {dateInfo.expanded && (
                <div className="border-t border-gray-100 p-4">
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        onClick={() => handleTimeSlotSelect(time)}
                        className="text-sm py-2 px-3 glass-button hover:glass-effect text-black transition-all duration-300"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Étape 3: Sélection de la date 
  const renderDateSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      {/* Tabs navigation */}
      <div className="bg-white/40 backdrop-blur-md border-b border-white/30">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex space-x-6">
            <button className="text-black font-medium border-b-2 border-black pb-2">
              Prendre RDV
            </button>

          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">1. Professionnel sélectionné</h2>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-xl">{selectedProfessional?.image}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedProfessional?.name}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedProfessional?.specialties?.join(', ')} • ★ {selectedProfessional?.rating}
                  </p>
                </div>
              </div>
              <Button variant="ghost" className="glass-button hover:glass-effect text-black text-sm font-medium transition-all duration-300" onClick={() => setCurrentStep(1)}>
                Changer
              </Button>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => toast({ title: "Fonctionnalité", description: "Ajouter une prestation supplémentaire" })}
          className="w-full glass-button hover:glass-effect text-black py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300"
        >
          Ajouter une prestation à la suite
        </Button>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">2. Choix de la date & heure</h2>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <span className="font-medium text-gray-900">Lundi 28 juillet</span>
                <ChevronUp className="h-5 w-5 text-gray-400" />
              </div>
              <div className="p-4">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {timeSlots.slice(0, 9).map((time) => (
                    <Button
                      key={time}
                      variant="outline"
                      className="py-2 text-sm border-gray-200 hover:border-violet-600 hover:text-violet-600 rounded-full hover:bg-violet-50 transition-all"
                      onClick={() => handleTimeSlotSelect(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
                <Button variant="ghost" className="w-full text-gray-600 text-sm">
                  Voir plus
                </Button>
              </div>
            </div>

            {dateStates.slice(1).map((dateInfo, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200">
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleDateExpansion(index + 1)}
                >
                  <span className="font-medium text-gray-900 capitalize">{dateInfo.date}</span>
                  {dateInfo.expanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                {dateInfo.expanded && (
                  <div className="p-4 border-t border-gray-100">
                    <div className="grid grid-cols-3 gap-3">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant="outline"
                          className="py-2 text-sm border-gray-200 hover:border-violet-600 hover:text-violet-600 rounded-full hover:bg-violet-50 transition-all"
                          onClick={() => {
                            setSelectedDate(dateInfo.full);
                            handleTimeSlotSelect(time);
                          }}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <Button variant="ghost" className="w-full text-gray-600 text-sm py-3">
              Afficher plus de disponibilités
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Étape 3: Identification
  const renderIdentification = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setCurrentStep(2)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">{salon.name} - {salon.location}</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">1. Prestation sélectionnée</h2>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{service.name}</h3>
                <p className="text-sm text-gray-600">{service.duration}min • {service.price} €</p>
              </div>
              <Button variant="ghost" className="text-violet-600 text-sm font-medium">
                Supprimer
              </Button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">2. Date et heure sélectionnées</h2>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{selectedDate || 'lundi 28 juillet 2025'}</h3>
                <p className="text-sm text-gray-600">à {selectedSlot?.time || '10:00'}</p>
              </div>
              <Button variant="ghost" className="text-violet-600 text-sm font-medium" onClick={() => setCurrentStep(2)}>
                Modifier
              </Button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">3. Identification</h2>
          
          <div className="text-center mb-6">
            <p className="text-gray-900 font-medium mb-4">Nouveau sur Planity ?</p>
            <Button 
              onClick={() => {
                // Sauvegarder l'état de réservation avant la connexion
                const bookingState = {
                  salonName: "Salon Excellence Paris",
                  salonLocation: "75004 Paris",
                  serviceName: selectedService?.name || "Coupe + Shampoing",
                  servicePrice: selectedService?.price || 39,
                  serviceDuration: selectedService?.duration || "45 min",
                  selectedDate: selectedDate || "lundi 28 juillet 2025",
                  selectedTime: selectedSlot?.time || "10:00",
                  professionalName: selectedProfessional?.name || "Sarah Martin",
                  currentStep: 4 // Revenir à l'étape finale
                };
                sessionStorage.setItem('currentBooking', JSON.stringify(bookingState));
                setLocation('/client-login');
              }}
              variant="outline"
              className="w-full py-3 mb-4 border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-all"
            >
              J'ai déjà un compte - Se connecter
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">ou créer un nouveau compte</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Prénom"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Nom <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Nom"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Téléphone portable <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <div className="flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
                  <span className="text-sm mr-1">🇫🇷</span>
                </div>
                <Input
                  type="tel"
                  placeholder="Entrer votre numéro..."
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="flex-1 rounded-l-none border-l-0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="cgu"
                checked={formData.acceptCGU}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptCGU: checked as boolean }))}
              />
              <label htmlFor="cgu" className="text-sm text-gray-600 leading-4">
                J'accepte les <span className="underline">CGU</span> de Planity.
              </label>
            </div>

            <Button 
              onClick={handleAccountCreation}
              className="w-full glass-button hover:glass-effect text-black py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300"
              disabled={!formData.acceptCGU || !formData.email || !formData.phone || !formData.password || !formData.firstName || !formData.lastName}
            >
              Créer mon compte et continuer
            </Button>

            <p className="text-xs text-gray-500 text-center leading-4">
              Vos informations sont traitées par Planity, consultez notre{' '}
              <span className="underline">politique de confidentialité</span>. Ce site est protégé
              par reCAPTCHA et est soumis à la{' '}
              <span className="underline">Politique de Confidentialité</span> et aux{' '}
              <span className="underline">Conditions d'Utilisation</span> de Google.
            </p>
          </div>
        </div>
      </div>


    </div>
  );

  // Bottom Sheet de Paiement - Style Apple Pay/Planity
  const renderPaymentBottomSheet = () => (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          showPaymentSheet ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setShowPaymentSheet(false)}
      />
      
      {/* Bottom Sheet */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border border-white/40 rounded-t-3xl z-50 transform transition-transform duration-500 ease-out ${
          showPaymentSheet ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '90vh' }}
      >
        {/* Handle barre de glissement */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-white/40 rounded-full"></div>
        </div>

        <div className="px-6 pb-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 40px)' }}>
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-black mb-1">Finaliser le paiement</h2>
            <p className="text-gray-700">Réglez votre acompte de manière sécurisée</p>
          </div>

          {/* Récapitulatif rapide */}
          <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Service</span>
              <span className="font-medium">{service.name}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Date & Heure</span>
              <span className="font-medium">{selectedDate || 'lundi 28 juillet'} à {selectedSlot?.time || '10:00'}</span>
            </div>
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
              <span className="text-gray-600">Professionnel</span>
              <span className="font-medium">{selectedProfessional?.name || 'Lucas'}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Prix total</span>
              <span className="font-medium">{service.price},00 €</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Acompte</span>
              <span className="font-bold text-gray-900 text-lg">20,50 €</span>
            </div>
          </div>

          {/* Sélection méthode de paiement */}
          <div className="mb-6">
            <h3 className="font-semibold text-black mb-3">Méthode de paiement</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg">
                <div className="w-5 h-5 rounded-full border-2 border-gray-400 bg-gray-400 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-6 bg-blue-600 rounded text-white text-xs font-bold flex items-center justify-center">VISA</div>
                  <span className="font-medium">Carte bancaire</span>
                </div>
              </div>
            </div>
          </div>

          {/* Composant Stripe intégré */}
          {clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <StripePaymentForm 
                onSuccess={() => {
                  setShowPaymentSheet(false);
                  toast({
                    title: "Paiement réussi !",
                    description: "Votre réservation a été confirmée.",
                    variant: "success" as any
                  });
                  setTimeout(() => {
                    setLocation('/');
                  }, 2000);
                }}
                clientSecret={clientSecret}
              />
            </Elements>
          ) : (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Préparation du paiement...</p>
            </div>
          )}

          {/* Sécurité */}
          <div className="flex items-center justify-center space-x-2 mt-4 mb-2 text-sm text-gray-500">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span>Paiement sécurisé par Stripe</span>
          </div>

          {/* Bouton annulation */}
          <div className="mt-4">
            <Button 
              onClick={() => setShowPaymentSheet(false)}
              variant="outline"
              className="w-full py-3 rounded-full font-medium glass-button hover:glass-effect text-black transition-all duration-300"
            >
              Annuler
            </Button>
          </div>
        </div>
      </div>
    </>
  );

  // Étape 4: Supprimée - nom/prénom maintenant dans étape 3
  const renderAccountCompletion = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setCurrentStep(3)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">{salon.name} - {salon.location}</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Terminer mon inscription</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Prénom <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Agash"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Nom <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Nathan"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full"
              />
            </div>

            <Button 
              onClick={handleAccountCreation}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
              disabled={!formData.firstName || !formData.lastName}
            >
              Continuer vers le paiement
            </Button>

            <Button variant="ghost" className="w-full text-gray-600 text-sm">
              Se déconnecter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Étape 5: Paiement
  const renderPayment = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setCurrentStep(4)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">{salon.name} - {salon.location}</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">4. Moyen de paiement</h2>
          
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">Comment souhaitez-vous payer ?</h3>
            
            <div className="space-y-3">
              <label className="flex items-start space-x-3">
                <input 
                  type="radio" 
                  name="payment" 
                  value="partial"
                  checked={paymentMethod === 'partial'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900">Payer une partie maintenant, le reste sur place</div>
                  <div className="text-sm text-gray-600">
                    Payer une partie {Math.round(service.price * 0.5)} € maintenant puis le reste {Math.round(service.price * 0.5)} € sur place.
                  </div>
                </div>
              </label>

              <label className="flex items-start space-x-3">
                <input 
                  type="radio" 
                  name="payment" 
                  value="full"
                  checked={paymentMethod === 'full'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div>
                  <div className="font-medium text-gray-900">Payer la totalité</div>
                  <div className="text-sm text-gray-600">
                    Payer maintenant le montant total {service.price},00 € de votre réservation.
                  </div>
                </div>
              </label>

              <label className="flex items-start space-x-3">
                <input 
                  type="radio" 
                  name="payment" 
                  value="gift"
                  checked={paymentMethod === 'gift'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div>
                  <div className="font-medium text-gray-900">Payer avec une carte cadeau</div>
                  <div className="text-sm text-gray-600">
                    La carte cadeau ne sera pas prélevée maintenant, vous paierez avec sur place.
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-900">{service.name}</span>
              <span className="text-gray-900">{service.price},00 €</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">{service.price},00 €</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between">
                <span className="text-gray-900">À régler maintenant</span>
                <span className="text-gray-900">{Math.round(service.price * 0.5)},50 €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-900">À régler sur place</span>
                <span className="text-gray-900">{Math.round(service.price * 0.5)},50 €</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-2">Politique d'annulation</h4>
            <p className="text-sm text-gray-600">
              Vous pouvez annuler gratuitement votre réservation jusqu'au 28 juillet à 08:00, et être remboursé de la
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Étape 6: Formulaire de paiement
  const renderPaymentForm = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setCurrentStep(5)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">{salon.name} - {salon.location}</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-2">Politique d'annulation</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            Vous pouvez annuler gratuitement votre réservation jusqu'au 28 juillet à 08:00, et être remboursé de la
            totalité du montant. Passé cette date, l'acompte ne sera plus remboursable.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            En cas de non présentation au rendez-vous, l'acompte ne sera pas remboursé.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex space-x-3">
            <Button
              variant={paymentMethod === 'card' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('card')}
              className="flex-1 py-3 glass-button hover:glass-effect text-black transition-all duration-300"
            >
              💳 Carte bancaire
            </Button>
            <Button
              variant={paymentMethod === 'apple' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('apple')}
              className="flex-1 py-3 glass-button hover:glass-effect text-black transition-all duration-300"
            >
              🍎 Apple Pay
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Numéro de carte</label>
            <div className="relative">
              <Input
                type="text"
                placeholder="1234 1234 1234 1234"
                className="w-full pr-16"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-1">
                <div className="w-6 h-4 bg-blue-600 rounded text-xs text-white flex items-center justify-center font-bold">VISA</div>
                <div className="w-6 h-4 bg-red-500 rounded"></div>
                <div className="w-6 h-4 bg-blue-500 rounded"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Date d'expiration</label>
              <Input type="text" placeholder="MM / AA" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Code de sécurité</label>
              <div className="relative">
                <Input type="text" placeholder="CVC" className="pr-10" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 border border-gray-300 rounded px-1">123</div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Pays</label>
            <Select defaultValue="france">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="france">France</SelectItem>
                <SelectItem value="belgique">Belgique</SelectItem>
                <SelectItem value="suisse">Suisse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Sauvegarder la carte pour les futures réservations ?</h4>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name="saveCard" 
                  value="yes"
                  checked={formData.saveCard === true}
                  onChange={() => setFormData(prev => ({ ...prev, saveCard: true }))}
                />
                <span className="text-sm text-gray-700">Oui</span>
              </label>
              <label className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name="saveCard" 
                  value="no"
                  checked={formData.saveCard === false}
                  onChange={() => setFormData(prev => ({ ...prev, saveCard: false }))}
                />
                <span className="text-sm text-gray-700">Non</span>
              </label>
            </div>
          </div>

          <Button 
            onClick={() => {
              toast({
                title: 'Réservation confirmée !',
                description: 'Votre rendez-vous a été enregistré avec succès.',
              });
              setLocation('/');
            }}
            className="w-full glass-button hover:glass-effect text-black py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300"
          >
            Confirmer la réservation
          </Button>
        </div>
      </div>
    </div>
  );

  // Étape 3: Interface exacte comme les captures d'écran
  const renderLoginSignup = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setCurrentStep(2)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">{salon.name} - {salon.location}</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        {/* 1. Prestation sélectionnée */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Prestation sélectionnée</h2>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{defaultService.name}</h3>
                <p className="text-sm text-gray-600">{defaultService.duration} • {defaultService.price} €</p>
              </div>
              <Button variant="link" className="glass-button hover:glass-effect text-black text-sm transition-all duration-300">
                Supprimer
              </Button>
            </div>
          </div>
        </div>

        {/* 2. Date et heure sélectionnées */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Date et heure sélectionnées</h2>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{selectedSlot?.date || selectedDate}</h3>
                <p className="text-sm text-gray-600">à {selectedSlot?.time}</p>
              </div>
              <Button variant="link" className="glass-button hover:glass-effect text-black text-sm transition-all duration-300">
                Modifier
              </Button>
            </div>
          </div>
        </div>

        {/* 3. Identification */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Identification</h2>
          
          <div className="text-center mb-4">
            <p className="text-gray-600">Nouveau sur Planity ?</p>
          </div>

          <Button 
            variant="outline"
            className="w-full mb-4 py-3 glass-button hover:glass-effect text-black rounded-full transition-all duration-300"
            onClick={() => setShowLoginModal(true)}
          >
            J'ai déjà un compte - Se connecter
          </Button>

          <div className="flex items-center mb-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">ou créer un nouveau compte</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Prénom"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Nom <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Nom"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Téléphone portable <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <div className="flex items-center px-3 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                  <span className="text-sm">🇫🇷</span>
                </div>
                <Input
                  type="tel"
                  placeholder="Entrer votre numéro..."
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="flex-1 rounded-l-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.acceptCGU}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptCGU: !!checked }))}
              />
              <label htmlFor="terms" className="text-sm text-gray-600 leading-5">
                J'accepte les <span className="underline">CGU</span> de Planity.
              </label>
            </div>

            <Button 
              onClick={handleCreateAccountAndPay}
              className="w-full glass-button hover:glass-effect text-black py-4 rounded-full font-medium text-lg shadow-md hover:shadow-lg transition-all duration-300"
              disabled={!formData.email || !formData.phone || !formData.password || !formData.firstName || !formData.lastName || !formData.acceptCGU}
            >
              Créer mon compte et continuer
            </Button>

            <p className="text-xs text-gray-500 text-center leading-4">
              Vos informations sont traitées par Planity, consultez notre{' '}
              <span className="underline">politique de confidentialité</span>. Ce site est protégé par reCAPTCHA 
              et est soumis à la <span className="underline">Politique de confidentialité</span> et aux{' '}
              <span className="underline">Conditions d'utilisation</span> de Google.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Fonction commune pour créer Payment Intent et ouvrir le shell
  const createPaymentIntentAndOpenSheet = async () => {
    try {
      console.log('💳 Création Payment Intent...');
      
      // Créer le Payment Intent Stripe
      const paymentResponse = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 20.50,
          currency: 'eur',
          metadata: {
            salon: salon.name,
            professional: selectedProfessional?.name,
            service: defaultService.name,
            time: selectedSlot?.time,
            date: selectedSlot?.date || selectedDate,
            clientEmail: formData.email || loginData.email
          }
        })
      });
      
      console.log('📋 Réponse Payment Intent:', paymentResponse.status);
      
      if (!paymentResponse.ok) {
        throw new Error(`Erreur HTTP ${paymentResponse.status}`);
      }
      
      const paymentText = await paymentResponse.text();
      console.log('📄 Réponse brute Payment Intent:', paymentText);
      
      let paymentData;
      try {
        paymentData = JSON.parse(paymentText);
        console.log('💰 Données Payment Intent:', paymentData);
      } catch (e) {
        console.error('❌ Réponse non-JSON:', paymentText);
        throw new Error('Réponse serveur invalide');
      }
      
      if (paymentData.success && paymentData.clientSecret) {
        setClientSecret(paymentData.clientSecret);
        
        // Afficher le bottom sheet automatiquement après succès
        toast({
          title: "Prêt pour le paiement",
          description: "Ouverture du formulaire de paiement sécurisé"
        });
        
        setTimeout(() => {
          setShowPaymentSheet(true);
        }, 800);
      } else {
        throw new Error(paymentData.error || paymentData.message || 'Erreur Payment Intent');
      }
    } catch (error: any) {
      console.error('🚨 Erreur Payment Intent:', error);
      
      // En cas d'erreur, afficher un message d'erreur plutôt que simuler
      toast({
        title: "Erreur de paiement",
        description: "Configuration Stripe requise. Contactez l'administrateur.",
        variant: "destructive"
      });
    }
  };

  // Fonction pour se connecter (utilisateur existant)
  const handleLogin = async () => {
    try {
      toast({
        title: "Connexion en cours...",
        description: "Vérification des identifiants"
      });

      const response = await fetch('/api/client/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('clientToken', data.client.token);
        setIsUserLoggedIn(true);
        
        toast({
          title: "Connexion réussie !",
          description: "Préparation du paiement..."
        });
        
        // Marquer comme connecté puis créer le Payment Intent
        setIsUserLoggedIn(true);
        
        // Créer automatiquement le Payment Intent et ouvrir le shell
        setTimeout(() => {
          createPaymentIntentAndOpenSheet();
        }, 500);
      } else {
        toast({
          title: "Erreur de connexion",
          description: data.error || "Email ou mot de passe incorrect",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Erreur connexion:', error);
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  // Fonction pour créer le compte et passer au paiement
  const handleCreateAccountAndPay = async () => {
    try {
      toast({
        title: "Création du compte en cours...",
        description: "Veuillez patienter"
      });

      // 1. Créer le compte client avec prénom/nom
      const response = await fetch('/api/client/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          firstName: formData.firstName,
          lastName: formData.lastName
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('clientToken', data.client.token);
        
        toast({
          title: "Compte créé avec succès !",
          description: "Préparation du paiement...",
          variant: "success" as any
        });
        
        // 2. Marquer comme connecté puis créer le Payment Intent
        setIsUserLoggedIn(true);
        
        // Créer automatiquement le Payment Intent et ouvrir le shell
        setTimeout(() => {
          createPaymentIntentAndOpenSheet();
        }, 500);
      } else {
        toast({
          title: "Erreur inscription",
          description: data.error || "Erreur lors de la création du compte",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Erreur création compte:', error);
      toast({
        title: "Erreur de connexion",
        description: "Impossible de créer le compte. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  // Fonction pour se connecter avec le modal et passer au paiement
  const handleModalLogin = async () => {
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Champs manquants",
        description: "Veuillez saisir votre email et mot de passe",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('🔐 Tentative connexion modal:', loginData.email);
      
      const response = await fetch('/api/client/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email.trim(),
          password: loginData.password.trim()
        }),
      });

      const data = await response.json();
      console.log('📋 Réponse connexion modal:', data);
      
      if (data.success && data.client) {
        localStorage.setItem('clientToken', data.client.token || 'test-token');
        
        // Fermer le modal de connexion
        setShowLoginModal(false);
        
        toast({
          title: "Connexion réussie !",
          description: `Bienvenue ${data.client.first_name || 'Client'} !`,
          variant: "success" as any
        });
        
        // Marquer comme connecté puis créer le Payment Intent
        setIsUserLoggedIn(true);
        
        // Créer automatiquement le Payment Intent et ouvrir le shell
        setTimeout(() => {
          createPaymentIntentAndOpenSheet();
        }, 800);
      } else {
        console.error('❌ Échec connexion modal:', data);
        toast({
          title: "Erreur de connexion",
          description: data.message || data.error || "Email ou mot de passe incorrect",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('🚨 Erreur réseau connexion modal:', error);
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter. Vérifiez votre connexion.",
        variant: "destructive"
      });
    }
  };

  // Modal de connexion
  const renderLoginModal = () => (
    showLoginModal && (
      <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
        <div className="bg-white w-full max-w-lg rounded-t-3xl p-6 space-y-6 animate-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Se connecter</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowLoginModal(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Identifiants de test avec bouton de remplissage automatique */}
            <div className="glass-card p-3 rounded-lg text-sm">
              <p className="font-medium text-black mb-2">🧪 Compte de test :</p>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-gray-700">Email: client@beautyapp.com</p>
                  <p className="text-gray-700">Mot de passe: test123</p>
                </div>
                <Button
                  onClick={() => {
                    setLoginData({
                      email: 'client@beautyapp.com',
                      password: 'test123'
                    });
                  }}
                  className="glass-button hover:glass-effect text-black text-xs px-3 py-1 transition-all duration-300"
                >
                  Remplir
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
              <Input
                type="email"
                placeholder="client@beautyapp.com"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Mot de passe</label>
              <Input
                type="password"
                placeholder="test123"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full"
              />
            </div>

            <Button
              onClick={handleModalLogin}
              className="w-full glass-button hover:glass-effect text-black py-3 rounded-full font-medium transition-all duration-300"
            >
              Se connecter
            </Button>

            <div className="text-center text-sm text-gray-600">
              <button 
                onClick={() => {
                  setShowLoginModal(false);
                  // Focus sur le formulaire d'inscription
                }}
                className="glass-button hover:glass-effect text-black underline transition-all duration-300"
              >
                Pas encore de compte ? Créer un compte
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  // Préparer les données pour le popup de confirmation
  const bookingDetails = {
    serviceName: selectedService?.name || defaultService.name,
    servicePrice: selectedService?.price || defaultService.price,  
    serviceDuration: selectedService?.duration || defaultService.durationMinutes || 45,
    appointmentDate: selectedDate || 'lundi 28 juillet 2025',
    appointmentTime: selectedSlot?.time || '10:00',
    staffName: selectedProfessional?.name || 'Lucas',
    clientName: `${formData.firstName} ${formData.lastName}` || 'Client',
    clientEmail: formData.email || 'client@example.com',
    clientPhone: formData.phone || '0612345678',
    depositRequired: 20.5, // 30% d'acompte
    isWeekendPremium: false
  };

  const salonInfo = {
    name: salon.name,
    address: salon.location,
    phone: '01 42 25 76 89', 
    email: 'contact@salon.com',
    rating: 4.8,
    reviewCount: 156,
    policies: {
      cancellation: 'Annulation gratuite jusqu\'à 24h avant le rendez-vous',
      lateness: 'Retard de plus de 15min = annulation automatique',
      deposit: '30% d\'acompte requis pour valider la réservation',
      rescheduling: 'Modification possible jusqu\'à 12h avant'
    },
    openingHours: {
      'Lundi': '9h00 - 19h00',
      'Mardi': '9h00 - 19h00', 
      'Mercredi': '9h00 - 19h00',
      'Jeudi': '9h00 - 19h00',
      'Vendredi': '9h00 - 20h00',
      'Samedi': '9h00 - 18h00',
      'Dimanche': 'Fermé'
    }
  };

  // Navigation entre les étapes avec connexion/inscription
  return (
    <>
      {currentStep === 1 && renderProfessionalSelection()}
      {currentStep === 2 && renderDateSelection()}
      {currentStep === 3 && renderLoginSignup()}
      
      {/* Bottom Sheet de Paiement Stripe réel - S'ouvre après connexion/inscription */}
      {showPaymentSheet && renderPaymentBottomSheet()}
      
      {/* Modal de connexion */}
      {renderLoginModal()}
      
      {/* Popup de confirmation AVANT paiement */}
      <BookingConfirmationPopup
        isOpen={showConfirmationPopup}
        onClose={handleConfirmationPopupClose}
        onConfirm={handleConfirmationPopupConfirm}
        bookingDetails={bookingDetails}
        salonInfo={salonInfo}
        isLoading={false}
      />
    </>
  );
}