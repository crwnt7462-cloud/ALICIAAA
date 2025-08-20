import { useLocation } from "wouter";
import { 
  Sparkles, 
  Home, 
  Calendar, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings as SettingsIcon 
} from "lucide-react";

export function Sidebar() {
  const [, setLocation] = useLocation();

  return (
    <div className="hidden lg:flex lg:w-20 fixed left-0 top-0 h-full flex-col items-center py-6 z-30" style={{
      background: 'linear-gradient(135deg, rgba(139, 69, 219, 0.9) 0%, rgba(109, 40, 217, 0.9) 100%)',
      backdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.125)',
      boxShadow: '0 8px 32px rgba(139, 69, 219, 0.25)'
    }}>
      {/* Logo */}
      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 border border-white/25">
        <Sparkles className="w-6 h-6 text-white" />
      </div>
      
      {/* Navigation Icons */}
      <div className="space-y-4">
        <div 
          onClick={() => setLocation('/')}
          className="w-12 h-12 bg-white/25 backdrop-blur-sm border border-white/30 shadow-sm rounded-2xl flex items-center justify-center cursor-pointer"
        >
          <Home className="w-6 h-6 text-white" />
        </div>
        
        <div 
          onClick={() => setLocation('/planning')}
          className="w-12 h-12 bg-white/25 backdrop-blur-sm border border-white/30 shadow-sm rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
        >
          <Calendar className="w-6 h-6 text-white" />
        </div>
        
        <div 
          onClick={() => setLocation('/clients-modern')}
          className="w-12 h-12 bg-transparent hover:bg-white/15 rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
        >
          <Users className="w-6 h-6 text-white/80" />
        </div>
        
        <div 
          onClick={() => setLocation('/services-management')}
          className="w-12 h-12 bg-transparent hover:bg-white/15 rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
        >
          <SettingsIcon className="w-6 h-6 text-white/80" />
        </div>
        
        <div 
          onClick={() => setLocation('/messaging-hub')}
          className="w-12 h-12 bg-transparent hover:bg-white/15 rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
        >
          <MessageSquare className="w-6 h-6 text-white/80" />
        </div>
        
        <div 
          onClick={() => setLocation('/client-analytics')}
          className="w-12 h-12 bg-transparent hover:bg-white/15 rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
        >
          <BarChart3 className="w-6 h-6 text-white/80" />
        </div>
      </div>
    </div>
  );
}