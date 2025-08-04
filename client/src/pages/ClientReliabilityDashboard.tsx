import React from 'react';
import { useQuery } from '@tanstack/react-query';
import DynamicDepositSystem from '@/components/DynamicDepositSystem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield, TrendingDown, Clock } from 'lucide-react';

export default function ClientReliabilityDashboard() {
  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['/api/appointments'],
  });

  const { data: clientReliability = [], isLoading: reliabilityLoading } = useQuery({
    queryKey: ['/api/client-reliability'],
  });

  const handleUpdateDeposit = async (appointmentId: number, depositPercentage: number) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/deposit`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ depositPercentage }),
      });
      
      if (response.ok) {
        // Refresh data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating deposit:', error);
    }
  };

  const handleClientReliabilityUpdate = async (clientId: string, data: any) => {
    try {
      const response = await fetch(`/api/client-reliability/${clientId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        // Refresh data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating client reliability:', error);
    }
  };

  if (appointmentsLoading || reliabilityLoading) {
    return (
      <div className="bg-gradient-to-br from-violet-50 via-white to-purple-50 min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Transform appointments data for the component
  const transformedAppointments = appointments.map((apt: any) => ({
    id: apt.id,
    clientId: apt.clientId?.toString() || `client-${apt.id}`,
    clientName: apt.client?.firstName + ' ' + (apt.client?.lastName || ''),
    serviceName: apt.service?.name || 'Service',
    servicePrice: apt.service?.price || 50,
    appointmentDate: apt.appointmentDate,
    startTime: apt.startTime,
    status: apt.status,
    isWeekendPremium: new Date(apt.appointmentDate).getDay() === 6, // Saturday
  }));

  // Statistics
  const highRiskClients = clientReliability.filter((cr: any) => cr.reliabilityScore < 30).length;
  const mediumRiskClients = clientReliability.filter((cr: any) => cr.reliabilityScore >= 30 && cr.reliabilityScore < 70).length;
  const totalCancellations = clientReliability.reduce((sum: number, cr: any) => sum + cr.totalCancellations, 0);
  const avgReliabilityScore = clientReliability.length > 0 
    ? Math.round(clientReliability.reduce((sum: number, cr: any) => sum + cr.reliabilityScore, 0) / clientReliability.length)
    : 100;

  return (
    <div className="bg-gradient-to-br from-violet-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <div className="bg-white/40 backdrop-blur-md border-b border-white/30 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-black">Gestion de la Fiabilité Client</h1>
          <p className="text-gray-600 mt-2">
            Système intelligent d'ajustement des acomptes basé sur l'historique client
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Overview Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card border-white/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Clients haut risque</p>
                  <p className="text-2xl font-bold text-red-600">{highRiskClients}</p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Clients risque moyen</p>
                  <p className="text-2xl font-bold text-yellow-600">{mediumRiskClients}</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Score moyen fiabilité</p>
                  <p className="text-2xl font-bold text-green-600">{avgReliabilityScore}/100</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Annulations totales</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCancellations}</p>
                </div>
                <div className="p-2 bg-gray-100 rounded-lg">
                  <TrendingDown className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dynamic Deposit System */}
        <DynamicDepositSystem
          appointments={transformedAppointments}
          clientReliability={clientReliability}
          onUpdateDeposit={handleUpdateDeposit}
          onClientReliabilityUpdate={handleClientReliabilityUpdate}
        />

        {/* Information Panel */}
        <Card className="glass-card border-white/40 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-violet-600" />
              Comment fonctionne le système de fiabilité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Calcul du score de fiabilité</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• <strong>Score initial :</strong> 100 points pour tous les clients</li>
                  <li>• <strong>Annulation :</strong> -0.8 point par % de taux d'annulation</li>
                  <li>• <strong>No-show :</strong> -1.2 point par % de taux de no-show</li>
                  <li>• <strong>Annulations consécutives :</strong> -15 points par annulation</li>
                  <li>• <strong>Score minimum :</strong> 0 point</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Règles d'acompte automatique</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• <strong>Nouveaux clients :</strong> 20% d'acompte</li>
                  <li>• <strong>1 annulation récente :</strong> 50% d'acompte</li>
                  <li>• <strong>2+ annulations consécutives :</strong> 70% d'acompte</li>
                  <li>• <strong>Score &lt; 30 :</strong> 70% d'acompte</li>
                  <li>• <strong>Weekend premium :</strong> +10% minimum</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}