import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { 
  MapPin, Phone, Mail, Clock, Star, Calendar, 
  CreditCard, Check, ArrowLeft, Sparkles, ChevronUp, ChevronDown,
  CheckCircle, User
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface SalonPageProps {
  pageUrl?: string;
}

export default function SalonPage({ pageUrl }: SalonPageProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Extraction de l'ID salon depuis l'URL
  const [match, params] = useRoute('/salon/:salonId');
  const salonId = params?.salonId;
  
  // États pour l'interface
  const [activeTab, setActiveTab] = useState('services');
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    'Coupes Homme': true
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    serviceId: "",
    date: "",
    time: "",
    depositAmount: 0
  });

  // Récupérer les données du salon
  const { data: salonData, isLoading: salonLoading } = useQuery({
    queryKey: [`/api/salon/${salonId}`],
    enabled: !!salonId
  });

  // Récupérer les services du salon
  const { data: services = [] } = useQuery({
    queryKey: [`/api/salon/${salonId}/services`],
    enabled: !!salonId
  });

  // Récupérer les professionnels
  const { data: professionals = [] } = useQuery({
    queryKey: [`/api/salon/${salonId}/professionals`],
    enabled: !!salonId
  });

  // Données fictives pour Lucas (employé manquant)
  const lucasData = {
    id: 999,
    name: 'Lucas Martin',
    image: '👨‍🦰',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format',
    rating: 4.8,
    specialties: ['Coupe Moderne', 'Barbe'],
    nextSlot: 'Disponible à 14:30',
    experience: '8 ans d\'expérience',
    description: 'Spécialiste des coupes modernes et du rasage traditionnel',
    available: true
  };

  // Ajouter Lucas aux professionnels s'il n'existe pas déjà
  const allProfessionals = [lucasData, ...professionals.filter((p: any) => p.name !== 'Lucas Martin')];

  // Services groupés par catégorie avec style Rendly
  const serviceCategories = [
    {
      id: 'coupes-homme',
      name: 'Coupes Homme',
      services: [
        { id: 1, name: 'Coupe Classique', price: 35, duration: '30min', description: 'Coupe traditionnelle aux ciseaux et tondeuse' },
        { id: 2, name: 'Coupe Dégradée', price: 40, duration: '35min', description: 'Dégradé moderne et personnalisé' },
        { id: 3, name: 'Coupe + Barbe', price: 55, duration: '45min', description: 'Forfait coupe + taille de barbe' }
      ]
    },
    {
      id: 'barbe-rasage',
      name: 'Barbe & Rasage',
      services: [
        { id: 4, name: 'Taille de Barbe', price: 25, duration: '20min', description: 'Taille et mise en forme de barbe' },
        { id: 5, name: 'Rasage Traditionnel', price: 45, duration: '40min', description: 'Rasage complet au coupe-chou avec serviettes chaudes' }
      ]
    }
  ];

  // Fonctions utilitaires
  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const getCustomButtonStyle = () => {
    const customColors = salonData?.customColors;
    if (!customColors?.primary) return {};
    
    return {
      background: `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.accent || customColors.primary} 100%)`,
      color: customColors.buttonText || '#ffffff',
      border: 'none',
      boxShadow: `0 4px 15px ${customColors.primary}40`
    };
  };



  // Loading
  if (salonLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Données par défaut si pas de salon trouvé
  const defaultSalonData = {
    id: salonId,
    name: 'Gentleman Barbier',
    rating: 4.9,
    reviews: 189,
    address: 'Le Marais',
    verified: true,
    customColors: null
  };

  const salon = salonData || defaultSalonData;

  return (
    <div className="min-h-screen bg-white">
      {/* Header avec image de fond */}
      <div className="relative h-80 bg-gradient-to-br from-amber-600 to-orange-700">
        <img 
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=400&fit=crop&auto=format"
          alt={salon.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        {/* Bouton retour */}
        <button 
          onClick={() => setLocation('/search')}
          className="absolute top-4 left-4 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white z-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        
        {/* Informations salon en overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold">{salon.name}</h1>
            {salon.verified && (
              <CheckCircle className="h-5 w-5 text-blue-400" />
            )}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span className="font-semibold">{salon.rating}</span>
              <span className="opacity-80">({salon.reviews} avis)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="opacity-80">{salon.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets style Rendly */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex">
          {[
            { id: 'services', label: 'Services', icon: Calendar },
            { id: 'equipe', label: 'Infos', icon: MapPin },
            { id: 'avis', label: 'Avis', icon: Star }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="pb-24">
        {activeTab === 'services' && (
          <div className="space-y-0">
            {serviceCategories.map((category) => (
              <div key={category.id}>
                {/* Header de catégorie */}
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 border-b border-gray-100 hover:bg-gray-100 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  {expandedCategories[category.name] ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                {/* Services de la catégorie */}
                {expandedCategories[category.name] && (
                  <div className="bg-white">
                    {category.services.map((service, index) => (
                      <div 
                        key={service.id} 
                        className={`p-4 flex items-center justify-between ${
                          index !== category.services.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{service.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                          <span className="text-xs text-gray-500">{service.duration}</span>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <span className="text-lg font-bold text-gray-900">{service.price}€</span>
                          <Button
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium"
                            style={salon.customColors ? getCustomButtonStyle() : {}}
                            onClick={() => setLocation(`/salon-booking/${salonId}`)}
                          >
                            Réserver
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'equipe' && (
          <div className="p-4 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Notre équipe</h3>
                <div className="space-y-4">
                  {allProfessionals.map((professional) => (
                    <div key={professional.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                      {professional.photoUrl ? (
                        <img
                          src={professional.photoUrl}
                          alt={professional.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                          {professional.image}
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{professional.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{professional.experience}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                          <span className="font-medium">{professional.rating}</span>
                          <span className="text-green-600 ml-2">{professional.nextSlot}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'avis' && (
          <div className="p-4">
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-amber-400 mx-auto mb-4 fill-amber-400" />
              <h3 className="text-xl font-semibold mb-2">{salon.rating}/5 étoiles</h3>
              <p className="text-gray-600">Basé sur {salon.reviews} avis clients</p>
            </div>
          </div>
        )}
      </div>

      {/* Bouton flottant "Réserver maintenant" */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full h-14 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg"
          style={salon.customColors ? getCustomButtonStyle() : {}}
          onClick={() => setLocation(`/salon-booking/${salonId}`)}
        >
          Réserver maintenant
        </motion.button>
      </div>
    </div>
  );

}