import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, Clock, Euro, User, Phone, Mail, CreditCard,
  CheckCircle, Star, MapPin, Calendar as CalendarIcon,
  Award, Shield, Sparkles, Users, MessageSquare, 
  ThumbsUp, Zap, Heart, Camera, Gift
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function SimpleBooking() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [clientInfo, setClientInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
    isFirstVisit: true,
    newsletter: false
  });

  const salon = {
    name: "Salon Excellence Paris",
    subtitle: "L'Art Capillaire Depuis 1995",
    address: "42 rue de Rivoli, Paris 1er",
    phone: "01 42 96 17 83",
    rating: 4.9,
    reviews: 1247,
    verified: true,
    nextAvailable: "Aujourd'hui 14h30",
    specialties: ["Coiffure Haute Couture", "Coloration Bio", "Soins Experts"],
    certifications: ["L'Oréal Professionnel", "Kérastase Expert", "Olaplex Certified"],
    amenities: ["WiFi Gratuit", "Café Offert", "Parking Partenaire", "Produits Premium"],
    images: ["salon1.jpg", "salon2.jpg"],
    awards: ["Meilleur Salon 2024", "Prix Innovation Bio"]
  };

  const services = [
    { 
      id: "1", 
      name: "Coupe Femme Signature", 
      duration: 60, 
      price: 75,
      originalPrice: 85,
      description: "Coupe personnalisée par nos stylistes experts avec diagnostic capillaire complet",
      popular: true,
      level: "Expert",
      includes: ["Diagnostic capillaire", "Shampoing bio", "Coupe signature", "Brushing pro", "Conseil style"],
      specialist: "Sarah Michel - 12 ans d'expérience",
      beforeAfter: "Voir transformations",
      guarantee: "Retouche gratuite 15 jours"
    },
    { 
      id: "2", 
      name: "Coupe Homme Premium", 
      duration: 45, 
      price: 55,
      originalPrice: 65,
      description: "Coupe masculine moderne avec soin du cuir chevelu et styling personnalisé",
      includes: ["Shampoing + massage", "Coupe précision", "Soin barbe", "Styling", "Produit offert"],
      specialist: "Marco Rossi - Barbier expert",
      level: "Premium"
    },
    { 
      id: "3", 
      name: "Coloration Haute Couture", 
      duration: 150, 
      price: 135,
      originalPrice: 160,
      description: "Coloration sur mesure avec produits L'Oréal Professionnel et soin restructurant",
      premium: true,
      level: "Haute Couture",
      includes: ["Consultation coloriste", "Test allergie", "Coloration pro", "Soin Olaplex", "Brushing signature"],
      specialist: "Amélie Durand - Coloriste diplômée",
      guarantee: "Retouche couleur 3 semaines",
      beforeAfter: "Portfolio disponible"
    },
    { 
      id: "4", 
      name: "Balayage Sunset", 
      duration: 210, 
      price: 180,
      originalPrice: 220,
      description: "Technique de méchage artistique créant des reflets naturels sublimes",
      premium: true,
      level: "Artiste",
      includes: ["Consultation couleur", "Balayage main levée", "Toner personnalisé", "Soin réparateur", "Brushing + lissage"],
      specialist: "Chloé Lambert - Artiste coloriste",
      beforeAfter: "Voir nos créations",
      guarantee: "Résultat garanti ou refait"
    },
    { 
      id: "5", 
      name: "Soin Restructurant Kérastase", 
      duration: 45, 
      price: 65,
      originalPrice: 75,
      description: "Soin professionnel réparateur pour cheveux abîmés et colorés",
      includes: ["Diagnostic expert", "Soin sur-mesure", "Massage relaxant", "Brushing soyeux", "Conseil à domicile"],
      specialist: "Marie Petit - Experte soins",
      level: "Thérapeutique"
    },
    { 
      id: "6", 
      name: "Brushing Royal", 
      duration: 35, 
      price: 45,
      originalPrice: 55,
      description: "Mise en pli d'exception avec techniques professionnelles et tenue longue durée",
      includes: ["Shampoing premium", "Soin express", "Brushing technique", "Laque professionnelle"],
      level: "Pro"
    }
  ];

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: i === 0 ? "Aujourd'hui" : i === 1 ? "Demain" : date.toLocaleDateString('fr-FR', { 
          weekday: 'short', 
          day: 'numeric', 
          month: 'short' 
        })
      });
    }
    return dates;
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleBooking = () => {
    toast({
      title: "Réservation confirmée !",
      description: "Vous recevrez une confirmation par email dans quelques instants.",
    });
    
    // Redirection vers accueil après succès
    setTimeout(() => {
      setLocation('/');
    }, 2000);
  };

  const isStepComplete = () => {
    switch (step) {
      case 1: return selectedService !== "";
      case 2: return selectedDate !== "" && selectedTime !== "";
      case 3: return clientInfo.firstName.trim() && clientInfo.lastName.trim() && clientInfo.email.trim() && clientInfo.phone.trim();
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/')}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <div className="flex items-center space-x-2">
                  <div>
                    <h1 className="font-bold text-lg">{salon.name}</h1>
                    <p className="text-sm text-violet-600 italic">{salon.subtitle}</p>
                  </div>
                  {salon.verified && (
                    <Badge variant="secondary" className="bg-gradient-to-r from-gold-400 to-yellow-500 text-white text-xs">
                      <Award className="w-3 h-3 mr-1" />
                      Certifié
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{salon.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{salon.rating} ({salon.reviews} avis)</span>
                  </div>
                </div>
                <div className="flex items-center flex-wrap gap-1 mt-2">
                  {salon.awards.map((award, idx) => (
                    <Badge key={idx} className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs">
                      <Award className="w-3 h-3 mr-1" />
                      {award}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  num === step ? 'bg-violet-600 text-white' :
                  num < step ? 'bg-green-500 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {num < step ? <CheckCircle className="w-4 h-4" /> : num}
                </div>
                {num < 4 && <div className={`w-8 h-0.5 ${
                  num < step ? 'bg-green-500' : 'bg-gray-200'
                }`} />}
              </div>
            ))}
          </div>
          <div className="mt-2">
            <p className="text-sm font-medium">
              {step === 1 && "Choisissez votre service"}
              {step === 2 && "Sélectionnez un créneau"}
              {step === 3 && "Vos informations"}
              {step === 4 && "Confirmation"}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        
        {/* Étape 1: Services */}
        {step === 1 && (
          <div className="space-y-3">
            {services.map((service) => (
              <Card 
                key={service.id}
                className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                  selectedService === service.id ? 'border-violet-500 bg-violet-50' : 'border-gray-100'
                }`}
                onClick={() => setSelectedService(service.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{service.name}</h3>
                        {service.popular && (
                          <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            Top Choix
                          </Badge>
                        )}
                        {service.premium && (
                          <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                        {service.level && (
                          <Badge variant="outline" className="text-xs border-violet-300 text-violet-700">
                            {service.level}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-700 mb-2">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-violet-600" />
                          <span className="font-medium">{service.duration} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {service.originalPrice && (
                            <span className="text-gray-400 line-through text-xs">{service.originalPrice}€</span>
                          )}
                          <div className="flex items-center font-bold">
                            <Euro className="w-4 h-4 mr-1 text-green-600" />
                            <span className="text-green-600">{service.price}€</span>
                          </div>
                          {service.originalPrice && (
                            <Badge className="bg-red-100 text-red-700 text-xs">
                              -{Math.round((1 - service.price / service.originalPrice) * 100)}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex flex-col items-center space-y-2">
                      {selectedService === service.id && (
                        <CheckCircle className="w-8 h-8 text-violet-600" />
                      )}
                      {service.premium && (
                        <Gift className="w-6 h-6 text-violet-500" />
                      )}
                      {service.originalPrice && (
                        <Badge className="bg-red-500 text-white text-xs rotate-12">
                          PROMO
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Salon highlights */}
            <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Heart className="w-5 h-5 text-violet-600" />
                  <span className="font-medium text-violet-900">Pourquoi choisir {salon.name} ?</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-violet-700">
                  <div className="flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    Produits bio certifiés
                  </div>
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    15+ ans d'expérience
                  </div>
                  <div className="flex items-center">
                    <Zap className="w-3 h-3 mr-1" />
                    Techniques innovantes
                  </div>
                  <div className="flex items-center">
                    <Camera className="w-3 h-3 mr-1" />
                    Conseil personnalisé
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Étape 2: Date et heure */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Date</Label>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {getAvailableDates().map((date) => (
                  <Button
                    key={date.value}
                    variant={selectedDate === date.value ? "default" : "outline"}
                    className={`p-3 h-auto ${
                      selectedDate === date.value ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300' : ''
                    }`}
                    onClick={() => setSelectedDate(date.value)}
                  >
                    {date.label}
                  </Button>
                ))}
              </div>
            </div>

            {selectedDate && (
              <div>
                <Label className="text-base font-medium">Heure</Label>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className={`p-2 ${
                        selectedTime === time ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300' : ''
                      }`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Étape 3: Informations client */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Prénom *</Label>
                <Input
                  value={clientInfo.firstName}
                  onChange={(e) => setClientInfo({...clientInfo, firstName: e.target.value})}
                  placeholder="Votre prénom"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Nom *</Label>
                <Input
                  value={clientInfo.lastName}
                  onChange={(e) => setClientInfo({...clientInfo, lastName: e.target.value})}
                  placeholder="Votre nom"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Email *</Label>
              <Input
                type="email"
                value={clientInfo.email}
                onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}
                placeholder="votre@email.com"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Confirmation de rendez-vous envoyée par email</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Téléphone *</Label>
              <Input
                type="tel"
                value={clientInfo.phone}
                onChange={(e) => setClientInfo({...clientInfo, phone: e.target.value})}
                placeholder="06 12 34 56 78"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Rappel SMS 24h avant votre rendez-vous</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Notes particulières (optionnel)</Label>
              <Textarea
                value={clientInfo.notes}
                onChange={(e) => setClientInfo({...clientInfo, notes: e.target.value})}
                placeholder="Allergie, préférence de coiffeur, demande spéciale..."
                className="mt-1 h-20"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="firstVisit"
                  checked={clientInfo.isFirstVisit}
                  onChange={(e) => setClientInfo({...clientInfo, isFirstVisit: e.target.checked})}
                  className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                />
                <Label htmlFor="firstVisit" className="text-sm">
                  C'est ma première visite dans ce salon
                </Label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="newsletter"
                  checked={clientInfo.newsletter}
                  onChange={(e) => setClientInfo({...clientInfo, newsletter: e.target.checked})}
                  className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                />
                <Label htmlFor="newsletter" className="text-sm">
                  Recevoir les offres et nouveautés par email
                </Label>
              </div>
            </div>
            
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Première visite ?</h4>
                    <p className="text-sm text-blue-700">
                      Arrivez 10 minutes en avance pour la consultation. 
                      Notre équipe vous accueillera avec un café et discutera de vos attentes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Étape 4: Confirmation */}
        {step === 4 && (
          <div className="space-y-6">
            {/* Confirmation header */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Presque terminé !</h2>
              <p className="text-gray-600">Vérifiez vos informations avant de confirmer</p>
            </div>

            {/* Service summary */}
            <Card className="border-violet-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2 text-violet-600" />
                  Votre rendez-vous
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-violet-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-violet-900">{selectedServiceData?.name}</h3>
                      <p className="text-sm text-violet-700">{selectedServiceData?.description}</p>
                    </div>
                    {selectedServiceData?.premium && (
                      <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-2 text-violet-600" />
                      <span>{getAvailableDates().find(d => d.value === selectedDate)?.label}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-violet-600" />
                      <span>{selectedTime} ({selectedServiceData?.duration} min)</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Client</span>
                    <span className="font-medium">{clientInfo.firstName} {clientInfo.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Téléphone</span>
                    <span className="font-medium">{clientInfo.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email</span>
                    <span className="font-medium">{clientInfo.email}</span>
                  </div>
                  {clientInfo.notes && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Notes</span>
                      <span className="font-medium text-sm">{clientInfo.notes}</span>
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total à payer</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-violet-600">{selectedServiceData?.price}€</div>
                      <div className="text-xs text-gray-500">TTC</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Garantees */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center mb-1">
                  <Shield className="w-4 h-4 text-green-600 mr-2" />
                  <span className="font-medium text-green-800 text-sm">Paiement sécurisé</span>
                </div>
                <p className="text-xs text-green-700">SSL + protection Stripe</p>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-center mb-1">
                  <MessageSquare className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-800 text-sm">Annulation 24h</span>
                </div>
                <p className="text-xs text-blue-700">Gratuite et sans frais</p>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-amber-900 mb-1">Informations importantes</h4>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li>• Arrivez 5 minutes en avance</li>
                    <li>• Confirmation par email et SMS</li>
                    <li>• Rappel automatique 24h avant</li>
                    <li>• {clientInfo.isFirstVisit ? "Accueil nouvelle cliente avec consultation" : "Rendez-vous client habituel"}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-2xl mx-auto flex space-x-3">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
            >
              Retour
            </Button>
          )}
          
          {step < 4 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepComplete()}
              className="flex-1 bg-violet-600 hover:bg-violet-700"
            >
              Continuer
            </Button>
          ) : (
            <Button
              onClick={handleBooking}
              className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg"
              size="lg"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Confirmer et payer {selectedServiceData?.price}€
            </Button>
          )}
        </div>
      </div>

      {/* Spacer for fixed footer */}
      <div className="h-20"></div>
    </div>
  );
}