import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, Phone, Mail, Clock, Star, Calendar, 
  CreditCard, Check, ArrowLeft, Sparkles, Settings, Edit3, CheckCircle, Heart,
  Search, ChevronDown, Instagram, Facebook, Music
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import useSalonTeam from "@/hooks/useSalonTeam";

interface SalonPageProps {
  pageUrl?: string;
}

interface SalonData {
  id: string;
  salonName?: string;
  salonDescription?: string;
  salonAddress?: string;
  salonPhone?: string;
  salonEmail?: string;
  primaryColor?: string;
  secondaryColor?: string;
  showPrices?: boolean;
  requireDeposit?: boolean;
  depositPercentage?: number;
  selectedServices?: string[];
}

export default function SalonPageFixed({ pageUrl }: SalonPageProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('services');
  
  // Récupérer l'équipe du salon via le hook unifié
  const { data: teamMembers, isLoading: teamLoading, error: teamError } = useSalonTeam("de331471-f436-4d82-bbc7-7e70d6af7958");
  
  // Salon par défaut si pas de données
  const defaultSalonData: SalonData = {
    id: "salon-demo",
    salonName: "Excellence Beauty Salon",
    salonDescription: "Votre salon de beauté premium avec les meilleures prestations",
    salonAddress: "123 Avenue des Champs-Élysées, 75008 Paris",
    salonPhone: "+33 1 23 45 67 89",
    salonEmail: "contact@excellence-beauty.fr",
    primaryColor: "#8B5CF6",
    secondaryColor: "#F59E0B",
    showPrices: true,
    requireDeposit: true,
    depositPercentage: 30,
    selectedServices: ["1", "2", "3"]
  };

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

  // Récupérer les données de la page personnalisée
  const { data: pageDataRaw, isLoading: pageLoading } = useQuery({
    queryKey: [`/api/booking-pages/salon-demo`],
  });

  // Utiliser les données par défaut si pas de réponse API
  // Ensure pageData always has an id (for salonId)
  // Type guard for pageDataRaw
  const isValidSalonData = (data: any): data is SalonData => !!data && typeof data === 'object' && 'id' in data && !!data.id;
  const pageData: SalonData = isValidSalonData(pageDataRaw) ? pageDataRaw : defaultSalonData;


  // --- PUBLIC ENDPOINT + BROADCAST + ROBUST MAPPING ---
  // SalonId: use the real one if available, fallback to demo
  const salonId = pageData.id || "salon-demo";
  const queryClient = useQueryClient();
  const { data: servicesData, isLoading: servicesLoading, refetch: refetchServices } = useQuery({
    queryKey: [`/api/public/salon/${salonId}/services`]
  });

  // Broadcast refetch for real-time sync
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    let storageListener: ((e: StorageEvent) => void) | null = null;
    const win: Window = window;
    const doRefetch = () => {
      console.log('services_refetch salonId=' + salonId);
      refetchServices();
    };
    if ('BroadcastChannel' in win) {
      channel = new BroadcastChannel('services-sync');
      channel.onmessage = () => doRefetch();
    } else {
      storageListener = (e: StorageEvent) => {
        if (e.key === 'services-sync' && e.newValue) doRefetch();
      };
      win.addEventListener('storage', storageListener);
    }
    return () => {
      if (channel) channel.close();
      if (storageListener) win.removeEventListener('storage', storageListener);
    };
  }, [refetchServices, salonId]);

  // Robust mapping of services (no N/A)
  const availableServices = Array.isArray((servicesData as any)?.services)
    ? (servicesData as any).services.map((svc: any) => ({
        id: svc.id || svc.serviceId || svc.service_id,
        name: svc.name || svc.service_name || 'Service',
        price: svc.price || svc.effective_price || 0,
        duration: svc.duration || svc.effective_duration || 30,
        description: svc.description || '',
        requiresDeposit: svc.requiresDeposit || svc.requires_deposit || false,
        depositPercentage: svc.depositPercentage || svc.deposit_percentage || 30,
      }))
    : [];

  const selectedService = availableServices.find((s: any) => s.id?.toString() === formData.serviceId);

  // Calculer l'acompte
  useEffect(() => {
    if (selectedService && pageData.requireDeposit) {
      const depositPercentage = pageData.depositPercentage || 30;
      const deposit = Math.round((selectedService.price * depositPercentage) / 100);
      setFormData(prev => ({ ...prev, depositAmount: deposit }));
    }
  }, [selectedService, pageData]);

  // Générer les créneaux horaires
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation - Style Fresha avec logo Avyento */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Avyento */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setLocation('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <img 
                src="/attached_assets/Logo avyento._1755714467098.png"
                alt="Avyento"
                className="h-8 w-auto"
                style={{ height: '32px' }}
              />
            </div>

            {/* Navigation Center - Barres de recherche dynamiques */}
            <div className="hidden md:flex items-center gap-4">
              {/* Barre de recherche services */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher un service..."
                  className="pl-10 pr-4 py-2 w-48 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Adresse avec détection */}
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">Adresse</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {/* Sélecteur de date */}
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">Date</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {/* Sélecteur d'heure */}
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">Heure</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Menu Button */}
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <span>Menu</span>
              <div className="space-y-1">
                <div className="w-4 h-0.5 bg-gray-600"></div>
                <div className="w-4 h-0.5 bg-gray-600"></div>
                <div className="w-4 h-0.5 bg-gray-600"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-50 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Accueil</span>
            <span>•</span>
            <span>Instituts de beauté</span>
            <span>•</span>
            <span>France</span>
            <span>•</span>
            <span>Paris</span>
            <span>•</span>
            <span className="text-gray-900">{pageData.salonName || "Excellence Beauty Salon"}</span>
          </div>
        </div>
      </div>

      {/* Header Salon avec photo de couverture */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-start gap-6">
            {/* Photo de couverture du salon */}
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                alt={pageData.salonName || "Excellence Beauty Salon"}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Informations salon */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{pageData.salonName || "Excellence Beauty Salon"}</h1>
                    <CheckCircle className="h-6 w-6 text-blue-500" />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-gray-900">5.0</span>
                      <span className="text-gray-600">(749)</span>
                    </div>
                    <span className="text-gray-600">•</span>
                    <span className="text-green-600 font-medium">Ouvert</span>
                    <span className="text-gray-600">- ferme à 19:00</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-600">{pageData.salonAddress || 'Paris, France'}</span>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      Afficher l'itinéraire
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Star className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Navigation par onglets */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {['Services', 'Infos', 'Équipe', 'Avis', 'Galerie'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.toLowerCase()
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            {/* Services par catégories */}
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg">
                <button className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50">
                  <div>
                    <h3 className="font-semibold text-lg">Soins Visage</h3>
                    <p className="text-sm text-gray-500">Traitements du visage personnalisés</p>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
                <div className="border-t border-gray-100 p-4 space-y-4">
                  <div className="flex gap-4 p-4 border rounded-lg">
                    <div className="flex gap-2">
                      <img src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=80&h=80&fit=crop" className="w-16 h-16 rounded-lg object-cover" />
                      <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=80&h=80&fit=crop" className="w-16 h-16 rounded-lg object-cover" />
                      <img src="https://images.unsplash.com/photo-1559599189-fe84dea4eb79?w=80&h=80&fit=crop" className="w-16 h-16 rounded-lg object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Soin Anti-Âge Premium</h4>
                      <p className="text-sm text-gray-600">Traitement complet contre les signes de l'âge</p>
                      <div className="flex items-center mt-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm ml-1">4.9 (127 avis)</span>
                      </div>
                      <p className="text-lg font-semibold text-purple-600 mt-2">85€</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg">
                <button className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50">
                  <div>
                    <h3 className="font-semibold text-lg">Coiffure</h3>
                    <p className="text-sm text-gray-500">Coupes, colorations et coiffages</p>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg">
                <button className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50">
                  <div>
                    <h3 className="font-semibold text-lg">Manucure & Pédicure</h3>
                    <p className="text-sm text-gray-500">Soins des ongles et nail art</p>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'infos' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Réseaux Sociaux</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Facebook className="w-5 h-5 text-blue-600" />
                    <span>@excellencebeauty</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Instagram className="w-5 h-5 text-pink-600" />
                    <span>@excellence_beauty</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Music className="w-5 h-5 text-black" />
                    <span>@excellencebeauty</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Horaires d'ouverture</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Lundi - Vendredi</span>
                    <span>9h00 - 19h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samedi</span>
                    <span>9h00 - 17h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimanche</span>
                    <span className="text-red-600">Fermé</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>À propos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Excellence Beauty Salon est votre destination de choix pour tous vos besoins de beauté. 
                  Avec plus de 10 ans d'expérience, notre équipe de professionnels qualifiés vous offre 
                  des services de qualité dans un environnement relaxant et moderne. Nous utilisons uniquement 
                  des produits haut de gamme pour vous garantir les meilleurs résultats.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'équipe' && (
          <div className="grid md:grid-cols-3 gap-6">
            {teamLoading ? (
              // Skeleton loading - réutilisation du pattern existant
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6 text-center">
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded mx-auto mb-2 w-20 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded mx-auto mb-3 w-32 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded mx-auto w-40 animate-pulse"></div>
                  </CardContent>
                </Card>
              ))
            ) : teamError ? (
              // Gestion d'erreur discrète avec fallback
              <>
                {console.log('team_fallback_mock', { error: teamError.message })}
                <Card>
                  <CardContent className="p-6 text-center">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108755-2616b00bd264?w=150&h=150&fit=crop&crop=face" 
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                      alt="Sophie"
                    />
                    <h3 className="font-semibold text-lg">Sophie</h3>
                    <p className="text-purple-600 font-medium">Esthéticienne Senior</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Spécialiste en soins anti-âge avec 8 ans d'expérience
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              // Données réelles depuis le hook unifié
              teamMembers.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-6 text-center">
                    <img 
                      src={member.photo}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                      alt={member.name}
                    />
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-purple-600 font-medium">{member.role}</p>
                    {member.bio && (
                      <p className="text-sm text-gray-600 mt-2">
                        {member.bio}
                      </p>
                    )}
                    {member.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3 justify-center">
                        {member.specialties.slice(0, 2).map((specialty, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Bouton "Réserver avec ce pro" - navigation vers flux booking */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3"
                      onClick={() => {
                        // Stocker le professionnel sélectionné
                        localStorage.setItem('selectedProfessional', JSON.stringify(member));
                        // Aller d'abord vers la sélection de service, qui redirigera vers professionnel puis datetime
                        setLocation('/service-selection');
                      }}
                    >
                      Réserver
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'avis' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold">4.9</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="text-sm text-gray-500">749 avis</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108755-2616b00bd264?w=40&h=40&fit=crop&crop=face" 
                      className="w-10 h-10 rounded-full"
                      alt="Client"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Marie L.</span>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">il y a 2 jours</span>
                      </div>
                      <p className="text-gray-700">
                        Excellent service ! Sophie a été très professionnelle pour mon soin anti-âge. 
                        Je recommande vivement ce salon.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" 
                      className="w-10 h-10 rounded-full"
                      alt="Client"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Thomas R.</span>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">il y a 1 semaine</span>
                      </div>
                      <p className="text-gray-700">
                        Marc a fait un travail fantastique sur ma coupe. Très satisfait du résultat !
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'galerie' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Soins Visage</h3>
              <p className="text-gray-600 mb-4">Nos techniques avancées pour sublimer votre peau</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="relative group">
                    <img 
                      src={`https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=300&h=300&fit=crop&q=80`}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-end p-3">
                      <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        Soin Anti-Âge Premium
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Coiffure</h3>
              <p className="text-gray-600 mb-4">Nos créations capillaires les plus réussies</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="relative group">
                    <img 
                      src={`https://images.unsplash.com/photo-1562004760-acb5501b6c56?w=300&h=300&fit=crop&q=80`}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-end p-3">
                      <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        Coupe & Coloration
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Formulaire de réservation */}
        {formData.serviceId && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Réserver votre rendez-vous</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Votre prénom"
                  />
                </div>
                
                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Votre nom"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="votre@email.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="06 12 34 56 78"
                  />
                </div>
                
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <Label htmlFor="time">Heure</Label>
                  <Select 
                    value={formData.time} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, time: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir l'heure" />
                    </SelectTrigger>
                    <SelectContent>
                      {getTimeSlots().map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Résumé et paiement */}
              {selectedService && formData.date && formData.time && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold mb-3">Résumé de votre réservation</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span className="font-medium">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{new Date(formData.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Heure:</span>
                      <span className="font-medium">{formData.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prix total:</span>
                      <span className="font-bold">{selectedService.price}€</span>
                    </div>
                    
                    {pageData.requireDeposit && formData.depositAmount > 0 && (
                      <div className="flex justify-between text-purple-600">
                        <span>Acompte à payer:</span>
                        <span className="font-bold">{formData.depositAmount}€</span>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full mt-4 gradient-bg text-white"
                    onClick={() => {
                      toast({
                        title: "Fonctionnalité en développement",
                        description: "La réservation sera bientôt disponible !",
                      });
                    }}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {pageData.requireDeposit ? `Payer l'acompte (${formData.depositAmount}€)` : 'Réserver maintenant'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Informations pratiques */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Horaires d'ouverture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Lundi - Vendredi</span>
                  <span>9h00 - 19h00</span>
                </div>
                <div className="flex justify-between">
                  <span>Samedi</span>
                  <span>9h00 - 18h00</span>
                </div>
                <div className="flex justify-between">
                  <span>Dimanche</span>
                  <span>Fermé</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                Note client
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500 mb-2">4.8/5</div>
                <div className="text-sm text-gray-500">Basé sur 142 avis</div>
                <div className="flex justify-center mt-2">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}