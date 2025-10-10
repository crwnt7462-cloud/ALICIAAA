import { broadcastServiceMutation } from '@/lib/broadcastServiceMutation';
import React, { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Scissors, Edit, Save, X, Clock, Euro } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { ProHeader } from '@/components/ProHeader';
import { formatDuration } from '@/lib/utils';

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  description?: string;
  requiresDeposit: boolean;
  depositPercentage: number;
  photos: string[];
}

interface NewService {
  name: string;
  price: number;
  duration: number;
  description: string;
  requiresDeposit: boolean;
  depositPercentage: number;
  photos: string[];
}


export default function ServicesManagement() {

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Helper d'écriture local avec sécurité renforcée
  const postUpdateSalon = useCallback(async (payload: unknown) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    try {
      const res = await fetch('/api/salon/update', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Cache-Control': 'no-store'
        },
        credentials: 'include',
        referrerPolicy: 'same-origin',
        signal: controller.signal,
        body: JSON.stringify(payload),
      });
      
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error || res.statusText || 'Erreur de mise à jour');
      }
      
      return await res.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Délai d\'attente dépassé');
      }
      throw error;
    }
  }, []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  // États séparés pour l'édition
  const [editingServiceHours, setEditingServiceHours] = useState(1);
  const [editingServiceMinutes, setEditingServiceMinutes] = useState(0);
  // SalonId uniquement utilisé pour broadcast (legacy)
  const salonId = "e334ec3b-9200-48d4-a9fa-cc044ade2c03"; // ID du salon de test
  const [newService, setNewService] = useState<NewService>({
    name: '',
    price: 0,
    duration: 60,
    description: '',
    requiresDeposit: false,
    depositPercentage: 30,
    photos: []
  });
  // États séparés pour les heures et minutes
  const [newServiceHours, setNewServiceHours] = useState(1);
  const [newServiceMinutes, setNewServiceMinutes] = useState(0);

  // Validation et sanitisation des URLs
  const validateAndSanitizeUrls = useCallback((urls: string[]): string[] => {
    return urls
      .map(url => url.trim())
      .filter(url => {
        try {
          const parsedUrl = new URL(url);
          return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
        } catch {
          return false;
        }
      })
      .slice(0, 10); // Limite à 10 photos max
  }, []);

  // Handlers pour les inputs photos avec validation
  const handlePhotoInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    const urls = value ? value.split(',').map(url => url.trim()) : [];
    const sanitizedUrls = validateAndSanitizeUrls(urls);
    setNewService(prev => ({ ...prev, photos: sanitizedUrls }));
  }, [validateAndSanitizeUrls]);

  const handleEditPhotoInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    const urls = value ? value.split(',').map(url => url.trim()) : [];
    const sanitizedUrls = validateAndSanitizeUrls(urls);
    setEditingService(prev => prev ? { ...prev, photos: sanitizedUrls } : null);
  }, [validateAndSanitizeUrls]);

  // Validation des données de service
  const validateServiceData = useCallback((service: Partial<Service | NewService>): string[] => {
    const errors: string[] = [];
    
    if (!service.name || service.name.trim().length < 2) {
      errors.push('Le nom du service doit contenir au moins 2 caractères');
    }
    
    if (service.name && service.name.length > 100) {
      errors.push('Le nom du service ne peut pas dépasser 100 caractères');
    }
    
    if (typeof service.price !== 'number' || service.price < 0 || service.price > 10000) {
      errors.push('Le prix doit être entre 0 et 10000€');
    }
    
    if (typeof service.duration !== 'number' || service.duration < 15 || service.duration > 480) {
      errors.push('La durée doit être entre 15 minutes et 8 heures');
    }
    
    if (service.description && service.description.length > 500) {
      errors.push('La description ne peut pas dépasser 500 caractères');
    }
    
    if (typeof service.depositPercentage === 'number' && (service.depositPercentage < 0 || service.depositPercentage > 100)) {
      errors.push('Le pourcentage d\'acompte doit être entre 0 et 100%');
    }
    
    return errors;
  }, []);

  // Mutation pour supprimer un service avec sécurité
  const deleteServiceMutation = useMutation({
    mutationFn: async (serviceId: number) => {
      if (!Number.isInteger(serviceId) || serviceId <= 0) {
        throw new Error('ID de service invalide');
      }
      
      const services = servicesData?.data ?? [];
      const updated = services.filter((s: Service) => s.id !== serviceId);
      
      if (updated.length === services.length) {
        throw new Error('Service non trouvé');
      }
      
      return postUpdateSalon({ services: updated });
    },
    onSuccess: (_data, serviceId) => {
      queryClient.invalidateQueries({ queryKey: ['my-salon'] });
      broadcastServiceMutation(salonId, serviceId, 'delete');
      toast({
        title: 'Service supprimé',
        description: 'Le service a été supprimé avec succès.'
      });
      console.debug('[services] mutation success', { type: 'delete', salonId, serviceId });
    },
    onError: (error: any) => {
      const msg = error?.message || 'Impossible de supprimer le service.';
      toast({
        title: 'Erreur',
        description: msg,
        variant: 'default'
      });
      console.error('[ServicesManagement] error', error);
    }
  });

  // Récupération des services avec sécurité renforcée
  const { data: servicesData, isLoading: isLoadingServices } = useQuery({
    queryKey: ['my-salon'],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      try {
        const res = await fetch('/api/salon/my-salon', { 
          credentials: 'include',
          cache: 'no-store',
          referrerPolicy: 'same-origin',
          signal: controller.signal,
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) {
          throw new Error(`Erreur ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        
        // Validation des données reçues
        if (!Array.isArray(data.services)) {
          throw new Error('Format de données invalide');
        }
        
        return { ok: true, data: data.services };
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Délai d\'attente dépassé');
        }
        throw error;
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Services simulés si aucune donnée n'est disponible
  const simulatedServices: Service[] = [
    {
      id: 1,
      name: "Coupe + Brushing",
      price: 45,
      duration: 90,
      description: "Coupe personnalisée selon votre style et brushing professionnel",
      requiresDeposit: true,
      depositPercentage: 30,
      photos: []
    },
    {
      id: 2,
      name: "Coloration complète",
      price: 85,
      duration: 180,
      description: "Coloration complète avec soins restructurants inclus",
      requiresDeposit: true,
      depositPercentage: 50,
      photos: []
    },
    {
      id: 3,
      name: "Mèches + Balayage",
      price: 120,
      duration: 210,
      description: "Technique moderne de mèches avec balayage naturel",
      requiresDeposit: true,
      depositPercentage: 40,
      photos: []
    },
    {
      id: 4,
      name: "Soin Keratine",
      price: 65,
      duration: 120,
      description: "Traitement intensif à la kératine pour cheveux abîmés",
      requiresDeposit: false,
      depositPercentage: 30,
      photos: []
    },
    {
      id: 5,
      name: "Coupe Homme",
      price: 25,
      duration: 45,
      description: "Coupe moderne avec finition à la tondeuse",
      requiresDeposit: false,
      depositPercentage: 30,
      photos: []
    }
  ];

  // Services depuis la nouvelle API
  const services: Service[] = Array.isArray(servicesData?.data) 
    ? servicesData.data 
    : [];

  // Mutation pour créer un service (nouvelle méthode)
  const createServiceMutation = useMutation<
    void,
    any,
    NewService
  >({
    mutationFn: async (service) => {
      const services = servicesData?.data ?? [];
      const newItem = { 
        ...service, 
        id: Date.now() + Math.random() // Génération simple d'ID temporaire
      };
      const updated = [...services, newItem];
      console.debug('[ServicesManagement] write via /api/salon/update', {len: updated.length});
      return postUpdateSalon({ services: updated });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-salon'] });
      setNewService({ name: '', price: 0, duration: 60, description: '', requiresDeposit: false, depositPercentage: 30, photos: [] });
      setNewServiceHours(1);
      setNewServiceMinutes(0);
      setShowAddForm(false);
      broadcastServiceMutation(salonId, undefined, 'create');
      toast({
        title: "Service ajouté",
        description: "Le service a été ajouté avec succès"
      });
      console.debug('[services] mutation success', { type: 'create', salonId });
    },
    onError: (err: any) => {
      const msg = err?.error || err?.message || "Impossible d'ajouter le service";
      toast({
        title: "Erreur",
        description: msg,
        variant: "destructive"
      });
      console.error('[services] mutation error', err);
    }
  });

  // Mutation pour modifier un service (nouvelle méthode)
  const updateServiceMutation = useMutation<
    void,
    any,
    Service
  >({
    mutationFn: async (service) => {
      const services = servicesData?.data ?? [];
      const updated = services.map((s: any) => s.id === service.id ? { ...s, ...service } : s);
      console.debug('[ServicesManagement] write via /api/salon/update', {len: updated.length});
      return postUpdateSalon({ services: updated });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-salon'] });
      setEditingService(null);
      broadcastServiceMutation(salonId, editingService?.id, 'update');
      toast({
        title: "Service modifié",
        description: "Les informations ont été mises à jour"
      });
      console.debug('[services] mutation success', { type: 'update', salonId, serviceId: editingService?.id });
    },
    onError: (err: any) => {
      const msg = err?.message || "Impossible de modifier le service";
      toast({ title: "Erreur", description: msg, variant: "destructive" });
      console.error('[ServicesManagement] error', err);
    }
  });

  const handleSubmit = useCallback(async () => {
    const totalDuration = newServiceHours * 60 + newServiceMinutes;
    const serviceToCreate = { ...newService, duration: totalDuration };
    
    // Validation complète des données
    const validationErrors = validateServiceData(serviceToCreate);
    
    if (validationErrors.length > 0) {
      toast({
        title: "Données invalides",
        description: validationErrors.join(', '),
        variant: "destructive"
      });
      return;
    }
    
    try {
      await createServiceMutation.mutateAsync(serviceToCreate);
    } catch (error) {
      // Géré dans onError de la mutation
    }
  }, [newService, newServiceHours, newServiceMinutes, validateServiceData, createServiceMutation, toast]);

  const handleUpdate = useCallback(() => {
    if (!editingService) return;
    
    const totalDuration = editingServiceHours * 60 + editingServiceMinutes;
    const serviceToUpdate = { ...editingService, duration: totalDuration };
    
    // Validation des données avant mise à jour
    const validationErrors = validateServiceData(serviceToUpdate);
    
    if (validationErrors.length > 0) {
      toast({
        title: "Données invalides",
        description: validationErrors.join(', '),
        variant: "destructive"
      });
      return;
    }
    
    updateServiceMutation.mutate(serviceToUpdate);
  }, [editingService, editingServiceHours, editingServiceMinutes, validateServiceData, updateServiceMutation, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 relative">
      {/* Navigation */}
      <ProHeader currentPage="services" />
      <MobileBottomNav />
      
      {/* Contenu principal avec marge pour header fixe */}
      <div className="pt-20 md:pt-24 pb-20 md:pb-8">
        <div className="min-h-screen bg-transparent py-4 sm:py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestion des services</h1>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">Créez et gérez vos services personnalisés</p>
              </div>
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-violet-600 hover:bg-violet-700 text-white w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau service
              </Button>
            </div>

            {/* Formulaire d'ajout */}
            {showAddForm && (
              <Card className="mb-4 sm:mb-6">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Prix du service</label>
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
                  <p className="text-xs text-gray-500">Prix en euros (ex: 45€)</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Durée du service</label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Select 
                        value={newServiceHours.toString()} 
                        onValueChange={(value) => setNewServiceHours(parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Heures" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({length: 8}, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>{i}h</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <Select 
                        value={newServiceMinutes.toString()} 
                        onValueChange={(value) => setNewServiceMinutes(parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Minutes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0 min</SelectItem>
                          <SelectItem value="15">15 min</SelectItem>
                          <SelectItem value="30">30 min</SelectItem>
                          <SelectItem value="45">45 min</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Durée totale: {newServiceHours}h{newServiceMinutes > 0 ? ` ${newServiceMinutes}min` : ''} ({newServiceHours * 60 + newServiceMinutes} minutes)
                  </p>
                </div>
              </div>
              
              <Textarea
                placeholder="Description du service (optionnel)"
                value={newService.description}
                onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
                          <Input
                            placeholder="URLs des photos (séparées par des virgules)"
                            value={newService.photos.join(', ')}
                            onChange={handlePhotoInput}
                            className="mt-2"
                          />
                          <p className="text-xs text-gray-500">Collez une ou plusieurs URLs d’images, séparées par des virgules.</p>

              {/* Configuration Acompte */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="requiresDeposit"
                    checked={newService.requiresDeposit}
                    onCheckedChange={(checked) => setNewService(prev => ({ ...prev, requiresDeposit: !!checked }))}
                  />
                  <label htmlFor="requiresDeposit" className="text-sm font-medium">
                    Demander un acompte à la réservation
                  </label>
                </div>
                
                {newService.requiresDeposit && (
                  <div className="ml-6">
                    <label className="text-sm text-gray-600 mb-2 block">
                      Pourcentage d'acompte
                    </label>
                    <Select 
                      value={newService.depositPercentage.toString()} 
                      onValueChange={(value) => setNewService(prev => ({ ...prev, depositPercentage: parseInt(value) }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20">20% - Léger acompte</SelectItem>
                        <SelectItem value="30">30% - Standard</SelectItem>
                        <SelectItem value="40">40% - Sécurisé</SelectItem>
                        <SelectItem value="50">50% - Moitié du prix</SelectItem>
                        <SelectItem value="100">100% - Paiement intégral</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Acompte: <span className="font-medium">{(newService.price * (newService.depositPercentage / 100)).toFixed(2)}€</span> pour ce service
                    </p>
                  </div>
                )}
              </div>

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
            <div className="grid gap-3 sm:gap-4">
              {isLoadingServices ? (
                <div className="text-center py-6 sm:py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-sm sm:text-base">Chargement des services...</p>
                </div>
              ) : services.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-6 sm:py-8">
                    <Scissors className="h-10 sm:h-12 w-10 sm:w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Aucun service</h3>
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">Commencez par créer vos premiers services</p>
                    <Button 
                      onClick={() => setShowAddForm(true)}
                      className="bg-violet-600 hover:bg-violet-700 text-white w-full sm:w-auto"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Créer le premier service
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                services.map((service) => (
                  <Card key={service.id}>
                    <CardContent className="p-4 sm:p-6">
                  {editingService?.id === service.id ? (
                    // Mode édition
                    <div className="space-y-4">
                      <Input
                        value={editingService.name}
                        onChange={(e) => setEditingService(prev => prev ? { ...prev, name: e.target.value } : null)}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Prix du service</label>
                          <div className="relative">
                            <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              type="number"
                              value={editingService.price || ''}
                              onChange={(e) => setEditingService(prev => prev ? { ...prev, price: parseFloat(e.target.value) || 0 } : null)}
                              className="pl-10"
                            />
                          </div>
                          <p className="text-xs text-gray-500">Prix en euros</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Durée du service</label>
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <Select 
                                value={editingServiceHours.toString()} 
                                onValueChange={(value) => setEditingServiceHours(parseInt(value))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Heures" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({length: 8}, (_, i) => (
                                    <SelectItem key={i} value={i.toString()}>{i}h</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex-1">
                              <Select 
                                value={editingServiceMinutes.toString()} 
                                onValueChange={(value) => setEditingServiceMinutes(parseInt(value))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Minutes" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="0">0 min</SelectItem>
                                  <SelectItem value="15">15 min</SelectItem>
                                  <SelectItem value="30">30 min</SelectItem>
                                  <SelectItem value="45">45 min</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">
                            Durée totale: {editingServiceHours}h{editingServiceMinutes > 0 ? ` ${editingServiceMinutes}min` : ''} ({editingServiceHours * 60 + editingServiceMinutes} minutes)
                          </p>
                        </div>
                      </div>
                      
                      <Textarea
                        value={editingService.description || ''}
                        onChange={(e) => setEditingService(prev => prev ? { ...prev, description: e.target.value } : null)}
                        rows={2}
                        placeholder="Description"
                      />
                                          <Input
                                            placeholder="URLs des photos (séparées par des virgules)"
                                            value={editingService.photos?.join(', ') || ''}
                                            onChange={handleEditPhotoInput}
                                            className="mt-2"
                                          />
                                          <p className="text-xs text-gray-500">Collez une ou plusieurs URLs d’images, séparées par des virgules.</p>

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
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="flex-1">
                          {/* Affichage des photos (carousel simple ou thumbnails) */}
                          {service.photos && service.photos.length > 0 && (
                            <div className="flex gap-2 mb-2 overflow-x-auto">
                              {service.photos.map((url, idx) => (
                                <img
                                  key={idx}
                                  src={url}
                                  alt={service.name + ' photo ' + (idx + 1)}
                                  className="w-16 h-16 object-cover rounded border"
                                  style={{ minWidth: 64, minHeight: 64 }}
                                />
                              ))}
                            </div>
                          )}
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                            {service.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3">
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                              <Euro className="h-3 w-3 mr-1" />
                              {service.price}€
                            </Badge>
                            {service.duration > 0 && (
                              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDuration(service.duration)}
                              </Badge>
                            )}
                          </div>
                          {service.description && (
                            <p className="text-gray-600 text-sm">
                              {service.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 sm:ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingService(service);
                              // Convertir la durée en heures et minutes
                              const hours = Math.floor(service.duration / 60);
                              const minutes = service.duration % 60;
                              setEditingServiceHours(hours);
                              setEditingServiceMinutes(minutes);
                            }}
                            className="w-full sm:w-auto"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={deleteServiceMutation.isPending}
                            onClick={() => deleteServiceMutation.mutate(service.id)}
                            className="w-full sm:w-auto text-red-600 border-red-300 hover:bg-red-50"
                          >
                            {deleteServiceMutation.isPending ? 'Suppression...' : 'Supprimer'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                ))
              )}
            </div>

            <div className="mt-6 sm:mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">💡 Étape suivante</h4>
              <p className="text-blue-800 text-sm">
                Une fois vos services créés, allez dans "Gestion de l'équipe" pour assigner chaque professionnel aux services qu'il/elle maîtrise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}