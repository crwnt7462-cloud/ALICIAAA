import React, { useCallback, useMemo, useState, useEffect } from 'react';
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
  const [isSaving, setIsSaving] = useState(false);

  type Policies = {
    cancellation: string;
    lateness: string;
    deposit: string;
    modification: string;
    noShow: string;
    refund: string;
  };

  type Settings = {
    depositPercentage: number;
    cancellationDeadline: number;
    modificationDeadline: number;
    latenessGracePeriod: number;
    autoConfirmBookings: boolean;
    requireDepositForBooking: boolean;
  };

  const [policies, setPolicies] = useState<Policies>({
    cancellation: "Annulation gratuite jusqu'à 24h avant le rendez-vous. Au-delà, des frais d'annulation peuvent s'appliquer.",
    lateness: "En cas de retard de plus de 15 minutes, votre créneau pourra être reporté ou annulé selon la disponibilité.",
    deposit: "Un acompte peut être demandé pour confirmer votre réservation. Le montant sera déduit du total à régler.",
    modification: "Les modifications de rendez-vous sont possibles jusqu'à 12h avant l'heure prévue, sous réserve de disponibilité.",
    noShow: "En cas d'absence non signalée, l'acompte versé reste acquis au professionnel.",
    refund: "Le remboursement s'effectue sous 5-7 jours ouvrés en cas d'annulation valide selon nos conditions."
  });

  const [settings, setSettings] = useState<Settings>({
    depositPercentage: 30,
    cancellationDeadline: 24,
    modificationDeadline: 12,
    latenessGracePeriod: 15,
    autoConfirmBookings: true,
    requireDepositForBooking: true
  });

  // Chargement des données depuis l'API
  useEffect(() => {
    const loadPolicies = async () => {
      try {
        const response = await fetch('/api/salon/policies', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          credentials: 'include',
          cache: 'no-store',
          referrerPolicy: 'same-origin'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.policies) setPolicies(data.policies);
          if (data.settings) setSettings(data.settings);
        }
      } catch (error) {
        console.error('Erreur chargement politiques:', error);
      }
    };

    loadPolicies();
  }, []);

  // Sécurité : validation et sanitisation des entrées
  const sanitizeInput = useCallback((input: string): string => {
    return input
      .replace(/[<>]/g, '') // Supprime < et >
      .replace(/javascript:/gi, '') // Supprime javascript:
      .replace(/on\w+=/gi, '') // Supprime les event handlers
      .trim()
      .substring(0, 500); // Limite la longueur
  }, []);

  const validateNumber = useCallback((value: number, min: number, max: number): number => {
    return Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
  }, []);

  const updatePolicy = useCallback((key: keyof Policies, value: string) => {
    const sanitized = sanitizeInput(value);
    setPolicies(prev => ({ ...prev, [key]: sanitized }));
  }, [sanitizeInput]);

  const updateSettingNumber = useCallback((key: keyof Settings, value: number) => {
    const constraints = {
      depositPercentage: { min: 0, max: 100 },
      cancellationDeadline: { min: 0, max: 168 }, // 7 jours max
      modificationDeadline: { min: 0, max: 168 },
      latenessGracePeriod: { min: 0, max: 60 } // 1h max
    };
    
    const constraint = constraints[key as keyof typeof constraints];
    if (constraint) {
      const validated = validateNumber(value, constraint.min, constraint.max);
      setSettings(prev => ({ ...prev, [key]: validated }));
    } else {
      setSettings(prev => ({ ...prev, [key]: value }));
    }
  }, [validateNumber]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch('/api/salon/policies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include',
        cache: 'no-store',
        referrerPolicy: 'same-origin',
        body: JSON.stringify({ policies, settings }),
        signal: controller.signal
      });
      if (!response.ok) throw new Error('Request failed');
      toast({
        title: "Politiques sauvegardées",
        description: "Vos politiques ont été mises à jour avec succès",
      });
    } catch (error) {
      const isAbort = (error as Error)?.name === 'AbortError';
      toast({
        title: isAbort ? 'Délai dépassé' : 'Erreur',
        description: isAbort ? "La requête a pris trop de temps." : "Erreur lors de la sauvegarde des politiques",
        variant: 'destructive'
      });
    } finally {
      clearTimeout(timer);
      setIsSaving(false);
    }
  }, [policies, settings, toast]);

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
              {[
                { key: 'depositPercentage', label: "Pourcentage d'acompte (%)", min: 0, max: 100 },
                { key: 'cancellationDeadline', label: "Délai d'annulation (heures)", min: 0 },
                { key: 'modificationDeadline', label: "Délai de modification (heures)", min: 0 },
                { key: 'latenessGracePeriod', label: "Tolérance retard (minutes)", min: 0 },
              ].map(({ key, label, min, max }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                  <Input
                    type="number"
                    min={min as number}
                    {...(max !== undefined ? { max } : {})}
                    value={settings[key as keyof Settings] as number}
                    onChange={(e) => updateSettingNumber(key as keyof Settings, parseInt(e.target.value))}
                    className="glass-input"
                    maxLength={3}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Politiques personnalisées */}
        <Card className="glass-card border-white/40">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Messages des politiques</CardTitle>
            <p className="text-sm text-gray-600">Les textes sont limités à 500 caractères pour la sécurité</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Politique d'annulation</label>
              <Textarea
                value={policies.cancellation}
                onChange={(e) => updatePolicy('cancellation', e.target.value)}
                className="glass-input"
                rows={2}
                placeholder="Conditions d'annulation..."
                maxLength={500}
              />
              <div className="text-xs text-gray-500 mt-1">
                {policies.cancellation.length}/500 caractères
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Politique de retard</label>
              <Textarea
                value={policies.lateness}
                onChange={(e) => updatePolicy('lateness', e.target.value)}
                className="glass-input"
                rows={2}
                placeholder="Conditions en cas de retard..."
                maxLength={500}
              />
              <div className="text-xs text-gray-500 mt-1">
                {policies.lateness.length}/500 caractères
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Politique d'acompte</label>
              <Textarea
                value={policies.deposit}
                onChange={(e) => updatePolicy('deposit', e.target.value)}
                className="glass-input"
                rows={2}
                placeholder="Conditions d'acompte..."
                maxLength={500}
              />
              <div className="text-xs text-gray-500 mt-1">
                {policies.deposit.length}/500 caractères
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Politique de modification</label>
              <Textarea
                value={policies.modification}
                onChange={(e) => updatePolicy('modification', e.target.value)}
                className="glass-input"
                rows={2}
                placeholder="Conditions de modification..."
                maxLength={500}
              />
              <div className="text-xs text-gray-500 mt-1">
                {policies.modification.length}/500 caractères
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Politique no-show</label>
              <Textarea
                value={policies.noShow}
                onChange={(e) => updatePolicy('noShow', e.target.value)}
                className="glass-input"
                rows={2}
                placeholder="Conditions en cas d'absence..."
                maxLength={500}
              />
              <div className="text-xs text-gray-500 mt-1">
                {policies.noShow.length}/500 caractères
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Politique de remboursement</label>
              <Textarea
                value={policies.refund}
                onChange={(e) => updatePolicy('refund', e.target.value)}
                className="glass-input"
                rows={2}
                placeholder="Conditions de remboursement..."
                maxLength={500}
              />
              <div className="text-xs text-gray-500 mt-1">
                {policies.refund.length}/500 caractères
              </div>
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
            disabled={isSaving}
            className="glass-button hover:glass-effect text-black font-medium px-8 py-2.5 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="animate-spin w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                Sauvegarde en cours...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder les politiques
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}