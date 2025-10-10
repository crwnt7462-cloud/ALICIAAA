import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Calendar, Loader2, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

// Types TypeScript pour la sécurité
interface CGUSection {
  id: string;
  title: string;
  content: string;
  order: number;
  lastModified: string;
}

interface CGUData {
  version: string;
  lastUpdated: string;
  effectiveDate: string;
  sections: CGUSection[];
  contact: {
    email: string;
    phone: string;
    address: string;
  };
}

// Hook personnalisé pour les données CGU
function useCGUData() {
  return useQuery<CGUData>({
    queryKey: ['cgu-data'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/legal/cgu');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des CGU');
        }
        return response.json();
      } catch (error) {
        // Fallback avec données par défaut en cas d'erreur
        console.warn('Utilisation des données de fallback pour les CGU');
        return {
          version: "1.0.0",
          lastUpdated: "2025-01-08",
          effectiveDate: "2025-01-08",
          sections: [
            {
              id: "objet",
              title: "1. Objet",
              content: "Les présentes Conditions Générales d'Utilisation (CGU) définissent les modalités d'utilisation de la plateforme Avyento, service de réservation en ligne pour les professionnels de la beauté.",
              order: 1,
              lastModified: "2025-01-08"
            },
            {
              id: "acceptation",
              title: "2. Acceptation des conditions",
              content: "L'utilisation d'Avyento implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser nos services.",
              order: 2,
              lastModified: "2025-01-08"
            },
            {
              id: "services",
              title: "3. Services proposés",
              content: "Avyento permet aux utilisateurs de rechercher, comparer et réserver des rendez-vous auprès de professionnels de la beauté (coiffeurs, esthéticiennes, manucures, masseurs, etc.).",
              order: 3,
              lastModified: "2025-01-08"
            },
            {
              id: "inscription",
              title: "4. Inscription et compte utilisateur",
              content: "L'utilisation de certaines fonctionnalités nécessite la création d'un compte. Vous vous engagez à fournir des informations exactes et à maintenir vos données à jour.",
              order: 4,
              lastModified: "2025-01-08"
            },
            {
              id: "reservations",
              title: "5. Réservations et paiements",
              content: "Les réservations effectuées via la plateforme sont confirmées sous réserve de disponibilité. Les paiements sont sécurisés et traités par nos partenaires certifiés.",
              order: 5,
              lastModified: "2025-01-08"
            },
            {
              id: "annulation",
              title: "6. Annulation et remboursement",
              content: "Les conditions d'annulation dépendent de la politique de chaque professionnel. Les remboursements sont effectués selon les conditions spécifiques à chaque réservation.",
              order: 6,
              lastModified: "2025-01-08"
            },
            {
              id: "protection",
              title: "7. Protection des données",
              content: "Vos données personnelles sont protégées conformément à notre Politique de Confidentialité et au Règlement Général sur la Protection des Données (RGPD).",
              order: 7,
              lastModified: "2025-01-08"
            },
            {
              id: "responsabilites",
              title: "8. Responsabilités",
              content: "Avyento agit en qualité d'intermédiaire entre les utilisateurs et les professionnels. Nous ne sommes pas responsables de la qualité des prestations fournies par les professionnels.",
              order: 8,
              lastModified: "2025-01-08"
            },
            {
              id: "propriete",
              title: "9. Propriété intellectuelle",
              content: "Tous les éléments de la plateforme (textes, images, logos, etc.) sont protégés par le droit d'auteur et ne peuvent être reproduits sans autorisation.",
              order: 9,
              lastModified: "2025-01-08"
            },
            {
              id: "modification",
              title: "10. Modification des CGU",
              content: "Avyento se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés des modifications importantes.",
              order: 10,
              lastModified: "2025-01-08"
            }
          ],
          contact: {
            email: "legal@avyento.com",
            phone: "01 23 45 67 89",
            address: "123 Rue de la Paix, 75001 Paris, France"
          }
        };
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    retryOnMount: false,
    refetchOnWindowFocus: false
  });
}

export default function CGU() {
  const [, setLocation] = useLocation();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // Récupération des données CGU
  const { data: cguData, isLoading: cguLoading, error: cguError } = useCGUData();

  // Tri des sections par ordre
  const sortedSections = useMemo(() => {
    if (!cguData?.sections) return [];
    return cguData.sections.sort((a, b) => a.order - b.order);
  }, [cguData?.sections]);

  // Gestion de la sélection de section
  const handleSectionSelect = useCallback((sectionId: string) => {
    setSelectedSection(selectedSection === sectionId ? null : sectionId);
  }, [selectedSection]);


  // Gestion de la navigation vers le contact
  const handleContactNavigation = useCallback(() => {
    setLocation('/contact?subject=CGU');
  }, [setLocation]);

  // Gestion des erreurs de chargement
  if (cguError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-50/50 to-purple-50/30 flex items-center justify-center"
      >
        <Card className="bg-white/30 backdrop-blur-md border-white/40 p-8 max-w-md mx-auto">
          <CardContent className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-sm text-gray-600 mb-4">
              Impossible de charger les CGU. Veuillez réessayer.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="glass-button text-black px-4 py-2 rounded-xl"
            >
              Réessayer
            </motion.button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

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
            aria-label="Retour à l'accueil"
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Conditions Générales d'Utilisation</h1>
            <p className="text-sm text-gray-600">
              {cguData ? `Version ${cguData.version} - Dernière mise à jour : ${new Date(cguData.lastUpdated).toLocaleDateString('fr-FR')}` : 'Chargement...'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Loading state */}
          {cguLoading && (
            <Card className="bg-white/30 backdrop-blur-md border-white/40">
              <CardContent className="p-8 text-center">
                <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
                <p className="text-sm text-gray-600">Chargement des CGU...</p>
              </CardContent>
            </Card>
          )}

          {/* Info générale */}
          {cguData && (
            <Card className="bg-white/30 backdrop-blur-md border-white/40">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Informations importantes</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Ces conditions générales d'utilisation régissent votre accès et votre utilisation de la plateforme Avyento.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Dernière mise à jour : {new Date(cguData.lastUpdated).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Version : {cguData.version}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sections des CGU */}
          {cguData && sortedSections.length > 0 && (
            <div className="space-y-4">
              {sortedSections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card 
                    className={`bg-white/30 backdrop-blur-md border-white/40 transition-all cursor-pointer ${
                      selectedSection === section.id ? 'ring-2 ring-blue-500/50' : ''
                    }`}
                    onClick={() => handleSectionSelect(section.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleSectionSelect(section.id);
                      }
                    }}
                    aria-label={`${section.title} - Cliquer pour ${selectedSection === section.id ? 'fermer' : 'ouvrir'}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-3">{section.title}</h3>
                          <p className="text-sm text-gray-700 leading-relaxed">{section.content}</p>
                          {selectedSection === section.id && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-xs text-gray-500">
                                Dernière modification : {new Date(section.lastModified).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <motion.div
                            animate={{ rotate: selectedSection === section.id ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-6 h-6 flex items-center justify-center"
                          >
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </motion.div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Contact */}
          {cguData?.contact && (
            <Card className="bg-white/30 backdrop-blur-md border-white/40">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Questions sur les CGU ?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Si vous avez des questions concernant ces conditions d'utilisation, n'hésitez pas à nous contacter.
                </p>
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-button text-black px-6 py-2 rounded-xl"
                    onClick={handleContactNavigation}
                    aria-label="Nous contacter pour des questions sur les CGU"
                  >
                    Nous contacter
                  </motion.button>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Email : {cguData.contact.email}</span>
                    <span>Tél : {cguData.contact.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}