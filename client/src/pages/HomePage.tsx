import { useState } from 'react';
import { useLocation } from 'wouter';
import { Search, MapPin, X, MoreHorizontal } from 'lucide-react';

export default function HomePage() {
  console.log('[Avyento] New HomePage mounted');
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim() || locationQuery.trim()) {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('service', searchQuery.trim());
      if (locationQuery.trim()) params.append('location', locationQuery.trim());
      setLocation(`/search?${params.toString()}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50" data-testid="new-home" data-homepage="new-design-v2">
      {/* Header avec logo et navigation */}
      <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm">
        <button className="p-2">
          <X className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            avyento
          </span>
        </div>
        <button className="p-2">
          <MoreHorizontal className="w-6 h-6 text-gray-600" />
        </button>
      </header>

      {/* Contenu principal */}
      <div className="px-6 pt-8">
        {/* Logo Avyento centré */}
        <div className="text-center mb-8">
          <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
            avyento
          </div>
        </div>

        {/* Titre principal */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Réservez votre rendez-vous beauté en 30 sec
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Trouvez les meilleurs pros près de chez vous. Paiement sécurisé. Confirmation instantanée. Zéro frais pour rembourser.
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="mb-8">
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Service recherché..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Ville..."
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Rechercher
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">50 000+</div>
            <div className="text-xs text-gray-500">NOS PROS</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">2 500+</div>
            <div className="text-xs text-gray-500">SALONS PARTENAIRES</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">4.9/5</div>
            <div className="text-xs text-gray-500">SATISFACTION CLIENT</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">24h/24</div>
            <div className="text-xs text-gray-500">RÉSERVATION ONLINE</div>
          </div>
        </div>

        {/* Badges informatifs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <div className="flex items-center gap-1 px-3 py-1 bg-white/60 rounded-full text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-gray-700">55% discount</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-white/60 rounded-full text-sm">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span className="text-gray-700">Plus vérifiés</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-white/60 rounded-full text-sm">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            <span className="text-gray-700">Annuler simple</span>
          </div>
        </div>

        {/* Section Nos services */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Nos services</h2>
          <div className="grid grid-cols-6 gap-4">
            {[
              { icon: '✂️', name: 'Coiffure', color: 'bg-pink-100' },
              { icon: '💄', name: 'Esthétique', color: 'bg-purple-100' },
              { icon: '💆', name: 'Massage', color: 'bg-blue-100' },
              { icon: '💅', name: 'Onglerie', color: 'bg-green-100' },
              { icon: '🧔', name: 'Barbier', color: 'bg-orange-100' },
              { icon: '✨', name: 'Épilation', color: 'bg-red-100' }
            ].map((service, index) => (
              <button
                key={index}
                onClick={() => setLocation(`/services/${service.name.toLowerCase()}`)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl ${service.color} flex items-center justify-center text-lg`}>
                  {service.icon}
                </div>
                <span className="text-xs font-medium text-gray-700">{service.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section Votre IA personnelle */}
        <div className="mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Votre IA personnelle</h3>
            <h4 className="text-lg font-bold text-gray-900 mb-2">prédit les no-shows</h4>
            <p className="text-sm text-gray-600 mb-4">
              Notre IA analyse l'historique et la demande et génère automatiquement des promotions, envoie les bonnes promotions aux bons clients, et anticipe rappels, venue, centres d'intérêts.
            </p>
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Découvrir IA Pro+</span>
            </div>
            <button
              onClick={() => setLocation('/ai-features')}
              className="text-violet-600 text-sm font-semibold"
            >
              Essayer la messagerie
            </button>
          </div>
        </div>

        {/* Section Confirmez, replanifiez, fidélisez */}
        <div className="mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Confirmez, replanifiez, fidélisez—<br />
              au même endroit
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Chat intégré entre salon et client Envoyez rappels, venez centres d'intérêts, reportez, annulez, gérer les créneaux de dernière minute
            </p>
            <button
              onClick={() => setLocation('/messaging')}
              className="text-violet-600 text-sm font-semibold"
            >
              Essayer la messagerie
            </button>
          </div>
        </div>

        {/* Call to action final */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              Prêt à transformer<br />
              votre routine beauté?
            </h2>
            <p className="text-gray-300 mb-6">
              Découvrez une nouvelle expérience de réservation. Plus simple, plus rapide, plus intelligent.
            </p>
            <button
              onClick={() => setLocation('/register')}
              className="w-full h-12 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200"
            >
              Commencer maintenant
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200">
        <div className="grid grid-cols-4 py-2">
          <button className="flex flex-col items-center py-3">
            <div className="w-6 h-6 mb-1 bg-violet-600 rounded"></div>
            <span className="text-xs text-violet-600 font-medium">Modifier</span>
          </button>
          <button className="flex flex-col items-center py-3">
            <div className="w-6 h-6 mb-1 bg-gray-300 rounded"></div>
            <span className="text-xs text-gray-600">Sélectionner</span>
          </button>
          <button className="flex flex-col items-center py-3">
            <div className="w-6 h-6 mb-1 bg-gray-300 rounded"></div>
            <span className="text-xs text-gray-600">Enregistrer</span>
          </button>
          <button className="flex flex-col items-center py-3">
            <div className="w-6 h-6 mb-1 bg-gray-300 rounded"></div>
            <span className="text-xs text-gray-600">Partager</span>
          </button>
        </div>
      </div>
    </main>
  );
}