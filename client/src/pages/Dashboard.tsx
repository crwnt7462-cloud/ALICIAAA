import React, { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock, 
  Settings, 
  Bell, 
  Search, 
  ChevronRight,
  Home,
  User,
  BarChart3,
  MessageSquare,
  HelpCircle,
  Menu,
  ChevronDown,
  MapPin,
  Activity
} from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: revenueChart = [], isLoading: revenueLoading } = useQuery({
    queryKey: ["/api/dashboard/revenue-chart"],
  });

  if (statsLoading || revenueLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-20 bg-gradient-to-b from-purple-600 to-purple-700"></div>
        <div className="flex-1 p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="grid grid-cols-3 gap-6">
              {Array.from({length: 3}).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const clients = [
    { name: "Sophie Martin", service: "Coupe & Brushing", time: "10h30", avatar: "SM" },
    { name: "Marie Dubois", service: "Couleur", time: "14h00", avatar: "MD" },
    { name: "Julie Leroy", service: "Manucure", time: "15h30", avatar: "JL" },
    { name: "Emma Rousseau", service: "Soin Visage", time: "16h45", avatar: "ER" },
    { name: "Laura Bernard", service: "Balayage", time: "9h15", avatar: "LB" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 w-full">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar Glass */}
        <div className="w-20 flex flex-col items-center py-6" style={{
          backdropFilter: 'blur(20px) saturate(180%)',
          background: 'rgba(255, 255, 255, 0.09)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05)'
        }}>
          {/* Logo */}
          <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 border border-white/40">
            <Bell className="w-6 h-6 text-gray-700" />
          </div>
          
          {/* Navigation Icons */}
          <div className="space-y-6">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <Home className="w-6 h-6 text-white" />
            </div>
            
            <div className="w-12 h-12 bg-transparent hover:bg-white/10 rounded-2xl flex items-center justify-center transition-colors cursor-pointer">
              <BarChart3 className="w-6 h-6 text-white/70" />
            </div>
            
            <div className="w-12 h-12 bg-transparent hover:bg-white/10 rounded-2xl flex items-center justify-center transition-colors cursor-pointer">
              <Calendar className="w-6 h-6 text-white/70" />
            </div>
            
            <div className="w-12 h-12 bg-transparent hover:bg-white/10 rounded-2xl flex items-center justify-center transition-colors cursor-pointer">
              <MessageSquare className="w-6 h-6 text-white/70" />
            </div>
            
            <div className="w-12 h-12 bg-transparent hover:bg-white/10 rounded-2xl flex items-center justify-center transition-colors cursor-pointer">
              <Clock className="w-6 h-6 text-white/70" />
            </div>
          </div>
          
          {/* User Avatar */}
          <div className="mt-auto mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 flex">
          {/* Zone principale */}
          <div className="flex-1 p-8 bg-gray-50">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-gray-500 text-sm">Avyento</p>
                <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">AV</span>
                </div>
              </div>
            </div>

            {/* Layout principal en 2 colonnes - Dimensions exactes */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Grande carte Overview à gauche */}
              <div className="rounded-3xl p-6 text-gray-800 relative overflow-hidden h-80" style={{
                backdropFilter: 'blur(20px) saturate(180%)',
                background: 'rgba(255, 255, 255, 0.09)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05)'
              }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Vue d'ensemble</h2>
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-1.5">
                    <span className="text-sm">Mensuel</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
                
                {/* Graph Wave avec cercle central */}
                <div className="relative mb-4 h-20">
                  <svg width="100%" height="80" viewBox="0 0 400 80" className="opacity-40">
                    <path
                      d="M0,60 Q100,30 200,45 T400,25"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M0,40 Q100,10 200,25 T400,5"
                      stroke="rgba(255,182,193,1)"
                      strokeWidth="2.5"
                      fill="none"
                    />
                  </svg>
                  
                  {/* Cercle central avec CA */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                      <div className="text-center">
                        <div className="text-lg font-bold">{stats?.monthlyRevenue || 0}€</div>
                        <div className="text-xs opacity-75">CA</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Mois */}
                <div className="flex justify-between text-xs mb-4 opacity-75 px-2">
                  <span>Jan</span>
                  <span>Fév</span>
                  <span>Mar</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded text-white">Août</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Déc</span>
                </div>
                
                {/* Stats en bas */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                    <div className="text-xs opacity-75 mb-1">Clients Total</div>
                    <div className="text-lg font-bold">{stats?.totalClients || 0}</div>
                    <div className="text-xs opacity-75">Août</div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                    <div className="text-xs opacity-75 mb-1">RDV Aujourd'hui</div>
                    <div className="text-lg font-bold">{stats?.appointmentsToday || 0}</div>
                    <div className="text-xs opacity-75">Août</div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                    <div className="text-xs opacity-75 mb-1">Satisfaction</div>
                    <div className="text-lg font-bold">{stats?.satisfactionRate || 95}%</div>
                    <div className="text-xs opacity-75">Août</div>
                  </div>
                </div>
              </div>
              
              {/* Colonne droite avec 2 cartes empilées */}
              <div className="flex flex-col gap-4 h-80">
                {/* Services Populaires */}
                <div className="rounded-3xl p-6 text-gray-800 flex-1 relative overflow-hidden" style={{
                  backdropFilter: 'blur(20px) saturate(180%)',
                  background: 'rgba(255, 255, 255, 0.09)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05)'
                }}>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/40">
                      <Calendar className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Services Populaires</h3>
                      <p className="text-sm opacity-75">Coiffure & Esthétique</p>
                    </div>
                  </div>
                </div>
                
                {/* Planning Aujourd'hui */}
                <div className="rounded-3xl p-6 text-gray-800 flex-1 relative overflow-hidden" style={{
                  backdropFilter: 'blur(20px) saturate(180%)',
                  background: 'rgba(255, 255, 255, 0.09)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05)'
                }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/40">
                        <Clock className="w-6 h-6 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Planning Aujourd'hui</h3>
                        <p className="text-sm opacity-75">Objectif: 100% rempli</p>
                        <p className="text-2xl font-bold mt-1">{stats?.appointmentsToday || 0} RDV</p>
                        <p className="text-xs opacity-75">Août 2025</p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>
          
          {/* Cartes Gestion Salon */}
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="rounded-2xl p-6" style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              background: 'rgba(255, 255, 255, 0.09)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05)'
            }}>
              <div className="flex items-center justify-center w-12 h-12 bg-white/30 backdrop-blur-sm rounded-2xl mb-4 border border-white/40">
                <Users className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Gestion Clients</h3>
              <p className="text-sm text-gray-500 mb-4">{stats?.totalClients || 0} clients actifs</p>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Fidélité</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-600/60 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Nouveaux cette semaine</span>
                <span className="text-gray-700">3 clients</span>
              </div>
            </div>
            
            <div className="rounded-2xl p-6" style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              background: 'rgba(255, 255, 255, 0.09)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05)'
            }}>
              <div className="flex items-center justify-center w-12 h-12 bg-white/30 backdrop-blur-sm rounded-2xl mb-4 border border-white/40">
                <TrendingUp className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Chiffre d'Affaires</h3>
              <p className="text-sm text-gray-500 mb-4">{stats?.monthlyRevenue || 3650}€ ce mois</p>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Objectif</span>
                  <span className="font-medium">73%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '73%'}}></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Objectif: 5000€</span>
                <span className="text-green-500">+12% vs mois dernier</span>
              </div>
            </div>
            
            <div className="rounded-2xl p-6" style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              background: 'rgba(255, 255, 255, 0.09)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05)'
            }}>
              <div className="flex items-center justify-center w-12 h-12 bg-white/30 backdrop-blur-sm rounded-2xl mb-4 border border-white/40">
                <Settings className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Services Actifs</h3>
              <p className="text-sm text-gray-500 mb-4">12 prestations disponibles</p>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Popularité</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '92%'}}></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Plus demandé: Coupe</span>
                <span className="text-blue-500">45% des RDV</span>
              </div>
            </div>
          </div>
        </div>


        </div>
      </div>
      

    </div>
  );
}