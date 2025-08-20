import React from 'react';
import { useLocation } from 'wouter';
import { Home, Calendar, Users, BarChart3, Settings } from 'lucide-react';

interface MobileBottomNavProps {
  userType?: 'pro' | 'client';
}

export function MobileBottomNav({ userType = 'pro' }: MobileBottomNavProps) {
  const [location, setLocation] = useLocation();

  const proNavItems = [
    {
      label: 'Accueil',
      icon: Home,
      path: '/dashboard',
      active: location === '/dashboard' || location === '/'
    },
    {
      label: 'Planning',
      icon: Calendar,
      path: '/planning',
      active: location === '/planning'
    },
    {
      label: 'Clients',
      icon: Users,
      path: '/clients-modern',
      active: location === '/clients-modern'
    },
    {
      label: 'Analytics',
      icon: BarChart3,
      path: '/client-analytics',
      active: location === '/client-analytics'
    },

  ];

  const clientNavItems = [
    {
      label: 'Dashboard',
      icon: Home,
      path: '/client-dashboard',
      active: location === '/client-dashboard'
    },
    {
      label: 'Recherche',
      icon: Calendar,
      path: '/search',
      active: location === '/search'
    },
    {
      label: 'Mes RDV',
      icon: Users,
      path: '/client-rdv',
      active: location === '/client-rdv'
    },
    {
      label: 'Profil',
      icon: Settings,
      path: '/client-parametres',
      active: location === '/client-parametres'
    }
  ];

  const navItems = userType === 'client' ? clientNavItems : proNavItems;

  return (
    <div className="md:hidden">
      {/* Navigation mobile glassmorphism en bas */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-full" 
             style={{
               backdropFilter: 'blur(20px) saturate(180%)',
               background: 'rgba(255, 255, 255, 0.75)',
               border: '1px solid rgba(255, 255, 255, 0.25)',
               boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
             }}>
          
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${
                item.active 
                  ? 'text-purple-600 bg-purple-100/50' 
                  : 'text-gray-600 hover:text-purple-600 hover:bg-gray-100/30'
              }`}
            >
              <item.icon className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}