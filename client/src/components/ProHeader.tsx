import React from 'react';
import { useLocation } from 'wouter';
import { 
  Calendar, 
  Users, 
  Settings, 
  BarChart3, 
  User
} from 'lucide-react';
import avyentoProLogo from '@/assets/avyento-logo.png';

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
        <div className="flex items-center h-16 md:h-20">
          {/* Layout mobile : logo centré */}
          <div className="flex md:hidden w-full justify-center">
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
          </div>

          {/* Layout desktop : logo à gauche + menu à droite */}
          <div className="hidden md:flex w-full items-center justify-between">
            {/* Logo à gauche */}
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

            {/* Navigation menu à droite */}
            <nav className="flex items-center space-x-6 lg:space-x-8">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setLocation(item.path)}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${item.active 
                      ? 'text-purple-600 bg-purple-50 border-b-2 border-purple-600' 
                      : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}