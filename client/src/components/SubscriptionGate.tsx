import React from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Sparkles, Crown } from 'lucide-react';
import { useLocation } from 'wouter';

interface SubscriptionGateProps {
  feature: string;
  featureName: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SubscriptionGate({ feature, featureName, children, fallback }: SubscriptionGateProps) {
  const { canAccess, currentPlan, isBasicPro } = useSubscription();
  const [, setLocation] = useLocation();

  if (canAccess && canAccess(feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Card className="glass-stat-card border-2 border-dashed border-amber-200/50">
      <CardContent className="p-6 text-center">
        <div className="mb-4">
          {isBasicPro ? (
            <Crown className="w-12 h-12 mx-auto text-amber-500 mb-2" />
          ) : (
            <Lock className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {featureName}
        </h3>
        
        <Badge variant="outline" className="mb-4">
          <Sparkles className="w-3 h-3 mr-1" />
          Fonctionnalité Premium Pro
        </Badge>
        
        <p className="text-gray-600 mb-6 text-sm">
          Cette fonctionnalité avancée est disponible uniquement avec l'abonnement Premium Pro (149€/mois)
        </p>
        
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-700 font-medium mb-2">
            ✨ Inclus dans Premium Pro :
          </p>
          <ul className="text-xs text-gray-600 space-y-1 text-left">
            <li>• IA Assistant personnalisée</li>
            <li>• Analyse prédictive avancée</li>
            <li>• Optimisation automatique planning</li>
            <li>• Stockage et clients illimités</li>
          </ul>
        </div>
        
        <Button 
          onClick={() => setLocation('/subscription-plans')}
          className="glass-button w-full"
        >
          <Crown className="w-4 h-4 mr-2" />
          Passer à Premium Pro
        </Button>
        
        <p className="text-xs text-gray-500 mt-3">
          Plan actuel : {currentPlan === 'basic-pro' ? 'Basic Pro (29€/mois)' : 'Gratuit'}
        </p>
      </CardContent>
    </Card>
  );
}

// Hook pour vérifier rapidement l'accès aux fonctionnalités
export function useFeatureAccess(feature: string) {
  const { canAccess } = useSubscription();
  return canAccess(feature);
}