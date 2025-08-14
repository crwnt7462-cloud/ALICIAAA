import { useState } from 'react';
import { useLocation } from 'wouter';
import { Search, MapPin, Star, Users, Calendar, MessageSquare, Brain, Sparkles, ArrowRight, Play, ShieldCheck, Clock, Heart, Zap } from 'lucide-react';

export default function HomePage() {
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

  const handleCategoryClick = (category: string) => {
    setLocation(`/search?service=${encodeURIComponent(category)}`);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--avyento-bg)' }}>
      {/* Hero Section */}
      <section className="section-ios text-center py-16 lg:py-20">
        <div className="badge-ios mb-6">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <span className="text-sm font-semibold text-gray-800">Plateforme #1 en France</span>
        </div>
        
        <h1 className="title-xl font-bold text-gray-900 mb-6 max-w-4xl mx-auto">
          Réservez votre beauté en 
          <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent"> quelques clics</span>
        </h1>
        
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Découvrez les meilleurs salons de beauté près de chez vous. Réservation instantanée, 
          confirmation automatique, zéro stress.
        </p>

        {/* Search Bar */}
        <div className="search-grid max-w-4xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Coiffeur, esthéticienne, manucure..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-ios pl-12 font-medium text-gray-800 placeholder-gray-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Paris, Lyon, Marseille..."
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="input-ios pl-12 font-medium text-gray-800 placeholder-gray-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <button
            onClick={handleSearch}
            className="cta-ios h-[52px] px-8 flex items-center justify-center gap-2 font-semibold"
          >
            Rechercher
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Popular Searches */}
        <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
          <span className="text-sm text-gray-600 mr-3">Recherches populaires :</span>
          {['Coiffeur', 'Manucure', 'Massage', 'Épilation'].map((term) => (
            <button
              key={term}
              onClick={() => handleCategoryClick(term)}
              className="chip-ios hover:bg-violet-100 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </section>

      {/* KPIs Section */}
      <section className="section-ios">
        <div className="kpis">
          <div className="glass-ios p-6 text-center">
            <div className="text-2xl font-bold text-violet-600 mb-2">50K+</div>
            <div className="text-sm text-gray-600 font-medium">Professionnels partenaires</div>
          </div>
          <div className="glass-ios p-6 text-center">
            <div className="text-2xl font-bold text-violet-600 mb-2">2M+</div>
            <div className="text-sm text-gray-600 font-medium">Rendez-vous réservés</div>
          </div>
          <div className="glass-ios p-6 text-center">
            <div className="text-2xl font-bold text-violet-600 mb-2">4.9★</div>
            <div className="text-sm text-gray-600 font-medium">Satisfaction client</div>
          </div>
          <div className="glass-ios p-6 text-center">
            <div className="text-2xl font-bold text-violet-600 mb-2">300+</div>
            <div className="text-sm text-gray-600 font-medium">Villes couvertes</div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-ios">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Explorez nos catégories
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Coiffeur', icon: '💇‍♀️', count: '15K+ salons' },
            { name: 'Esthétique', icon: '💄', count: '8K+ instituts' },
            { name: 'Massage', icon: '💆‍♀️', count: '5K+ spas' },
            { name: 'Manucure', icon: '💅', count: '12K+ bars à ongles' },
            { name: 'Barbier', icon: '✂️', count: '3K+ barbershops' },
            { name: 'Épilation', icon: '🪒', count: '6K+ centres' },
            { name: 'Wellness', icon: '🧘‍♀️', count: '2K+ centres' },
            { name: 'Tatouage', icon: '🎨', count: '800+ studios' }
          ].map((category) => (
            <button
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className="glass-ios p-6 text-center group"
            >
              <div className="text-3xl mb-3">{category.icon}</div>
              <div className="font-semibold text-gray-900 mb-1 group-hover:text-violet-600 transition-colors">
                {category.name}
              </div>
              <div className="text-sm text-gray-500">{category.count}</div>
            </button>
          ))}
        </div>
      </section>

      {/* IA Anti No-Show Section */}
      <section className="section-ios">
        <div className="glass-ios p-8 lg:p-12 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="badge-ios mb-4">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-gray-800">Exclusif Pro+</span>
          </div>
          
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            IA Anti No-Show
          </h3>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Notre intelligence artificielle prédit et prévient 85% des annulations de dernière minute. 
            Optimisez votre planning et augmentez votre chiffre d'affaires.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="p-3 bg-green-100 rounded-xl w-fit mx-auto mb-3">
                <ShieldCheck className="w-6 h-6 text-green-600" />
              </div>
              <div className="font-semibold text-gray-900 mb-1">Prédiction avancée</div>
              <div className="text-sm text-gray-600">Analyse comportementale client</div>
            </div>
            
            <div className="text-center">
              <div className="p-3 bg-blue-100 rounded-xl w-fit mx-auto mb-3">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="font-semibold text-gray-900 mb-1">Rappels intelligents</div>
              <div className="text-sm text-gray-600">Notifications personnalisées</div>
            </div>
            
            <div className="text-center">
              <div className="p-3 bg-purple-100 rounded-xl w-fit mx-auto mb-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="font-semibold text-gray-900 mb-1">Liste d'attente auto</div>
              <div className="text-sm text-gray-600">Remplissage optimisé</div>
            </div>
          </div>
          
          <button
            onClick={() => setLocation('/pro-features')}
            className="cta-ios px-8 py-4 text-lg"
          >
            Découvrir Pro+
          </button>
        </div>
      </section>

      {/* Messagerie Section */}
      <section className="section-ios">
        <div className="glass-ios p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center mb-4">
                <MessageSquare className="w-6 h-6 text-violet-600 mr-3" />
                <span className="text-sm font-semibold text-violet-600 uppercase tracking-wide">Messagerie intégrée</span>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Communiquez en temps réel
              </h3>
              
              <p className="text-lg text-gray-600 mb-6">
                Chat intégré entre clients et professionnels. Posez vos questions, 
                confirmez vos rendez-vous, partagez vos inspirations directement dans l'app.
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-violet-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Messages instantanés</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-violet-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Partage de photos</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-violet-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Notifications push</span>
                </li>
              </ul>
              
              <button
                onClick={() => setLocation('/messaging')}
                className="cta-ghost-ios px-6 py-3 rounded-lg font-semibold transition-colors hover:bg-violet-50"
              >
                En savoir plus
              </button>
            </div>
            
            <div className="relative">
              <div className="glass-ios p-6 max-w-sm mx-auto">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-3">
                        <p className="text-sm text-gray-800">Bonjour, j'aimerais une coupe tendance ✨</p>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">10:30</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start flex-row-reverse">
                    <div className="w-8 h-8 bg-violet-500 rounded-full ml-3"></div>
                    <div className="flex-1">
                      <div className="bg-violet-500 text-white rounded-2xl rounded-tr-sm p-3">
                        <p className="text-sm">Parfait ! J'ai quelques idées à vous proposer 😊</p>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 text-right">10:32</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Salons Recommandés Section */}
      <section className="section-ios">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Salons recommandés
          </h2>
          <button
            onClick={() => setLocation('/salons')}
            className="text-violet-600 hover:text-violet-700 font-semibold flex items-center"
          >
            Voir tout
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "Salon Excellence Paris",
              image: "/api/placeholder/300/200",
              rating: 4.9,
              reviews: 234,
              address: "75016 Paris",
              price: "À partir de 35€",
              badge: "Nouveau"
            },
            {
              name: "Studio Hair Design",
              image: "/api/placeholder/300/200", 
              rating: 4.8,
              reviews: 189,
              address: "69002 Lyon",
              price: "À partir de 40€",
              badge: "Populaire"
            },
            {
              name: "Beauty Lounge",
              image: "/api/placeholder/300/200",
              rating: 4.9,
              reviews: 156,
              address: "13001 Marseille", 
              price: "À partir de 30€",
              badge: "Top Rated"
            }
          ].map((salon, index) => (
            <button
              key={index}
              onClick={() => setLocation(`/salon/${salon.name.toLowerCase().replace(/\s+/g, '-')}`)}
              className="glass-ios overflow-hidden text-left group"
            >
              <div className="aspect-video bg-gray-100 relative mb-4">
                <div className="absolute top-3 left-3">
                  <span className="badge-ios text-xs">
                    {salon.badge}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">
                  {salon.name}
                </h3>
                
                <div className="flex items-center mb-2">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700 ml-1">
                    {salon.rating}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    ({salon.reviews} avis)
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {salon.address}
                </div>
                
                <div className="text-sm font-medium text-violet-600">
                  {salon.price}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="section-ios text-center py-16">
        <div className="glass-ios p-8 lg:p-12 max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-6 h-6 text-rose-500 mr-2" />
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              Rejoignez la communauté
            </span>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Prêt(e) à transformer votre expérience beauté ?
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Plus de 2 millions de clients nous font confiance. 
            Découvrez pourquoi Avyento est la plateforme préférée des professionnels de la beauté.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setLocation('/register')}
              className="cta-ios px-8 py-4 text-lg"
            >
              Commencer maintenant
            </button>
            
            <button
              onClick={() => setLocation('/demo')}
              className="cta-ghost-ios px-6 py-3 rounded-lg font-semibold transition-colors hover:bg-violet-50 flex items-center"
            >
              <Play className="w-4 h-4 mr-2" />
              Voir la démo
            </button>
          </div>
          
          <div className="flex items-center justify-center mt-8 text-sm text-gray-500">
            <div className="flex items-center mr-6">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Gratuit pour les clients
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Essai 14 jours pour les pros
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}