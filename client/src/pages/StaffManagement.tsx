import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Plus, Users, Edit, Trash2, Save, X } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
}

interface StaffMember {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  specialties?: string;
  serviceIds?: string[];
  isActive: boolean;
}

interface NewStaffMember {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceIds: string[];
}

export default function StaffManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  
  const salonId = "salon-cacacaxaaxax-1754092428868-vr7b3j"; // TODO: récupérer dynamiquement
  
  const [newStaff, setNewStaff] = useState<NewStaffMember>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    serviceIds: []
  });

  // Récupération des services
  const { data: servicesData } = useQuery({
    queryKey: [`/api/salon/${salonId}/services`]
  });

  // Récupération de l'équipe
  const { data: staffData, isLoading: isLoadingStaff } = useQuery({
    queryKey: [`/api/salon/${salonId}/staff`]
  });

  const services: Service[] = (servicesData as any)?.services || [];
  const staffMembers: StaffMember[] = (staffData as any)?.staff || [];

  // Mutation pour créer un professionnel
  const createStaffMutation = useMutation({
    mutationFn: async (staff: NewStaffMember) => {
      return apiRequest('POST', `/api/salon/${salonId}/staff`, staff);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/salon/${salonId}/staff`] });
      setNewStaff({ firstName: '', lastName: '', email: '', phone: '', serviceIds: [] });
      setShowAddForm(false);
      toast({
        title: "Professionnel ajouté",
        description: "Le professionnel a été ajouté avec succès"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le professionnel",
        variant: "destructive"
      });
    }
  });

  // Mutation pour modifier un professionnel
  const updateStaffMutation = useMutation({
    mutationFn: async (staff: StaffMember) => {
      return apiRequest('PUT', `/api/salon/${salonId}/staff/${staff.id}`, staff);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/salon/${salonId}/staff`] });
      setEditingStaff(null);
      toast({
        title: "Professionnel modifié",
        description: "Les informations ont été mises à jour"
      });
    }
  });

  const handleServiceToggle = (serviceId: string, checked: boolean, isEditing: boolean = false) => {
    if (isEditing && editingStaff) {
      const currentServiceIds = editingStaff.serviceIds || [];
      setEditingStaff({
        ...editingStaff,
        serviceIds: checked 
          ? [...currentServiceIds, serviceId]
          : currentServiceIds.filter(id => id !== serviceId)
      });
    } else {
      setNewStaff(prev => ({
        ...prev,
        serviceIds: checked 
          ? [...prev.serviceIds, serviceId]
          : prev.serviceIds.filter(id => id !== serviceId)
      }));
    }
  };

  const handleSubmit = () => {
    if (!newStaff.firstName || !newStaff.lastName) {
      toast({
        title: "Informations manquantes",
        description: "Le prénom et nom sont obligatoires",
        variant: "destructive"
      });
      return;
    }

    createStaffMutation.mutate(newStaff);
  };

  const handleUpdate = () => {
    if (editingStaff) {
      updateStaffMutation.mutate(editingStaff);
    }
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id.toString() === serviceId);
    return service?.name || `Service ${serviceId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion de l'équipe</h1>
            <p className="text-gray-600 mt-2">Gérez votre équipe et assignez les services</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un professionnel
          </Button>
        </div>

        {/* Formulaire d'ajout */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Nouveau professionnel
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
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Prénom"
                  value={newStaff.firstName}
                  onChange={(e) => setNewStaff(prev => ({ ...prev, firstName: e.target.value }))}
                />
                <Input
                  placeholder="Nom"
                  value={newStaff.lastName}
                  onChange={(e) => setNewStaff(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Email"
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff(prev => ({ ...prev, email: e.target.value }))}
                />
                <Input
                  placeholder="Téléphone"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Services que ce professionnel peut effectuer :</h4>
                <div className="grid grid-cols-2 gap-2">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`service-${service.id}`}
                        checked={newStaff.serviceIds.includes(service.id.toString())}
                        onCheckedChange={(checked) => handleServiceToggle(service.id.toString(), !!checked)}
                      />
                      <label htmlFor={`service-${service.id}`} className="text-sm">
                        {service.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleSubmit}
                  disabled={createStaffMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
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

        {/* Liste de l'équipe */}
        <div className="grid gap-4">
          {isLoadingStaff ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p>Chargement de l'équipe...</p>
            </div>
          ) : staffMembers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun professionnel</h3>
                <p className="text-gray-600 mb-4">Commencez par ajouter des professionnels à votre équipe</p>
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter le premier professionnel
                </Button>
              </CardContent>
            </Card>
          ) : (
            staffMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-6">
                  {editingStaff?.id === member.id ? (
                    // Mode édition
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          value={editingStaff.firstName}
                          onChange={(e) => setEditingStaff(prev => prev ? { ...prev, firstName: e.target.value } : null)}
                        />
                        <Input
                          value={editingStaff.lastName}
                          onChange={(e) => setEditingStaff(prev => prev ? { ...prev, lastName: e.target.value } : null)}
                        />
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Services :</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {services.map((service) => (
                            <div key={service.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`edit-service-${service.id}`}
                                checked={(editingStaff.serviceIds || []).includes(service.id.toString())}
                                onCheckedChange={(checked) => handleServiceToggle(service.id.toString(), !!checked, true)}
                              />
                              <label htmlFor={`edit-service-${service.id}`} className="text-sm">
                                {service.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          onClick={handleUpdate}
                          disabled={updateStaffMutation.isPending}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Sauvegarder
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingStaff(null)}
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Mode affichage
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {member.firstName} {member.lastName}
                        </h3>
                        {member.email && (
                          <p className="text-sm text-gray-600">{member.email}</p>
                        )}
                        {member.phone && (
                          <p className="text-sm text-gray-600">{member.phone}</p>
                        )}
                        
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Services :</p>
                          <div className="flex flex-wrap gap-1">
                            {(member.serviceIds || []).length === 0 ? (
                              <Badge variant="outline" className="text-gray-500">
                                Aucun service assigné
                              </Badge>
                            ) : (
                              member.serviceIds?.map((serviceId) => (
                                <Badge 
                                  key={serviceId} 
                                  className="bg-purple-100 text-purple-800 hover:bg-purple-200"
                                >
                                  {getServiceName(serviceId)}
                                </Badge>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingStaff(member)}
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
      </div>
    </div>
  );
}