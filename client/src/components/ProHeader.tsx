import React from 'react';
import { useLocation } from 'wouter';
import { 
  Calendar, 
  Users, 
  Settings, 
  BarChart3, 
  Package,
  User
} from 'lucide-react';
import avyentoProLogo from '@assets/avyento-pro-logo.png';

interface ProHeaderProps {
  currentPage?: string;
}

export function ProHeader({ currentPage = 'services' }: ProHeaderProps) {
  const [, setLocation] = useLocation();

  // Menu items spécifiques aux pages professionnelles
  const menuItems = [
    {
      id: 'planning',
      label: 'Planning',
      icon: Calendar,
      path: '/planning',
      active: currentPage === 'planning'
    },
    {
      id: 'services',
      label: 'Services',
      icon: Settings,
      path: '/services-management',
      active: currentPage === 'services'
    },
    {
      id: 'clients',
      label: 'Clients',
      icon: Users,
      path: '/clients',
      active: currentPage === 'clients'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      path: '/business-features',
      active: currentPage === 'analytics'
    },
    {
      id: 'compte',
      label: 'Mon Compte',
      icon: User,
      path: '/dashboard',
      active: currentPage === 'dashboard'
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16 md:h-20">
          {/* Logo centré */}
          <div 
            onClick={() => setLocation('/')}
            className="flex items-center cursor-pointer group"
          >
            <img 
              src={avyentoProLogo} 
              alt="Avyento Pro" 
              className="h-[115px] w-auto"
              style={{ height: '115px' }}
            />
          </div>

          {/* Navigation menu - uniquement sur desktop */}
          <div className="hidden md:flex absolute right-4 lg:right-8 items-center">
            <nav className="flex items-center space-x-6 lg:space-x-8">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setLocation(item.path)}
                  className={`
                    flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-2 rounded-md text-xs lg:text-sm font-medium transition-all duration-200
                    ${item.active 
                      ? 'text-purple-600 bg-purple-50 border-b-2 border-purple-600' 
                      : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <item.icon className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}