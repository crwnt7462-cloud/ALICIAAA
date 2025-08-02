import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, BarChart3, Users, Calendar, Package,
  MessageCircle, Settings, QrCode, Share, Link,
  Copy, Mail, X, ChevronUp, Smartphone
} from 'lucide-react';

interface BottomSheetData {
  title: string;
  content: React.ReactNode;
}

export default function BusinessFeaturesWithBottomSheets() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeSheet, setActiveSheet] = useState<string | null>(null);

  // Stats en temps réel
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    initialData: {
      todayAppointments: 8,
      todayRevenue: 650,
      weekRevenue: 2340,
      pendingAppointments: 3,
      totalClients: 156,
      stockAlerts: 2
    }
  });

  const tools = [
    {
      id: 'share',
      title: 'Partage Salon',
      icon: Share,
      description: 'Lien et QR Code',
      color: 'bg-blue-500',
      action: () => setActiveSheet('share')
    },
    {
      id: 'planning',
      title: 'Planning',
      icon: Calendar,
      description: `${stats?.todayAppointments} RDV aujourd'hui`,
      color: 'bg-green-500',
      action: () => setLocation('/planning')
    },
    {
      id: 'clients',
      title: 'Clients',
      icon: Users,
      description: `${stats?.totalClients} clientes`,
      color: 'bg-purple-500',
      action: () => setLocation('/clients')
    },
    {
      id: 'inventory',
      title: 'Stock',
      icon: Package,
      description: `${stats?.stockAlerts} alertes`,
      color: 'bg-orange-500',
      action: () => setActiveSheet('inventory')
    },
    {
      id: 'messaging',
      title: 'Messages',
      icon: MessageCircle,
      description: 'Chat clients',
      color: 'bg-pink-500',
      action: () => setLocation('/pro-messaging')
    },
    {
      id: 'settings',
      title: 'Paramètres',
      icon: Settings,
      description: 'Configuration',
      color: 'bg-gray-500',
      action: () => setActiveSheet('settings')
    }
  ];

  const handleCopyLink = () => {
    const salonUrl = `${window.location.origin}/salon/mon-salon`;
    navigator.clipboard.writeText(salonUrl);
    toast({
      title: "Lien copié",
      description: "Le lien de votre salon a été copié",
    });
  };

  const bottomSheets: Record<string, BottomSheetData> = {
    share: {
      title: 'Partage de votre salon',
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-medium text-gray-900 mb-3">Lien de partage</h3>
            <div className="flex items-center gap-3 bg-white rounded-xl p-3 border">
              <Link className="h-4 w-4 text-gray-500" />
              <span className="flex-1 text-sm text-gray-600 truncate">salon-beaute.com/mon-salon</span>
              <button 
                onClick={handleCopyLink}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Copy className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-medium text-gray-900 mb-3">QR Code</h3>
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <QrCode className="h-16 w-16 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600">Scannez pour réserver</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2">
              <Smartphone className="h-4 w-4" />
              WhatsApp
            </button>
            <button className="h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </button>
          </div>
        </div>
      )
    },
    inventory: {
      title: 'Gestion du stock',
      content: (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <h3 className="font-medium text-red-800 mb-2">⚠️ Alertes stock faible</h3>
            <div className="space-y-2">
              <div className="text-sm text-red-700">• Shampooing Professionnel - 2 restants</div>
              <div className="text-sm text-red-700">• Vernis OPI - Stock épuisé</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <div className="text-lg font-bold text-gray-900">45</div>
              <div className="text-xs text-gray-500">Produits</div>
            </div>
            <div className="bg-green-50 rounded-2xl p-3 text-center">
              <div className="text-lg font-bold text-green-600">38</div>
              <div className="text-xs text-gray-500">En stock</div>
            </div>
            <div className="bg-red-50 rounded-2xl p-3 text-center">
              <div className="text-lg font-bold text-red-600">7</div>
              <div className="text-xs text-gray-500">Faible</div>
            </div>
          </div>

          <button 
            onClick={() => {
              setActiveSheet(null);
              setLocation('/inventory');
            }}
            className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl text-base font-medium"
          >
            Gérer l'inventaire complet
          </button>
        </div>
      )
    },
    settings: {
      title: 'Paramètres du salon',
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-medium text-gray-900 mb-3">Informations de base</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>Mon Salon de Beauté</div>
              <div>123 Rue de la Beauté, 75001 Paris</div>
              <div>01 23 45 67 89</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-medium text-gray-900 mb-3">Horaires d'ouverture</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Lundi - Vendredi</span>
                <span>9h00 - 18h00</span>
              </div>
              <div className="flex justify-between">
                <span>Samedi</span>
                <span>9h00 - 17h00</span>
              </div>
              <div className="flex justify-between">
                <span>Dimanche</span>
                <span className="text-red-600">Fermé</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => {
              setActiveSheet(null);
              setLocation('/salon-settings');
            }}
            className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl text-base font-medium"
          >
            Modifier les paramètres
          </button>
        </div>
      )
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* Header */}
      <div className="relative">
        
        {/* Container principal */}
        <div className="px-6 pt-16 pb-6">
          <div className="max-w-sm mx-auto">
            
            {/* Logo */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-violet-600">Pro Tools</h1>
            </div>

            {/* Titre */}
            <div className="text-center mb-8">
              <h2 className="text-xl text-gray-500 font-normal">Business management</h2>
            </div>

            {/* Stats rapides */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600">€{stats?.todayRevenue}</div>
                <div className="text-xs text-gray-500">CA aujourd'hui</div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats?.todayAppointments}</div>
                <div className="text-xs text-gray-500">RDV aujourd'hui</div>
              </div>
            </div>

            {/* Outils en grid 2x3 */}
            <div className="grid grid-cols-2 gap-4">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={tool.action}
                  className="bg-gray-50 hover:bg-gray-100 rounded-2xl p-6 transition-colors text-left"
                >
                  <div className={`w-12 h-12 ${tool.color} rounded-2xl flex items-center justify-center mb-4`}>
                    <tool.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1 text-sm">{tool.title}</h3>
                  <p className="text-xs text-gray-500">{tool.description}</p>
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Sheet Overlay */}
      {activeSheet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[70vh] overflow-hidden">
            
            {/* Handle bar */}
            <div className="flex justify-center pt-2 pb-4">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {bottomSheets[activeSheet]?.title}
              </h3>
              <button
                onClick={() => setActiveSheet(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto">
              {bottomSheets[activeSheet]?.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}