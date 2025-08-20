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
  Eye
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function SalonCreation() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('services');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('coiffure');
  const [isEditing, setIsEditing] = useState(true); // En mode édition par défaut
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const { toast } = useToast();
  
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
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2 bg-white/90 hover:bg-white"
            >
              <Upload className="h-4 w-4 mr-1" />
              Changer l'image
            </Button>
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
            
            <Button className="mt-8 bg-violet-600 hover:bg-violet-700 text-white">
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
                  ? 'border-violet-500 text-violet-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
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
                    <img 
                      src={member.avatar}
                      className="w-16 h-16 rounded-full object-cover"
                      alt={member.name}
                    />
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
                        
                        <Button size="sm" variant="outline">
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
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Site web</label>
                      <Input placeholder="https://votre-site.fr" />
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
    </div>
  );
}