import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Star, Calendar, Clock, Shield, Award, ArrowRight, CheckCircle2, Users, TrendingUp, Quote, ThumbsUp, Sparkles, Zap, Heart, Camera, Phone, Scissors, Filter, SortAsc, Truck, Bell, Share2, Copy, Menu, X, LogIn, UserCheck, Scissors as ScissorsIcon, Users as UsersIcon, Palette, Sparkles as SparklesIcon, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import logoImage from "@assets/3_1753714984824.png";
import { getGenericGlassButton } from '@/lib/salonColors';


export default function PublicLanding() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);
  
  const words = ["beauté", "barber", "cils", "manucure"];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

  const handleSearchService = (service: string) => {
    setLocation(`/services/${service}`);
  };

  const stats = [
    { number: "50,000+", label: "Rendez-vous par mois" },
    { number: "2,500+", label: "Salons partenaires" },
    { number: "4.9/5", label: "Satisfaction client" },
    { number: "24h/24", label: "Réservation disponible" }
  ];

  // Salons ajoutés automatiquement lors de l'inscription pro
  const [topSalons, setTopSalons] = useState([
    {
      id: "salon-excellence",
      name: "Salon Excellence Paris",
      location: "Paris 16ème",
      rating: 4.9,
      reviews: 324,
      nextSlot: "Aujourd'hui 15h",
      services: ["Coiffure", "Coloration"],
      verified: true
    },
    {
      id: "salon-2",
      name: "Institut Prestige",
      location: "Lyon Centre",
      rating: 4.8,
      reviews: 198,
      nextSlot: "Demain 9h30",
      services: ["Soins visage", "Épilation"],
      verified: true
    },
    {
      id: "salon-3",
      name: "Spa Wellness",
      location: "Marseille",
      rating: 4.7,
      reviews: 156,
      nextSlot: "Aujourd'hui 17h",
      services: ["Massage", "Relaxation"],
      verified: true
    }
  ]);

  // Simuler l'ajout automatique d'un nouveau salon pro
  useEffect(() => {
    const addNewProSalons = () => {
      const newSalons = [
        {
          id: "mon-salon-beaute",
          name: "Mon Salon de Beauté",
          location: "Paris Centre",
          rating: 4.8,
          reviews: 42,
          nextSlot: "Disponible maintenant",
          services: ["Coupe", "Brushing", "Soin"],
          verified: true,
          isNew: true
        }
      ];
      
      // Ajouter les nouveaux salons automatiquement
      setTopSalons(prev => [...newSalons, ...prev]);
    };

    // Simuler l'ajout après 3 secondes (normalement lors de l'inscription)
    const timer = setTimeout(addNewProSalons, 3000);
    return () => clearTimeout(timer);
  }, []);

  const benefits = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Réservation instantanée",
      description: "Trouvez et réservez votre créneau en moins de 2 minutes"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Paiement sécurisé",
      description: "Transactions protégées et remboursement garanti"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Salons certifiés",
      description: "Tous nos partenaires sont vérifiés et évalués"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Support client",
      description: "Assistance 7j/7 pour toutes vos questions"
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Marie L.",
      location: "Paris",
      rating: 5,
      comment: "Interface très intuitive ! J'ai trouvé mon salon de coiffure parfait en 2 minutes. Le système de réservation est fluide et les rappels automatiques très pratiques.",
      service: "Coiffure & Coloration",
      date: "Il y a 2 jours"
    },
    {
      id: 2,
      name: "Sophie M.",
      location: "Lyon",
      rating: 5,
      comment: "Excellent service ! Le salon était exactement comme décrit, et le processus de réservation très simple. Je recommande vivement Rendly.",
      service: "Soins visage",
      date: "Il y a 1 semaine"
    },
    {
      id: 3,
      name: "Julie R.",
      location: "Marseille",
      rating: 5,
      comment: "Parfait pour les rendez-vous de dernière minute. J'ai pu réserver un massage le jour même. L'équipe était professionnelle et accueillante.",
      service: "Massage bien-être",
      date: "Il y a 3 jours"
    }
  ];

  const faqs = [
    {
      question: "Comment réserver un rendez-vous ?",
      answer: "Recherchez un salon ou service, sélectionnez un créneau disponible, remplissez vos informations et confirmez. Vous recevrez immédiatement une confirmation par email et SMS."
    },
    {
      question: "Puis-je annuler ou modifier mon rendez-vous ?",
      answer: "Oui, vous pouvez annuler ou modifier gratuitement jusqu'à 24h avant votre rendez-vous directement depuis votre email de confirmation ou en contactant le salon."
    },
    {
      question: "Les salons sont-ils vérifiés ?",
      answer: "Tous nos partenaires sont rigoureusement sélectionnés et vérifiés. Nous contrôlons leurs certifications, équipements et respectons les normes d'hygiène et de qualité."
    },
    {
      question: "Que se passe-t-il si je suis en retard ?",
      answer: "Contactez directement le salon dès que possible. La plupart acceptent un retard de 15-20 minutes, mais au-delà, le rendez-vous peut être annulé."
    },
    {
      question: "Comment fonctionne le paiement ?",
      answer: "Le paiement se fait généralement sur place. Certains salons proposent un acompte en ligne sécurisé. Tous les modes de paiement sont acceptés."
    }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(searchLocation)}`);
    }
  };

  const handleBookSalon = (salonId: string) => {
    setLocation(`/salon/salon-elegance`);
  };

  const handleSalonClick = (salonId: string) => {
    setLocation(`/salon/${salonId}`);
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
      setLocation(`/search?q=coiffure&location=${encodeURIComponent(searchLocation || 'paris')}`);
    } else if (item.id === 'barbier') {
      setSearchQuery('barbier');
      setLocation(`/search?q=barbier&location=${encodeURIComponent(searchLocation || 'paris')}`);
    } else if (item.id === 'manucure') {
      setSearchQuery('ongle');
      setLocation(`/search?q=ongle&location=${encodeURIComponent(searchLocation || 'paris')}`);
    } else if (item.id === 'institut') {
      setSearchQuery('esthetique');
      setLocation(`/search?q=esthetique&location=${encodeURIComponent(searchLocation || 'paris')}`);
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
                className={`${getGenericGlassButton(0)} text-white text-sm md:text-base px-2 md:px-4 hidden lg:flex`}
                onClick={() => setLocation("/client-login-modern")}
              >
                <span className="hidden md:inline">Se connecter</span>
                <span className="md:hidden">Connexion</span>
              </Button>
              <Button 
                className={`${getGenericGlassButton(1)} text-white text-sm md:text-base px-3 md:px-4 h-9 md:h-10 rounded-lg hidden lg:flex`}
                onClick={() => setLocation("/salon/salon-elegance")}
              >
                Réserver
              </Button>
              <Button 
                className={`${getGenericGlassButton(2)} p-2 rounded-lg`}
                onClick={() => setLocation("/pro-login")}
              >
                <LogIn className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section épuré */}
      <section className="bg-gradient-to-b from-violet-50/30 to-white py-8 md:py-12 lg:py-16 relative">
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-violet-100 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-violet-600 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-violet-700">Réservation instantanée</span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 px-4">
              Réservez votre rendez-vous{" "}
              <span className="inline-block border-2 border-violet-500 bg-violet-50 text-violet-700 px-3 py-1 rounded-lg relative overflow-hidden text-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentWord}
                    className="inline-block"
                  >
                    {words[currentWord].split('').map((letter, index) => (
                      <motion.span
                        key={`${currentWord}-${index}`}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -30, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                          delay: index * 0.05
                        }}
                        className="inline-block"
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>
            <p className="text-sm md:text-base text-gray-600 mb-6 px-4">
              Trouvez et réservez chez les meilleurs professionnels près de chez vous
            </p>
            
            {/* Barre de recherche compacte */}
            <div className="max-w-md mx-auto mb-5">
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    placeholder="Service (coiffure, massage...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 pl-3 pr-10 text-sm rounded-lg border border-gray-300 focus:border-violet-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                </div>
                <div className="relative">
                  <Input
                    placeholder="Ville"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="h-11 pl-3 pr-10 text-sm rounded-lg border border-gray-300 focus:border-violet-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            setSearchLocation("Près de moi");
                          },
                          (error) => console.log("Géolocalisation non disponible")
                        );
                      }
                    }}
                    className="absolute right-3 top-3 text-violet-500 active:text-violet-700 touch-manipulation"
                    title="Utiliser ma position"
                  >
                    <MapPin className="w-5 h-5" />
                  </button>
                </div>
                <Button 
                  onClick={handleSearch}
                  className={`w-full h-11 ${getGenericGlassButton(1)} text-white text-sm font-medium rounded-lg touch-manipulation`}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Rechercher un salon
                </Button>
              </div>
            </div>
            


            {/* Recherches populaires compactes */}
            <div className="max-w-md mx-auto mb-4">
              <p className="text-xs text-gray-500 mb-2 text-center">Recherches populaires :</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {['Coiffure', 'Massage', 'Manucure', 'Soin visage'].map((search) => (
                  <button
                    key={search}
                    onClick={() => {
                      setSearchQuery(search);
                      handleSearch();
                    }}
                    className="px-3 py-1 bg-gray-100 active:bg-violet-100 text-xs rounded-full transition-colors touch-manipulation"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* Bouton connexion salon */}
            <div className="max-w-md mx-auto text-center">
              <div className="text-xs text-gray-500 mb-2">Vous êtes un professionnel ?</div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation("/pro-login")}
                className="px-4 py-2 border border-violet-300 text-violet-600 hover:bg-violet-50 text-sm"
              >
                Connexion Salon
              </Button>
            </div>


          </div>
        </div>
      </section>



      {/* Statistiques et garanties */}
      <section className="py-6 md:py-8 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="p-2">
                <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                  {stat.number}
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          
          {/* Garanties professionnelles */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-3 md:gap-6 text-xs md:text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>SSL sécurisé</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Pros certifiés</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-violet-600 flex-shrink-0" />
                <span>Support 7j/7</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Satisfait ou remboursé</span>
              </div>
            </div>
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
                    className={`${getGenericGlassButton(1)} text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors`}
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
                    className={`${getGenericGlassButton(1)} text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors`}
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
                    className={`${getGenericGlassButton(1)} text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors`}
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
                    className={`${getGenericGlassButton(1)} text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors`}
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
            className={`${getGenericGlassButton(1)} text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl`}
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
                <div>Coiffure</div>
                <div>Esthétique</div>
                <div>Manucure</div>
                <div>Massage</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Centre d'aide</div>
                <div>Contact</div>
                <div>CGU</div>
                <div>Confidentialité</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Professionnels</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Rejoignez-nous</div>
                <div>Dashboard Pro</div>
                <div>Tarifs</div>
                <div>Support Pro</div>
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
                <img 
                  src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop"
                  alt="Gentleman Barbier Marais"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                
                {/* Badges sur la photo */}
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
                    <h4 className="font-semibold text-gray-900 text-lg mb-1">Gentleman Barbier Marais</h4>
                    <p className="text-sm text-gray-500 mb-2">Paris 4ème</p>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">À partir de 25€</span>
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">4.8</span>
                    <span className="text-sm text-gray-500">(198 avis)</span>
                  </div>
                  <span className="text-sm text-gray-500">• 0.3 km</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Coupe homme
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Barbe
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Rasage
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-green-600 font-medium">
                      Dispo 14h30
                    </span>
                  </div>
                  <button 
                    className="bg-gradient-to-r from-amber-400/30 to-rose-400/30 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation('/salon-booking');
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

      {/* Comment ça marche */}
      <section id="how-it-works" className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Comment ça marche ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Recherchez", description: "Trouvez le service et le professionnel près de chez vous", icon: <Search className="w-6 h-6" /> },
              { step: "2", title: "Réservez", description: "Choisissez votre créneau et confirmez en quelques clics", icon: <Calendar className="w-6 h-6" /> },
              { step: "3", title: "Profitez", description: "Rendez-vous directement au salon, tout est organisé", icon: <Heart className="w-6 h-6" /> }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-violet-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-violet-600">
                    {item.icon}
                  </div>
                </div>
                <div className="text-sm font-medium text-violet-600 mb-2">Étape {item.step}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Pourquoi choisir BeautyBook ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <div className="text-violet-600">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages clients */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Avis clients
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  "{testimonial.comment}"
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{testimonial.name}, {testimonial.location}</span>
                  <span>{testimonial.service}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application mobile */}
      <section className="py-6 gradient-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-lg md:text-xl font-bold text-white mb-2">
              Application mobile
            </h2>
            <p className="text-violet-100 mb-4 text-sm">
              Réservez encore plus facilement depuis votre téléphone
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={() => window.open('https://apps.apple.com/app/beautybook', '_blank')}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20 active:bg-white/20 transition-colors cursor-pointer touch-manipulation"
              >
                <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                  <Phone className="w-3 h-3 text-violet-600" />
                </div>
                <div className="text-left">
                  <div className="text-white font-medium text-sm">App Store</div>
                  <div className="text-violet-100 text-xs">iOS</div>
                </div>
              </button>
              <button
                onClick={() => window.open('https://play.google.com/store/apps/details?id=com.beautybook', '_blank')}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20 active:bg-white/20 transition-colors cursor-pointer touch-manipulation"
              >
                <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                  <Phone className="w-3 h-3 text-violet-600" />
                </div>
                <div className="text-left">
                  <div className="text-white font-medium text-sm">Google Play</div>
                  <div className="text-violet-100 text-xs">Android</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Professionnels */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
            Professionnel de la beauté ?
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Rejoignez notre réseau de 2,500+ salons partenaires
          </p>
          <div className="space-y-2 md:flex md:flex-row md:gap-3 md:justify-center md:space-y-0">
            <Button 
              onClick={() => setLocation("/pro-login")}
              className="w-full md:w-auto h-10 gradient-bg text-white rounded-lg touch-manipulation text-sm"
            >
              Rejoindre le réseau
            </Button>
            <Button 
              variant="outline"
              className="w-full md:w-auto h-10 border-violet-200 text-violet-600 active:bg-violet-50 rounded-lg touch-manipulation text-sm"
              onClick={() => {
                const element = document.querySelector('#how-it-works');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              En savoir plus
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Questions fréquentes
          </h2>

          <div className="space-y-3">
            {faqs.slice(0, 3).map((faq, index) => (
              <div key={index} className="bg-white rounded-lg border">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-4 text-left hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">
                      {faq.question}
                    </h3>
                    <div className={`transform transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`}>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>
                
                {expandedFaq === index && (
                  <div className="px-4 pb-4 border-t">
                    <p className="text-sm text-gray-600 pt-3">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-600 mb-3">
              Une question ? Contactez-nous
            </p>
            <Button variant="outline" size="sm">
              Support
            </Button>
          </div>
        </div>
      </section>

      {/* Footer professionnel */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="mb-4">
                <img src={logoImage} alt="Logo" className="h-14 w-auto" />
              </div>
              <p className="text-gray-600 mb-4 max-w-md">
                La plateforme de référence pour réserver vos rendez-vous beauté en France. 
                Simple, rapide et sécurisé.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Services</h4>
              <ul className="space-y-2 text-gray-600">
                <li><button onClick={() => handleSearchService('coiffure')} className="hover:text-violet-600 text-left">Coiffure</button></li>
                <li><button onClick={() => handleSearchService('esthetique')} className="hover:text-violet-600 text-left">Esthétique</button></li>
                <li><button onClick={() => handleSearchService('massage')} className="hover:text-violet-600 text-left">Massage</button></li>
                <li><button onClick={() => handleSearchService('onglerie')} className="hover:text-violet-600 text-left">Onglerie</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><button onClick={() => setLocation('/support')} className="hover:text-violet-600 text-left">Centre d'aide</button></li>
                <li><button onClick={() => setLocation('/contact')} className="hover:text-violet-600 text-left">Contact</button></li>
                <li><button onClick={() => setLocation('/conditions')} className="hover:text-violet-600 text-left">Conditions</button></li>
                <li><button onClick={() => setLocation('/confidentialite')} className="hover:text-violet-600 text-left">Confidentialité</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2025 Beauty Platform. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}