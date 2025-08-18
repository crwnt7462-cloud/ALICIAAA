import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Plus, Users, Edit, Save, X } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import avyentoLogo from '@assets/Avyento transparent_1755515838937.png';

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
  jobTitle?: string;
  calendarColor?: string;
  email?: string;
  phone?: string;
  birthday?: string;
  photoUrl?: string;
  specialties?: string;
  serviceIds?: string[];
  isActive: boolean;
}

interface NewStaffMember {
  firstName: string;
  lastName: string;
  jobTitle: string;
  calendarColor: string;
  email: string;
  phone: string;
  birthday: string;
  photoUrl: string;
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
    jobTitle: '',
    calendarColor: '#8b5cf6',
    email: '',
    phone: '',
    birthday: '',
    photoUrl: '',
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
      setNewStaff({ firstName: '', lastName: '', jobTitle: '', calendarColor: '#8b5cf6', email: '', phone: '', birthday: '', photoUrl: '', serviceIds: [] });
      setShowAddForm(false);
      toast({
        title: "Professionnel ajouté",
        description: "Le professionnel a été ajouté avec succès"
      });
    },
    onError: () => {
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
    <div className="min-h-screen bg-gray-50 relative">
      <MobileBottomNav userType="pro" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 xl:px-12 py-4 md:py-6 lg:py-8 pb-20 lg:pb-8">
        {/* Header avec logo Avyento - Desktop optimisé */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 mb-6 lg:mb-10">
          <div className="flex items-center space-x-6">
            <img 
              src={avyentoLogo} 
              alt="Avyento" 
              className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20"
            />
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">Gestion de l'équipe</h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base lg:text-lg">Gérez votre équipe et assignez les services</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-2" />
              {staffMembers.length} membre{staffMembers.length > 1 ? 's' : ''} d'équipe
            </div>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white w-full lg:w-auto lg:px-6 lg:py-3"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Ajouter un professionnel</span>
              <span className="sm:hidden">Ajouter</span>
            </Button>
          </div>
        </div>

        {/* Formulaire d'ajout - Style Fresha Desktop Responsive */}
        {showAddForm && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8 mb-8 lg:mb-10">
            {/* Sidebar Navigation - Responsive */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <Card className="rounded-3xl shadow-lg border-0 bg-white/90 backdrop-blur-md lg:sticky lg:top-6">
                <CardContent className="p-4 lg:p-6">
                  <h3 className="font-semibold text-base lg:text-lg mb-3 lg:mb-4">Sections</h3>
                  <div className="flex lg:flex-col gap-2 lg:space-y-2">
                    <div className="p-2 lg:p-3 bg-purple-50 rounded-xl border-l-4 border-purple-500 flex-1 lg:flex-none">
                      <div className="font-medium text-purple-900 text-sm lg:text-base">Personnel</div>
                      <div className="text-xs lg:text-sm text-purple-600 hidden lg:block">Profil de base</div>
                    </div>
                    <div className="p-2 lg:p-3 rounded-xl hover:bg-gray-50 cursor-pointer flex-1 lg:flex-none">
                      <div className="font-medium text-sm lg:text-base">Contact</div>
                      <div className="text-xs lg:text-sm text-gray-500 hidden lg:block">Email et téléphone</div>
                    </div>
                    <div className="p-2 lg:p-3 rounded-xl hover:bg-gray-50 cursor-pointer flex-1 lg:flex-none">
                      <div className="font-medium text-sm lg:text-base">Services</div>
                      <div className="text-xs lg:text-sm text-gray-500 hidden lg:block">Compétences</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Form - Responsive */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <Card className="rounded-3xl shadow-lg border-0 bg-white/90 backdrop-blur-md">
                <CardHeader className="pb-4 lg:pb-6">
                  <CardTitle className="flex items-center justify-between text-xl lg:text-2xl">
                    <div>Nouveau professionnel</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddForm(false)}
                      className="hover:bg-gray-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                  <p className="text-gray-600 text-sm lg:text-base">Gérer le profil personnel des membres de votre équipe</p>
                </CardHeader>
                
                <CardContent className="space-y-6 lg:space-y-8 p-4 lg:p-6">
                  {/* Section Profil avec photo - Responsive */}
                  <div className="space-y-4 lg:space-y-6">
                    <div className="text-center">
                      <div className="relative inline-block">
                        <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-200 rounded-full flex items-center justify-center text-2xl lg:text-3xl font-bold text-gray-400 overflow-hidden">
                          {newStaff.photoUrl ? (
                            <img src={newStaff.photoUrl} alt="Profil" className="w-full h-full object-cover" />
                          ) : (
                            newStaff.firstName[0] || 'A'
                          )}
                        </div>
                        <button className="absolute bottom-0 right-0 w-6 h-6 lg:w-8 lg:h-8 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700">
                          <Edit className="h-3 w-3 lg:h-4 lg:w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Informations visibles aux clients - Responsive */}
                    <div>
                      <h4 className="font-semibold text-base lg:text-lg mb-3 lg:mb-4 text-purple-900">Informations publiques</h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prénom *
                          </label>
                          <Input
                            placeholder="Prénom"
                            value={newStaff.firstName}
                            onChange={(e) => setNewStaff(prev => ({ ...prev, firstName: e.target.value }))}
                            className="rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Intitulé du poste
                          </label>
                          <Input
                            placeholder="Ex: Coiffeur, Esthéticienne..."
                            value={newStaff.jobTitle}
                            onChange={(e) => setNewStaff(prev => ({ ...prev, jobTitle: e.target.value }))}
                            className="rounded-xl"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Informations privées - Responsive */}
                    <div>
                      <h4 className="font-semibold text-base lg:text-lg mb-3 lg:mb-4 text-red-900">Informations privées</h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom de famille
                          </label>
                          <Input
                            placeholder="Nom"
                            value={newStaff.lastName}
                            onChange={(e) => setNewStaff(prev => ({ ...prev, lastName: e.target.value }))}
                            className="rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Couleur du calendrier
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={newStaff.calendarColor}
                              onChange={(e) => setNewStaff(prev => ({ ...prev, calendarColor: e.target.value }))}
                              className="w-12 h-10 rounded-lg border-2 border-gray-200"
                            />
                            <Input
                              value={newStaff.calendarColor}
                              onChange={(e) => setNewStaff(prev => ({ ...prev, calendarColor: e.target.value }))}
                              className="rounded-xl flex-1"
                              placeholder="#8b5cf6"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            E-mail
                          </label>
                          <Input
                            placeholder="email@exemple.com"
                            type="email"
                            value={newStaff.email}
                            onChange={(e) => setNewStaff(prev => ({ ...prev, email: e.target.value }))}
                            className="rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Téléphone
                          </label>
                          <Input
                            placeholder="+33 6 12 34 56 78"
                            value={newStaff.phone}
                            onChange={(e) => setNewStaff(prev => ({ ...prev, phone: e.target.value }))}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="lg:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Anniversaire
                          </label>
                          <Input
                            type="date"
                            value={newStaff.birthday}
                            onChange={(e) => setNewStaff(prev => ({ ...prev, birthday: e.target.value }))}
                            className="rounded-xl max-w-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Services assignés - Responsive */}
                    <div>
                      <h4 className="font-semibold text-base lg:text-lg mb-3 lg:mb-4">Services assignés</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3 max-h-48 lg:max-h-60 overflow-y-auto p-1">
                        {services.map((service) => (
                          <div key={service.id} className="flex items-center space-x-2 lg:space-x-3 p-3 lg:p-4 rounded-xl hover:bg-purple-50 border border-gray-100 transition-colors">
                            <Checkbox
                              id={`service-${service.id}`}
                              checked={newStaff.serviceIds.includes(service.id.toString())}
                              onCheckedChange={(checked) => handleServiceToggle(service.id.toString(), !!checked)}
                            />
                            <label htmlFor={`service-${service.id}`} className="text-xs lg:text-sm flex-1 cursor-pointer font-medium">
                              {service.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions - Responsive */}
                    <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 pt-4 lg:pt-6 border-t">
                      <Button 
                        onClick={handleSubmit}
                        disabled={createStaffMutation.isPending}
                        className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6 lg:px-8 py-2 lg:py-3 flex-1 sm:flex-none"
                      >
                        <Save className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                        Sauvegarder
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowAddForm(false)}
                        className="rounded-xl px-6 lg:px-8 py-2 lg:py-3"
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Liste de l'équipe - Desktop Grid optimisé */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 xl:gap-8">
          {isLoadingStaff ? (
            <div className="col-span-full text-center py-12 lg:py-16">
              <div className="animate-spin w-10 h-10 lg:w-12 lg:h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-base lg:text-lg font-medium text-gray-600">Chargement de l'équipe...</p>
            </div>
          ) : staffMembers.length === 0 ? (
            <Card className="col-span-full rounded-3xl shadow-lg border-0 bg-white/90 backdrop-blur-md">
              <CardContent className="text-center py-12 lg:py-16">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 lg:h-10 lg:w-10 text-purple-600" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">Aucun professionnel</h3>
                <p className="text-gray-600 mb-6 text-base lg:text-lg max-w-md mx-auto">Commencez par ajouter des professionnels à votre équipe pour optimiser votre planning</p>
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl lg:px-8 lg:py-3"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Ajouter le premier professionnel
                </Button>
              </CardContent>
            </Card>
          ) : (
            staffMembers.map((member) => (
              <Card key={member.id} className="rounded-3xl shadow-lg border-0 bg-white/90 backdrop-blur-md hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 md:p-6 lg:p-8">
                  {editingStaff?.id === member.id ? (
                    // Mode édition - Desktop optimisé
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                          <Edit className="h-5 w-5 text-green-600" />
                        </div>
                        <h4 className="font-semibold text-lg">Modification du profil</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Input
                          placeholder="Prénom"
                          value={editingStaff.firstName}
                          onChange={(e) => setEditingStaff(prev => prev ? { ...prev, firstName: e.target.value } : null)}
                          className="rounded-xl"
                        />
                        <Input
                          placeholder="Nom"
                          value={editingStaff.lastName}
                          onChange={(e) => setEditingStaff(prev => prev ? { ...prev, lastName: e.target.value } : null)}
                          className="rounded-xl"
                        />
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-3 text-base">Services assignés :</h5>
                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                          {services.map((service) => (
                            <div key={service.id} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-50 border border-gray-100">
                              <Checkbox
                                id={`edit-service-${service.id}`}
                                checked={(editingStaff.serviceIds || []).includes(service.id.toString())}
                                onCheckedChange={(checked) => handleServiceToggle(service.id.toString(), !!checked, true)}
                              />
                              <label htmlFor={`edit-service-${service.id}`} className="text-sm flex-1 cursor-pointer font-medium">
                                {service.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row gap-3 pt-4 border-t">
                        <Button 
                          onClick={handleUpdate}
                          disabled={updateStaffMutation.isPending}
                          className="bg-green-600 hover:bg-green-700 text-white rounded-xl flex-1 lg:flex-none lg:px-6"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Sauvegarder
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setEditingStaff(null)}
                          className="rounded-xl lg:px-6"
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Mode affichage - Desktop optimisé
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div 
                              className="w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center text-white font-bold text-lg lg:text-xl overflow-hidden"
                              style={{ backgroundColor: member.calendarColor || '#8b5cf6' }}
                            >
                              {member.photoUrl ? (
                                <img src={member.photoUrl} alt={`${member.firstName} ${member.lastName}`} className="w-full h-full object-cover" />
                              ) : (
                                `${member.firstName[0]}${member.lastName[0]}`
                              )}
                            </div>
                            <div 
                              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
                              style={{ backgroundColor: member.calendarColor || '#8b5cf6' }}
                            ></div>
                          </div>
                          <div>
                            <h3 className="text-lg lg:text-xl font-bold text-gray-900">
                              {member.firstName} {member.lastName}
                            </h3>
                            {member.jobTitle && (
                              <p className="text-sm font-medium text-purple-600">{member.jobTitle}</p>
                            )}
                            {member.email && (
                              <p className="text-xs text-gray-500 mt-1">{member.email}</p>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingStaff(member)}
                          className="rounded-xl hover:bg-purple-50 border-purple-200"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="ml-2 hidden lg:inline">Modifier</span>
                        </Button>
                      </div>
                      
                      <div className="border-t pt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-3">Services assignés :</p>
                        <div className="flex flex-wrap gap-2">
                          {(member.serviceIds || []).length === 0 ? (
                            <Badge variant="outline" className="text-gray-500 rounded-full px-3 py-1">
                              Aucun service assigné
                            </Badge>
                          ) : (
                            member.serviceIds?.map((serviceId) => (
                              <Badge 
                                key={serviceId} 
                                className="bg-purple-100 text-purple-800 hover:bg-purple-200 rounded-full text-xs px-3 py-1 font-medium"
                              >
                                {getServiceName(serviceId)}
                              </Badge>
                            ))
                          )}
                        </div>
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