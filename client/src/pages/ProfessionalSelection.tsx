import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Star, Plus, Edit3, Save, X, Trash2, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useStaffManagement, type Professional } from "@/hooks/useStaffManagement";

export default function ProfessionalSelection() {
  const [, setLocation] = useLocation();
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showEditMode, setShowEditMode] = useState(false);
  
  // Récupérer le service sélectionné depuis localStorage
  const selectedServiceData = localStorage.getItem('selectedService');
  const selectedService = selectedServiceData ? JSON.parse(selectedServiceData) : null;

  // Utiliser le hook de gestion du staff synchronisé
  const { professionals, addProfessional, updateProfessional, deleteProfessional } = useStaffManagement();


  const handleContinue = () => {
    if (selectedProfessional) {
      // Stocker la sélection et passer à la sélection date/heure
      localStorage.setItem('selectedProfessional', selectedProfessional);
      setLocation('/booking-datetime');
    }
  };

  const handleEditProfessional = (professional: Professional) => {
    setEditingProfessional({ ...professional });
  };

  const handleSaveProfessional = () => {
    if (editingProfessional) {
      updateProfessional(editingProfessional.id, editingProfessional);
      setEditingProfessional(null);
    }
  };

  const handleDeleteProfessional = (id: string) => {
    deleteProfessional(id);
  };

  const handleAddNewProfessional = () => {
    const newProfessional = {
      name: "Nouveau Professionnel",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&auto=format",
      rating: 5.0,
      reviewCount: 0,
      specialties: ["Coupe"],
      nextAvailable: "Disponible maintenant",
      role: "Coiffeur",
      email: "nouveau@salon.fr",
      phone: "06 00 00 00 00",
      bio: "Description du professionnel",
      experience: "Débutant"
    };
    addProfessional(newProfessional);
    setIsAddingNew(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setLocation('/salon')}
              className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">avec Justine</h1>
            <Button
              variant="ghost"
              onClick={() => setShowEditMode(!showEditMode)}
              className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Affichage du service sélectionné */}
        {selectedService && (
          <div className="bg-white m-4 p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{selectedService.name}</h3>
                <p className="text-sm text-gray-600">{selectedService.description}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-bold text-gray-900">{selectedService.price}€</span>
                  <span className="text-sm text-gray-500">{selectedService.duration}min</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-4">
          {/* Étape */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-violet-600 font-medium mb-1">1. Choix du professionnel</div>
                <h2 className="text-xl font-bold text-gray-900">
                  {showEditMode ? "Gérer l'équipe" : "Choisissez votre coiffeur"}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {showEditMode 
                    ? "Ajoutez, modifiez ou supprimez des professionnels"
                    : "Sélectionnez le professionnel avec qui vous souhaitez prendre rendez-vous"
                  }
                </p>
              </div>
              {showEditMode && (
                <Button
                  onClick={() => setIsAddingNew(true)}
                  size="sm"
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              )}
            </div>
          </div>

          {/* Liste des professionnels */}
          <div className="space-y-3 mb-6">
          {professionals.map((pro) => (
            <Card 
              key={pro.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedProfessional === pro.id 
                  ? 'ring-2 ring-violet-500 border-violet-200 bg-violet-50' 
                  : 'hover:shadow-md border-gray-200'
              }`}
              onClick={() => setSelectedProfessional(pro.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  {/* Photo du professionnel */}
                  <div className="relative">
                    <img
                      src={pro.photo}
                      alt={pro.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {selectedProfessional === pro.id && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Nom et note */}
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{pro.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600">
                            {pro.rating} ({pro.reviewCount})
                          </span>
                        </div>
                      </div>
                      {showEditMode && (
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditProfessional(pro);
                            }}
                            className="h-8 w-8 p-0 hover:bg-violet-100"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProfessional(pro.id);
                            }}
                            className="h-8 w-8 p-0 hover:bg-red-100 text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Spécialités */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {pro.specialties.slice(0, 2).map((specialty, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                      {pro.specialties.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{pro.specialties.length - 2}
                        </span>
                      )}
                    </div>

                    {/* Prochaine disponibilité */}
                    <p className="text-xs text-green-600 font-medium">
                      Dispo : {pro.nextAvailable}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Option "Pas de préférence" */}
          <Card 
            className={`cursor-pointer transition-all duration-200 border-dashed ${
              selectedProfessional === 'any' 
                ? 'ring-2 ring-violet-500 border-violet-200 bg-violet-50' 
                : 'hover:shadow-md border-gray-300'
            }`}
            onClick={() => setSelectedProfessional('any')}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Plus className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Pas de préférence</h3>
                  <p className="text-sm text-gray-600">
                    Le premier professionnel disponible
                  </p>
                  <p className="text-xs text-green-600 font-medium mt-1">
                    Plus de créneaux disponibles
                  </p>
                </div>
                {selectedProfessional === 'any' && (
                  <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          </div>

          {/* Bouton Continuer - masqué en mode édition */}
          {!showEditMode && (
            <Button
              onClick={handleContinue}
              disabled={!selectedProfessional}
              className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-semibold disabled:bg-gray-300"
            >
              Continuer
            </Button>
          )}
        </div>
      </div>

      {/* Dialog d'édition d'un professionnel */}
      {editingProfessional && (
        <Dialog open={!!editingProfessional} onOpenChange={() => setEditingProfessional(null)}>
          <DialogContent className="max-w-sm mx-4">
            <DialogHeader>
              <DialogTitle>Modifier {editingProfessional.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nom</Label>
                <Input
                  id="edit-name"
                  value={editingProfessional.name}
                  onChange={(e) => setEditingProfessional({...editingProfessional, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Poste</Label>
                <Input
                  id="edit-role"
                  value={editingProfessional.role || ""}
                  onChange={(e) => setEditingProfessional({...editingProfessional, role: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  value={editingProfessional.email || ""}
                  onChange={(e) => setEditingProfessional({...editingProfessional, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Téléphone</Label>
                <Input
                  id="edit-phone"
                  value={editingProfessional.phone || ""}
                  onChange={(e) => setEditingProfessional({...editingProfessional, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-specialties">Spécialités (séparées par des virgules)</Label>
                <Input
                  id="edit-specialties"
                  value={editingProfessional.specialties.join(", ")}
                  onChange={(e) => setEditingProfessional({
                    ...editingProfessional, 
                    specialties: e.target.value.split(", ").filter(s => s.trim())
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-bio">Biographie</Label>
                <Textarea
                  id="edit-bio"
                  value={editingProfessional.bio || ""}
                  onChange={(e) => setEditingProfessional({...editingProfessional, bio: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setEditingProfessional(null)} className="flex-1">
                Annuler
              </Button>
              <Button onClick={handleSaveProfessional} className="flex-1 bg-violet-600 hover:bg-violet-700">
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog d'ajout d'un nouveau professionnel */}
      <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle>Ajouter un professionnel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nom complet</Label>
              <Input placeholder="Ex: Sarah Dupont" />
            </div>
            <div className="space-y-2">
              <Label>Poste</Label>
              <Input placeholder="Ex: Coloriste Experte" />
            </div>
            <div className="space-y-2">
              <Label>Spécialités</Label>
              <Input placeholder="Ex: Coloration, Balayage" />
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsAddingNew(false)} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleAddNewProfessional} className="flex-1 bg-violet-600 hover:bg-violet-700">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}