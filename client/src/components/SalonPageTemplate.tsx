import { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AVYENTO_SALON_TEMPLATE, AVYENTO_GLASS_STYLES, formatDuration, type AvyentoSalonTemplate } from '@/templates/AvyentoSalonTemplate';

interface SalonPageTemplateProps {
  // Permet de surcharger la configuration par défaut si nécessaire
  templateData?: Partial<AvyentoSalonTemplate>;
}

export default function SalonPageTemplate({ templateData }: SalonPageTemplateProps) {
  const [activeTab, setActiveTab] = useState('services');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('coiffure');
  const [, navigate] = useLocation();

  // Utilise le template Avyento par défaut ou une surcharge
  const template = { ...AVYENTO_SALON_TEMPLATE, ...templateData };
  const { salonData, colors, tabs, serviceCategories, teamMembers, ui } = template;

  return (
    <div className={`min-h-screen ${colors.background.gradient}`}>
      {/* Header avec image de fond et overlay glassmorphism */}
      <div className="relative h-80 lg:h-96 overflow-hidden">
        <img 
          src={salonData.backgroundImage}
          alt={salonData.name}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${colors.background.overlay}`} />
        
        {/* Informations salon en overlay */}
        <div className={`absolute bottom-0 left-0 right-0 p-6 lg:p-8`}>
          <div className={`${ui.containerMaxWidth} mx-auto`}>
            <div className={`${AVYENTO_GLASS_STYLES.card} ${ui.spacing.card}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {salonData.name}
                    </h1>
                    {salonData.verified && (
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Vérifié
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium text-gray-900">{salonData.rating}</span>
                      <span className="text-sm text-gray-600">({salonData.reviewCount} avis)</span>
                    </div>
                    <Badge variant="outline" className="bg-white/50 border-violet-200">
                      {salonData.priceRange}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{salonData.address}</span>
                  </div>
                </div>
                
                {/* Bouton de réservation principal */}
                <Button
                  onClick={() => navigate('/avyento-booking')}
                  className={AVYENTO_GLASS_STYLES.button}
                  size="lg"
                >
                  Réserver
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className={`${ui.containerMaxWidth} mx-auto px-4 lg:px-8 py-6`}>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.id
                  ? AVYENTO_GLASS_STYLES.tabActive
                  : `${AVYENTO_GLASS_STYLES.tab} text-violet-700 hover:bg-violet-500/20`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            {serviceCategories.map((category) => (
              <div key={category.id}>
                <div 
                  onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                  className={`${AVYENTO_GLASS_STYLES.card} ${AVYENTO_GLASS_STYLES.cardHover} ${ui.spacing.card} cursor-pointer`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{category.description}</p>
                    </div>
                    {expandedCategory === category.id ? (
                      <ChevronUp className="w-5 h-5 text-violet-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-violet-600" />
                    )}
                  </div>
                </div>

                {/* Services de la catégorie */}
                {expandedCategory === category.id && (
                  <div className="mt-4 space-y-4">
                    {category.services.map((service, idx) => (
                      <Card key={idx} className={`${AVYENTO_GLASS_STYLES.card} ${AVYENTO_GLASS_STYLES.cardHover} border-0`}>
                        <CardContent className={ui.spacing.card}>
                          <div className="flex gap-4">
                            <img 
                              src={service.photo}
                              alt={service.name}
                              className={`w-16 h-16 lg:w-20 lg:h-20 ${ui.borderRadius.image} object-cover`}
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-gray-900 text-lg">
                                  {service.name}
                                </h4>
                                <div className="text-right">
                                  <div className="font-bold text-lg" style={{ color: colors.primary }}>
                                    {service.price}€
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {formatDuration(service.duration)}
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-gray-600 text-sm mb-3">
                                {service.description}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    <span className="text-sm font-medium">{service.rating}</span>
                                    <span className="text-xs text-gray-500">({service.reviews} avis)</span>
                                  </div>
                                </div>
                                
                                <Button
                                  onClick={() => navigate('/avyento-booking')}
                                  className={`${AVYENTO_GLASS_STYLES.button} h-9 px-4 text-sm`}
                                >
                                  Réserver
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Onglet Équipe */}
        {activeTab === 'equipe' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, idx) => (
              <Card key={idx} className={`${AVYENTO_GLASS_STYLES.card} ${AVYENTO_GLASS_STYLES.cardHover} border-0`}>
                <CardContent className={ui.spacing.card}>
                  <div className="text-center">
                    <img 
                      src={member.photo}
                      alt={member.name}
                      className={`w-20 h-20 ${ui.borderRadius.image} mx-auto mb-4 object-cover`}
                    />
                    <h3 className="font-semibold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{member.role}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.specialties.map((specialty, specIdx) => (
                        <Badge key={specIdx} variant="secondary" className="bg-violet-100 text-violet-700">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Autres onglets */}
        {activeTab === 'galerie' && (
          <div className={`${AVYENTO_GLASS_STYLES.card} ${ui.spacing.card} text-center`}>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Galerie Photos</h3>
            <p className="text-gray-600">Photos du salon à venir...</p>
          </div>
        )}

        {activeTab === 'infos' && (
          <div className={`${AVYENTO_GLASS_STYLES.card} ${ui.spacing.card}`}>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Informations pratiques</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-violet-600" />
                <span>{salonData.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-violet-600" />
                <span>01 42 86 98 15</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-violet-600" />
                <span>Lun-Sam: 9h-19h, Dim: 10h-18h</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'avis' && (
          <div className={`${AVYENTO_GLASS_STYLES.card} ${ui.spacing.card} text-center`}>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Avis clients</h3>
            <p className="text-gray-600">Système d'avis en développement...</p>
          </div>
        )}
      </div>
    </div>
  );
}