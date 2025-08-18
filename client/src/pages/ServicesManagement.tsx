import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Scissors, Edit, Trash2, Save, X, Clock, Euro } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import ProBottomNavigation from '@/components/ProBottomNavigation';

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  description?: string;
}

interface NewService {
  name: string;
  price: number;
  duration: number;
  description: string;
}

export default function ServicesManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  const salonId = "salon-cacacaxaaxax-1754092428868-vr7b3j"; // TODO: récupérer dynamiquement
  
  const [newService, setNewService] = useState<NewService>({
    name: '',
    price: 0,
    duration: 60,
    description: ''
  });

  // Récupération des services
  const { data: servicesData, isLoading: isLoadingServices } = useQuery({
    queryKey: [`/api/salon/${salonId}/services`]
  });

  const services: Service[] = (servicesData as any)?.services || [];

  // Mutation pour créer un service
  const createServiceMutation = useMutation({
    mutationFn: async (service: NewService) => {
      return apiRequest('POST', `/api/salon/${salonId}/services`, service);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/salon/${salonId}/services`] });
      setNewService({ name: '', price: 0, duration: 60, description: '' });
      setShowAddForm(false);
      toast({
        title: "Service ajouté",
        description: "Le service a été ajouté avec succès"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le service",
        variant: "destructive"
      });
    }
  });

  // Mutation pour modifier un service
  const updateServiceMutation = useMutation({
    mutationFn: async (service: Service) => {
      return apiRequest('PUT', `/api/salon/${salonId}/services/${service.id}`, service);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/salon/${salonId}/services`] });
      setEditingService(null);
      toast({
        title: "Service modifié",
        description: "Les informations ont été mises à jour"
      });
    }
  });

  const handleSubmit = () => {
    if (!newService.name || newService.price <= 0) {
      toast({
        title: "Informations manquantes",
        description: "Le nom et prix sont obligatoires",
        variant: "destructive"
      });
      return;
    }

    createServiceMutation.mutate(newService);
  };

  const handleUpdate = () => {
    if (editingService) {
      updateServiceMutation.mutate(editingService);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-20 lg:pb-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des services</h1>
            <p className="text-gray-600 mt-2">Créez et gérez vos services personnalisés</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau service
          </Button>
        </div>

        {/* Formulaire d'ajout */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Nouveau service
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Nom du service (ex: Coupe + Brushing)"
                value={newService.name}
                onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    placeholder="Prix"
                    value={newService.price || ''}
                    onChange={(e) => setNewService(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    placeholder="Durée (min)"
                    value={newService.duration || ''}
                    onChange={(e) => setNewService(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Textarea
                placeholder="Description du service (optionnel)"
                value={newService.description}
                onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />

              <div className="flex gap-2">
                <Button 
                  onClick={handleSubmit}
                  disabled={createServiceMutation.isPending}
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Liste des services */}
        <div className="grid gap-4">
          {isLoadingServices ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p>Chargement des services...</p>
            </div>
          ) : services.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Scissors className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun service</h3>
                <p className="text-gray-600 mb-4">Commencez par créer vos premiers services</p>
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer le premier service
                </Button>
              </CardContent>
            </Card>
          ) : (
            services.map((service) => (
              <Card key={service.id}>
                <CardContent className="p-6">
                  {editingService?.id === service.id ? (
                    // Mode édition
                    <div className="space-y-4">
                      <Input
                        value={editingService.name}
                        onChange={(e) => setEditingService(prev => prev ? { ...prev, name: e.target.value } : null)}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type="number"
                            value={editingService.price || ''}
                            onChange={(e) => setEditingService(prev => prev ? { ...prev, price: parseFloat(e.target.value) || 0 } : null)}
                            className="pl-10"
                          />
                        </div>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type="number"
                            value={editingService.duration || ''}
                            onChange={(e) => setEditingService(prev => prev ? { ...prev, duration: parseInt(e.target.value) || 60 } : null)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <Textarea
                        value={editingService.description || ''}
                        onChange={(e) => setEditingService(prev => prev ? { ...prev, description: e.target.value } : null)}
                        rows={2}
                        placeholder="Description"
                      />

                      <div className="flex gap-2">
                        <Button 
                          onClick={handleUpdate}
                          disabled={updateServiceMutation.isPending}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Sauvegarder
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingService(null)}
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Mode affichage
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {service.name}
                        </h3>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                            <Euro className="h-3 w-3 mr-1" />
                            {service.price}€
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                            <Clock className="h-3 w-3 mr-1" />
                            {service.duration} min
                          </Badge>
                        </div>
                        
                        {service.description && (
                          <p className="text-gray-600 text-sm">
                            {service.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingService(service)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="mt-8 p-4 bg-violet-50 rounded-lg">
          <h4 className="font-medium text-violet-900 mb-2">💡 Étape suivante</h4>
          <p className="text-violet-800 text-sm">
            Une fois vos services créés, allez dans "Gestion de l'équipe" pour assigner chaque professionnel aux services qu'il/elle maîtrise.
          </p>
        </div>
      </div>
      <ProBottomNavigation />
    </div>
  );
}