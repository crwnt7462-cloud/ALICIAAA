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
  ExternalLink,
  Plus,
  Clock,
  Star,
  MapPin,
  Phone
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

  // Récupération des données salon de l'utilisateur
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-white px-6 py-8 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Gérez votre salon efficacement</p>
            </div>
            <button 
              onClick={() => setLocation('/settings')}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Salon Info Card */}
          {salon && (
            <div className="mt-6 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{salon.name}</h2>
                  <div className="flex items-center mt-2 text-white/80">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{salon.address}</span>
                  </div>
                  <div className="flex items-center mt-1 text-white/80">
                    <Phone className="w-4 h-4 mr-1" />
                    <span className="text-sm">{salon.phone}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-white/90">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm">{salon.rating || 4.8}</span>
                  </div>
                  <span className="text-xs text-white/70">{salon.reviewCount || 0} avis</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
                  <p className="text-xs text-gray-500">RDV aujourd'hui</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.weeklyRevenue}€</p>
                  <p className="text-xs text-gray-500">CA semaine</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
                  <p className="text-xs text-gray-500">Clients total</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg mr-3">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">+{stats.monthlyGrowth}%</p>
                  <p className="text-xs text-gray-500">Croissance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
            <div className="space-y-3">
              <button
                onClick={() => setLocation('/booking')}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl p-4 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center">
                  <Plus className="w-5 h-5 mr-3" />
                  <span className="font-medium">Nouveau rendez-vous</span>
                </div>
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xs">+</span>
                </div>
              </button>

              <button
                onClick={() => setLocation('/planning')}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-xl p-4 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3 text-gray-600" />
                  <span className="font-medium">Planning</span>
                </div>
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Clock className="w-3 h-3 text-gray-600" />
                </div>
              </button>

              <button
                onClick={() => setLocation('/clients')}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-xl p-4 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-3 text-gray-600" />
                  <span className="font-medium">Clients</span>
                </div>
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">{stats.totalClients}</span>
                </div>
              </button>
            </div>
          </div>

          {/* Salon Management */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestion salon</h3>
            <div className="space-y-3">
              {salon && (
                <>
                  <button
                    onClick={() => setLocation(`/salon-editor/${salon.slug}`)}
                    className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-xl p-4 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center">
                      <Edit3 className="w-5 h-5 mr-3 text-gray-600" />
                      <span className="font-medium">Modifier mon salon</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>

                  <button
                    onClick={() => window.open(`/salon/${salon.slug}`, '_blank')}
                    className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-xl p-4 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center">
                      <Eye className="w-5 h-5 mr-3 text-gray-600" />
                      <span className="font-medium">Voir ma page publique</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}