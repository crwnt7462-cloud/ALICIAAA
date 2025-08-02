import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Palette, Settings, Eye } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { getGenericGlassButton } from '@/lib/salonColors';

export default function BookingCustomization() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer les données de la page de réservation
  const { data: bookingData, isLoading } = useQuery({
    queryKey: ['/api/booking-pages/current']
  });

  // État du formulaire
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    primaryColor: '#8B5CF6',
    secondaryColor: '#F3F4F6',
    logoUrl: '',
    backgroundImage: '',
    showServices: true,
    showStaff: true,
    requireDeposit: true,
    depositPercentage: 30,
    welcomeMessage: '',
    bookingRules: ''
  });

  // Mettre à jour le formulaire quand les données arrivent
  useEffect(() => {
    if (bookingData) {
      setFormData({
        title: (bookingData as any)?.title || 'Réservez votre rendez-vous',
        description: (bookingData as any)?.description || '',
        primaryColor: (bookingData as any)?.primaryColor || '#8B5CF6',
        secondaryColor: (bookingData as any)?.secondaryColor || '#F3F4F6',
        logoUrl: (bookingData as any)?.logoUrl || '',
        backgroundImage: (bookingData as any)?.backgroundImage || '',
        showServices: (bookingData as any)?.showServices ?? true,
        showStaff: (bookingData as any)?.showStaff ?? true,
        requireDeposit: (bookingData as any)?.requireDeposit ?? true,
        depositPercentage: (bookingData as any)?.depositPercentage || 30,
        welcomeMessage: (bookingData as any)?.welcomeMessage || '',
        bookingRules: (bookingData as any)?.bookingRules || ''
      });
    }
  }, [bookingData]);

  // Mutation pour sauvegarder
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('PATCH', '/api/booking-pages/current', data);
      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/booking-pages/current'] });
      toast({
        title: "Personnalisation sauvegardée",
        description: "Votre page de réservation a été mise à jour avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur de sauvegarde",
        description: "Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la personnalisation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setLocation('/pro-pages')}
                className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Personnalisation Réservation</h1>
                <p className="text-gray-600">Configurez l'apparence de votre page de réservation</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="rounded-full"
              >
                <Eye className="h-4 w-4 mr-2" />
                Aperçu
              </Button>
              <Button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className={`${getGenericGlassButton(0)} text-white rounded-full px-6 py-2 font-medium transition-all hover:scale-105`}
              >
                <Save className="h-4 w-4 mr-2" />
                {saveMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Contenu principal */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-violet-600" />
              Contenu de la page
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Titre principal</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Réservez votre rendez-vous"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="welcomeMessage">Message d'accueil</Label>
                <Input
                  id="welcomeMessage"
                  value={formData.welcomeMessage}
                  onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
                  placeholder="Bienvenue dans notre salon"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Présentez votre salon et vos services..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="bookingRules">Règles de réservation</Label>
              <Textarea
                id="bookingRules"
                value={formData.bookingRules}
                onChange={(e) => handleInputChange('bookingRules', e.target.value)}
                placeholder="Règles d'annulation, retard, etc..."
                className="mt-1"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Apparence */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-pink-600" />
              Apparence et couleurs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryColor">Couleur principale</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    className="w-20 h-10 p-1 border rounded"
                  />
                  <Input
                    value={formData.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    placeholder="#8B5CF6"
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="secondaryColor">Couleur secondaire</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                    className="w-20 h-10 p-1 border rounded"
                  />
                  <Input
                    value={formData.secondaryColor}
                    onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                    placeholder="#F3F4F6"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="logoUrl">Logo du salon (URL)</Label>
                <Input
                  id="logoUrl"
                  value={formData.logoUrl}
                  onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                  placeholder="https://exemple.com/logo.png"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="backgroundImage">Image de fond (URL)</Label>
                <Input
                  id="backgroundImage"
                  value={formData.backgroundImage}
                  onChange={(e) => handleInputChange('backgroundImage', e.target.value)}
                  placeholder="https://exemple.com/background.jpg"
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Options avancées */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Options avancées</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Afficher les services</Label>
                <p className="text-sm text-gray-500">Permettre aux clients de choisir leurs services</p>
              </div>
              <Switch
                checked={formData.showServices}
                onCheckedChange={(checked) => handleInputChange('showServices', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Afficher l'équipe</Label>
                <p className="text-sm text-gray-500">Permettre de choisir un membre de l'équipe</p>
              </div>
              <Switch
                checked={formData.showStaff}
                onCheckedChange={(checked) => handleInputChange('showStaff', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Acompte requis</Label>
                <p className="text-sm text-gray-500">Demander un acompte lors de la réservation</p>
              </div>
              <Switch
                checked={formData.requireDeposit}
                onCheckedChange={(checked) => handleInputChange('requireDeposit', checked)}
              />
            </div>

            {formData.requireDeposit && (
              <div>
                <Label htmlFor="depositPercentage">Pourcentage d'acompte (%)</Label>
                <Select 
                  value={formData.depositPercentage.toString()} 
                  onValueChange={(value) => handleInputChange('depositPercentage', parseInt(value))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner le pourcentage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20%</SelectItem>
                    <SelectItem value="30">30%</SelectItem>
                    <SelectItem value="50">50%</SelectItem>
                    <SelectItem value="100">100%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}