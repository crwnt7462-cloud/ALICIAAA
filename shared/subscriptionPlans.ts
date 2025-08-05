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
    id: 'premium-pro',
    name: 'Premium Pro',
    price: 149,
    currency: 'EUR',
    interval: 'month',
    popular: true,
    features: [
      'Toutes les fonctionnalités Basic Pro',
      '🤖 IA Assistant intégrée',
      '📊 Analyse prédictive avancée',
      '💬 Chatbot intelligent pour clients',
      '⚡ Optimisation automatique planning',
      '🎯 Recommendations personnalisées',
      '📈 Analytics business avancés',
      '🔄 Intégrations automatiques',
      '☁️ Stockage illimité',
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
  return planId === 'premium-pro';
}

export function getMaxClients(planId: string): number {
  return planId === 'basic-pro' ? 200 : Infinity;
}

export function getStorageLimit(planId: string): number {
  // Retourne en GB
  return planId === 'basic-pro' ? 1 : Infinity;
}

export function canAccessFeature(planId: string, feature: string): boolean {
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
  if (!plan) return false;
  
  const restrictedFeatures = [
    'ai-assistant',
    'predictive-analytics', 
    'intelligent-chatbot',
    'auto-scheduling',
    'advanced-recommendations',
    'business-insights'
  ];
  
  if (restrictedFeatures.includes(feature)) {
    return hasAdvancedFeatures(planId);
  }
  
  return true;
}