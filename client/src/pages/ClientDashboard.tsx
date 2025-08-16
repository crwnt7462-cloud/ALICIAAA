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
                  <CardContent className="p-8 lg:p-12 flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
                    <div className="flex-1 text-center lg:text-left">
                      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                        Salut, {userName}!
                      </h1>
                      <p className="text-gray-600 text-lg mb-6">
                        Prête pour votre prochain moment beauté ?
                      </p>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => {
                          const Icon = action.icon;
                          return (
                            <button
                              key={index}
                              onClick={action.action}
                              className="flex flex-col items-center p-4 rounded-2xl bg-white/80 backdrop-blur-sm hover:scale-105 transition-all duration-200 group"
                            >
                              <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-pink-400 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <span className="text-sm font-medium text-gray-700">{action.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Cute illustration placeholder */}
                    <div className="w-48 h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-violet-100 to-pink-100 rounded-full flex items-center justify-center">
                      <div className="text-6xl">🐻</div>
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
        </div>
      </div>
    </div>
  );
}