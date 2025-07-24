import { useState } from "react";
import { useLocation } from "wouter";
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
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('services');
  const [isFavorite, setIsFavorite] = useState(false);

  const salon = {
    id: "salon-excellence",
    name: "Salon Excellence Paris",
    subtitle: "L'art de la beauté réinventé",
    rating: 4.9,
    reviews: 324,
    verified: true,
    address: "123 Avenue des Champs-Élysées, Paris 8ème",
    phone: "01 42 86 67 89",
    story: "Depuis 15 ans, le Salon Excellence Paris révolutionne l'industrie de la beauté en combinant savoir-faire traditionnel français et innovations technologiques de pointe. Notre équipe de 12 experts passionnés vous accueille dans un écrin de 200m² entièrement rénové, où chaque détail a été pensé pour votre bien-être.",
    awards: [
      "Prix d'Excellence Beauté 2024",
      "Meilleur Salon Parisien 2023",
      "Innovation Award 2022",
      "Certification Bio-Éthique"
    ],
    certifications: ["Bio-certifié", "Expert L'Oréal", "Formation Kérastase", "Technique Aveda"]
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
      comment: "Première visite chez Excellence Paris et je suis conquise ! Marie a su comprendre exactement ce que je voulais. Le résultat dépasse mes attentes.",
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
        {/* Header épuré et luxueux */}
        <div className="relative bg-white text-gray-900 overflow-hidden border-b border-gray-100">
          {/* Effet minimaliste */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>
          
          <div className="absolute top-3 left-3 z-10">
            <Button
              variant="ghost"
              onClick={() => setLocation('/')}
              className="h-8 w-8 p-0 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200 transition-all duration-300"
            >
              <ArrowLeft className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="absolute top-3 right-3 z-10 flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`h-8 w-8 p-0 rounded-full border transition-all duration-300 ${isFavorite ? 'bg-red-50 border-red-200 text-red-600' : 'bg-gray-100 border-gray-200 text-gray-600'} hover:bg-gray-200`}
            >
              <Heart className={`h-3 w-3 transition-all duration-300 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200 transition-all duration-300"
            >
              <Share2 className="h-3 w-3" />
            </Button>
          </div>

          <div className="px-4 pt-12 pb-6 relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-xl font-light text-gray-900">{salon.name}</h1>
              {salon.verified && (
                <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full border border-gray-200">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  <span>Certifié</span>
                </div>
              )}
            </div>
            
            <p className="text-gray-600 text-sm mb-3 font-light">{salon.subtitle}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400" />
                <span className="text-gray-900 font-medium text-sm">{salon.rating}</span>
                <span className="text-gray-500 text-xs">({salon.reviews})</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span className="text-gray-600 text-xs">Paris 16ème</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {salon.certifications.map((cert, idx) => (
                <div key={idx} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-200">
                  {cert}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation minimaliste */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white rounded-none h-12 border-0">
              <TabsTrigger value="services" className="text-xs text-gray-500 data-[state=active]:text-gray-900 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-gray-900 border-r border-gray-100 transition-all duration-300">Services</TabsTrigger>
              <TabsTrigger value="story" className="text-xs text-gray-500 data-[state=active]:text-gray-900 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-gray-900 border-r border-gray-100 transition-all duration-300">Histoire</TabsTrigger>
              <TabsTrigger value="avis" className="text-xs text-gray-500 data-[state=active]:text-gray-900 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-gray-900 transition-all duration-300">Avis</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Contenu sobre et élégant */}
        <div className="p-3 bg-white">
          {activeTab === 'services' && (
            <div className="space-y-3">
              <div className="mb-4">
                <h2 className="text-lg font-light text-gray-900 mb-1">Services</h2>
                <p className="text-xs text-gray-500">Prestations professionnelles</p>
              </div>

              {services.map((service, index) => (
                <Card key={service.id} className="bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-300">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 text-sm">{service.name}</h3>
                          <div className={`text-xs px-1.5 py-0.5 rounded ${getLevelColor(service.level)}`}>
                            <span className="text-xs">{service.level}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-2 leading-relaxed">{service.description}</p>
                        <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          <span>{service.duration}min</span>
                          <span className="text-gray-400">•</span>
                          <span>{service.specialist}</span>
                        </div>
                        
                        {service.badges && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {service.badges.map((badge, idx) => (
                              <span key={idx} className="text-xs bg-gray-50 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">
                                {badge}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        {service.originalPrice && (
                          <span className="text-xs text-gray-500 line-through">{service.originalPrice}€</span>
                        )}
                        <span className="text-lg font-light text-gray-900">{service.price}€</span>
                        {service.originalPrice && (
                          <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-200">
                            -{Math.round((1 - service.price / service.originalPrice) * 100)}%
                          </span>
                        )}
                      </div>
                      <Button 
                        onClick={() => setLocation('/booking')}
                        className="bg-gray-900 text-white hover:bg-gray-800 h-8 px-4 text-xs font-medium transition-all duration-300"
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
            <div className="space-y-3">
              <div className="mb-4">
                <h2 className="text-lg font-light text-gray-900 mb-1">Notre histoire</h2>
                <p className="text-xs text-gray-500">15 ans d'excellence</p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">La vision</h3>
                  <p className="text-xs text-gray-700 leading-relaxed">
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
                        <h4 className="text-xs text-gray-900 font-medium">Excellence client</h4>
                        <p className="text-xs text-gray-600">Service personnalisé et attentionné</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'avis' && (
            <div className="space-y-3">
              <div className="mb-4">
                <h2 className="text-lg font-light text-gray-900 mb-1">Avis clients</h2>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400" />
                    <span className="text-gray-900 font-medium text-xs">{salon.rating}/5</span>
                  </div>
                  <span>{salon.reviews} avis vérifiés</span>
                </div>
              </div>

              <div className="space-y-3">
                {reviews.map((review, index) => (
                  <div key={review.id} className="p-3 bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300">
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

        {/* Bouton de réservation minimaliste */}
        <div className="bg-white border-t border-gray-100 p-3">
          <Button 
            onClick={() => setLocation('/booking')}
            className="w-full bg-gray-900 text-white hover:bg-gray-800 h-10 text-sm font-medium transition-all duration-300"
          >
            Réserver maintenant
          </Button>
        </div>
      </div>
    </div>
  );
}