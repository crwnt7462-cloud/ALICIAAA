import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Clock, Shield, Award, CheckCircle2, Sparkles, Heart, Scissors, Truck, X, LogIn, UserCheck, Scissors as ScissorsIcon, Users as UsersIcon, Palette, Sparkles as SparklesIcon, User, Bot, MessageCircle, Zap, ArrowRight, Play, Cpu, Brain, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import logoImage from "@assets/3_1753714421825.png";



// Composant HeroSlash selon spécifications strictes
function HeroSlash() {
  return (
    <section className="heroSlash">
      <div className="heroSlash__inner">
        
        {/* Colonne gauche */}
        <div className="heroSlash__left">
          <div className="heroSlash__badge">
            <span className="dot" />
            <span>Réservation instantanée</span>
          </div>

          <h1 className="heroSlash__title">
            Réservez votre<br/> rendez-vous <span className="light">beauté</span>
          </h1>

          <p className="heroSlash__subtitle">
            Trouvez et réservez chez les meilleurs professionnels près de chez vous
          </p>

          {/* Barre de recherche + CTA */}
          <div className="heroSlash__search heroSlash__search--double">
            {/* Champ Service */}
            <div className="field">
              <input placeholder="Service (coiffure, massage…)" />
              <span className="icon">
                {/* loupe */}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M10.5 18a7.5 7.5 0 1 1 5.3-12.8A7.5 7.5 0 0 1 10.5 18Zm8-1 4 4" 
                        stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
                </svg>
              </span>
            </div>

            {/* Champ Ville */}
            <div className="field">
              <input placeholder="Ville" />
              <span className="icon location">
                {/* pin */}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 22s7-6.2 7-12A7 7 0 0 0 5 10c0 5.8 7 12 7 12Z" 
                        stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
                  <circle cx="12" cy="10" r="2.5" fill="currentColor"/>
                </svg>
              </span>
            </div>

            <button className="heroSlash__cta">Rechercher un salon</button>
          </div>

          {/* KPIs */}
          <ul className="heroSlash__kpis">
            <li><strong>50 000+</strong><span>Rendez-vous / mois</span></li>
            <li><strong>2 500+</strong><span>Salons partenaires</span></li>
            <li><strong>4,9/5</strong><span>Satisfaction client</span></li>
            <li><strong>24h/24</strong><span>Réservation dispo</span></li>
          </ul>
        </div>

        {/* Colonne droite — téléphone glass */}
        <div className="heroSlash__right">
          <div className="heroPhone">
            <div className="heroPhone__screen">
              <div className="heroPhone__pill" />
              <div className="heroPhone__row" />
              <div className="heroPhone__row" />
              <div className="heroPhone__stat" />
              <div className="heroPhone__cta" />
            </div>
          </div>
          <div className="heroSlash__pad" />
        </div>
      </div>
    </section>
  );
}

export default function PublicLanding() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const stats = [
    { number: "50,000+", label: "Rendez-vous par mois" },
    { number: "2,500+", label: "Salons partenaires" },
    { number: "4.9/5", label: "Satisfaction client" },
    { number: "24h/24", label: "Réservation disponible" }
  ];

  const features = [
    {
      icon: <Bot className="w-8 h-8" />,
      title: "IA Révolutionnaire",
      description: "Seule plateforme avec IA prédictive pour optimiser vos plannings automatiquement",
      highlight: "EXCLUSIF",
      color: "violet"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Messagerie Intégrée",
      description: "Communication directe pro-client avec notifications temps réel",
      highlight: "NOUVEAU",
      color: "blue"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Automatisation Complète",
      description: "Rappels, confirmations et gestion de l'agenda 100% automatisés",
      highlight: "PRO",
      color: "amber"
    }
  ];





  const handleSearch = () => {
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const menuItems = [
    { 
      id: 'client-login', 
      label: 'Se connecter', 
      icon: <User className="w-5 h-5" />,
      action: () => setLocation("/client-login-modern")
    },
    { 
      id: 'login', 
      label: 'Espace Pro', 
      icon: <LogIn className="w-5 h-5" />,
      action: () => setLocation("/pro-login")
    },
    { 
      id: 'pro', 
      label: 'Je suis un professionnel de beauté', 
      icon: <UserCheck className="w-5 h-5" />,
      action: () => setLocation("/professional-plans")
    },
    { 
      id: 'coiffeur', 
      label: 'Coiffeur', 
      icon: <ScissorsIcon className="w-5 h-5" />,
      action: () => handleSearch()
    },
    { 
      id: 'barbier', 
      label: 'Barbier', 
      icon: <UsersIcon className="w-5 h-5" />,
      action: () => handleSearch()
    },
    { 
      id: 'manucure', 
      label: 'Manucure', 
      icon: <Palette className="w-5 h-5" />,
      action: () => handleSearch()
    },
    { 
      id: 'institut', 
      label: 'Institut de beauté', 
      icon: <SparklesIcon className="w-5 h-5" />,
      action: () => handleSearch()
    }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleMenuItemClick = (item: typeof menuItems[0]) => {
    if (item.id === 'coiffeur') {
      setSearchQuery('coiffure');
      setLocation(`/search?q=coiffure`);
    } else if (item.id === 'barbier') {
      setSearchQuery('barbier');
      setLocation(`/search?q=barbier`);
    } else if (item.id === 'manucure') {
      setSearchQuery('ongle');
      setLocation(`/search?q=ongle`);
    } else if (item.id === 'institut') {
      setSearchQuery('esthetique');
      setLocation(`/search?q=esthetique`);
    } else {
      item.action();
    }
    closeMenu();
  };

  // Effet pour fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMenuOpen && !target.closest('#hamburger-menu') && !target.closest('#hamburger-button')) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Empêcher le scroll du body
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen bg-white">
      {/* Menu plein écran style ProQuote avec Framer Motion */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Backdrop avec blur */}
            <motion.div 
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              initial={{ backdropFilter: "blur(0px)" }}
              animate={{ backdropFilter: "blur(12px)" }}
              exit={{ backdropFilter: "blur(0px)" }}
              onClick={closeMenu}
            />
            
            {/* Menu principal plein écran */}
            <motion.div 
              className="relative w-full h-full bg-white"
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8
              }}
            >
              {/* Header du menu plein écran */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <motion.div 
                  className="flex items-center gap-3"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <img src={logoImage} alt="Logo" className="h-10 w-auto" />
                  <span className="text-xl font-bold text-gray-900">Menu</span>
                </motion.div>
                
                <motion.button
                  onClick={closeMenu}
                  className="p-3 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-6 h-6 text-gray-600" />
                </motion.button>
              </div>

              {/* Navigation simple et épurée */}
              <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto px-6">
                <nav className="space-y-4">
                  {menuItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      onClick={() => handleMenuItemClick(item)}
                      className="w-full text-left group"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ 
                        delay: 0.2 + index * 0.1,
                        duration: 0.5,
                        ease: "easeOut"
                      }}
                      whileHover={{ x: 20 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="py-3 border-b border-gray-100 group-hover:border-violet-200 transition-colors duration-300">
                        <h2 className="text-sm font-medium text-gray-900 group-hover:text-violet-600 transition-colors duration-300">
                          {item.label}
                        </h2>
                      </div>
                    </motion.button>
                  ))}
                </nav>
              </div>

              {/* Footer simple */}
              <motion.div 
                className="p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <div className="max-w-2xl mx-auto text-center">
                  <p className="text-gray-500 text-sm">
                    Une question ? 
                    <button 
                      className="text-violet-600 hover:text-violet-700 ml-2 underline"
                      onClick={() => {
                        setLocation('/support');
                        closeMenu();
                      }}
                    >
                      Contactez-nous
                    </button>
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header professionnel */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 backdrop-blur-lg bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              {/* Bouton hamburger animé avec Framer Motion */}
              <motion.button
                id="hamburger-button"
                onClick={toggleMenu}
                className="relative p-3 hover:bg-gray-100/80 rounded-xl transition-colors duration-200 lg:hidden"
                aria-label="Menu"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center gap-1">
                  <motion.span 
                    className="block w-6 h-0.5 bg-gray-700 rounded-full"
                    animate={{
                      rotate: isMenuOpen ? 45 : 0,
                      y: isMenuOpen ? 6 : 0
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                  <motion.span 
                    className="block w-6 h-0.5 bg-gray-700 rounded-full"
                    animate={{
                      opacity: isMenuOpen ? 0 : 1,
                      scale: isMenuOpen ? 0 : 1
                    }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span 
                    className="block w-6 h-0.5 bg-gray-700 rounded-full"
                    animate={{
                      rotate: isMenuOpen ? -45 : 0,
                      y: isMenuOpen ? -6 : 0
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </div>
              </motion.button>

              <div>
                <img src={logoImage} alt="Logo" className="h-24 w-auto" />
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              <Button 
                className="glass-button text-black text-sm md:text-base px-2 md:px-4 hidden lg:flex rounded-lg"
                onClick={() => setLocation("/client-login-modern")}
              >
                <span className="hidden md:inline">Se connecter</span>
                <span className="md:hidden">Connexion</span>
              </Button>
              <Button 
                className="glass-button text-black text-sm md:text-base px-3 md:px-4 h-9 md:h-10 rounded-lg hidden lg:flex"
                onClick={() => setLocation("/salon/salon-elegance")}
              >
                Réserver
              </Button>
              <Button 
                className="glass-button p-2 rounded-lg"
                onClick={() => setLocation("/pro-login")}
              >
                <LogIn className="w-5 h-5 text-black" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Nouveau Hero selon spécifications exactes */}
      <HeroSlash />

      {/* Section IA Exclusive - Inspired by SaaS template */}
      <section className="py-16 bg-gradient-to-br from-violet-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-4"
            >
              <Cpu className="w-4 h-4" />
              Intelligence Artificielle Avancée
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            >
              Révolutionnez votre salon avec l'<span className="text-violet-600">IA</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Seule plateforme beauté intégrant une IA prédictive pour optimiser automatiquement vos plannings et maximiser vos revenus.
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="bg-white/70 backdrop-blur-lg border border-white/30 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 h-full">
                  <div className="absolute top-4 right-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      feature.color === 'violet' ? 'bg-violet-100 text-violet-700' :
                      feature.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {feature.highlight}
                    </span>
                  </div>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${
                    feature.color === 'violet' ? 'bg-violet-100 text-violet-600' :
                    feature.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    'bg-amber-100 text-amber-600'
                  }`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <Button className="glass-button-violet w-full group-hover:scale-105 transition-transform">
                    En savoir plus
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Messagerie Intégrée Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <MessageSquare className="w-4 h-4" />
                Communication Révolutionnaire
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Messagerie intégrée <span className="text-blue-600">pro-client</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Communiquez directement avec vos clients via notre messagerie intégrée. 
                Notifications temps réel, historique complet, tout dans une seule interface.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Messages temps réel instantanés</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Notifications push automatiques</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Historique conversations sauvegardé</span>
                </div>
              </div>
              <Button className="glass-button-violet">
                <Play className="w-4 h-4 mr-2" />
                Voir la démo
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/30 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-violet-600" />
                      </div>
                      <span className="font-medium text-gray-900">Sophie Martin</span>
                      <span className="text-xs text-gray-500">Il y a 2 min</span>
                    </div>
                    <p className="text-gray-700">Bonjour ! Je souhaiterais décaler mon RDV de demain à 15h, est-ce possible ?</p>
                  </div>
                  <div className="bg-violet-500 rounded-2xl p-4 ml-8">
                    <p className="text-white">Bien sûr ! Je vous confirme le nouveau créneau 15h-16h30. À bientôt 😊</p>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-gray-400">✓ Lu par Sophie</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistiques améliorées */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Rejoignez des milliers de professionnels</h2>
            <p className="text-xl text-gray-600">Ils nous font confiance pour développer leur activité</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-violet-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Nos services
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { name: "Coiffure", icon: <Scissors className="w-6 h-6" /> },
              { name: "Esthétique", icon: <Sparkles className="w-6 h-6" /> },
              { name: "Massage", icon: <Heart className="w-6 h-6" /> },
              { name: "Onglerie", icon: <Star className="w-6 h-6" /> }
            ].map((service, index) => (
              <div 
                key={index} 
                className="text-center p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                  setSearchQuery(service.name.toLowerCase());
                  handleSearch();
                }}
              >
                <div className="text-violet-600 mb-2 flex justify-center">{service.icon}</div>
                <div className="text-sm text-gray-700 font-medium">{service.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Salons recommandés */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Salons recommandés
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez nos partenaires les mieux notés
            </p>
          </div>

          <div className="space-y-4">
            {/* Barbier Moderne */}
            <div 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setLocation('/salon/barbier-gentleman-marais')}
            >
              <div className="relative h-48 bg-gradient-to-br from-amber-400 to-orange-500">
                <img 
                  src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop"
                  alt="Barbier Moderne"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-white text-gray-900 text-xs px-2 py-1 rounded-full font-medium">
                    <CheckCircle2 className="h-3 w-3 inline mr-1" />
                    Vérifié
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg mb-1">Barbier Moderne</h4>
                    <p className="text-sm text-gray-500 mb-2">République, Paris 11ème</p>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">€€</span>
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">4.8</span>
                    <span className="text-sm text-gray-500">(156 avis)</span>
                  </div>
                  <span className="text-sm text-gray-500">• 0.8 km</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Coupe homme
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Barbe
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Shampoing
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-green-600 font-medium">
                      Dispo 11:30
                    </span>
                  </div>
                  <button 
                    className="glass-button text-black px-4 py-2 rounded-xl text-sm font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation('/salon/barbier-gentleman-marais');
                    }}
                  >
                    Réserver
                  </button>
                </div>
              </div>
            </div>

            {/* Salon Excellence */}
            <div 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setLocation('/salon/salon-excellence-paris')}
            >
              <div className="relative h-48 bg-gradient-to-br from-pink-400 to-rose-500">
                <img 
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop"
                  alt="Salon Excellence"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-white text-gray-900 text-xs px-2 py-1 rounded-full font-medium">
                    <CheckCircle2 className="h-3 w-3 inline mr-1" />
                    Vérifié
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg mb-1">Salon Excellence</h4>
                    <p className="text-sm text-gray-500 mb-2">Marais, Paris 4ème</p>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">€€€</span>
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">4.9</span>
                    <span className="text-sm text-gray-500">(298 avis)</span>
                  </div>
                  <span className="text-sm text-gray-500">• 1.2 km</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Coupe
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Coloration
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Brushing
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-green-600 font-medium">
                      Dispo 14:15
                    </span>
                  </div>
                  <button 
                    className="glass-button text-black px-4 py-2 rounded-xl text-sm font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation('/salon/salon-excellence-paris');
                    }}
                  >
                    Réserver
                  </button>
                </div>
              </div>
            </div>

            {/* Beauty Institute */}
            <div 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setLocation('/salon/institut-beaute-saint-germain')}
            >
              <div className="relative h-48 bg-gradient-to-br from-purple-400 to-indigo-500">
                <img 
                  src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop"
                  alt="Beauty Institute"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-white text-gray-900 text-xs px-2 py-1 rounded-full font-medium">
                    <CheckCircle2 className="h-3 w-3 inline mr-1" />
                    Vérifié
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg mb-1">Beauty Institute</h4>
                    <p className="text-sm text-gray-500 mb-2">Saint-Germain, Paris 6ème</p>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">€€</span>
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">4.7</span>
                    <span className="text-sm text-gray-500">(187 avis)</span>
                  </div>
                  <span className="text-sm text-gray-500">• 1.5 km</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Soins visage
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Épilation
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Massage
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500 font-medium">
                      Fermé
                    </span>
                  </div>
                  <button 
                    className="glass-button text-black px-4 py-2 rounded-xl text-sm font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation('/salon/institut-beaute-saint-germain');
                    }}
                  >
                    Réserver
                  </button>
                </div>
              </div>
            </div>

            {/* Nail Art Studio */}
            <div 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setLocation('/salon/nail-art-opera')}
            >
              <div className="relative h-48 bg-gradient-to-br from-emerald-400 to-teal-500">
                <img 
                  src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop"
                  alt="Nail Art Studio"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-white text-gray-900 text-xs px-2 py-1 rounded-full font-medium">
                    <CheckCircle2 className="h-3 w-3 inline mr-1" />
                    Vérifié
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg mb-1">Nail Art Studio</h4>
                    <p className="text-sm text-gray-500 mb-2">Opéra, Paris 9ème</p>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">€€</span>
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">4.6</span>
                    <span className="text-sm text-gray-500">(89 avis)</span>
                  </div>
                  <span className="text-sm text-gray-500">• 2.1 km</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Manucure
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Pose gel
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Nail art
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-green-600 font-medium">
                      Dispo 15:30
                    </span>
                  </div>
                  <button 
                    className="glass-button text-black px-4 py-2 rounded-xl text-sm font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation('/salon/nail-art-opera');
                    }}
                  >
                    Réserver
                  </button>
                </div>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="py-20 bg-gradient-to-br from-white via-purple-50/20 to-pink-50/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Prêt à transformer votre routine beauté ?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Découvrez des milliers de salons vérifiés près de chez vous et réservez en quelques clics.
          </p>
          <button 
            className="glass-button text-black px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl"
            onClick={() => setLocation('/search')}
          >
            Explorer tous les salons
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">BeautyApp</h3>
              <p className="text-gray-400 text-sm">
                La plateforme de réservation beauté qui révolutionne votre expérience.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/search')}
                >
                  Coiffure
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/search')}
                >
                  Esthétique
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/search')}
                >
                  Manucure
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/search')}
                >
                  Massage
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/centre-aide')}
                >
                  Centre d'aide
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/contact')}
                >
                  Contact
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/cgu')}
                >
                  CGU
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/confidentialite')}
                >
                  Confidentialité
                </div>
              </div>
            </div>

          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 BeautyApp. Tous droits réservés.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <button className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.017 6.75a1.75 1.75 0 100-3.5 1.75 1.75 0 000 3.5zM12.017 0A10 10 0 0022 10.017c0 5.522-4.478 9.983-10 9.983S2 15.539 2 10.017C2 4.495 6.478.017 12.017.017zm0 18.7a8.683 8.683 0 100-17.366 8.683 8.683 0 000 17.366z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
