import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { 
  ArrowLeft, 
  Crown, 
  Star, 
  Sparkles, 
  Lock,
  Users,
  Database,
  Brain,
  BarChart3,
  MessageSquare,
  Zap
} from 'lucide-react';

const testAccounts = [
  {
    id: 'basic-pro',
    name: 'Basic Pro',
    price: '29€/mois',
    email: 'basic@salon.fr',
    password: 'basic123',
    description: 'Fonctionnalités essentielles uniquement',
    icon: Sparkles,
    iconColor: 'text-blue-500',
    bgColor: 'from-blue-50/50 to-cyan-50/50',
    borderColor: 'ring-blue-200',
    features: [
      'Gestion rendez-vous de base',
      'Base de données clients (200 max)',
      'Planning professionnel',
      'Page salon personnalisée',
      'Statistiques de base',
      '1GB de stockage'
    ],
    limitations: [
      'Pas d\'accès à l\'IA',
      'Analytics limités',
      'Pas de chatbot',
      'Pas d\'optimisation auto'
    ]
  },
  {
    id: 'advanced-pro',
    name: 'Advanced Pro',
    price: '79€/mois',
    email: 'advanced@salon.fr',
    password: 'advanced123',
    description: 'Fonctionnalités avancées + premiers outils IA',
    icon: Star,
    iconColor: 'text-amber-500',
    bgColor: 'from-amber-50/50 to-orange-50/50',
    borderColor: 'ring-amber-200',
    popular: true,
    features: [
      'Toutes fonctionnalités Basic Pro',
      'Analytics avancés',
      'Notifications push temps réel',
      'Auto-planning basique',
      'App mobile complète',
      'Marketing de base',
      'Jusqu\'à 1000 clients',
      '10GB de stockage'
    ],
    limitations: [
      'IA limitée (pas de chatbot personnalisé)',
      'Pas d\'analyse prédictive complète'
    ]
  },
  {
    id: 'premium-pro',
    name: 'Premium Pro',
    price: '149€/mois',
    email: 'premium@salon.fr',
    password: 'premium123',
    description: 'Solution complète avec IA avancée',
    icon: Crown,
    iconColor: 'text-violet-500',
    bgColor: 'from-violet-50/50 to-purple-50/50',
    borderColor: 'ring-violet-200',
    features: [
      'Toutes fonctionnalités Advanced Pro',
      '🤖 IA Assistant personnalisé complet',
      '📊 Analyse prédictive avancée',
      '💬 Chatbot intelligent personnalisé',
      '⚡ Optimisation automatique planning',
      '🎯 Marketing automation complet',
      '☁️ Stockage illimité',
      '👥 Clients illimités',
      '🔧 Support prioritaire 24/7'
    ],
    limitations: []
  }
];

export default function SubscriptionTestLogin() {
  const [, setLocation] = useLocation();

  const handleLogin = (email: string, password: string) => {
    // Simuler la connexion avec ces comptes de test
    alert(`Connexion avec : ${email}\nMot de passe : ${password}\n\n⚠️ Fonctionnalité en développement - utilisez la page de connexion normale pour tester.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/40 backdrop-blur-md border-b border-white/30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setLocation('/pro-login')}
                className="glass-button"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour connexion
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Comptes de test - Plans d'abonnement</h1>
                <p className="text-gray-600">Testez les différents niveaux d'accès aux fonctionnalités</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comptes de test */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {testAccounts.map((account, index) => {
            const IconComponent = account.icon;
            
            return (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${account.popular ? 'lg:scale-105' : ''}`}
              >
                <Card className={`h-full bg-gradient-to-br ${account.bgColor} backdrop-blur-md border-white/40 ${account.popular ? `ring-2 ${account.borderColor}` : ''}`}>
                  {account.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        Le plus populaire
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center mb-4">
                      <IconComponent className={`w-8 h-8 ${account.iconColor}`} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900">{account.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{account.description}</p>
                    
                    <div className="text-xl font-bold text-gray-900">{account.price}</div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Identifiants de connexion */}
                    <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/40">
                      <h4 className="font-semibold text-gray-900 mb-2 text-center">🔑 Identifiants de test</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Email :</span>
                          <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">{account.email}</code>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Mot de passe :</span>
                          <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">{account.password}</code>
                        </div>
                      </div>
                    </div>
                    
                    {/* Fonctionnalités */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Sparkles className="w-4 h-4 mr-2 text-green-500" />
                        Fonctionnalités incluses
                      </h4>
                      <ul className="space-y-1.5">
                        {account.features.slice(0, 4).map((feature, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-xs">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                        {account.features.length > 4 && (
                          <li className="text-xs text-gray-500 italic">+ {account.features.length - 4} autres fonctionnalités</li>
                        )}
                      </ul>
                    </div>
                    
                    {/* Limitations */}
                    {account.limitations.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Lock className="w-4 h-4 mr-2 text-red-500" />
                          Limitations
                        </h4>
                        <ul className="space-y-1.5">
                          {account.limitations.map((limitation, idx) => (
                            <li key={idx} className="flex items-start space-x-2 text-xs">
                              <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0" />
                              <span className="text-gray-600">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Bouton de test */}
                    <div className="pt-4">
                      <Button
                        onClick={() => handleLogin(account.email, account.password)}
                        className={`w-full glass-button ${account.popular ? 'ring-1 ring-amber-300' : ''}`}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Tester ce plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
        
        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <Card className="bg-white/50 backdrop-blur-md border-white/40">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Database className="w-5 h-5 mr-2 text-blue-500" />
                Instructions de test
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">🔍 Comment tester :</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    <li>Connectez-vous avec un des comptes ci-dessus</li>
                    <li>Accédez au tableau de bord professionnel</li>
                    <li>Essayez d'accéder à l'IA Assistant (/ai-pro)</li>
                    <li>Testez les restrictions selon le plan</li>
                    <li>Comparez les fonctionnalités disponibles</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">🎯 À vérifier :</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-violet-500" />
                      <span>IA accessible selon le plan</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-blue-500" />
                      <span>Analytics différenciés</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-green-500" />
                      <span>Chatbot selon restrictions</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span>Auto-planning différencié</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}