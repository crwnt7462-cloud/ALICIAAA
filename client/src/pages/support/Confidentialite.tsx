import { motion } from "framer-motion";
import { ArrowLeft, Shield, Lock, Eye, Database, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Confidentialite() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen" 
         style={{
           background: '#f8f9fa',
           backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(168, 85, 247, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.06) 0%, transparent 50%)',
         }}>
      
      {/* Header */}
      <header className="bg-white/40 backdrop-blur-md border-white/30 border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => setLocation("/")}
                className="glass-button p-2 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-black" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Politique de Confidentialité</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-md border-white/40 border rounded-full px-4 py-2 mb-6">
            <Shield className="w-5 h-5 text-violet-600" />
            <span className="text-sm font-medium text-black">Confidentialité</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Dernière mise à jour : 5 Août 2025
          </p>
        </motion.div>

        {/* Contenu */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          
          {/* Engagement */}
          <Card className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-md border-violet-200">
            <CardContent className="p-8 text-center">
              <Lock className="w-12 h-12 text-violet-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Notre Engagement</h2>
              <p className="text-gray-700">
                Chez Rendly, la protection de vos données personnelles est notre priorité absolue. 
                Nous nous engageons à respecter le RGPD et à assurer la sécurité de vos informations.
              </p>
            </CardContent>
          </Card>

          {/* Données collectées */}
          <Card className="bg-white/30 backdrop-blur-md border-white/40">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Database className="w-6 h-6 text-violet-600" />
                1. Données Collectées
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Nous collectons uniquement les données nécessaires au fonctionnement de notre service :
                </p>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Données d'identification</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
                  <li>Nom, prénom, email</li>
                  <li>Numéro de téléphone</li>
                  <li>Adresse (pour les professionnels)</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-3">Données d'utilisation</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
                  <li>Historique des réservations</li>
                  <li>Préférences et avis</li>
                  <li>Données de navigation (cookies)</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-3">Données de paiement</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Informations bancaires (cryptées et sécurisées via Stripe)</li>
                  <li>Historique des transactions</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Utilisation des données */}
          <Card className="bg-white/30 backdrop-blur-md border-white/40">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Eye className="w-6 h-6 text-violet-600" />
                2. Utilisation des Données
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Vos données sont utilisées exclusivement pour :
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Faciliter la mise en relation avec les professionnels</li>
                  <li>Gérer vos réservations et paiements</li>
                  <li>Envoyer des notifications et rappels</li>
                  <li>Améliorer nos services</li>
                  <li>Assurer la sécurité de la plateforme</li>
                  <li>Respecter nos obligations légales</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Partage des données */}
          <Card className="bg-white/30 backdrop-blur-md border-white/40">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Partage des Données</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Nous ne vendons jamais vos données personnelles. Le partage est limité à :
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Professionnels partenaires :</strong> Informations nécessaires à votre réservation</li>
                  <li><strong>Prestataires techniques :</strong> Hébergement, paiement (Stripe), notifications</li>
                  <li><strong>Autorités légales :</strong> Si requis par la loi</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Tous nos partenaires sont soumis à des obligations strictes de confidentialité.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Vos droits */}
          <Card className="bg-white/30 backdrop-blur-md border-white/40">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Vos Droits (RGPD)</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Conformément au RGPD, vous disposez des droits suivants :
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-violet-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-violet-800 mb-2">Droit d'accès</h4>
                    <p className="text-violet-700 text-sm">Consulter vos données personnelles</p>
                  </div>
                  <div className="bg-violet-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-violet-800 mb-2">Droit de rectification</h4>
                    <p className="text-violet-700 text-sm">Corriger vos informations</p>
                  </div>
                  <div className="bg-violet-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-violet-800 mb-2">Droit à l'effacement</h4>
                    <p className="text-violet-700 text-sm">Supprimer vos données</p>
                  </div>
                  <div className="bg-violet-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-violet-800 mb-2">Droit à la portabilité</h4>
                    <p className="text-violet-700 text-sm">Récupérer vos données</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sécurité */}
          <Card className="bg-white/30 backdrop-blur-md border-white/40">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Sécurité des Données</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Nous mettons en œuvre des mesures de sécurité avancées :
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Cryptage SSL/TLS pour toutes les communications</li>
                  <li>Hébergement sécurisé en Europe (RGPD compliant)</li>
                  <li>Accès restreint aux données personnelles</li>
                  <li>Sauvegardes régulières et sécurisées</li>
                  <li>Surveillance continue des accès</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card className="bg-white/30 backdrop-blur-md border-white/40">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies et Traceurs</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Nous utilisons des cookies pour améliorer votre expérience :
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Cookies essentiels :</strong> Fonctionnement de la plateforme</li>
                  <li><strong>Cookies de préférence :</strong> Mémorisation de vos choix</li>
                  <li><strong>Cookies analytiques :</strong> Amélioration des services</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Vous pouvez gérer vos préférences cookies à tout moment dans votre navigateur.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Alerte importante */}
          <Card className="bg-red-50/50 backdrop-blur-md border-red-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-2">Signalement d'incident</h3>
                  <p className="text-red-700 text-sm">
                    En cas de violation de données personnelles, nous nous engageons à vous informer 
                    dans les 72 heures et à prendre toutes les mesures nécessaires.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact DPO */}
          <Card className="bg-white/30 backdrop-blur-md border-white/40">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact - Délégué à la Protection des Données</h3>
              <p className="text-gray-600 mb-4">
                Pour exercer vos droits ou pour toute question relative à la protection de vos données
              </p>
              <div className="space-y-2 text-gray-700 mb-6">
                <p><strong>Email :</strong> dpo@rendly.fr</p>
                <p><strong>Courrier :</strong> DPO Rendly, 123 Rue de la Beauté, 75001 Paris</p>
              </div>
              <Button 
                className="glass-button text-black px-6 py-3 rounded-xl"
                onClick={() => setLocation("/support/contact")}
              >
                Nous contacter
              </Button>
            </CardContent>
          </Card>

        </motion.div>
      </div>
    </div>
  );
}