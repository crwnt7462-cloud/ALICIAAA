import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from '@/lib/utils';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Check, 
  User, 
  Mail,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  MapIcon
} from "lucide-react";

interface SalonPageTemplateProps {
  salonSlug: string;
  salonData: any;
  services?: any[];
  staff?: any[];
  reviews?: any[];
  isOwner?: boolean;
  customColors?: {
    primary: string;
    accent: string;
    buttonText: string;
    buttonClass?: string;
    priceColor?: string;
    neonFrame?: string;
    intensity: number;
  };
}

export default function SalonPageTemplateFixed({ 
  salonSlug, 
  salonData, 
  services = [], 
  staff = [], 
  reviews = [], 
  isOwner = false, 
  customColors 
}: SalonPageTemplateProps) {
  
  // Fonction pour récupérer les services assignés à un employé
  const getMemberServices = (memberId: number) => {
    // Récupérer tous les services du salon
    const allServices = salonData?.services || services || [];
    
    // Logique d'assignation des services par employé
    const member = staff.find(m => m.id === memberId);
    if (!member) return [];
    
    // Si l'employé a des spécialités, on peut filtrer les services
    if (member.specialties && member.specialties.length > 0) {
      return allServices.filter(service => 
        member.specialties.some(specialty => 
          service.name.toLowerCase().includes(specialty.toLowerCase()) ||
          specialty.toLowerCase().includes(service.name.toLowerCase())
        )
      );
    }
    
    // Par défaut, tous les employés peuvent proposer tous les services
    return allServices;
  };
  const [location] = useLocation();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('services');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
    depositAmount: '0'
  });

  // Utiliser les vraies données du salon avec fallback
  const activeSalonData = {
    name: salonData?.name || "Salon Avyento",
    description: salonData?.description || "Excellence et innovation au service de votre beauté",
    address: salonData?.address || "123 Boulevard Haussmann, 75008 Paris",
    phone: salonData?.phone || "01 42 65 78 90",
    email: salonData?.email || "contact@avyento.fr",
    images: salonData?.photos || ["/api/placeholder/400/300"],
    rating: salonData?.rating || 4.8,
    reviewCount: salonData?.reviewCount || 247,
    services: salonData?.serviceCategories?.flatMap(cat => 
      cat.services.map(service => ({
        id: service.id,
        name: service.name,
        duration: formatDuration(service.duration),
        price: service.price,
        description: service.description || ''
      }))
    ) || [
      {
        id: 1,
        name: "Coupe & Brushing",
        duration: "1h",
        price: 65,
        description: "Coupe personnalisée selon votre morphologie"
      }
    ],
    staff: [
      { id: 1, name: "Sarah", specialties: ["Coupe", "Coloration"] }
    ],
    schedule: {
      lundi: "9h-19h",
      mardi: "9h-19h", 
      mercredi: "9h-19h",
      jeudi: "9h-19h",
      vendredi: "9h-20h",
      samedi: "9h-18h",
      dimanche: "Fermé"
    }
  };

  const handleBooking = () => {
    if (!selectedService || !selectedDate || !selectedTime || !formData.firstName) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Réservation confirmée !",
      description: `Rendez-vous pour ${selectedService.name} le ${selectedDate} à ${selectedTime}`,
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === activeSalonData.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? activeSalonData.images.length - 1 : prev - 1
    );
  };

  // Couleurs par défaut si non spécifiées
  const colors = customColors || {
    primary: '#8B5CF6',
    accent: '#F59E0B',
    buttonText: '#FFFFFF',
    buttonClass: 'glass-button-purple',
    priceColor: '#7c3aed',
    neonFrame: '#a855f7',
    intensity: 70
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50">
      {/* En-tête avec image - TAILLE RÉDUITE */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={activeSalonData.images[currentImageIndex]}
          alt={activeSalonData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        
        {activeSalonData.images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30"
              onClick={prevImage}
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30"
              onClick={nextImage}
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </Button>
          </>
        )}

        {/* Actions flottantes */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
          >
            <Share2 className="h-5 w-5 text-white" />
          </Button>
        </div>

        {/* Informations salon - VERSION COMPACTE */}
        <div className="absolute bottom-2 left-4 right-4">
          <div className="bg-white/90 backdrop-blur-md rounded-lg p-3">
            <h1 className="text-xl font-bold text-gray-900 mb-1">{activeSalonData.name}</h1>
            <div className="flex items-center space-x-3 text-xs text-gray-600">
              <div className="flex items-center">
                <Star className="h-3 w-3 text-yellow-400 mr-1" />
                <span className="font-medium">{activeSalonData.rating}</span>
                <span className="ml-1">({activeSalonData.reviewCount})</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="truncate">{activeSalonData.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b z-10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-6 overflow-x-auto">
            {[
              { id: 'services', label: 'Services' },
              { id: 'equipe', label: 'Équipe' },
              { id: 'avis', label: 'Avis' },
              { id: 'infos', label: 'Infos' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? `border-[${colors.primary}] text-[${colors.primary}]`
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                style={{
                  borderColor: activeTab === tab.id ? colors.primary : 'transparent',
                  color: activeTab === tab.id ? colors.primary : undefined
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-6 max-w-md lg:max-w-none lg:w-full">
        {activeTab === 'services' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Nos Services</h2>
            {activeSalonData.services.map((service: any) => (
              <Card 
                key={service.id} 
                className={`cursor-pointer transition-all hover:shadow-lg bg-slate-50/80 backdrop-blur-16 border-slate-400/20 ${
                  selectedService?.id === service.id ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => setSelectedService(service)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{service.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div 
                        className="text-xl font-bold"
                        style={{ color: colors.priceColor }}
                      >
                        {service.price}€
                      </div>
                      {selectedService?.id === service.id && (
                        <Check className="h-5 w-5 text-green-500 mt-1 ml-auto" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'equipe' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Notre Équipe</h2>
            <div className="grid gap-4">
              {activeSalonData.staff.map((member: any) => (
                <Card key={member.id} className="bg-slate-50/80 backdrop-blur-16 border-slate-400/20">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {getMemberServices(member.id).map((service: any, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {service.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'avis' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Avis Clients</h2>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="font-semibold">{activeSalonData.rating}</span>
                <span className="text-gray-600">({activeSalonData.reviewCount} avis)</span>
              </div>
            </div>
            
            <Card className="bg-slate-50/80 backdrop-blur-16 border-slate-400/20">
              <CardContent className="p-4">
                <p className="text-center text-gray-600 py-8">
                  Les avis clients seront affichés ici prochainement.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'infos' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Informations</h2>
            
            <Card className="bg-slate-50/80 backdrop-blur-16 border-slate-400/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Horaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(activeSalonData.schedule).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="capitalize font-medium">{day}</span>
                      <span>{hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-50/80 backdrop-blur-16 border-slate-400/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Contact & Localisation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MapIcon className="h-4 w-4 text-gray-500" />
                  <span>{activeSalonData.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{activeSalonData.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{activeSalonData.email}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Formulaire de réservation fixe en bas */}
      {selectedService && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
          <Card className="bg-slate-50/80 backdrop-blur-16 border-slate-400/20">
            <CardHeader>
              <CardTitle className="text-lg">Réserver - {selectedService.name}</CardTitle>
              <CardDescription>
                {selectedService.duration} • {selectedService.price}€
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); handleBooking(); }} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Heure *</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00">09h00</SelectItem>
                        <SelectItem value="10:00">10h00</SelectItem>
                        <SelectItem value="11:00">11h00</SelectItem>
                        <SelectItem value="14:00">14h00</SelectItem>
                        <SelectItem value="15:00">15h00</SelectItem>
                        <SelectItem value="16:00">16h00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes (optionnel)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Demandes particulières..."
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full text-lg py-3 bg-slate-50/80 backdrop-blur-16 border-slate-400/20 hover:bg-slate-100/90"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.buttonText
                  }}
                >
                  {selectedService && activeSalonData?.requireDeposit ? (
                    <div className="flex items-center justify-center">
                      <Check className="w-5 h-5 mr-2" />
                      Réserver maintenant
                      {selectedService && activeSalonData?.requireDeposit && ` (${formData.depositAmount}€)`}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Check className="w-5 h-5 mr-2" />
                      Réserver maintenant
                      {selectedService && activeSalonData?.requireDeposit && ` (${formData.depositAmount}€)`}
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-8 text-sm text-gray-600">
        <div className="flex items-center justify-center space-x-4">
          <span>✅ Paiement sécurisé</span>
          <span>✅ Confirmation immédiate</span>
          <span>✅ Annulation gratuite 24h</span>
        </div>
        <p className="mt-4">
          Propulsé par Avyento - Solution de réservation pour professionnels de la beauté
        </p>
      </div>
    </div>
  );
}