import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getGenericGlassButton } from '@/lib/salonColors';
// Pas d'importation d'icônes selon les préférences utilisateur

export default function EditSalon() {
  const [, setLocation] = useLocation();
  const [salon, setSalon] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Récupérer l'ID du salon depuis l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const salonId = urlParams.get('salonId');
  const isSuccess = urlParams.get('success') === 'true';

  useEffect(() => {
    if (salonId) {
      fetchSalon();
    }
    if (isSuccess) {
      toast({
        title: "Paiement réussi !",
        description: "Votre abonnement est actif. Personnalisez maintenant votre salon.",
      });
    }
  }, [salonId, isSuccess]);

  const fetchSalon = async () => {
    try {
      const response = await fetch(`/api/salon/${salonId}`);
      if (response.ok) {
        const data = await response.json();
        setSalon(data.salon);
      } else {
        toast({
          title: "Erreur",
          description: "Salon non trouvé",
          variant: "destructive"
        });
        setLocation('/subscription-plans');
      }
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Impossible de charger les données du salon",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/salon/${salonId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(salon),
      });

      if (response.ok) {
        toast({
          title: "Salon mis à jour",
          description: "Vos modifications ont été sauvegardées",
        });
      } else {
        throw new Error('Erreur de sauvegarde');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateSalon = (field: string, value: any) => {
    setSalon((prev: any) => ({ ...prev, [field]: value }));
  };

  const addService = () => {
    const newService = {
      id: Date.now(),
      name: "Nouveau service",
      price: 50,
      duration: 60,
      description: "Description du service"
    };
    updateSalon('services', [...salon.services, newService]);
  };

  const updateService = (serviceId: number, field: string, value: any) => {
    const updatedServices = salon.services.map((service: any) =>
      service.id === serviceId ? { ...service, [field]: value } : service
    );
    updateSalon('services', updatedServices);
  };

  const removeService = (serviceId: number) => {
    const updatedServices = salon.services.filter((service: any) => service.id !== serviceId);
    updateSalon('services', updatedServices);
  };

  const addTag = (newTag: string) => {
    if (newTag && !salon.tags.includes(newTag)) {
      updateSalon('tags', [...salon.tags, newTag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateSalon('tags', salon.tags.filter((tag: string) => tag !== tagToRemove));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre salon...</p>
        </div>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Salon non trouvé</p>
          <Button onClick={() => setLocation('/subscription-plans')} className="mt-4">
            Retour aux plans
          </Button>
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
                onClick={() => setLocation('/business-features')}
                className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
              >
                ←
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Personnalisation du salon</h1>
                <p className="text-gray-600">Modifiez les informations de votre salon</p>
              </div>
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className={getGenericGlassButton(0)}
            >
              {isSaving ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Informations générales */}
        <Card>
          <CardHeader>
            <CardTitle>
              Informations générales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom du salon</Label>
                <Input
                  value={salon.name}
                  onChange={(e) => updateSalon('name', e.target.value)}
                  placeholder="Nom de votre salon"
                />
              </div>
              <div className="space-y-2">
                <Label>Plan d'abonnement</Label>
                <Badge variant="outline" className="w-fit">
                  {salon.subscriptionPlan === 'pro' ? 'Pro (49€/mois)' : 'Premium (149€/mois)'}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={salon.description}
                onChange={(e) => updateSalon('description', e.target.value)}
                placeholder="Décrivez votre salon..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Adresse</Label>
                <Input
                  value={salon.address}
                  onChange={(e) => updateSalon('address', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input
                  value={salon.phone}
                  onChange={(e) => updateSalon('phone', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={salon.email}
                  onChange={(e) => updateSalon('email', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Site web</Label>
                <Input
                  value={salon.website}
                  onChange={(e) => updateSalon('website', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Services proposés</CardTitle>
              <Button onClick={addService} size="sm" variant="outline">
                Ajouter un service
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salon.services.map((service: any) => (
                <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="space-y-2">
                      <Label>Nom du service</Label>
                      <Input
                        value={service.name}
                        onChange={(e) => updateService(service.id, 'name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Prix (€)</Label>
                      <Input
                        type="number"
                        value={service.price}
                        onChange={(e) => updateService(service.id, 'price', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Durée (min)</Label>
                      <Input
                        type="number"
                        value={service.duration}
                        onChange={(e) => updateService(service.id, 'duration', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <div className="flex gap-2">
                      <Textarea
                        value={service.description}
                        onChange={(e) => updateService(service.id, 'description', e.target.value)}
                        rows={2}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => removeService(service.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags et spécialités</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {salon.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-gray-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter un tag (ex: moderne, accessible...)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addTag(input.value);
                    input.value = '';
                  }}
                >
                  Ajouter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setLocation('/business-features')}>
            Retour aux Pro Tools
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className={getGenericGlassButton(1)}
          >
            {isSaving ? "Sauvegarde..." : "Sauvegarder les modifications"}
          </Button>
        </div>
      </div>
    </div>
  );
}