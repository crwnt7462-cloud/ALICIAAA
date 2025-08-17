import { useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import { 
  Home, Calendar, Sparkles, Users, BarChart3 
} from 'lucide-react';

export function BottomNavigation() {
  const [location, setLocation] = useLocation();
  const [isMobile, setIsMobile] = useState(() => {
    // Initialize based on window size if available
    if (typeof window !== 'undefined') {
      const mobile = window.innerWidth < 768;
      console.log('🔍 INIT Mobile Detection:', mobile, 'Width:', window.innerWidth);
      return mobile;
    }
    return true; // Default to mobile if window not available
  });

  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      console.log('🔍 Mobile Detection Update:', mobile, 'Width:', window.innerWidth);
      setIsMobile(mobile);
    };
    
    // Set initial state
    checkIsMobile();
    
    // Add listener
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Force log current state
  console.log('🔍 Current isMobile state:', isMobile, 'Window width:', typeof window !== 'undefined' ? window.innerWidth : 'undefined');

  // Masquer complètement la navigation sur la page planning en mobile
  if (isMobile && location === '/planning') {
    return null;
  }

  // Mobile: Afficher la barre horizontale style Dashboard pro
  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/20 backdrop-blur-md border-b border-white/30 shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-800">Avyento</span>
          </div>
          
          {/* Navigation horizontale */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  item.active
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title={item.label}
              >
                <item.icon className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      label: 'Accueil',
      icon: Home,
      path: '/dashboard',
      active: location === '/' || location === '/dashboard'
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
      path: '/clients',
      active: location === '/clients'
    },
    {
      label: 'Pro Tools',
      icon: BarChart3,
      path: '/business-features',
      active: location === '/business-features' || location.includes('/pro-')
    },
    {
      label: 'IA',
      icon: Sparkles,
      path: '/ai',
      active: location === '/ai' || location.includes('/ai-')
    }
  ];

  return (
    <>


      {/* Navigation desktop - à gauche - COMPLÈTEMENT MASQUÉE SUR MOBILE */}
      {!isMobile && (
        <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50">
          {/* Sidebar verticale glassmorphism */}
          <div className="bg-white/20 backdrop-blur-md border border-white/30 shadow-xl rounded-2xl px-3 py-4">
            <div className="flex flex-col gap-6">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => setLocation(item.path)}
                  className={`flex flex-col items-center gap-1.5 transition-all duration-200 px-2 py-2 rounded-xl ${
                    item.active
                      ? 'text-gray-900 bg-white/30 transform scale-105'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-white/20'
                  }`}
                  title={item.label}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium text-center leading-tight">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
