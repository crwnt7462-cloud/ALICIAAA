import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Edit3,
  Save,
  Upload,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

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
  description: string;
  longDescription: string;
  address: string;
  phone: string;
  rating: number;
  reviews: number;
  coverImageUrl?: string;
  logoUrl?: string;
  photos: string[];
  serviceCategories: ServiceCategory[];
  verified: boolean;
  certifications: string[];
  awards: string[];
}

export default function SalonPageEditor() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('services');

  const [salonData, setSalonData] = useState<SalonData>({
    id: 'salon-demo',
    name: 'Excellence Paris',
    description: 'Salon de beauté moderne et professionnel au cœur de Paris',
    longDescription: `Notre salon Excellence Paris vous accueille depuis plus de 15 ans dans un cadre moderne et chaleureux. Spécialisés dans les coupes tendances et les soins personnalisés, notre équipe d'experts est formée aux dernières techniques et utilise exclusivement des produits de qualité professionnelle.

Situé au cœur du 8ème arrondissement, nous proposons une gamme complète de services pour sublimer votre beauté naturelle. De la coupe classique aux colorations les plus audacieuses, en passant par nos soins anti-âge révolutionnaires, chaque prestation est réalisée avec la plus grande attention.`,
    address: '15 Avenue des Champs-Élysées, 75008 Paris',
    phone: '01 42 25 76 89',
    rating: 4.8,
    reviews: 247,
    coverImageUrl: '',
    logoUrl: '',
    photos: [],
    verified: true,
    certifications: [
      'Salon labellisé L\'Oréal Professionnel',
      'Formation continue Kérastase',
      'Certification bio Shu Uemura'
    ],
    awards: [
      'Élu Meilleur Salon Paris 8ème 2023',
      'Prix de l\'Innovation Beauté 2022',
      'Certification Éco-responsable'
    ],
    serviceCategories: [
      {
        id: 1,
        name: 'Cheveux',
        expanded: true,
        services: [
          { id: 1, name: 'Coupe & Brushing', price: 45, duration: '1h', description: 'Coupe personnalisée et brushing professionnel' },
          { id: 2, name: 'Coloration', price: 80, duration: '2h', description: 'Coloration complète avec soins' },
          { id: 3, name: 'Mèches', price: 120, duration: '2h30', description: 'Mèches naturelles ou colorées' },
          { id: 4, name: 'Coupe Enfant', price: 25, duration: '30min', description: 'Coupe adaptée aux enfants -12 ans' }
        ]
      },
      {
        id: 2,
        name: 'Soins Visage',
        expanded: false,
        services: [
          { id: 5, name: 'Soin du visage classique', price: 65, duration: '1h15', description: 'Nettoyage, gommage et hydratation' },
          { id: 6, name: 'Soin anti-âge', price: 95, duration: '1h30', description: 'Soin complet avec technologies avancées' },
          { id: 7, name: 'Épilation sourcils', price: 20, duration: '20min', description: 'Épilation et restructuration' }
        ]
      },
      {
        id: 3,
        name: 'Épilation',
        expanded: false,
        services: [
          { id: 8, name: 'Épilation jambes complètes', price: 40, duration: '45min', description: 'Épilation à la cire chaude' },
          { id: 9, name: 'Épilation maillot', price: 30, duration: '30min', description: 'Épilation zone sensible' },
          { id: 10, name: 'Épilation aisselles', price: 15, duration: '15min', description: 'Épilation rapide et efficace' }
        ]
      }
    ]
  });

  // Récupérer les données du salon (désactivé temporairement)
  const isLoading = false;
  // const { data: currentSalon, isLoading } = useQuery({
  //   queryKey: ['/api/salon/current'],
  //   retry: false,
  // });

  // useEffect(() => {
  //   if (currentSalon && typeof currentSalon === 'object') {
  //     const salon = currentSalon as any;
  //     setSalonData(prev => ({
  //       ...prev,
  //       ...salon
  //     }));
  //   }
  // }, [currentSalon]);

  // Mutation pour sauvegarder
  const saveMutation = useMutation({
    mutationFn: async (updatedData: Partial<SalonData>) => {
      const response = await apiRequest('PUT', `/api/salon/${salonData.id}`, updatedData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Salon mis à jour",
        description: "Vos modifications ont été sauvegardées avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/salon/current'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive",
      });
    }
  });

  const handleSave = () => {
    saveMutation.mutate(salonData);
  };

  const updateField = (field: keyof SalonData, value: any) => {
    setSalonData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addService = (categoryId: number) => {
    setSalonData(prev => ({
      ...prev,
      serviceCategories: prev.serviceCategories.map(cat => 
        cat.id === categoryId ? {
          ...cat,
          services: [...cat.services, {
            id: Date.now(),
            name: 'Nouvelle prestation',
            price: 0,
            duration: '1h',
            description: 'Description de la prestation'
          }]
        } : cat
      )
    }));
  };

  const updateService = (categoryId: number, serviceId: number, updates: Partial<Service>) => {
    setSalonData(prev => ({
      ...prev,
      serviceCategories: prev.serviceCategories.map(cat => 
        cat.id === categoryId ? {
          ...cat,
          services: cat.services.map(service => 
            service.id === serviceId ? { ...service, ...updates } : service
          )
        } : cat
      )
    }));
  };

  const deleteService = (categoryId: number, serviceId: number) => {
    setSalonData(prev => ({
      ...prev,
      serviceCategories: prev.serviceCategories.map(cat => 
        cat.id === categoryId ? {
          ...cat,
          services: cat.services.filter(service => service.id !== serviceId)
        } : cat
      )
    }));
  };

  const toggleCategory = (categoryId: number) => {
    setSalonData(prev => ({
      ...prev,
      serviceCategories: prev.serviceCategories.map(cat => 
        cat.id === categoryId ? { ...cat, expanded: !cat.expanded } : cat
      )
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto bg-white shadow-lg">
        {/* Header avec boutons d'action */}
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="text-gray-700 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className={`text-gray-700 ${isEditing ? 'bg-violet-100 text-violet-700' : 'hover:bg-gray-100'}`}
              >
                <Edit3 className="w-4 h-4 mr-1" />
                {isEditing ? 'Mode Aperçu' : 'Modifier'}
              </Button>
              {isEditing && (
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={saveMutation.isPending}
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                >
                  <Save className="w-4 h-4 mr-1" />
                  {saveMutation.isPending ? 'Sauvegarde...' : 'Enregistrer'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Photo de couverture éditable - SUPPRIMÉE */}
        {/* La bannière violette est complètement supprimée */}

        {/* Informations du salon */}
        <div className="p-4 space-y-4">
          {/* Nom du salon */}
          <div>
            {isEditing ? (
              <Input
                value={salonData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="text-xl font-bold bg-white border-gray-300 text-gray-900"
                placeholder="Nom du salon"
              />
            ) : (
              <h1 className="text-xl font-bold text-gray-900">{salonData.name}</h1>
            )}
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-yellow-600 font-medium">{salonData.rating}</span>
              <span className="text-gray-500">({salonData.reviews} avis)</span>
              {salonData.verified && (
                <CheckCircle className="w-4 h-4 text-blue-500 ml-2" />
              )}
            </div>
          </div>

          {/* Description courte */}
          <div>
            {isEditing ? (
              <Textarea
                value={salonData.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="bg-white border-gray-300 text-gray-900 text-sm"
                placeholder="Description courte du salon"
                rows={2}
              />
            ) : (
              <p className="text-gray-600 text-sm">{salonData.description}</p>
            )}
          </div>

          {/* Adresse et téléphone */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              {isEditing ? (
                <Input
                  value={salonData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 text-sm"
                  placeholder="Adresse"
                />
              ) : (
                <span>{salonData.address}</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4" />
              {isEditing ? (
                <Input
                  value={salonData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 text-sm"
                  placeholder="Téléphone"
                />
              ) : (
                <span>{salonData.phone}</span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <div className="flex">
            {['services', 'infos', 'avis'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-violet-600 border-b-2 border-violet-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'services' && 'Services'}
                {tab === 'infos' && 'Infos'}
                {tab === 'avis' && 'Avis'}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="p-4">
          {activeTab === 'services' && (
            <div className="space-y-4">
              {salonData.serviceCategories.map((category) => (
                <Card key={category.id} className="bg-white border-gray-200 shadow-sm">
                  <CardContent className="p-4">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <div className="flex items-center gap-2">
                        {isEditing && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              addService(category.id);
                            }}
                            className="text-violet-600 hover:bg-violet-50"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        )}
                        <span className="text-gray-500">
                          {category.expanded ? '−' : '+'}
                        </span>
                      </div>
                    </div>
                    
                    {category.expanded && (
                      <div className="mt-3 space-y-3">
                        {category.services.map((service) => (
                          <div key={service.id} className="border-t border-gray-200 pt-3">
                            {isEditing ? (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Input
                                    value={service.name}
                                    onChange={(e) => updateService(category.id, service.id, { name: e.target.value })}
                                    className="bg-white border-gray-300 text-gray-900 text-sm"
                                    placeholder="Nom du service"
                                  />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => deleteService(category.id, service.id)}
                                    className="text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    type="number"
                                    value={service.price}
                                    onChange={(e) => updateService(category.id, service.id, { price: parseInt(e.target.value) })}
                                    className="bg-white border-gray-300 text-gray-900 text-sm"
                                    placeholder="Prix"
                                  />
                                  <Input
                                    value={service.duration}
                                    onChange={(e) => updateService(category.id, service.id, { duration: e.target.value })}
                                    className="bg-white border-gray-300 text-gray-900 text-sm"
                                    placeholder="Durée"
                                  />
                                </div>
                                <Textarea
                                  value={service.description || ''}
                                  onChange={(e) => updateService(category.id, service.id, { description: e.target.value })}
                                  className="bg-white border-gray-300 text-gray-900 text-sm"
                                  placeholder="Description"
                                  rows={2}
                                />
                              </div>
                            ) : (
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">{service.name}</h4>
                                  {service.description && (
                                    <p className="text-gray-600 text-xs mt-1">{service.description}</p>
                                  )}
                                  <div className="flex items-center gap-3 mt-2 text-sm">
                                    <div className="flex items-center gap-1 text-gray-500">
                                      <Clock className="w-3 h-3" />
                                      <span>{service.duration}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-violet-600">{service.price}€</div>
                                  <Button 
                                    size="sm" 
                                    className="mt-2 bg-violet-600 hover:bg-violet-700 text-white"
                                  >
                                    Réserver
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'infos' && (
            <div className="space-y-4">
              {/* Histoire du salon */}
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">À propos du salon</h3>
                  {isEditing ? (
                    <Textarea
                      value={salonData.longDescription}
                      onChange={(e) => updateField('longDescription', e.target.value)}
                      className="bg-white border-gray-300 text-gray-900 text-sm min-h-[120px]"
                      placeholder="Histoire et description détaillée du salon"
                    />
                  ) : (
                    <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                      {salonData.longDescription}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Certifications</h3>
                  <div className="space-y-2">
                    {salonData.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-gray-700 text-sm">{cert}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Récompenses */}
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Récompenses</h3>
                  <div className="space-y-2">
                    {salonData.awards.map((award, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700 text-sm">{award}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'avis' && (
            <div className="space-y-4">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Avis clients</h3>
                  <div className="text-center text-gray-500">
                    <p>Section en développement</p>
                    <p className="text-sm mt-1">Les avis clients seront bientôt disponibles</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}