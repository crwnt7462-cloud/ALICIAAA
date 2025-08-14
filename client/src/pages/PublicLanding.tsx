import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Star, Calendar, Clock, Shield, Award, CheckCircle2, Users, Sparkles, Heart, Scissors, Truck, X, LogIn, UserCheck, Scissors as ScissorsIcon, Users as UsersIcon, Palette, Sparkles as SparklesIcon, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import logoImage from "@assets/3_1753714421825.png";

export default function PublicLanding() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);
  
  const words = ["beauté", "barber", "cils", "manucure"];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

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
      comment: "Excellente expérience ! La géolocalisation m'a permis de découvrir des instituts près de chez moi. La prise de rendez-vous est rapide et les professionnels sont top.",
      service: "Soins Visage",
      date: "Il y a 1 semaine"
    }
  ];

  const faqs = [
    {
      question: "Comment réserver un rendez-vous ?",
      answer: "C'est très simple ! Recherchez un salon près de chez vous, choisissez votre service et votre créneau, puis confirmez votre réservation. Vous recevrez une confirmation par email et SMS."
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
                  <span className="text-xl font-bold text-purple-600">avyento</span>
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
                <div className="text-center text-gray-500 text-sm">
                  <p>© 2024 Avyento. Tous droits réservés.</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NOUVEAU HEADER MOBILE EXACT */}
      <header className="flex items-center justify-between px-4 py-4 bg-white">
        {/* Menu hamburger */}
        <button
          id="hamburger-button"
          onClick={toggleMenu}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <div className="w-6 h-6 flex flex-col justify-center gap-1">
            <span className="block w-6 h-0.5 bg-gray-700 rounded-full"></span>
            <span className="block w-6 h-0.5 bg-gray-700 rounded-full"></span>
            <span className="block w-6 h-0.5 bg-gray-700 rounded-full"></span>
          </div>
        </button>

        {/* Logo au centre */}
        <div className="text-xl font-bold text-purple-600">
          avyento.
        </div>
        
        {/* Icône Login à droite */}
        <button
          onClick={() => setLocation('/pro-login')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <LogIn className="w-6 h-6 text-gray-700" />
        </button>
      </header>

      {/* Badge Réservation instantanée */}
      <div className="px-4 py-4 bg-gray-50">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            <span>Réservation instantanée</span>
          </div>
        </div>
      </div>

      {/* Section Hero principale */}
      <main className="relative">
        {/* Gradient de fond */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-amber-50"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="pt-8 pb-24">
            <div className="text-center space-y-8 max-w-4xl mx-auto">
              {/* Titre principal */}
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Réservez votre rendez-vous
                  <br />
                  <span className="bg-gradient-to-r from-violet-600 to-amber-500 bg-clip-text text-transparent">
                    {words[currentWord]}
                  </span>
                </h1>
              </div>

              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Trouvez et réservez chez les meilleurs professionnels près de chez vous
              </p>

              {/* Barre de recherche améliorée */}
              <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Service (coiffure, massage...)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border-0 focus:ring-0 text-gray-900 placeholder-gray-400 rounded-xl"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  
                  <div className="relative sm:min-w-[200px]">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Ville"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border-0 focus:ring-0 text-gray-900 placeholder-gray-400 rounded-xl"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>

                  <button
                    onClick={handleSearch}
                    className="bg-gradient-to-r from-violet-600 to-violet-700 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 sm:min-w-[160px]"
                  >
                    <Search className="w-4 h-4" />
                    <span className="hidden sm:inline">Rechercher un salon</span>
                    <span className="sm:hidden">Rechercher</span>
                  </button>
                </div>
              </div>

              {/* Recherches populaires */}
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-4">Recherches populaires :</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Coiffure', 'Massage', 'Manucure', 'Soin visage'].map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(tag.toLowerCase());
                        handleSearch();
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-violet-100 hover:text-violet-600 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Statistiques */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-12">
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
            </div>
          </div>
        </div>
      </main>

      {/* Section salons populaires */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Salons populaires
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez les établissements les mieux notés par notre communauté
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topSalons.map((salon) => (
              <Card 
                key={salon.id} 
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-white"
                onClick={() => handleSalonClick(salon.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-violet-600 transition-colors">
                          {salon.name}
                        </h3>
                        {salon.verified && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        )}
                        {salon.isNew && (
                          <span className="bg-amber-100 text-amber-600 text-xs font-medium px-2 py-1 rounded-full">
                            Nouveau
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {salon.location}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-4 h-4 text-amber-400 fill-current" />
                        <span className="font-medium text-gray-900">{salon.rating}</span>
                        <span className="text-sm text-gray-500">({salon.reviews})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-wrap gap-2">
                      {salon.services.map((service, index) => (
                        <span key={index} className="bg-violet-50 text-violet-600 text-xs font-medium px-2 py-1 rounded-full">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-emerald-600">
                      <Clock className="w-4 h-4" />
                      {salon.nextSlot}
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookSalon(salon.id);
                      }}
                      className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
                    >
                      Réserver
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section avantages */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Avyento ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Une expérience de réservation révolutionnaire pensée pour vous
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section témoignages */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Plus de 50 000 clients nous font confiance chaque mois
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border-0 bg-white shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-gray-700 mb-6 leading-relaxed">
                    "{testimonial.comment}"
                  </blockquote>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {testimonial.location}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-violet-600 font-medium">
                        {testimonial.service}
                      </div>
                      <div className="text-xs text-gray-500">
                        {testimonial.date}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-gray-600">
              Trouvez rapidement les réponses à vos questions
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Professionnels */}
      <section className="py-20 bg-gradient-to-r from-violet-600 to-violet-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Vous êtes un professionnel ?
          </h2>
          <p className="text-violet-100 text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez notre réseau de professionnels et développez votre clientèle avec Avyento
          </p>
          <Button 
            size="lg"
            className="bg-white text-violet-600 hover:bg-gray-50 font-semibold px-8 py-3"
            onClick={() => setLocation('/professional-plans')}
          >
            Découvrir nos offres Pro
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl font-bold text-purple-600">avyento</span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                La plateforme de référence pour réserver vos rendez-vous beauté. 
                Trouvez les meilleurs professionnels près de chez vous.
              </p>
              <div className="flex space-x-4">
                {/* Réseaux sociaux */}
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Heart className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Users className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Liens rapides</h3>
              <ul className="space-y-2">
                <li><a href="/centre-aide" className="text-gray-300 hover:text-white transition-colors">Centre d'aide</a></li>
                <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
                <li><a href="/cgu" className="text-gray-300 hover:text-white transition-colors">CGU</a></li>
                <li><a href="/confidentialite" className="text-gray-300 hover:text-white transition-colors">Confidentialité</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Professionnels</h3>
              <ul className="space-y-2">
                <li><a href="/pro-login" className="text-gray-300 hover:text-white transition-colors">Espace Pro</a></li>
                <li><a href="/professional-plans" className="text-gray-300 hover:text-white transition-colors">Nos offres</a></li>
                <li><a href="/business-registration" className="text-gray-300 hover:text-white transition-colors">S'inscrire</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Avyento. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}