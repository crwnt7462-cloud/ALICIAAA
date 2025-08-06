import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Settings } from 'lucide-react';
import { useLocation } from 'wouter';

export default function SalonPolicies() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [policies, setPolicies] = useState({
    cancellation: "Annulation gratuite jusqu'à 24h avant le rendez-vous",
    lateness: "Retard de plus de 15min = annulation automatique",
    deposit: "30% d'acompte requis pour valider la réservation", 
    modification: "Modification possible jusqu'à 12h avant",
    noShow: "En cas d'absence, l'acompte reste acquis au salon",
    refund: "Remboursement sous 5-7 jours ouvrés en cas d'annulation valide"
  });

  const [settings, setSettings] = useState({
    depositPercentage: 30,
    cancellationDeadline: 24,
    modificationDeadline: 12,
    latenessGracePeriod: 15,
    autoConfirmBookings: true,
    requireDepositForBooking: true
  });

  const handleSave = async () => {
    try {
      // Simuler la sauvegarde des politiques
      const response = await fetch('/api/salon/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          policies,
          settings
        })
      });

      if (response.ok) {
        toast({
          title: "Politiques sauvegardées",
          description: "Vos politiques de salon ont été mises à jour avec succès",
          variant: "success" as any
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde des politiques",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/40 backdrop-blur-md border-b border-white/30 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/dashboard')}
              className="h-10 w-10 p-0 rounded-full glass-button hover:glass-effect transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-violet-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Politiques du salon</h1>
                <p className="text-sm text-gray-600">Configurez les conditions de votre salon</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Paramètres généraux */}
        <Card className="glass-card border-white/40">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Paramètres généraux</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pourcentage d'acompte (%)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.depositPercentage}
                  onChange={(e) => setSettings(prev => ({ ...prev, depositPercentage: parseInt(e.target.value) }))}
                  className="glass-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Délai d'annulation (heures)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={settings.cancellationDeadline}
                  onChange={(e) => setSettings(prev => ({ ...prev, cancellationDeadline: parseInt(e.target.value) }))}
                  className="glass-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Délai de modification (heures)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={settings.modificationDeadline}
                  onChange={(e) => setSettings(prev => ({ ...prev, modificationDeadline: parseInt(e.target.value) }))}
                  className="glass-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tolérance retard (minutes)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={settings.latenessGracePeriod}
                  onChange={(e) => setSettings(prev => ({ ...prev, latenessGracePeriod: parseInt(e.target.value) }))}
                  className="glass-input"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Politiques personnalisées */}
        <Card className="glass-card border-white/40">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Messages des politiques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Politique d'annulation
              </label>
              <Textarea
                value={policies.cancellation}
                onChange={(e) => setPolicies(prev => ({ ...prev, cancellation: e.target.value }))}
                className="glass-input"
                rows={2}
                placeholder="Conditions d'annulation..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Politique de retard
              </label>
              <Textarea
                value={policies.lateness}
                onChange={(e) => setPolicies(prev => ({ ...prev, lateness: e.target.value }))}
                className="glass-input"
                rows={2}
                placeholder="Conditions en cas de retard..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Politique d'acompte
              </label>
              <Textarea
                value={policies.deposit}
                onChange={(e) => setPolicies(prev => ({ ...prev, deposit: e.target.value }))}
                className="glass-input"
                rows={2}
                placeholder="Conditions d'acompte..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Politique de modification
              </label>
              <Textarea
                value={policies.modification}
                onChange={(e) => setPolicies(prev => ({ ...prev, modification: e.target.value }))}
                className="glass-input"
                rows={2}
                placeholder="Conditions de modification..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Politique no-show
              </label>
              <Textarea
                value={policies.noShow}
                onChange={(e) => setPolicies(prev => ({ ...prev, noShow: e.target.value }))}
                className="glass-input"
                rows={2}
                placeholder="Conditions en cas d'absence..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Politique de remboursement
              </label>
              <Textarea
                value={policies.refund}
                onChange={(e) => setPolicies(prev => ({ ...prev, refund: e.target.value }))}
                className="glass-input"
                rows={2}
                placeholder="Conditions de remboursement..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Aperçu */}
        <Card className="glass-card border-white/40">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Aperçu client</CardTitle>
            <p className="text-sm text-gray-600">Voici comment les clients verront vos politiques</p>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50/50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-gray-700 mb-2">Conditions du salon :</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• {policies.cancellation}</li>
                <li>• {policies.lateness}</li>
                <li>• {policies.deposit}</li>
                <li>• {policies.modification}</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Bouton sauvegarde */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="glass-button hover:glass-effect text-black font-medium px-8 py-2.5 rounded-full transition-all duration-300"
          >
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder les politiques
          </Button>
        </div>
      </div>
    </div>
  );
}