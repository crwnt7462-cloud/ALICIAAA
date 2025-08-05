// Configuration des plans d'abonnement professionnel
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  restrictions: string[];
  popular?: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic-pro',
    name: 'Basic Pro',
    price: 29,
    currency: 'EUR',
    interval: 'month',
    features: [
      'Gestion des rendez-vous',
      'Fiche client complète',
      'Planning professionnel',
      'Notifications automatiques',
      'Gestion des services',
      'Statistiques de base',
      'Page salon personnalisée',
      'Réservation en ligne',
      'Support email'
    ],
    restrictions: [
      'Pas d\'IA assistant',
      'Pas d\'analyse prédictive',
      'Pas de chatbot intelligent',
      'Pas d\'optimisation automatique planning',
      'Pas de recommendations personnalisées',
      'Limite de 200 clients',
      'Stockage limité à 1GB'
    ],
    stripeProductId: 'prod_basic_pro',
    stripePriceId: 'price_basic_pro_monthly'
  },
  {
    id: 'advanced-pro',
    name: 'Advanced Pro',
    price: 79,
    currency: 'EUR',
    interval: 'month',
    popular: true,
    features: [
      'Toutes les fonctionnalités Basic Pro',
      '📊 Analytics avancés',
      '🔔 Notifications push temps réel',
      '💰 Gestion avancée des paiements',
      '📱 App mobile complète',
      '🎯 Marketing de base',
      '⚡ Auto-planning basique',
      '☁️ Stockage étendu (10GB)',
      '📈 Rapports détaillés',
      '👥 Jusqu\'à 1000 clients',
      '🔧 Support prioritaire'
    ],
    restrictions: [
      'IA limitée (pas de chatbot personnalisé)',
      'Pas d\'analyse prédictive complète',
      'Marketing automation basique'
    ],
    stripeProductId: 'prod_advanced_pro',
    stripePriceId: 'price_advanced_pro_monthly'
  },
  {
    id: 'premium-pro',
    name: 'Premium Pro',
    price: 149,
    currency: 'EUR',
    interval: 'month',
    features: [
      'Toutes les fonctionnalités Advanced Pro',
      '🤖 IA Assistant personnalisé complet',
      '📊 Analyse prédictive avancée',
      '💬 Chatbot intelligent personnalisé',
      '⚡ Optimisation automatique du planning',
      '🎯 Marketing automation complet',
      '☁️ Stockage illimité',
      '🔮 Insights business prédictifs',
      '🏆 Outils de fidélisation avancés',
      '👥 Clients illimités',
      '🔧 Support prioritaire 24/7',
      '🚀 Nouvelles fonctionnalités en avant-première'
    ],
    restrictions: [],
    stripeProductId: 'prod_premium_pro',
    stripePriceId: 'price_premium_pro_monthly'
  }
];

// Types pour la gestion des abonnements
export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'past_due' | 'trialing';

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Fonctions utilitaires pour vérifier les permissions
export function hasAIAccess(planId: string): boolean {
  return planId === 'premium-pro';
}

export function hasAdvancedFeatures(planId: string): boolean {
  return planId === 'advanced-pro' || planId === 'premium-pro';
}

export function hasBasicAI(planId: string): boolean {
  return planId === 'advanced-pro' || planId === 'premium-pro';
}

export function hasFullAI(planId: string): boolean {
  return planId === 'premium-pro';
}

export function getMaxClients(planId: string): number {
  switch (planId) {
    case 'basic-pro': return 200;
    case 'advanced-pro': return 1000;
    case 'premium-pro': return Infinity;
    default: return 200;
  }
}

export function getStorageLimit(planId: string): number {
  // Retourne en GB
  switch (planId) {
    case 'basic-pro': return 1;
    case 'advanced-pro': return 10;
    case 'premium-pro': return Infinity;
    default: return 1;
  }
}

export function canAccessFeature(planId: string, feature: string): boolean {
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
  if (!plan) return false;
  
  // Fonctionnalités Premium Pro uniquement
  const premiumOnlyFeatures = [
    'ai-assistant-full',
    'predictive-analytics',
    'intelligent-chatbot',
    'marketing-automation-full',
    'business-insights-advanced'
  ];
  
  // Fonctionnalités Advanced Pro et plus
  const advancedFeatures = [
    'advanced-analytics',
    'auto-scheduling-basic',
    'push-notifications',
    'mobile-app',
    'advanced-payments',
    'priority-support'
  ];
  
  // Fonctionnalités de base (tous les plans)
  const basicFeatures = [
    'appointment-management',
    'client-database',
    'basic-planning',
    'salon-page',
    'basic-stats',
    'email-notifications'
  ];
  
  if (premiumOnlyFeatures.includes(feature)) {
    return planId === 'premium-pro';
  }
  
  if (advancedFeatures.includes(feature)) {
    return planId === 'advanced-pro' || planId === 'premium-pro';
  }
  
  // Pour l'IA assistant, niveau basique pour Advanced, complet pour Premium
  if (feature === 'ai-assistant') {
    return planId === 'advanced-pro' || planId === 'premium-pro';
  }
  
  return true;
}