import React, { useState } from "react";
import { useLocation } from "wouter";
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
  Wallet,
  TrendingUp,
  MapPin,
  Plus,
  CalendarCheck,
  Award,
  Menu,
  X,
  Sparkles
} from "lucide-react";

export default function ClientDashboard() {
  const [, setLocation] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Données simulées pour la démo
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
    },
    {
      id: 4,
      type: "promotion",
      icon: "🏷️",
      title: "Promotion spéciale",
      message: "20% de réduction sur tous les soins visage ce mois-ci",
      time: "Il y a 3 jours",
      color: "bg-green-50 text-green-600"
    },
    {
      id: 5,
      type: "appointment",
      icon: "⏰",
      title: "Confirmation RDV",
      message: "Votre rendez-vous du 2 septembre a été confirmé",
      time: "Il y a 1 semaine",
      color: "bg-blue-50 text-blue-600"
    }
  ];

  const quickActions = [
    { name: "Calendrier", icon: Calendar, action: () => setLocation('/planning-client') },
    { name: "Mes Avis", icon: Star, action: () => setLocation('/mes-avis') },
    { name: "Fidélité", icon: Gift, action: () => setLocation('/fidelite') },
    { name: "Profil", icon: User, action: () => setLocation('/profil') }
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

          <div className="flex gap-6 h-[600px]">
            {/* Conteneur principal "Salut Sophie" */}
            <div className="flex-1" style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '24px',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              {/* Header avec titre et ours */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex-1">
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                    Salut, {userName}!
                  </h1>
                  <p className="text-gray-600 text-lg lg:text-xl">
                    Prête pour votre prochain moment beauté ?
                  </p>
                </div>
                
                {/* Ours à droite */}
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-violet-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0 ml-8">
                  <div className="text-4xl lg:text-5xl">🐻</div>
                </div>
              </div>

              {/* Actions rapides - Style page d'accueil */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.button
                      key={index}
                      onClick={action.action}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative overflow-hidden rounded-2xl p-4 group"
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

              {/* Section Salons Favoris avec scroll */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Mes salons favoris</h3>
                  <button className="text-sm text-violet-600 hover:text-violet-700 font-medium">
                    Voir tout
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 dashboard-scroll">
                  {favoriteSalons.map((salon) => (
                    <motion.div
                      key={salon.id}
                      whileHover={{ scale: 1.02, y: -1 }}
                      className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <img 
                          src={salon.image} 
                          alt={salon.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{salon.name}</h4>
                          <p className="text-sm text-gray-600">{salon.category}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500">{salon.rating}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{salon.nextAvailable}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Mur notifications avec hauteur identique */}
            <div className="w-80" style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '24px',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              height: '600px',
              overflow: 'hidden'
            }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <button className="text-sm text-violet-600 hover:text-violet-700 font-medium">
                  Voir tout
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 dashboard-scroll">
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