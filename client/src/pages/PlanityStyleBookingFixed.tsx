import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Eye, EyeOff, X, CreditCard, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Configuration Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

// Composant de formulaire de paiement
function PaymentForm({ clientSecret, onSuccess }: { clientSecret: string, onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement 
        options={{
          layout: 'tabs',
          paymentMethodOrder: ['card', 'klarna', 'link']
        }}
      />

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Traitement en cours...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Payer 11,70 € (acompte 30%)
          </>
        )}
      </Button>
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

  // Récupérer les données des étapes précédentes
  const selectedProfessional = localStorage.getItem('selectedProfessional');
  const selectedDateTime = JSON.parse(localStorage.getItem('selectedDateTime') || '{}');



  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 1170, // 39€ * 30% = 11,70€ en centimes
          currency: 'eur',
          metadata: {
            salonName: 'Bonhomme - Paris Archives',
            serviceName: 'Coupe Bonhomme',
            clientEmail: loginData.email || formData.email,
            appointmentDate: selectedDateTime?.date || 'Jeudi 20 février',
            appointmentTime: selectedDateTime?.time || '11:00',
            professional: selectedProfessional || 'any'
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
      const response = await fetch('/api/client/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('clientToken', data.client.token);
        toast({
          title: "Connexion réussie !",
          description: "Redirection vers le paiement..."
        });
        setShowLoginModal(false);
        // Ouvrir le shell de paiement après connexion
        setTimeout(() => createPaymentIntent(), 500);
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
      
      if (data.success) {
        localStorage.setItem('clientToken', data.client.token);
        toast({
          title: "Compte créé avec succès !",
          description: "Redirection vers le paiement..."
        });
        // Ouvrir le shell de paiement après inscription
        setTimeout(() => createPaymentIntent(), 500);
      } else {
        toast({
          title: "Erreur d'inscription",
          description: data.error || "Impossible de créer le compte",
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

      {/* Contenu principal */}
      <div className="max-w-lg mx-auto pt-8">
        {/* Section service sélectionné */}
        <div className="bg-white border-b border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Coupe Bonhomme</h3>
              <p className="text-sm text-gray-500">30 min • 39,00 €</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">{selectedDateTime?.date || "Jeudi 20 février"}</p>
              <p className="font-medium text-gray-900">{selectedDateTime?.time || "11:00"}</p>
            </div>
          </div>
        </div>

        {/* Titre et bouton connexion */}
        <div className="bg-white p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-center text-gray-900 mb-4">
            Nouveau sur Planity ?
          </h2>
          
          {/* Bouton "J'ai déjà un compte" */}
          <Button
            variant="outline"
            onClick={() => setShowLoginModal(true)}
            className="w-full h-12 mb-4 bg-white hover:bg-gray-50 border-gray-300 text-gray-700"
          >
            J'ai déjà un compte - Se connecter
          </Button>
          
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-3 text-sm text-gray-500">ou créer un nouveau compte</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>
        </div>

        {/* Formulaire d'inscription */}
        <form onSubmit={handleSubmit} className="bg-white p-4 space-y-4">
          {/* Prénom et Nom */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm text-gray-700">
                Prénom <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Prénom"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="h-12 border-gray-200 focus:border-violet-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-700">
                Nom <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Nom"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="h-12 border-gray-200 focus:border-violet-500"
              />
            </div>
          </div>

          {/* Téléphone */}
          <div className="space-y-1">
            <label className="text-sm text-gray-700">
              Téléphone portable <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-md">
                <span className="text-sm">🇫🇷</span>
              </div>
              <Input
                type="tel"
                placeholder="Enter votre numéro..."
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="h-12 border-gray-200 focus:border-violet-500 rounded-l-none"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="h-12 border-gray-200 focus:border-violet-500"
            />
          </div>

          {/* Mot de passe */}
          <div className="space-y-1">
            <label className="text-sm text-gray-700">
              Mot de passe <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="h-12 border-gray-200 focus:border-violet-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
              className="mt-1"
            />
            <label htmlFor="cgu" className="text-sm text-gray-600 leading-5">
              J'accepte les <span className="text-violet-600 underline">CGU</span> de Planity.
            </label>
          </div>

          {/* Bouton créer compte */}
          <Button
            type="submit"
            className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-medium"
          >
            Créer mon compte
          </Button>
        </form>
      </div>

      {/* Bottom sheet de connexion */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-t-3xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            {/* Header avec poignée */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 rounded-t-3xl">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
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
                  className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl"
                >
                  Se connecter
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
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-t-3xl max-h-[90vh] animate-in slide-in-from-bottom duration-300 flex flex-col">
            {/* Header STATIQUE - ne bouge jamais */}
            <div className="bg-white border-b border-gray-100 p-4 rounded-t-3xl flex-shrink-0">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Paiement sécurisé</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPaymentModal(false)}
                  className="h-8 w-8"
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
                    onSuccess={() => {
                      setShowPaymentModal(false);
                      setLocation('/booking-success');
                    }}
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