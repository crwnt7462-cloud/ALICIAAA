import React from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  Edit3, 
  Eye, 
  Plus,
  Clock,
  Star,
  MapPin,
  Phone,
  ChevronRight
} from "lucide-react";

interface Salon {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  isPublished: boolean;
  shareableUrl: string;
  rating?: number;
  reviewCount?: number;
  customColors?: {
    primary: string;
    accent: string;
    buttonText: string;
    buttonClass: string;
    priceColor: string;
    neonFrame: string;
    intensity: number;
  };
}

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const { data: salon, isLoading } = useQuery({
    queryKey: ['/api/user/salon'],
    enabled: true,
  });

  const stats = {
    todayAppointments: 8,
    weeklyRevenue: 1250,
    monthlyGrowth: 12,
    totalClients: 156
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50">
      <div className="max-w-md mx-auto bg-white/80 backdrop-blur-xl min-h-screen">
        {/* Header avec effet glassmorphism */}
        <div className="bg-white/90 backdrop-blur-xl px-6 py-8 border-b border-white/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-500 mt-1">Gérez votre salon en toute simplicité</p>
            </div>
            <button 
              onClick={() => setLocation('/settings')}
              className="p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:bg-white/80 transition-all"
            >
              <Settings className="w-5 h-5 text-violet-600" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Carte salon avec glassmorphism */}
          {salon && (
            <div className="bg-gradient-to-r from-violet-500/90 to-purple-600/90 backdrop-blur-xl rounded-2xl p-6 text-white shadow-xl border border-white/20">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{salon.name}</h2>
                  <div className="flex items-center mt-3 text-white/90">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{salon.address}</span>
                  </div>
                  <div className="flex items-center mt-1 text-white/90">
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="text-sm">{salon.phone}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-white">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-semibold">{salon.rating || 4.8}</span>
                  </div>
                  <span className="text-xs text-white/80">{salon.reviewCount || 0} avis</span>
                </div>
              </div>
            </div>
          )}

          {/* Statistiques en cartes glassmorphism */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-blue-500/20 rounded-xl mr-3 backdrop-blur-sm">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
                  <p className="text-sm text-gray-600">RDV aujourd'hui</p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-green-500/20 rounded-xl mr-3 backdrop-blur-sm">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.weeklyRevenue}€</p>
                  <p className="text-sm text-gray-600">CA semaine</p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-purple-500/20 rounded-xl mr-3 backdrop-blur-sm">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
                  <p className="text-sm text-gray-600">Clients total</p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-orange-500/20 rounded-xl mr-3 backdrop-blur-sm">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">+{stats.monthlyGrowth}%</p>
                  <p className="text-sm text-gray-600">Croissance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Actions rapides</h3>
            
            <button
              onClick={() => setLocation('/booking')}
              className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-2xl p-4 flex items-center justify-between transition-all shadow-xl backdrop-blur-xl border border-white/20"
            >
              <div className="flex items-center">
                <div className="p-2 bg-white/20 rounded-xl mr-3 backdrop-blur-sm">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="font-medium">Nouveau rendez-vous</span>
              </div>
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => setLocation('/planning')}
              className="w-full bg-white/60 backdrop-blur-xl hover:bg-white/80 text-gray-900 border border-white/30 rounded-2xl p-4 flex items-center justify-between transition-all shadow-lg"
            >
              <div className="flex items-center">
                <div className="p-2 bg-violet-500/10 rounded-xl mr-3">
                  <Calendar className="w-5 h-5 text-violet-600" />
                </div>
                <span className="font-medium">Planning</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => setLocation('/clients')}
              className="w-full bg-white/60 backdrop-blur-xl hover:bg-white/80 text-gray-900 border border-white/30 rounded-2xl p-4 flex items-center justify-between transition-all shadow-lg"
            >
              <div className="flex items-center">
                <div className="p-2 bg-violet-500/10 rounded-xl mr-3">
                  <Users className="w-5 h-5 text-violet-600" />
                </div>
                <span className="font-medium">Clients</span>
              </div>
              <div className="bg-violet-100 text-violet-700 rounded-full px-2 py-1 text-xs font-semibold">
                {stats.totalClients}
              </div>
            </button>
          </div>

          {/* Gestion salon */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Gestion salon</h3>
            
            {salon && (
              <div className="space-y-3">
                <button
                  onClick={() => setLocation(`/salon-editor/${salon.slug}`)}
                  className="w-full bg-white/60 backdrop-blur-xl hover:bg-white/80 text-gray-900 border border-white/30 rounded-2xl p-4 flex items-center justify-between transition-all shadow-lg"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-amber-500/10 rounded-xl mr-3">
                      <Edit3 className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="font-medium">Modifier mon salon</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button
                  onClick={() => window.open(`/salon/${salon.slug}`, '_blank')}
                  className="w-full bg-white/60 backdrop-blur-xl hover:bg-white/80 text-gray-900 border border-white/30 rounded-2xl p-4 flex items-center justify-between transition-all shadow-lg"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-amber-500/10 rounded-xl mr-3">
                      <Eye className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="font-medium">Voir ma page publique</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            )}
          </div>

          {/* Espacement pour la navigation bottom */}
          <div className="h-20"></div>
        </div>
      </div>
    </div>
  );
}