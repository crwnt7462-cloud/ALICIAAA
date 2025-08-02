import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Clock,
  Calendar,
  Heart,
  Share2,
  CheckCircle,
  Award,
  MessageCircle,
  ChevronRight,
  Sparkles,
  Zap,
  Crown,
  User,
  CheckCircle2
} from "lucide-react";

export default function ModernSalonDetail() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('services');
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Extraire l'ID du salon depuis l'URL
  const salonId = location.split('/salon/')[1];
  
  // Récupérer les données dynamiques du salon depuis l'API
  const { data: salonData, isLoading, error } = useQuery({
    queryKey: ['/api/salon-detail', salonId],
    queryFn: async () => {
      if (!salonId) throw new Error('Salon ID manquant');
      
      // D'abord essayer l'API publique 
      try {
        const response = await fetch(`/api/public/salon/${salonId}`);
        if (response.ok) {
          return response.json();
        }
      } catch (err) {
        console.log('📍 API publique indisponible, essai API booking-pages...');
      }
      
      // Fallback sur l'API booking-pages
      const response = await fetch(`/api/booking-pages/${salonId}`);
      if (!response.ok) {
        throw new Error('Salon non trouvé');
      }
      return response.json();
    },
    enabled: !!salonId,
    retry: 2
  });
  
  // Si en cours de chargement
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  // Si erreur ou salon non trouvé
  if (error || !salonData) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-4">Salon non trouvé</h2>
        <p className="text-gray-600 mb-6">Ce salon n'existe pas ou a été supprimé.</p>
        <Button onClick={() => setLocation('/salon-search-complete')}>
          Retour à la recherche
        </Button>
      </div>
    );
  }
  
  console.log('🏪 Données salon récupérées:', salonData.name, 'ID:', salonId);
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
        { id: 12, name: 'Permanente classique', price: 80, duration: '2h' },
        { id: 13, name: 'Défrisage professionnel', price: 90, duration: '2h30' }
      ]
    },
    {
      id: 5,
      name: 'Épilations Barbiers',
      expanded: false,
      services: [
        { id: 14, name: 'Épilation visage', price: 45, duration: '45min' },
        { id: 15, name: 'Épilation sourcils', price: 20, duration: '20min' }
      ]
    },
    {
      id: 6,
      name: 'Soins Barbier',
      expanded: false,
      services: [
        { id: 16, name: 'Soin hydratant visage', price: 55, duration: '45min' },
        { id: 17, name: 'Masque purifiant', price: 40, duration: '30min' }
      ]
    },
    {
      id: 7,
      name: 'Forfaits',
      expanded: false,
      services: [
        { id: 18, name: 'Forfait complet', price: 95, duration: '2h' },
        { id: 19, name: 'Forfait découverte', price: 70, duration: '1h30' }
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

  // SUPPRIMÉ : Plus aucune référence à Salon Excellence Paris
  const salon = {
    name: "Atelier Coiffure Saint-Germain",
    subtitle: "L'art capillaire depuis 1995",
    address: "42 rue de Rivoli, Paris 1er",
    phone: "01 42 96 17 83",
    rating: 4.9,
    reviews: 324,
    categories: ["Coiffure", "Coloration", "Soins"],
    certifications: ["Certification professionnelle", "Qualité service"],
    awards: ["Salon de qualité", "Service client premium"],
    verified: true,
    longDescription: "Découvrez notre expertise en coiffure et soins capillaires dans un cadre moderne et professionnel.",
    story: "Fondé en 1995, notre salon s'est imposé comme une référence en matière de coiffure et de soins capillaires. Notre équipe d'experts passionnés met tout en œuvre pour sublimer votre beauté naturelle."
  };

  const services = [
    {
      id: 1,
      name: "Coupe & Styling Expert",
      description: "Coupe personnalisée par nos maîtres coiffeurs certifiés, avec consultation morphologique et conseils styling.",
      duration: 90,
      price: 85,
      originalPrice: 120,
      specialist: "Marie Dubois - Expert Senior",
      level: "Expert",
      badges: ["Tendance 2024", "Consultation incluse", "Garantie résultat"]
    },
    {
      id: 2,
      name: "Coloration Haute Couture",
      description: "Transformation couleur complète avec produits haut de gamme et techniques exclusives pour un résultat d'exception.",
      duration: 180,
      price: 145,
      originalPrice: 195,
      specialist: "Sophie Martin - Coloriste Master",
      level: "Haute Couture",
      badges: ["Produits premium", "Technique exclusive", "Soin profond inclus"]
    },
    {
      id: 3,
      name: "Soin Réparateur Intensif",
      description: "Traitement capillaire professionnel pour cheveux abîmés avec masques haute technologie et massage du cuir chevelu.",
      duration: 60,
      price: 65,
      originalPrice: 85,
      specialist: "Laura Petit - Trichologue",
      level: "Premium",
      badges: ["Réparation express", "Résultats visibles", "Massage inclus"]
    },
    {
      id: 4,
      name: "Balayage Technique Avancée",
      description: "Technique de balayage révolutionnaire pour un effet naturel et lumineux, réalisée par nos spécialistes certifiés.",
      duration: 120,
      price: 110,
      originalPrice: 150,
      specialist: "Emma Rousseau - Spécialiste",
      level: "Expert",
      badges: ["Technique signature", "Effet naturel", "Entretien simplifié"]
    },
    {
      id: 5,
      name: "Brushing Volume & Brillance",
      description: "Brushing professionnel avec produits volumateurs et finition brillance pour une tenue longue durée.",
      duration: 45,
      price: 45,
      originalPrice: 60,
      specialist: "Cléa Bernard - Styliste",
      level: "Premium",
      badges: ["Tenue 48h", "Volume garanti", "Finition parfaite"]
    },
    {
      id: 6,
      name: "Forfait Mariée Prestige",
      description: "Prestation complète pour le jour J : essai coiffure, maquillage, retouches et accompagnement personnalisé.",
      duration: 240,
      price: 295,
      originalPrice: 380,
      specialist: "Équipe dédiée - 3 experts",
      level: "Haute Couture",
      badges: ["Essai inclus", "Équipe dédiée", "Suivi personnalisé"]
    }
  ];

  const reviews = [
    {
      id: 1,
      clientName: "Marie L.",
      rating: 5,
      date: "Il y a 2 jours",
      comment: "Service exceptionnel ! Sophie a transformé mes cheveux avec une coloration parfaite. L'équipe est professionnelle et le salon magnifique. Je recommande vivement !",
      service: "Coloration Haute Couture",
      verified: true
    },
    {
      id: 2,
      clientName: "Julie M.",
      rating: 5,
      date: "Il y a 1 semaine",
      comment: "Première visite dans ce salon et je suis conquise ! Marie a su comprendre exactement ce que je voulais. Le résultat dépasse mes attentes.",
      service: "Coupe & Styling Expert",
      verified: true
    },
    {
      id: 3,
      clientName: "Camille R.",
      rating: 4,
      date: "Il y a 2 semaines",
      comment: "Très bon salon, ambiance relaxante et professionnelle. Le soin réparateur a vraiment redonné vie à mes cheveux. Petit bémol sur l'attente mais le résultat en vaut la peine.",
      service: "Soin Réparateur Intensif",
      verified: true
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Haute Couture': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Expert': return 'bg-violet-50 text-violet-700 border-violet-200';
      case 'Premium': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'Haute Couture': return <Crown className="w-3 h-3" />;
      case 'Expert': return <Sparkles className="w-3 h-3" />;
      case 'Premium': return <Zap className="w-3 h-3" />;
      default: return <CheckCircle className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto bg-white shadow-xl">
        {/* Header épuré */}
        <div className="relative bg-white text-gray-900 overflow-hidden border-b border-gray-100">
          
          <div className="absolute top-4 left-4 z-10">
            <Button
              variant="ghost"
              onClick={() => setLocation('/salon-search-complete')}
              className="h-9 w-9 p-0 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`h-9 w-9 p-0 rounded-full border transition-all duration-300 ${isFavorite ? 'bg-red-50 border-red-200 text-red-500' : 'bg-gray-100 border-gray-200 text-gray-600'} hover:bg-gray-200`}
            >
              <Heart className={`h-4 w-4 transition-all duration-300 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              className="h-9 w-9 p-0 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200 transition-all duration-300"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="px-4 pt-14 pb-6 relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-lg font-medium text-gray-900">{salonData.name}</h1>
              {salonData.verified && (
                <div className="flex items-center gap-1 text-xs text-violet-700 bg-violet-50 px-2 py-1 rounded-full border border-violet-200">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  <span>Certifié</span>
                </div>
              )}
            </div>
            
            <p className="text-gray-600 text-sm mb-3">{salonData.description || 'Salon de beauté professionnel'}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400" />
                <span className="text-gray-900 font-medium text-sm">{salonData.rating || 4.5}</span>
                <span className="text-gray-500 text-xs">({salonData.reviewCount || salonData.reviews || 0})</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span className="text-gray-600 text-xs">{salonData.city || salonData.location || 'Paris'}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {salonData.verified && (
                <div className="text-xs bg-violet-50 text-violet-700 px-2 py-1 rounded border border-violet-200">
                  Salon vérifié
                </div>
              )}
              {salonData.serviceCategories && salonData.serviceCategories.slice(0, 2).map((category: any, idx: number) => (
                <div key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">
                  {category.name || category}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation simple */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white rounded-none h-12 border-0">
              <TabsTrigger value="services" className="text-xs text-gray-500 data-[state=active]:text-violet-700 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-violet-600 border-r border-gray-100 transition-all duration-300">Services</TabsTrigger>
              <TabsTrigger value="story" className="text-xs text-gray-500 data-[state=active]:text-violet-700 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-violet-600 border-r border-gray-100 transition-all duration-300">Histoire</TabsTrigger>
              <TabsTrigger value="avis" className="text-xs text-gray-500 data-[state=active]:text-violet-700 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-violet-600 transition-all duration-300">Avis</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Contenu épuré */}
        <div className="p-3 bg-white">
          {activeTab === 'services' && (
            <div className="space-y-3">
              <div className="mb-3">
                <h2 className="text-base font-medium text-gray-900">Choix de la prestation</h2>
              </div>

              {serviceCategories.map((category, categoryIndex) => (
                <Card 
                  key={category.id} 
                  className="bg-white border border-gray-200 hover:border-violet-300 hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-0">
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        const newCategories = [...serviceCategories];
                        newCategories[categoryIndex].expanded = !newCategories[categoryIndex].expanded;
                        setServiceCategories(newCategories);
                      }}
                    >
                      <h3 className="font-medium text-gray-900 text-sm">{category.name}</h3>
                      <div className="text-gray-400 text-lg">
                        {category.expanded ? '−' : '+'}
                      </div>
                    </div>
                    
                    {category.expanded && (
                      <div className="border-t border-gray-100">
                        {category.services.map((service, serviceIndex) => (
                          <div key={service.id} className={`p-4 flex items-center justify-between ${serviceIndex !== category.services.length - 1 ? 'border-b border-gray-100' : ''}`}>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm mb-1">{service.name}</h4>
                              <p className="text-xs text-gray-500">{service.price}€ • {service.duration}</p>
                            </div>
                            <Button 
                              onClick={() => setLocation('/salon-booking')}
                              className="bg-violet-600 text-white hover:bg-violet-700 h-8 px-4 text-xs font-medium transition-all duration-300"
                            >
                              Choisir
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'story' && (
            <div className="space-y-4">
              <div className="mb-3">
                <h2 className="text-base font-medium text-gray-900">Notre histoire</h2>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-white border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all duration-300 cursor-pointer group animate-click-bounce"
                     onClick={(e) => {
                       e.currentTarget.classList.add('animate-click-bounce');
                       setTimeout(() => e.currentTarget.classList.remove('animate-click-bounce'), 300);
                     }}>
                  <h3 className="text-sm font-medium text-gray-900 mb-2 group-hover:text-violet-700 transition-colors flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-600" />
                    La vision
                  </h3>
                  <p className="text-xs text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors">
                    {salon.story}
                  </p>
                </div>

                <div className="p-3 bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Nos distinctions</h3>
                  <div className="space-y-2">
                    {salon.awards.map((award, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-100">
                        <div className="w-1 h-4 bg-gray-400 rounded-full"></div>
                        <span className="text-xs text-gray-800">{award}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Engagements</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                      <div className="w-1 h-1 bg-gray-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-xs text-gray-900 font-medium">Éco-responsabilité</h4>
                        <p className="text-xs text-gray-600">Produits biologiques et pratiques durables</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                      <div className="w-1 h-1 bg-gray-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-xs text-gray-900 font-medium">Formation continue</h4>
                        <p className="text-xs text-gray-600">Équipe formée aux dernières techniques</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                      <div className="w-1 h-1 bg-gray-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-xs text-gray-900 font-medium">Service client</h4>
                        <p className="text-xs text-gray-600">Service personnalisé et attentionné</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'avis' && (
            <div className="space-y-4">
              <div className="mb-6">
                <h2 className="text-xl font-light text-gray-900 mb-2">Avis clients</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="text-gray-900 font-semibold">{salon.rating}/5</span>
                  </div>
                  <span>{salon.reviews} avis vérifiés</span>
                </div>
              </div>

              <div className="space-y-3">
                {reviews.map((review, index) => (
                  <div key={review.id} className="p-4 bg-white border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all duration-300 cursor-pointer group animate-click-bounce"
                       onClick={(e) => {
                         e.currentTarget.classList.add('animate-click-bounce');
                         setTimeout(() => e.currentTarget.classList.remove('animate-click-bounce'), 300);
                       }}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs text-gray-900 font-medium">{review.clientName}</h4>
                            {review.verified && (
                              <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                <CheckCircle2 className="w-2 h-2" />
                                <span className="text-xs">Vérifié</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-2 h-2 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">{review.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-700 leading-relaxed mb-2">
                      {review.comment}
                    </p>
                    
                    <div className="text-xs text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200 inline-block">
                      Service : {review.service}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-gray-100">
                <Button 
                  className="w-full bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all duration-300 h-8 text-xs"
                  variant="outline"
                >
                  Voir tous les avis
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Bouton de réservation avec violet */}
        <div className="bg-white border-t border-gray-100 p-3">
          <Button 
            onClick={() => setLocation('/booking')}
            className="w-full bg-violet-600 text-white hover:bg-violet-700 h-11 text-sm font-medium transition-all duration-300 hover:scale-[1.01] transform active:scale-95"
          >
            Réserver maintenant
          </Button>
        </div>
      </div>
    </div>
  );
}