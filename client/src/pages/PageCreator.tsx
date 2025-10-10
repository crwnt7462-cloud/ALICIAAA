import { useState, useCallback } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Palette, Calendar, Upload, Settings, Globe, Smartphone, Save, Eye, Plus, Star, X } from 'lucide-react';

// Types pour une meilleure structure
interface PageData {
  salonName: string;
  description: string;
  history: string;
  services: Service[];
  reviews: Review[];
  photos: string[];
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  professional?: string;
}

interface Review {
  id: string;
  text: string;
  author: string;
  rating: number;
}

interface BookingData {
  title: string;
  welcomeMessage: string;
  services: Service[];
}

// Constantes configurables
const DEFAULT_PLACEHOLDERS = {
  salonName: "Nom de votre salon",
  description: "Décrivez votre salon en quelques mots...",
  history: "Racontez l'histoire de votre salon...",
  reviewText: "Avis client",
  reviewAuthor: "Nom du client",
  bookingTitle: "Titre de votre page de réservation",
  welcomeMessage: "Message d'accueil pour vos clients...",
  serviceName: "Nom du service",
  newService: "Nouveau service"
};

const UI_TEXT = {
  coverPhoto: "Photo de couverture",
  photosCount: (count: number) => `${count} photo(s)`,
  salonName: "Nom du salon",
  salonDescription: "Description du salon...",
  bookingTitle: "Titre de la page",
  bookingMessage: "Message d'accueil...",
  services: "Services",
  history: "Notre histoire",
  reviews: "Avis clients",
  addPhoto: "Ajouter des photos",
  addService: "Ajouter un service",
  addReview: "Ajouter un avis",
  chooseService: "Choisir ce service",
  publishPage: "Publier la page",
  saveDraft: "Sauvegarder brouillon",
  publishing: "Publication...",
  saving: "Sauvegarde...",
  createPage: "Créer cette page",
  createNewPage: "Créer une nouvelle page",
  pageTypeSelection: "Choisissez le type de page que vous souhaitez créer",
  realTimePreview: "Aperçu en temps réel",
  customizePage: "Personnalisez votre page en temps réel"
};

const DEFAULT_VALUES = {
  salon: {
    salonName: "",
    description: "",
    history: "",
    services: [],
    reviews: [],
    photos: []
  },
  booking: {
    title: "",
    welcomeMessage: "",
    services: []
  }
};

export default function PageCreator() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<'salon' | 'booking' | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // États pour les données dynamiques
  const [salonData, setSalonData] = useState<PageData>(DEFAULT_VALUES.salon);
  const [bookingData, setBookingData] = useState<BookingData>(DEFAULT_VALUES.booking);

  // Fonctions utilitaires
  const handleSave = useCallback(async (type: 'draft' | 'publish') => {
    setIsSaving(true);
    try {
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: type === 'publish' ? "Page publiée !" : "Brouillon sauvegardé !",
        description: type === 'publish' 
          ? "Votre page est maintenant en ligne et accessible à vos clients."
          : "Vos modifications ont été sauvegardées. Vous pouvez continuer plus tard.",
      });
    } catch (error) {
      toast({
        title: "Erreur de sauvegarde",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  const addService = useCallback((type: 'salon' | 'booking') => {
    const newService: Service = {
      id: Date.now().toString(),
      name: DEFAULT_PLACEHOLDERS.newService,
      price: 0,
      duration: "30 min"
    };
    
    if (type === 'salon') {
      setSalonData(prev => ({
        ...prev,
        services: [...prev.services, newService]
      }));
    } else {
      setBookingData(prev => ({
        ...prev,
        services: [...prev.services, newService]
      }));
    }
  }, []);

  const removeService = useCallback((serviceId: string, type: 'salon' | 'booking') => {
    if (type === 'salon') {
      setSalonData(prev => ({
        ...prev,
        services: prev.services.filter(s => s.id !== serviceId)
      }));
    } else {
      setBookingData(prev => ({
        ...prev,
        services: prev.services.filter(s => s.id !== serviceId)
      }));
    }
  }, []);

  const updateService = useCallback((serviceId: string, field: keyof Service, value: any, type: 'salon' | 'booking') => {
    if (type === 'salon') {
      setSalonData(prev => ({
        ...prev,
        services: prev.services.map(s => 
          s.id === serviceId ? { ...s, [field]: value } : s
        )
      }));
    } else {
      setBookingData(prev => ({
        ...prev,
        services: prev.services.map(s => 
          s.id === serviceId ? { ...s, [field]: value } : s
        )
      }));
    }
  }, []);

  const pageTypes = [
    {
      type: 'salon' as const,
      title: 'Page Salon',
      description: 'Créez une page vitrine pour votre salon avec photos, services et présentation',
      icon: <Palette className="w-8 h-8" />,
      features: ['Galerie photos', 'Présentation salon', 'Liste des services', 'Équipe', 'Horaires & contact'],
      color: 'violet'
    },
    {
      type: 'booking' as const,
      title: 'Page Réservation',
      description: 'Créez une page de réservation personnalisée pour vos clients',
      icon: <Calendar className="w-8 h-8" />,
      features: ['Calendrier intégré', 'Sélection services', 'Paiement en ligne', 'Confirmation auto', 'Rappels SMS/Email'],
      color: 'blue'
    }
  ];

  if (selectedType) {
    return (
      <div className="min-h-screen" style={{background: 'radial-gradient(1200px 600px at 20% -10%, #F3EFFF 0%, #FFFFFF 55%)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Button
              variant="ghost"
              onClick={() => setSelectedType(null)}
              className="avyento-button-secondary h-10 w-10 sm:h-12 sm:w-12 p-0 rounded-2xl self-start"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                Créer une {selectedType === 'salon' ? 'Page Salon' : 'Page Réservation'}
              </h1>
              <p className="text-gray-600 text-base sm:text-lg mt-1">{UI_TEXT.customizePage}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            {/* Éditeur */}
            <div className="space-y-4 sm:space-y-6">
              <Card 
                className="rounded-2xl sm:rounded-3xl p-4 sm:p-6"
                style={{
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  backdropFilter: 'blur(25px)',
                  WebkitBackdropFilter: 'blur(25px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)'
                }}
              >
                <CardHeader className="pb-4 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-bold">
                    <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600" />
                    Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  {selectedType === 'salon' && (
                    <>
                      <div>
                        <Label htmlFor="salon-name">Nom du salon</Label>
                        <Input 
                          id="salon-name"
                          value={salonData.salonName}
                          onChange={(e) => setSalonData(prev => ({ ...prev, salonName: e.target.value }))}
                          placeholder={DEFAULT_PLACEHOLDERS.salonName}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base"
                          style={{
                            background: 'rgba(255, 255, 255, 0.25)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                            color: 'black'
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="salon-description">Description</Label>
                        <Textarea 
                          id="salon-description"
                          value={salonData.description}
                          onChange={(e) => setSalonData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder={DEFAULT_PLACEHOLDERS.description}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base h-16 sm:h-20"
                          style={{
                            background: 'rgba(255, 255, 255, 0.25)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                            color: 'black'
                          }}
                        />
                      </div>
                      <div>
                        <Label>Photos du salon</Label>
                        <Button 
                          variant="outline" 
                          className="w-full h-16 sm:h-20 border-dashed border-2 border-gray-300 hover:border-violet-400 rounded-xl sm:rounded-2xl text-sm sm:text-base"
                          style={{
                            background: 'rgba(255, 255, 255, 0.25)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '2px dashed rgba(156, 163, 175, 0.5)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                            color: 'black'
                          }}
                        >
                          <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          <span className="hidden sm:inline">{UI_TEXT.addPhoto} ({salonData.photos.length})</span>
                          <span className="sm:hidden">Photos ({salonData.photos.length})</span>
                        </Button>
                      </div>
                      <div>
                        <Label>Services</Label>
                        <div className="space-y-2">
                          {salonData.services.map((service) => (
                            <div key={service.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex-1">
                                <Input 
                                  value={service.name}
                                  onChange={(e) => updateService(service.id, 'name', e.target.value, 'salon')}
                                  className="border-0 bg-transparent p-0 h-auto"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <Input 
                                  type="number"
                                  value={service.price}
                                  onChange={(e) => updateService(service.id, 'price', Number(e.target.value), 'salon')}
                                  className="w-16 h-6 text-xs"
                                />
                                <span className="text-xs text-gray-500">€</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => removeService(service.id, 'salon')}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="avyento-button-secondary w-full"
                            onClick={() => addService('salon')}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            {UI_TEXT.addService}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="salon-history">Histoire du salon</Label>
                        <Textarea 
                          id="salon-history"
                          value={salonData.history}
                          onChange={(e) => setSalonData(prev => ({ ...prev, history: e.target.value }))}
                          placeholder={DEFAULT_PLACEHOLDERS.history}
                          className="avyento-input h-16"
                        />
                      </div>
                      <div>
                        <Label>Avis clients</Label>
                        <div className="space-y-2">
                          {salonData.reviews.map((review) => (
                            <div key={review.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm">"{review.text}" - {review.author}</span>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                          <Button variant="outline" size="sm" className="avyento-button-secondary w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            {UI_TEXT.addReview}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {selectedType === 'booking' && (
                    <>
                      <div>
                        <Label htmlFor="booking-title">Titre de la page</Label>
                        <Input 
                          id="booking-title"
                          value={bookingData.title}
                          onChange={(e) => setBookingData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder={DEFAULT_PLACEHOLDERS.bookingTitle}
                          className="avyento-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="booking-message">Message d'accueil</Label>
                        <Textarea 
                          id="booking-message"
                          value={bookingData.welcomeMessage}
                          onChange={(e) => setBookingData(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                          placeholder={DEFAULT_PLACEHOLDERS.welcomeMessage}
                          className="avyento-input h-20"
                        />
                      </div>
                      <div>
                        <Label>Services disponibles</Label>
                        <div className="space-y-2">
                          {bookingData.services.map((service) => (
                            <div key={service.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex-1">
                                <Input 
                                  value={service.name}
                                  onChange={(e) => updateService(service.id, 'name', e.target.value, 'booking')}
                                  className="border-0 bg-transparent p-0 h-auto"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <Input 
                                  type="number"
                                  value={service.price}
                                  onChange={(e) => updateService(service.id, 'price', Number(e.target.value), 'booking')}
                                  className="w-16 h-6 text-xs"
                                />
                                <span className="text-xs text-gray-500">€</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => removeService(service.id, 'booking')}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="avyento-button-secondary w-full"
                            onClick={() => addService('booking')}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            {UI_TEXT.addService}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Aperçu */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600" />
                  <span className="text-base sm:text-lg font-semibold text-gray-900">{UI_TEXT.realTimePreview}</span>
                </div>
                <div className="avyento-nav-tabs ml-auto">
                  <Button 
                    variant={isPreviewMode ? "default" : "ghost"} 
                    size="sm" 
                    className="avyento-nav-tab h-7 sm:h-8 px-2 sm:px-3"
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                  >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="avyento-nav-tab h-7 sm:h-8 px-2 sm:px-3">
                    <Smartphone className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="avyento-nav-tab h-7 sm:h-8 px-2 sm:px-3">
                    <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>

              <Card 
                className="border-2 border-dashed border-violet-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6"
                style={{
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  backdropFilter: 'blur(25px)',
                  WebkitBackdropFilter: 'blur(25px)',
                  border: '2px dashed rgba(139, 92, 246, 0.3)',
                  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)'
                }}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {selectedType === 'salon' && (
                      <>
                        <div className="h-24 sm:h-32 bg-gradient-to-r from-violet-100 to-pink-100 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500 text-sm sm:text-base">
                            {salonData.photos.length > 0 ? UI_TEXT.photosCount(salonData.photos.length) : UI_TEXT.coverPhoto}
                          </span>
                        </div>
                        <div>
                          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                            {salonData.salonName || DEFAULT_PLACEHOLDERS.salonName}
                          </h2>
                          <p className="text-gray-600 text-xs sm:text-sm">
                            {salonData.description || DEFAULT_PLACEHOLDERS.description}
                          </p>
                        </div>
                        {salonData.photos.length > 0 && (
                          <div className="grid grid-cols-2 gap-2">
                            {salonData.photos.slice(0, 2).map((photo, index) => (
                              <div key={index} className="h-12 sm:h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                                {photo}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Services */}
                        {salonData.services.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="font-medium text-gray-900 text-sm sm:text-base">{UI_TEXT.services}</h3>
                            {salonData.services.map((service) => (
                              <div key={service.id} className="p-2 sm:p-3 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-sm sm:text-base">{service.name}</span>
                                  <span className="text-violet-600 font-semibold text-sm sm:text-base">{service.price}€</span>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-500">
                                  {service.duration} {service.professional && `- Expert ${service.professional}`}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Histoire */}
                        {salonData.history && (
                          <div className="space-y-2">
                            <h3 className="font-medium text-gray-900 text-sm sm:text-base">{UI_TEXT.history}</h3>
                            <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs sm:text-sm text-gray-700">{salonData.history}</p>
                            </div>
                          </div>
                        )}

                        {/* Avis */}
                        {salonData.reviews.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="font-medium text-gray-900 text-sm sm:text-base">{UI_TEXT.reviews}</h3>
                            {salonData.reviews.map((review) => (
                              <div key={review.id} className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-1 mb-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-2 h-2 sm:w-3 sm:h-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                    />
                                  ))}
                                </div>
                                <p className="text-xs sm:text-sm text-gray-700">"{review.text}" - {review.author}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}

                    {selectedType === 'booking' && (
                      <>
                        <div>
                          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                            {bookingData.title || DEFAULT_PLACEHOLDERS.bookingTitle}
                          </h2>
                          <p className="text-gray-600 text-xs sm:text-sm">
                            {bookingData.welcomeMessage || DEFAULT_PLACEHOLDERS.welcomeMessage}
                          </p>
                        </div>
                        {bookingData.services.length > 0 && (
                          <div className="space-y-2">
                            {bookingData.services.map((service) => (
                              <div key={service.id} className="p-2 sm:p-3 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-sm sm:text-base">{service.name}</span>
                                  <span className="text-violet-600 font-semibold text-sm sm:text-base">{service.price}€</span>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-500">{service.duration}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <Button 
                          className="w-full px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
                          style={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(168, 85, 247, 0.15) 100%)',
                            backdropFilter: 'blur(15px)',
                            WebkitBackdropFilter: 'blur(15px)',
                            border: 'none',
                            boxShadow: '0 6px 20px rgba(168, 85, 247, 0.15), inset 0 2px 0 rgba(255, 255, 255, 0.5)',
                            color: 'black'
                          }}
                        >
                          {UI_TEXT.chooseService}
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button 
                  className="flex-1 px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(168, 85, 247, 0.15) 100%)',
                    backdropFilter: 'blur(15px)',
                    WebkitBackdropFilter: 'blur(15px)',
                    border: 'none',
                    boxShadow: '0 6px 20px rgba(168, 85, 247, 0.15), inset 0 2px 0 rgba(255, 255, 255, 0.5)',
                    color: 'black'
                  }}
                  onClick={() => handleSave('publish')}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                      <span className="hidden sm:inline">{UI_TEXT.publishing}</span>
                      <span className="sm:hidden">Publication...</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      <span className="hidden sm:inline">{UI_TEXT.publishPage}</span>
                      <span className="sm:hidden">Publier</span>
                    </>
                  )}
                </Button>
                <Button 
                  className="px-4 sm:px-6 py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold shadow-xl hover:shadow-2xl transition-all"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '2px solid rgba(255, 255, 255, 0.4)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 2px 0 rgba(255, 255, 255, 0.3)',
                    color: 'black'
                  }}
                  onClick={() => handleSave('draft')}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                      <span className="hidden sm:inline">{UI_TEXT.saving}</span>
                      <span className="sm:hidden">Sauvegarde...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      <span className="hidden sm:inline">{UI_TEXT.saveDraft}</span>
                      <span className="sm:hidden">Brouillon</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{background: 'radial-gradient(1200px 600px at 20% -10%, #F3EFFF 0%, #FFFFFF 55%)'}}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation('/pro-tools')}
            className="avyento-button-secondary h-10 w-10 sm:h-12 sm:w-12 p-0 rounded-2xl self-start"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">{UI_TEXT.createNewPage}</h1>
            <p className="text-gray-600 text-base sm:text-lg mt-1">{UI_TEXT.pageTypeSelection}</p>
          </div>
        </div>

        {/* Types de pages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {pageTypes.map((pageType) => (
            <Card 
              key={pageType.type}
              className="cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-2 rounded-2xl sm:rounded-3xl p-4 sm:p-6"
              style={{
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                backdropFilter: 'blur(25px)',
                WebkitBackdropFilter: 'blur(25px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)'
              }}
              onClick={() => setSelectedType(pageType.type)}
            >
              <CardHeader className="text-center pb-4 sm:pb-6">
                <div 
                  className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    backdropFilter: 'blur(15px)',
                    WebkitBackdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                    color: pageType.color === 'violet' ? '#7c3aed' : '#3b82f6'
                  }}
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8">
                    {pageType.icon}
                  </div>
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">{pageType.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">{pageType.description}</p>
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Fonctionnalités incluses :</h4>
                  <ul className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-2">
                    {pageType.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 sm:gap-3">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-violet-500 rounded-full flex-shrink-0"></div>
                        <span className="text-xs sm:text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button 
                  className="w-full px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(168, 85, 247, 0.15) 100%)',
                    backdropFilter: 'blur(15px)',
                    WebkitBackdropFilter: 'blur(15px)',
                    border: 'none',
                    boxShadow: '0 6px 20px rgba(168, 85, 247, 0.15), inset 0 2px 0 rgba(255, 255, 255, 0.5)',
                    color: 'black'
                  }}
                >
                  {UI_TEXT.createPage}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}