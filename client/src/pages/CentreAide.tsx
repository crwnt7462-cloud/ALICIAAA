import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, HelpCircle, Book, MessageCircle, Phone, Loader2, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";

// Types TypeScript pour la sécurité
interface FAQCategory {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  articles: number;
  color: string;
  slug: string;
}

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  slug: string;
  views: number;
  helpful: number;
}

interface ContactInfo {
  phone: string;
  email: string;
  chatHours: string;
  responseTime: string;
}

// Hook personnalisé pour les données d'aide
function useHelpData() {
  return useQuery<{
    categories: FAQCategory[];
    articles: HelpArticle[];
    contact: ContactInfo;
  }>({
    queryKey: ['help-data'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/help/data');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des données d\'aide');
        }
        return response.json();
      } catch (error) {
        // Fallback avec données par défaut en cas d'erreur
        console.warn('Utilisation des données de fallback pour l\'aide');
        return {
          categories: [
            {
              id: 'reservation',
              icon: Book,
              title: "Réservation",
              description: "Comment réserver, modifier ou annuler un rendez-vous",
              articles: 12,
              color: "from-blue-100 to-cyan-100",
              slug: "reservation"
            },
            {
              id: 'payments',
              icon: MessageCircle,
              title: "Paiements",
              description: "Questions sur les paiements, remboursements et acomptes",
              articles: 8,
              color: "from-green-100 to-emerald-100",
              slug: "payments"
            },
            {
              id: 'account',
              icon: HelpCircle,
              title: "Compte client",
              description: "Gérer votre profil, historique et préférences",
              articles: 15,
              color: "from-purple-100 to-violet-100",
              slug: "account"
            },
            {
              id: 'technical',
              icon: Phone,
              title: "Support technique",
              description: "Problèmes techniques et assistance",
              articles: 6,
              color: "from-orange-100 to-amber-100",
              slug: "technical"
            }
          ],
          articles: [],
          contact: {
            phone: "01 23 45 67 89",
            email: "support@avyento.com",
            chatHours: "9h-18h",
            responseTime: "Réponse immédiate"
          }
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    retryOnMount: false,
    refetchOnWindowFocus: false
  });
}

// Hook pour la recherche d'articles
function useHelpSearch(query: string) {
  return useQuery<HelpArticle[]>({
    queryKey: ['help-search', query],
    queryFn: async () => {
      if (!query.trim()) return [];
      
      try {
        const response = await fetch(`/api/help/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la recherche');
        }
        return response.json();
      } catch (error) {
        console.warn('Recherche d\'aide non disponible, utilisation du fallback');
        return [];
      }
    },
    enabled: query.trim().length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1
  });
}

export default function CentreAide() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Récupération des données d'aide
  const { data: helpData, isLoading: helpLoading, error: helpError } = useHelpData();
  
  // Recherche d'articles
  const { data: searchResults, isLoading: searchLoading } = useHelpSearch(searchQuery);

  // Filtrage des catégories basé sur la recherche
  const filteredCategories = useMemo(() => {
    if (!helpData?.categories) return [];
    
    if (searchQuery.trim()) {
      return helpData.categories.filter(category => 
        category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return helpData.categories;
  }, [helpData?.categories, searchQuery]);

  // Gestion de la recherche
  const handleSearch = useCallback((value: string) => {
    // Validation et sanitization de l'entrée
    const sanitizedValue = value.trim().slice(0, 100); // Limite à 100 caractères
    setSearchQuery(sanitizedValue);
  }, []);

  // Gestion de la sélection de catégorie
  const handleCategorySelect = useCallback((categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setLocation(`/help/category/${categorySlug}`);
  }, [setLocation]);

  // Gestion de la navigation vers le contact
  const handleContactNavigation = useCallback((type: 'chat' | 'phone') => {
    if (type === 'chat') {
      setLocation('/contact?type=chat');
    } else {
      setLocation('/contact?type=phone');
    }
  }, [setLocation]);

  // Gestion des erreurs de chargement
  if (helpError) {
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
              Impossible de charger les données d'aide. Veuillez réessayer.
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
            <h1 className="text-lg font-semibold text-gray-900">Centre d'aide</h1>
            <p className="text-sm text-gray-600">Trouvez rapidement les réponses à vos questions</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Barre de recherche améliorée */}
          <Card className="bg-white/30 backdrop-blur-md border-white/40">
            <CardContent className="p-4">
              <div className="relative">
                <Input
                  placeholder="Rechercher dans l'aide..."
                  className="pl-10 pr-10 h-12 bg-white/50 border-white/50"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  maxLength={100}
                  aria-label="Rechercher dans l'aide"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                {searchLoading && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
                )}
              </div>
              {searchQuery && (
                <div className="mt-2 text-sm text-gray-600">
                  {searchResults?.length || 0} résultat(s) trouvé(s) pour "{searchQuery}"
                </div>
              )}
            </CardContent>
          </Card>

          {/* Loading state */}
          {helpLoading && (
            <Card className="bg-white/30 backdrop-blur-md border-white/40">
              <CardContent className="p-8 text-center">
                <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
                <p className="text-sm text-gray-600">Chargement des données d'aide...</p>
              </CardContent>
            </Card>
          )}

          {/* Résultats de recherche */}
          {searchQuery && searchResults && searchResults.length > 0 && (
            <Card className="bg-white/30 backdrop-blur-md border-white/40">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Résultats de recherche</h3>
                <div className="space-y-3">
                  {searchResults.map((article) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-white/20 rounded-xl hover:bg-white/30 transition-all cursor-pointer"
                      onClick={() => setLocation(`/help/article/${article.slug}`)}
                    >
                      <h4 className="font-medium text-gray-900 mb-1">{article.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{article.content}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{article.views} vues</span>
                        <span>{article.helpful} utiles</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Catégories FAQ dynamiques */}
          {!helpLoading && filteredCategories.length > 0 && (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card 
                      className="bg-white/30 backdrop-blur-md border-white/40 hover:bg-white/40 transition-all cursor-pointer"
                      onClick={() => handleCategorySelect(category.slug)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleCategorySelect(category.slug);
                        }
                      }}
                      aria-label={`Voir les articles de la catégorie ${category.title}`}
                    >
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
          )}

          {/* Message si aucune catégorie trouvée */}
          {searchQuery && filteredCategories.length === 0 && !searchLoading && (
            <Card className="bg-white/30 backdrop-blur-md border-white/40">
              <CardContent className="p-8 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun résultat</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Aucune catégorie ne correspond à votre recherche "{searchQuery}"
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchQuery("")}
                  className="glass-button text-black px-4 py-2 rounded-xl"
                >
                  Effacer la recherche
                </motion.button>
              </CardContent>
            </Card>
          )}

          {/* Contact rapide dynamique */}
          {helpData?.contact && (
            <Card className="bg-white/30 backdrop-blur-md border-white/40">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Besoin d'aide personnalisée ?</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-button text-black p-4 rounded-xl text-left"
                    onClick={() => handleContactNavigation('chat')}
                    aria-label="Ouvrir le chat en direct"
                  >
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5" />
                      <div>
                        <div className="font-medium">Chat en direct</div>
                        <div className="text-xs text-gray-600">
                          {helpData.contact.responseTime} {helpData.contact.chatHours}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-button text-black p-4 rounded-xl text-left"
                    onClick={() => handleContactNavigation('phone')}
                    aria-label="Appeler le support téléphonique"
                  >
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5" />
                      <div>
                        <div className="font-medium">Support téléphonique</div>
                        <div className="text-xs text-gray-600">{helpData.contact.phone}</div>
                      </div>
                    </div>
                  </motion.button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}