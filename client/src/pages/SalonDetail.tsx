import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Clock,
  Calendar,
  CheckCircle,
  Award,
  ChevronDown,
  ChevronUp,
  User,
  Palette,
  Heart,
  Share2
} from "lucide-react";

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
    intensity: number;
  };
  serviceCategories?: ServiceCategory[];
}

export default function SalonDetail() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('services');
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Extraire l'ID du salon depuis l'URL
  const salonId = location.split('/salon/')[1];
  
  // Récupérer les données réelles du salon depuis l'API
  const { data: salonData, isLoading } = useQuery({
    queryKey: [`/api/salon/${salonId}`],
    enabled: !!salonId,
  });

  // Données par défaut si pas de données du serveur
  const salon: SalonData = salonData || {
    id: salonId || 'default-salon',
    name: 'Salon Excellence',
    rating: 4.8,
    reviews: 127,
    address: '15 rue de la Beauté, 75001 Paris',
    phone: '01 42 36 78 90',
    verified: true,
    certifications: ['Salon Certifié', 'Produits Bio'],
    awards: ['Prix Excellence 2024', 'Meilleur Salon Paris'],
    longDescription: 'Notre salon vous accueille dans un cadre moderne et chaleureux pour vous offrir une expérience beauté exceptionnelle.',
    coverImageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&auto=format',
    photos: [],
    customColors: {
      primary: '#7c3aed',
      accent: '#a855f7',
      buttonText: '#ffffff',
      buttonClass: 'glass-button-purple',
      intensity: 35
    },
    serviceCategories: []
  };

  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(
    salon.serviceCategories || [
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
      }
    ]
  );

  // Mettre à jour les catégories de services quand les données du salon sont chargées
  useEffect(() => {
    if (salonData?.serviceCategories) {
      setServiceCategories(salonData.serviceCategories);
    }
  }, [salonData]);

  const toggleCategory = (categoryId: number) => {
    setServiceCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, expanded: !cat.expanded }
          : cat
      )
    );
  };

  // Générer le style personnalisé des boutons
  const getCustomButtonStyle = () => {
    const primaryColor = salon.customColors?.primary || '#7c3aed';
    const intensity = salon.customColors?.intensity || 35;
    
    const rgb = parseInt(primaryColor.slice(1), 16);
    const r = (rgb >> 16) & 255;
    const g = (rgb >> 8) & 255;
    const b = rgb & 255;
    
    const primaryOpacity = intensity / 100;
    const secondaryOpacity = Math.max(0.05, (intensity - 5) / 100);
    
    return {
      background: `linear-gradient(135deg, rgba(${r}, ${g}, ${b}, ${primaryOpacity}) 0%, rgba(${r}, ${g}, ${b}, ${secondaryOpacity}) 100%)`,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: 'none',
      boxShadow: `0 6px 20px rgba(${r}, ${g}, ${b}, 0.25), inset 0 2px 0 rgba(255, 255, 255, 0.4)`,
      color: '#000000',
      fontWeight: '600',
      borderRadius: '0.75rem',
      transition: 'all 0.3s ease'
    };
  };

  const handleBookService = (service: Service, category: ServiceCategory) => {
    const serviceData = {
      id: service.id,
      name: service.name,
      description: service.description,
      duration: service.duration,
      price: service.price,
      category: category.name
    };
    sessionStorage.setItem('selectedService', JSON.stringify(serviceData));
    setLocation('/booking');
  };

  // Onglets identiques à SalonPageEditor
  const tabs = [
    { id: 'services', label: 'Services', icon: Calendar },
    { id: 'info', label: 'Infos', icon: MapPin },
    { id: 'couleurs', label: 'Couleurs', icon: Palette },
    { id: 'avis', label: 'Avis', icon: Star }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec photo de couverture - IDENTIQUE à SalonPageEditor */}
      <div className="relative h-64 bg-gradient-to-br from-amber-600 to-orange-700">
        <img 
          src={salon.coverImageUrl} 
          alt={salon.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        {/* Boutons d'action dans le header */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <button 
            onClick={() => window.history.back()}
            className="glass-button-secondary w-10 h-10 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`glass-button-secondary w-10 h-10 rounded-full flex items-center justify-center ${isFavorite ? 'bg-red-500/20' : ''}`}
            >
              <Heart className={`h-5 w-5 text-white ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button className="glass-button-secondary w-10 h-10 rounded-full flex items-center justify-center">
              <Share2 className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
        
        {/* Informations salon en overlay - IDENTIQUE à SalonPageEditor */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold">{salon.name}</h1>
            {salon.verified && (
              <CheckCircle className="h-5 w-5 text-blue-400" />
            )}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" style={{ 
                color: salon.customColors?.primary || '#7c3aed',
                fill: salon.customColors?.primary || '#7c3aed' 
              }} />
              <span className="font-semibold">{salon.rating}</span>
              <span className="opacity-80">({salon.reviews} avis)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="opacity-80">Le Marais</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets - IDENTIQUE à SalonPageEditor */}
      <div className="bg-white border-b">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'border-b-2'
                  : 'glass-button-secondary'
              }`}
              style={activeTab === tab.id ? {
                ...getCustomButtonStyle(),
                borderBottomColor: salon.customColors?.primary || '#7c3aed'
              } : {}}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu des onglets - IDENTIQUE à SalonPageEditor */}
      <div className="p-4">
        {activeTab === 'services' && (
          <div className="space-y-4">
            {serviceCategories.map(category => (
              <Card key={category.id} className="overflow-hidden">
                <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
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
                </div>

                {category.expanded && (
                  <CardContent className="p-0 border-t border-gray-100">
                    <div className="divide-y divide-gray-100">
                      {category.services.map(service => (
                        <div key={service.id} className="p-4 flex items-center justify-between">
                          <div className="flex-1">
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
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-bold text-lg">{service.price}€</p>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="mt-2 px-4 py-2 text-sm font-semibold rounded-xl"
                              style={getCustomButtonStyle()}
                              onClick={() => handleBookService(service, category)}
                            >
                              Réserver
                            </motion.button>
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
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-violet-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Adresse</h4>
                    <p className="text-gray-600">{salon.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-violet-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Téléphone</h4>
                    <p className="text-gray-600">{salon.phone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">À propos</h4>
                  <p className="text-gray-600">{salon.longDescription}</p>
                </div>
                {salon.certifications && salon.certifications.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {salon.certifications.map((cert: string, index: number) => (
                        <Badge key={index} className="bg-violet-100 text-violet-800">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'couleurs' && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-lg mx-auto mb-2"
                      style={{ backgroundColor: salon.customColors?.primary || '#7c3aed' }}
                    ></div>
                    <p className="text-sm text-gray-600">Couleur principale</p>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-lg mx-auto mb-2"
                      style={{ backgroundColor: salon.customColors?.accent || '#a855f7' }}
                    ></div>
                    <p className="text-sm text-gray-600">Couleur d'accent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'avis' && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-current" />
                <span className="text-gray-900 font-semibold text-lg">{salon.rating}/5</span>
              </div>
              <span>{salon.reviews} avis vérifiés</span>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-violet-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Marie L.</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-amber-400 fill-current" />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">Il y a 2 jours</span>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-xs">Vérifié</Badge>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-2">
                    Service exceptionnel ! L'équipe est très professionnelle et le salon magnifique. Je recommande vivement !
                  </p>
                  
                  <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded inline-block">
                    Service : Coupe + Styling
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Bouton de réservation général en bas */}
      <div className="bg-white border-t p-4 sticky bottom-0">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 text-lg font-semibold rounded-xl"
          style={getCustomButtonStyle()}
          onClick={() => setLocation('/booking')}
        >
          Réserver maintenant
        </motion.button>
      </div>
    </div>
  );
}