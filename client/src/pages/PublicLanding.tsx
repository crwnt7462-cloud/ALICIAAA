import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Clock, CheckCircle2, X, LogIn, UserCheck, User, Bot, Zap, ArrowRight, Crown, Waves, Flame, ChevronDown, HelpCircle, Cookie, Scissors, Palette, Users, Sparkles } from "lucide-react";

import { useLocation } from "wouter";
import logoImage from "@assets/3_1753714421825.png";



// Composant HeroSlash avec animations de frappe
function HeroSlash() {
  const [cityText, setCityText] = useState("");
  const [cityIndex, setCityIndex] = useState(0);
  const [cityCharIndex, setCityCharIndex] = useState(0);
  const [isCityDeleting, setIsCityDeleting] = useState(false);

  const [serviceText, setServiceText] = useState("");
  const [serviceIndex, setServiceIndex] = useState(0);
  const [serviceCharIndex, setServiceCharIndex] = useState(0);
  const [isServiceDeleting, setIsServiceDeleting] = useState(false);

  const frenchCities = [
    "Paris",
    "Lyon",
    "Marseille",
    "Toulouse",
    "Nice",
    "Nantes",
    "Bordeaux",
    "Lille",
    "Rennes",
    "Strasbourg"
  ];

  const beautyServices = [
    "Coiffure",
    "Massage",
    "Manucure",
    "Esthétique",
    "Barbier",
    "Extensions",
    "Épilation",
    "Soins visage"
  ];

  // Animation pour les villes
  useEffect(() => {
    const currentCity = frenchCities[cityIndex];
    if (!currentCity) return;
    
    const typeSpeed = isCityDeleting ? 50 : 100;
    const pauseTime = isCityDeleting ? 500 : 2000;

    const timeout = setTimeout(() => {
      if (!isCityDeleting && cityCharIndex < currentCity.length) {
        setCityText(currentCity.slice(0, cityCharIndex + 1));
        setCityCharIndex(cityCharIndex + 1);
      } else if (isCityDeleting && cityCharIndex > 0) {
        setCityText(currentCity.slice(0, cityCharIndex - 1));
        setCityCharIndex(cityCharIndex - 1);
      } else if (!isCityDeleting && cityCharIndex === currentCity.length) {
        setTimeout(() => setIsCityDeleting(true), pauseTime);
      } else if (isCityDeleting && cityCharIndex === 0) {
        setIsCityDeleting(false);
        setCityIndex((cityIndex + 1) % frenchCities.length);
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [cityText, cityCharIndex, cityIndex, isCityDeleting, frenchCities]);

  // Animation pour les services
  useEffect(() => {
    const currentService = beautyServices[serviceIndex];
    if (!currentService) return;
    
    const typeSpeed = isServiceDeleting ? 60 : 120;
    const pauseTime = isServiceDeleting ? 600 : 2500;

    const timeout = setTimeout(() => {
      if (!isServiceDeleting && serviceCharIndex < currentService.length) {
        setServiceText(currentService.slice(0, serviceCharIndex + 1));
        setServiceCharIndex(serviceCharIndex + 1);
      } else if (isServiceDeleting && serviceCharIndex > 0) {
        setServiceText(currentService.slice(0, serviceCharIndex - 1));
        setServiceCharIndex(serviceCharIndex - 1);
      } else if (!isServiceDeleting && serviceCharIndex === currentService.length) {
        setTimeout(() => setIsServiceDeleting(true), pauseTime);
      } else if (isServiceDeleting && serviceCharIndex === 0) {
        setIsServiceDeleting(false);
        setServiceIndex((serviceIndex + 1) % beautyServices.length);
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [serviceText, serviceCharIndex, serviceIndex, isServiceDeleting, beautyServices]);

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
            {/* Champ Service avec animation */}
            <div className="field">
              <input 
                value={serviceText} 
                placeholder={serviceText || "Service"} 
                readOnly
                style={{ cursor: 'pointer' }}
              />
              <span className="icon">
                {/* loupe */}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M10.5 18a7.5 7.5 0 1 1 5.3-12.8A7.5 7.5 0 0 1 10.5 18Zm8-1 4 4" 
                        stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
                </svg>
              </span>
            </div>

            {/* Champ Ville avec animation */}
            <div className="field">
              <input 
                value={cityText} 
                placeholder={cityText || "Ville"} 
                readOnly
                style={{ cursor: 'pointer' }}
              />
              <span className="icon location">
                {/* pin */}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 22s7-6.2 7-12A7 7 0 0 0 5 10c0 5.8 7 12 7 12Z" 
                        stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
                  <circle cx="12" cy="10" r="2.5" fill="currentColor"/>
                </svg>
              </span>
            </div>

            <button className="glass-button text-black px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl">Rechercher un salon</button>
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
              {/* Mockup interface Avyento */}
              <div className="w-full h-full bg-gradient-to-b from-gray-50 to-white flex flex-col text-xs">
                {/* Header app */}
                <div className="flex items-center justify-between p-3 bg-white shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">A</span>
                    </div>
                    <span className="font-semibold text-gray-900">Avyento</span>
                  </div>
                  <div className="text-gray-500 text-xs">14:30</div>
                </div>
                
                {/* Contenu booking */}
                <div className="flex-1 p-3 space-y-3">
                  {/* Salon sélectionné */}
                  <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                      <div>
                        <div className="font-medium text-gray-900 text-xs">Salon Excellence</div>
                        <div className="text-gray-500 text-xs">Paris 8ème • 1.2 km</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs font-medium">4.8</span>
                      <span className="text-gray-400 text-xs">(247 avis)</span>
                    </div>
                  </div>
                  
                  {/* Service sélectionné */}
                  <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900 text-xs">Coupe + Shampooing</div>
                      <div className="text-violet-600 font-semibold text-xs">45€</div>
                    </div>
                    <div className="text-gray-500 text-xs">Durée : 1h00</div>
                  </div>
                  
                  {/* Créneau sélectionné */}
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-3 border border-violet-200">
                    <div className="text-violet-900 font-medium text-xs mb-1">Aujourd'hui</div>
                    <div className="text-violet-700 text-xs">14:30 - 15:30</div>
                  </div>
                </div>
                
                {/* Bouton confirmation */}
                <div className="p-3">
                  <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl py-3 px-4 text-center">
                    <span className="text-white font-semibold text-xs">Confirmer le rendez-vous</span>
                  </div>
                </div>
              </div>
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
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showCookiePopup, setShowCookiePopup] = useState(false);

  // Vérifier si l'utilisateur a déjà donné son consentement
  useEffect(() => {
    const cookieConsent = localStorage.getItem('avyento-cookie-consent');
    if (!cookieConsent) {
      setShowCookiePopup(true);
    }
  }, []);

  // Gérer l'acceptation/refus des cookies
  const handleCookieChoice = (accepted: boolean) => {
    localStorage.setItem('avyento-cookie-consent', accepted ? 'accepted' : 'declined');
    setShowCookiePopup(false);
  };

  const stats = [
    { number: "50,000+", label: "Rendez-vous par mois" },
    { number: "2,500+", label: "Salons partenaires" },
    { number: "4.9/5", label: "Satisfaction client" },
    { number: "24h/24", label: "Réservation disponible" }
  ];

  const aiFeatures = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: "IA Prédictive",
      description: "Analyse vos données pour prédire les créneaux les plus rentables et optimiser automatiquement votre planning",
      highlight: "EXCLUSIF",
      benefits: ["Augmentation CA +35%", "Optimisation temps réel", "Prédictions précises"]
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Automatisation Complète",
      description: "Gestion automatique des rappels, confirmations et follow-up clients sans intervention",
      highlight: "PRO",
      benefits: ["Zéro oubli", "Gain de temps 3h/jour", "Satisfaction client +40%"]
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Marie Dubois",
      role: "Directrice, Salon Élégance",
      avatar: "M",
      content: "Avyento a révolutionné notre salon ! L'IA prédit parfaitement nos créneaux optimaux et nous avons augmenté notre CA de 35%.",
      rating: 5,
      location: "Paris 16ème"
    },
    {
      id: 2,
      name: "Thomas Barbier",
      role: "Propriétaire, Barbier Moderne",
      avatar: "T",
      content: "La messagerie intégrée est géniale ! Plus de calls ratés, tout passe par l'app. Mes clients adorent la simplicité.",
      rating: 5,
      location: "Lyon 2ème"
    },
    {
      id: 3,
      name: "Sarah Wellness",
      role: "Institut de beauté",
      avatar: "S",
      content: "Enfin une solution complète ! Planning, paiements, suivi client... tout est centralisé. Un gain de temps énorme.",
      rating: 5,
      location: "Marseille"
    }
  ];

  const faqData = [
    {
      question: "Qu'est-ce qu'Avyento ?",
      answer: "Avyento est une application dédiée à la beauté et au bien-être qui vous permet de trouver facilement les meilleurs salons et professionnels près de chez vous, consulter leurs avis, vérifier leurs disponibilités en temps réel et réserver instantanément. Mais Avyento, c'est plus qu'une simple app : c'est une solution pensée par une ancienne professionnelle de la beauté qui connaît parfaitement les défis du secteur comme les attentes des clientes. Notre mission est simple : rendre vos rendez-vous beauté plus accessibles, plus fluides et surtout plus agréables."
    },
    {
      question: "Comment fonctionne l'application ?",
      answer: "Il vous suffit de créer un compte, de rechercher un salon ou un professionnel, puis de réserver directement en ligne."
    },
    {
      question: "Dois-je appeler le salon pour confirmer ma réservation ?",
      answer: "Non. Votre réservation est confirmée instantanément depuis l'application et vous recevez un rappel automatique avant votre rendez-vous."
    },
    {
      question: "Puis-je annuler ou modifier ma réservation ?",
      answer: "Oui, depuis votre espace personnel, dans les délais indiqués par le professionnel."
    },
    {
      question: "Dois-je payer en avance ?",
      answer: "Vous avez le choix : régler en ligne via l'application, ou bien sur place le jour du rendez-vous."
    },
    {
      question: "Les prix affichés sont-ils définitifs ?",
      answer: "Oui, les tarifs indiqués sont transparents et fixés par le salon/professionnel."
    },
    {
      question: "Mon paiement est-il sécurisé ?",
      answer: "100 %. Nous utilisons des systèmes conformes aux normes bancaires internationales."
    },
    {
      question: "Tous les professionnels sont-ils vérifiés ?",
      answer: "Oui, chaque professionnel est validé avant d'apparaître sur Avyento pour garantir sérieux et qualité."
    },
    {
      question: "Puis-je laisser un avis après mon rendez-vous ?",
      answer: "Bien sûr. Votre avis aide la communauté et valorise le travail des professionnels."
    },
    {
      question: "Comment savoir si un salon est disponible ?",
      answer: "Le calendrier en temps réel vous montre uniquement les créneaux libres."
    },
    {
      question: "Dois-je créer un compte pour réserver ?",
      answer: "Oui, afin de gérer vos rendez-vous et recevoir vos confirmations."
    },
    {
      question: "Que faire si j'ai un problème avec ma réservation ?",
      answer: "Vous pouvez contacter directement le professionnel via l'app ou notre support client disponible 7j/7."
    },
    {
      question: "L'application est-elle gratuite ?",
      answer: "Oui, Avyento est 100 % gratuit à télécharger et à utiliser. Vous ne payez que vos prestations."
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
      icon: <Scissors className="w-5 h-5" />,
      action: () => handleSearch()
    },
    { 
      id: 'barbier', 
      label: 'Barbier', 
      icon: <Users className="w-5 h-5" />,
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
      icon: <Sparkles className="w-5 h-5" />,
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
            <div className="flex items-center" style={{ gap: '2px' }}>
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
            
            <div className="flex items-center gap-3 md:gap-5">
              <button 
                className="glass-button text-black px-6 py-3 rounded-2xl font-semibold shadow-xl hover:shadow-2xl hidden lg:flex"
                onClick={() => setLocation("/client-login-modern")}
              >
                <span className="hidden md:inline">Se connecter</span>
                <span className="md:hidden">Connexion</span>
              </button>
              <button 
                className="glass-button text-black px-6 py-3 rounded-2xl font-semibold shadow-xl hover:shadow-2xl hidden lg:flex"
                onClick={() => setLocation("/salon/salon-elegance")}
              >
                Réserver
              </button>
              <button 
                className="glass-button text-black p-3 rounded-2xl shadow-xl hover:shadow-2xl"
                onClick={() => setLocation("/pro-login")}
              >
                <LogIn className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Nouveau Hero selon spécifications exactes */}
      <HeroSlash />

      {/* Section IA Minimaliste - Style iOS */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block bg-violet-50 text-violet-600 px-3 py-1 rounded-full text-sm font-medium mb-4"
            >
              Intelligence Artificielle
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 mb-1 leading-tight"
            >
              Première plateforme beauté avec <br/><span className="text-violet-600">IA prédictive</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
            >
              Seule solution qui analyse et optimise automatiquement vos revenus.
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            {aiFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-gray-50 rounded-3xl p-6 h-full border border-gray-100 hover:border-violet-200 transition-colors">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-violet-600">{feature.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                        <span className="text-xs font-medium bg-violet-100 text-violet-700 px-2 py-1 rounded-full">
                          {feature.highlight}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                  
                  {/* Avantages */}
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA vers abonnements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <button 
              className="glass-button text-black px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl inline-flex items-center"
              onClick={() => setLocation("/professional-plans")}
            >
              Découvrir nos offres IA
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <p className="text-sm text-gray-500 mt-3">Essai gratuit 7 jours - sans engagement</p>
          </motion.div>
        </div>
      </section>

      {/* Statistiques améliorées */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Rejoignez des milliers de professionnels</h2>
            <p className="text-lg text-gray-600">Ils nous font confiance pour <br className="sm:hidden" />développer leur activité</p>
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

      {/* Section Avis Clients */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4"
            >
              <Star className="w-4 h-4" />
              Avis Clients
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1"
            >
              Ils parlent d'<span className="text-violet-600">Avyento</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
              Découvrez les témoignages de nos professionnels partenaires qui ont transformé leur activité avec notre plateforme.
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 h-full">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  {/* Content */}
                  <blockquote className="text-gray-700 text-lg mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                  
                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                      <span className="text-violet-600 font-bold text-lg">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                      <div className="text-xs text-gray-400">{testimonial.location}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA pour voir plus d'avis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <button className="glass-button text-black px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl inline-flex items-center">
              Voir tous les avis
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Section services moderne glassmorphism */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="heroSlash__title text-3xl mb-4">
              Découvrez nos <span className="light">partenaires</span>
            </h2>
            <p className="heroSlash__subtitle text-base max-w-2xl mx-auto">
              Trouvez l'excellence dans chaque domaine de la beauté avec nos experts certifiés
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Coiffure", icon: Zap, category: "coiffure" },
              { name: "Esthétique", icon: Crown, category: "esthetique" },
              { name: "Massage", icon: Waves, category: "massage" },
              { name: "Onglerie", icon: Flame, category: "onglerie" }
            ].map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.button
                  key={index}
                  onClick={() => {
                    setSearchQuery(service.category);
                    setLocation(`/search?q=${service.category}`);
                  }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative p-6 rounded-3xl text-center transition-all duration-300 glass-button hover:shadow-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center bg-gray-50 text-gray-600 group-hover:bg-violet-50 group-hover:text-violet-500 transition-all duration-300">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-sm text-gray-800 group-hover:text-violet-700 transition-colors duration-300">
                    {service.name}
                  </span>
                  
                  {/* Effet de brillance au survol */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12" />
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Salons recommandés - Carrousel */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            {/* 5 étoiles */}
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
              Salons recommandés
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez nos partenaires les mieux notés
            </p>
          </div>

          <div className="relative overflow-hidden">
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
                 style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              
              {/* Barbier Moderne */}
              <div className="flex-none w-80 snap-start">
                <div 
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow h-full"
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
                        className="glass-button text-black px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl"
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
              </div>

              {/* Salon Excellence */}
              <div className="flex-none w-80 snap-start">
                <div 
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow h-full"
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
                        className="glass-button text-black px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl"
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
              </div>

              {/* Beauty Institute */}
              <div className="flex-none w-80 snap-start">
                <div 
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow h-full"
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
                        className="glass-button text-black px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl"
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
              </div>

              {/* Nail Art Studio */}
              <div className="flex-none w-80 snap-start">
                <div 
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow h-full"
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
                        className="glass-button text-black px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl"
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

      {/* Section FAQ */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Icônes flottantes diffuses */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Bulle pastel violette - cachée sur mobile car proche du titre */}
          <div className="absolute top-20 left-24 md:top-20 md:left-24 hidden sm:flex w-12 h-12 rounded-full bg-gradient-to-br from-violet-200/40 to-purple-300/30 backdrop-blur-sm items-center justify-center animate-pulse transform rotate-12">
            <span className="text-lg">💡</span>
          </div>
          
          {/* Bulle pastel rose - cachée sur mobile car proche du titre */}
          <div className="absolute top-32 right-32 md:top-32 md:right-32 hidden sm:flex w-12 h-12 rounded-full bg-gradient-to-br from-pink-200/35 to-rose-300/25 backdrop-blur-sm items-center justify-center animate-bounce transform -rotate-6" style={{ animationDelay: '1s', animationDuration: '3s' }}>
            <span className="text-lg">❓</span>
          </div>
          
          {/* Bulle pastel bleue - cachée sur mobile pour éviter les conflits */}
          <div className="absolute top-80 left-48 md:top-80 md:left-48 hidden sm:flex w-12 h-12 rounded-full bg-gradient-to-br from-blue-200/40 to-cyan-300/30 backdrop-blur-sm items-center justify-center animate-pulse transform rotate-45" style={{ animationDelay: '2s' }}>
            <span className="text-lg">✨</span>
          </div>
          
          {/* Bulle pastel verte - uniquement en bas sur mobile */}
          <div className="absolute bottom-40 right-24 md:bottom-40 md:right-24 sm:bottom-20 sm:right-8 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-200/35 to-green-300/25 backdrop-blur-sm flex items-center justify-center sm:animate-none animate-bounce transform -rotate-12" style={{ animationDelay: '0.5s', animationDuration: '4s' }}>
            <span className="text-lg">📱</span>
          </div>
          
          {/* Bulle pastel orange - uniquement en bas sur mobile */}
          <div className="absolute bottom-80 left-20 md:bottom-80 md:left-20 sm:bottom-8 sm:left-8 w-12 h-12 rounded-full bg-gradient-to-br from-orange-200/40 to-amber-300/30 backdrop-blur-sm flex items-center justify-center sm:animate-none animate-pulse transform rotate-30" style={{ animationDelay: '1.5s' }}>
            <span className="text-lg">💬</span>
          </div>
          
          {/* Bulle pastel jaune - cachée sur mobile */}
          <div className="absolute top-56 right-48 md:top-56 md:right-48 hidden sm:flex w-12 h-12 rounded-full bg-gradient-to-br from-yellow-200/35 to-amber-300/25 backdrop-blur-sm items-center justify-center animate-bounce transform -rotate-24" style={{ animationDelay: '3s', animationDuration: '2.5s' }}>
            <span className="text-lg">⭐</span>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-4"
            >
              <HelpCircle className="w-4 h-4" />
              Questions Fréquentes
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
            >
              Questions <span className="text-violet-600">fréquentes</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="heroSlash__subtitle text-base max-w-2xl mx-auto"
            >
              Retrouvez les réponses aux questions les plus courantes sur Avyento
            </motion.p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full text-left p-6 rounded-2xl transition-all duration-300 glass-button hover:shadow-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 text-lg pr-4">{faq.question}</span>
                    <ChevronDown 
                      className={`w-5 h-5 text-violet-600 transition-transform duration-300 flex-shrink-0 ${
                        openFaqIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  
                  <AnimatePresence>
                    {openFaqIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 text-gray-700 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ))}
          </div>

          {/* CTA contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 mb-4">Vous ne trouvez pas la réponse à votre question ?</p>
            <button className="glass-button text-black px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl inline-flex items-center">
              Contactez notre support
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 w-full">
        <div className="mx-auto px-6 lg:px-12 xl:px-20">
          <div className="grid md:grid-cols-5 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Avyento</h3>
              <p className="text-gray-400 text-sm">
                La plateforme IA qui révolutionne la beauté et optimise vos revenus.
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
              <h4 className="font-semibold mb-4">Partenaires</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/devenir-partenaire')}
                >
                  Devenir partenaire
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/tarifs-pros')}
                >
                  Tarifs professionnels
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/formation')}
                >
                  Formation & Support
                </div>
                <div 
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setLocation('/success-stories')}
                >
                  Témoignages
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
              © 2024 Avyento. Tous droits réservés.
            </p>
            <div className="flex gap-3 mt-4 md:mt-0">
              <a href="https://twitter.com/avyento" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://instagram.com/useavyento" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C7.284 0 6.944.012 5.877.06 2.246.227.227 2.242.06 5.877.012 6.944 0 7.284 0 10s.012 3.056.06 4.123c.167 3.632 2.182 5.65 5.817 5.817C6.944 19.988 7.284 20 10 20s3.056-.012 4.123-.06c3.629-.167 5.65-2.182 5.817-5.817C19.988 13.056 20 12.716 20 10s-.012-3.056-.06-4.123C19.833 2.246 17.818.227 14.183.06 13.056.012 12.716 0 10 0zm0 1.802c2.67 0 2.987.01 4.042.059 2.71.123 3.975 1.409 4.099 4.099.048 1.054.057 1.37.057 4.04 0 2.672-.01 2.988-.057 4.042-.124 2.687-1.387 3.975-4.1 4.099-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-2.717-.124-3.977-1.416-4.1-4.1-.048-1.054-.058-1.369-.058-4.041 0-2.67.01-2.986.058-4.04.124-2.69 1.387-3.977 4.1-4.1 1.054-.048 1.37-.058 4.04-.058zM10 4.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-9.87a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://tiktok.com/@avyento" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.197 10.157v4.841c0 2.13-1.72 3.85-3.85 3.85s-3.85-1.72-3.85-3.85 1.72-3.85 3.85-3.85c.212 0 .424.017.63.052v2.08c-.2-.035-.408-.052-.63-.052-1.02 0-1.85.83-1.85 1.85s.83 1.85 1.85 1.85 1.85-.83 1.85-1.85V2h2v2.9c0 1.61 1.31 2.92 2.92 2.92V9.9c-1.61 0-2.92-1.31-2.92-2.92v-.74zm4.18-3.22c-.78-.78-1.26-1.85-1.26-3.04V2h1.89c.13 1.19.61 2.26 1.39 3.04.78.78 1.85 1.26 3.04 1.26v1.89c-1.19-.13-2.26-.61-3.04-1.39z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Popup Cookies */}
      <AnimatePresence>
        {showCookiePopup && (
          <>
            {/* Overlay avec backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => handleCookieChoice(false)}
            >
              {/* Popup centrale */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative max-w-md w-full mx-auto"
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '24px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
              >
                {/* Bouton fermer */}
                <button
                  onClick={() => handleCookieChoice(false)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100/50 transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                <div className="p-8">
                  {/* Icône et titre */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10">
                      <Cookie className="w-6 h-6 text-violet-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Cookies & Confidentialité
                    </h3>
                  </div>

                  {/* Contenu */}
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Nous utilisons des cookies pour améliorer votre expérience sur Avyento, 
                    personnaliser nos recommandations IA et analyser l'utilisation de notre plateforme. 
                    Vos données sont traitées de manière sécurisée selon notre politique de confidentialité.
                  </p>

                  {/* Boutons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleCookieChoice(true)}
                      className="flex-1 glass-button text-black px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Accepter tous
                    </button>
                    <button
                      onClick={() => handleCookieChoice(false)}
                      className="flex-1 px-6 py-3 rounded-2xl font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100/50 transition-all duration-300 border border-gray-200"
                    >
                      Refuser
                    </button>
                  </div>

                  {/* Lien politique */}
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    En continuant, vous acceptez notre{" "}
                    <a href="#" className="text-violet-600 hover:text-violet-700 underline">
                      politique de confidentialité
                    </a>
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
