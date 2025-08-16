import React from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Settings, 
  Bell, 
  Search, 
  Home,
  User,
  BarChart3,
  MessageSquare,
  HelpCircle,
  CreditCard,
  Briefcase
} from "lucide-react";

export default function DashboardPeymen() {
  const [, setLocation] = useLocation();
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { isLoading: revenueLoading } = useQuery({
    queryKey: ["/api/dashboard/revenue-chart"],
  });

  const { isLoading: appointmentsLoading } = useQuery({
    queryKey: ["/api/dashboard/upcoming-appointments"],
  });

  const safeStats = stats || {
    totalClients: 0,
    monthlyRevenue: 0,
    appointmentsToday: 0,
    satisfactionRate: 0
  };

  // Ensure we have proper default values for all accessed properties
  const appointments = safeStats.appointmentsToday || 0;
  const revenue = safeStats.monthlyRevenue || 0;
  const clients = safeStats.totalClients || 0;

  if (statsLoading || revenueLoading || appointmentsLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-60 bg-white shadow-lg"></div>
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Style Peymen exact - Forcé visible sur desktop */}
      <div className="flex w-60 bg-white shadow-lg border-r border-gray-200">
        <div className="flex flex-col w-full">
          {/* Logo section - Style Peymen */}
          <div className="px-6 py-8">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-gray-800">Avyento</span>
            </div>
          </div>
          
          {/* Navigation - Style Peymen avec icônes dans des carrés */}
          <nav className="flex-1 px-4 space-y-1">
            <div className="flex items-center space-x-4 px-4 py-4 bg-blue-50 rounded-2xl text-blue-600 font-medium">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <span>Dashboard</span>
            </div>
            
            <button 
              onClick={() => setLocation('/profile')}
              className="w-full flex items-center space-x-4 px-4 py-4 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-2xl transition-all duration-200"
            >
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="font-medium">Profile</span>
            </button>
            
            <button 
              onClick={() => setLocation('/planning')}
              className="w-full flex items-center space-x-4 px-4 py-4 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-2xl transition-all duration-200"
            >
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="font-medium">Planning</span>
            </button>
            
            <button 
              onClick={() => setLocation('/settings')}
              className="w-full flex items-center space-x-4 px-4 py-4 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-2xl transition-all duration-200"
            >
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4" />
              </div>
              <span className="font-medium">Settings</span>
            </button>
            
            <button 
              onClick={() => setLocation('/messages')}
              className="w-full flex items-center space-x-4 px-4 py-4 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-2xl transition-all duration-200"
            >
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="font-medium">Messages</span>
            </button>
            
            <button 
              onClick={() => setLocation('/analytics')}
              className="w-full flex items-center space-x-4 px-4 py-4 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-2xl transition-all duration-200"
            >
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="font-medium">Analytics</span>
            </button>
            
            <button 
              onClick={() => setLocation('/support')}
              className="w-full flex items-center space-x-4 px-4 py-4 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-2xl transition-all duration-200"
            >
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <span className="font-medium">Support</span>
            </button>
          </nav>
          
          {/* CTA Card - Style Peymen */}
          <div className="p-4">
            <div className="bg-gradient-to-br from-blue-500 to-violet-600 rounded-3xl p-6 text-white">
              <h4 className="font-bold text-center mb-2">Get a Premium Account</h4>
              <p className="text-blue-100 text-sm text-center mb-4">Unlock all features</p>
              <Button 
                className="w-full bg-white/20 hover:bg-white/30 text-white border-0 rounded-2xl font-medium py-3"
                onClick={() => setLocation('/premium')}
              >
                Get Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full p-8">
          {/* Header - Style Peymen */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-gray-500 text-sm mb-1">Hi Nanas,</p>
              <h1 className="text-3xl font-bold text-gray-800">Welcome to Avyento</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-gray-400" />
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-2xl w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-12 gap-6">
            {/* Stats Cards Row - Style Peymen */}
            <div className="col-span-8">
              <div className="grid grid-cols-3 gap-6 mb-6">
                {/* Transfer via Card */}
                <Card className="bg-white rounded-3xl shadow-sm border-0 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">RDV aujourd'hui</p>
                      <p className="text-2xl font-bold text-gray-800">{appointments}</p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Transfer Other */}
                <Card className="bg-white rounded-3xl shadow-sm border-0 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-violet-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">CA ce mois</p>
                      <p className="text-2xl font-bold text-gray-800">€{revenue}</p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Transfer Game */}
                <Card className="bg-white rounded-3xl shadow-sm border-0 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Clients actifs</p>
                      <p className="text-2xl font-bold text-gray-800">{clients}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Reach Financial Goals - Style Peymen */}
              <div className="grid grid-cols-5 gap-6">
                <div className="col-span-3">
                  <Card className="bg-white rounded-3xl shadow-sm border-0 h-full">
                    <CardContent className="p-6">
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Reach financial goals faster</h3>
                        <p className="text-gray-500 text-sm mb-6">Use your Avyento card around the world with no hidden fees. Hold, transfer and spend money</p>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-3">
                          Learn More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="col-span-2">
                  <Card className="bg-gradient-to-br from-blue-500 to-violet-600 rounded-3xl shadow-sm border-0 text-white h-full">
                    <CardContent className="p-6 flex flex-col justify-between h-full">
                      <div>
                        <div className="text-right mb-4">
                          <span className="text-blue-100 text-sm">12/24</span>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">5214 4321 5678 4345</p>
                          <p className="text-blue-100 text-sm mt-2">Avyento UIA</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-4 space-y-6">
              {/* Saved This Month */}
              <Card className="bg-white rounded-3xl shadow-sm border-0">
                <CardContent className="p-6 text-center">
                  <h4 className="text-gray-500 text-sm mb-2">Saved This Month</h4>
                  <p className="text-4xl font-bold text-gray-800 mb-4">€{Math.round(revenue * 0.2)}.2</p>
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <span className="text-gray-400">Day</span>
                    <span className="text-gray-400">Week</span>
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full">Month</span>
                    <span className="text-gray-400">Year</span>
                  </div>
                  {/* Simple line chart placeholder */}
                  <div className="mt-6 h-32 flex items-end justify-center space-x-2">
                    {Array.from({length: 7}).map((_, i) => (
                      <div 
                        key={i} 
                        className="bg-blue-100 rounded-t"
                        style={{
                          height: `${Math.random() * 80 + 20}%`,
                          width: '20px'
                        }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Plan for 2021 - Completed */}
              <Card className="bg-gradient-to-br from-blue-900 to-violet-900 rounded-3xl shadow-sm border-0 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold mb-1">Plan for 2025</h4>
                      <p className="text-blue-200 text-sm">Completed</p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-white font-bold">100%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Mobile - Masqué pour desktop */}
      <div className="hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-around">
          <Button variant="ghost" size="sm" className="flex flex-col items-center p-2">
            <Home className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-blue-600">Dashboard</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center p-2" onClick={() => setLocation('/planning')}>
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Planning</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center p-2" onClick={() => setLocation('/clients')}>
            <Users className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Clients</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center p-2" onClick={() => setLocation('/settings')}>
            <Settings className="w-5 h-5 text-gray-400" />
            <span className="text-xs text-gray-400">Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
}