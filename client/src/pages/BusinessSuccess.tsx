import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, Zap, Crown, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function BusinessSuccess() {
  const [, setLocation] = useLocation();
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      // Récupérer les détails de la session Stripe
      fetch(`/api/stripe/session/${sessionId}`)
        .then(response => response.json())
        .then(data => {
          setSessionData(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Erreur récupération session:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const planFeatures = {
    essentiel: {
      name: "ESSENTIEL",
      color: "from-green-500 to-emerald-600",
      features: [
        "Gestion des rendez-vous illimitée",
        "Base clients complète",
        "Planning automatisé",
        "Support client par email"
      ]
    },
    professionnel: {
      name: "PROFESSIONNEL",
      color: "from-blue-500 to-purple-600",
      features: [
        "Toutes les fonctionnalités Essentiel",
        "Rappels SMS automatiques",
        "Analytics avancés",
        "Intégrations calendrier",
        "Support prioritaire"
      ]
    },
    premium: {
      name: "PREMIUM",
      color: "from-purple-500 to-pink-600",
      features: [
        "Toutes les fonctionnalités Professionnel",
        "IA d'optimisation planning",
        "Messagerie directe clients",
        "Page de réservation personnalisée",
        "Formation personnalisée",
        "Support téléphonique 7j/7"
      ]
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-violet-50/30 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const planType = sessionData?.metadata?.planType || 'professionnel';
  const currentPlan = planFeatures[planType as keyof typeof planFeatures] || planFeatures.professionnel;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-violet-50/30">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Rendly</h1>
              <p className="text-xs text-gray-500 -mt-1">Plateforme Professionnelle</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Message de succès */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Félicitations ! 🎉
          </h1>
          
          <p className="text-xl text-gray-600 mb-2">
            Votre inscription a été validée avec succès
          </p>
          
          <Badge className={`bg-gradient-to-r ${currentPlan.color} text-white px-6 py-2 text-lg`}>
            Plan {currentPlan.name} Activé
          </Badge>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Prochaines étapes */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-600" />
                Prochaines étapes
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-violet-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Configurez votre salon</h3>
                    <p className="text-gray-600 text-sm">Complétez les informations de votre établissement et ajoutez vos services</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-violet-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Ajoutez votre équipe</h3>
                    <p className="text-gray-600 text-sm">Invitez vos collaborateurs et définissez leurs spécialités</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-violet-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Commencez à réserver</h3>
                    <p className="text-gray-600 text-sm">Partagez votre lien de réservation et accueillez vos premiers clients</p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setLocation("/business-features")}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
              >
                <Zap className="w-5 h-5 mr-2" />
                Commencer la configuration
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Fonctionnalités du plan */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                Vos fonctionnalités
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {currentPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}

              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 text-amber-700 font-medium text-sm">
                  <Sparkles className="w-4 h-4" />
                  Période d'essai gratuite
                </div>
                <p className="text-amber-600 text-sm mt-1">
                  Profitez de 14 jours gratuits pour découvrir toutes vos fonctionnalités
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support */}
        <div className="mt-8 text-center">
          <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200">
            <CardContent className="py-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Besoin d'aide pour commencer ?
              </h3>
              <p className="text-gray-600 mb-4">
                Notre équipe d'experts est là pour vous accompagner dans la prise en main
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" className="border-violet-300 text-violet-700 hover:bg-violet-50">
                  Centre d'aide
                </Button>
                <Button variant="outline" className="border-violet-300 text-violet-700 hover:bg-violet-50">
                  Planifier une formation
                </Button>
                <Button variant="outline" className="border-violet-300 text-violet-700 hover:bg-violet-50">
                  Contacter le support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}