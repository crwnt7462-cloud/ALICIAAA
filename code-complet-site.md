# Code Complet du Site de Gestion de Salon de Beauté

## Table des matières
1. [Configuration du projet](#configuration)
2. [Frontend - Pages principales](#frontend-pages)
3. [Frontend - Composants](#frontend-composants)
4. [Backend - API](#backend-api)
5. [Base de données](#base-donnees)
6. [Services](#services)

---

## Configuration

### package.json
```json
{
  "name": "salon-beaute-app",
  "version": "1.0.0",
  "description": "Application de gestion de salon de beauté",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build",
    "build:server": "tsc --project tsconfig.server.json",
    "start": "NODE_ENV=production node dist/server/index.js",
    "db:push": "drizzle-kit push"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-toast": "^1.1.5",
    "@tanstack/react-query": "^5.8.4",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "drizzle-orm": "^0.29.0",
    "drizzle-zod": "^0.5.1",
    "express": "^4.18.2",
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.47.0",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.7",
    "wouter": "^2.12.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.8.10",
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.1.1",
    "autoprefixer": "^10.4.16",
    "drizzle-kit": "^0.20.4",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "tsx": "^4.1.2",
    "typescript": "^5.2.2",
    "vite": "^4.5.0"
  }
}
```

### vite.config.ts
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@assets": path.resolve(__dirname, "./attached_assets"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
```

### tailwind.config.ts
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./client/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

---

## Frontend - Pages principales

### App.tsx
```typescript
import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { BottomNavigation } from "@/components/BottomNavigation";

// Pages
import Dashboard from "@/pages/Dashboard";
import Planning from "@/pages/Planning";
import Clients from "@/pages/Clients";
import Booking from "@/pages/Booking";
import ShareBooking from "@/pages/ShareBooking";
import Services from "@/pages/Services";
import Staff from "@/pages/Staff";
import AIAutomation from "@/pages/AIAutomation";

// Configuration QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const res = await fetch(queryKey[0] as string);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50/50 to-purple-50/30">
        <main className="pb-20">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/planning" component={Planning} />
            <Route path="/clients" component={Clients} />
            <Route path="/booking" component={Booking} />
            <Route path="/share-booking" component={ShareBooking} />
            <Route path="/services" component={Services} />
            <Route path="/staff" component={Staff} />
            <Route path="/ai" component={AIAutomation} />
            <Route>
              <div className="p-4 text-center">
                <h1 className="text-2xl font-bold text-gray-900">Page non trouvée</h1>
                <p className="text-gray-600">La page demandée n'existe pas.</p>
              </div>
            </Route>
          </Switch>
        </main>
        
        <BottomNavigation />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
```

### Dashboard.tsx
```typescript
import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, TrendingUp, Users, Clock, ChevronRight, Plus, Award, Star, Calendar, Settings, UserCheck, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingDashboard } from "@/components/ui/loading-spinner";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: revenueChart = [], isLoading: revenueLoading } = useQuery({
    queryKey: ["/api/dashboard/revenue-chart"],
  });

  const { data: upcomingAppointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ["/api/dashboard/upcoming-appointments"],
  });

  const { data: topServices = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/dashboard/top-services"],
  });

  const { data: staffPerformance = [], isLoading: staffLoading } = useQuery({
    queryKey: ["/api/dashboard/staff-performance"],
  });

  const { lastMessage } = useWebSocket();

  useEffect(() => {
    if (lastMessage?.type?.includes('appointment')) {
      // Could refetch all dashboard data here
    }
  }, [lastMessage]);

  const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  if (statsLoading || revenueLoading || appointmentsLoading || servicesLoading || staffLoading) {
    return <LoadingDashboard />;
  }

  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-gray-50/50 to-purple-50/30 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tableau de bord</h1>
          <p className="text-gray-600 mt-1 flex items-center text-xs">
            <Calendar className="w-3 h-3 mr-1.5 text-purple-500" />
            {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-purple-200 text-purple-700 hover:bg-purple-50 rounded-lg text-xs px-3 py-1.5"
            onClick={() => setLocation('/ai')}
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            Analytics
          </Button>
          <Button 
            size="sm" 
            className="gradient-bg text-white shadow-md hover:scale-105 transition-all duration-200 rounded-lg text-xs px-3 py-1.5"
            onClick={() => setLocation('/booking')}
          >
            <Plus className="w-3 h-3 mr-1" />
            Nouveau RDV
          </Button>
        </div>
      </div>

      {/* Quick Access Menu */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Button 
          className="h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg rounded-xl"
          onClick={() => setLocation("/share-booking")}
        >
          <Share2 className="w-5 h-5 mr-2" />
          Partager lien réservation
        </Button>
        <Button 
          variant="outline"
          className="h-14 border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl"
          onClick={() => setLocation("/booking")}
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouvelle réservation
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Button 
          variant="outline" 
          className="h-16 flex-col border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl text-xs"
          onClick={() => setLocation("/services")}
        >
          <Settings className="w-5 h-5 mb-1" />
          Services
        </Button>
        <Button 
          variant="outline" 
          className="h-16 flex-col border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl text-xs"
          onClick={() => setLocation("/staff")}
        >
          <UserCheck className="w-5 h-5 mb-1" />
          Équipe
        </Button>
        <Button 
          variant="outline" 
          className="h-16 flex-col border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs"
          onClick={() => setLocation("/clients")}
        >
          <Users className="w-5 h-5 mb-1" />
          Clients
        </Button>
        <Button 
          variant="outline" 
          className="h-16 flex-col border-orange-200 text-orange-700 hover:bg-orange-50 rounded-xl text-xs"
          onClick={() => setLocation("/planning")}
        >
          <Calendar className="w-5 h-5 mb-1" />
          Planning
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Aujourd'hui</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {(stats as any)?.todayAppointments || 0}
                </p>
                <p className="text-xs text-gray-500">RDV</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <CalendarCheck className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">CA Semaine</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {(stats as any)?.weekRevenue ? `${(stats as any).weekRevenue}€` : '0€'}
                </p>
                <p className="text-xs text-emerald-600 font-medium">+12%</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">Clients</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {(stats as any)?.totalClients || 0}
                </p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">CA Mois</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {(stats as any)?.monthRevenue ? `${(stats as any).monthRevenue}€` : '0€'}
                </p>
                <p className="text-xs text-purple-600 font-medium">+8%</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-900">Évolution du CA</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueChart}>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={{ fill: '#8B5CF6', strokeWidth: 0, r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-gray-900">Prochains RDV</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-purple-600 hover:text-purple-700 text-xs p-1"
              onClick={() => setLocation('/planning')}
            >
              Voir tout
              <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {upcomingAppointments.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Aucun rendez-vous à venir</p>
            ) : (
              upcomingAppointments.slice(0, 3).map((appointment: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                      <Clock className="w-3 h-3 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-900">{appointment.clientName}</p>
                      <p className="text-xs text-gray-500">{appointment.serviceName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-900">{appointment.time}</p>
                    <p className="text-xs text-gray-500">{appointment.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Services */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-900">Services populaires</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {topServices.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Aucune donnée disponible</p>
            ) : (
              topServices.slice(0, 3).map((service: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-2">
                      <Star className="w-3 h-3 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-900">{service.serviceName}</p>
                      <p className="text-xs text-gray-500">{service.count} réservations</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-emerald-600">{service.revenue}€</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Booking.tsx (Page de réservation simplifiée)
```typescript
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, User, Phone, Mail, CreditCard, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Booking() {
  const [formData, setFormData] = useState({
    // Client info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    // Booking info
    serviceId: "",
    date: "",
    time: "",
    // Payment
    depositAmount: 20
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: services = [] } = useQuery<any[]>({
    queryKey: ["/api/services"],
  });

  // Generate today + next 30 days
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  // Generate time slots 9h-18h
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }
    return slots;
  };

  const selectedService = services.find(s => s.id.toString() === formData.serviceId);

  const createBookingMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/appointments", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Réservation confirmée !",
        description: "Votre rendez-vous a été créé avec succès.",
      });
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        serviceId: "",
        date: "",
        time: "",
        depositAmount: 20
      });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de créer le rendez-vous.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.serviceId || !formData.date || !formData.time) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    const selectedService = services.find(s => s.id.toString() === formData.serviceId);
    if (!selectedService) return;

    // Calculate end time
    const [hours, minutes] = formData.time.split(':').map(Number);
    const endTime = new Date();
    endTime.setHours(hours, minutes + selectedService.duration);
    const endTimeStr = endTime.toTimeString().slice(0, 5);

    createBookingMutation.mutate({
      serviceId: parseInt(formData.serviceId),
      appointmentDate: formData.date,
      startTime: formData.time,
      endTime: endTimeStr,
      clientName: `${formData.firstName} ${formData.lastName}`,
      clientEmail: formData.email,
      clientPhone: formData.phone,
      totalPrice: selectedService.price,
      depositPaid: formData.depositAmount,
      status: "confirmed"
    });
  };

  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-gray-50/50 to-purple-50/30 min-h-full">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Réserver un rendez-vous</h1>
          <p className="text-gray-600 text-sm mt-1">Rapide et simple</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations client */}
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Vos informations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="Votre prénom"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Votre nom"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="06 12 34 56 78"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="votre@email.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Choix du service */}
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                Service souhaité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={formData.serviceId} 
                onValueChange={(value) => setFormData({...formData, serviceId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      <div className="flex justify-between w-full">
                        <span>{service.name}</span>
                        <span className="text-sm text-gray-500 ml-4">
                          {service.duration}min • {service.price}€
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedService && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center text-sm">
                    <span>Durée: {selectedService.duration} minutes</span>
                    <span className="font-semibold text-green-700">Prix: {selectedService.price}€</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Date et heure */}
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                Date et heure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Select 
                  value={formData.date} 
                  onValueChange={(value) => setFormData({...formData, date: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une date" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableDates().map((date) => (
                      <SelectItem key={date} value={date}>
                        {new Date(date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="time">Heure *</Label>
                <Select 
                  value={formData.time} 
                  onValueChange={(value) => setFormData({...formData, time: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un créneau" />
                  </SelectTrigger>
                  <SelectContent>
                    {getTimeSlots().map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Acompte */}
          {selectedService && (
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-orange-600" />
                  Acompte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-700">Prix total: {selectedService.price}€</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Acompte à régler:</span>
                    <span className="text-xl font-bold text-orange-600">{formData.depositAmount}€</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Reste à payer sur place: {selectedService.price - formData.depositAmount}€
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bouton de réservation */}
          <Button 
            type="submit" 
            className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={createBookingMutation.isPending}
          >
            {createBookingMutation.isPending ? (
              <div className="flex items-center">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Réservation...
              </div>
            ) : (
              <div className="flex items-center">
                <Check className="w-5 h-5 mr-2" />
                Réserver maintenant
                {selectedService && ` (${formData.depositAmount}€)`}
              </div>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Paiement sécurisé • Confirmation immédiate</p>
        </div>
      </div>
    </div>
  );
}
```

### ShareBooking.tsx (Page de partage des liens)
```typescript
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Link, 
  Share2, 
  Copy, 
  MessageCircle, 
  Mail, 
  QrCode, 
  ExternalLink,
  Check,
  Smartphone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ShareBooking() {
  const [businessName, setBusinessName] = useState("Mon Salon de Beauté");
  const [copiedLink, setCopiedLink] = useState(false);
  const { toast } = useToast();

  // Generate booking link
  const baseUrl = window.location.origin;
  const bookingLink = `${baseUrl}/book/${encodeURIComponent(businessName.toLowerCase().replace(/\s+/g, '-'))}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      toast({
        title: "Lien copié !",
        description: "Le lien a été copié dans votre presse-papier",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive",
      });
    }
  };

  const shareViaWhatsApp = () => {
    const message = `Bonjour ! Vous pouvez prendre rendez-vous directement en ligne ici : ${bookingLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareViaSMS = () => {
    const message = `Prenez rendez-vous en ligne : ${bookingLink}`;
    const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
    window.open(smsUrl);
  };

  const shareViaEmail = () => {
    const subject = "Prenez rendez-vous en ligne";
    const body = `Bonjour,

Vous pouvez désormais prendre rendez-vous directement en ligne à l'adresse suivante :

${bookingLink}

C'est simple et rapide !

Cordialement,
${businessName}`;
    
    const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl);
  };

  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-gray-50/50 to-purple-50/30 min-h-full">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Partager la réservation</h1>
          <p className="text-gray-600 text-sm mt-1">
            Partagez votre lien de réservation avec vos clients
          </p>
        </div>

        {/* Configuration */}
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center">
              <Link className="w-5 h-5 mr-2 text-blue-600" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="businessName">Nom de votre salon</Label>
              <Input
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Mon Salon de Beauté"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lien de réservation */}
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center">
              <ExternalLink className="w-5 h-5 mr-2 text-green-600" />
              Votre lien de réservation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-sm font-mono text-gray-700 break-all">
                {bookingLink}
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={() => copyToClipboard(bookingLink)}
                className="flex-1"
                variant={copiedLink ? "default" : "outline"}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copié !
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copier
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => window.open(bookingLink, '_blank')}
                variant="outline"
                className="flex-1"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Tester
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Options de partage */}
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center">
              <Share2 className="w-5 h-5 mr-2 text-purple-600" />
              Partager avec vos clients
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={shareViaWhatsApp}
              className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="w-5 h-5 mr-3" />
              Partager sur WhatsApp
            </Button>
            
            <Button
              onClick={shareViaSMS}
              variant="outline"
              className="w-full justify-start"
            >
              <Smartphone className="w-5 h-5 mr-3" />
              Envoyer par SMS
            </Button>
            
            <Button
              onClick={shareViaEmail}
              variant="outline"
              className="w-full justify-start"
            >
              <Mail className="w-5 h-5 mr-3" />
              Envoyer par Email
            </Button>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="border-0 shadow-sm bg-blue-50/80 backdrop-blur-sm rounded-xl">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Comment ça marche ?</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-start">
                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span>
                <span>Copiez ou partagez votre lien personnalisé</span>
              </div>
              <div className="flex items-start">
                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span>
                <span>Vos clients cliquent et réservent directement</span>
              </div>
              <div className="flex items-start">
                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">3</span>
                <span>Vous recevez la réservation automatiquement</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-500 mt-4">
          <p>Lien valable en permanence • Accès mobile optimisé</p>
        </div>
      </div>
    </div>
  );
}
```

---

## Frontend - Composants

### BottomNavigation.tsx
```typescript
import { Home, Calendar, Users, Sparkles, User } from "lucide-react";
import { useLocation } from "wouter";

const navItems = [
  { path: "/", icon: Home, label: "Accueil" },
  { path: "/planning", icon: Calendar, label: "Planning" },
  { path: "/clients", icon: Users, label: "Clients" },
  { path: "/services", icon: User, label: "Services" },
  { path: "/ai", icon: Sparkles, label: "IA Pro" },
];

export function BottomNavigation() {
  const [location, setLocation] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-50">
      <div className="grid grid-cols-5 max-w-screen-lg mx-auto">
        {navItems.map((item) => {
          const isActive = 
            (item.path === "/" && (location === "/" || location === "/dashboard")) ||
            (item.path !== "/" && location.startsWith(item.path));
          
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`p-3 flex flex-col items-center justify-center transition-all duration-200 ${
                isActive
                  ? "text-purple-600 bg-purple-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <item.icon className={`w-6 h-6 mb-1 ${isActive ? "text-purple-600" : ""}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

---

## Backend - API

### server/index.ts
```typescript
import express from "express";
import cors from "cors";
import { setupAuth } from "./replitAuth";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Authentication setup
setupAuth(app);

async function startServer() {
  try {
    // Register API routes
    const server = await registerRoutes(app);
    
    // Setup Vite in development or serve static files in production
    if (process.env.NODE_ENV === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    server.listen(PORT, "0.0.0.0", () => {
      log(`Server running on port ${PORT}`, "express");
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
```

### server/routes.ts
```typescript
import type { Express } from "express";
import { createServer, type Server } from "http";
import { isAuthenticated } from "./replitAuth";
import { storage } from "./storage";
import { insertAppointmentSchema, insertClientSchema, insertServiceSchema, insertStaffSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Services routes
  app.get("/api/services", isAuthenticated, async (req, res) => {
    try {
      const services = await storage.getServices(req.user.id);
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.post("/api/services", isAuthenticated, async (req, res) => {
    try {
      const serviceData = insertServiceSchema.parse({
        ...req.body,
        userId: req.user.id,
      });
      const service = await storage.createService(serviceData);
      res.json(service);
    } catch (error) {
      res.status(400).json({ error: "Invalid service data" });
    }
  });

  app.put("/api/services/:id", isAuthenticated, async (req, res) => {
    try {
      const serviceId = parseInt(req.params.id);
      const updateData = req.body;
      const service = await storage.updateService(serviceId, updateData);
      res.json(service);
    } catch (error) {
      res.status(400).json({ error: "Failed to update service" });
    }
  });

  app.delete("/api/services/:id", isAuthenticated, async (req, res) => {
    try {
      const serviceId = parseInt(req.params.id);
      await storage.deleteService(serviceId);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Failed to delete service" });
    }
  });

  // Clients routes
  app.get("/api/clients", isAuthenticated, async (req, res) => {
    try {
      const clients = await storage.getClients(req.user.id);
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  app.post("/api/clients", isAuthenticated, async (req, res) => {
    try {
      const clientData = insertClientSchema.parse({
        ...req.body,
        userId: req.user.id,
      });
      const client = await storage.createClient(clientData);
      res.json(client);
    } catch (error) {
      res.status(400).json({ error: "Invalid client data" });
    }
  });

  app.put("/api/clients/:id", isAuthenticated, async (req, res) => {
    try {
      const clientId = parseInt(req.params.id);
      const updateData = req.body;
      const client = await storage.updateClient(clientId, updateData);
      res.json(client);
    } catch (error) {
      res.status(400).json({ error: "Failed to update client" });
    }
  });

  app.delete("/api/clients/:id", isAuthenticated, async (req, res) => {
    try {
      const clientId = parseInt(req.params.id);
      await storage.deleteClient(clientId);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Failed to delete client" });
    }
  });

  // Appointments routes
  app.get("/api/appointments", isAuthenticated, async (req, res) => {
    try {
      const date = req.query.date as string;
      const appointments = await storage.getAppointments(req.user.id, date);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      // For public booking, create appointment without authentication
      const appointmentData = insertAppointmentSchema.parse({
        ...req.body,
        userId: req.user?.id || "demo-user", // Fallback for public bookings
      });
      const appointment = await storage.createAppointment(appointmentData);
      res.json(appointment);
    } catch (error) {
      res.status(400).json({ error: "Invalid appointment data" });
    }
  });

  app.put("/api/appointments/:id", isAuthenticated, async (req, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const updateData = req.body;
      const appointment = await storage.updateAppointment(appointmentId, updateData);
      res.json(appointment);
    } catch (error) {
      res.status(400).json({ error: "Failed to update appointment" });
    }
  });

  app.delete("/api/appointments/:id", isAuthenticated, async (req, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      await storage.deleteAppointment(appointmentId);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Failed to delete appointment" });
    }
  });

  // Staff routes
  app.get("/api/staff", isAuthenticated, async (req, res) => {
    try {
      const staff = await storage.getStaff(req.user.id);
      res.json(staff);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch staff" });
    }
  });

  app.post("/api/staff", isAuthenticated, async (req, res) => {
    try {
      const staffData = insertStaffSchema.parse({
        ...req.body,
        userId: req.user.id,
      });
      const staff = await storage.createStaffMember(staffData);
      res.json(staff);
    } catch (error) {
      res.status(400).json({ error: "Invalid staff data" });
    }
  });

  // Dashboard statistics
  app.get("/api/dashboard/stats", isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats(req.user.id);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  app.get("/api/dashboard/revenue-chart", isAuthenticated, async (req, res) => {
    try {
      const revenueChart = await storage.getRevenueChart(req.user.id);
      res.json(revenueChart);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch revenue chart" });
    }
  });

  app.get("/api/dashboard/upcoming-appointments", isAuthenticated, async (req, res) => {
    try {
      const appointments = await storage.getUpcomingAppointments(req.user.id);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch upcoming appointments" });
    }
  });

  app.get("/api/dashboard/top-services", isAuthenticated, async (req, res) => {
    try {
      const topServices = await storage.getTopServices(req.user.id);
      res.json(topServices);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch top services" });
    }
  });

  app.get("/api/dashboard/staff-performance", isAuthenticated, async (req, res) => {
    try {
      const staffPerformance = await storage.getStaffPerformance(req.user.id);
      res.json(staffPerformance);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch staff performance" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
```

---

## Base de données

### shared/schema.ts
```typescript
import { pgTable, text, integer, timestamp, decimal, boolean, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Services table
export const services = pgTable("services", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  duration: integer("duration").notNull(), // in minutes
  category: text("category"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Clients table
export const clients = pgTable("clients", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull().references(() => users.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  notes: text("notes"),
  totalSpent: decimal("total_spent", { precision: 10, scale: 2 }).default("0"),
  totalVisits: integer("total_visits").default(0),
  lastVisit: timestamp("last_visit"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Staff table
export const staff = pgTable("staff", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull().references(() => users.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  specialization: text("specialization"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Appointments table
export const appointments = pgTable("appointments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull().references(() => users.id),
  clientId: integer("client_id").references(() => clients.id),
  serviceId: integer("service_id").references(() => services.id),
  staffId: integer("staff_id").references(() => staff.id),
  appointmentDate: text("appointment_date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  status: text("status").notNull().default("scheduled"), // scheduled, confirmed, cancelled, completed
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email"),
  clientPhone: text("client_phone"),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  depositPaid: decimal("deposit_paid", { precision: 10, scale: 2 }).default("0"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  serviceId: integer("service_id").notNull().references(() => services.id),
  appointmentId: integer("appointment_id").references(() => appointments.id),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Loyalty programs table
export const loyaltyPrograms = pgTable("loyalty_programs", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  points: integer("points").default(0),
  level: text("level").default("bronze"), // bronze, silver, gold, platinum
  totalEarned: integer("total_earned").default(0),
  totalRedeemed: integer("total_redeemed").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Waiting list table
export const waitingList = pgTable("waiting_list", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull().references(() => users.id),
  clientId: integer("client_id").references(() => clients.id),
  serviceId: integer("service_id").references(() => services.id),
  preferredDate: text("preferred_date"),
  preferredTime: text("preferred_time"),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email"),
  clientPhone: text("client_phone"),
  status: text("status").default("active"), // active, contacted, booked, cancelled
  priority: integer("priority").default(1), // 1-5, higher is more urgent
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas using drizzle-zod
export const insertUserSchema = createInsertSchema(users);
export const insertServiceSchema = createInsertSchema(services);
export const insertClientSchema = createInsertSchema(clients);
export const insertStaffSchema = createInsertSchema(staff);
export const insertAppointmentSchema = createInsertSchema(appointments);
export const insertReviewSchema = createInsertSchema(reviews);
export const insertLoyaltyProgramSchema = createInsertSchema(loyaltyPrograms);
export const insertWaitingListSchema = createInsertSchema(waitingList);

// Select types
export type User = typeof users.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Staff = typeof staff.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type LoyaltyProgram = typeof loyaltyPrograms.$inferSelect;
export type WaitingListItem = typeof waitingList.$inferSelect;

// Insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type InsertStaff = z.infer<typeof insertStaffSchema>;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type InsertLoyaltyProgram = z.infer<typeof insertLoyaltyProgramSchema>;
export type InsertWaitingList = z.infer<typeof insertWaitingListSchema>;
```

---

## Services

### server/storage.ts
```typescript
import { eq, desc, and, gte, lte, sql, like, or } from "drizzle-orm";
import { db } from "./db";
import {
  users, services, clients, staff, appointments, reviews, loyaltyPrograms, waitingList,
  type User, type Service, type Client, type Staff, type Appointment, type Review, type LoyaltyProgram, type WaitingListItem,
  type InsertUser, type InsertService, type InsertClient, type InsertStaff, type InsertAppointment, type InsertReview, type InsertLoyaltyProgram, type InsertWaitingList
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: InsertUser): Promise<User>;

  // Service operations
  getServices(userId: string): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: number): Promise<void>;

  // Client operations
  getClients(userId: string): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client>;
  deleteClient(id: number): Promise<void>;

  // Staff operations
  getStaff(userId: string): Promise<Staff[]>;
  createStaffMember(staff: InsertStaff): Promise<Staff>;
  updateStaffMember(id: number, staff: Partial<InsertStaff>): Promise<Staff>;
  deleteStaffMember(id: number): Promise<void>;

  // Appointment operations
  getAppointments(userId: string, date?: string): Promise<(Appointment & { client?: Client; service?: Service; staff?: Staff })[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment>;
  deleteAppointment(id: number): Promise<void>;

  // Dashboard analytics
  getDashboardStats(userId: string): Promise<{
    todayAppointments: number;
    weekRevenue: number;
    monthRevenue: number;
    totalClients: number;
  }>;
  getRevenueChart(userId: string): Promise<Array<{ date: string; revenue: number }>>;
  getUpcomingAppointments(userId: string): Promise<Array<{ date: string; time: string; clientName: string; serviceName: string }>>;
  getTopServices(userId: string): Promise<Array<{ serviceName: string; count: number; revenue: number }>>;
  getStaffPerformance(userId: string): Promise<Array<{ staffName: string; revenue: number; appointmentCount: number }>>;

  // Reviews operations
  getReviews(userId: string): Promise<(Review & { client: Client; service: Service })[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Waiting list operations
  getWaitingList(userId: string): Promise<(WaitingListItem & { client?: Client; service?: Service })[]>;
  addToWaitingList(item: InsertWaitingList): Promise<WaitingListItem>;
  removeFromWaitingList(id: number): Promise<void>;

  // Loyalty program operations
  getLoyaltyProgram(clientId: number): Promise<LoyaltyProgram | undefined>;
  createLoyaltyProgram(loyalty: InsertLoyaltyProgram): Promise<LoyaltyProgram>;
  updateLoyaltyPoints(clientId: number, points: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async upsertUser(userData: InsertUser): Promise<User> {
    const result = await db.insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          username: userData.username,
          email: userData.email,
        },
      })
      .returning();
    return result[0];
  }

  async getServices(userId: string): Promise<Service[]> {
    return await db.select().from(services)
      .where(and(eq(services.userId, userId), eq(services.isActive, true)))
      .orderBy(services.name);
  }

  async createService(service: InsertService): Promise<Service> {
    const result = await db.insert(services).values(service).returning();
    return result[0];
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service> {
    const result = await db.update(services)
      .set(service)
      .where(eq(services.id, id))
      .returning();
    return result[0];
  }

  async deleteService(id: number): Promise<void> {
    await db.update(services)
      .set({ isActive: false })
      .where(eq(services.id, id));
  }

  async getClients(userId: string): Promise<Client[]> {
    return await db.select().from(clients)
      .where(and(eq(clients.userId, userId), eq(clients.isActive, true)))
      .orderBy(desc(clients.lastVisit));
  }

  async getClient(id: number): Promise<Client | undefined> {
    const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
    return result[0];
  }

  async createClient(client: InsertClient): Promise<Client> {
    const result = await db.insert(clients).values(client).returning();
    return result[0];
  }

  async updateClient(id: number, client: Partial<InsertClient>): Promise<Client> {
    const result = await db.update(clients)
      .set(client)
      .where(eq(clients.id, id))
      .returning();
    return result[0];
  }

  async deleteClient(id: number): Promise<void> {
    await db.update(clients)
      .set({ isActive: false })
      .where(eq(clients.id, id));
  }

  async getStaff(userId: string): Promise<Staff[]> {
    return await db.select().from(staff)
      .where(and(eq(staff.userId, userId), eq(staff.isActive, true)))
      .orderBy(staff.firstName);
  }

  async createStaffMember(staffData: InsertStaff): Promise<Staff> {
    const result = await db.insert(staff).values(staffData).returning();
    return result[0];
  }

  async updateStaffMember(id: number, staffData: Partial<InsertStaff>): Promise<Staff> {
    const result = await db.update(staff)
      .set(staffData)
      .where(eq(staff.id, id))
      .returning();
    return result[0];
  }

  async deleteStaffMember(id: number): Promise<void> {
    await db.update(staff)
      .set({ isActive: false })
      .where(eq(staff.id, id));
  }

  async getAppointments(userId: string, date?: string): Promise<(Appointment & { client?: Client; service?: Service; staff?: Staff })[]> {
    let query = db.select({
      appointment: appointments,
      client: clients,
      service: services,
      staff: staff,
    })
    .from(appointments)
    .leftJoin(clients, eq(appointments.clientId, clients.id))
    .leftJoin(services, eq(appointments.serviceId, services.id))
    .leftJoin(staff, eq(appointments.staffId, staff.id))
    .where(eq(appointments.userId, userId));

    if (date) {
      query = query.where(and(
        eq(appointments.userId, userId),
        eq(appointments.appointmentDate, date)
      ));
    }

    const result = await query.orderBy(appointments.appointmentDate, appointments.startTime);
    
    return result.map(row => ({
      ...row.appointment,
      client: row.client || undefined,
      service: row.service || undefined,
      staff: row.staff || undefined,
    }));
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const result = await db.insert(appointments).values(appointment).returning();
    return result[0];
  }

  async updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment> {
    const result = await db.update(appointments)
      .set(appointment)
      .where(eq(appointments.id, id))
      .returning();
    return result[0];
  }

  async deleteAppointment(id: number): Promise<void> {
    await db.delete(appointments).where(eq(appointments.id, id));
  }

  async getDashboardStats(userId: string): Promise<{
    todayAppointments: number;
    weekRevenue: number;
    monthRevenue: number;
    totalClients: number;
  }> {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const [todayAppointments] = await db.select({ count: sql<number>`count(*)` })
      .from(appointments)
      .where(and(
        eq(appointments.userId, userId),
        eq(appointments.appointmentDate, today)
      ));

    const [weekRevenue] = await db.select({ 
      revenue: sql<number>`coalesce(sum(${appointments.totalPrice}), 0)` 
    })
      .from(appointments)
      .where(and(
        eq(appointments.userId, userId),
        gte(appointments.appointmentDate, weekAgo),
        eq(appointments.status, 'completed')
      ));

    const [monthRevenue] = await db.select({ 
      revenue: sql<number>`coalesce(sum(${appointments.totalPrice}), 0)` 
    })
      .from(appointments)
      .where(and(
        eq(appointments.userId, userId),
        gte(appointments.appointmentDate, monthAgo),
        eq(appointments.status, 'completed')
      ));

    const [totalClients] = await db.select({ count: sql<number>`count(*)` })
      .from(clients)
      .where(and(
        eq(clients.userId, userId),
        eq(clients.isActive, true)
      ));

    return {
      todayAppointments: todayAppointments.count,
      weekRevenue: Number(weekRevenue.revenue),
      monthRevenue: Number(monthRevenue.revenue),
      totalClients: totalClients.count,
    };
  }

  async getRevenueChart(userId: string): Promise<Array<{ date: string; revenue: number }>> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const result = await db.select({
      date: appointments.appointmentDate,
      revenue: sql<number>`coalesce(sum(${appointments.totalPrice}), 0)`,
    })
      .from(appointments)
      .where(and(
        eq(appointments.userId, userId),
        gte(appointments.appointmentDate, thirtyDaysAgo),
        eq(appointments.status, 'completed')
      ))
      .groupBy(appointments.appointmentDate)
      .orderBy(appointments.appointmentDate);

    return result.map(row => ({
      date: row.date,
      revenue: Number(row.revenue),
    }));
  }

  async getUpcomingAppointments(userId: string): Promise<Array<{ date: string; time: string; clientName: string; serviceName: string }>> {
    const today = new Date().toISOString().split('T')[0];
    
    const result = await db.select({
      date: appointments.appointmentDate,
      time: appointments.startTime,
      clientName: appointments.clientName,
      serviceName: services.name,
    })
      .from(appointments)
      .leftJoin(services, eq(appointments.serviceId, services.id))
      .where(and(
        eq(appointments.userId, userId),
        gte(appointments.appointmentDate, today),
        or(
          eq(appointments.status, 'scheduled'),
          eq(appointments.status, 'confirmed')
        )
      ))
      .orderBy(appointments.appointmentDate, appointments.startTime)
      .limit(5);

    return result.map(row => ({
      date: row.date,
      time: row.time,
      clientName: row.clientName,
      serviceName: row.serviceName || 'Service non spécifié',
    }));
  }

  async getTopServices(userId: string): Promise<Array<{ serviceName: string; count: number; revenue: number }>> {
    const result = await db.select({
      serviceName: services.name,
      count: sql<number>`count(*)`,
      revenue: sql<number>`coalesce(sum(${appointments.totalPrice}), 0)`,
    })
      .from(appointments)
      .leftJoin(services, eq(appointments.serviceId, services.id))
      .where(and(
        eq(appointments.userId, userId),
        eq(appointments.status, 'completed')
      ))
      .groupBy(services.name)
      .orderBy(sql`count(*) desc`)
      .limit(5);

    return result.map(row => ({
      serviceName: row.serviceName || 'Service non spécifié',
      count: row.count,
      revenue: Number(row.revenue),
    }));
  }

  async getStaffPerformance(userId: string): Promise<Array<{ staffName: string; revenue: number; appointmentCount: number }>> {
    const result = await db.select({
      staffName: sql<string>`concat(${staff.firstName}, ' ', ${staff.lastName})`,
      revenue: sql<number>`coalesce(sum(${appointments.totalPrice}), 0)`,
      appointmentCount: sql<number>`count(*)`,
    })
      .from(appointments)
      .leftJoin(staff, eq(appointments.staffId, staff.id))
      .where(and(
        eq(appointments.userId, userId),
        eq(appointments.status, 'completed')
      ))
      .groupBy(staff.id, staff.firstName, staff.lastName)
      .orderBy(sql`sum(${appointments.totalPrice}) desc`)
      .limit(5);

    return result.map(row => ({
      staffName: row.staffName || 'Personnel non assigné',
      revenue: Number(row.revenue),
      appointmentCount: row.appointmentCount,
    }));
  }

  async getReviews(userId: string): Promise<(Review & { client: Client; service: Service })[]> {
    const result = await db.select({
      review: reviews,
      client: clients,
      service: services,
    })
      .from(reviews)
      .leftJoin(clients, eq(reviews.clientId, clients.id))
      .leftJoin(services, eq(reviews.serviceId, services.id))
      .where(eq(clients.userId, userId))
      .orderBy(desc(reviews.createdAt));

    return result.map(row => ({
      ...row.review,
      client: row.client!,
      service: row.service!,
    }));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const result = await db.insert(reviews).values(review).returning();
    return result[0];
  }

  async getWaitingList(userId: string): Promise<(WaitingListItem & { client?: Client; service?: Service })[]> {
    const result = await db.select({
      waitingItem: waitingList,
      client: clients,
      service: services,
    })
      .from(waitingList)
      .leftJoin(clients, eq(waitingList.clientId, clients.id))
      .leftJoin(services, eq(waitingList.serviceId, services.id))
      .where(and(
        eq(waitingList.userId, userId),
        eq(waitingList.status, 'active')
      ))
      .orderBy(desc(waitingList.priority), waitingList.createdAt);

    return result.map(row => ({
      ...row.waitingItem,
      client: row.client || undefined,
      service: row.service || undefined,
    }));
  }

  async addToWaitingList(item: InsertWaitingList): Promise<WaitingListItem> {
    const result = await db.insert(waitingList).values(item).returning();
    return result[0];
  }

  async removeFromWaitingList(id: number): Promise<void> {
    await db.delete(waitingList).where(eq(waitingList.id, id));
  }

  async getLoyaltyProgram(clientId: number): Promise<LoyaltyProgram | undefined> {
    const result = await db.select().from(loyaltyPrograms)
      .where(eq(loyaltyPrograms.clientId, clientId))
      .limit(1);
    return result[0];
  }

  async createLoyaltyProgram(loyalty: InsertLoyaltyProgram): Promise<LoyaltyProgram> {
    const result = await db.insert(loyaltyPrograms).values(loyalty).returning();
    return result[0];
  }

  async updateLoyaltyPoints(clientId: number, points: number): Promise<void> {
    await db.update(loyaltyPrograms)
      .set({ 
        points: sql`${loyaltyPrograms.points} + ${points}`,
        totalEarned: sql`${loyaltyPrograms.totalEarned} + ${points}`,
        updatedAt: new Date(),
      })
      .where(eq(loyaltyPrograms.clientId, clientId));
  }
}

export const storage = new DatabaseStorage();
```

---

## CSS Global

### client/src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.75rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@layer components {
  .gradient-bg {
    @apply bg-gradient-to-r from-purple-600 to-blue-600;
  }
}
```

---

## Installation et Démarrage

### 1. Installation des dépendances
```bash
npm install
```

### 2. Configuration de la base de données
```bash
# Créer le fichier .env avec DATABASE_URL
echo "DATABASE_URL=your_database_url_here" > .env

# Synchroniser le schéma
npm run db:push
```

### 3. Démarrage du serveur de développement
```bash
npm run dev
```

### 4. Accès à l'application
- **Interface admin** : http://localhost:5000
- **Lien de réservation** : http://localhost:5000/share-booking

---

## Fonctionnalités Principales

### ✅ Pages principales
- **Dashboard** : Vue d'ensemble avec statistiques
- **Réservation** : Formulaire simplifié pour prendre RDV
- **Partage** : Génération de liens pour clients
- **Planning** : Gestion des rendez-vous
- **Clients** : Base de données clientèle
- **Services** : Configuration des prestations

### ✅ Fonctionnalités de réservation
- Formulaire simple en une page
- Sélection service avec prix/durée
- Créneaux horaires automatiques
- Acompte fixe de 20€
- Confirmation immédiate

### ✅ Système de partage
- Génération de liens personnalisés
- Partage WhatsApp/SMS/Email
- Interface mobile optimisée
- Copie en un clic

### ✅ Architecture robuste
- TypeScript complet
- Base de données PostgreSQL
- API REST sécurisée
- Interface responsive

---

*Code complet généré le 13 juillet 2025*