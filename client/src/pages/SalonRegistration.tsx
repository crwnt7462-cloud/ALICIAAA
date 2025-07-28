import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { ArrowLeft, X, CreditCard } from "lucide-react";

// Configuration Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_51Rn0zHQbSa7XrNpDpM6MD9LPmkUAPzClEdnFW34j3evKDrUxMud0I0p6vk3ESOBwxjAwmj1cKU5VrKGa7pef6onE00eC66JjRo");

// Composant de paiement Stripe pour professionnels
function ProfessionalStripePaymentForm({ onSuccess, clientSecret, planName, planPrice }: { 
  onSuccess: () => void, 
  clientSecret: string,
  planName: string,
  planPrice: string
}) {
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
            name: "Professionnel",
            email: "pro@example.com",
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center pb-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Finaliser votre abonnement</h3>
        <p className="text-sm text-gray-600 mt-1">Plan {planName} - {planPrice}€/mois</p>
      </div>

      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
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
        className="w-full bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Traitement en cours...
          </div>
        ) : (
          `Confirmer & Payer ${planPrice}€`
        )}
      </Button>

      <div className="text-center text-xs text-gray-500">
        <p>🔒 Paiement sécurisé par Stripe</p>
        <p>Votre abonnement sera actif immédiatement</p>
      </div>
    </form>
  );
}

export default function SalonRegistration() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [salonId, setSalonId] = useState<string | null>(null);
  const { toast } = useToast();

  // Récupérer le plan d'abonnement depuis l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const subscriptionPlan = urlParams.get('plan') || 'pro';

  // Configuration des plans avec prix
  const planConfig = {
    'starter': { name: 'Beauty Start', price: '29' },
    'professional': { name: 'Beauty Pro', price: '79' },
    'enterprise': { name: 'Beauty Empire', price: '149' }
  };

  const currentPlan = planConfig[subscriptionPlan as keyof typeof planConfig] || planConfig.professional;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/salon/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          salonData: formData,
          subscriptionPlan
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSalonId(data.salon.id);
        
        toast({
          title: "Salon enregistré",
          description: "Ouverture du paiement..."
        });
        
        // Créer le Payment Intent pour l'abonnement professionnel
        setTimeout(() => {
          createProfessionalPaymentIntent(data.salon.id);
        }, 800);
      } else {
        const error = await response.json();
        toast({
          title: "Erreur",
          description: error.error || "Une erreur est survenue",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter au serveur",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour créer le Payment Intent professionnel
  const createProfessionalPaymentIntent = async (salonId: string) => {
    try {
      const response = await fetch('/api/create-professional-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salonId,
          plan: subscriptionPlan,
          amount: parseFloat(currentPlan.price)
        }),
      });

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setShowPaymentSheet(true);
      }
    } catch (error) {
      console.error('Erreur Payment Intent:', error);
      toast({
        title: "Erreur de paiement",
        description: "Impossible de préparer le paiement",
        variant: "destructive"
      });
    }
  };

  // Fonction appelée après paiement réussi
  const handlePaymentSuccess = () => {
    setShowPaymentSheet(false);
    toast({
      title: "Paiement confirmé !",
      description: "Votre abonnement est maintenant actif"
    });
    
    // Rediriger vers la personnalisation du salon
    setTimeout(() => {
      setLocation(`/edit-salon?salonId=${salonId}&success=true`);
    }, 1500);
  };

  // Rendu du Bottom Sheet de paiement professionnel
  const renderProfessionalPaymentSheet = () => (
    showPaymentSheet && clientSecret && (
      <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
        <div className="bg-white w-full max-w-lg rounded-t-3xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-100 p-4 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-violet-600" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Paiement Professionnel</h2>
                  <p className="text-sm text-gray-600">Abonnement {currentPlan.name}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPaymentSheet(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-6">
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <ProfessionalStripePaymentForm
                onSuccess={handlePaymentSuccess}
                clientSecret={clientSecret}
                planName={currentPlan.name}
                planPrice={currentPlan.price}
              />
            </Elements>
          </div>
        </div>
      </div>
    )
  );

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/subscription-plans')}
              className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
            >
              ←
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inscription de votre salon</h1>
              <p className="text-gray-600">Plan sélectionné : {subscriptionPlan === 'pro' ? 'Pro (49€/mois)' : 'Premium (149€/mois)'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>
              Informations de votre salon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du salon *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Salon Excellence"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Décrivez votre salon en quelques mots..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse complète *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="123 Avenue de la Beauté, 75001 Paris"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="01 42 34 56 78"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="contact@salon.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Site web (optionnel)</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://www.monsalon.com"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Après inscription</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Paiement sécurisé avec Stripe</li>
                  <li>• Personnalisation de votre page salon</li>
                  <li>• Activation immédiate de vos fonctionnalités</li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !formData.name || !formData.address}
                className="w-full bg-violet-600 hover:bg-violet-700"
              >
                {isLoading ? "Inscription en cours..." : "Continuer vers le paiement"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Sheet de paiement professionnel */}
      {renderProfessionalPaymentSheet()}
    </div>
  );
}