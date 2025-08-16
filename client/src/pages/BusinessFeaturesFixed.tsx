import { useState } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { 
  Users, Calendar, Package, MessageCircle, Settings, QrCode, Share, Link,
  Copy, Mail, X, Smartphone, DollarSign, CreditCard, Receipt, FileText,
  TrendingUp, Clock, Target, Award, AlertTriangle, CheckCircle,
  UserCheck, BarChart3, PieChart, Plus, Filter, Search,
  Home, Bell, User, ArrowUp, ArrowDown, Star, Zap, Trophy
} from 'lucide-react';

export default function BusinessFeaturesFixed() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeSheet, setActiveSheet] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Stats complètes pour le dashboard professionnel
  const stats = {
    todayAppointments: 8,
    todayRevenue: 650,
    weekRevenue: 2340,
    monthRevenue: 8950,
    monthTarget: 12000,
    pendingAppointments: 3,
    pendingPayments: 2,
    totalClients: 156,
    stockAlerts: 2,
    averageRating: 4.8,
    totalReviews: 127,
    employeeCount: 3,
    completionRate: 94
  };

  // Données de performance par employé
  const employeePerformance = [
    { id: 1, name: 'Sophie Martin', revenue: 3200, appointments: 45, hours: 35, rating: 4.9 },
    { id: 2, name: 'Marie Dubois', revenue: 2800, appointments: 38, hours: 32, rating: 4.7 },
    { id: 3, name: 'Emma Laurent', revenue: 2950, appointments: 42, hours: 36, rating: 4.8 }
  ];

  // Données financières
  const financialData = {
    monthlyExpenses: [
      { category: 'Loyer salon', amount: 1800, type: 'fixed' },
      { category: 'Électricité', amount: 180, type: 'fixed' },
      { category: 'Internet/Téléphone', amount: 80, type: 'fixed' },
      { category: 'Assurance', amount: 120, type: 'fixed' },
      { category: 'Produits/Matériel', amount: 450, type: 'variable' }
    ],
    pendingInvoices: [
      { id: 1, client: 'Sarah Wilson', service: 'Coupe + Couleur', amount: 85, date: '2025-08-17' },
      { id: 2, client: 'Lisa Garcia', service: 'Manucure gel', amount: 45, date: '2025-08-16' }
    ],
    recentPayments: [
      { id: 1, client: 'Marie Leroy', service: 'Balayage', amount: 120, date: '2025-08-16', method: 'CB' },
      { id: 2, client: 'Anna Sofia', service: 'Soin visage', amount: 75, date: '2025-08-16', method: 'Espèces' }
    ]
  };

  // Efficacité des prestations
  const serviceEfficiency = [
    { service: 'Coupe femme', avgTime: 45, plannedTime: 60, efficiency: 125 },
    { service: 'Couleur', avgTime: 120, plannedTime: 90, efficiency: 75 },
    { service: 'Manucure', avgTime: 35, plannedTime: 45, efficiency: 129 },
    { service: 'Brushing', avgTime: 25, plannedTime: 30, efficiency: 120 }
  ];

  // To-do list automatique
  const todoList = [
    { id: 1, task: 'Confirmer 3 rendez-vous de demain', urgent: true, completed: false },
    { id: 2, task: 'Répondre à 2 nouveaux avis clients', urgent: false, completed: false },
    { id: 3, task: 'Mettre à jour les disponibilités de la semaine', urgent: false, completed: true },
    { id: 4, task: 'Relancer Lisa Garcia pour paiement en attente', urgent: true, completed: false }
  ];

  const navigationTabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Home },
    { id: 'planning', label: 'Planning & RDV', icon: Calendar },
    { id: 'finance', label: 'Performance & CA', icon: DollarSign },
    { id: 'clients', label: 'Clients & Relation', icon: Users },
    { id: 'services', label: 'Services & Offres', icon: Package },
    { id: 'employees', label: 'Employés', icon: UserCheck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];



  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Vue d'ensemble rapide */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-3">
            <Calendar className="w-8 h-8 text-blue-500" />
            <span className="text-sm text-gray-500">Aujourd'hui</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</div>
          <div className="text-sm text-gray-600">Rendez-vous</div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-8 h-8 text-green-500" />
            <span className="text-sm text-gray-500">CA jour</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.todayRevenue}€</div>
          <div className="text-sm text-gray-600">Chiffre d'affaires</div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-3">
            <Star className="w-8 h-8 text-yellow-500" />
            <span className="text-sm text-gray-500">Satisfaction</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.averageRating}</div>
          <div className="text-sm text-gray-600">{stats.totalReviews} avis</div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-3">
            <Target className="w-8 h-8 text-purple-500" />
            <span className="text-sm text-gray-500">Objectif mois</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{Math.round((stats.monthRevenue / stats.monthTarget) * 100)}%</div>
          <div className="text-sm text-gray-600">{stats.monthRevenue}€ / {stats.monthTarget}€</div>
        </motion.div>
      </div>

      {/* To-do list automatique */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          To-do List Automatique
        </h3>
        <div className="space-y-3">
          {todoList.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center justify-between p-3 rounded-xl ${
                todo.completed ? 'bg-green-50 border border-green-200' : 
                todo.urgent ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${
                  todo.completed ? 'bg-green-500' : 
                  todo.urgent ? 'bg-red-500' : 'bg-gray-300'
                }`} />
                <span className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {todo.task}
                </span>
              </div>
              {todo.urgent && !todo.completed && (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Prochains RDV du jour */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="w-5 h-5 text-blue-500 mr-2" />
          Prochains Rendez-vous du Jour
        </h3>
        <div className="space-y-3">
          {[
            { time: '14:30', client: 'Sophie Martin', service: 'Coupe + Brushing', status: 'confirmé' },
            { time: '15:45', client: 'Marie Dubois', service: 'Couleur racines', status: 'attente' },
            { time: '17:00', client: 'Emma Laurent', service: 'Manucure gel', status: 'confirmé' }
          ].map((appointment, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="text-sm font-semibold text-violet-600">{appointment.time}</div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{appointment.client}</div>
                  <div className="text-xs text-gray-600">{appointment.service}</div>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                appointment.status === 'confirmé' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {appointment.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFinanceTab = () => (
    <div className="space-y-6">
      {/* Suivi des paiements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Receipt className="w-5 h-5 text-green-500 mr-2" />
            Paiements Reçus
          </h3>
          <div className="space-y-3">
            {financialData.recentPayments.map((payment) => (
              <div key={payment.id} className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                <div>
                  <div className="text-sm font-medium text-gray-900">{payment.client}</div>
                  <div className="text-xs text-gray-600">{payment.service} • {payment.method}</div>
                </div>
                <div className="text-sm font-semibold text-green-600">+{payment.amount}€</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 text-amber-500 mr-2" />
            Paiements en Attente
          </h3>
          <div className="space-y-3">
            {financialData.pendingInvoices.map((invoice) => (
              <div key={invoice.id} className="flex justify-between items-center p-3 bg-amber-50 rounded-xl">
                <div>
                  <div className="text-sm font-medium text-gray-900">{invoice.client}</div>
                  <div className="text-xs text-gray-600">{invoice.service}</div>
                </div>
                <div className="text-sm font-semibold text-amber-600">{invoice.amount}€</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 text-blue-500 mr-2" />
            Dépenses Fixes
          </h3>
          <div className="space-y-2">
            {financialData.monthlyExpenses.map((expense, index) => (
              <div key={index} className="flex justify-between items-center p-2 text-sm">
                <span className="text-gray-600">{expense.category}</span>
                <span className="font-medium text-gray-900">{expense.amount}€</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-3">
              <div className="flex justify-between items-center font-semibold">
                <span>Total mensuel</span>
                <span>{financialData.monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0)}€</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance CA */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 text-purple-500 mr-2" />
          Performance & Chiffre d'Affaires
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-900">{stats.todayRevenue}€</div>
            <div className="text-sm text-gray-600">Aujourd'hui</div>
            <div className="text-xs text-green-600 flex items-center justify-center mt-1">
              <ArrowUp className="w-3 h-3 mr-1" />
              +12%
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-900">{stats.weekRevenue}€</div>
            <div className="text-sm text-gray-600">Cette semaine</div>
            <div className="text-xs text-green-600 flex items-center justify-center mt-1">
              <ArrowUp className="w-3 h-3 mr-1" />
              +8%
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-900">{stats.monthRevenue}€</div>
            <div className="text-sm text-gray-600">Ce mois</div>
            <div className="text-xs text-green-600 flex items-center justify-center mt-1">
              <ArrowUp className="w-3 h-3 mr-1" />
              +15%
            </div>
          </div>
          <div className="text-center p-4 bg-violet-50 rounded-xl">
            <div className="text-2xl font-bold text-violet-600">{Math.round((stats.monthRevenue / stats.monthTarget) * 100)}%</div>
            <div className="text-sm text-gray-600">Objectif atteint</div>
            <div className="text-xs text-gray-500 mt-1">{stats.monthTarget}€ visé</div>
          </div>
        </div>
      </div>

      {/* Rapport d'efficacité */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="w-5 h-5 text-yellow-500 mr-2" />
          Rapport d'Efficacité des Prestations
        </h3>
        <div className="space-y-4">
          {serviceEfficiency.map((service, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">{service.service}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  service.efficiency >= 120 ? 'bg-green-100 text-green-700' :
                  service.efficiency >= 100 ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {service.efficiency}% efficacité
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Temps moyen: {service.avgTime}min</span>
                <span>Temps prévu: {service.plannedTime}min</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full ${
                    service.efficiency >= 120 ? 'bg-green-500' :
                    service.efficiency >= 100 ? 'bg-blue-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(service.efficiency, 150)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEmployeesTab = () => (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <UserCheck className="w-5 h-5 text-blue-500 mr-2" />
          Gestion des Employés / Collaborateurs
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {employeePerformance.map((employee) => (
            <motion.div
              key={employee.id}
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">{employee.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{employee.name}</div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">{employee.rating}</span>
                    </div>
                  </div>
                </div>
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">CA généré</span>
                  <span className="font-semibold text-green-600">{employee.revenue}€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">RDV effectués</span>
                  <span className="font-semibold text-blue-600">{employee.appointments}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Heures travaillées</span>
                  <span className="font-semibold text-purple-600">{employee.hours}h</span>
                </div>
              </div>
              
              <button 
                onClick={() => setLocation(`/planning?employee=${employee.id}`)}
                className="w-full mt-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Voir Planning
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'finance':
        return renderFinanceTab();
      case 'employees':
        return renderEmployeesTab();
      case 'planning':
        return (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Planning & Rendez-vous</h3>
            <p className="text-gray-600 mb-4">Gérez vos rendez-vous et disponibilités</p>
            <button 
              onClick={() => setLocation('/planning')}
              className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium"
            >
              Accéder au Planning
            </button>
          </div>
        );
      case 'clients':
        return (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Clients & Relation</h3>
            <p className="text-gray-600 mb-4">Gérez votre base client et fidélité</p>
            <button 
              onClick={() => setLocation('/clients')}
              className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium"
            >
              Accéder aux Clients
            </button>
          </div>
        );
      case 'services':
        return (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Services & Offres</h3>
            <p className="text-gray-600 mb-4">Gérez vos prestations et promotions</p>
            <button 
              onClick={() => setLocation('/services')}
              className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium"
            >
              Gérer les Services
            </button>
          </div>
        );
      case 'analytics':
        return (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Avancés</h3>
            <p className="text-gray-600 mb-4">Analysez vos performances en détail</p>
            <button 
              onClick={() => setLocation('/professional-settings-demo')}
              className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium"
            >
              Voir Analytics
            </button>
          </div>
        );
      default:
        return renderOverviewTab();
    }
  };

  const getSheetTitle = () => {
    switch (activeSheet) {
      case 'share':
        return 'Partage de votre salon';
      case 'inventory':
        return 'Gestion du stock';
      case 'settings':
        return 'Paramètres du salon';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      {/* Header moderne avec navigation */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Dashboard Professionnel
                </h1>
                <p className="text-gray-600 text-sm">Centre de gestion et analytics avancés</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-green-100 px-3 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 text-sm font-medium">En ligne</span>
              </div>
              <button 
                onClick={() => setLocation('/notifications')}
                className="relative p-2 bg-white/50 rounded-xl hover:bg-white/80 transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">3</span>
                </div>
              </button>
            </div>
          </div>

          {/* Navigation par onglets - Desktop */}
          <div className="hidden lg:flex space-x-1 bg-gray-100 p-1 rounded-xl">
            {navigationTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-violet-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation mobile - Dropdown */}
          <div className="lg:hidden">
            <select 
              value={activeTab} 
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-medium"
            >
              {navigationTabs.map((tab) => (
                <option key={tab.id} value={tab.id}>{tab.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto p-4 lg:p-6 pb-24 lg:pb-6">
        {renderContent()}
      </div>

    </div>
  );
}