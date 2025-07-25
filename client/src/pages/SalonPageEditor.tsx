import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, X, Eye } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface SalonPageData {
  id: string;
  salonName: string;
  salonDescription: string;
  salonAddress: string;
  salonPhone: string;
  logoUrl?: string;
  coverImageUrl?: string;
  photos: string[];
  primaryColor: string;
  isPublished: boolean;
}

export default function SalonPageEditor() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [pageData, setPageData] = useState<SalonPageData>({
    id: '',
    salonName: '',
    salonDescription: '',
    salonAddress: '',
    salonPhone: '',
    photos: [],
    primaryColor: '#8B5CF6',
    isPublished: false
  });

  // Récupérer les données de la page salon
  const { data: currentPage, isLoading } = useQuery({
    queryKey: ['/api/booking-pages/current'],
    retry: false,
  });

  useEffect(() => {
    if (currentPage && typeof currentPage === 'object') {
      const page = currentPage as any;
      setPageData({
        id: page.id || '',
        salonName: page.salonName || '',
        salonDescription: page.salonDescription || '',
        salonAddress: page.salonAddress || '',
        salonPhone: page.salonPhone || '',
        logoUrl: page.logoUrl,
        coverImageUrl: page.coverImageUrl, 
        photos: page.photos || [],
        primaryColor: page.primaryColor || '#8B5CF6',
        isPublished: page.isPublished || false
      });
    }
  }, [currentPage]);

  // Mutation pour sauvegarder les modifications
  const saveMutation = useMutation({
    mutationFn: async (updatedData: Partial<SalonPageData>) => {
      const response = await apiRequest('PUT', `/api/booking-pages/${pageData.id}`, updatedData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Page salon mise à jour",
        description: "Vos modifications ont été sauvegardées avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/booking-pages/current'] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive"
      });
    }
  });

  const handleSave = () => {
    saveMutation.mutate(pageData);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simuler l'upload de photo
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoUrl = e.target?.result as string;
        setPageData(prev => ({
          ...prev,
          photos: [...prev.photos, photoUrl]
        }));
        toast({
          title: "Photo ajoutée",
          description: "La photo a été ajoutée à votre galerie",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target?.result as string;
        setPageData(prev => ({
          ...prev,
          logoUrl
        }));
        toast({
          title: "Logo mis à jour",
          description: "Votre logo a été mis à jour",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index: number) => {
    setPageData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full"></div>
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
                onClick={() => setLocation('/business-features')}
                className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Éditeur de page salon</h1>
                <p className="text-gray-600">Personnalisez votre page de réservation</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline" 
                onClick={() => window.open(`/booking/${(currentPage as any)?.pageUrl || 'demo'}`, '_blank')}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Aperçu
              </Button>
              <Button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {saveMutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Formulaire d'édition */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="salonName">Nom du salon</Label>
                  <Input
                    id="salonName"
                    value={pageData.salonName}
                    onChange={(e) => setPageData(prev => ({ ...prev, salonName: e.target.value }))}
                    placeholder="Ex: Salon Excellence Paris"
                  />
                </div>
                
                <div>
                  <Label htmlFor="salonDescription">Description</Label>
                  <Textarea
                    id="salonDescription"
                    value={pageData.salonDescription}
                    onChange={(e) => setPageData(prev => ({ ...prev, salonDescription: e.target.value }))}
                    placeholder="Décrivez votre salon, vos spécialités..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="salonAddress">Adresse</Label>
                  <Input
                    id="salonAddress"
                    value={pageData.salonAddress}
                    onChange={(e) => setPageData(prev => ({ ...prev, salonAddress: e.target.value }))}
                    placeholder="Ex: 123 Rue de la Beauté, 75008 Paris"
                  />
                </div>

                <div>
                  <Label htmlFor="salonPhone">Téléphone</Label>
                  <Input
                    id="salonPhone"
                    value={pageData.salonPhone}
                    onChange={(e) => setPageData(prev => ({ ...prev, salonPhone: e.target.value }))}
                    placeholder="Ex: 01 23 45 67 89"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Logo */}
            <Card>
              <CardHeader>
                <CardTitle>Logo du salon</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pageData.logoUrl && (
                    <div className="flex items-center gap-4">
                      <img 
                        src={pageData.logoUrl} 
                        alt="Logo" 
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPageData(prev => ({ ...prev, logoUrl: undefined }))}
                      >
                        Supprimer
                      </Button>
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('logo-upload')?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {pageData.logoUrl ? 'Changer le logo' : 'Ajouter un logo'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Photos */}
            <Card>
              <CardHeader>
                <CardTitle>Photos du salon</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Galerie photos */}
                  {pageData.photos.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {pageData.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={photo} 
                            alt={`Photo ${index + 1}`} 
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removePhoto(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Bouton d'ajout */}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('photo-upload')?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Ajouter une photo ({pageData.photos.length}/6)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Aperçu en temps réel */}
          <div className="lg:sticky lg:top-24">
            <Card>
              <CardHeader>
                <CardTitle>Aperçu de votre page</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg border-2 border-dashed border-gray-200 p-6 space-y-4">
                  {/* Header avec logo */}
                  <div className="flex items-center gap-4">
                    {pageData.logoUrl ? (
                      <img 
                        src={pageData.logoUrl} 
                        alt="Logo" 
                        className="w-12 h-12 object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs">
                        Logo
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: pageData.primaryColor }}>
                        {pageData.salonName || 'Nom du salon'}
                      </h3>
                      <p className="text-sm text-gray-600">{pageData.salonAddress || 'Adresse'}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700">
                    {pageData.salonDescription || 'Description de votre salon...'}
                  </p>

                  {/* Photos */}
                  {pageData.photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {pageData.photos.slice(0, 3).map((photo, index) => (
                        <img 
                          key={index}
                          src={photo} 
                          alt={`Photo ${index + 1}`} 
                          className="w-full h-16 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}

                  {/* Contact */}
                  {pageData.salonPhone && (
                    <p className="text-sm text-gray-600">
                      Téléphone: {pageData.salonPhone}
                    </p>
                  )}

                  <Button 
                    className="w-full" 
                    style={{ backgroundColor: pageData.primaryColor }}
                  >
                    Réserver en ligne
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}