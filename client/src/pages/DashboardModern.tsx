import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, Calendar, Users, TrendingUp, Clock, 
  Euro, Star, Phone, MessageCircle, Plus, Settings
} from 'lucide-react';

export default function DashboardModern() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Récupérer les stats du dashboard
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    initialData: {
      todayAppointments: 8,
      todayRevenue: 650,
      weekAppointments: 42,
      weekRevenue: 2340,
      monthRevenue: 8750,
      pendingAppointments: 3
    }
  });

  const { data: upcomingAppointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['/api/dashboard/upcoming-appointments'],
    initialData: []
  });

  // Données de démonstration
  const mockUpcoming = [
    {
      id: '1',
      time: '09:00',
      clientName: 'Sophie Martin',
      service: 'Coupe + Couleur',
      duration: 120,
      price: 85,
      status: 'confirmed'
    },
    {
      id: '2',
      time: '11:30',
      clientName: 'Emma Dubois',
      service: 'Soin Visage',
      duration: 60,
      price: 65,
      status: 'confirmed'
    },
    {
      id: '3',
      time: '14:00',
      clientName: 'Claire Bernard',
      service: 'Manucure',
      duration: 45,
      price: 35,
      status: 'pending'
    }
  ];

  const quickActions = [
    { 
      label: 'Nouveau RDV', 
      icon: Plus, 
      action: () => setLocation('/planning'),
      color: 'bg-violet-600 hover:bg-violet-700'
    },
    { 
      label: 'Clients', 
      icon: Users, 
      action: () => setLocation('/clients'),
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    { 
      label: 'Planning', 
      icon: Calendar, 
      action: () => setLocation('/planning'),
      color: 'bg-green-600 hover:bg-green-700'
    },
    { 
      label: 'Messages', 
      icon: MessageCircle, 
      action: () => setLocation('/pro-messaging'),
      color: 'bg-orange-600 hover:bg-orange-700'
    }
  ];

  if (statsLoading || appointmentsLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* Header */}
      <div className="relative">
        
        {/* Container principal */}
        <div className="px-6 pt-16 pb-6">
          <div className="max-w-sm mx-auto">
            
            {/* Logo */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-violet-600">Dashboard</h1>
            </div>

            {/* Titre et date */}
            <div className="text-center mb-8">
              <h2 className="text-xl text-gray-500 font-normal">Today's overview</h2>
              <p className="text-sm text-gray-400 mt-1">{new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>

            {/* Stats du jour */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-violet-600 mb-1">{stats?.todayAppointments || 0}</div>
                <div className="text-xs text-gray-500">RDV aujourd'hui</div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">€{stats?.todayRevenue || 0}</div>
                <div className="text-xs text-gray-500">CA aujourd'hui</div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{stats?.weekAppointments || 0}</div>
                <div className="text-xs text-gray-500">Cette semaine</div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">{stats?.pendingAppointments || 0}</div>
                <div className="text-xs text-gray-500">En attente</div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Actions rapides</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`${action.color} text-white rounded-2xl p-4 transition-colors flex items-center justify-center gap-2`}
                  >
                    <action.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prochains rendez-vous */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Prochains RDV</h3>
                <button 
                  onClick={() => setLocation('/planning')}
                  className="text-sm text-violet-600 hover:text-violet-700"
                >
                  Voir tout
                </button>
              </div>
              
              <div className="space-y-3">
                {mockUpcoming.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{appointment.time}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          appointment.status === 'confirmed' 
                            ? 'bg-green-100 text-green-600 border border-green-200' 
                            : 'bg-yellow-100 text-yellow-600 border border-yellow-200'
                        }`}>
                          {appointment.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">€{appointment.price}</span>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-1">{appointment.clientName}</h4>
                    <p className="text-sm text-gray-600 mb-2">{appointment.service}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{appointment.duration}min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Phone className="h-3 w-3 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <MessageCircle className="h-3 w-3 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Résumé mensuel */}
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-4 border border-violet-100">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-violet-600" />
                <h3 className="font-medium text-violet-900">Performance du mois</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-lg font-bold text-violet-900">€{stats?.monthRevenue || 0}</div>
                  <div className="text-xs text-violet-600">Chiffre d'affaires</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-violet-900">4.8</div>
                  <div className="text-xs text-violet-600 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Note moyenne
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}