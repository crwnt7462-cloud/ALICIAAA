import React, { useState, useEffect } from 'react';
import { AlertTriangle, CreditCard, TrendingUp, TrendingDown, Shield, Clock, User, Euro, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ClientReliability {
  clientId: string;
  consecutiveCancellations: number;
  lastCancellationDate?: Date;
  customDepositPercentage?: number;
  reliabilityScore: number; // 0-100
  totalAppointments: number;
  totalCancellations: number;
  totalNoShows: number;
}

interface Appointment {
  id: number;
  clientId: string;
  clientName: string;
  serviceName: string;
  servicePrice: number;
  appointmentDate: string;
  startTime: string;
  status: string;
  isWeekendPremium?: boolean;
}

interface DynamicDepositSystemProps {
  appointments: Appointment[];
  clientReliability: ClientReliability[];
  onUpdateDeposit?: (appointmentId: number, depositPercentage: number) => void;
  onClientReliabilityUpdate?: (clientId: string, data: Partial<ClientReliability>) => void;
}

export default function DynamicDepositSystem({
  appointments,
  clientReliability,
  onUpdateDeposit,
  onClientReliabilityUpdate
}: DynamicDepositSystemProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  // Calculate deposit based on client reliability
  const calculateRecommendedDeposit = (appointment: Appointment, reliability?: ClientReliability) => {
    if (!reliability) {
      return { percentage: 20, reason: 'Nouveau client' };
    }

    const { reliabilityScore, consecutiveCancellations, totalCancellations, totalAppointments } = reliability;
    let percentage = 20; // Base deposit
    let reason = 'Client fiable';

    // Increase deposit based on reliability factors
    if (consecutiveCancellations >= 2) {
      percentage = Math.max(percentage, 70);
      reason = `${consecutiveCancellations} annulations consécutives`;
    } else if (consecutiveCancellations === 1) {
      percentage = Math.max(percentage, 50);
      reason = 'Annulation récente';
    }

    // Adjust based on overall reliability score
    if (reliabilityScore < 30) {
      percentage = Math.max(percentage, 70);
      reason = 'Score de fiabilité très bas';
    } else if (reliabilityScore < 60) {
      percentage = Math.max(percentage, 50);
      reason = 'Score de fiabilité moyen';
    }

    // Consider cancellation rate
    const cancellationRate = totalAppointments > 0 ? (totalCancellations / totalAppointments) * 100 : 0;
    if (cancellationRate > 30) {
      percentage = Math.max(percentage, 60);
      reason = `Taux d'annulation élevé (${cancellationRate.toFixed(0)}%)`;
    }

    // Weekend premium adjustment
    if (appointment.isWeekendPremium) {
      percentage = Math.max(percentage, 30);
      if (percentage === 30 && reason === 'Client fiable') {
        reason = 'Créneau weekend premium';
      }
    }

    // Custom override
    if (reliability.customDepositPercentage) {
      return {
        percentage: reliability.customDepositPercentage,
        reason: 'Acompte personnalisé'
      };
    }

    return { percentage, reason };
  };

  // Get reliability data for a client
  const getClientReliability = (clientId: string) => {
    return clientReliability.find(cr => cr.clientId === clientId);
  };

  // Calculate reliability score
  const calculateReliabilityScore = (reliability: ClientReliability) => {
    const { totalAppointments, totalCancellations, totalNoShows, consecutiveCancellations } = reliability;
    
    if (totalAppointments === 0) return 100;

    let score = 100;
    
    // Penalize cancellations
    const cancellationRate = (totalCancellations / totalAppointments) * 100;
    score -= cancellationRate * 0.8;
    
    // Penalize no-shows more heavily
    const noShowRate = (totalNoShows / totalAppointments) * 100;
    score -= noShowRate * 1.2;
    
    // Penalize consecutive cancellations heavily
    score -= consecutiveCancellations * 15;
    
    return Math.max(0, Math.min(100, score));
  };

  // Get appointments that need deposit adjustment
  const getAppointmentsNeedingAttention = () => {
    return appointments.filter(apt => {
      const reliability = getClientReliability(apt.clientId);
      const { percentage } = calculateRecommendedDeposit(apt, reliability);
      return percentage > 30; // Flag appointments needing higher deposits
    });
  };

  // Categorize clients by reliability
  const categorizeClients = () => {
    const categories = {
      high_risk: clientReliability.filter(cr => cr.reliabilityScore < 30),
      medium_risk: clientReliability.filter(cr => cr.reliabilityScore >= 30 && cr.reliabilityScore < 70),
      low_risk: clientReliability.filter(cr => cr.reliabilityScore >= 70),
    };
    return categories;
  };

  const clientCategories = categorizeClients();
  const appointmentsNeedingAttention = getAppointmentsNeedingAttention();

  const getRiskBadgeColor = (score: number) => {
    if (score < 30) return 'destructive';
    if (score < 70) return 'secondary';
    return 'default';
  };

  const getRiskLabel = (score: number) => {
    if (score < 30) return 'Haut risque';
    if (score < 70) return 'Risque moyen';
    return 'Faible risque';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">Gestion Dynamique des Acomptes</h2>
          <p className="text-gray-600">Système automatique d'ajustement basé sur la fiabilité client</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-white/40">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {clientCategories.high_risk.length}
                </div>
                <div className="text-sm text-gray-600">Clients haut risque</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/40">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {clientCategories.medium_risk.length}
                </div>
                <div className="text-sm text-gray-600">Clients risque moyen</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/40">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {clientCategories.low_risk.length}
                </div>
                <div className="text-sm text-gray-600">Clients fiables</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/40">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-violet-600">
                  {appointmentsNeedingAttention.length}
                </div>
                <div className="text-sm text-gray-600">RDV à ajuster</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Needing Attention */}
      {appointmentsNeedingAttention.length > 0 && (
        <Card className="glass-card border-white/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Rendez-vous nécessitant un acompte majoré
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointmentsNeedingAttention.map((appointment) => {
                const reliability = getClientReliability(appointment.clientId);
                const { percentage, reason } = calculateRecommendedDeposit(appointment, reliability);
                const depositAmount = (appointment.servicePrice * percentage) / 100;

                return (
                  <div key={appointment.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900">
                            {appointment.clientName}
                          </h4>
                          <Badge variant={getRiskBadgeColor(reliability?.reliabilityScore || 100)}>
                            {getRiskLabel(reliability?.reliabilityScore || 100)}
                          </Badge>
                          {appointment.isWeekendPremium && (
                            <Badge variant="outline">Weekend Premium</Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <div className="text-gray-500">Service</div>
                            <div className="font-medium">{appointment.serviceName}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Date</div>
                            <div className="font-medium">
                              {format(new Date(appointment.appointmentDate), 'dd/MM/yyyy', { locale: fr })}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500">Prix service</div>
                            <div className="font-medium">{appointment.servicePrice}€</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Score fiabilité</div>
                            <div className="font-medium">
                              {reliability?.reliabilityScore.toFixed(0) || '100'}/100
                            </div>
                          </div>
                        </div>
                        
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Acompte recommandé: {percentage}% ({depositAmount.toFixed(2)}€)</strong>
                            <br />
                            Raison: {reason}
                          </AlertDescription>
                        </Alert>

                        {reliability && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-2">Historique client:</div>
                            <div className="grid grid-cols-3 gap-4 text-xs">
                              <div>
                                <div className="text-gray-500">Total RDV</div>
                                <div className="font-medium">{reliability.totalAppointments}</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Annulations</div>
                                <div className="font-medium text-red-600">{reliability.totalCancellations}</div>
                              </div>
                              <div>
                                <div className="text-gray-500">No-shows</div>
                                <div className="font-medium text-red-600">{reliability.totalNoShows}</div>
                              </div>
                            </div>
                            {reliability.consecutiveCancellations > 0 && (
                              <div className="mt-2 text-xs text-red-600">
                                {reliability.consecutiveCancellations} annulations consécutives
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4">
                        <Button
                          onClick={() => onUpdateDeposit?.(appointment.id, percentage)}
                          className="glass-button hover:glass-effect text-white bg-violet-600 hover:bg-violet-700"
                        >
                          Appliquer {percentage}%
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Client Reliability Overview */}
      <Card className="glass-card border-white/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Aperçu de la fiabilité clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* High Risk Clients */}
            {clientCategories.high_risk.length > 0 && (
              <div>
                <h4 className="font-medium text-red-600 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Clients haut risque ({clientCategories.high_risk.length})
                </h4>
                <div className="space-y-2">
                  {clientCategories.high_risk.slice(0, 5).map((client) => (
                    <div key={client.clientId} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <div className="font-medium">Client ID: {client.clientId}</div>
                        <div className="text-sm text-gray-600">
                          {client.consecutiveCancellations} annulations consécutives
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive">
                          {client.reliabilityScore.toFixed(0)}/100
                        </Badge>
                        <div className="text-sm text-gray-600">
                          Acompte: {client.customDepositPercentage || '70'}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deposit Rules Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Règles d'acompte automatique</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Nouveaux clients:</span>
                  <span className="font-medium">20%</span>
                </div>
                <div className="flex justify-between">
                  <span>1 annulation récente:</span>
                  <span className="font-medium">50%</span>
                </div>
                <div className="flex justify-between">
                  <span>2+ annulations consécutives:</span>
                  <span className="font-medium text-red-600">70%</span>
                </div>
                <div className="flex justify-between">
                  <span>Score fiabilité &lt; 30:</span>
                  <span className="font-medium text-red-600">70%</span>
                </div>
                <div className="flex justify-between">
                  <span>Créneaux weekend premium:</span>
                  <span className="font-medium">+10% minimum</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}