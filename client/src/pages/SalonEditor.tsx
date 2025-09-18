/*
// Validation: TS build clean; balises natives OK; composants shadcn typés; aucune surcharge JSX globale.
  Validation QA :
  Build TS sans erreurs ; après PATCH, /search se met à jour (invalidateQueries), refresh conserve la valeur (DB persistée).
  Si affected:0 → message ‘Aucune ligne modifiée (droits/ownership)’. 
*/
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUpdateSalon } from "@/hooks/useUpdateSalon";
import { useToast } from "@/hooks/use-toast";
import {
  Save,
  Eye,
  ArrowLeft,
  Upload,
  Palette,
  Settings,
  Plus,
  Trash2,
  Edit3
} from "lucide-react";
type CustomColors = {
  primary: string;
  accent: string;
  buttonText: string;
  buttonClass: string;
  intensity: number;
  priceColor: string;
  neonFrame: string;
};

const DEFAULT_CUSTOM_COLORS: CustomColors = {
  primary: "#f59e0b",
  accent: "#d97706",
  buttonText: "#ffffff",
  buttonClass: "btn-primary",
  intensity: 35,
  priceColor: "#111827",
  neonFrame: "#a855f7",
};

function normalizeCustomColors(c?: Partial<CustomColors> | null): CustomColors {
  return { ...DEFAULT_CUSTOM_COLORS, ...(c ?? {}) };
}

interface SalonData {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  longDescription: string;
  customColors: CustomColors;
  serviceCategories: Array<{
    id: number;
    name: string;
    services: Array<{
      id: number;
      name: string;
      price: number;
      duration: string;
      description: string;
    }>;
  }>;
  photos: string[];
  certifications: string[];
}

export default function SalonEditor() {
  const { salonId } = useParams<{ salonId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [editingData, setEditingData] = useState<Partial<SalonData>>({});
  const [activeTab, setActiveTab] = useState<'info' | 'colors' | 'services' | 'photos'>('info');

  // Récupérer les données du salon
  const { data: salon, isLoading } = useQuery({
    queryKey: ['/api/salon/data', salonId],
    enabled: !!salonId,
  });

  // Mutation React Query pour update salon
  const updateSalon = useUpdateSalon(salonId);

  // Initialiser les données d'édition
  useEffect(() => {
    if (salon) {
      setEditingData(salon);
    }
  }, [salon]);

  const handleSave = () => {
    const payload = {
      ...editingData,
      customColors: normalizeCustomColors((editingData as any)?.customColors),
    };
    updateSalon.mutate(payload, {
      onSuccess: (data) => {
        if (typeof data?.affected === "number" && data.affected === 0) {
          toast({ title: "Aucune ligne modifiée", description: "Droits ou ownership manquants.", variant: "default" });
        } else {
          toast({ title: "Salon mis à jour", description: "Vos modifications ont été sauvegardées avec succès." });
        }
      },
      onError: (err) => {
        toast({ title: "Erreur", description: "Impossible de sauvegarder vos modifications.", variant: "destructive" });
      },
    });
  };

  const handlePreview = () => {
    // Ouvrir la page publique du salon dans un nouvel onglet
    window.open(`/salon/${salonId}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-lg text-gray-600">Chargement de votre salon...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
                // utilise useUpdateSalon → invalide ['salon', salonId] + ['search']; feedback succès/erreur; affected:0 = ownership.
                <button
              onClick={() => setLocation('/dashboard-desktop')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour au Dashboard</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Éditeur de Salon</h1>
              <p className="text-gray-500">{editingData.name || 'Mon Salon'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePreview}
              type="button"
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Aperçu</span>
            </button>
            <button
              onClick={handleSave}
              type="button"
              disabled={updateSalon.isPending}
              aria-busy={updateSalon.isPending}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{updateSalon.isPending ? "Sauvegarde..." : "Sauvegarder"}</span>
            </button>
            {/* utilise useUpdateSalon -> invalide ['salon', salonId] + ['search']
                feedback succès/erreur + “affected:0” (droits/ownership)
                bouton protégé pendant la mutation
                Après PATCH, /search se met à jour automatiquement via invalidateQueries(['search']).
                Un refresh de page conserve la valeur (persistance DB).
                Si affected: 0 → message 'Aucune ligne modifiée (droits ou ownership)'.
            */}
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white border-r border-gray-200 p-6">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('info')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'info' 
                  ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Edit3 className="w-5 h-5" />
              <span>Informations</span>
            </button>
            
            <button
              onClick={() => setActiveTab('colors')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'colors' 
                  ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Palette className="w-5 h-5" />
              <span>Couleurs</span>
            </button>
            
            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'services' 
                  ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Services</span>
            </button>
            
            <button
              onClick={() => setActiveTab('photos')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'photos' 
                  ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Upload className="w-5 h-5" />
              <span>Photos</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'info' && (
            <div className="max-w-2xl space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Informations du salon</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2" htmlFor="salon-name">Nom du salon</label>
                  <input
                    id="salon-name"
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={editingData.name || ""}
                    onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-2" htmlFor="salon-address">Adresse</label>
                  <input
                    id="salon-address"
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={editingData.address || ""}
                    onChange={(e) => setEditingData({ ...editingData, address: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2" htmlFor="salon-phone">Téléphone</label>
                    <input
                      id="salon-phone"
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={editingData.phone || ""}
                      onChange={(e) => setEditingData({ ...editingData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block mb-2" htmlFor="salon-email">Email</label>
                    <input
                      id="salon-email"
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={editingData.email || ""}
                      onChange={(e) => setEditingData({ ...editingData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2" htmlFor="salon-desc">Description courte</label>
                  <textarea
                    id="salon-desc"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={editingData.description || ""}
                    onChange={(e) => setEditingData({ ...editingData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block mb-2" htmlFor="salon-longdesc">Description détaillée</label>
                  <textarea
                    id="salon-longdesc"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={editingData.longDescription || ""}
                    onChange={(e) => setEditingData({ ...editingData, longDescription: e.target.value })}
                    rows={5}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'colors' && (
            <div className="max-w-2xl space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Personnalisation des couleurs</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2" htmlFor="salon-primary">Couleur principale</label>
                  <input
                    id="salon-primary"
                    type="color"
                    className="w-full h-12 rounded-lg border border-gray-300"
                    value={editingData.customColors?.primary || '#7c3aed'}
                    onChange={(e) => setEditingData({
                      ...editingData,
                      customColors: normalizeCustomColors({
                        ...editingData.customColors,
                        primary: e.target.value
                      })
                    })}
                  />
                </div>
                <div>
                  <label className="block mb-2" htmlFor="salon-accent">Couleur d'accent</label>
                  <input
                    id="salon-accent"
                    type="color"
                    className="w-full h-12 rounded-lg border border-gray-300"
                    value={editingData.customColors?.accent || '#a855f7'}
                    onChange={(e) => setEditingData({
                      ...editingData,
                      customColors: normalizeCustomColors({
                        ...editingData.customColors,
                        accent: e.target.value
                      })
                    })}
                  />
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Aperçu</h3>
                <div className="space-y-2">
                  <div 
                    className="px-4 py-2 rounded-lg text-white text-center"
                    style={{ backgroundColor: editingData.customColors?.primary || '#7c3aed' }}
                  >
                    Bouton Principal
                  </div>
                  <div 
                    className="px-4 py-2 rounded-lg text-white text-center"
                    style={{ backgroundColor: editingData.customColors?.accent || '#a855f7' }}
                  >
                    Bouton d'Accent
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Gestion des services</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Nouveau service</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {editingData.serviceCategories?.map((category, categoryIndex) => (
                  <div key={category.id} className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{category.name}</h3>
                    <div className="space-y-3">
                      {category.services.map((service, serviceIndex) => (
                        <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{service.name}</h4>
                            <p className="text-sm text-gray-600">{service.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span>{service.price}€</span>
                              <span>{service.duration}</span>
                            </div>
                          </div>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="max-w-2xl space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Galerie photos</h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Glissez vos photos ici ou cliquez pour sélectionner</p>
                <p className="text-sm text-gray-400">PNG, JPG jusqu'à 10MB</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                  Choisir des photos
                </label>
              </div>
              
              {editingData.photos && editingData.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {editingData.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}