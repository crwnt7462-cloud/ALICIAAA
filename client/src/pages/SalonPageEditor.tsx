import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  User,
  Calendar,
  CheckCircle,
  Award,
  ChevronDown,
  ChevronUp,
  Edit3,
  Save,
  Upload,
  Trash2,
  Plus,
  Palette
} from 'lucide-react';

interface Service {
  id: number;
  name: string;
  price: number;
  duration: string;
  description?: string;
}

interface ServiceCategory {
  id: number;
  name: string;
  expanded: boolean;
  services: Service[];
}

interface SalonData {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  address: string;
  phone: string;
  verified: boolean;
  certifications: string[];
  awards: string[];
  longDescription: string;
  coverImageUrl: string;
  photos: string[];
  customColors?: {
    primary: string;
    accent: string;
    buttonText: string;
    buttonClass: string;
  };
}

export default function SalonPageEditor() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('services');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // DONNÉES COMPLÈTES DU SALON BARBIER GENTLEMAN MARAIS (modifiables)
  const [salonData, setSalonData] = useState<SalonData>({
    id: 'barbier-gentleman-marais',
    name: 'Gentleman Barbier',
    rating: 4.9,
    reviews: 189,
    address: '28 Rue des Rosiers, 75004 Paris',
    phone: '01 48 87 65 43',
    verified: true,
    certifications: ['Barbier traditionnel certifié', 'Rasage au coupe-chou', 'Produits artisanaux'],
    awards: ['Meilleur barbier du Marais 2024', 'Tradition & Modernité', 'Service d\'exception'],
    longDescription: 'Gentleman Barbier vous propose une expérience unique dans l\'art du barbier traditionnel. Spécialisés dans la coupe masculine et le rasage traditionnel au coupe-chou, nous perpétuons les techniques ancestrales dans un cadre authentique du Marais historique.',
    coverImageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    photos: [
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    customColors: {
      primary: '#f59e0b', // amber-500 par défaut pour Barbier Gentleman
      accent: '#d97706',   // amber-600
      buttonText: '#000000', // noir
      buttonClass: 'glass-button-amber'
    }
  });

  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([
    {
      id: 1,
      name: 'Coupes Homme',
      expanded: true,
      services: [
        { id: 1, name: 'Coupe Classique', price: 35, duration: '30min', description: 'Coupe traditionnelle aux ciseaux et tondeuse' },
        { id: 2, name: 'Coupe Dégradée', price: 40, duration: '35min', description: 'Dégradé moderne et personnalisé' },
        { id: 3, name: 'Coupe + Barbe', price: 55, duration: '45min', description: 'Forfait coupe + taille de barbe' },
        { id: 4, name: 'Coupe Enfant (-12 ans)', price: 25, duration: '25min', description: 'Coupe spéciale pour les petits messieurs' }
      ]
    },
    {
      id: 2,
      name: 'Barbe & Rasage',
      expanded: false,
      services: [
        { id: 5, name: 'Taille de Barbe', price: 25, duration: '20min', description: 'Taille et mise en forme de barbe' },
        { id: 6, name: 'Rasage Traditionnel', price: 45, duration: '40min', description: 'Rasage complet au coupe-chou avec serviettes chaudes' },
        { id: 7, name: 'Barbe + Moustache', price: 30, duration: '25min', description: 'Entretien barbe et moustache' },
        { id: 8, name: 'Rasage de Luxe', price: 65, duration: '1h', description: 'Expérience complète avec soins visage' }
      ]
    },
    {
      id: 3,
      name: 'Soins Homme',
      expanded: false,
      services: [
        { id: 9, name: 'Soin Visage Homme', price: 50, duration: '45min', description: 'Nettoyage et hydratation du visage' },
        { id: 10, name: 'Masque Purifiant', price: 35, duration: '30min', description: 'Masque spécial peau masculine' },
        { id: 11, name: 'Épilation Sourcils', price: 15, duration: '15min', description: 'Épilation et mise en forme des sourcils' }
      ]
    }
  ]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/salon/current', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Salon mis à jour !",
        description: "Vos modifications ont été sauvegardées avec succès."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/salon/current'] });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder les modifications.",
        variant: "destructive"
      });
    }
  });

  const toggleCategory = (categoryId: number) => {
    setServiceCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, expanded: !cat.expanded }
          : cat
      )
    );
  };

  const updateField = (field: keyof SalonData, value: any) => {
    setSalonData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateService = (categoryId: number, serviceId: number, updates: Partial<Service>) => {
    setServiceCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              services: cat.services.map(service =>
                service.id === serviceId ? { ...service, ...updates } : service
              )
            }
          : cat
      )
    );
  };

  const addService = (categoryId: number) => {
    const newService: Service = {
      id: Date.now(),
      name: 'Nouveau service',
      price: 30,
      duration: '30min',
      description: 'Description du service'
    };
    
    setServiceCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, services: [...cat.services, newService] }
          : cat
      )
    );
  };

  const deleteService = (categoryId: number, serviceId: number) => {
    setServiceCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, services: cat.services.filter(s => s.id !== serviceId) }
          : cat
      )
    );
  };

  const handleSave = () => {
    saveMutation.mutate({
      ...salonData,
      serviceCategories
    });
  };

  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateField('coverImageUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec photo de couverture */}
      <div className="relative h-64 bg-gradient-to-br from-amber-600 to-orange-700">
        <img 
          src={salonData.coverImageUrl} 
          alt={salonData.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        {/* Boutons d'action dans le header */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <button 
            onClick={() => {
              console.log('🔙 Bouton retour cliqué - Navigation vers dashboard');
              window.history.back();
            }}
            className="glass-button-secondary w-10 h-10 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className={`glass-button-secondary text-white rounded-xl ${isEditing ? 'bg-pink-100/50' : ''}`}
            >
              <Edit3 className="w-4 h-4 mr-1" />
              {isEditing ? 'Aperçu' : 'Modifier'}
            </Button>
            {isEditing && (
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="glass-button text-black rounded-xl disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-1" />
                {saveMutation.isPending ? 'Sauvegarde...' : 'Enregistrer'}
              </Button>
            )}
          </div>
        </div>

        {/* Overlay d'édition photo */}
        {isEditing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="flex gap-2">
              <label htmlFor="cover-upload" className="cursor-pointer">
                <div className="glass-button text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Changer la photo
                </div>
                <input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}
        
        {/* Informations salon en overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            {isEditing ? (
              <Input
                value={salonData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="text-2xl font-bold bg-white/20 border-white/30 text-white placeholder-white/70"
                placeholder="Nom du salon"
              />
            ) : (
              <h1 className="text-2xl font-bold">{salonData.name}</h1>
            )}
            {salonData.verified && (
              <CheckCircle className="h-5 w-5 text-blue-400" />
            )}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{salonData.rating}</span>
              <span className="opacity-80">({salonData.reviews} avis)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="opacity-80">Le Marais</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white border-b">
        <div className="flex">
          {[
            { id: 'services', label: 'Services', icon: Calendar },
            { id: 'info', label: 'Infos', icon: MapPin },
            { id: 'couleurs', label: 'Couleurs', icon: Palette },
            { id: 'avis', label: 'Avis', icon: Star }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'glass-button-amber border-b-2 border-amber-600'
                  : 'glass-button-secondary'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="p-4">
        {activeTab === 'services' && (
          <div className="space-y-4">
            {/* Bouton ajouter catégorie en mode édition */}
            {isEditing && (
              <Button
                onClick={() => {
                  const newCategory: ServiceCategory = {
                    id: Date.now(),
                    name: 'Nouvelle catégorie',
                    expanded: true,
                    services: []
                  };
                  setServiceCategories(prev => [...prev, newCategory]);
                }}
                className="w-full glass-button border-2 border-dashed border-amber-300 py-6"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter une catégorie de services
              </Button>
            )}

            {serviceCategories.map(category => (
              <Card key={category.id} className="overflow-hidden">
                <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  {isEditing ? (
                    <Input
                      value={category.name}
                      onChange={(e) => {
                        setServiceCategories(prev =>
                          prev.map(cat =>
                            cat.id === category.id
                              ? { ...cat, name: e.target.value }
                              : cat
                          )
                        );
                      }}
                      className="font-semibold text-lg border-0 bg-transparent focus:bg-white"
                      placeholder="Nom de la catégorie"
                    />
                  ) : (
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="flex items-center justify-between w-full"
                    >
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      {category.expanded ? 
                        <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      }
                    </button>
                  )}

                  {isEditing && (
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => addService(category.id)}
                        className="text-amber-600 hover:bg-amber-50"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setServiceCategories(prev => prev.filter(cat => cat.id !== category.id));
                        }}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                {category.expanded && (
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {category.services.map(service => (
                        <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            {isEditing ? (
                              <div className="space-y-2">
                                <Input
                                  value={service.name}
                                  onChange={(e) => updateService(category.id, service.id, { name: e.target.value })}
                                  className="font-medium"
                                  placeholder="Nom du service"
                                />
                                <Textarea
                                  value={service.description}
                                  onChange={(e) => updateService(category.id, service.id, { description: e.target.value })}
                                  className="text-sm"
                                  placeholder="Description du service"
                                  rows={2}
                                />
                                <div className="flex gap-2">
                                  <Input
                                    type="number"
                                    value={service.price}
                                    onChange={(e) => updateService(category.id, service.id, { price: parseInt(e.target.value) })}
                                    className="text-sm"
                                    placeholder="Prix"
                                  />
                                  <Input
                                    value={service.duration}
                                    onChange={(e) => updateService(category.id, service.id, { duration: e.target.value })}
                                    className="text-sm"
                                    placeholder="Durée"
                                  />
                                </div>
                              </div>
                            ) : (
                              <>
                                <h4 className="font-medium">{service.name}</h4>
                                {service.description && (
                                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                                )}
                                <div className="flex items-center gap-3 mt-2">
                                  <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <Clock className="h-3 w-3" />
                                    {service.duration}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-bold text-lg">{service.price}€</p>
                            {!isEditing ? (
                              <Button 
                                size="sm" 
                                className="mt-2 glass-button-custom transition-all duration-300"
                                style={{
                                  '--custom-bg': salonData.customColors?.primary || '#f59e0b',
                                  '--custom-text': salonData.customColors?.buttonText || '#000000',
                                  backgroundColor: `color-mix(in srgb, ${salonData.customColors?.primary || '#f59e0b'} 85%, transparent)`,
                                  color: salonData.customColors?.buttonText || '#000000',
                                  backdropFilter: 'blur(10px) saturate(180%)',
                                  border: `1px solid color-mix(in srgb, ${salonData.customColors?.primary || '#f59e0b'} 30%, transparent)`,
                                  boxShadow: `0 8px 32px color-mix(in srgb, ${salonData.customColors?.primary || '#f59e0b'} 15%, transparent)`
                                } as React.CSSProperties}
                                onClick={() => setLocation('/salon-booking')}
                              >
                                Réserver
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteService(category.id, service.id)}
                                className="mt-2 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'info' && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">À propos</h3>
                {isEditing ? (
                  <Textarea
                    value={salonData.longDescription}
                    onChange={(e) => updateField('longDescription', e.target.value)}
                    className="mb-6"
                    rows={4}
                    placeholder="Description longue du salon"
                  />
                ) : (
                  <p className="text-gray-700 mb-6">{salonData.longDescription}</p>
                )}
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    {isEditing ? (
                      <Input
                        value={salonData.address}
                        onChange={(e) => updateField('address', e.target.value)}
                        placeholder="Adresse complète"
                      />
                    ) : (
                      <span>{salonData.address}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    {isEditing ? (
                      <Input
                        value={salonData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="Numéro de téléphone"
                      />
                    ) : (
                      <span>{salonData.phone}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span>Mar-Sam: 9h-19h • Lun: Fermé • Dim: 10h-17h</span>
                  </div>
                </div>
              </CardContent>
            </Card>



            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Spécialités & Expertise</h3>
                <div className="space-y-3">
                  {salonData.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-amber-500" />
                      {isEditing ? (
                        <Input
                          value={cert}
                          onChange={(e) => {
                            const newCertifications = [...salonData.certifications];
                            newCertifications[index] = e.target.value;
                            updateField('certifications', newCertifications);
                          }}
                          className="text-sm"
                        />
                      ) : (
                        <span className="text-sm">{cert}</span>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Distinctions</h4>
                  <div className="flex flex-wrap gap-2">
                    {salonData.awards.map((award, index) => (
                      <Badge key={index} variant="secondary" className="bg-amber-100 text-amber-800">
                        {award}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'couleurs' && (
          <div className="space-y-6">
            {/* Header avec description */}
            <Card className="glass-card-amber">
              <CardContent className="p-6 text-center">
                <Palette className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Personnalisation des couleurs</h2>
                <p className="text-gray-600">
                  Changez les couleurs de vos boutons de réservation pour correspondre à votre identité visuelle.
                  L'effet glassmorphism sera conservé avec vos couleurs personnalisées.
                </p>
              </CardContent>
            </Card>

            {/* Sélecteurs de couleur */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-6">Choisir vos couleurs</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">Couleur principale</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={salonData.customColors?.primary || '#f59e0b'}
                        onChange={(e) => updateField('customColors', {
                          ...salonData.customColors,
                          primary: e.target.value
                        })}
                        className="w-16 h-12 rounded-lg border border-gray-300 cursor-pointer"
                      />
                      <Input
                        value={salonData.customColors?.primary || '#f59e0b'}
                        onChange={(e) => updateField('customColors', {
                          ...salonData.customColors,
                          primary: e.target.value
                        })}
                        className="flex-1 text-sm font-mono"
                        placeholder="#f59e0b"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Couleur utilisée pour les boutons de réservation</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-3">Couleur accent</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={salonData.customColors?.accent || '#d97706'}
                        onChange={(e) => updateField('customColors', {
                          ...salonData.customColors,
                          accent: e.target.value
                        })}
                        className="w-16 h-12 rounded-lg border border-gray-300 cursor-pointer"
                      />
                      <Input
                        value={salonData.customColors?.accent || '#d97706'}
                        onChange={(e) => updateField('customColors', {
                          ...salonData.customColors,
                          accent: e.target.value
                        })}
                        className="flex-1 text-sm font-mono"
                        placeholder="#d97706"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Couleur utilisée pour les bordures et effets</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Couleurs prédéfinies */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Thèmes prédéfinis</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { name: 'Ambre Classique', primary: '#f59e0b', accent: '#d97706', desc: 'Chaleureux et professionnel' },
                    { name: 'Bleu Moderne', primary: '#3b82f6', accent: '#2563eb', desc: 'Confiance et sérénité' },
                    { name: 'Rose Élégant', primary: '#ec4899', accent: '#db2777', desc: 'Féminité et douceur' },
                    { name: 'Vert Nature', primary: '#10b981', accent: '#059669', desc: 'Naturel et apaisant' },
                    { name: 'Violet Royal', primary: '#8b5cf6', accent: '#7c3aed', desc: 'Luxe et créativité' },
                    { name: 'Rouge Passion', primary: '#ef4444', accent: '#dc2626', desc: 'Énergie et dynamisme' }
                  ].map((theme) => (
                    <button
                      key={theme.name}
                      onClick={() => updateField('customColors', {
                        ...salonData.customColors,
                        primary: theme.primary,
                        accent: theme.accent
                      })}
                      className="p-4 border rounded-lg hover:shadow-lg transition-all text-left group"
                      style={{ 
                        borderColor: theme.primary,
                        background: `linear-gradient(135deg, ${theme.primary}15 0%, ${theme.accent}08 100%)`
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: theme.primary, borderColor: theme.accent }}
                        />
                        <h4 className="font-medium text-sm">{theme.name}</h4>
                      </div>
                      <p className="text-xs text-gray-600">{theme.desc}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Aperçu en temps réel */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Aperçu en temps réel</h3>
                <div 
                  className="p-6 rounded-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${salonData.customColors?.primary || '#f59e0b'}10 0%, ${salonData.customColors?.accent || '#d97706'}05 100%)` 
                  }}
                >
                  <div className="flex flex-wrap gap-4 items-center justify-center">
                    <button
                      className="px-6 py-3 rounded-lg font-medium transition-all duration-300 glass-button-custom"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${salonData.customColors?.primary || '#f59e0b'} 85%, transparent)`,
                        color: salonData.customColors?.buttonText || '#000000',
                        backdropFilter: 'blur(10px) saturate(180%)',
                        border: `1px solid color-mix(in srgb, ${salonData.customColors?.primary || '#f59e0b'} 30%, transparent)`,
                        boxShadow: `0 8px 32px color-mix(in srgb, ${salonData.customColors?.primary || '#f59e0b'} 15%, transparent)`
                      }}
                    >
                      Réserver maintenant
                    </button>
                    <button
                      className="px-6 py-3 rounded-lg font-medium transition-all duration-300 glass-button-custom"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                        color: salonData.customColors?.primary || '#f59e0b',
                        backdropFilter: 'blur(10px) saturate(180%)',
                        border: `1px solid color-mix(in srgb, ${salonData.customColors?.primary || '#f59e0b'} 40%, transparent)`,
                        boxShadow: `0 8px 32px color-mix(in srgb, ${salonData.customColors?.primary || '#f59e0b'} 10%, transparent)`
                      }}
                    >
                      Voir les avis
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 glass-button-custom"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${salonData.customColors?.primary || '#f59e0b'} 85%, transparent)`,
                        color: salonData.customColors?.buttonText || '#000000',
                        backdropFilter: 'blur(10px) saturate(180%)',
                        border: `1px solid color-mix(in srgb, ${salonData.customColors?.primary || '#f59e0b'} 30%, transparent)`,
                        boxShadow: `0 8px 32px color-mix(in srgb, ${salonData.customColors?.primary || '#f59e0b'} 15%, transparent)`
                      }}
                    >
                      Réserver
                    </button>
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-4">
                    ✨ Aperçu de vos boutons avec effet glassmorphism et couleurs personnalisées
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'avis' && (
          <div className="space-y-4">
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {salonData.rating}/5 étoiles
              </h3>
              <p className="text-gray-600">
                Basé sur {salonData.reviews} avis clients
              </p>
            </div>
            
            {/* Avis exemple */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Pierre D.</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Il y a 1 semaine</p>
                    <p className="text-sm">"Un vrai barbier à l'ancienne ! Le rasage au coupe-chou était parfait et l'ambiance du salon authentique. Je reviendrai sans hésitation."</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Bouton réservation fixe en bas */}
      {!isEditing && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button 
            className="w-full py-3 text-lg font-semibold rounded-xl glass-button-custom transition-all duration-300"
            style={{
              '--custom-bg': salonData.customColors?.primary || '#f59e0b',
              '--custom-text': salonData.customColors?.buttonText || '#000000',
              backgroundColor: `color-mix(in srgb, ${salonData.customColors?.primary || '#f59e0b'} 90%, transparent)`,
              color: salonData.customColors?.buttonText || '#000000',
              backdropFilter: 'blur(15px) saturate(180%)',
              border: `1px solid color-mix(in srgb, ${salonData.customColors?.primary || '#f59e0b'} 40%, transparent)`,
              boxShadow: `0 12px 40px color-mix(in srgb, ${salonData.customColors?.primary || '#f59e0b'} 20%, transparent)`
            } as React.CSSProperties}
            onClick={() => setLocation('/salon-booking')}
          >
            Réserver maintenant
          </Button>
        </div>
      )}
    </div>
  );
}