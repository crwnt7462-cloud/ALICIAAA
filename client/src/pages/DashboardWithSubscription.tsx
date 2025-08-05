import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { useSubscription } from '@/hooks/useSubscription';
import { SubscriptionGate } from '@/components/SubscriptionGate';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  Euro, 
  TrendingUp,
  Crown,
  Sparkles,
  Brain,
  BarChart3,
  MessageSquare,
  Zap
} from 'lucide-react';

// Import du dashboard original
import Dashboard from '@/pages/Dashboard';

export default function DashboardWithSubscription() {
  const [, setLocation] = useLocation();
  const { currentPlan, isBasicPro, isPremiumPro, hasAI, planData } = useSubscription();

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      {/* Header avec informations d'abonnement */}
      <div className="bg-white/40 backdrop-blur-md border-b border-white/30 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Tableau de bord</h1>
              <Badge 
                variant="outline" 
                className={`${isPremiumPro ? 'border-violet-200 bg-violet-50 text-violet-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}
              >
                {isPremiumPro ? <Crown className="w-3 h-3 mr-1" /> : <Sparkles className="w-3 h-3 mr-1" />}
                {planData?.name}
              </Badge>
            </div>
            
            <Button
              onClick={() => setLocation('/subscription-plans')}
              className={`glass-button ${isBasicPro ? 'ring-1 ring-violet-200' : ''}`}
            >
              {isBasicPro ? (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  Passer à Premium
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gérer l'abonnement
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Contenu principal avec restrictions selon l'abonnement */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Fonctionnalités de base - toujours visibles */}
        <Dashboard />
        
        {/* Section des fonctionnalités avancées avec restriction */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🚀 Fonctionnalités avancées</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* IA Assistant */}
            <SubscriptionGate 
              feature="ai-assistant" 
              featureName="Assistant IA"
              fallback={
                <Card className="glass-stat-card border-2 border-dashed border-amber-200/50 cursor-pointer hover:border-violet-300/50 transition-colors">
                  <CardContent className="p-4 text-center">
                    <Brain className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <h3 className="font-semibold text-gray-700 mb-1">Assistant IA</h3>
                    <Badge variant="outline" className="mb-2">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium Pro
                    </Badge>
                    <p className="text-xs text-gray-500">Conseils personnalisés</p>
                  </CardContent>
                </Card>
              }
            >
              <Card 
                className="glass-stat-card cursor-pointer hover:bg-white/40 transition-colors"
                onClick={() => setLocation('/ai-pro')}
              >
                <CardContent className="p-4 text-center">
                  <Brain className="w-8 h-8 mx-auto text-violet-500 mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Assistant IA</h3>
                  <Badge className="bg-violet-100 text-violet-700 mb-2">Actif</Badge>
                  <p className="text-xs text-gray-600">Conseils personnalisés</p>
                </CardContent>
              </Card>
            </SubscriptionGate>

            {/* Analyse prédictive */}
            <SubscriptionGate 
              feature="predictive-analytics" 
              featureName="Analyse Prédictive"
              fallback={
                <Card className="glass-stat-card border-2 border-dashed border-amber-200/50">
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <h3 className="font-semibold text-gray-700 mb-1">Analytics Avancés</h3>
                    <Badge variant="outline" className="mb-2">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium Pro
                    </Badge>
                    <p className="text-xs text-gray-500">Prédictions business</p>
                  </CardContent>
                </Card>
              }
            >
              <Card className="glass-stat-card cursor-pointer hover:bg-white/40 transition-colors">
                <CardContent className="p-4 text-center">
                  <BarChart3 className="w-8 h-8 mx-auto text-violet-500 mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Analytics Avancés</h3>
                  <Badge className="bg-violet-100 text-violet-700 mb-2">Actif</Badge>
                  <p className="text-xs text-gray-600">Prédictions business</p>
                </CardContent>
              </Card>
            </SubscriptionGate>

            {/* Chatbot intelligent */}
            <SubscriptionGate 
              feature="intelligent-chatbot" 
              featureName="Chatbot Intelligent"
              fallback={
                <Card className="glass-stat-card border-2 border-dashed border-amber-200/50">
                  <CardContent className="p-4 text-center">
                    <MessageSquare className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <h3 className="font-semibold text-gray-700 mb-1">Chatbot Client</h3>
                    <Badge variant="outline" className="mb-2">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium Pro
                    </Badge>
                    <p className="text-xs text-gray-500">Support automatique</p>
                  </CardContent>
                </Card>
              }
            >
              <Card className="glass-stat-card cursor-pointer hover:bg-white/40 transition-colors">
                <CardContent className="p-4 text-center">
                  <MessageSquare className="w-8 h-8 mx-auto text-violet-500 mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Chatbot Client</h3>
                  <Badge className="bg-violet-100 text-violet-700 mb-2">Actif</Badge>
                  <p className="text-xs text-gray-600">Support automatique</p>
                </CardContent>
              </Card>
            </SubscriptionGate>
          </div>
        </div>

        {/* Incitation à upgrader pour Basic Pro */}
        {isBasicPro && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
              <CardContent className="p-6 text-center">
                <Crown className="w-12 h-12 mx-auto text-violet-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Débloquez tout le potentiel de votre salon
                </h3>
                <p className="text-gray-600 mb-6">
                  Passez à Premium Pro pour accéder à l'IA, l'analyse prédictive et bien plus encore
                </p>
                <div className="flex items-center justify-center space-x-6 mb-6">
                  <div className="text-center">
                    <Brain className="w-6 h-6 mx-auto text-violet-500 mb-1" />
                    <p className="text-xs text-gray-600">IA Assistant</p>
                  </div>
                  <div className="text-center">
                    <BarChart3 className="w-6 h-6 mx-auto text-violet-500 mb-1" />
                    <p className="text-xs text-gray-600">Analytics</p>
                  </div>
                  <div className="text-center">
                    <Zap className="w-6 h-6 mx-auto text-violet-500 mb-1" />
                    <p className="text-xs text-gray-600">Auto-planning</p>
                  </div>
                </div>
                <Button
                  onClick={() => setLocation('/subscription-plans')}
                  className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Découvrir Premium Pro - 149€/mois
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}