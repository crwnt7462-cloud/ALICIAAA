import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Eye, EyeOff, X, CreditCard, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { formatDuration } from '@/lib/utils';

// Configuration Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

// Fonction pour calculer l'acompte selon les paramètres du service
const calculateDeposit = (services: any[], totalPrice: number) => {
  if (!services || services.length === 0) return { amount: 0, percentage: 0, requiresDeposit: false };
  
  // Vérifier si au moins un service nécessite un acompte
  const servicesRequiringDeposit = services.filter(service => {
    // Si le service a un nom qui contient "gratuit" ou "testtttt", pas d'acompte
    const serviceName = service.name?.toLowerCase() || '';
    const isFreeService = serviceName.includes('gratuit') || serviceName.includes('testtttt') || serviceName.includes('test');
    
    // Si le prix est 0, pas d'acompte
    const isFreePrice = service.price === 0 || service.price === '0';
    
    return !isFreeService && !isFreePrice;
  });
  
  if (servicesRequiringDeposit.length === 0) {
    return { amount: 0, percentage: 0, requiresDeposit: false };
  }
  
  // Calculer l'acompte sur les services payants uniquement
  const payableAmount = servicesRequiringDeposit.reduce((sum, service) => sum + (service.price || 0), 0);
  const depositPercentage = 50; // 50% par défaut, peut être configuré par le pro
  const depositAmount = Math.round(payableAmount * (depositPercentage / 100) * 100) / 100;
  
  return { 
    amount: depositAmount, 
    percentage: depositPercentage, 
    requiresDeposit: true,
    payableAmount: payableAmount
  };
};

// Composant de formulaire de paiement
function PaymentForm({ clientSecret, onSuccess, depositAmount, preBookingData, selectedService }: { 
  clientSecret: string, 
  onSuccess: () => void, 
  depositAmount: number,
  preBookingData?: any,
  selectedService?: any
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  // Vérifier si c'est un mock clientSecret ou un vrai
  const isMockPayment = clientSecret.includes('pi_demo_');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isMockPayment) {
      // Validation pour le mock
      if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardholderName) {
        toast({
          title: "Informations manquantes",
          description: "Veuillez remplir tous les champs de paiement",
          variant: "destructive"
        });
        return;
      }
    }

    if (!isMockPayment && (!stripe || !elements)) {
      return;
    }

    setIsProcessing(true);

    if (isMockPayment) {
      // Simulation pour le mock
      setTimeout(() => {
        toast({
          title: "Paiement simulé réussi !",
          description: "Votre acompte de " + (depositAmount / 100).toFixed(2) + "€ a été traité",
        });
        setIsProcessing(false);
        onSuccess();
      }, 2000);
      return;
    }

    // Code normal pour la production avec vraie clé Stripe
    const { error } = await stripe!.confirmPayment({
      elements: elements!,
      confirmParams: {
        return_url: `${window.location.origin}/booking-success`,
      },
    });

    if (error) {
      toast({
        title: "Erreur de paiement",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
      setIsProcessing(false);
    } else {
      toast({
        title: "Paiement réussi",
        description: "Votre réservation est confirmée !",
      });
      onSuccess();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Formatage automatique pour certains champs
    if (field === 'cardNumber') {
      // Retirer tous les espaces et ne garder que les chiffres
      value = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      // Ajouter des espaces tous les 4 chiffres
      value = typeof value === 'string' ? value.match(/.{1,4}/g)?.join(' ') || value : value;
      // Limiter à 19 caractères (16 chiffres + 3 espaces)
      if (value.length > 19) value = value.substr(0, 19);
    }
    
    if (field === 'expiryDate') {
      // Format MM/YY
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
    }
    
    if (field === 'cvv') {
      // Seulement des chiffres, max 4
      value = value.replace(/\D/g, '').substring(0, 4);
    }

    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isMockPayment ? (
        <div className="space-y-4">
          {/* Numéro de carte */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Numéro de carte</label>
            <div className="relative">
              <Input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                className="h-12 border-gray-200 focus:border-violet-500 pl-10 rounded-lg"
              />
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Date expiration et CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date d'expiration</label>
              <Input
                type="text"
                placeholder="MM/YY"
                value={paymentData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                className="h-12 border-gray-200 focus:border-violet-500 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">CVV</label>
              <Input
                type="text"
                placeholder="123"
                value={paymentData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                className="h-12 border-gray-200 focus:border-violet-500 rounded-lg"
              />
            </div>
          </div>

          {/* Nom du porteur */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nom du porteur</label>
            <Input
              type="text"
              placeholder="Jean Dupont"
              value={paymentData.cardholderName}
              onChange={(e) => handleInputChange('cardholderName', e.target.value)}
              className="h-12 border-gray-200 focus:border-violet-500 rounded-lg"
            />
          </div>

          {/* Méthodes de paiement alternatives */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Autres moyens de paiement</p>
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 justify-start text-left border-gray-200 hover:bg-gray-50"
                onClick={() => {
                  toast({
                    title: "PayPal",
                    description: "Redirection vers PayPal...",
                  });
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">PP</span>
                  </div>
                  <span>PayPal</span>
                </div>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 justify-start text-left border-gray-200 hover:bg-gray-50"
                onClick={() => {
                  toast({
                    title: "Apple Pay",
                    description: "Touch ID ou Face ID requis...",
                  });
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                    <span className="text-white text-xs">🍎</span>
                  </div>
                  <span>Apple Pay</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <PaymentElement 
          options={{
            layout: 'tabs',
            paymentMethodOrder: ['card', 'klarna', 'link']
          }}
        />
      )}

      <Button
        type="submit"
        disabled={(!isMockPayment && !stripe) || isProcessing}
        className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Traitement en cours...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <CreditCard className="mr-2 h-4 w-4" />
            {(() => {
              const depositInfo = calculateDeposit(
                preBookingData?.selectedServices || (selectedService ? [selectedService] : []),
                preBookingData?.totalPrice || selectedService?.price || 0
              );
              
              if (!depositInfo.requiresDeposit) {
                return "Confirmer gratuitement";
              }
              
              return `Payer ${(depositAmount / 100).toFixed(2)} € (acompte ${depositInfo.percentage}%)`;
            })()}
          </span>
        )}
      </Button>
      
      {isMockPayment && (
        <p className="text-xs text-center text-gray-500">
          🧪 Mode démonstration - Utilisez des données fictives
        </p>
      )}
    </form>
  );
}

export default function PlanityStyleBookingFixed() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [elementsKey, setElementsKey] = useState(0); // Force re-mount Elements
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedPro, setSelectedPro] = useState<any>(null);
  const [salonData, setSalonData] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    acceptCGU: false
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const { toast } = useToast();

  // Récupérer les données des étapes précédentes depuis preBookingData (nouveau flux)
  const [preBookingData, setPreBookingData] = useState<any>(null);


  // Charger les données du service sélectionné et du salon au montage du composant
  useEffect(() => {
    const loadSelectedData = async () => {
      try {
        // Priorité à preBookingData (nouveau flux multi-services)
        const preBookingRaw = sessionStorage.getItem('preBookingData');
        console.log('🔍 preBookingRaw:', preBookingRaw);
        
        if (preBookingRaw) {
          const parsed = JSON.parse(preBookingRaw);
          console.log('📋 parsed preBookingData:', parsed);
          setPreBookingData(parsed);
          
          // Charger le professionnel depuis preBookingData
          if (parsed.selectedProId) {
            try {
              const proData = localStorage.getItem('selectedProfessional');
              if (proData) {
                const parsedPro = JSON.parse(proData);
                setSelectedPro(parsedPro);
              }
            } catch (e) {
              console.warn('Erreur chargement pro depuis localStorage:', e);
            }
          }
          
          // Charger le service principal (première prestation)
          if (parsed.selectedServices && parsed.selectedServices.length > 0) {
            setSelectedService(parsed.selectedServices[0]);
            console.log('✅ Services chargés:', parsed.selectedServices);
            console.log('📊 Nombre de services:', parsed.selectedServices.length);
            console.log('💰 Prix total:', parsed.totalPrice);
            console.log('⏱️ Durée totale:', parsed.totalDuration);
            console.log('🔍 Structure complète preBookingData:', parsed);
          }
        } else {
          console.log('⚠️ Aucune donnée preBookingData trouvée, fallback vers localStorage');
          // Fallback vers l'ancien système
          const serviceData = localStorage.getItem('selectedService');
          if (serviceData) {
            const parsed = JSON.parse(serviceData);
            setSelectedService(parsed);
          }

          const proData = localStorage.getItem('selectedProfessional');
          if (proData) {
            const parsedPro = JSON.parse(proData);
            setSelectedPro(parsedPro);
          }
        }

        // Récupérer le salon_slug depuis l'URL
        const currentPath = window.location.pathname;
        const urlMatch = typeof currentPath === 'string' ? currentPath.match(/^\/salon\/([^/]+)/) : null;
        const salonSlug = urlMatch?.[1] || sessionStorage.getItem('salonSlug');
        
        // Récupérer les données du salon
        if (salonSlug) {
          try {
            const response = await fetch(`/api/booking-pages/${salonSlug}`);
            if (response.ok) {
              const salon = await response.json();
              setSalonData(salon);
            }
          } catch (error) {
            console.error('Erreur lors de la récupération des données du salon:', error);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };

    loadSelectedData();
  }, []);



  const createPaymentIntent = async () => {
    try {
      // Calculer le montant total (services multiples ou service unique)
      let totalAmount = 0;
      let serviceNames = [];
      
      if (preBookingData?.selectedServices && preBookingData.selectedServices.length > 0) {
        // Multi-services : utiliser les données de preBookingData
        totalAmount = preBookingData.totalPrice || 0;
        serviceNames = preBookingData.selectedServices.map((s: any) => s.name);
      } else if (selectedService?.price) {
        // Service unique : fallback
        totalAmount = selectedService.price;
        serviceNames = [selectedService.name];
      }
      
      // Calculer l'acompte selon les services sélectionnés
      const depositInfo = calculateDeposit(
        preBookingData?.selectedServices || (selectedService ? [selectedService] : []),
        totalAmount
      );
      
      const depositAmount = depositInfo.requiresDeposit ? Math.round(depositInfo.amount * 100) : 0;
      
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: depositAmount,
          currency: 'eur',
          metadata: {
            salonName: salonData?.salonName || salonData?.name || 'Salon',
            serviceName: serviceNames.join(', ') || 'Service sélectionné',
            clientEmail: loginData.email || formData.email,
            appointmentDate: preBookingData?.selectedDate || 'Date non définie',
            appointmentTime: preBookingData?.selectedTime || '11:00',
            professional: preBookingData?.professionalName || selectedPro?.name || 'any',
            totalServices: preBookingData?.serviceCount || 1,
            totalDuration: preBookingData?.totalDuration || 60
          }
        }),
      });

      const data = await response.json();
      console.log('Réponse paiement:', data);
      
      if (data.clientSecret || data.client_secret) {
        setClientSecret(data.clientSecret || data.client_secret);
        setElementsKey(prev => prev + 1); // Force nouveau mount Elements
        setShowPaymentModal(true);
      } else {
        console.error('Erreur données paiement:', data);
        toast({
          title: "Erreur",
          description: data.message || data.error || "Impossible de créer le paiement",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur création paiement:', error);
      toast({
        title: "Erreur",
        description: "Erreur de connexion au service de paiement",
        variant: "destructive"
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        }),
      });

      const data = await response.json();
      console.log('📋 Réponse API connexion:', data);
      console.log('📋 Response status:', response.status);
      console.log('📋 Response ok:', response.ok);
      
      // Gérer différents formats de réponse réussie
      if (response.ok && (data.success || data.token || data.user || response.status === 200)) {
        const token = data.token || data.client?.token || data.user?.token;
        if (token) {
          localStorage.setItem('clientToken', token);
        }
        console.log('✅ Connexion réussie, ouverture du shell de paiement');
        toast({
          title: "Connexion réussie !",
          description: "Ouverture du paiement..."
        });
        setShowLoginModal(false);
        // Ouvrir directement le shell de paiement intégré
        setTimeout(() => {
          console.log('� Ouverture du shell de paiement...');
          createPaymentIntent();
        }, 500);
      } else {
        toast({
          title: "Erreur de connexion",
          description: data.error || "Email ou mot de passe incorrect",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur connexion:', error);
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation inscription
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
      console.log('📋 Réponse API inscription:', data);
      console.log('📋 Response status:', response.status);
      console.log('📋 Response ok:', response.ok);
      
      // Gérer différents formats de réponse réussie
      if (response.ok && (data.success || data.token || data.user || response.status === 200)) {
        const token = data.token || data.client?.token || data.user?.token;
        if (token) {
          localStorage.setItem('clientToken', token);
        }
        console.log('✅ Inscription réussie, ouverture du shell de paiement');
        toast({
          title: "Compte créé avec succès !",
          description: "Ouverture du paiement..."
        });
        // Ouvrir directement le shell de paiement intégré
        setTimeout(() => {
          console.log('� Ouverture du shell de paiement...');
          createPaymentIntent();
        }, 500);
      } else {
        toast({
          title: "Erreur d'inscription",
          description: data.message || data.error || "Impossible de créer le compte",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur inscription:', error);
      toast({
        title: "Erreur d'inscription",
        description: "Impossible de créer le compte. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec logo Avyento */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-center px-4 py-2">
          <div className="flex items-center justify-center">
            <img 
              src="/avyento-logo.png" 
              alt="Avyento" 
              className="h-16 w-auto"
            />
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-lg mx-auto pt-0 lg:max-w-6xl lg:pt-16">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
        
        {/* Colonne gauche - Informations service (Desktop seulement) */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Récapitulatif de votre réservation</h2>
            
            <div className="space-y-6">
              {/* Services multiples */}
              {preBookingData?.selectedServices && preBookingData.selectedServices.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {preBookingData.selectedServices.length} prestation{preBookingData.selectedServices.length > 1 ? 's' : ''} sélectionnée{preBookingData.selectedServices.length > 1 ? 's' : ''}
                  </h3>
                  {preBookingData.selectedServices.map((service: any, index: number) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg">✂️</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{service.name}</h4>
                        <p className="text-sm text-gray-600">
                          {service.duration ? formatDuration(service.duration) : "—"} • {service.price ? `${service.price}€` : "—"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : selectedService ? (
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-violet-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">✂️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{selectedService.name}</h3>
                    <p className="text-gray-600">
                      {selectedService.duration ? formatDuration(selectedService.duration) : "—"} • {selectedService.price ? `${selectedService.price}€` : "Prix non défini"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">❓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Aucun service sélectionné</h3>
                    <p className="text-gray-600">Veuillez retourner à la page précédente</p>
                  </div>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Détails du rendez-vous</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date :</span>
                    <span className="font-medium">{preBookingData?.selectedDate || new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Heure :</span>
                    <span className="font-medium">{preBookingData?.selectedTime || "09:00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Professionnel :</span>
                    <span className="font-medium">{preBookingData?.professionalName || selectedPro?.name || selectedPro?.nom || "Professionnel"}</span>
                  </div>
                  {(() => {
                    const depositInfo = calculateDeposit(
                      preBookingData?.selectedServices || (selectedService ? [selectedService] : []),
                      preBookingData?.totalPrice || selectedService?.price || 0
                    );
                    
                    return (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Montant total :</span>
                          <span className="font-medium">{preBookingData?.totalPrice ? `${preBookingData.totalPrice.toFixed(2)} €` : selectedService?.price ? `${selectedService.price.toFixed(2)} €` : "—"}</span>
                        </div>
                        {depositInfo.requiresDeposit && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Acompte ({depositInfo.percentage}%) :</span>
                            <span className="font-medium text-violet-600">{depositInfo.amount.toFixed(2)} €</span>
                          </div>
                        )}
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-gray-600 font-semibold">À régler aujourd'hui :</span>
                          <span className="font-bold text-lg text-gray-900">
                            {depositInfo.requiresDeposit ? `${depositInfo.amount.toFixed(2)} €` : '0,00 €'}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Colonne droite - Formulaire */}
        <div className="lg:max-w-none">
          {/* Section service sélectionné (Mobile seulement) - Version améliorée */}
          <div className="bg-white border-b border-gray-100 p-4 lg:hidden">
            <div className="space-y-3">
              {/* Services multiples ou service unique */}
              {preBookingData?.selectedServices && preBookingData.selectedServices.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">
                    {preBookingData.selectedServices.length} prestation{preBookingData.selectedServices.length > 1 ? 's' : ''} sélectionnée{preBookingData.selectedServices.length > 1 ? 's' : ''}
                  </h3>
                  {preBookingData.selectedServices.map((service: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">✂️</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{service.name}</h4>
                        <p className="text-xs text-gray-500">
                          {service.duration ? formatDuration(service.duration) : "—"} • {service.price ? `${service.price}€` : "—"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : selectedService ? (
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">✂️</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{selectedService.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedService.duration ? formatDuration(selectedService.duration) : "—"} • {selectedService.price ? `${selectedService.price}€` : "Prix non défini"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">❓</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">Aucun service sélectionné</h3>
                    <p className="text-sm text-gray-500">Veuillez retourner à la page précédente</p>
                  </div>
                </div>
              )}
              
              {/* Détails du RDV */}
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date :</span>
                  <span className="font-medium text-gray-900">{preBookingData?.selectedDate || new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Heure :</span>
                  <span className="font-medium text-gray-900">{preBookingData?.selectedTime || "09:00"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Professionnel :</span>
                  <span className="font-medium text-gray-900 truncate">{preBookingData?.professionalName || selectedPro?.name || selectedPro?.nom || "Professionnel"}</span>
                </div>
                {(() => {
                  const depositInfo = calculateDeposit(
                    preBookingData?.selectedServices || (selectedService ? [selectedService] : []),
                    preBookingData?.totalPrice || selectedService?.price || 0
                  );
                  
                  return (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Montant total :</span>
                        <span className="font-medium text-gray-900">{preBookingData?.totalPrice ? `${preBookingData.totalPrice.toFixed(2)} €` : selectedService?.price ? `${selectedService.price.toFixed(2)} €` : "—"}</span>
                      </div>
                      {depositInfo.requiresDeposit && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Acompte ({depositInfo.percentage}%) :</span>
                          <span className="font-medium text-violet-600">{depositInfo.amount.toFixed(2)} €</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm border-t pt-2">
                        <span className="text-gray-600 font-semibold">À régler aujourd'hui :</span>
                        <span className="font-bold text-gray-900">
                          {depositInfo.requiresDeposit ? `${depositInfo.amount.toFixed(2)} €` : '0,00 €'}
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
              
            </div>
          </div>

        {/* Titre et bouton connexion */}
        <div className="bg-white p-4 border-b border-gray-100 lg:bg-transparent lg:border-0 lg:p-0 lg:mb-6">
          <h2 className="text-lg font-semibold text-center text-gray-900 mb-4 lg:text-3xl lg:font-bold lg:text-left lg:mb-6">
            Nouveau sur Avyento ?
          </h2>
          
          {/* Bouton "J'ai déjà un compte" */}
          <Button
            onClick={() => setShowLoginModal(true)}
            className="w-full h-12 mb-4 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium lg:h-14 lg:text-lg lg:font-medium transition-all duration-200"
          >
            <span className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              J'ai déjà un compte - Se connecter
            </span>
          </Button>
          
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-3 text-xs text-gray-500 lg:text-sm">ou créer un nouveau compte</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>
        </div>

        {/* Formulaire d'inscription */}
        <form id="signup-form" onSubmit={handleSubmit} className="bg-white p-4 space-y-4 lg:bg-white lg:rounded-lg lg:shadow-sm lg:border lg:border-gray-200 lg:p-8 lg:space-y-6 pb-24 lg:pb-8">
          {/* Prénom et Nom */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Prénom <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Prénom"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="h-12 border-gray-200 focus:border-violet-500 rounded-lg"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Nom <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Nom"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="h-12 border-gray-200 focus:border-violet-500 rounded-lg"
              />
            </div>
          </div>

          {/* Téléphone */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Téléphone portable <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg">
                <span className="text-sm">🇫🇷</span>
              </div>
              <Input
                type="tel"
                placeholder="06 12 34 56 78"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="h-12 border-gray-200 focus:border-violet-500 rounded-l-none rounded-r-lg"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="h-12 border-gray-200 focus:border-violet-500 rounded-lg"
            />
          </div>

          {/* Mot de passe */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Mot de passe <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 6 caractères"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="h-12 border-gray-200 focus:border-violet-500 pr-10 rounded-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* CGU */}
          <div className="flex items-start space-x-3 pt-2">
            <Checkbox
              id="cgu"
              checked={formData.acceptCGU}
              onCheckedChange={(checked) => setFormData({...formData, acceptCGU: !!checked})}
              className="mt-1 rounded border-gray-300"
            />
            <label htmlFor="cgu" className="text-sm text-gray-600 leading-5 select-none">
              J'accepte les{" "}
              <span className="text-violet-600 underline cursor-pointer hover:text-violet-700">
                CGU
              </span>{" "}
              d'Avyento.
            </label>
          </div>

          {/* Bouton créer compte */}
          <Button
            type="submit"
            className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg shadow-sm lg:h-14 lg:text-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Créer mon compte
            </span>
          </Button>
        </form>
        </div>
        </div>
      </div>


      {/* Bottom sheet de connexion */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 lg:items-center">
          <div className="bg-white w-full max-w-lg rounded-t-3xl lg:rounded-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom lg:slide-in-from-scale-95 duration-300 lg:max-h-[80vh] lg:shadow-2xl">
            {/* Header avec poignée */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 rounded-t-3xl lg:rounded-t-2xl">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4 lg:hidden"></div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Se connecter</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowLoginModal(false)}
                  className="h-8 w-8 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Contenu du formulaire */}
            <div className="p-6">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <Input
                    type="email"
                    placeholder="Votre email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    className="h-12 border-gray-200 focus:border-violet-500 rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Mot de passe</label>
                  <Input
                    type="password"
                    placeholder="Votre mot de passe"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="h-12 border-gray-200 focus:border-violet-500 rounded-xl"
                    required
                  />
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-violet-600 hover:underline"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Se connecter
                  </span>
                </Button>

                {/* Separator */}
                <div className="flex items-center my-6">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="px-3 text-sm text-gray-500">ou</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {/* Options alternatives */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 border-gray-200 hover:bg-gray-50 rounded-xl"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continuer avec Google
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 border-gray-200 hover:bg-gray-50 rounded-xl"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Continuer avec Facebook
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Bottom sheet de paiement */}
      {showPaymentModal && clientSecret && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 lg:items-center">
          <div className="bg-white w-full max-w-lg rounded-t-3xl lg:rounded-2xl max-h-[90vh] animate-in slide-in-from-bottom lg:slide-in-from-scale-95 duration-300 flex flex-col lg:max-h-[85vh] lg:shadow-2xl">
            {/* Header STATIQUE - ne bouge jamais */}
            <div className="bg-white border-b border-gray-100 p-4 rounded-t-3xl lg:rounded-t-2xl flex-shrink-0">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4 lg:hidden"></div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-violet-600" />
                  Paiement sécurisé
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPaymentModal(false)}
                  className="h-8 w-8 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Contenu scrollable */}
            <div className="flex-1 overflow-y-auto">

              {/* Formulaire de paiement dans la zone scrollable */}
              <div className="p-6">
                <Elements 
                  key={elementsKey}
                  stripe={stripePromise} 
                  options={{ 
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#7c3aed',
                        colorBackground: '#ffffff',
                        colorText: '#1f2937',
                        fontFamily: 'system-ui, sans-serif',
                        borderRadius: '12px',
                      }
                    }
                  }}
                >
                  <PaymentForm 
                    clientSecret={clientSecret} 
                    onSuccess={async () => {
                      try {
                        console.log('🎉 PAIEMENT RÉUSSI ! Début sauvegarde...');
                        console.log('📅 preBookingData:', preBookingData);
                        console.log('🛎️ selectedService:', selectedService);
                        console.log('👤 formData:', formData);

                        // Sauvegarder les données de réservation pour la page de confirmation
                        const bookingData = {
                          salonName: salonData?.salonName || salonData?.name || 'Salon',
                          serviceName: preBookingData?.selectedServices ? 
                            preBookingData.selectedServices.map((s: any) => s.name).join(', ') : 
                            (selectedService?.name || 'Service'),
                          servicePrice: preBookingData?.totalPrice || selectedService?.price || 0,
                          date: preBookingData?.selectedDate || new Date().toLocaleDateString('fr-FR'),
                          time: preBookingData?.selectedTime || '09:00',
                          clientName: formData.firstName && formData.lastName 
                            ? `${formData.firstName} ${formData.lastName}` 
                            : formData.email || 'Client',
                          professionalName: preBookingData?.professionalName || selectedPro?.name || 'À assigner',
                          depositAmount: (() => {
                            const depositInfo = calculateDeposit(
                              preBookingData?.selectedServices || (selectedService ? [selectedService] : []),
                              preBookingData?.totalPrice || selectedService?.price || 0
                            );
                            return depositInfo.requiresDeposit ? Math.round(depositInfo.amount * 100) : 0;
                          })(),
                          totalServices: preBookingData?.serviceCount || 1,
                          totalDuration: preBookingData?.totalDuration || 60,
                          selectedServices: preBookingData?.selectedServices || []
                        };
                        localStorage.setItem('bookingData', JSON.stringify(bookingData));

                        // Sauvegarder le rendez-vous en base de données
                        // Déterminer le salon_id depuis l'URL ou le contexte
                        const currentPath = window.location.pathname;
                        const urlMatch = typeof currentPath === 'string' ? currentPath.match(/^\/salon\/([^/]+)/) : null;
                        const salonSlug = urlMatch?.[1] || sessionStorage.getItem('salonSlug');

                        // Conversion de la date française en format ISO
                        const convertToISODate = (dateStr: string | undefined): string => {
                          if (!dateStr || dateStr.includes('-')) return dateStr || new Date().toISOString().split('T')[0]; // Déjà au format ISO
                          
                          // Si c'est en format français, utiliser la date d'aujourd'hui en format ISO
                          return new Date().toISOString().split('T')[0];
                        };

                        const appointmentData = {
                          client_name: formData.firstName && formData.lastName 
                            ? `${formData.firstName} ${formData.lastName}` 
                            : formData.email,
                          service: preBookingData?.selectedServices ? 
                            preBookingData.selectedServices.map((s: any) => s.name).join(', ') : 
                            (selectedService?.name || 'Service'),
                          date: convertToISODate(preBookingData?.selectedDate) || new Date().toISOString().split('T')[0],
                          start_time: preBookingData?.selectedTime || '09:00',
                          duration: preBookingData?.totalDuration || selectedService?.duration || 60,
                          price: preBookingData?.totalPrice || selectedService?.price || 50,
                          salon_slug: salonSlug, // Utiliser salon_slug pour les réservations publiques
                          selected_services: preBookingData?.selectedServices || [],
                          service_count: preBookingData?.serviceCount || 1
                        };

                        console.log('💾 Données à sauvegarder avec salon_slug:', appointmentData);

                        const response = await fetch('/api/appointments', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          credentials: 'include', // CRUCIAL: pour envoyer les cookies de session
                          body: JSON.stringify({
                            salonId: preBookingData?.salonId || salonSlug,
                            professionalId: preBookingData?.professionalId || selectedPro?.id,
                            clientId: null, // Pas encore de compte client
                            clientName: formData.firstName && formData.lastName 
                              ? `${formData.firstName} ${formData.lastName}` 
                              : formData.email,
                            clientEmail: formData.email,
                            clientPhone: formData.phone,
                            selectedServices: preBookingData?.selectedServices || [],
                            startDate: convertToISODate(preBookingData?.selectedDate) || new Date().toISOString().split('T')[0],
                            startTime: preBookingData?.selectedTime || '09:00',
                            timezone: preBookingData?.timezone || 'Europe/Paris',
                            totalPrice: preBookingData?.totalPrice || selectedService?.price || 50,
                            totalDuration: preBookingData?.totalDuration || selectedService?.duration || 60,
                            paymentStatus: 'paid', // Paiement réussi
                            notes: ''
                          })
                        });

                        if (response.ok) {
                          const savedAppointment = await response.json();
                          console.log('✅ Rendez-vous sauvegardé:', savedAppointment.id);
                        } else {
                          console.error('❌ Erreur sauvegarde:', await response.text());
                        }
                      } catch (error) {
                        console.error('❌ Erreur lors de la sauvegarde:', error);
                      }

                      setShowPaymentModal(false);
                      setLocation('/booking-confirmation');
                    }}
                    depositAmount={(() => {
                      const depositInfo = calculateDeposit(
                        preBookingData?.selectedServices || (selectedService ? [selectedService] : []),
                        preBookingData?.totalPrice || selectedService?.price || 0
                      );
                      return depositInfo.requiresDeposit ? Math.round(depositInfo.amount * 100) : 0;
                    })()}
                  />
                </Elements>

                {/* Sécurité */}
                <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Paiement sécurisé par Stripe
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}