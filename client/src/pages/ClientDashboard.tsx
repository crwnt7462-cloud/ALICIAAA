import React, { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Star, 
  Gift, 
  Bell, 
  User, 
  Heart, 
  Wallet,
  TrendingUp,
  MapPin,
  Plus,
  ChevronRight,
  CalendarCheck,
  Award,
  Settings,
  Menu,
  X,
  Sparkles,
  Target,
  History
} from "lucide-react";

export default function ClientDashboard() {
  const [, setLocation] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Données simulées pour la démo - remplacer par des vraies données API
  const userName = "Sophie";
  const nextAppointment = {
    date: "25 août 2025",
    time: "14:30",
    service: "Coupe & Brushing",
    salon: "Beauty Lash Studio",
    address: "15 Rue de République, Paris"
  };

  const favoriteSalons = [
    {
      id: 1,
      name: "Beauty Lash Studio",
      category: "Institut de beauté",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
      lastVisit: "Il y a 2 semaines",
      nextAvailable: "Demain 14h"
    },
    {
      id: 2,
      name: "Excellence Paris",
      category: "Coiffure",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=300&fit=crop",
      lastVisit: "Il y a 1 mois",
      nextAvailable: "Lundi 10h"
    },
    {
      id: 3,
      name: "Salon Moderne",
      category: "Coiffure & Beauté",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?w=400&h=300&fit=crop",
      lastVisit: "Il y a 3 semaines",
      nextAvailable: "Jeudi 16h"
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      date: "25 août 2025",
      time: "14:30",
      service: "Coupe & Brushing",
      salon: "Beauty Lash Studio",
      professional: "Marie Dubois",
      status: "confirmé"
    },
    {
      id: 2,
      date: "2 sept 2025",
      time: "10:00",
      service: "Manucure",
      salon: "Excellence Paris",
      professional: "Sophie Martin",
      status: "en attente"
    }
  ];

  const quickStats = {
    upcomingAppointments: 2,
    pastAppointments: 8,
    loyaltyPoints: 350,
    savedAmount: 45
  };

  const notifications = [
    {
      id: 1,
      type: "appointment",
      icon: "📅",
      title: "Rappel de rendez-vous",
      message: "Votre RDV chez Beauty Lash Studio est demain à 14h30",
      time: "Il y a 2h",
      color: "bg-blue-50 text-blue-600"
    },
    {
      id: 2,
      type: "loyalty",
      icon: "🎁",
      title: "Points de fidélité",
      message: "Plus que 150 points pour débloquer une réduction de 20%",
      time: "Il y a 1 jour",
      color: "bg-purple-50 text-purple-600"
    },
    {
      id: 3,
      type: "recommendation",
      icon: "✨",
      title: "Nouvelle recommandation",
      message: "Il est temps de reprendre RDV pour vos ongles !",
      time: "Il y a 2 jours",
      color: "bg-pink-50 text-pink-600"
    }
  ];

  const quickActions = [
    { name: "Calendrier", icon: Calendar, action: () => setLocation('/planning-client') },
    { name: "Mes Avis", icon: Star, action: () => setLocation('/mes-avis') },
    { name: "Fidélité", icon: Gift, action: () => setLocation('/fidelite') },
    { name: "Profil", icon: User, action: () => setLocation('/profil') }
  ];

  const statsCards = [
    {
      title: "Prochain RDV",
      subtitle: "Beauty Lash Studio",
      value: "25 août",
      time: "14:30",
      icon: Calendar,
      color: "from-blue-400 to-blue-600"
    },
    {
      title: "Points fidélité",
      subtitle: "Encore 150 pts",
      value: "350",
      time: "pts",
      icon: Award,
      color: "from-purple-400 to-purple-600"
    },
    {
      title: "RDV ce mois",
      subtitle: "À venir",
      value: "2",
      time: "rendez-vous",
      icon: CalendarCheck,
      color: "from-green-400 to-green-600"
    },
    {
      title: "Économies",
      subtitle: "Cette année",
      value: "45€",
      time: "épargnés",
      icon: Wallet,
      color: "from-amber-400 to-amber-600"
    }
  ];

  const sidebarItems = [
    { name: "Tableau de bord", icon: TrendingUp, path: "/client-dashboard", active: true },
    { name: "Mes RDV", icon: Calendar, path: "/mes-rendez-vous" },
    { name: "Mes Avis", icon: Star, path: "/mes-avis" },
    { name: "Fidélité", icon: Gift, path: "/fidelite" },
    { name: "Profil", icon: User, path: "/profil" },
    { name: "Notifications", icon: Bell, path: "/notifications" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-pink-400 rounded-full flex items-center justify-center">
          <span className="text-white font-medium text-sm">S</span>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="bg-white w-80 h-full p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-pink-400 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Avyento</span>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <nav className="space-y-2">
              {sidebarItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setLocation(item.path);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                      item.active 
                        ? 'bg-violet-50 text-violet-600 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 bg-white shadow-sm border-r border-gray-100 h-screen sticky top-0">
          <div className="p-4 w-full">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-pink-400 rounded-xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">Avyento</span>
            </div>
            
            <nav className="space-y-1">
              {sidebarItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => setLocation(item.path)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                      item.active 
                        ? 'bg-violet-50 text-violet-600 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8 max-w-full">
          {/* Header with date and create button */}
          <div className="hidden lg:flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">16 août, 2025</div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Aujourd'hui</span>
              </div>
            </div>
            <Button 
              onClick={() => setLocation('/search')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau RDV</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Welcome & Quick Actions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Welcome Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-50 via-white to-pink-50 rounded-3xl overflow-hidden">
                  <CardContent className="p-6 lg:p-16 flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-16">
                    <div className="flex-1 text-center lg:text-left lg:max-w-4xl">
                      <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
                        Salut, {userName}!
                      </h1>
                      <p className="text-gray-600 text-lg lg:text-xl mb-8 lg:mb-12">
                        Prête pour votre prochain moment beauté ?
                      </p>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        {quickActions.map((action, index) => {
                          const Icon = action.icon;
                          return (
                            <motion.button
                              key={index}
                              onClick={action.action}
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              className="relative overflow-hidden rounded-2xl p-4 lg:p-6 group"
                              style={{
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-violet-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="relative flex flex-col items-center text-center">
                                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-br from-violet-400 to-pink-400 rounded-xl flex items-center justify-center mb-2 lg:mb-3 group-hover:scale-110 transition-transform">
                                  <Icon className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                                </div>
                                <span className="text-xs lg:text-sm font-semibold text-gray-700">{action.name}</span>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                      
                      {/* Section Salons Favoris */}
                      <div className="mt-12 lg:mt-16">
                        <div className="flex items-center justify-between mb-6 lg:mb-8">
                          <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Mes salons favoris</h3>
                          <button className="text-sm lg:text-base text-violet-600 hover:text-violet-700 font-medium">
                            Voir tout
                          </button>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                          {favoriteSalons.map((salon) => (
                            <motion.div
                              key={salon.id}
                              whileHover={{ scale: 1.02, y: -2 }}
                              className="relative overflow-hidden rounded-2xl cursor-pointer group"
                              style={{
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-violet-400/5 to-pink-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="relative">
                                {/* Image du salon */}
                                <div className="w-full h-32 lg:h-40 rounded-t-2xl overflow-hidden mb-4">
                                  <img 
                                    src={salon.image} 
                                    alt={salon.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                                <div className="p-4 lg:p-5">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-gray-900 truncate lg:text-lg">{salon.name}</h4>
                                      <p className="text-xs lg:text-sm text-gray-500">{salon.category}</p>
                                    </div>
                                    <div className="flex items-center space-x-1 ml-2">
                                      <Star className="w-3 h-3 lg:w-4 lg:h-4 text-amber-400 fill-current" />
                                      <span className="text-xs lg:text-sm font-medium text-gray-600">{salon.rating}</span>
                                    </div>
                                  </div>
                                  <div className="space-y-2 mb-4">
                                    <div className="flex items-center justify-between text-xs lg:text-sm">
                                      <span className="text-gray-500">Dernière visite</span>
                                      <span className="text-gray-700">{salon.lastVisit}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs lg:text-sm">
                                      <span className="text-gray-500">Prochain créneau</span>
                                      <span className="text-violet-600 font-medium">{salon.nextAvailable}</span>
                                    </div>
                                  </div>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full py-2.5 lg:py-3 text-xs lg:text-sm font-medium text-white bg-gradient-to-r from-violet-400 to-pink-400 rounded-lg hover:shadow-lg transition-all duration-200"
                                  >
                                    Réserver maintenant
                                  </motion.button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Section Gestion des RDV */}
                      <div className="mt-12 lg:mt-16">
                        <div className="flex items-center justify-between mb-6 lg:mb-8">
                          <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Mes rendez-vous à venir</h3>
                          <button className="text-sm lg:text-base text-violet-600 hover:text-violet-700 font-medium">
                            Voir tout
                          </button>
                        </div>
                        <div className="space-y-4 lg:space-y-6">
                          {upcomingAppointments.map((appointment) => (
                            <motion.div
                              key={appointment.id}
                              whileHover={{ scale: 1.01, y: -2 }}
                              className="relative overflow-hidden rounded-2xl p-4 lg:p-6"
                              style={{
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                              }}
                            >
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                                <div className="flex-1">
                                  <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-violet-100 to-pink-100 rounded-xl flex items-center justify-center">
                                        <Calendar className="w-6 h-6 lg:w-8 lg:h-8 text-violet-600" />
                                      </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <h4 className="font-semibold text-gray-900 lg:text-lg">{appointment.service}</h4>
                                        <Badge className={`text-xs ${appointment.status === 'confirmé' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                          {appointment.status}
                                        </Badge>
                                      </div>
                                      <p className="text-sm lg:text-base text-gray-600">{appointment.salon}</p>
                                      <p className="text-xs lg:text-sm text-gray-500">Avec {appointment.professional}</p>
                                      <div className="flex items-center space-x-4 mt-2">
                                        <div className="flex items-center space-x-1">
                                          <Calendar className="w-4 h-4 text-gray-400" />
                                          <span className="text-sm text-gray-600">{appointment.date}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <Clock className="w-4 h-4 text-gray-400" />
                                          <span className="text-sm text-gray-600">{appointment.time}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex space-x-3 lg:ml-6">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 text-sm font-medium text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 transition-all duration-200"
                                  >
                                    Déplacer
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-all duration-200"
                                  >
                                    Annuler
                                  </motion.button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Cute illustration placeholder */}
                    <div className="w-48 h-48 lg:w-80 lg:h-80 bg-gradient-to-br from-violet-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="text-6xl lg:text-8xl">🐻</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                            <p className="text-xs text-gray-400">{stat.subtitle}</p>
                            <div className="flex items-baseline space-x-1">
                              <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                              <span className="text-sm text-gray-500">{stat.time}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Next Appointment Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Prochain rendez-vous</h3>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Confirmé</Badge>
                    </div>
                    
                    <div className="bg-gradient-to-r from-violet-50 to-pink-50 rounded-xl p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <p className="text-2xl font-bold text-gray-900 mb-1">{nextAppointment.date}</p>
                          <p className="text-lg text-violet-600 font-medium mb-2">{nextAppointment.time}</p>
                          <p className="text-gray-700 font-medium">{nextAppointment.service}</p>
                          <p className="text-gray-600">{nextAppointment.salon}</p>
                        </div>
                        <div className="flex flex-col justify-center space-y-3">
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="text-sm">{nextAppointment.address}</span>
                          </div>
                          <div className="flex space-x-3">
                            <Button variant="outline" size="sm" className="rounded-lg">
                              Reprogrammer
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-lg text-red-600 border-red-200 hover:bg-red-50">
                              Annuler
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Notifications */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      <button className="text-sm text-violet-600 hover:text-violet-700 font-medium">
                        Voir tout
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${notification.color}`}>
                            <span className="text-lg">{notification.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="text-center text-xs text-gray-500">
              <p>© 2025 Avyento. Plateforme de gestion professionnelle.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}