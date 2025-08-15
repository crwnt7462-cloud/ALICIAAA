import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  Building, 
  ExternalLink, 
  Settings, 
  Users, 
  Calendar,
  BarChart3,
  LogOut
} from 'lucide-react';

interface SalonData {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  photos: string[];
  rating: number;
  reviewCount: number;
}

export default function ProDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [salon, setSalon] = useState<SalonData | null>(null);
  const [loadingSalon, setLoadingSalon] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/pro/login';
      return;
    }

    if (isAuthenticated && user) {
      fetchMySalon();
    }
  }, [isAuthenticated, isLoading, user]);

  const fetchMySalon = async () => {
    try {
      const response = await fetch('/api/salon/my-salon');
      if (response.ok) {
        const data = await response.json();
        setSalon(data.salon);
      } else {
        console.error('Erreur récupération salon');
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
    } finally {
      setLoadingSalon(false);
    }
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  const visitSalon = () => {
    if (salon) {
      window.open(`/salon/${salon.slug}`, '_blank');
    }
  };

  if (isLoading || loadingSalon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirection en cours
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50"
    >
      {/* Header */}
      <div className="border-b border-white/20 backdrop-blur-xl bg-white/80">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-amber-500 rounded-xl flex items-center justify-center">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Avyento Pro
                </h1>
                <p className="text-sm text-gray-600">
                  Bienvenue, {user?.firstName} {user?.lastName}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Informations salon */}
        {salon && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Card className="backdrop-blur-xl bg-white/70 border border-white/20 shadow-xl p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {salon.name}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {salon.description}
                  </p>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>Adresse:</strong> {salon.address}</p>
                    <p><strong>Téléphone:</strong> {salon.phone}</p>
                    <p><strong>Email:</strong> {salon.email}</p>
                  </div>
                </div>
                <div className="ml-6">
                  <img
                    src={salon.photos[0]}
                    alt={salon.name}
                    className="w-32 h-24 object-cover rounded-xl"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={visitSalon}
                  className="bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Voir ma page salon
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Statistiques rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="backdrop-blur-xl bg-white/70 border border-white/20 shadow-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Rendez-vous</h3>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-600">Cette semaine</p>
              </div>
            </div>
          </Card>

          <Card className="backdrop-blur-xl bg-white/70 border border-white/20 shadow-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Clients</h3>
                <p className="text-2xl font-bold text-gray-900">89</p>
                <p className="text-sm text-gray-600">Total actifs</p>
              </div>
            </div>
          </Card>

          <Card className="backdrop-blur-xl bg-white/70 border border-white/20 shadow-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Chiffre d'affaires</h3>
                <p className="text-2xl font-bold text-gray-900">€2,450</p>
                <p className="text-sm text-gray-600">Ce mois</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Actions rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="backdrop-blur-xl bg-white/70 border border-white/20 shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Actions rapides
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Nouveau RDV
              </Button>
              <Button variant="outline" className="justify-start">
                <Users className="h-4 w-4 mr-2" />
                Ajouter client
              </Button>
              <Button variant="outline" className="justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
              <Button variant="outline" className="justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Statistiques
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}