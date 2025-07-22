import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, Clock, Euro, User, Phone, Mail, CreditCard,
  CheckCircle, Star, MapPin, Calendar as CalendarIcon,
  Award, Shield, Sparkles, Users, MessageSquare, 
  ThumbsUp, Zap, Heart, Camera, Gift, Crown, Wifi, 
  Coffee, Car, Check, ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function ModernBooking() {
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
    subtitle: "L'Art Capillaire de Luxe",
    address: "42 rue de Rivoli, Paris 1er",
    phone: "01 42 96 17 83",
    rating: 4.9,
    reviews: 1247,
    verified: true,
    nextAvailable: "Aujourd'hui 14h30",
    specialties: ["Coiffure Haute Couture", "Coloration Bio", "Soins Experts"],
    certifications: ["L'Oréal Professionnel", "Kérastase Expert", "Olaplex Certified"],
    amenities: [
      { icon: Wifi, label: "WiFi Gratuit" },
      { icon: Coffee, label: "Café Offert" },
      { icon: Car, label: "Parking Partenaire" },
      { icon: Gift, label: "Produits Premium" }
    ],
    awards: ["Meilleur Salon 2024", "Prix Innovation Bio"]
  };

  const services = [
    { 
      id: "1", 
      name: "Signature Cut", 
      subtitle: "Coupe Femme Haute Couture",
      duration: 75, 
      price: 85,
      originalPrice: 95,
      description: "Coupe personnalisée par nos stylistes experts avec diagnostic capillaire complet et conseil style sur-mesure",
      popular: true,
      level: "Master Stylist",
      includes: ["Diagnostic capillaire", "Shampoing premium", "Coupe signature", "Styling pro", "Conseil look"],
      specialist: "Sarah Michel",
      experience: "15 ans",
      guarantee: "Retouche gratuite 21 jours",
      category: "signature"
    },
    { 
      id: "2", 
      name: "Royal Color", 
      subtitle: "Coloration Haute Couture",
      duration: 180, 
      price: 160,
      originalPrice: 190,
      description: "Transformation couleur complète avec produits L'Oréal Professionnel et technique exclusive",
      premium: true,
      level: "Color Master",
      includes: ["Consultation couleur", "Test allergie", "Coloration premium", "Soin Olaplex", "Brushing signature"],
      specialist: "Amélie Durand",
      experience: "12 ans",
      guarantee: "Retouche couleur 4 semaines",
      category: "color"
    },
    { 
      id: "3", 
      name: "Luxury Balayage", 
      subtitle: "Balayage Artistique",
      duration: 240, 
      price: 220,
      originalPrice: 280,
      description: "Technique de méchage artistique main levée créant des reflets naturels sublimes",
      premium: true,
      level: "Art Director",
      includes: ["Consultation style", "Balayage main levée", "Toner sur-mesure", "Soin réparateur", "Styling final"],
      specialist: "Chloé Lambert",
      experience: "18 ans",
      guarantee: "Résultat garanti",
      category: "highlight"
    }
  ];

  const timeSlots = [
    { time: "09:00", available: true, popular: false },
    { time: "10:30", available: true, popular: true },
    { time: "12:00", available: false, popular: false },
    { time: "14:00", available: true, popular: true },
    { time: "15:30", available: true, popular: false },
    { time: "17:00", available: true, popular: true },
    { time: "18:30", available: false, popular: false }
  ];

  const handleNext = () => {
    if (isStepComplete()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleBooking = () => {
    toast({
      title: "✨ Réservation confirmée !",
      description: "Un email de confirmation vous sera envoyé dans quelques instants.",
    });
    
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

  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-rose-50/20">
      {/* Header ultra-moderne */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-rose-500 shadow-2xl">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost" 
              size="sm"
              onClick={() => setLocation("/")}
              className="text-white hover:bg-white/20 p-3 rounded-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            {/* Salon Info */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-1">{salon.name}</h1>
              <p className="text-violet-100 text-sm italic">{salon.subtitle}</p>
              <div className="flex items-center justify-center mt-2 space-x-2">
                <Star className="w-4 h-4 text-yellow-300 fill-current" />
                <span className="text-white font-medium">{salon.rating}</span>
                <span className="text-violet-100 text-sm">({salon.reviews} avis)</span>
              </div>
            </div>
            
            <div className="w-12"></div>
          </div>

          {/* Étapes modernes avec animations */}
          <div className="flex items-center justify-center space-x-4">
            {[
              { num: 1, label: "Service", icon: Sparkles },
              { num: 2, label: "Créneau", icon: CalendarIcon },
              { num: 3, label: "Infos", icon: User }
            ].map(({ num, label, icon: Icon }, index) => (
              <div key={num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    step >= num 
                      ? 'bg-white text-violet-600 shadow-lg scale-110' 
                      : 'bg-white/20 text-white/70 scale-100'
                  }`}>
                    {step > num ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <span className="text-white/90 text-xs font-medium mt-2">{label}</span>
                </div>
                
                {index < 2 && (
                  <div className={`w-16 h-1 rounded-full mx-4 transition-all duration-300 ${
                    step > num ? 'bg-white' : 'bg-white/30'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Étape 1: Sélection service */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choisissez votre service</h2>
              <p className="text-gray-600">Sélectionnez la prestation qui vous convient le mieux</p>
            </div>

            <div className="space-y-4">
              {services.map((service) => (
                <Card 
                  key={service.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                    selectedService === service.id 
                      ? 'ring-2 ring-violet-500 shadow-xl bg-gradient-to-r from-violet-50 to-purple-50' 
                      : 'hover:shadow-lg border-gray-200'
                  }`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                            <p className="text-violet-600 font-medium text-sm">{service.subtitle}</p>
                          </div>
                          
                          {service.popular && (
                            <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white">
                              <Crown className="w-3 h-3 mr-1" />
                              Populaire
                            </Badge>
                          )}
                          
                          {service.premium && (
                            <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center space-x-6 mb-3">
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            <span className="font-medium">{service.duration} min</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {service.originalPrice && (
                              <span className="text-gray-400 line-through text-sm">{service.originalPrice}€</span>
                            )}
                            <div className="flex items-center font-bold text-xl">
                              <Euro className="w-5 h-5 mr-1 text-green-600" />
                              <span className="text-green-600">{service.price}€</span>
                            </div>
                            {service.originalPrice && (
                              <Badge className="bg-red-100 text-red-700 text-xs">
                                -{Math.round((1 - service.price / service.originalPrice) * 100)}%
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 mb-3 leading-relaxed">
                          {service.description}
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-violet-700">
                            <User className="w-4 h-4 mr-1" />
                            <span className="font-medium">{service.specialist} • {service.experience}</span>
                          </div>
                          
                          <div className="flex items-center text-green-600">
                            <Shield className="w-4 h-4 mr-1" />
                            <span>{service.guarantee}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6 flex flex-col items-center space-y-2">
                        {selectedService === service.id && (
                          <CheckCircle className="w-8 h-8 text-violet-600" />
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
            </div>
          </div>
        )}

        {/* Étape 2: Sélection créneau */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choisissez votre créneau</h2>
              <p className="text-gray-600">Sélectionnez la date et l'heure qui vous conviennent</p>
            </div>

            {/* Sélection de date */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Date</h3>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 14 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() + i);
                  const dateStr = date.toISOString().split('T')[0];
                  const isToday = i === 0;
                  const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
                  const dayNum = date.getDate();
                  
                  return (
                    <Button
                      key={i}
                      variant={selectedDate === dateStr ? "default" : "outline"}
                      className={`h-16 flex flex-col ${
                        selectedDate === dateStr 
                          ? 'bg-violet-600 text-white' 
                          : 'hover:bg-violet-50'
                      }`}
                      onClick={() => setSelectedDate(dateStr)}
                    >
                      <span className="text-xs">{dayName}</span>
                      <span className="font-bold">{dayNum}</span>
                      {isToday && <span className="text-xs">Aujourd'hui</span>}
                    </Button>
                  );
                })}
              </div>
            </Card>

            {/* Sélection d'heure */}
            {selectedDate && (
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Heure</h3>
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? "default" : "outline"}
                      disabled={!slot.available}
                      className={`h-12 relative ${
                        selectedTime === slot.time 
                          ? 'bg-violet-600 text-white' 
                          : slot.available 
                            ? 'hover:bg-violet-50' 
                            : 'opacity-50'
                      }`}
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                    >
                      <span className="font-medium">{slot.time}</span>
                      {slot.popular && slot.available && (
                        <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs">
                          ⭐
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </Card>
            )}

            {/* Résumé */}
            {selectedServiceData && selectedDate && selectedTime && (
              <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 text-violet-800">Récapitulatif</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service :</span>
                      <span className="font-medium">{selectedServiceData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date :</span>
                      <span className="font-medium">{new Date(selectedDate).toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Heure :</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-violet-200">
                      <span className="text-gray-600">Prix :</span>
                      <span className="font-bold text-lg text-green-600">{selectedServiceData.price}€</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Étape 3: Informations client */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Vos informations</h2>
              <p className="text-gray-600">Dernière étape pour finaliser votre réservation</p>
            </div>

            <Card className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={clientInfo.firstName}
                    onChange={(e) => setClientInfo({...clientInfo, firstName: e.target.value})}
                    className="mt-1"
                    placeholder="Votre prénom"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Nom *</Label>
                  <Input
                    id="lastName"
                    value={clientInfo.lastName}
                    onChange={(e) => setClientInfo({...clientInfo, lastName: e.target.value})}
                    className="mt-1"
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={clientInfo.email}
                    onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}
                    className="mt-1"
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Téléphone *</Label>
                  <Input
                    id="phone"
                    value={clientInfo.phone}
                    onChange={(e) => setClientInfo({...clientInfo, phone: e.target.value})}
                    className="mt-1"
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>

              <div className="mb-4">
                <Label htmlFor="notes" className="text-sm font-medium text-gray-700">Notes particulières</Label>
                <Textarea
                  id="notes"
                  value={clientInfo.notes}
                  onChange={(e) => setClientInfo({...clientInfo, notes: e.target.value})}
                  className="mt-1"
                  placeholder="Allergies, préférences, demandes spéciales..."
                  rows={3}
                />
              </div>
            </Card>

            {/* Récapitulatif final */}
            {selectedServiceData && (
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 text-green-800">Confirmation de réservation</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Service :</span>
                      <span className="font-semibold">{selectedServiceData.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Spécialiste :</span>
                      <span className="font-medium">{selectedServiceData.specialist}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Date & Heure :</span>
                      <span className="font-medium">
                        {new Date(selectedDate).toLocaleDateString('fr-FR')} à {selectedTime}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Durée :</span>
                      <span className="font-medium">{selectedServiceData.duration} minutes</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-green-200">
                      <span className="text-gray-800 font-semibold">Total :</span>
                      <span className="font-bold text-2xl text-green-600">{selectedServiceData.price}€</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          {step > 1 ? (
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </Button>
          ) : (
            <div></div>
          )}

          {step < 3 ? (
            <Button 
              onClick={handleNext}
              disabled={!isStepComplete()}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 flex items-center space-x-2"
            >
              <span>Continuer</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleBooking}
              disabled={!isStepComplete()}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Confirmer la réservation</span>
            </Button>
          )}
        </div>
      </div>

      {/* Garanties footer */}
      <div className="max-w-2xl mx-auto px-6 pb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {salon.amenities.map((amenity, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                <amenity.icon className="w-4 h-4 text-violet-600" />
                <span>{amenity.label}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Paiement sécurisé</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Annulation gratuite 24h</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-4 h-4 text-violet-600" />
                <span>Support 7j/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}