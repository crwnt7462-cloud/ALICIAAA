import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Check, Shield, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@assets/3_1753714984824.png";

export default function SubscriptionPaymentPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [planData, setPlanData] = useState<any>(null);

  useEffect(() => {
    // Récupérer les données du plan depuis le localStorage
    const storedPlan = localStorage.getItem('selectedSubscriptionPlan');
    const storedUser = localStorage.getItem('pendingRegistration');
    
    if (storedPlan && storedUser) {
      setPlanData({
        plan: JSON.parse(storedPlan),
        user: JSON.parse(storedUser)
      });
    } else {
      // Rediriger vers la sélection de plan si pas de données
      setLocation('/subscription-plans');
    }
  }, [setLocation]);

  const handlePayment = async () => {
    if (!planData) return;
    
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/stripe/create-subscription-checkout', {
        planType: planData.plan.type,
        customerEmail: planData.user.email,
        customerName: `${planData.user.firstName} ${planData.user.lastName}`
      });

      if (response.url) {
        // Rediriger vers Stripe Checkout
        window.location.href = response.url;
      }
    } catch (error: any) {
      console.error('Erreur création paiement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la session de paiement. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanPrice = (planType: string, billing: string) => {
    const prices = {
      essentiel: { monthly: 29, yearly: 24 },
      professionnel: { monthly: 79, yearly: 65 },
      premium: { monthly: 149, yearly: 129 }
    };
    return prices[planType as keyof typeof prices]?.[billing as keyof typeof prices.essentiel] || 0;
  };

  if (!planData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const { plan, user } = planData;
  const price = getPlanPrice(plan.type, plan.billing || 'monthly');
  const isYearly = plan.billing === 'yearly';

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={logoImage} alt="Logo" className="h-14 w-auto" />
              <div className="ml-4">
                <p className="text-sm font-medium">Étape 3/3</p>
                <p className="text-xs text-gray-500">Paiement sécurisé</p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              onClick={() => setLocation('/subscription-plans')}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Résumé de commande */}
          <div>
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Résumé de votre abonnement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Plan sélectionné */}
                <div className="flex items-center justify-between p-4 bg-violet-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-lg capitalize">{plan.type}</h3>
                    <p className="text-sm text-gray-600">
                      Facturé {isYearly ? 'annuellement' : 'mensuellement'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-violet-600">{price}€</p>
                    <p className="text-sm text-gray-500">
                      /{isYearly ? 'an' : 'mois'}
                    </p>
                  </div>
                </div>

                {/* Informations client */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Informations du salon</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>{user.firstName} {user.lastName}</p>
                    <p>{user.email}</p>
                    <p>{user.salonName}</p>
                  </div>
                </div>

                {/* Essai gratuit */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-800 mb-2">
                    <Check className="w-4 h-4" />
                    <span className="font-medium">14 jours d'essai gratuit</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Votre premier paiement aura lieu le {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </p>
                </div>

                {/* Inclus dans le plan */}
                <div>
                  <h4 className="font-medium mb-3">Inclus dans votre plan</h4>
                  <div className="space-y-2">
                    {plan.type === 'essentiel' && (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>Gestion planning & clientèle</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>Réservations en ligne</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>Support email</span>
                        </div>
                      </>
                    )}
                    
                    {plan.type === 'professionnel' && (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>Tout l'Essentiel +</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>Analytics avancés</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>IA Smart planning</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>Multi-établissements</span>
                        </div>
                      </>
                    )}
                    
                    {plan.type === 'premium' && (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>Tout le Professionnel +</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>IA Pro & Prédictions</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>Messagerie illimitée</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>Support prioritaire 24/7</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section paiement */}
          <div>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Paiement sécurisé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Badges sécurité */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">SSL Sécurisé</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <Clock className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Essai 14 jours</span>
                  </div>
                </div>

                {/* Information paiement */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Informations importantes</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Aucun frais pendant les 14 premiers jours</li>
                    <li>• Annulation possible à tout moment</li>
                    <li>• Paiement sécurisé par Stripe</li>
                    <li>• Toutes les cartes bancaires acceptées</li>
                  </ul>
                </div>

                {/* Bouton de paiement */}
                <Button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full bg-violet-600 hover:bg-violet-700 h-12 text-base font-medium"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Préparation du paiement...
                    </div>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Commencer l'essai gratuit
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-gray-500">
                  En continuant, vous acceptez nos{' '}
                  <a href="/terms" className="text-violet-600 hover:underline">
                    conditions d'utilisation
                  </a>{' '}
                  et notre{' '}
                  <a href="/privacy" className="text-violet-600 hover:underline">
                    politique de confidentialité
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}