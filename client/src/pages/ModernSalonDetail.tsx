import { useState } from 'react';
import { useLocation } from 'wouter';
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

interface Service {
  id: number;
  name: string;
  duration: string;
  price: number;
  originalPrice?: number;
  specialist: string;
  description: string;
}

export default function ModernSalonDetail() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('services');

  const salon = {
    id: 1,
    name: "Excellence Paris",
    rating: 4.8,
    reviews: 247,
    address: "15 Avenue des Champs-Élysées, 75008 Paris",
    phone: "01 42 25 76 89",
    verified: true,
    certifications: [
      "Salon labellisé L'Oréal Professionnel",
      "Formation continue Kérastase",
      "Certification bio Shu Uemura"
    ],
    awards: [
      "Élu Meilleur Salon Paris 8ème 2023",
      "Prix de l'Innovation Beauté 2022",
      "Certification Éco-responsable"
    ]
  };

  const services: Service[] = [
    {
      id: 1,
      name: "Coupe + Brushing Expert",
      duration: "90 min",
      price: 75,
      originalPrice: 95,
      specialist: "Sarah - Expert certifiée",
      description: "Coupe personnalisée avec analyse morphologique"
    },
    {
      id: 2,
      name: "Coloration Premium",
      duration: "2h30",
      price: 120,
      originalPrice: 150,
      specialist: "Marie - Coloriste senior",
      description: "Coloration sur mesure avec produits haut de gamme"
    },
    {
      id: 3,
      name: "Soin Réparateur Intense",
      duration: "45 min",
      price: 55,
      specialist: "Lisa - Spécialiste soins",
      description: "Traitement profond pour cheveux abîmés"
    }
  ];

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
              { id: 'services', label: 'Services' },
              { id: 'avis', label: 'Avis' },
              { id: 'infos', label: 'Infos' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-white border-b-2 border-violet-600'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 pb-20">
          {activeTab === 'services' && (
            <div className="space-y-4">
              <h2 className="text-xl font-light text-white mb-4">Nos services</h2>
              
              {services.map((service) => (
                <Card key={service.id} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-white mb-1">{service.name}</h3>
                        <p className="text-sm text-gray-400 mb-2">{service.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{service.duration}</span>
                          <span>•</span>
                          <span>{service.specialist}</span>
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-semibold text-white">{service.price}€</span>
                          {service.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              {service.originalPrice}€
                            </span>
                          )}
                          {service.originalPrice && (
                            <span className="text-xs bg-red-600 text-white px-1.5 py-0.5 rounded">
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
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                <h3 className="text-lg font-medium text-white mb-4">Histoire du salon</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  Fondé en 2015 par Marie Dubois, passionnée de beauté et diplômée de l'École Française de Coiffure, 
                  notre salon s'est rapidement imposé comme une référence dans le quartier. Notre philosophie repose 
                  sur l'excellence technique, l'innovation et l'écoute de nos clients.
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Nous travaillons exclusivement avec des marques premium comme L'Oréal Professionnel, 
                  Kérastase et Shu Uemura pour garantir des résultats exceptionnels à chaque visite.
                </p>
              </div>
                
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                <h3 className="font-medium text-white mb-3">Nos certifications</h3>
                <div className="space-y-2">
                  {salon.certifications.map((cert, idx) => (
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