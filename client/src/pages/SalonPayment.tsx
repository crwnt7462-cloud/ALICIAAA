import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard, Shield, CheckCircle, Sparkles, Lock, Calendar } from "lucide-react";

export default function SalonPayment() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState('payment'); // 'payment' | 'success'
  
  // Récupérer les paramètres de l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const selectedPlan = urlParams.get('plan') || 'professionnel';
  const salonName = urlParams.get('salon') || 'Votre salon';

  const plans = {
    essentiel: { 
      name: "Essentiel", 
      price: "29€", 
      originalPrice: "39€",
      color: "from-green-500 to-emerald-600",
      features: [
        "Gestion des créneaux et planning complet",
        "Gestion clientèle (fiches, historique, notes)",
        "Réservation client intuitive",
        "Conformité RGPD",
        "Support par email"
      ]
    },
    professionnel: { 
      name: "Professionnel", 
      price: "79€", 
      originalPrice: "99€",
      color: "from-blue-500 to-purple-600",
      features: [
        "Tout l'Essentiel +",
        "Aspects financiers complets",
        "Communication & marketing",
        "Analytics avancés",
        "IA Smart planning",
        "Support prioritaire"
      ]
    },
    premium: { 
      name: "Premium", 
      price: "149€", 
      originalPrice: "199€",
      color: "from-purple-500 to-pink-600",
      features: [
        "Tout le Professionnel +",
        "IA complète : rebooking auto",
        "Marketing intelligent",
        "Fonctionnalités client boostées",
        "Établissements illimités",
        "Support prioritaire + formation"
      ]
    }
  };

  const selectedPlanInfo = plans[selectedPlan as keyof typeof plans] || plans.professionnel;

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    billingAddress: '',
    city: '',
    postalCode: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const formatted = numbers.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.substring(0, 2) + '/' + numbers.substring(2, 4);
    }
    return numbers;
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Préparation des données de salon pour l'API
      const salonData = JSON.parse(localStorage.getItem('salonFormData') || '{}');
      
      // Création de l'inscription salon
      const response = await fetch('/api/salon-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...salonData,
          selectedPlan,
          stripePaymentUrl: selectedPlan === 'essentiel' 
            ? 'https://buy.stripe.com/test_14AfZj1xX2Th3f832j7wA00'
            : null
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'inscription');
      }

      const result = await response.json();
      
      // Redirection vers Stripe pour le paiement réel
      if (selectedPlan === 'essentiel') {
        window.location.href = 'https://buy.stripe.com/test_14AfZj1xX2Th3f832j7wA00';
      } else {
        // Pour les autres plans, afficher la page de succès temporairement
        setPaymentStep('success');
        setTimeout(() => {
          setLocation('/business-features');
        }, 3000);
      }
      
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-0 shadow-2xl">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Félicitations ! 🎉
              </h1>
              <p className="text-xl text-gray-600">
                Votre salon <span className="font-bold text-purple-600">{decodeURIComponent(salonName)}</span> est maintenant inscrit !
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl space-y-3">
              <h3 className="font-bold text-lg">Votre abonnement {selectedPlanInfo.name}</h3>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Facturé mensuellement</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Résiliable à tout moment</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Prochaines étapes :</h4>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Vérifiez votre email pour les détails de connexion</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Configurez votre profil et vos services</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Créez votre page de réservation personnalisée</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => setLocation('/')}
                className="flex-1 h-12 rounded-xl border-gray-200 hover:bg-gray-50"
              >
                Retour à l'accueil
              </Button>
              <Button
                onClick={() => setLocation('/business-features')}
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Accéder à mon espace
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/salon-registration')}
              className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Finaliser votre inscription
              </h1>
              <p className="text-gray-600">Paiement sécurisé pour votre abonnement {selectedPlanInfo.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Récapitulatif commande - Sidebar */}
          <div className="lg:col-span-2">
            <Card className="sticky top-28 border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
              <CardHeader>
                <CardTitle className="text-center">Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Plan sélectionné */}
                <div className={`p-6 rounded-2xl bg-gradient-to-r ${selectedPlanInfo.color} text-white`}>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5" />
                    <h3 className="font-bold text-xl">{selectedPlanInfo.name}</h3>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-3xl font-bold">{selectedPlanInfo.price}</span>
                      <span className="text-lg opacity-75">/mois</span>
                    </div>
                    <p className="text-sm line-through opacity-75">{selectedPlanInfo.originalPrice}/mois</p>
                    <p className="text-xs opacity-90">Offre de lancement -25%</p>
                  </div>
                </div>

                {/* Fonctionnalités incluses */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Inclus dans votre abonnement :</h4>
                  <div className="space-y-2">
                    {selectedPlanInfo.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Garanties */}
                <div className="bg-green-50 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Garanties incluses</span>
                  </div>
                  <div className="space-y-1 text-sm text-green-700">
                    <p>✓ 14 jours d'essai gratuit</p>
                    <p>✓ Résiliation sans engagement</p>
                    <p>✓ Remboursement intégral si insatisfait</p>
                  </div>
                </div>

                {/* Salon */}
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">Salon :</p>
                  <p className="font-medium">{decodeURIComponent(salonName)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulaire de paiement */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  Informations de paiement
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Lock className="h-4 w-4" />
                  <span>Paiement 100% sécurisé SSL</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Informations carte */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="text-sm font-medium">
                      Numéro de carte
                    </Label>
                    <Input
                      id="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      className="rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate" className="text-sm font-medium">
                        Date d'expiration
                      </Label>
                      <Input
                        id="expiryDate"
                        value={paymentData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                        placeholder="MM/AA"
                        className="rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                        maxLength={5}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="text-sm font-medium">
                        CVV
                      </Label>
                      <Input
                        id="cvv"
                        value={paymentData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                        placeholder="123"
                        className="rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName" className="text-sm font-medium">
                      Nom sur la carte
                    </Label>
                    <Input
                      id="cardName"
                      value={paymentData.cardName}
                      onChange={(e) => handleInputChange('cardName', e.target.value)}
                      placeholder="Jean Dupont"
                      className="rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Adresse de facturation */}
                <div className="border-t pt-6 space-y-4">
                  <h3 className="font-medium text-gray-900">Adresse de facturation</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="billingAddress" className="text-sm font-medium">
                      Adresse
                    </Label>
                    <Input
                      id="billingAddress"
                      value={paymentData.billingAddress}
                      onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                      placeholder="123 Rue de la Paix"
                      className="rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium">
                        Ville
                      </Label>
                      <Input
                        id="city"
                        value={paymentData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Paris"
                        className="rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postalCode" className="text-sm font-medium">
                        Code postal
                      </Label>
                      <Input
                        id="postalCode"
                        value={paymentData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        placeholder="75001"
                        className="rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Bouton de paiement */}
                <div className="pt-6">
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full h-14 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium shadow-lg hover:shadow-xl transition-all text-lg"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-3">
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Traitement en cours...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5" />
                        <span>Confirmer le paiement • {selectedPlanInfo.price}/mois</span>
                      </div>
                    )}
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center mt-3">
                    En confirmant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                    Votre abonnement sera automatiquement renouvelé chaque mois.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}