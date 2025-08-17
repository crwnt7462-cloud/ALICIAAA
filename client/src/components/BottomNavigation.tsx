import { useLocation } from 'wouter';
import { 
  Home, Calendar, Sparkles, Users, BarChart3 
} from 'lucide-react';

export function BottomNavigation() {
  const [location, setLocation] = useLocation();

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
      {/* Navigation mobile - en bas */}
      <div className="mobile-nav-only fixed bottom-1 left-1/2 transform -translate-x-1/2 z-50">
        {/* Barre flottante glassmorphism compacte mobile */}
        <div className="bg-white/20 backdrop-blur-md border border-white/30 shadow-xl rounded-full px-4 py-1.5">
          <div className="flex items-center gap-3">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                className={`flex flex-col items-center gap-0.5 transition-all duration-200 px-1.5 py-0.5 ${
                  item.active
                    ? 'text-gray-900 transform scale-105'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                <span className="text-[9px] font-medium">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation desktop - à gauche */}
      <div className="desktop-sidebar-only fixed left-4 top-1/2 transform -translate-y-1/2 z-50">
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
    </>
  );
}
