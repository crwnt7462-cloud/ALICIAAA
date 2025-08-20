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

  // PLUS DE MASQUAGE - Navigation mobile toujours visible

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
      label: 'Analytics',
      icon: BarChart3,
      path: '/business-features',
      active: location === '/business-features' || location.includes('/pro-')
    },
    {
      label: 'Messages',
      icon: Sparkles,
      path: '/ai',
      active: location === '/ai' || location.includes('/ai-')
    }
  ];

  return (
    <>
      {/* MOBILE : Navigation en bas - TOUJOURS VISIBLE */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-lg">
          <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                className={`flex flex-col items-center gap-1 transition-all duration-200 py-2 px-3 rounded-lg ${
                  item.active
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* DESKTOP : Sidebar complètement SUPPRIMÉE */}
    </>
  );
}
