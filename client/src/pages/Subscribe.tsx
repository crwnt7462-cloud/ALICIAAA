import { useState, useEffect } from "react";
import { Check, ArrowLeft, CreditCard, Shield, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import logoImage from "@/assets/avyento-logo.png";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { apiRequest } from "@/api";
import { useToast } from "@/hooks/use-toast";

export default function Subscribe() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    salonName: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [billingCycle, setBillingCycle] = useState<string>('');
  const [promoCode, setPromoCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState<number>(0);

  // Extraire les paramètres de l'URL
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    setSelectedPlan(params.get('plan') || '');
    setBillingCycle(params.get('billing') || 'monthly');
  }, [location]);

  const planDetails = {
    essentiel: {
      name: 'Essentiel',
      monthlyPrice: 29,
      yearlyPrice: 24,
      features: ['Gestion planning', 'Gestion clientèle', 'Réservations', 'Support email']
    },
    professionnel: {
      name: 'Professionnel',
      monthlyPrice: 79,
      yearlyPrice: 65,
      features: ['Tout l\'Essentiel', 'Analytics avancés', 'IA Smart planning', 'Multi-établissements']
    },
    premium: {
      name: 'Premium',
      monthlyPrice: 149,
      yearlyPrice: 125,
      features: ['Tout le Professionnel', 'IA complète', 'Marketing intelligent', 'Support prioritaire']
    }
  };

  const currentPlan = planDetails[selectedPlan as keyof typeof planDetails];
  const basePrice = currentPlan ? (billingCycle === 'annual' ? currentPlan.yearlyPrice : currentPlan.monthlyPrice) : 0;
  
  // Calcul du prix final avec code promo
  useEffect(() => {
    setFinalPrice(Math.max(0, basePrice - discount));
  }, [basePrice, discount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Système de limitation progressive
  const getBlockDuration = (attempts: number) => {
    if (attempts === 3) return 1; // 1 minute
    if (attempts === 4) return 5; // 5 minutes
    if (attempts === 5) return 15; // 15 minutes
    if (attempts >= 6) return 60; // 1 heure
    return 0;
  };

  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isBlocked) {
      toast({
        title: "Trop de tentatives",
        description: `Veuillez attendre ${blockTimeRemaining} minutes avant de réessayer.`,
        variant: "destructive",
      });
      return;
    }

    const code = e.target.value.toUpperCase();
    setPromoCode(code);
    
    // Codes promo valides
    const validCodes = {
      'FREE149': { discount: 149, requiresPremium: true, description: "🎉 Abonnement Premium Pro GRATUIT pour 1 mois !" },
      'WELCOME25': { discount: 25, requiresPremium: false, description: "25€ de réduction sur votre premier mois !" },
      'SAVE50': { discount: 50, requiresPremium: false, description: "50€ de réduction sur votre abonnement !" }
    };

    if (code === '') {
      setDiscount(0);
      setFailedAttempts(0); // Reset des tentatives si l'utilisateur efface
      return;
    }

    if (code.length >= 5) {
      const codeData = validCodes[code as keyof typeof validCodes];
      
      if (codeData) {
        // Code valide
        if (codeData.requiresPremium && selectedPlan !== 'premium') {
          toast({
            title: "Code incompatible",
            description: "Ce code promo est uniquement valide pour le plan Premium Pro.",
            variant: "destructive",
          });
          return;
        }
        
        setDiscount(codeData.discount);
        setFailedAttempts(0); // Reset des tentatives
        toast({
          title: "Code promo appliqué !",
          description: codeData.description,
        });
      } else {
        // Code invalide - système de limitation
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);
        
        const blockDuration = getBlockDuration(newFailedAttempts);
        
        if (blockDuration > 0) {
          setIsBlocked(true);
          setBlockTimeRemaining(blockDuration);
          
          // Timer pour débloquer
          const timer = setInterval(() => {
            setBlockTimeRemaining(prev => {
              if (prev <= 1) {
                setIsBlocked(false);
                clearInterval(timer);
                return 0;
              }
              return prev - 1;
            });
          }, 60000); // Décrémenter chaque minute
          
          toast({
            title: "Trop de tentatives échouées",
            description: `Compte bloqué ${blockDuration} minute${blockDuration > 1 ? 's' : ''}. Tentative ${newFailedAttempts}/∞`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Code promo invalide",
            description: `Ce code n'existe pas (tentative ${newFailedAttempts}/3).`,
            variant: "destructive",
          });
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlan || !currentPlan) {
      toast({
        title: "Erreur",
        description: "Plan non sélectionné",
        variant: "destructive",
      });
      return;
    }

    // Validation des champs requis
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.salonName) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Vérifier si c'est gratuit avec FREE149
      if (promoCode === 'FREE149' && selectedPlan === 'premium' && finalPrice === 0) {
        // Créer directement l'abonnement gratuit sans passer par Stripe
        type FreeSubscribeRes = { ok: true; planId: string } | { ok: false; error: string };
        const freeRes = await apiRequest<FreeSubscribeRes>("/api/subscribe/free", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planType: 'premium-pro',
            customerEmail: formData.email,
            customerName: `${formData.firstName} ${formData.lastName}`,
            promoCode: promoCode,
            duration: 1
          })
        });
        if (!freeRes.ok) throw new Error(freeRes.error);
        toast({
          title: "Abonnement activé !",
          description: "🎉 Votre Premium Pro gratuit est maintenant actif !",
        });
        setLocation('/dashboard');
        return;
      }

      // Sinon, utiliser Stripe pour le paiement
      type CreateSessionRes = { sessionId: string; url: string };
      const response = await apiRequest<CreateSessionRes>('/api/stripe/create-subscription-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType: selectedPlan,
          customerEmail: formData.email,
          customerName: `${formData.firstName} ${formData.lastName}`,
          amount: finalPrice, // Prix avec réduction
          promoCode: promoCode,
          discount: discount
        })
      });

      if (response.url) {
        // Sauvegarder les données d'inscription avant redirection
        localStorage.setItem('pendingRegistration', JSON.stringify({
          ...formData,
          planType: selectedPlan,
          billingCycle,
          promoCode: promoCode,
          discount: discount,
          sessionId: response.sessionId
        }));
        
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

  if (!currentPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Plan non trouvé</h1>
          <Button onClick={() => setLocation('/professional-plans')}>
            Retour aux plans
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <img src={logoImage} alt="Logo" className="h-14 w-auto" />
              <p className="text-xs text-gray-500 -mt-1">Inscription</p>
            </div>
            
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/professional-plans")}
              className="text-gray-600 hover:text-violet-600 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulaire d'inscription */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Commencez votre essai gratuit
              </h2>
              <p className="text-gray-600">
                Essai gratuit 7 jours - sans engagement • Aucune carte bancaire requise
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    Prénom *
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="Votre prénom"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Nom *
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email professionnel *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Téléphone *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="06 12 34 56 78"
                />
              </div>

              <div>
                <Label htmlFor="salonName" className="text-sm font-medium text-gray-700">
                  Nom du salon *
                </Label>
                <Input
                  id="salonName"
                  name="salonName"
                  type="text"
                  required
                  value={formData.salonName}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="Le nom de votre salon"
                />
              </div>

              {/* Code promo */}
              <div>
                <Label htmlFor="promoCode" className="text-sm font-medium text-gray-700">
                  Code promotionnel
                </Label>
                <div className="mt-1 relative">
                  <Input
                    id="promoCode"
                    name="promoCode"
                    type="text"
                    value={promoCode}
                    onChange={handlePromoCodeChange}
                    disabled={isBlocked}
                    className={`pr-20 ${isBlocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder={isBlocked ? `Bloqué ${blockTimeRemaining}min` : "Entrez votre code (ex: FREE149)"}
                  />
                  {discount > 0 && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>
                {isBlocked && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-800">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Trop de tentatives. Réessayez dans {blockTimeRemaining} minute{blockTimeRemaining > 1 ? 's' : ''}.
                      </span>
                    </div>
                  </div>
                )}
                {promoCode === 'FREE149' && selectedPlan === 'premium' && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Premium Pro GRATUIT pour 1 mois ! 🎉</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Adresse
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="123 rue de la Beauté"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
                    Code postal
                  </Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="75001"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                  Ville
                </Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="Paris"
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-12 gradient-bg text-white font-semibold hover:opacity-90"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Préparation du paiement...
                    </div>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      {promoCode === 'FREE149' && finalPrice === 0 ? 
                        'Activer mon Premium Pro GRATUIT' : 
                        'Commencer l\'essai gratuit'
                      }
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                En vous inscrivant, vous acceptez nos{' '}
                <a href="#" className="text-violet-600 hover:underline">conditions d'utilisation</a>
                {' '}et notre{' '}
                <a href="#" className="text-violet-600 hover:underline">politique de confidentialité</a>
              </p>
            </form>
          </div>

          {/* Récapitulatif du plan */}
          <div className="space-y-6">
            {/* Plan sélectionné */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Plan {currentPlan.name}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {billingCycle === 'annual' ? 'Facturation annuelle' : 'Facturation mensuelle'}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-baseline gap-2 mb-4">
                  {discount > 0 && basePrice > 0 ? (
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl text-gray-400 line-through">{basePrice}€</span>
                        <span className="text-3xl font-bold text-green-600">{finalPrice}€</span>
                        <span className="text-gray-500">/mois</span>
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        Économie de {discount}€ avec {promoCode}
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-gray-900">{basePrice}€</span>
                      <span className="text-gray-500">/mois</span>
                    </>
                  )}
                  {billingCycle === 'annual' && (
                    <span className="text-sm text-green-600 font-medium">
                      (Économisez {(currentPlan.monthlyPrice - basePrice) * 12}€/an)
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {currentPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Garanties */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-violet-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Essai gratuit 7 jours - sans engagement</h3>
                    <p className="text-sm text-gray-600">Testez toutes les fonctionnalités sans engagement</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-violet-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Données sécurisées</h3>
                    <p className="text-sm text-gray-600">Conformité RGPD et chiffrement SSL</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-violet-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Support dédié</h3>
                    <p className="text-sm text-gray-600">Assistance par des experts beauté</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-6 text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Une question ?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Notre équipe est là pour vous accompagner
              </p>
              <Button variant="outline" className="w-full">
                Nous contacter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}