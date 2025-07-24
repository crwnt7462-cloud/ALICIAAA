import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Crown
} from "lucide-react";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  originalPrice?: number;
  specialist: string;
  level: 'Standard' | 'Premium' | 'Expert' | 'Haute Couture';
  badges?: string[];
}

interface Review {
  id: number;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
  verified: boolean;
}

export default function ModernSalonDetail() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('services');
  const [isFavorite, setIsFavorite] = useState(false);

  const salon = {
    id: "salon-excellence",
    name: "Salon Excellence Paris",
    subtitle: "Institut de beauté haut de gamme",
    description: "Depuis 15 ans, nous redéfinissons l'excellence dans l'univers de la beauté. Notre équipe de maîtres artisans vous accueille dans un écrin de luxe au cœur du 16ème arrondissement.",
    address: "45 Avenue Victor Hugo, 75116 Paris",
    phone: "01 47 04 32 18",
    rating: 4.9,
    reviews: 847,
    verified: true,
    certifications: ["Label Excellence", "Éco-Responsable", "Formation Continue"],
    story: "Fondé par Maître Coiffeur Catherine Moreau, notre salon perpétue la tradition française de l'art capillaire. Chaque geste, chaque technique reflète notre passion pour la beauté authentique et l'innovation constante.",
    awards: ["Prix Excellence Paris 2024", "Meilleur Salon Éco-Responsable", "Certification Maître Artisan"]
  };

  const services: Service[] = [
    {
      id: 1,
      name: "Coupe Signature Maître",
      description: "Coupe personnalisée par notre Maître Coiffeur, analyse morphologique incluse",
      price: 95,
      originalPrice: 120,
      duration: 90,
      specialist: "Catherine M. - Maître Coiffeur",
      level: "Haute Couture",
      badges: ["Exclusive", "15 ans d'expérience"]
    },
    {
      id: 2,
      name: "Coloration Experte Végétale",
      description: "Coloration 100% végétale avec diagnostic capillaire complet",
      price: 145,
      originalPrice: 180,
      duration: 180,
      specialist: "Sophie L. - Coloriste Expert",
      level: "Expert",
      badges: ["Éco-Responsable", "Garantie résultat"]
    },
    {
      id: 3,
      name: "Soin Visage Diamond",
      description: "Protocole anti-âge aux actifs précieux, effet lifting immédiat",
      price: 120,
      originalPrice: 150,
      duration: 75,
      specialist: "Marie D. - Dermato-Esthéticienne",
      level: "Premium",
      badges: ["Anti-âge", "Résultats prouvés"]
    },
    {
      id: 4,
      name: "Manucure Française Excellence",
      description: "Manucure française perfectionnée, vernis longue tenue premium",
      price: 65,
      originalPrice: 80,
      duration: 60,
      specialist: "Lisa K. - Nail Artist",
      level: "Premium",
      badges: ["Tenue 3 semaines", "Produits luxury"]
    },
    {
      id: 5,
      name: "Massage Relaxant Signature",
      description: "Massage corps complet aux huiles essentielles bio sélectionnées",
      price: 85,
      originalPrice: 110,
      duration: 60,
      specialist: "Julie M. - Massothérapeute",
      level: "Standard",
      badges: ["Bio", "Détente garantie"]
    },
    {
      id: 6,
      name: "Épilation Laser Nouvelle Génération",
      description: "Technologie laser dernière génération, indolore et efficace",
      price: 180,
      originalPrice: 220,
      duration: 45,
      specialist: "Dr. Martin - Dermatologue",
      level: "Expert",
      badges: ["Indolore", "Résultats durables"]
    }
  ];

  const reviews: Review[] = [
    {
      id: 1,
      clientName: "Sophie M.",
      rating: 5,
      comment: "Une expérience exceptionnelle ! Catherine a transformé mes cheveux avec une expertise remarquable. L'accueil est chaleureux et le cadre absolument magnifique.",
      date: "Il y a 2 jours",
      service: "Coupe Signature Maître",
      verified: true
    },
    {
      id: 2,
      clientName: "Marie L.",
      rating: 5,
      comment: "Le soin visage Diamond a dépassé toutes mes attentes. Ma peau est éclatante et le résultat anti-âge est bluffant. Je recommande vivement !",
      date: "Il y a 5 jours",
      service: "Soin Visage Diamond",
      verified: true
    },
    {
      id: 3,
      clientName: "Emma D.",
      rating: 5,
      comment: "Salon d'exception ! La coloration végétale de Sophie est parfaite, mes cheveux n'ont jamais été aussi beaux et en si bonne santé.",
      date: "Il y a 1 semaine",
      service: "Coloration Experte Végétale",
      verified: true
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Haute Couture': return 'bg-gray-100 text-gray-700 font-medium';
      case 'Expert': return 'bg-gray-100 text-gray-700 font-medium';
      case 'Premium': return 'bg-gray-100 text-gray-700 font-medium';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'Haute Couture': return <Crown className="w-3 h-3" />;
      case 'Expert': return <Zap className="w-3 h-3" />;
      case 'Premium': return <Sparkles className="w-3 h-3" />;
      default: return <CheckCircle className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto bg-white shadow-sm">
        {/* Header moderne */}
        <div className="relative bg-gray-900 text-white">
          <div className="absolute top-4 left-4 z-10">
            <Button
              variant="ghost"
              onClick={() => setLocation('/')}
              className="h-10 w-10 p-0 rounded-full bg-white/20 hover:bg-white/30 text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`h-10 w-10 p-0 rounded-full ${isFavorite ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'} text-white`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              className="h-10 w-10 p-0 rounded-full bg-white/20 hover:bg-white/30 text-white"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="px-4 pt-16 pb-6">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-xl font-bold">{salon.name}</h1>
              {salon.verified && (
                <span className="text-xs text-gray-300">
                  ✓ Vérifié
                </span>
              )}
            </div>
            
            <p className="text-gray-300 text-sm mb-3">{salon.subtitle}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-300 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-gray-400" />
                <span className="text-white font-medium">{salon.rating}</span>
                <span>({salon.reviews} avis)</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>16ème arrondissement</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {salon.certifications.map((cert, idx) => (
                <span key={idx} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="bg-white border-b sticky top-0 z-20">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-50 rounded-none h-12">
              <TabsTrigger value="services" className="text-sm">Services</TabsTrigger>
              <TabsTrigger value="story" className="text-sm">Histoire</TabsTrigger>
              <TabsTrigger value="avis" className="text-sm">Avis</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Contenu des onglets */}
        <div className="p-4">
          {activeTab === 'services' && (
            <div className="space-y-3">
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-1">Nos services d'exception</h2>
                <p className="text-sm text-gray-600">Découvrez notre gamme de prestations haut de gamme</p>
              </div>

              {services.map((service) => (
                <Card key={service.id} className="border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">{service.name}</h3>
                          <Badge className={`text-xs ${getLevelColor(service.level)}`}>
                            {getLevelIcon(service.level)}
                            <span className="ml-1">{service.level}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                        <div className="text-xs text-gray-500 mb-2">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {service.duration}min • {service.specialist}
                        </div>
                        
                        {service.badges && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {service.badges.map((badge, idx) => (
                              <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {badge}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {service.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">{service.originalPrice}€</span>
                        )}
                        <span className="text-lg font-bold text-gray-900">{service.price}€</span>
                        {service.originalPrice && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            -{Math.round((1 - service.price / service.originalPrice) * 100)}%
                          </span>
                        )}
                      </div>
                      <Button 
                        onClick={() => setLocation('/booking')}
                        className="bg-gray-900 hover:bg-gray-800 text-white h-8 px-4 text-sm"
                      >
                        Réserver
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'story' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-3">Notre histoire</h2>
                <p className="text-gray-700 leading-relaxed mb-4">{salon.story}</p>
                
                <div className="bg-purple-50 rounded-lg p-4 mb-4">
                  <h3 className="font-medium text-purple-900 mb-2">Nos récompenses</h3>
                  <div className="space-y-2">
                    {salon.awards.map((award, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-purple-600" />
                        <span className="text-purple-800">{award}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{salon.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{salon.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">Lun-Sam 9h-19h</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'avis' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Avis clients</h2>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{salon.rating}</span>
                  <span className="text-sm text-gray-500">({salon.reviews} avis)</span>
                </div>
              </div>

              <div className="space-y-3">
                {reviews.map((review) => (
                  <Card key={review.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{review.clientName}</span>
                          {review.verified && (
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Vérifié
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
                      <p className="text-xs text-purple-600">{review.service}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bouton de réservation fixe */}
        <div className="sticky bottom-0 bg-white border-t p-4">
          <Button 
            onClick={() => setLocation('/booking')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-base font-medium"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Réserver maintenant
          </Button>
        </div>
      </div>
    </div>
  );
}