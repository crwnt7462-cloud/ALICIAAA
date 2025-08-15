import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, Palette, Save, Eye } from 'lucide-react';

interface CustomColors {
  primary: string;
  accent: string;
  buttonText: string;
  priceColor: string;
  neonFrame: string;
  intensity: number;
}

export default function BarbierCustomizer() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [customColors, setCustomColors] = useState<CustomColors>({
    primary: '#7c3aed',
    accent: '#a855f7', 
    buttonText: '#ffffff',
    priceColor: '#7c3aed',
    neonFrame: '#a855f7',
    intensity: 35
  });

  // Mutation pour sauvegarder les couleurs
  const saveMutation = useMutation({
    mutationFn: async (colors: CustomColors) => {
      const response = await fetch('/api/salon/barbier-gentleman-marais/custom-colors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customColors: colors })
      });
      if (!response.ok) throw new Error('Erreur sauvegarde');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "✓ Couleurs sauvegardées",
        description: "Les modifications ont été appliquées avec succès",
        duration: 3000,
      });
      // Invalider le cache pour forcer le rechargement
      queryClient.invalidateQueries({ queryKey: ['/api/salon/barbier-gentleman-marais'] });
    },
    onError: () => {
      toast({
        title: "❌ Erreur",
        description: "Impossible de sauvegarder les modifications",
        duration: 3000,
        variant: "destructive"
      });
    }
  });

  const handleColorChange = (field: keyof CustomColors, value: string | number) => {
    setCustomColors(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    saveMutation.mutate(customColors);
  };

  const previewStyle = {
    background: `linear-gradient(135deg, ${customColors.primary}${Math.round(customColors.intensity * 2.55).toString(16).padStart(2, '0')}, ${customColors.primary}${Math.round(customColors.intensity * 1.5).toString(16).padStart(2, '0')})`,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: `1px solid ${customColors.primary}40`,
    color: customColors.buttonText,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/salon/barbier-gentleman-marais')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au salon
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Barbier Gentleman Marais</h1>
              <p className="text-gray-600">Personnalisation des couleurs</p>
            </div>
          </div>
          <Button
            onClick={() => setLocation('/salon/barbier-gentleman-marais')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Voir le salon
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Panneau de customisation */}
          <div className="space-y-6">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Palette className="h-6 w-6 text-violet-600" />
                  <h2 className="text-xl font-semibold">Couleurs personnalisées</h2>
                </div>

                <div className="space-y-6">
                  {/* Couleur principale */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Couleur principale</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={customColors.primary}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                        className="w-16 h-12 rounded-lg border border-gray-300 cursor-pointer"
                      />
                      <Input
                        value={customColors.primary}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                        className="flex-1 text-sm font-mono"
                        placeholder="#7c3aed"
                      />
                    </div>
                  </div>

                  {/* Couleur accent */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Couleur accent</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={customColors.accent}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                        className="w-16 h-12 rounded-lg border border-gray-300 cursor-pointer"
                      />
                      <Input
                        value={customColors.accent}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                        className="flex-1 text-sm font-mono"
                        placeholder="#a855f7"
                      />
                    </div>
                  </div>

                  {/* Intensité */}
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Intensité: {customColors.intensity}%
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="80"
                      value={customColors.intensity}
                      onChange={(e) => handleColorChange('intensity', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Couleur texte bouton */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Couleur texte bouton</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={customColors.buttonText}
                        onChange={(e) => handleColorChange('buttonText', e.target.value)}
                        className="w-16 h-12 rounded-lg border border-gray-300 cursor-pointer"
                      />
                      <Input
                        value={customColors.buttonText}
                        onChange={(e) => handleColorChange('buttonText', e.target.value)}
                        className="flex-1 text-sm font-mono"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Thèmes prédéfinis */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Thèmes prédéfinis</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'Barbier Classique', primary: '#8b4513', accent: '#d2b48c', desc: 'Bois et cuir' },
                    { name: 'Moderne Violet', primary: '#8b5cf6', accent: '#a855f7', desc: 'Élégant et moderne' },
                    { name: 'Gentleman', primary: '#1f2937', accent: '#374151', desc: 'Noir sophistiqué' },
                    { name: 'Rouge Passion', primary: '#dc2626', accent: '#ef4444', desc: 'Énergie et force' }
                  ].map((theme) => (
                    <button
                      key={theme.name}
                      onClick={() => setCustomColors(prev => ({
                        ...prev,
                        primary: theme.primary,
                        accent: theme.accent
                      }))}
                      className="p-4 border rounded-lg hover:shadow-lg transition-all text-left"
                      style={{ 
                        borderColor: theme.primary,
                        background: `linear-gradient(135deg, ${theme.primary}15 0%, ${theme.accent}08 100%)`
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: theme.primary }}
                        />
                        <h4 className="font-medium text-sm">{theme.name}</h4>
                      </div>
                      <p className="text-xs text-gray-600">{theme.desc}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Aperçu */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-6">Aperçu des boutons</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-3">Bouton de réservation:</p>
                    <button
                      className="px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center gap-2"
                      style={previewStyle}
                    >
                      📅 Réserver maintenant
                    </button>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-3">Badge service:</p>
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium border"
                      style={{
                        backgroundColor: `${customColors.primary}15`,
                        color: customColors.primary,
                        borderColor: `${customColors.primary}30`
                      }}
                    >
                      Coupe Classique
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="flex-1 flex items-center gap-2"
                style={previewStyle}
              >
                <Save className="h-4 w-4" />
                {saveMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}