import { useState, useEffect } from "react";
import { Check, ArrowLeft, CreditCard, Shield, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";

export default function Subscribe() {
  const [location, setLocation] = useLocation();
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

  // Extraire les paramètres de l'URL
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    setSelectedPlan(params.get('plan') || '');
    setBillingCycle(params.get('billing') || 'monthly');
  }, [location]);

  const planDetails = {
    essentiel: {
      name: 'Essentiel',
      emoji: '🌱',
      monthlyPrice: 29,
      yearlyPrice: 24,
      features: ['Gestion planning', 'Gestion clientèle', 'Réservations', 'Support email']
    },
    professionnel: {
      name: 'Professionnel',
      emoji: '🚀',
      monthlyPrice: 79,
      yearlyPrice: 65,
      features: ['Tout l\'Essentiel', 'Analytics avancés', 'IA Smart planning', 'Multi-établissements']
    },
    premium: {
      name: 'Premium',
      emoji: '⭐',
      monthlyPrice: 149,
      yearlyPrice: 125,
      features: ['Tout le Professionnel', 'IA complète', 'Marketing intelligent', 'Support prioritaire']
    }
  };

  const currentPlan = planDetails[selectedPlan as keyof typeof planDetails];
  const price = currentPlan ? (billingCycle === 'annual' ? currentPlan.yearlyPrice : currentPlan.monthlyPrice) : 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, vous pourriez intégrer avec Stripe ou un autre processeur de paiement
    console.log('Données d\'inscription:', { ...formData, plan: selectedPlan, billing: billingCycle });
    
    // Simulation d'un processus d'inscription réussi
    alert(`Félicitations ! Votre essai gratuit de 14 jours pour le plan ${currentPlan?.name} commence maintenant.`);
    setLocation('/dashboard');
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">BeautyBook Pro</h1>
                <p className="text-xs text-gray-500 -mt-1">Inscription</p>
              </div>
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
                14 jours gratuits • Aucune carte bancaire requise
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
                  className="w-full h-12 gradient-bg text-white font-semibold hover:opacity-90"
                >
                  Commencer mon essai gratuit de 14 jours
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
                  <span className="text-2xl">{currentPlan.emoji}</span>
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
                  <span className="text-3xl font-bold text-gray-900">{price}€</span>
                  <span className="text-gray-500">/mois</span>
                  {billingCycle === 'annual' && (
                    <span className="text-sm text-green-600 font-medium">
                      (Économisez {(currentPlan.monthlyPrice - price) * 12}€/an)
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
                    <h3 className="font-semibold text-gray-900">14 jours d'essai gratuit</h3>
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