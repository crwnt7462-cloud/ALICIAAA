import { useState } from "react";
import { Search } from "lucide-react";
import { useLocation } from "wouter";

export default function PublicLanding() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      setLocation('/search');
    }
  };

  const stats = [
    { number: "50.000+", label: "Rendez vous par mois" },
    { number: "2.500+", label: "Salons partenaires" },
    { number: "4.9/5", label: "Satisfaction client" },
    { number: "24h/24", label: "Réservation disponible" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Header simple et épuré */}
      <header className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="text-2xl font-bold text-purple-600">
          avyento
        </div>
        
        {/* Bouton Login */}
        <button
          onClick={() => setLocation('/pro-login')}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full font-medium transition-colors"
        >
          Login
        </button>
      </header>

      {/* Section principale */}
      <main className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
        {/* Contenu de gauche */}
        <div className="space-y-8">
          {/* Badge */}
          <div className="flex items-center gap-2 text-purple-600">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            <span className="font-medium">Réserver votre rendez vous</span>
          </div>

          {/* Titre principal */}
          <div className="space-y-2">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Réservez votre<br />
              <span className="text-gray-900">rendez-vous</span> <span className="text-gray-600">beauté</span>
            </h1>
          </div>

          {/* Sous-titre */}
          <p className="text-gray-600 text-lg leading-relaxed">
            Trouvez et réservez chez tes meilleurs<br />
            professionnels près de chez vous
          </p>

          {/* Barre de recherche */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un salon"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            <button
              onClick={handleSearch}
              className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-2xl font-medium transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Rechercher un salon
            </button>
          </div>
        </div>

        {/* Mockup téléphone à droite */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative">
            {/* Téléphone mockup */}
            <div className="w-80 h-[640px] bg-white rounded-[3rem] shadow-2xl border-8 border-gray-100 overflow-hidden transform rotate-12 hover:rotate-6 transition-transform duration-700">
              {/* Interface du téléphone */}
              <div className="h-full bg-gradient-to-b from-purple-50 to-white p-6 relative">
                {/* Status bar */}
                <div className="flex justify-between items-center text-xs text-gray-600 mb-8">
                  <span>9:41</span>
                  <div className="flex gap-1">
                    <div className="w-4 h-2 bg-gray-300 rounded"></div>
                    <div className="w-4 h-2 bg-gray-300 rounded"></div>
                    <div className="w-6 h-2 bg-green-500 rounded"></div>
                  </div>
                </div>

                {/* App content */}
                <div className="space-y-6">
                  <div className="text-purple-600 font-semibold">Sélectionnez</div>
                  <div className="text-gray-600">Coiffeur cheveux</div>
                  <div className="text-gray-600">Barbier</div>
                  
                  <div className="text-4xl font-bold text-gray-900">90.000+</div>
                  <div className="text-purple-600 text-sm">1.000+</div>
                  <div className="text-yellow-500 text-sm">4.0 ⭐⭐⭐⭐</div>
                  
                  <div className="text-gray-600 text-sm">
                    Salons<br />
                    Coiffeurs professionnels<br />
                    & esthétique
                  </div>

                  <button className="bg-purple-500 text-white px-6 py-3 rounded-full text-sm font-medium w-full">
                    Prendre à votre position
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Statistiques en bas */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}