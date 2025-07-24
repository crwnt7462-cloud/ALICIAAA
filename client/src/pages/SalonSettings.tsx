import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Building2, Phone, MapPin, Mail } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

export default function SalonSettings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer les données du salon
  const { data: salonData, isLoading } = useQuery({
    queryKey: ['/api/salon-settings']
  });

  // État du formulaire
  const [formData, setFormData] = useState({
    businessName: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    description: '',
    coverImage: ''
  });

  // Mettre à jour le formulaire quand les données arrivent
  useEffect(() => {
    if (salonData) {
      setFormData({
        businessName: salonData.businessName || '',
        address: salonData.address || '',
        city: salonData.city || '',
        phone: salonData.phone || '',
        email: salonData.email || '',
        description: salonData.description || '',
        coverImage: salonData.coverImage || ''
      });
    }
  }, [salonData]);

  // Mutation pour sauvegarder
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('PATCH', '/api/salon-settings', data);
      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/salon-settings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: "Paramètres sauvegardés",
        description: "Les informations de votre salon ont été mises à jour avec succès.",
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

  const handleInputChange = (field: string, value: string) => {
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
          <p className="text-gray-600">Chargement des paramètres...</p>
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
                onClick={() => setLocation('/pro-tools')}
                className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Paramètres du Salon</h1>
                <p className="text-gray-600">Modifiez les informations publiques de votre établissement</p>
              </div>
            </div>
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-6 py-2 font-medium transition-all hover:scale-105"
            >
              <Save className="h-4 w-4 mr-2" />
              {saveMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Informations générales */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-violet-600" />
              Informations générales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName">Nom du salon *</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Nom de votre salon"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="contact@salon.com"
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
                placeholder="Décrivez votre salon, vos spécialités, votre équipe..."
                className="mt-1"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact et localisation */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Contact et localisation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="01 23 45 67 89"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Paris"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Adresse complète</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Rue de la Beauté, 75001 Paris"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Image de couverture */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-600" />
              Image de couverture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="coverImage">URL de l'image de couverture</Label>
              <Input
                id="coverImage"
                value={formData.coverImage}
                onChange={(e) => handleInputChange('coverImage', e.target.value)}
                placeholder="https://exemple.com/image-salon.jpg"
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Image utilisée sur votre page de réservation publique
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}