import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Grid3X3, List, Heart, X, Calendar, Users, Star, TrendingUp
} from 'lucide-react';

// Interface pour les rendez-vous du jour
interface TodayAppointment {
  id: string;
  name: string;
  avatar: string;
  status: string;
  date: string;
  time: string;
  situation: string;
}

// Interface Mediwave exacte reproduisant la capture d'écran
export default function ClientsModern() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Statistiques du dashboard - exactement comme dans la capture
  const dashboardStats = {
    appointments: { count: 150, label: 'Todays', percentage: '+31%' },
    consultations: { count: 22, label: 'Todays', percentage: '-6.4%' },
    cancelled: { count: 3, label: 'Todays', percentage: '+30%' },
    urgentResolve: { count: 5, label: 'Todays', percentage: '+31%' }
  };

  // Insights clients avancés demandés
  const clientInsights = {
    loyalClients: { 
      percentage: 68, 
      label: 'Clients fidèles',
      description: 'Plus de 5 visites',
      change: '+12%',
      color: '#10b981'
    },
    newClients: { 
      percentage: 32, 
      label: 'Nouveaux clients',
      description: 'Moins de 5 visites',
      change: '+8%',
      color: '#f59e0b'
    },
    reviewedClients: { 
      percentage: 45, 
      label: 'Clients avec avis',
      description: 'Ont laissé un avis',
      change: '+15%',
      color: '#8b5cf6'
    }
  };

  // Rendez-vous du jour - exactement comme dans la capture
  const todayAppointments: TodayAppointment[] = [
    {
      id: '1',
      name: 'Abdullah Al Ahmed Shawqi',
      avatar: '👨🏽',
      status: 'Consultation',
      date: '03.01.2019',
      time: '10:00 AM',
      situation: '🟢'
    },
    {
      id: '2',
      name: 'Al Shaheer Shasson',
      avatar: '👨🏽',
      status: 'Consultation',
      date: '03.01.2019',
      time: '10:20 AM',
      situation: '🟢'
    },
    {
      id: '3',
      name: 'Lyn R. Formus',
      avatar: '👤',
      status: 'Consultation',
      date: '03.01.2019',
      time: '10:40 AM',
      situation: '🟢'
    },
    {
      id: '4',
      name: 'Katherine A. Sheriff',
      avatar: '👩🏼',
      status: 'Consultation',
      date: '03.01.2019',
      time: '11:00 AM',
      situation: '🟢'
    },
    {
      id: '5',
      name: 'Robert S. Perez',
      avatar: '👨🏻',
      status: 'Consultation',
      date: '03.01.2019',
      time: '11:20 AM',
      situation: '🟢'
    },
    {
      id: '6',
      name: 'Jason L. Bowling',
      avatar: '👨🏿',
      status: 'Consultation',
      date: '03.01.2019',
      time: '11:40 AM',
      situation: '🟢'
    },
    {
      id: '7',
      name: 'Joseph A. Rose',
      avatar: '👨🏼',
      status: 'Consultation',
      date: '03.01.2019',
      time: '12:00 PM',
      situation: '🟢'
    }
  ];

  // Fonction pour créer le cercle de progression
  const ProgressCircle = ({ percentage, color }: { percentage: number; color: string }) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 50 50">
          <circle
            cx="25"
            cy="25"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="3"
            fill="transparent"
          />
          <circle
            cx="25"
            cy="25"
            r={radius}
            stroke={color}
            strokeWidth="3"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-700">{percentage}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-3 sm:p-6">
      {/* Header avec bouton retour */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => window.history.back()}
        className="absolute left-2 sm:left-4 top-2 sm:top-4 z-20 p-2 sm:p-3 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/50 shadow-md hover:bg-white/90 transition-all"
      >
        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
      </motion.button>

      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8">
        {/* En-tête principale */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-12 sm:pt-16"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">Overview</h1>
              <p className="text-sm sm:text-base text-gray-600">Md Rayhan Islam • Central Clinic Dhaka • Today's</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                <List className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                <Grid3X3 className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* 4 Cartes statistiques colorées - exactement comme la capture */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {/* Carte Appointments - Bleue */}
          <div className="bg-blue-500 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold">Appointments</h3>
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl sm:text-4xl font-bold mb-1">{dashboardStats.appointments.count}</div>
                <div className="text-blue-100 text-xs sm:text-sm">{dashboardStats.appointments.label}</div>
              </div>
              <div className="hidden sm:block">
                <ProgressCircle percentage={31} color="#ffffff" />
              </div>
            </div>
            <div className="mt-2 text-xs sm:text-sm text-blue-100">{dashboardStats.appointments.percentage}</div>
          </div>

          {/* Carte Consultations - Violette */}
          <div className="bg-purple-500 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold">Consultations</h3>
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl sm:text-4xl font-bold mb-1">{dashboardStats.consultations.count}</div>
                <div className="text-purple-100 text-xs sm:text-sm">{dashboardStats.consultations.label}</div>
              </div>
              <div className="hidden sm:block">
                <ProgressCircle percentage={64} color="#ffffff" />
              </div>
            </div>
            <div className="mt-2 text-xs sm:text-sm text-purple-100">{dashboardStats.consultations.percentage}</div>
          </div>

          {/* Carte Cancelled - Rouge */}
          <div className="bg-red-500 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold">Cancelled</h3>
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl sm:text-4xl font-bold mb-1">0{dashboardStats.cancelled.count}</div>
                <div className="text-red-100 text-xs sm:text-sm">{dashboardStats.cancelled.label}</div>
              </div>
              <div className="hidden sm:block">
                <ProgressCircle percentage={30} color="#ffffff" />
              </div>
            </div>
            <div className="mt-2 text-xs sm:text-sm text-red-100">{dashboardStats.cancelled.percentage}</div>
          </div>

          {/* Carte Urgent Resolve - Verte */}
          <div className="bg-green-500 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold">Urgent Resolve</h3>
              <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl sm:text-4xl font-bold mb-1">0{dashboardStats.urgentResolve.count}</div>
                <div className="text-green-100 text-xs sm:text-sm">{dashboardStats.urgentResolve.label}</div>
              </div>
              <div className="hidden sm:block">
                <ProgressCircle percentage={31} color="#ffffff" />
              </div>
            </div>
            <div className="mt-2 text-xs sm:text-sm text-green-100">{dashboardStats.urgentResolve.percentage}</div>
          </div>
        </motion.div>

        {/* Insights Clients Avancés */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Insights Clients</h2>
            <p className="text-sm sm:text-base text-gray-600">Analyse comportementale de votre clientèle</p>
          </div>

          {/* 3 Cartes d'insights clients */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Clients fidèles */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200/50">
              <div className="flex items-start sm:items-center justify-between mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 sm:p-3 bg-green-100 rounded-lg sm:rounded-xl">
                    <Users className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800">{clientInsights.loyalClients.label}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{clientInsights.loyalClients.description}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                    {clientInsights.loyalClients.percentage}%
                  </div>
                  <div className="text-xs sm:text-sm text-green-600 font-medium">
                    {clientInsights.loyalClients.change}
                  </div>
                </div>
                <div className="hidden sm:block">
                  <ProgressCircle percentage={clientInsights.loyalClients.percentage} color={clientInsights.loyalClients.color} />
                </div>
              </div>
            </div>

            {/* Nouveaux clients */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200/50">
              <div className="flex items-start sm:items-center justify-between mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 sm:p-3 bg-amber-100 rounded-lg sm:rounded-xl">
                    <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800">{clientInsights.newClients.label}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{clientInsights.newClients.description}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                    {clientInsights.newClients.percentage}%
                  </div>
                  <div className="text-xs sm:text-sm text-amber-600 font-medium">
                    {clientInsights.newClients.change}
                  </div>
                </div>
                <div className="hidden sm:block">
                  <ProgressCircle percentage={clientInsights.newClients.percentage} color={clientInsights.newClients.color} />
                </div>
              </div>
            </div>

            {/* Clients avec avis */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200/50">
              <div className="flex items-start sm:items-center justify-between mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 sm:p-3 bg-purple-100 rounded-lg sm:rounded-xl">
                    <Star className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800">{clientInsights.reviewedClients.label}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{clientInsights.reviewedClients.description}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                    {clientInsights.reviewedClients.percentage}%
                  </div>
                  <div className="text-xs sm:text-sm text-purple-600 font-medium">
                    {clientInsights.reviewedClients.change}
                  </div>
                </div>
                <div className="hidden sm:block">
                  <ProgressCircle percentage={clientInsights.reviewedClients.percentage} color={clientInsights.reviewedClients.color} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section Todays avec liste des rendez-vous */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden"
        >
          {/* En-tête de la section */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Todays</h2>
              <span className="text-xs sm:text-sm text-gray-500">150 Appointments</span>
            </div>
          </div>

          {/* En-têtes des colonnes - masqué sur mobile */}
          <div className="hidden sm:block px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-3">Name</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Time</div>
              <div className="col-span-1">Situation</div>
              <div className="col-span-2">Actions</div>
            </div>
          </div>

          {/* Liste des rendez-vous */}
          <div className="divide-y divide-gray-100">
            {todayAppointments.map((appointment, index) => (
              <motion.div 
                key={appointment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors"
              >
                {/* Version Desktop */}
                <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
                  {/* Nom avec avatar */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                      {appointment.avatar}
                    </div>
                    <span className="font-medium text-gray-900">{appointment.name}</span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <span className="text-blue-600 text-sm">{appointment.status}</span>
                  </div>

                  {/* Date */}
                  <div className="col-span-2">
                    <span className="text-gray-600 text-sm">{appointment.date}</span>
                  </div>

                  {/* Time */}
                  <div className="col-span-2">
                    <span className="text-gray-900 font-medium text-sm">{appointment.time}</span>
                  </div>

                  {/* Situation */}
                  <div className="col-span-1 flex justify-center">
                    <span className="text-lg">{appointment.situation}</span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2">
                    <button className="bg-gray-800 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-gray-700 transition-colors">
                      VIEW DETAILS
                    </button>
                  </div>
                </div>

                {/* Version Mobile */}
                <div className="sm:hidden">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                        {appointment.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm truncate">{appointment.name}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-blue-600 text-xs">{appointment.status}</span>
                          <span className="text-gray-600 text-xs">{appointment.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <span className="text-gray-900 font-medium text-xs">{appointment.time}</span>
                      <span className="text-sm">{appointment.situation}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-700 transition-colors">
                      VIEW DETAILS
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer avec pagination */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-gray-600">
              <span>Displaying 7 Record Data of 150 records</span>
              <div className="flex items-center gap-2">
                <span>1 2 3 4 5 6 7 ... 25 50</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}