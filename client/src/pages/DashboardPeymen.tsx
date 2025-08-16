import React, { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  Settings, 
  Bell, 
  BarChart3,
  CreditCard,
  Users,
  Wallet,
  MessageSquare,
  TrendingUp,
  PieChart,
  Home,
  User,
  Calendar,
  Clock
} from "lucide-react";

export default function DashboardPeymen() {
  const [, setLocation] = useLocation();
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  if (statsLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-64 bg-white shadow-lg"></div>
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

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AV</span>
              </div>
              <span className="font-bold text-gray-900">Avyento</span>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <div className="flex items-center space-x-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl">
              <Home className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl cursor-pointer">
              <User className="w-5 h-5" />
              <span>Profile</span>
            </div>
            
            <div className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl cursor-pointer">
              <Wallet className="w-5 h-5" />
              <span>Wallet</span>
            </div>
            
            <div className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl cursor-pointer">
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
            </div>
            
            <div className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl cursor-pointer">
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </div>
            
            <div className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl cursor-pointer">
              <Users className="w-5 h-5" />
              <span>Clients</span>
            </div>
            
            <div className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl cursor-pointer">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </div>
          </nav>
          
          {/* Premium Account Card */}
          <div className="p-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-4 text-white">
              <h3 className="font-semibold mb-2">Get a Premium Account</h3>
              <p className="text-sm opacity-90 mb-4">Unlock advanced features for your salon</p>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors">
                Get Now
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome to Avyento</h1>
                <p className="text-gray-600">Gérez votre salon efficacement</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>
                
                <button className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
                
                <button className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </button>
                
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">AV</span>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Prestations</p>
                    <p className="text-2xl font-bold text-gray-900">€{stats?.totalClients || 124}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Nouveaux Clients</p>
                    <p className="text-2xl font-bold text-gray-900">€142</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Revenus</p>
                    <p className="text-2xl font-bold text-gray-900">€155</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-right">
                  <p className="text-gray-600 text-sm mb-1">Mois</p>
                  <p className="text-3xl font-bold text-gray-900">€{stats?.monthlyRevenue || 3642}€</p>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="col-span-2 space-y-8">
                {/* Reach Financial Goals Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Atteignez vos objectifs financiers plus rapidement</h3>
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                        En savoir plus
                      </button>
                    </div>
                    
                    <div className="flex-1 mx-8">
                      {/* Credit Card */}
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white relative max-w-xs ml-auto">
                        <div className="flex items-center justify-between mb-8">
                          <span className="text-sm opacity-90">Carte Professionnelle</span>
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <CreditCard className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm opacity-90">**** **** 3456 7892</p>
                          <p className="text-xs opacity-75">Salon Avyento</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="w-32 h-20 bg-gray-100 rounded-xl mb-4 flex items-center justify-center">
                        {/* Simple chart representation */}
                        <svg width="80" height="40" viewBox="0 0 80 40" className="text-gray-400">
                          <path d="M5,30 Q20,10 40,20 T75,15" stroke="currentColor" strokeWidth="2" fill="none" />
                          <circle cx="20" cy="15" r="2" fill="currentColor" />
                          <circle cx="60" cy="18" r="2" fill="currentColor" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transactions Section */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Your Transaction */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4">Vos Transactions</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                            <span className="text-green-600 text-sm">✂️</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Coupe</p>
                            <p className="text-sm text-gray-500">Aujourd'hui</p>
                          </div>
                        </div>
                        <span className="font-semibold text-green-600">€45</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                            <span className="text-purple-600 text-sm">💅</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Manucure</p>
                            <p className="text-sm text-gray-500">Hier</p>
                          </div>
                        </div>
                        <span className="font-semibold text-green-600">€25</span>
                      </div>
                    </div>
                  </div>

                  {/* Your Transfer */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4">Prochains RDV</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-xs">SM</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Sophie Martin</p>
                            <p className="text-sm text-gray-500">Aujourd'hui</p>
                          </div>
                        </div>
                        <span className="font-semibold text-blue-600">14h30</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-medium text-xs">MD</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Marie Dubois</p>
                            <p className="text-sm text-gray-500">Demain</p>
                          </div>
                        </div>
                        <span className="font-semibold text-purple-600">10h00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Goals Completed Card */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white">
                  <div className="text-center">
                    <p className="text-sm opacity-75 mb-2">Objectifs pour Août 2025</p>
                    <h2 className="text-2xl font-bold mb-4">Réalisé</h2>
                    
                    {/* Circular Progress */}
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="white"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${73 * 2.827} 283`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold">73%</span>
                      </div>
                    </div>
                    <p className="text-xs opacity-75">3642€ / 5000€</p>
                  </div>
                </div>

                {/* Additional cards can be added here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}