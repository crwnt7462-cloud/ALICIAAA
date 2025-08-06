import { motion } from "framer-motion";
import { ArrowLeft, Search, HelpCircle, Book, MessageCircle, Phone } from "lucide-react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CentreAide() {
  const [, setLocation] = useLocation();

  const faqCategories = [
    {
      icon: Book,
      title: "Réservation",
      description: "Comment réserver, modifier ou annuler un rendez-vous",
      articles: 12,
      color: "from-blue-100 to-cyan-100"
    },
    {
      icon: MessageCircle,
      title: "Paiements",
      description: "Questions sur les paiements, remboursements et acomptes",
      articles: 8,
      color: "from-green-100 to-emerald-100"
    },
    {
      icon: HelpCircle,
      title: "Compte client",
      description: "Gérer votre profil, historique et préférences",
      articles: 15,
      color: "from-purple-100 to-violet-100"
    },
    {
      icon: Phone,
      title: "Support technique",
      description: "Problèmes techniques et assistance",
      articles: 6,
      color: "from-orange-100 to-amber-100"
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
            <h1 className="text-lg font-semibold text-gray-900">Centre d'aide</h1>
            <p className="text-sm text-gray-600">Trouvez rapidement les réponses à vos questions</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Barre de recherche */}
          <Card className="bg-white/30 backdrop-blur-md border-white/40">
            <CardContent className="p-4">
              <div className="relative">
                <Input
                  placeholder="Rechercher dans l'aide..."
                  className="pl-10 h-12 bg-white/50 border-white/50"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          {/* Catégories FAQ */}
          <div className="grid md:grid-cols-2 gap-4">
            {faqCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-white/30 backdrop-blur-md border-white/40 hover:bg-white/40 transition-all cursor-pointer">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-gray-700" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{category.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                      <div className="text-xs text-gray-500">
                        {category.articles} articles disponibles
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Contact rapide */}
          <Card className="bg-white/30 backdrop-blur-md border-white/40">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Besoin d'aide personnalisée ?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-button text-black p-4 rounded-xl text-left"
                  onClick={() => setLocation('/contact')}
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Chat en direct</div>
                      <div className="text-xs text-gray-600">Réponse immédiate 9h-18h</div>
                    </div>
                  </div>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-button text-black p-4 rounded-xl text-left"
                  onClick={() => setLocation('/contact')}
                >
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Support téléphonique</div>
                      <div className="text-xs text-gray-600">01 23 45 67 89</div>
                    </div>
                  </div>
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}