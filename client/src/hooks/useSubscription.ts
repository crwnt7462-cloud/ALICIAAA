import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { hasAIAccess, hasAdvancedFeatures, hasBasicAI, hasFullAI, canAccessFeature, SUBSCRIPTION_PLANS } from '@shared/subscriptionPlans';

export function useSubscription() {
  const { user } = useAuth();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ['/api/user/subscription'],
    enabled: !!user,
  });

  // Utiliser les données de subscription de l'API si disponibles, sinon utiliser user
  const currentPlan = (subscription as any)?.planId || 'basic-pro';
  const planData = SUBSCRIPTION_PLANS.find(p => p.id === currentPlan);
  const status = (subscription as any)?.status || 'inactive';

  return {
    subscription,
    isLoading,
    currentPlan,
    planData,
    isBasicPro: currentPlan === 'basic-pro',
    isAdvancedPro: currentPlan === 'advanced-pro',
    isPremiumPro: currentPlan === 'premium-pro',
    hasAI: hasAIAccess(currentPlan),
    hasBasicAI: hasBasicAI(currentPlan),
    hasFullAI: hasFullAI(currentPlan),
    hasAdvanced: hasAdvancedFeatures(currentPlan),
    canAccess: (feature: string) => canAccessFeature(currentPlan, feature),
    isActive: status === 'active',
    isTrial: status === 'trial'
  };
}