import React from 'react';
import { useQuery } from '@tanstack/react-query';
import PromoCodeManager from '@/components/PromoCodeManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Euro, Target } from 'lucide-react';

export default function PromoCodeManagement() {
  const { data: promoCodes = [], isLoading } = useQuery({
    queryKey: ['/api/promo-codes'],
  });

  const { data: services = [] } = useQuery({
    queryKey: ['/api/services'],
  });

  // Calculate statistics
  const activePromoCodes = promoCodes.filter((pc: any) => pc.isActive);
  const totalUses = promoCodes.reduce((sum: number, pc: any) => sum + pc.currentUses, 0);
  const totalSavings = promoCodes.reduce((sum: number, pc: any) => {
    return sum + (pc.discountType === 'fixed_amount' 
      ? pc.discountValue * pc.currentUses
      : 0); // Simplified calculation
  }, 0);

  const handleCreatePromoCode = async (promoCodeData: any) => {
    try {
      const response = await fetch('/api/promo-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promoCodeData),
      });
      
      if (response.ok) {
        // Refresh data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error creating promo code:', error);
    }
  };

  const handleUpdatePromoCode = async (id: number, updates: any) => {
    try {
      const response = await fetch(`/api/promo-codes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (response.ok) {
        // Refresh data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating promo code:', error);
    }
  };

  const handleDeletePromoCode = async (id: number) => {
    try {
      const response = await fetch(`/api/promo-codes/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Refresh data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting promo code:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-violet-50 via-white to-purple-50 min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-violet-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <div className="bg-white/40 backdrop-blur-md border-b border-white/30 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-black">Gestion des Codes Promotionnels</h1>
          <p className="text-gray-600 mt-2">
            Créez et gérez vos offres promotionnelles pour attirer et fidéliser vos clients
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card border-white/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Codes actifs</p>
                  <p className="text-2xl font-bold text-black">{activePromoCodes.length}</p>
                </div>
                <div className="p-2 bg-violet-100 rounded-lg">
                  <Target className="h-6 w-6 text-violet-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilisations totales</p>
                  <p className="text-2xl font-bold text-black">{totalUses}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Économies clients</p>
                  <p className="text-2xl font-bold text-black">{totalSavings}€</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Euro className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taux d'utilisation</p>
                  <p className="text-2xl font-bold text-black">
                    {promoCodes.length > 0 
                      ? Math.round((totalUses / promoCodes.reduce((sum: number, pc: any) => sum + (pc.maxUses || 100), 0)) * 100)
                      : 0
                    }%
                  </p>
                </div>
                <div className="p-2 bg-amber-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Promo Code Manager */}
        <PromoCodeManager
          promoCodes={promoCodes}
          services={services}
          onCreatePromoCode={handleCreatePromoCode}
          onUpdatePromoCode={handleUpdatePromoCode}
          onDeletePromoCode={handleDeletePromoCode}
        />

        {/* Tips & Best Practices */}
        <Card className="glass-card border-white/40 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-violet-600" />
              Conseils pour des codes promo efficaces
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Bonnes pratiques</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="text-xs">Tip</Badge>
                    <span>Utilisez des codes courts et mémorables (5-8 caractères)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="text-xs">Tip</Badge>
                    <span>Fixez une date d'expiration pour créer l'urgence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="text-xs">Tip</Badge>
                    <span>Limitez le nombre d'utilisations pour contrôler les coûts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="text-xs">Tip</Badge>
                    <span>Offrez 10-25% de remise pour les nouveaux clients</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Stratégies marketing</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary" className="text-xs">💡</Badge>
                    <span>Codes saisonniers (PRINTEMPS, NOEL, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary" className="text-xs">💡</Badge>
                    <span>Remises fidélité pour clients récurrents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary" className="text-xs">💡</Badge>
                    <span>Offres spéciales weekend ou créneaux creux</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary" className="text-xs">💡</Badge>
                    <span>Codes parrainage pour encourager le bouche-à-oreille</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}