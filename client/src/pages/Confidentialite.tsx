import { motion } from "framer-motion";
import { ArrowLeft, Shield, Eye, Lock, Users } from "lucide-react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";

export default function Confidentialite() {
  const [, setLocation] = useLocation();

  const dataTypes = [
    {
      icon: Users,
      title: "Données d'identification",
      description: "Nom, prénom, email, téléphone",
      color: "from-blue-100 to-cyan-100"
    },
    {
      icon: Eye,
      title: "Données de navigation",
      description: "Pages visitées, préférences, historique",
      color: "from-green-100 to-emerald-100"
    },
    {
      icon: Lock,
      title: "Données de réservation",
      description: "Historique des RDV, paiements, évaluations",
      color: "from-purple-100 to-violet-100"
    }
  ];

  const principles = [
    {
      title: "Transparence",
      description: "Nous vous informons clairement sur la collecte et l'utilisation de vos données."
    },
    {
      title: "Finalité",
      description: "Vos données sont utilisées uniquement pour améliorer votre expérience sur Avyento."
    },
    {
      title: "Sécurité",
      description: "Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données."
    },
    {
      title: "Contrôle",
      description: "Vous avez le droit d'accéder, modifier ou supprimer vos données personnelles."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-gray-50/50 to-purple-50/30"
    >
      {/* Header */}
      <div className="bg-white/40 backdrop-blur-md border-b border-white/30 px-4 py-4">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLocation('/')}
            className="glass-button-secondary w-10 h-10 rounded-2xl flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Politique de Confidentialité</h1>
            <p className="text-sm text-gray-600">Protection de vos données personnelles</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Introduction */}
          <Card className="bg-white/30 backdrop-blur-md border-white/40">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Votre vie privée est notre priorité</h3>
                  <p className="text-sm text-gray-600">
                    Chez Avyento, nous nous engageons à protéger et respecter votre vie privée. 
                    Cette politique explique comment nous collectons, utilisons et protégeons vos données personnelles 
                    conformément au RGPD.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Types de données collectées */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Données que nous collectons</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {dataTypes.map((type, index) => {
                const Icon = type.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="bg-white/30 backdrop-blur-md border-white/40">
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center mb-4`}>
                          <Icon className="w-6 h-6 text-gray-700" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{type.title}</h4>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Nos principes */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Nos principes de protection des données</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {principles.map((principle, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-white/30 backdrop-blur-md border-white/40">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-gray-900 mb-2">{principle.title}</h4>
                      <p className="text-sm text-gray-600">{principle.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Vos droits */}
          <Card className="bg-white/30 backdrop-blur-md border-white/40">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Vos droits RGPD</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <span className="font-medium text-gray-900">Droit d'accès :</span> Vous pouvez demander une copie de vos données personnelles.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <span className="font-medium text-gray-900">Droit de rectification :</span> Vous pouvez corriger vos données inexactes.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <span className="font-medium text-gray-900">Droit à l'effacement :</span> Vous pouvez demander la suppression de vos données.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <span className="font-medium text-gray-900">Droit de portabilité :</span> Vous pouvez récupérer vos données dans un format structuré.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-white/30 backdrop-blur-md border-white/40">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Exercer vos droits</h3>
              <p className="text-sm text-gray-600 mb-4">
                Pour exercer vos droits ou pour toute question concernant la protection de vos données, 
                contactez notre délégué à la protection des données.
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-button text-black px-6 py-2 rounded-xl"
                  onClick={() => setLocation('/contact')}
                >
                  Nous contacter
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-button text-black px-6 py-2 rounded-xl"
                >
                  dpo@avyento.com
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}