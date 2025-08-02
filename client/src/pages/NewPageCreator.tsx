import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Edit3, Star, Heart, MapPin, Clock, Euro, Phone, Mail, Camera } from 'lucide-react';

export default function NewPageCreator() {
  const [, setLocation] = useLocation();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [isEditingService, setIsEditingService] = useState(false);
  const [isEditingHistory, setIsEditingHistory] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);

  const [salonData, setSalonData] = useState({
    name: "Mon Salon de Beauté",
    description: "Votre salon de beauté au cœur de Paris, spécialisé dans les soins capillaires et esthétiques depuis 15 ans.",
    services: [
      { name: "Coupe & Brushing", duration: "45 min", specialist: "Expert Sophie", price: "45€" },
      { name: "Coloration", duration: "90 min", specialist: "Expert Marie", price: "80€" },
      { name: "Soin du visage", duration: "60 min", specialist: "Expert Emma", price: "65€" }
    ],
    history: "15 ans d'excellence dans l'art de la beauté. Notre équipe passionnée vous accueille dans un cadre chaleureux et moderne.",
    reviews: [
      { text: "Service exceptionnel ! Sophie est formidable.", author: "Marie D.", rating: 5 },
      { text: "Salon très professionnel, je recommande !", author: "Claire L.", rating: 5 }
    ]
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => setLocation('/pro-tools')}
              className="h-10 w-10 p-0 rounded-full hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Créateur de Pages</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              className="bg-violet-600 hover:bg-violet-700"
              onClick={() => alert('Page publiée ! Disponible sur : beautybook.com/salon/excellence-beauty-paris')}
            >
              Publier
            </Button>
            <Button 
              variant="outline"
              onClick={() => alert('Brouillon sauvegardé !')}
            >
              Sauvegarder
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* PAGE SALON */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Page Salon</h2>
              <Button 
                size="sm" 
                className="bg-violet-600 hover:bg-violet-700"
                onClick={() => alert('Mode édition activé ! Cliquez sur n\'importe quel élément pour le modifier.')}
              >
                <Edit3 className="h-3 w-3 mr-1" />
                Modifier tout
              </Button>
            </div>

            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {/* Header avec photo de couverture */}
                <div className="relative">
                  <div className="h-48 bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 flex items-center justify-center relative">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                      onClick={() => alert('Ajouter une photo de couverture')}
                    >
                      <Camera className="h-3 w-3 mr-1" />
                      Photo
                    </Button>
                    <div className="text-white text-center">
                      <h1 className="text-2xl font-bold mb-2">Photo de couverture</h1>
                      <p className="text-sm opacity-90">Cliquez pour ajouter</p>
                    </div>
                  </div>
                  
                  {/* Infos principales */}
                  <div className="p-6 bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {isEditingName ? (
                            <Input 
                              value={salonData.name}
                              onChange={(e) => setSalonData({...salonData, name: e.target.value})}
                              onBlur={() => setIsEditingName(false)}
                              onKeyPress={(e) => e.key === 'Enter' && setIsEditingName(false)}
                              className="text-2xl font-bold border-violet-300"
                            />
                          ) : (
                            <h1 
                              className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-violet-600"
                              onClick={() => setIsEditingName(true)}
                            >
                              {salonData.name}
                            </h1>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setIsEditingName(true)}
                            className="h-6 w-6 p-0"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            Paris 8ème
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            4.9 (156 avis)
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Ouvert
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          {isEditingDesc ? (
                            <Textarea 
                              value={salonData.description}
                              onChange={(e) => setSalonData({...salonData, description: e.target.value})}
                              onBlur={() => setIsEditingDesc(false)}
                              className="text-gray-700 border-violet-300"
                              rows={3}
                            />
                          ) : (
                            <p 
                              className="text-gray-700 cursor-pointer hover:text-violet-600"
                              onClick={() => setIsEditingDesc(true)}
                            >
                              {salonData.description}
                            </p>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setIsEditingDesc(true)}
                            className="h-6 w-6 p-0 flex-shrink-0"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Heart className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Photos du salon */}
                    <div className="grid grid-cols-3 gap-2 mb-6">
                      {[1, 2, 3].map((i) => (
                        <div 
                          key={i}
                          className="h-20 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200"
                          onClick={() => alert(`Changer photo ${i}`)}
                        >
                          <Camera className="h-4 w-4 text-gray-400" />
                        </div>
                      ))}
                    </div>

                    {/* Services */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">Services</h3>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setIsEditingService(!isEditingService)}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {salonData.services.map((service, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-violet-300 cursor-pointer">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900">{service.name}</h4>
                              <span className="text-lg font-semibold text-violet-600">{service.price}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>{service.duration}</span>
                              <span>•</span>
                              <span>{service.specialist}</span>
                            </div>
                            {isEditingService && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-2"
                                onClick={() => alert(`Modifier service: ${service.name}`)}
                              >
                                Modifier
                              </Button>
                            )}
                          </div>
                        ))}
                        {isEditingService && (
                          <Button 
                            variant="outline" 
                            className="w-full border-dashed"
                            onClick={() => alert('Ajouter un nouveau service')}
                          >
                            + Ajouter un service
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Histoire */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">Notre Histoire</h3>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setIsEditingHistory(!isEditingHistory)}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        {isEditingHistory ? (
                          <Textarea 
                            value={salonData.history}
                            onChange={(e) => setSalonData({...salonData, history: e.target.value})}
                            className="border-violet-300"
                            rows={3}
                          />
                        ) : (
                          <p className="text-gray-700">{salonData.history}</p>
                        )}
                      </div>
                    </div>

                    {/* Avis */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">Avis Clients</h3>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setIsEditingReview(!isEditingReview)}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {salonData.reviews.map((review, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 text-yellow-500 fill-current" />
                              ))}
                            </div>
                            <p className="text-gray-700 text-sm mb-1">"{review.text}"</p>
                            <p className="text-xs text-gray-500">- {review.author}</p>
                            {isEditingReview && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-2"
                                onClick={() => alert(`Modifier avis de ${review.author}`)}
                              >
                                Modifier
                              </Button>
                            )}
                          </div>
                        ))}
                        {isEditingReview && (
                          <Button 
                            variant="outline" 
                            className="w-full border-dashed"
                            onClick={() => alert('Ajouter un nouvel avis')}
                          >
                            + Ajouter un avis
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* PAGE RESERVATION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Page Réservation</h2>
              <Button 
                size="sm" 
                className="bg-violet-600 hover:bg-violet-700"
                onClick={() => alert('Mode édition activé ! Cliquez sur n\'importe quel élément pour le modifier.')}
              >
                <Edit3 className="h-3 w-3 mr-1" />
                Modifier tout
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Réservez votre RDV</h1>
                  <p className="text-gray-600">Choisissez votre service et votre créneau</p>
                </div>

                {/* Étapes */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-violet-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
                    <span className="ml-2 text-sm font-medium text-violet-600">Service</span>
                  </div>
                  <div className="flex-1 h-px bg-gray-200 mx-4"></div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">2</div>
                    <span className="ml-2 text-sm text-gray-600">Créneau</span>
                  </div>
                  <div className="flex-1 h-px bg-gray-200 mx-4"></div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">3</div>
                    <span className="ml-2 text-sm text-gray-600">Infos</span>
                  </div>
                </div>

                {/* Services disponibles */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Choisissez votre service</h3>
                  <div className="space-y-3">
                    {salonData.services.map((service, index) => (
                      <div 
                        key={index} 
                        className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-violet-300 hover:bg-violet-50"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{service.name}</h4>
                          <span className="text-lg font-semibold text-violet-600">{service.price}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{service.duration}</span>
                          <span>•</span>
                          <span>{service.specialist}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Créneaux disponibles */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Créneaux disponibles</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['9:00', '10:30', '11:45', '14:00', '15:30', '17:00'].map((time) => (
                      <button 
                        key={time}
                        className="p-3 text-sm border border-gray-200 rounded-lg hover:border-violet-300 hover:bg-violet-50 font-medium"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="space-y-3">
                  <Button className="w-full bg-violet-600 hover:bg-violet-700 h-12">
                    Continuer la réservation
                  </Button>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      En continuant, vous acceptez nos conditions d'utilisation
                    </p>
                  </div>
                </div>

                {/* Bouton de modification */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => alert('Modifier les paramètres de réservation')}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Modifier cette page
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}