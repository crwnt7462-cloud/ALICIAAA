import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
// Pas d'importation d'icônes selon les préférences utilisateur

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
  const { toast } = useToast();

  // Récupérer le plan d'abonnement depuis l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const subscriptionPlan = urlParams.get('plan') || 'pro';

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
        toast({
          title: "Salon enregistré",
          description: "Redirection vers le paiement..."
        });
        
        // Rediriger vers Stripe checkout
        const checkoutResponse = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            salonId: data.salon.id,
            plan: subscriptionPlan
          }),
        });

        if (checkoutResponse.ok) {
          const checkoutData = await checkoutResponse.json();
          // Simuler la redirection Stripe
          setTimeout(() => {
            setLocation(`/edit-salon?salonId=${data.salon.id}&success=true`);
          }, 2000);
        }
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
    </div>
  );
}