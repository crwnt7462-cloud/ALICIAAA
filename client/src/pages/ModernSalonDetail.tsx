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
  Crown,
  User,
  CheckCircle2
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
    <div className="min-h-screen bg-black">
      <div className="max-w-lg mx-auto bg-black">
        {/* Header futuriste */}
        <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden">
          {/* Effet de lignes géométriques */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
            <div className="absolute top-8 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
          </div>
          
          <div className="absolute top-4 left-4 z-10">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="h-10 w-10 p-0 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`h-10 w-10 p-0 rounded-full border ${isFavorite ? 'bg-white/20 border-white/40' : 'bg-white/10 border-white/20'} hover:bg-white/20 text-white`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              className="h-10 w-10 p-0 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="px-4 pt-16 pb-8 relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <h1 className="text-2xl font-light tracking-wide">{salon.name}</h1>
              {salon.verified && (
                <div className="flex items-center gap-1 text-xs text-gray-300 bg-white/10 px-2 py-1 rounded-full border border-white/20">
                  <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                  <span>Certifié</span>
                </div>
              )}
            </div>
            
            <p className="text-gray-300 text-sm mb-4 font-light">{salon.subtitle}</p>
            
            <div className="flex items-center gap-6 text-sm text-gray-300 mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-gray-400" />
                <span className="text-white font-medium">{salon.rating}</span>
                <span className="text-gray-400">({salon.reviews})</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">Paris 16ème</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {salon.certifications.map((cert, idx) => (
                <div key={idx} className="text-xs bg-white/5 text-gray-300 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                  {cert}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation par onglets futuriste */}
        <div className="bg-black border-b border-gray-800 sticky top-0 z-20">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-900 rounded-none h-14 border border-gray-800">
              <TabsTrigger value="services" className="text-sm text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gray-800 border-r border-gray-800">Services</TabsTrigger>
              <TabsTrigger value="story" className="text-sm text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gray-800 border-r border-gray-800">Histoire</TabsTrigger>
              <TabsTrigger value="avis" className="text-sm text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gray-800">Avis</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Contenu des onglets futuriste */}
        <div className="p-4 bg-black">
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="mb-6">
                <h2 className="text-xl font-light text-white mb-2">Services d'exception</h2>
                <p className="text-sm text-gray-400">Prestations haut de gamme avec technologies avancées</p>
              </div>

              {services.map((service, index) => (
                <Card key={service.id} className="bg-gray-900 border border-gray-800 hover:border-gray-700 hover:bg-gray-800 transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-1 h-6 bg-gradient-to-b from-white to-gray-400"></div>
                          <h3 className="font-medium text-white">{service.name}</h3>
                          <div className={`text-xs px-2 py-1 rounded-full ${getLevelColor(service.level)} border border-gray-700`}>
                            {getLevelIcon(service.level)}
                            <span className="ml-1">{service.level}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 mb-3 leading-relaxed">{service.description}</p>
                        <div className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          <span>{service.duration}min</span>
                          <span className="text-gray-600">•</span>
                          <span>{service.specialist}</span>
                        </div>
                        
                        {service.badges && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {service.badges.map((badge, idx) => (
                              <span key={idx} className="text-xs bg-white/5 text-gray-300 px-2 py-1 rounded border border-white/10">
                                {badge}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                      <div className="flex items-center gap-3">
                        {service.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">{service.originalPrice}€ TTC</span>
                        )}
                        <span className="text-xl font-light text-white">{service.price}€ TTC</span>
                        {service.originalPrice && (
                          <span className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded border border-white/20">
                            -{Math.round((1 - service.price / service.originalPrice) * 100)}%
                          </span>
                        )}
                      </div>
                      <Button 
                        onClick={() => setLocation('/booking')}
                        className="bg-violet-600 hover:bg-violet-700 text-white rounded-md px-3 py-1 text-xs font-medium h-7"
                        size="sm"
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
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-light text-white mb-2">Notre histoire</h2>
                <p className="text-sm text-gray-400">15 ans d'excellence dans l'art de la beauté</p>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                  <h3 className="text-lg font-medium text-white mb-3">La vision</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {salon.story}
                  </p>
                </div>

                <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                  <h3 className="text-lg font-medium text-white mb-3">Nos distinctions</h3>
                  <div className="space-y-3">
                    {salon.awards.map((award, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 bg-white/5 rounded border border-white/10">
                        <div className="w-1 h-8 bg-gradient-to-b from-white to-gray-400"></div>
                        <span className="text-gray-300">{award}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                  <h3 className="text-lg font-medium text-white mb-3">Engagements</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-medium">Éco-responsabilité</h4>
                        <p className="text-gray-400 text-sm">Produits biologiques et pratiques durables</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-medium">Formation continue</h4>
                        <p className="text-gray-400 text-sm">Équipe formée aux dernières techniques</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-medium">Excellence client</h4>
                        <p className="text-gray-400 text-sm">Service personnalisé et attentionné</p>
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
                                  className={`w-3 h-3 ${i < review.rating ? 'text-gray-400' : 'text-gray-700'}`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">{review.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-400 text-sm leading-relaxed mb-3">
                      {review.comment}
                    </p>
                    
                    <div className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/10 inline-block">
                      Service : {review.service}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-800">
                <Button 
                  className="w-full bg-white/10 text-white hover:bg-white/20 border border-white/20"
                  variant="outline"
                >
                  Voir tous les avis
                </Button>
              </div>
            </div>
                
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

        {/* Bouton de réservation fixe - plus compact */}
        <div className="sticky bottom-0 bg-black border-t border-gray-800 p-3">
          <Button 
            onClick={() => setLocation('/simple-booking')}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white h-10 text-sm font-medium rounded-lg"
          >
            <Calendar className="w-3 h-3 mr-2" />
            Réserver maintenant
          </Button>
        </div>
      </div>
    </div>
  );
}