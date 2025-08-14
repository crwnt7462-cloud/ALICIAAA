import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, User, Mail, Phone, Palette, Star } from 'lucide-react';
import { getSalonBySlug, apiRequest } from '@/api';
import type { Professional, Salon } from '@/types';
import { queryClient } from '@/lib/queryClient';

export default function ProfessionalManagement() {
  const { salonSlug } = useParams<{ salonSlug: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    specialties: [] as string[],
    color: '#8B5CF6',
    bio: ''
  });

  // Récupération salon
  const { data: salon, isLoading: salonLoading } = useQuery({
    queryKey: ['salon', salonSlug],
    queryFn: () => getSalonBySlug(salonSlug!),
    enabled: !!salonSlug,
  });

  // Récupération professionnels
  const { data: professionals = [], isLoading: professionalsLoading, refetch } = useQuery({
    queryKey: ['professionals', salon?.id],
    queryFn: async () => {
      if (!salon?.id) return [];
      const response = await apiRequest<Professional[]>(`/api/salon/${salon.id}/professionals`);
      return response;
    },
    enabled: !!salon?.id,
  });

  // Mutation pour sauvegarder les modifications
  const saveProfessionalMutation = useMutation({
    mutationFn: async (data: Partial<Professional>) => {
      if (!salon?.id || !editingProfessional) return;
      return apiRequest(`/api/salon/${salon.id}/professional/${editingProfessional.id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Professionnel mis à jour",
        description: "Les modifications ont été sauvegardées avec succès.",
      });
      setEditingProfessional(null);
      refetch();
      queryClient.invalidateQueries({ queryKey: ['professionals'] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications.",
        variant: "destructive",
      });
    }
  });

  const handleEdit = (professional: Professional) => {
    setEditingProfessional(professional);
    setFormData({
      name: professional.name || '',
      role: professional.role || '',
      email: professional.email || '',
      phone: professional.phone || '',
      specialties: Array.isArray(professional.specialties) 
        ? professional.specialties 
        : professional.specialties ? [professional.specialties] : [],
      color: professional.color || '#8B5CF6',
      bio: professional.bio || ''
    });
  };

  const handleSave = () => {
    if (!editingProfessional) return;
    
    const updatedData = {
      ...formData,
      specialties: formData.specialties
    };
    
    saveProfessionalMutation.mutate(updatedData);
  };

  const addSpecialty = () => {
    const newSpecialty = (document.getElementById('new-specialty') as HTMLInputElement)?.value?.trim();
    if (newSpecialty && !formData.specialties.includes(newSpecialty)) {
      setFormData({
        ...formData,
        specialties: [...formData.specialties, newSpecialty]
      });
      (document.getElementById('new-specialty') as HTMLInputElement).value = '';
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.filter(s => s !== specialty)
    });
  };

  if (salonLoading || professionalsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-lg border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/salon-booking/${salonSlug}`)}
                className="hover:bg-purple-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au salon
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Gestion des Professionnels
                </h1>
                <p className="text-gray-600">{salon?.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Liste des professionnels */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.map((professional) => (
              <Card key={professional.id} className="glass-card p-6 hover:shadow-lg transition-all duration-300">
                <div className="space-y-4">
                  {/* Avatar avec couleur */}
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: professional.color || '#8B5CF6' }}
                    >
                      {professional.name?.charAt(0)?.toUpperCase() || 'P'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{professional.name}</h3>
                      <p className="text-sm text-gray-600">{professional.role}</p>
                    </div>
                  </div>

                  {/* Informations */}
                  <div className="space-y-2">
                    {professional.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {professional.email}
                      </div>
                    )}
                    {professional.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {professional.phone}
                      </div>
                    )}
                  </div>

                  {/* Spécialités */}
                  {professional.specialties && (
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(professional.specialties) ? professional.specialties : [professional.specialties])
                        .map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => handleEdit(professional)}
                      className="glass-button-pink"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Modal d'édition */}
          {editingProfessional && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <Card className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Modifier le professionnel
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingProfessional(null)}
                    >
                      ✕
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {/* Nom */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nom du professionnel"
                      />
                    </div>

                    {/* Rôle */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rôle / Titre
                      </label>
                      <Input
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        placeholder="Ex: Coiffeur Senior, Esthéticienne"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@example.com"
                      />
                    </div>

                    {/* Téléphone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="01 23 45 67 89"
                      />
                    </div>

                    {/* Couleur */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Couleur du profil
                      </label>
                      <div className="flex items-center space-x-3">
                        <Input
                          type="color"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          placeholder="#8B5CF6"
                        />
                      </div>
                    </div>

                    {/* Spécialités */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Spécialités
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.specialties.map((specialty, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer hover:bg-red-100"
                            onClick={() => removeSpecialty(specialty)}
                          >
                            {specialty} ✕
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          id="new-specialty"
                          placeholder="Nouvelle spécialité"
                          onKeyPress={(e) => e.key === 'Enter' && addSpecialty()}
                        />
                        <Button onClick={addSpecialty} variant="outline" size="sm">
                          Ajouter
                        </Button>
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Biographie
                      </label>
                      <Textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Présentez le professionnel, son expérience..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setEditingProfessional(null)}
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={saveProfessionalMutation.isPending}
                      className="glass-button-pink"
                    >
                      {saveProfessionalMutation.isPending ? (
                        <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full mr-2" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Sauvegarder
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}