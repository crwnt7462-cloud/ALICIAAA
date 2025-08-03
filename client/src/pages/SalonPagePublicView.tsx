import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Phone, Clock, Globe, CheckCircle2, Award, Instagram, Facebook, Twitter } from 'lucide-react';
import rendlyLogo from "@assets/3_1753714421825.png";

// Données simulées pour les salons (basées sur celles de SalonPageEditor)
const salonData = {
  'salon-excellence-paris': {
    id: 'salon-excellence-paris',
    name: 'Excellence Hair Paris',
    description: 'Salon de coiffure haut de gamme spécialisé dans la coiffure féminine. Notre équipe d\'experts vous offre des services personnalisés dans un cadre élégant et moderne.',
    address: '45 Rue de Rivoli, 75001 Paris',
    phone: '01 42 60 74 89',
    website: 'www.excellence-hair-paris.fr',
    rating: 4.8,
    reviews: 156,
    hours: 'Lun-Sam: 9h-19h, Dim: Fermé',
    customColors: {
      primary: '#e91e63',
      intensity: 35
    },
    services: [
      { id: 1, name: 'Coupe + Brushing', description: 'Coupe personnalisée avec brushing professionnel', price: 65, duration: 60, category: 'Coiffure' },
      { id: 2, name: 'Coloration Complète', description: 'Coloration avec produits premium', price: 120, duration: 120, category: 'Couleur' },
      { id: 3, name: 'Balayage', description: 'Technique de balayage naturel', price: 150, duration: 150, category: 'Couleur' },
    ],
    staff: [
      { name: 'Jessica Martin', role: 'Coiffeuse Senior', experience: '8 ans' },
      { name: 'Thomas Dubois', role: 'Coloriste Expert', experience: '12 ans' }
    ],
    certifications: ['Certifié L\'Oréal', 'Expert Kerastase'],
    coverImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800'
  },
  'barbier-gentleman-marais': {
    id: 'barbier-gentleman-marais',
    name: 'Gentleman Barbier',
    description: 'Barbier traditionnel au cœur du Marais. Spécialiste de la coupe masculine classique et moderne, rasage traditionnel et soins de la barbe.',
    address: '23 Rue des Rosiers, 75004 Paris',
    phone: '01 48 87 62 34',
    website: 'www.gentleman-barbier.fr',
    rating: 4.7,
    reviews: 89,
    hours: 'Mar-Sam: 10h-20h, Dim-Lun: Fermé',
    customColors: {
      primary: '#f59e0b',
      intensity: 40
    },
    services: [
      { id: 1, name: 'Coupe Classique', description: 'Coupe traditionnelle à la tondeuse et aux ciseaux', price: 35, duration: 45, category: 'Coupe' },
      { id: 2, name: 'Rasage Traditionnel', description: 'Rasage au rasoir avec serviettes chaudes', price: 25, duration: 30, category: 'Rasage' },
      { id: 3, name: 'Coupe + Barbe', description: 'Service complet coupe et entretien barbe', price: 50, duration: 60, category: 'Complet' },
    ],
    staff: [
      { name: 'Antoine Moreau', role: 'Barbier Expert', experience: '15 ans' },
      { name: 'Lucas Bernard', role: 'Barbier', experience: '5 ans' }
    ],
    certifications: ['Maître Barbier Paris', 'Formé École Française'],
    coverImage: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800'
  },
  'salon-moderne-republique': {
    id: 'salon-moderne-republique',
    name: 'Salon Moderne République',
    description: 'Salon de coiffure créatif et tendance. Nous proposons des coupes avant-gardistes et des colorations audacieuses dans un esprit jeune et dynamique.',
    address: '78 Avenue de la République, 75011 Paris',
    phone: '01 43 55 89 12',
    website: 'www.salon-moderne-republique.fr',
    rating: 4.6,
    reviews: 124,
    hours: 'Lun-Sam: 9h30-19h30, Dim: Fermé',
    customColors: {
      primary: '#6366f1',
      intensity: 30
    },
    services: [
      { id: 1, name: 'Coupe Tendance', description: 'Coupe moderne et personnalisée', price: 55, duration: 50, category: 'Coiffure' },
      { id: 2, name: 'Couleur Fantasy', description: 'Colorations créatives et audacieuses', price: 140, duration: 180, category: 'Couleur' },
      { id: 3, name: 'Lissage Brésilien', description: 'Traitement lissant longue durée', price: 200, duration: 240, category: 'Soin' },
    ],
    staff: [
      { name: 'Camille Rousseau', role: 'Directrice Artistique', experience: '10 ans' },
      { name: 'Marine Lopez', role: 'Coloriste', experience: '6 ans' }
    ],
    certifications: ['Salon Créatif 2024', 'Partenaire Schwarzkopf'],
    coverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800'
  }
};

// Fonction pour obtenir le style des boutons avec couleurs personnalisées
const getCustomButtonStyle = (customColors: any) => {
  if (!customColors?.primary) {
    return {
      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.35) 0%, rgba(245, 158, 11, 0.25) 100%)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(245, 158, 11, 0.3)',
      color: '#000000'
    };
  }

  const primaryColor = customColors.primary || '#f59e0b';
  const intensity = customColors.intensity || 35;
  
  const rgb = parseInt(primaryColor.slice(1), 16);
  const r = (rgb >> 16) & 255;
  const g = (rgb >> 8) & 255;
  const b = rgb & 255;
  
  const primaryOpacity = intensity / 100;
  const secondaryOpacity = Math.max(0.05, (intensity - 5) / 100);
  
  return {
    background: `linear-gradient(135deg, rgba(${r}, ${g}, ${b}, ${primaryOpacity}) 0%, rgba(${r}, ${g}, ${b}, ${secondaryOpacity}) 100%)`,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: `1px solid rgba(${r}, ${g}, ${b}, 0.3)`,
    color: '#000000'
  };
};

export default function SalonPagePublicView() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('services');
  const [salonId, setSalonId] = useState<string | null>(null);

  // Extraire l'ID du salon depuis l'URL
  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/salon\/(.+)/);
    if (match) {
      setSalonId(match[1]);
    }
  }, []);

  // Récupérer les données du salon depuis l'API
  const { data: salon, isLoading, error } = useQuery({
    queryKey: ['/api/salon', salonId],
    queryFn: async () => {
      if (!salonId) return null;
      
      // Si l'ID est "current", rediriger vers un salon par défaut pour la vue publique
      if (salonId === 'current') {
        // Utiliser les données de "barbier-gentleman-marais" comme fallback
        const defaultSalonId = 'barbier-gentleman-marais';
        try {
          const response = await fetch(`/api/salon/${defaultSalonId}`);
          if (response.ok) {
            const data = await response.json();
            return data.salon || data;
          }
        } catch (err) {
          console.log('API pas disponible pour salon par défaut');
        }
        // Fallback vers les données statiques
        return salonData[defaultSalonId as keyof typeof salonData] || null;
      }
      
      // Pour les autres salons, essayer l'API normale
      try {
        const response = await fetch(`/api/salon/${salonId}`);
        if (response.ok) {
          const data = await response.json();
          return data.salon || data;
        }
      } catch (err) {
        console.log('API pas disponible, utilisation données fallback');
      }
      
      // Fallback vers les données statiques si l'API n'est pas disponible
      return salonData[salonId as keyof typeof salonData] || null;
    },
    enabled: !!salonId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Chargement du salon...</p>
        </div>
      </div>
    );
  }

  if (error || !salon) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Salon non trouvé</h2>
          <p className="text-gray-600 mb-4">Le salon que vous cherchez n'existe pas ou n'est plus disponible.</p>
          <button 
            onClick={() => setLocation('/search')}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          >
            Retour à la recherche
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header avec navigation */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setLocation('/search')}
          className="absolute left-4 top-4 z-10 glass-button-secondary w-10 h-10 rounded-2xl flex items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5" />
        </motion.button>

        {/* Image de couverture */}
        <div className="relative h-64 bg-gradient-to-br from-violet-400 to-purple-500">
          {salon.coverImage && (
            <img 
              src={salon.coverImage} 
              alt={salon.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          
          {/* Logo Rendly en overlay */}
          <div className="absolute top-4 right-4">
            <img src={rendlyLogo} alt="Rendly" className="h-8 w-auto opacity-80" />
          </div>
        </div>
      </div>

      {/* Informations principales du salon */}
      <div className="px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Nom et infos de base */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{salon.name}</h1>
                <p className="text-gray-600 mb-3">{salon.description}</p>
              </div>
              <div className="ml-4 text-right">
                <CheckCircle2 className="h-6 w-6 text-green-500 inline" style={{ 
                  color: salon.customColors?.primary || '#f59e0b'
                }} />
                <span className="text-sm text-gray-500 ml-1">Vérifié</span>
              </div>
            </div>
            
            {/* Informations contact */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5" style={{ color: salon.customColors?.primary || '#f59e0b' }} />
                  <span className="text-gray-700">{salon.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5" style={{ color: salon.customColors?.primary || '#f59e0b' }} />
                  <span className="text-gray-700">{salon.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5" style={{ color: salon.customColors?.primary || '#f59e0b' }} />
                  <span className="text-gray-700">{salon.hours}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5" style={{ color: salon.customColors?.primary || '#f59e0b' }} />
                  <span className="text-gray-700">{salon.website}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" style={{ 
                      color: salon.customColors?.primary || '#f59e0b',
                      fill: salon.customColors?.primary || '#f59e0b' 
                    }} />
                    <span className="font-semibold">{salon.rating}</span>
                    <span className="opacity-80">({salon.reviews} avis)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications */}
            {salon.certifications && salon.certifications.length > 0 && (
              <div className="flex gap-2 mb-6">
                {salon.certifications.map((cert: string, index: number) => (
                  <div key={index} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs" style={{
                    backgroundColor: salon.customColors?.primary ? `${salon.customColors.primary}20` : '#f59e0b20',
                    color: salon.customColors?.primary || '#f59e0b',
                    border: `1px solid ${salon.customColors?.primary || '#f59e0b'}40`
                  }}>
                    <Award className="h-3 w-3" />
                    {cert}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation onglets */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-6">
              {[
                { id: 'services', label: 'Services' },
                { id: 'info', label: 'Informations' },
                { id: 'avis', label: 'Avis' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  style={{
                    borderBottomColor: activeTab === tab.id ? (salon.customColors?.primary || '#f59e0b') : 'transparent'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contenu des onglets */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              {salon.services && salon.services.length > 0 ? (
                salon.services.map((service: any) => (
                  <div key={service.id} className="glass-card-neutral rounded-2xl p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>{service.duration} min</span>
                          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{service.category}</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-xl font-bold text-gray-900 mb-2">{service.price}€</div>
                        <button 
                          className="px-4 py-2 rounded-xl font-medium transition-all hover:scale-105"
                          style={getCustomButtonStyle(salon.customColors)}
                          onClick={() => setLocation('/booking')}
                        >
                          Réserver
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-card-neutral rounded-2xl p-6 text-center">
                  <p className="text-gray-600">Aucun service disponible pour le moment.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="glass-card-neutral rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Notre équipe</h3>
                <div className="space-y-3">
                  {salon.staff && salon.staff.length > 0 ? salon.staff.map((member: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                      <span className="text-sm text-gray-500">{member.experience}</span>
                    </div>
                  )) : (
                    <p className="text-gray-600">Informations équipe non disponibles.</p>
                  )}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button 
                    className="w-full px-4 py-3 rounded-xl font-medium transition-all hover:scale-105"
                    style={getCustomButtonStyle(salon.customColors)}
                    onClick={() => setLocation('/booking')}
                  >
                    Prendre rendez-vous
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'avis' && (
            <div className="space-y-4">
              <div className="glass-card-neutral rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: salon.customColors?.primary || '#f59e0b' }}>
                  {salon.rating}
                </div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5"
                      style={{
                        color: i < Math.floor(salon.rating) ? (salon.customColors?.primary || '#f59e0b') : '#d1d5db',
                        fill: i < Math.floor(salon.rating) ? (salon.customColors?.primary || '#f59e0b') : '#d1d5db'
                      }}
                    />
                  ))}
                </div>
                <p className="text-gray-600">Basé sur {salon.reviews} avis clients</p>
                
                <div className="mt-6">
                  <button 
                    className="px-6 py-3 rounded-xl font-medium transition-all hover:scale-105"
                    style={getCustomButtonStyle(salon.customColors)}
                    onClick={() => setLocation('/booking')}
                  >
                    Réserver maintenant
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}