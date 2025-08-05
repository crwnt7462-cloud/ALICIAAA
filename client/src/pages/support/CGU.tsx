import { motion } from "framer-motion";
import { ArrowLeft, FileText, Shield, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function CGU() {
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
              <h1 className="text-xl font-bold text-gray-900">Conditions Générales d'Utilisation</h1>
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
            <FileText className="w-5 h-5 text-violet-600" />
            <span className="text-sm font-medium text-black">CGU</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Conditions Générales d'Utilisation
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
          
          {/* Article 1 */}
          <Card className="bg-white/30 backdrop-blur-md border-white/40">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-violet-600" />
                1. Objet et Champ d'Application
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de la plateforme Rendly, 
                  service de réservation en ligne pour les professionnels de la beauté et leurs clients.
                </p>
                <p className="text-gray-700">
                  En accédant à notre plateforme, vous acceptez intégralement et sans réserve les présentes CGU.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Article 2 */}
          <Card className="bg-white/30 backdrop-blur-md border-white/40">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Inscription et Compte Utilisateur</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  L'inscription sur Rendly est gratuite pour les clients. Les professionnels peuvent choisir entre 
                  plusieurs formules d'abonnement (Basic Pro, Advanced Pro, Premium Pro).
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Vous devez fournir des informations exactes et à jour</li>
                  <li>Vous êtes responsable de la confidentialité de vos identifiants</li>
                  <li>Un seul compte par personne ou établissement est autorisé</li>
                  <li>Vous devez avoir au moins 16 ans pour créer un compte</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Article 3 */}
          <Card className="bg-white/30 backdrop-blur-md border-white/40">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Services Proposés</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Rendly propose une plateforme de mise en relation entre clients et professionnels de la beauté 
                  comprenant :
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Système de réservation en ligne</li>
                  <li>Gestion de planning pour les professionnels</li>
                  <li>Système de paiement sécurisé</li>
                  <li>Notifications et rappels automatiques</li>
                  <li>Système d'avis et de notation</li>
                  <li>Outils de gestion business (abonnements Pro)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Article 4 */}
          <Card className="bg-white/30 backdrop-blur-md border-white/40">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Réservations et Annulations</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Les conditions de réservation et d'annulation sont définies par chaque professionnel :
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Délai d'annulation généralement de 24h</li>
                  <li>Possibilité d'acompte selon les établissements</li>
                  <li>Retard toléré de 15-20 minutes maximum</li>
                  <li>Remboursement selon les conditions du salon</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Article 5 */}
          <Card className="bg-white/30 backdrop-blur-md border-white/40">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Responsabilités</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Rendly agit comme intermédiaire technique entre clients et professionnels :
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Les prestations sont réalisées sous la responsabilité exclusive des professionnels</li>
                  <li>Rendly ne peut être tenu responsable de la qualité des services</li>
                  <li>Les utilisateurs sont responsables de leurs données personnelles</li>
                  <li>Chaque utilisateur respecte les règles de civilité et de bienséance</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Article 6 */}
          <Card className="bg-white/30 backdrop-blur-md border-white/40">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Propriété Intellectuelle</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 mb-4">
                  Tous les éléments de la plateforme Rendly sont protégés par les droits de propriété intellectuelle :
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Marques, logos, design et contenus</li>
                  <li>Code source et architecture technique</li>
                  <li>Toute reproduction interdite sans autorisation</li>
                  <li>Les contenus utilisateurs restent leur propriété</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Note importante */}
          <Card className="bg-amber-50/50 backdrop-blur-md border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-2">Information importante</h3>
                  <p className="text-amber-700 text-sm">
                    Ces CGU peuvent être modifiées à tout moment. Les utilisateurs seront informés 
                    des changements importants par email ou notification sur la plateforme.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-white/30 backdrop-blur-md border-white/40">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Questions sur nos CGU ?</h3>
              <p className="text-gray-600 mb-6">
                Pour toute question concernant ces conditions, contactez notre équipe juridique
              </p>
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