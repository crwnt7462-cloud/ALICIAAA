import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  User,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Edit3,
  Save,
  Upload,
  Trash2,
  Plus,
  Palette,
  ExternalLink,
  Eye,
  Camera,
  Facebook,
  Instagram
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ImageCropper from '@/components/ImageCropper';

export default function SalonCreation() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('services');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('coiffure');
  const [isEditing, setIsEditing] = useState(true); // En mode édition par défaut
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string>('');
  const { toast } = useToast();

  // Couleurs personnalisées - MODIFIABLES
  const [customColors, setCustomColors] = useState({
    primary: '#8b5cf6',
    accent: '#f59e0b',
    intensity: 'medium' as 'light' | 'medium' | 'dark',
    buttonText: '#ffffff'
  });
  
  // Données du salon - MODIFIABLES
  const [salonData, setSalonData] = useState({
    name: "Nouveau Salon",
    verified: false,
    rating: 4.8,
    reviewCount: 0,
    priceRange: "€€€",
    address: "Votre adresse",
    backgroundImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=800&fit=crop&q=80"
  });

  // Onglets de navigation
  const tabs = [
    { id: 'services', label: 'Services', active: activeTab === 'services' },
    { id: 'equipe', label: 'Équipe', active: activeTab === 'equipe' },
    { id: 'galerie', label: 'Galerie', active: activeTab === 'galerie' },
    { id: 'infos', label: 'Infos', active: activeTab === 'infos' },
    { id: 'avis', label: 'Avis', active: activeTab === 'avis' }
  ];

  // Services avec photos - MODIFIABLES
  const [serviceCategories, setServiceCategories] = useState([
    {
      id: 'coiffure',
      name: 'Coiffure',
      description: 'Coupes, colorations et coiffages',
      count: 4,
      services: [
        {
          name: 'Coupe homme classique',
          description: 'Coupe traditionnelle avec finition soignée',
          price: 35,
          duration: 45,
          rating: 4.5,
          reviews: 12,
          image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=100&h=100&fit=crop&q=80',
          photos: [
            { url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop&q=80', description: 'Coupe classique avant' },
            { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80', description: 'Coupe classique après' },
            { url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&q=80', description: 'Finition soignée' }
          ],
          serviceReviews: [
            { name: "Marc D.", rating: 5, comment: "Excellente coupe, très professionnel !", date: "Il y a 3 jours" },
            { name: "Thomas L.", rating: 4, comment: "Bon service, je recommande.", date: "Il y a 1 semaine" },
            { name: "Pierre M.", rating: 5, comment: "Parfait comme toujours !", date: "Il y a 2 semaines" }
          ]
        }
      ]
    }
  ]);

  // Équipe - MODIFIABLE
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'Sarah Martin',
      role: 'Coiffeuse Senior',
      specialties: ['Colorations', 'Coupes tendances', 'Soins capillaires'],
      rating: 4.9,
      reviewsCount: 127,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b00bd264?w=150&h=150&fit=crop&crop=face',
      availableToday: true,
      nextSlot: '14:30',
      experience: '8 ans d\'expérience',
      bio: 'Passionnée par les nouvelles tendances, Sarah vous accompagne dans votre transformation capillaire.'
    }
  ]);

  // Avis - MODIFIABLES
  const [reviews] = useState([
    {
      id: 1,
      name: 'Marie L.',
      rating: 5,
      date: 'Il y a 2 jours',
      comment: 'Service exceptionnel ! Sarah a réalisé exactement la coupe que je souhaitais.',
      service: 'Coupe + Brushing',
      verified: true,
      photos: ['https://images.unsplash.com/photo-1562004760-acb5501b6c56?w=200&h=200&fit=crop&q=80']
    }
  ]);

  // Auto-save function
  const autoSave = async () => {
    if (!isAutoSaving) {
      setIsAutoSaving(true);
      try {
        // Simulate save
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast({
          title: "Sauvegarde automatique",
          description: "Vos modifications ont été sauvegardées",
        });
      } catch (error) {
        console.error('Erreur de sauvegarde:', error);
      } finally {
        setIsAutoSaving(false);
      }
    }
  };

  // Auto-save when data changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isEditing) {
        autoSave();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [salonData, serviceCategories, teamMembers, reviews, isEditing]);

  const handleSalonDataChange = (field: string, value: any) => {
    setSalonData(prev => ({ ...prev, [field]: value }));
  };

  const addService = (categoryId: string) => {
    const newService = {
      name: 'Nouveau service',
      description: 'Description du service',
      price: 50,
      duration: 60,
      rating: 0,
      reviews: 0,
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100&h=100&fit=crop&q=80',
      photos: [],
      serviceReviews: []
    };

    setServiceCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, services: [...cat.services, newService] }
          : cat
      )
    );
  };

  const addTeamMember = () => {
    const newMember = {
      id: Date.now(),
      name: 'Nouveau coiffeur',
      role: 'Coiffeur',
      specialties: [],
      rating: 0,
      reviewsCount: 0,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b00bd264?w=150&h=150&fit=crop&crop=face',
      availableToday: true,
      nextSlot: '14:30',
      experience: 'Nouveau',
      bio: 'Bio à remplir'
    };
    setTeamMembers(prev => [...prev, newMember]);
  };

  // Palettes de couleurs prédéfinies (simplifié - une seule couleur)
  const colorPresets = [
    { name: 'Violet Modern', color: '#8b5cf6' },
    { name: 'Rose Élégant', color: '#ec4899' },
    { name: 'Indigo Pro', color: '#6366f1' },
    { name: 'Émeraude Fresh', color: '#10b981' },
    { name: 'Bleu Classic', color: '#3b82f6' },
    { name: 'Cyan Moderne', color: '#06b6d4' }
  ];

  // État pour la couleur unique
  const [primaryColor, setPrimaryColor] = useState('#8b5cf6');

  // Fonction pour gérer l'upload d'image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setTempImageUrl(imageUrl);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fonction pour ouvrir le recadreur avec l'image actuelle
  const handleCropImage = () => {
    setTempImageUrl(salonData.backgroundImage);
    setIsCropperOpen(true);
  };

  // Fonction appelée après le recadrage
  const handleCropComplete = (croppedImageUrl: string) => {
    setSalonData(prev => ({
      ...prev,
      backgroundImage: croppedImageUrl
    }));
    toast({
      title: "Image mise à jour",
      description: "Votre photo de couverture a été recadrée avec succès",
    });
  };

  // Fonction pour appliquer la couleur aux boutons
  const getButtonStyle = (variant: 'solid' | 'outline' = 'solid') => {
    if (variant === 'outline') {
      return {
        backgroundColor: 'transparent',
        color: primaryColor,
        borderColor: primaryColor,
        border: `1px solid ${primaryColor}`
      };
    }
    
    return {
      backgroundColor: primaryColor,
      color: 'white',
      border: 'none'
    };
  };

  // Fonction pour sauvegarder les couleurs du salon
  const saveSalonColors = async (color: string) => {
    try {
      const response = await fetch('/api/salon/colors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          primaryColor: color,
          salonId: 'demo-user' // ID du salon actuel
        }),
      });
      
      if (response.ok) {
        console.log('✅ Couleurs sauvegardées:', color);
      }
    } catch (error) {
      console.error('❌ Erreur sauvegarde couleurs:', error);
    }
  };

  // Fonction pour appliquer une palette
  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    setPrimaryColor(preset.color);
    saveSalonColors(preset.color); // Sauvegarder automatiquement
    toast({
      title: "Couleur appliquée",
      description: `Palette "${preset.name}" appliquée avec succès`,
    });
  };

  // Fonction pour déplacer une catégorie
  const moveCategoryUp = (categoryId: string) => {
    setServiceCategories(prev => {
      const index = prev.findIndex(cat => cat.id === categoryId);
      if (index > 0) {
        const newOrder = [...prev];
        [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
        return newOrder;
      }
      return prev;
    });
  };

  const moveCategoryDown = (categoryId: string) => {
    setServiceCategories(prev => {
      const index = prev.findIndex(cat => cat.id === categoryId);
      if (index < prev.length - 1) {
        const newOrder = [...prev];
        [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
        return newOrder;
      }
      return prev;
    });
  };

  // Fonction pour changer la photo d'un membre
  const changeMemberPhoto = (memberId: number) => {
    // Simulation du changement de photo
    const photos = [
      'https://images.unsplash.com/photo-1494790108755-2616b00bd264?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    ];
    const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
    
    setTeamMembers(prev => 
      prev.map(member => 
        member.id === memberId 
          ? { ...member, avatar: randomPhoto }
          : member
      )
    );
    
    toast({
      title: "Photo mise à jour",
      description: "La photo du membre a été changée",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête fixe avec actions d'édition */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/salon-page-editor')}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Créateur de salon</h1>
              <p className="text-sm text-gray-500">Mode édition activé</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAutoSaving && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                <div className="animate-spin h-3 w-3 border border-blue-300 border-t-blue-600 rounded-full"></div>
                <span className="text-xs">Sauvegarde...</span>
              </div>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('/salon', '_blank')}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Aperçu
            </Button>

            <Button
              size="sm"
              onClick={autoSave}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700"
            >
              <Save className="h-4 w-4" />
              Sauvegarder
            </Button>
          </div>
        </div>
      </div>

      {/* Header salon avec image de fond */}
      <div className="relative">
        <div 
          className="h-32 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${salonData.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          {isEditing && (
            <div className="absolute top-2 right-2 flex gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="cover-image-upload"
              />
              <label 
                htmlFor="cover-image-upload"
                className="flex items-center gap-1 px-3 py-2 bg-white/90 hover:bg-white rounded-lg text-sm font-medium cursor-pointer transition-colors"
              >
                <Upload className="h-4 w-4" />
                Changer
              </label>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCropImage}
                className="bg-violet-600/90 hover:bg-violet-700 text-white"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        {/* Informations salon */}
        <div className="bg-white px-4 pb-4">
          <div className="flex items-start gap-4 -mt-8 relative z-10">
            <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-violet-600">
                {salonData.name.charAt(0)}
              </span>
            </div>
            
            <div className="flex-1 mt-8">
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={salonData.name}
                    onChange={(e) => handleSalonDataChange('name', e.target.value)}
                    className="text-xl font-bold border-0 p-0 h-auto bg-transparent"
                    placeholder="Nom du salon"
                  />
                  <Input
                    value={salonData.address}
                    onChange={(e) => handleSalonDataChange('address', e.target.value)}
                    className="text-sm text-gray-600 border-0 p-0 h-auto bg-transparent"
                    placeholder="Adresse complète"
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{salonData.name}</h1>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {salonData.address}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{salonData.rating}</span>
                  <span className="text-xs text-gray-500">({salonData.reviewCount} avis)</span>
                </div>
                {salonData.verified && (
                  <Badge variant="secondary" className="bg-green-50 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Vérifié
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {salonData.priceRange}
                </Badge>
              </div>
            </div>
            
            <Button 
              className="mt-8" 
              style={getButtonStyle('solid')}
            >
              Réserver
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex overflow-x-auto px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                tab.active
                  ? 'text-gray-900 hover:text-gray-900 hover:border-gray-300'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
              style={tab.active ? { borderColor: primaryColor, color: primaryColor } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="p-4 space-y-6">
        {activeTab === 'services' && (
          <div className="space-y-4">
            {serviceCategories.map((category) => (
              <Card key={category.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 flex-1">
                      {isEditing && (
                        <div className="flex flex-col gap-1 mr-2">
                          <button
                            onClick={() => moveCategoryUp(category.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                            disabled={serviceCategories.findIndex(cat => cat.id === category.id) === 0}
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => moveCategoryDown(category.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                            disabled={serviceCategories.findIndex(cat => cat.id === category.id) === serviceCategories.length - 1}
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                        className="flex items-center gap-2 text-left flex-1"
                      >
                        <div>
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {category.services.length} service{category.services.length > 1 ? 's' : ''}
                          </span>
                          {expandedCategory === category.id ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </button>
                    </div>
                    
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addService(category.id)}
                        className="ml-2"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {expandedCategory === category.id && (
                    <div className="space-y-3">
                      {category.services.map((service, index) => (
                        <div key={index} className="border border-gray-100 rounded-lg p-3">
                          <div className="flex items-start gap-3">
                            <img 
                              src={service.image}
                              className="w-12 h-12 rounded-lg object-cover"
                              alt={service.name}
                            />
                            <div className="flex-1">
                              {isEditing ? (
                                <div className="space-y-2">
                                  <Input
                                    value={service.name}
                                    className="font-medium"
                                    placeholder="Nom du service"
                                  />
                                  <Textarea
                                    value={service.description}
                                    className="text-sm text-gray-600"
                                    placeholder="Description du service"
                                    rows={2}
                                  />
                                  <div className="flex gap-2">
                                    <Input
                                      type="number"
                                      value={service.price}
                                      className="w-20"
                                      placeholder="Prix"
                                    />
                                    <span className="self-center text-sm text-gray-500">€</span>
                                    <Input
                                      type="number"
                                      value={service.duration}
                                      className="w-20"
                                      placeholder="Durée"
                                    />
                                    <span className="self-center text-sm text-gray-500">min</span>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <h4 className="font-medium text-gray-900">{service.name}</h4>
                                  <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                      <span className="font-semibold text-violet-600">{service.price}€</span>
                                      <span className="text-xs text-gray-500">{service.duration}min</span>
                                    </div>
                                    {service.rating > 0 && (
                                      <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs">{service.rating} ({service.reviews})</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {isEditing && (
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {isEditing && (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="p-8 text-center">
                  <Button variant="ghost" className="text-gray-500">
                    <Plus className="h-5 w-5 mr-2" />
                    Ajouter une catégorie de services
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'equipe' && (
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img 
                        src={member.avatar}
                        className="w-16 h-16 rounded-full object-cover"
                        alt={member.name}
                      />
                      {isEditing && (
                        <button
                          onClick={() => changeMemberPhoto(member.id)}
                          className="absolute -bottom-1 -right-1 bg-white border-2 border-gray-200 rounded-full p-1 hover:bg-gray-50"
                        >
                          <Camera className="w-3 h-3 text-gray-600" />
                        </button>
                      )}
                    </div>
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            value={member.name}
                            className="font-semibold text-lg"
                            placeholder="Nom du coiffeur"
                          />
                          <Input
                            value={member.role}
                            className="text-violet-600 font-medium"
                            placeholder="Poste/Rôle"
                          />
                          <Textarea
                            value={member.bio}
                            className="text-sm text-gray-600"
                            placeholder="Biographie"
                            rows={2}
                          />
                        </div>
                      ) : (
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{member.name}</h3>
                          <p className="text-violet-600 font-medium mb-1">{member.role}</p>
                          <p className="text-sm text-gray-600 mb-3">{member.bio}</p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 mb-3">
                        {member.specialties.map((specialty, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {isEditing && (
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            <Plus className="h-3 w-3 mr-1" />
                            Spécialité
                          </Button>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{member.rating}</span>
                            <span className="text-xs text-gray-500">({member.reviewsCount})</span>
                          </div>
                          {member.availableToday && (
                            <Badge variant="secondary" className="bg-green-50 text-green-700 text-xs">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                              Disponible
                            </Badge>
                          )}
                        </div>
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          style={getButtonStyle('outline')}
                        >
                          Réserver avec {member.name.split(' ')[0]}
                        </Button>
                      </div>
                    </div>
                    
                    {isEditing && (
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {isEditing && (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="p-8 text-center">
                  <Button variant="ghost" onClick={addTeamMember} className="text-gray-500">
                    <Plus className="h-5 w-5 mr-2" />
                    Ajouter un membre de l'équipe
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'galerie' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Galerie photos</h3>
              <p className="text-gray-600 text-sm mb-4">Ajoutez vos plus belles réalisations</p>
              
              {isEditing && (
                <Card className="border-dashed border-2 border-gray-300">
                  <CardContent className="p-8 text-center">
                    <Button variant="ghost" className="text-gray-500">
                      <Upload className="h-5 w-5 mr-2" />
                      Ajouter des photos
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {activeTab === 'infos' && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Informations pratiques</h3>
                
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Téléphone</label>
                      <Input placeholder="01 23 45 67 89" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Facebook</label>
                      <Input placeholder="https://facebook.com/votre-salon" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Instagram</label>
                      <Input placeholder="https://instagram.com/votre-salon" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Horaires</label>
                      <Textarea 
                        placeholder="Lun-Ven: 9h-19h&#10;Sam: 9h-17h&#10;Dim: Fermé"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                      <Textarea 
                        placeholder="Décrivez votre salon, vos spécialités, votre équipe..."
                        rows={4}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">01 23 45 67 89</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Facebook className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">@salon-avyento</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Instagram className="w-4 h-4 text-pink-600" />
                      <span className="text-sm">@salon.avyento</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Lun-Ven: 9h-19h, Sam: 9h-17h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{salonData.address}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'avis' && (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            value={review.name}
                            className="font-medium"
                            placeholder="Nom du client"
                          />
                          <Textarea
                            value={review.comment}
                            className="text-sm text-gray-600"
                            placeholder="Commentaire"
                            rows={2}
                          />
                          <div className="flex gap-2 items-center">
                            <span className="text-sm text-gray-500">Note:</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star}
                                  className={`w-4 h-4 cursor-pointer ${
                                    star <= review.rating 
                                      ? 'fill-yellow-400 text-yellow-400' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{review.name}</span>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3 h-3 ${
                                    i < review.rating 
                                      ? 'fill-yellow-400 text-yellow-400' 
                                      : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">{review.date}</span>
                          </div>
                          <p className="text-sm text-gray-600">{review.comment}</p>
                          {review.service && (
                            <Badge variant="outline" className="text-xs mt-2">
                              {review.service}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {isEditing && (
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {isEditing && (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="p-8 text-center">
                  <Button variant="ghost" className="text-gray-500">
                    <Plus className="h-5 w-5 mr-2" />
                    Ajouter un avis exemple
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Barre d'actions flottante */}
      <div className="fixed bottom-4 right-4 bg-white rounded-full shadow-lg border border-gray-200 p-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className={`rounded-full ${isEditing ? 'bg-violet-100 text-violet-600' : ''}`}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsColorModalOpen(true)}
            className="rounded-full"
          >
            <Palette className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open('/salon', '_blank')}
            className="rounded-full"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Modal de personnalisation moderne */}
      <Dialog open={isColorModalOpen} onOpenChange={setIsColorModalOpen}>
        <DialogContent className="max-w-lg mx-auto bg-white/90 backdrop-blur-2xl border-white/30 shadow-2xl rounded-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center pb-6">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Couleur du salon
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-2">
              Cette couleur apparaîtra sur vos boutons et accents
            </p>
          </DialogHeader>
          
          <div className="space-y-8">
            {/* Palettes prédéfinies - Design minimaliste */}
            <div>
              <h4 className="font-semibold mb-6 text-gray-900">Couleurs prédéfinies</h4>
              <div className="grid grid-cols-2 gap-4">
                {colorPresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => applyColorPreset(preset)}
                    className={`group flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                      primaryColor === preset.color 
                        ? 'border-current bg-white/70 shadow-lg scale-[1.02]' 
                        : 'border-gray-200/40 bg-white/40 hover:bg-white/60'
                    }`}
                    style={{ borderColor: primaryColor === preset.color ? preset.color : undefined }}
                  >
                    <div 
                      className="w-8 h-8 rounded-full shadow-md flex-shrink-0"
                      style={{ backgroundColor: preset.color }}
                    />
                    <span className="text-base font-medium text-gray-800 group-hover:text-gray-900 truncate">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Couleur personnalisée */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <h4 className="font-semibold mb-4 text-gray-900">Couleur personnalisée</h4>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-14 h-14 rounded-2xl border-2 border-white/50 cursor-pointer shadow-lg"
                  />
                </div>
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#8b5cf6"
                  className="flex-1 bg-white/60 border-white/50 rounded-xl text-base"
                />
              </div>
            </div>

            {/* Aperçu simplifié */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <h4 className="font-semibold mb-4 text-gray-900">Aperçu</h4>
              <div 
                style={{
                  backgroundColor: primaryColor,
                  color: 'white',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                  transition: 'all 0.2s',
                  width: '100%',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)';
                }}
              >
                Réserver maintenant
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsColorModalOpen(false)}
                className="flex-1 h-12 bg-white/30 border-white/50 hover:bg-white/50 rounded-xl"
              >
                Annuler
              </Button>
              <Button
                onClick={() => {
                  saveSalonColors(primaryColor); // Sauvegarder la couleur
                  setIsColorModalOpen(false);
                  toast({
                    title: "Couleur appliquée",
                    description: "La couleur de votre salon a été mise à jour",
                  });
                }}
                style={{
                  backgroundColor: primaryColor,
                  color: 'white',
                  border: 'none'
                }}
                className="flex-1 h-12 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold rounded-xl hover:opacity-90"
              >
                Appliquer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Recadreur d'image */}
      <ImageCropper
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        onCropComplete={handleCropComplete}
        imageUrl={tempImageUrl}
        aspectRatio={16/9}
      />
    </div>
  );
}