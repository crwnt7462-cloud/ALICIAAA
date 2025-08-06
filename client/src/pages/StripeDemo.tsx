import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Repeat, ArrowLeft, ExternalLink } from "lucide-react";

interface StripeCheckoutRequest {
  planType?: string;
  customerEmail: string;
  customerName?: string;
  amount?: number;
  description?: string;
  appointmentId?: string;
  salonName?: string;
}

export default function StripeDemo() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState<'subscription' | 'payment'>('subscription');
  
  // Données du formulaire
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [planType, setPlanType] = useState('');
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [salonName, setSalonName] = useState('');

  const handleSubscriptionPayment = async () => {
    setLoading(true);
    try {
      const requestData: StripeCheckoutRequest = {
        planType,
        customerEmail,
        customerName,
      };

      const response = await fetch('/api/stripe/create-subscription-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la session');
      }

      if (data.url) {
        // Redirection vers Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('URL de paiement manquante');
      }

    } catch (error: any) {
      console.error('Erreur paiement abonnement:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer la session de paiement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentCheckout = async () => {
    setLoading(true);
    try {
      const requestData: StripeCheckoutRequest = {
        amount,
        description,
        customerEmail,
        customerName,
        salonName,
        appointmentId: '12345', // ID fictif pour la démo
      };

      const response = await fetch('/api/stripe/create-payment-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la session');
      }

      if (data.url) {
        // Redirection vers Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('URL de paiement manquante');
      }

    } catch (error: any) {
      console.error('Erreur paiement unique:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer la session de paiement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Démo Intégration Stripe</h1>
          <p className="text-gray-600 mt-2">Test des paiements d'abonnements et acomptes avec Stripe Checkout</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Paiement Abonnement */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <Repeat className="w-5 h-5" />
                Abonnement Professionnel
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="email">Email client</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="client@example.com"
                />
              </div>

              <div>
                <Label htmlFor="name">Nom client</Label>
                <Input
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nom du client"
                />
              </div>

              <div>
                <Label>Plan d'abonnement</Label>
                <Select value={planType} onValueChange={setPlanType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="essentiel">Essentiel - 29€/mois</SelectItem>
                    <SelectItem value="professionnel">Professionnel - 79€/mois</SelectItem>
                    <SelectItem value="premium">Premium - 149€/mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleSubscriptionPayment}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Création...
                  </div>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Payer l'abonnement
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Paiement Unique */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Paiement d'Acompte
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="amount">Montant (€)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="50"
                  min="1"
                  max="1000"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Acompte réservation"
                />
              </div>

              <div>
                <Label htmlFor="salon">Salon</Label>
                <Input
                  id="salon"
                  value={salonName}
                  onChange={(e) => setSalonName(e.target.value)}
                  placeholder="Nom du salon"
                />
              </div>

              <Button 
                onClick={handlePaymentCheckout}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Création...
                  </div>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Payer l'acompte
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Instructions de Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Test Abonnement</h4>
              <p className="text-blue-800 text-sm">
                Utilise le mode subscription de Stripe pour créer des paiements récurrents mensuels.
                Les plans sont créés automatiquement lors du premier paiement.
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Test Paiement Unique</h4>
              <p className="text-green-800 text-sm">
                Utilise le mode payment de Stripe pour les acomptes ou paiements complets.
                Idéal pour les réservations de rendez-vous.
              </p>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg">
              <h4 className="font-semibold text-amber-900 mb-2">Cartes de Test Stripe</h4>
              <p className="text-amber-800 text-sm">
                • Succès: 4242 4242 4242 4242<br/>
                • Échec: 4000 0000 0000 0002<br/>
                • Date: n'importe quelle date future, CVC: n'importe quel nombre à 3 chiffres
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}