import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  User,
  Calendar,
  CheckCircle,
  Award
} from 'lucide-react';

interface Review {
  id: number;
  clientName: string;
  rating: number;
  comment: string;
  service: string;
  date: string;
  verified: boolean;
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
  serviceCategories: any[];
  customColors?: {
    primary: string;
    accent: string;
    buttonText: string;
  };
}



export default function ModernSalonDetail() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('services');
  const [location] = useLocation();
  
  // Extraire le salonId depuis l'URL (/salon/salon-demo -> salon-demo)
  const salonId = location.startsWith('/salon/') ? location.replace('/salon/', '') : 'salon-demo';
  
  // Récupérer les vraies données du salon depuis l'API
  const { data: salonData, isLoading } = useQuery<SalonData>({
    queryKey: ['/api/booking-pages', salonId],
    retry: 2,
    refetchOnWindowFocus: false,
    staleTime: 30000 // Cache 30 secondes
  });
  
  // Données de fallback si API échoue
  const [serviceCategories, setServiceCategories] = useState([
    {
      id: 1,
      name: 'Cheveux',
      expanded: false,
      services: [
        { id: 1, name: 'Coupe Bonhomme', price: 39, duration: '30min' },
        { id: 2, name: 'Coupe Dégradée (Américain & "à blanc")', price: 46, duration: '45min' },
        { id: 3, name: 'Coupe Transformation', price: 45, duration: '45min' },
        { id: 4, name: 'Repigmentation Camo', price: 26, duration: '30min' },
        { id: 5, name: 'Coupe Petit Bonhomme (enfant -12 ans)', price: 25, duration: '30min' },
        { id: 6, name: 'Forfait Cheveux + Barbe', price: 64, duration: '1h' }
      ]
    },
    {
      id: 2,
      name: 'Barbe',
      expanded: false,
      services: [
        { id: 7, name: 'Taille de barbe classique', price: 25, duration: '30min' },
        { id: 8, name: 'Rasage traditionnel', price: 35, duration: '45min' },
        { id: 9, name: 'Barbe + Moustache', price: 30, duration: '35min' }
      ]
    },
    {
      id: 3,
      name: 'Rasage',
      expanded: false,
      services: [
        { id: 10, name: 'Rasage complet', price: 40, duration: '45min' },
        { id: 11, name: 'Rasage + Soins', price: 50, duration: '1h' }
      ]
    },
    {
      id: 4,
      name: 'Permanente & Défrisage',
      expanded: false,
      services: [
        { id: 12, name: 'Permanente homme', price: 80, duration: '2h' },
        { id: 13, name: 'Défrisage', price: 90, duration: '2h30' }
      ]
    },
    {
      id: 5,
      name: 'Épilations Barbiers',
      expanded: false,
      services: [
        { id: 14, name: 'Épilation sourcils', price: 15, duration: '15min' },
        { id: 15, name: 'Épilation nez/oreilles', price: 12, duration: '10min' }
      ]
    },
    {
      id: 6,
      name: 'Soins Barbier',
      expanded: false,
      services: [
        { id: 16, name: 'Soin visage homme', price: 45, duration: '45min' },
        { id: 17, name: 'Masque purifiant', price: 35, duration: '30min' }
      ]
    },
    {
      id: 7,
      name: 'Forfaits',
      expanded: false,
      services: [
        { id: 18, name: 'Forfait Complet', price: 85, duration: '1h30' },
        { id: 19, name: 'Forfait Détente', price: 70, duration: '1h15' }
      ]
    },
    {
      id: 8,
      name: 'Coloration & Décoloration',
      expanded: false,
      services: [
        { id: 20, name: 'Coloration homme', price: 55, duration: '1h' },
        { id: 21, name: 'Décoloration', price: 65, duration: '1h30' }
      ]
    },
    {
      id: 9,
      name: 'SPA DU CHEVEU',
      expanded: false,
      services: [
        { id: 22, name: 'Soin capillaire premium', price: 60, duration: '1h' },
        { id: 23, name: 'Traitement anti-chute', price: 75, duration: '1h15' }
      ]
    }
  ]);

  // Effect pour mettre à jour les données depuis l'API
  useEffect(() => {
    if (salonData && salonData.serviceCategories) {
      console.log('🔄 MISE À JOUR PAGE PUBLIQUE avec données API:', salonData.name);
      setServiceCategories(salonData.serviceCategories);
    }
  }, [salonData]);

  // Utiliser les vraies données de l'API ou fallback
  const salon = {
    id: salonData?.id || 1,
    name: salonData?.name || "Excellence Paris",
    rating: salonData?.rating || 4.8,
    reviews: salonData?.reviews || 247,
    address: salonData?.address || "15 Avenue des Champs-Élysées, 75008 Paris",
    phone: salonData?.phone || "01 42 25 76 89",
    verified: salonData?.verified || true,
    certifications: salonData?.certifications || [
      "Salon labellisé L'Oréal Professionnel",
      "Formation continue Kérastase",
      "Certification bio Shu Uemura"
    ],
    awards: salonData?.awards || [
      "Élu Meilleur Salon Paris 8ème 2023",
      "Prix de l'Innovation Beauté 2022",
      "Certification Éco-responsable"
    ],
    longDescription: salonData?.longDescription || "Notre salon vous accueille dans un cadre moderne et chaleureux."
  };

  // Couleurs personnalisées depuis l'API
  const customColors = salonData?.customColors || {
    primary: '#7c3aed',
    accent: '#a855f7', 
    buttonText: '#ffffff'
  };
  const customColors = salonData?.customColors || {
    primary: '#7c3aed',
    accent: '#a855f7', 
    buttonText: '#ffffff'
  };



  const reviews: Review[] = [
    {
      id: 1,
      clientName: "Sophie M.",
      rating: 5,
      comment: "Un salon exceptionnel ! Sarah a su parfaitement comprendre mes attentes. Le résultat dépasse mes espérances.",
      service: "Coupe + Brushing Expert",
      date: "Il y a 2 jours",
      verified: true
    },
    {
      id: 2,
      clientName: "Camille L.",
      rating: 5,
      comment: "Marie est une vraie artiste ! Ma coloration est parfaite et mes cheveux n'ont jamais été aussi beaux.",
      service: "Coloration Premium",
      date: "Il y a 1 semaine",
      verified: true
    },
    {
      id: 3,
      clientName: "Julie R.",
      rating: 4,
      comment: "Très bon salon, personnel professionnel et accueil chaleureux. Je recommande vivement.",
      service: "Soin Réparateur",
      date: "Il y a 2 semaines",
      verified: true
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="text-center">
              <h1 className="font-semibold text-white">{salon.name}</h1>
              <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span>{salon.rating}</span>
                <span>({salon.reviews})</span>
              </div>
            </div>
            <div className="w-10" />
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-800">
            {[
              { id: 'services', label: 'Prendre RDV' },
              { id: 'avis', label: 'Avis' },
              { id: 'infos', label: 'À-propos' },
              { id: 'offrir', label: 'Offrir' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-white border-b-2'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
                style={activeTab === tab.id ? { borderBottomColor: customColors.primary } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 pb-20">
          {activeTab === 'services' && (
            <div className="space-y-3">
              <div className="space-y-3">
                {serviceCategories.map((category, categoryIndex) => (
                <div key={category.id} className="bg-gray-900 rounded-lg border border-gray-800">
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => {
                      const newCategories = [...serviceCategories];
                      newCategories[categoryIndex].expanded = !newCategories[categoryIndex].expanded;
                      setServiceCategories(newCategories);
                    }}
                  >
                    <h3 className="font-medium text-white">{category.name}</h3>
                    <div className="text-gray-400">
                      {category.expanded ? '−' : '+'}
                    </div>
                  </div>
                  
                  {category.expanded && (
                    <div className="border-t border-gray-800">
                      {category.services.map((service, serviceIndex) => (
                        <div key={service.id} className={`p-4 flex items-center justify-between ${serviceIndex !== category.services.length - 1 ? 'border-b border-gray-800' : ''}`}>
                          <div className="flex-1">
                            <h4 className="font-medium text-white mb-1">{service.name}</h4>
                            <p className="text-sm text-gray-400">{service.price}€ • {service.duration}</p>
                          </div>
                          <Button 
                            onClick={() => setLocation('/salon-booking')}
                            className="rounded-full px-6 py-2 text-sm font-medium"
                            style={{ 
                              backgroundColor: customColors.primary,
                              color: customColors.buttonText
                            }}
                          >
                            Choisir
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'avis' && (
            <div className="space-y-4">
              <div className="mb-6">
                <h2 className="text-xl font-light text-white mb-2">Avis clients</h2>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-gray-400" />
                    <span className="text-white font-medium">{salon.rating}/5</span>
                  </div>
                  <span>{salon.reviews} avis vérifiés</span>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-white font-medium">{review.clientName}</h4>
                            {review.verified && (
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                                <span>Vérifié</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-2">{review.comment}</p>
                    <div className="text-xs text-gray-500">
                      Service : <span className="text-gray-400">{review.service}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'infos' && (
            <div className="space-y-6">
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                <h3 className="text-lg font-medium text-white mb-4">À propos du salon</h3>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {salon.longDescription}
                </p>
              </div>
                
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                <h3 className="font-medium text-white mb-3">Nos certifications</h3>
                <div className="space-y-2">
                  {salon.certifications.map((cert: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{salon.address}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{salon.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">Lun-Sam 9h-19h</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'offrir' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-light text-white mb-4">Offrir une prestation</h2>
                <div className="text-center py-8">
                  <p className="text-gray-400">Fonctionnalité bientôt disponible</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bouton de réservation fixe - plus compact */}
        <div className="sticky bottom-0 bg-black border-t border-gray-800 p-3">
          <Button 
            onClick={() => setLocation('/salon-booking')}
            className="w-full h-10 text-sm font-medium rounded-lg"
            style={{ 
              backgroundColor: customColors.primary,
              color: customColors.buttonText
            }}
          >
            <Calendar className="w-3 h-3 mr-2" />
            Réserver maintenant
          </Button>
        </div>
      </div>
    </div>
  );
}