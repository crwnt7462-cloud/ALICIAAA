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
      case 'Haute Couture': return 'bg-white/20 text-gray-200';
      case 'Expert': return 'bg-white/15 text-gray-300';
      case 'Premium': return 'bg-white/10 text-gray-400';
      default: return 'bg-white/5 text-gray-500';
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
              onClick={() => setLocation('/')}
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
                          <span className="text-sm text-gray-500 line-through">{service.originalPrice}€</span>
                        )}
                        <span className="text-xl font-light text-white">{service.price}€</span>
                        {service.originalPrice && (
                          <span className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded border border-white/20">
                            -{Math.round((1 - service.price / service.originalPrice) * 100)}%
                          </span>
                        )}
                      </div>
                      <Button 
                        onClick={() => setLocation('/booking')}
                        className="bg-white text-black hover:bg-gray-200 h-9 px-6 text-sm font-medium border border-white/20"
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
          )}
        </div>

        {/* Bouton de réservation fixe */}
        <div className="bg-black border-t border-gray-800 p-4">
          <Button 
            onClick={() => setLocation('/booking')}
            className="w-full bg-white text-black hover:bg-gray-200 h-12 text-base font-medium"
          >
            Réserver maintenant
          </Button>
        </div>
      </div>
    </div>
  );
}