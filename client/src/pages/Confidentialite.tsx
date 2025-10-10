import { motion } from "framer-motion";
import { ArrowLeft, Shield, Eye, Lock, Users, Calendar, Building, Mail } from "lucide-react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

export default function Confidentialite() {
  const [, setLocation] = useLocation();
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [version, setVersion] = useState<string>('');

  // Variables d'environnement sécurisées (Vite)
  const DPO_EMAIL = import.meta.env.VITE_DPO_EMAIL || 'dpo@avyento.com';
  const COMPANY_NAME = import.meta.env.VITE_COMPANY_NAME || 'Avyento';
  const COMPANY_ADDRESS = import.meta.env.VITE_COMPANY_ADDRESS || '123 Rue de la Paix, 75001 Paris';
  const SIRET = import.meta.env.VITE_SIRET || '12345678901234';

  // Validation email sécurisée
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Chargement des informations légales
  useEffect(() => {
    // Simulation d'un appel API pour les informations légales
    const loadLegalInfo = async () => {
      try {
        // En production, remplacer par un vrai appel API
        const response = await fetch('/api/legal-info');
        if (response.ok) {
          const data = await response.json();
          setLastUpdated(data.lastUpdated);
          setVersion(data.version);
        } else {
          // Fallback avec données par défaut
          setLastUpdated(new Date().toLocaleDateString('fr-FR'));
          setVersion('2.1');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des informations légales:', error);
        // Fallback avec données par défaut
        setLastUpdated(new Date().toLocaleDateString('fr-FR'));
        setVersion('2.1');
      }
    };

    loadLegalInfo();
  }, []);

  // Données externalisées (en production, charger depuis une API)
  const dataTypes = [
    {
      icon: Users,
      title: "Données d'identification",
      description: "Nom, prénom, email, téléphone",
      color: "from-blue-100 to-cyan-100",
      retention: "3 ans"
    },
    {
      icon: Eye,
      title: "Données de navigation",
      description: "Pages visitées, préférences, historique",
      color: "from-green-100 to-emerald-100",
      retention: "13 mois"
    },
    {
      icon: Lock,
      title: "Données de réservation",
      description: "Historique des RDV, paiements, évaluations",
      color: "from-purple-100 to-violet-100",
      retention: "5 ans"
    }
  ];

  const principles = [
    {
      title: "Transparence",
      description: "Nous vous informons clairement sur la collecte et l'utilisation de vos données.",
      legalBasis: "Art. 6.1.a RGPD - Consentement"
    },
    {
      title: "Finalité",
      description: "Vos données sont utilisées uniquement pour améliorer votre expérience sur Avyento.",
      legalBasis: "Art. 6.1.b RGPD - Exécution du contrat"
    },
    {
      title: "Sécurité",
      description: "Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données.",
      legalBasis: "Art. 32 RGPD - Sécurité des traitements"
    },
    {
      title: "Contrôle",
      description: "Vous avez le droit d'accéder, modifier ou supprimer vos données personnelles.",
      legalBasis: "Art. 15-22 RGPD - Droits des personnes"
    }
  ];

  const gdprRights = [
    {
      title: "Droit d'accès",
      description: "Vous pouvez demander une copie de vos données personnelles.",
      article: "Art. 15 RGPD"
    },
    {
      title: "Droit de rectification",
      description: "Vous pouvez corriger vos données inexactes.",
      article: "Art. 16 RGPD"
    },
    {
      title: "Droit à l'effacement",
      description: "Vous pouvez demander la suppression de vos données.",
      article: "Art. 17 RGPD"
    },
    {
      title: "Droit de portabilité",
      description: "Vous pouvez récupérer vos données dans un format structuré.",
      article: "Art. 20 RGPD"
    },
    {
      title: "Droit d'opposition",
      description: "Vous pouvez vous opposer au traitement de vos données.",
      article: "Art. 21 RGPD"
    },
    {
      title: "Droit de limitation",
      description: "Vous pouvez demander la limitation du traitement.",
      article: "Art. 18 RGPD"
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
            {lastUpdated && version && (
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-500">
                  Version {version} - Dernière mise à jour : {lastUpdated}
                </span>
              </div>
            )}
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
                        <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-500">Conservation : {type.retention}</span>
                        </div>
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
                      <p className="text-sm text-gray-600 mb-2">{principle.description}</p>
                      <div className="flex items-center gap-2">
                        <Shield className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-500">{principle.legalBasis}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Vos droits RGPD */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Vos droits RGPD</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {gdprRights.map((right, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-white/30 backdrop-blur-md border-white/40">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">{right.title}</span>
                            <span className="text-xs text-gray-500">{right.article}</span>
                          </div>
                          <p className="text-sm text-gray-600">{right.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Informations légales */}
          <Card className="bg-white/30 backdrop-blur-md border-white/40">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Informations légales</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-medium text-gray-900">Entreprise :</span> {COMPANY_NAME}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-medium text-gray-900">DPO :</span> {validateEmail(DPO_EMAIL) ? DPO_EMAIL : 'dpo@avyento.com'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-medium text-gray-900">SIRET :</span> {SIRET}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-medium text-gray-900">Version :</span> {version || '2.1'}
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
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-button text-black px-6 py-2 rounded-xl"
                  onClick={() => setLocation('/contact')}
                >
                  Nous contacter
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}