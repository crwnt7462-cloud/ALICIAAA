import { motion } from "framer-motion";
import { ArrowLeft, FileText, Calendar } from "lucide-react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";

export default function CGU() {
  const [, setLocation] = useLocation();

  const sections = [
    {
      title: "1. Objet",
      content: "Les présentes Conditions Générales d'Utilisation (CGU) définissent les modalités d'utilisation de la plateforme Avyento, service de réservation en ligne pour les professionnels de la beauté."
    },
    {
      title: "2. Acceptation des conditions",
      content: "L'utilisation d'Avyento implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser nos services."
    },
    {
      title: "3. Services proposés",
      content: "Avyento permet aux utilisateurs de rechercher, comparer et réserver des rendez-vous auprès de professionnels de la beauté (coiffeurs, esthéticiennes, manucures, masseurs, etc.)."
    },
    {
      title: "4. Inscription et compte utilisateur",
      content: "L'utilisation de certaines fonctionnalités nécessite la création d'un compte. Vous vous engagez à fournir des informations exactes et à maintenir vos données à jour."
    },
    {
      title: "5. Réservations et paiements",
      content: "Les réservations effectuées via la plateforme sont confirmées sous réserve de disponibilité. Les paiements sont sécurisés et traités par nos partenaires certifiés."
    },
    {
      title: "6. Annulation et remboursement",
      content: "Les conditions d'annulation dépendent de la politique de chaque professionnel. Les remboursements sont effectués selon les conditions spécifiques à chaque réservation."
    },
    {
      title: "7. Protection des données",
      content: "Vos données personnelles sont protégées conformément à notre Politique de Confidentialité et au Règlement Général sur la Protection des Données (RGPD)."
    },
    {
      title: "8. Responsabilités",
      content: "Avyento agit en qualité d'intermédiaire entre les utilisateurs et les professionnels. Nous ne sommes pas responsables de la qualité des prestations fournies par les professionnels."
    },
    {
      title: "9. Propriété intellectuelle",
      content: "Tous les éléments de la plateforme (textes, images, logos, etc.) sont protégés par le droit d'auteur et ne peuvent être reproduits sans autorisation."
    },
    {
      title: "10. Modification des CGU",
      content: "Avyento se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés des modifications importantes."
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
            <h1 className="text-lg font-semibold text-gray-900">Conditions Générales d'Utilisation</h1>
            <p className="text-sm text-gray-600">Dernière mise à jour : 3 août 2025</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Info générale */}
          <Card className="bg-white/30 backdrop-blur-md border-white/40">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Informations importantes</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Ces conditions générales d'utilisation régissent votre accès et votre utilisation de la plateforme Avyento.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Dernière mise à jour : 3 août 2025</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sections des CGU */}
          <div className="space-y-4">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white/30 backdrop-blur-md border-white/40">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">{section.title}</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{section.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact */}
          <Card className="bg-white/30 backdrop-blur-md border-white/40">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Questions sur les CGU ?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Si vous avez des questions concernant ces conditions d'utilisation, n'hésitez pas à nous contacter.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-button text-black px-6 py-2 rounded-xl"
                onClick={() => setLocation('/contact')}
              >
                Nous contacter
              </motion.button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}