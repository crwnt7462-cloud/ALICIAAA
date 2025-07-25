import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";

export default function StripeCancel() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50/30 p-4">
      <div className="max-w-2xl mx-auto pt-16">
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-t-lg">
            <div className="flex justify-center mb-4">
              <XCircle className="w-16 h-16" />
            </div>
            <CardTitle className="text-2xl">Paiement Annulé</CardTitle>
            <p className="text-red-100 mt-2">
              Votre paiement a été annulé. Aucun montant n'a été débité.
            </p>
          </CardHeader>
          
          <CardContent className="p-8 space-y-6">
            {/* Raisons possibles */}
            <div className="bg-amber-50 rounded-lg p-6">
              <h3 className="font-semibold text-amber-900 mb-4">Que s'est-il passé ?</h3>
              <div className="text-amber-800 text-sm space-y-2">
                <p>• Vous avez cliqué sur "Retour" pendant le processus de paiement</p>
                <p>• La session de paiement a expiré</p>
                <p>• Vous avez fermé la fenêtre Stripe avant de terminer</p>
                <p>• Un problème technique temporaire s'est produit</p>
              </div>
            </div>

            {/* Que faire maintenant */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-4">Que faire maintenant ?</h3>
              <div className="text-blue-800 text-sm space-y-2">
                <p>• Vous pouvez essayer de nouveau le paiement</p>
                <p>• Vérifiez vos informations de carte bancaire</p>
                <p>• Contactez notre support si le problème persiste</p>
                <p>• Aucun frais n'a été appliqué sur votre compte</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => window.history.back()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Essayer à nouveau
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setLocation("/")}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Button>
            </div>

            {/* Support */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Besoin d'aide ?</h3>
              <div className="text-gray-700 text-sm space-y-2">
                <p>Notre équipe support est là pour vous aider :</p>
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <Button variant="outline" size="sm" onClick={() => setLocation("/contact")}>
                    Nous contacter
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setLocation("/support")}>
                    Centre d'aide
                  </Button>
                </div>
              </div>
            </div>

            {/* Informations de sécurité */}
            <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
              <p>🔒 Vos informations de paiement sont sécurisées par Stripe</p>
              <p className="mt-1">Aucune donnée bancaire n'est stockée sur nos serveurs</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}