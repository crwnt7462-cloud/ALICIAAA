import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Building2, 
  Calendar,
  Edit3,
  Copy,
  ExternalLink,
  Settings,
  Globe,
  Loader2
} from 'lucide-react';

export default function ProPagesManager() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Récupérer les données utilisateur (informations du salon)
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['/api/auth/user']
  });

  // Récupérer la page de réservation existante
  const { data: bookingPageData, isLoading: bookingLoading } = useQuery({
    queryKey: ['/api/booking-pages/current'],
    enabled: !!userData
  });

  const bookingUrl = (bookingPageData as any)?.pageUrl ? 
    `${window.location.origin}/booking/${(bookingPageData as any).pageUrl}` : 
    `${window.location.origin}/booking/salon-${(userData as any)?.id || 'default'}`;

  const handleCopyBookingUrl = () => {
    navigator.clipboard.writeText(bookingUrl);
    toast({
      title: "Lien copié",
      description: "Le lien de réservation a été copié dans le presse-papiers",
    });
  };

  const handleModifySalonPage = () => {
    // Redirection vers la page de modification du salon
    setLocation('/salon-settings');
  };

  const handleModifyBookingPage = () => {
    // Redirection vers la page de personnalisation de réservation
    setLocation('/booking-customization');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/business-features')}
              className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Pages</h1>
              <p className="text-gray-600">Gérez vos pages publiques et de réservation</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* État de chargement */}
        {(userLoading || bookingLoading) && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
            <span className="ml-2 text-gray-600">Chargement des données...</span>
          </div>
        )}

        {/* Page du Salon */}
        <Card className="border-l-4 border-l-violet-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900">Page du Salon</CardTitle>
                  <p className="text-gray-600 mt-1">Modifiez les infos publiques de votre établissement</p>
                </div>
              </div>
              <Button
                onClick={handleModifySalonPage}
                disabled={userLoading}
                className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-6 py-2 font-medium transition-all hover:scale-105 disabled:opacity-50"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {userData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Building2 className="h-4 w-4 text-violet-600" />
                    <span className="font-medium">Nom:</span>
                    <span>{(userData as any)?.businessName || 'Non défini'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Globe className="h-4 w-4 text-violet-600" />
                    <span className="font-medium">Adresse:</span>
                    <span>{(userData as any)?.address || 'Non définie'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Settings className="h-4 w-4 text-violet-600" />
                    <span className="font-medium">Téléphone:</span>
                    <span>{(userData as any)?.phone || 'Non défini'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <ExternalLink className="h-4 w-4 text-violet-600" />
                    <span className="font-medium">Email:</span>
                    <span>{(userData as any)?.email || 'Non défini'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">Chargement des informations du salon...</div>
            )}
          </CardContent>
        </Card>

        {/* Page de Réservation */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900">Page de Réservation</CardTitle>
                  <p className="text-gray-600 mt-1">Personnalisez votre lien de réservation en ligne</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCopyBookingUrl}
                  variant="outline"
                  disabled={bookingLoading}
                  className="rounded-full px-4 py-2 font-medium hover:bg-gray-50 transition-all hover:scale-105 disabled:opacity-50"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copier
                </Button>
                <Button
                  onClick={handleModifyBookingPage}
                  disabled={bookingLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 font-medium transition-all hover:scale-105 disabled:opacity-50"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {bookingPageData ? (
              <div className="space-y-4">
                {/* URL de réservation */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Lien de réservation</p>
                      <p className="text-blue-600 font-mono text-sm break-all">{bookingUrl}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(bookingUrl, '_blank')}
                      className="ml-4 rounded-full hover:bg-gray-100"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Informations de la page */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Nom affiché:</span>
                    <span>{(bookingPageData as any)?.salonName || 'Salon Beautiful'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Settings className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Services:</span>
                    <span>{(bookingPageData as any)?.selectedServices?.length || 0} service(s)</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Statut:</span>
                    <span className={(bookingPageData as any)?.isPublished ? "text-green-600" : "text-orange-600"}>
                      {(bookingPageData as any)?.isPublished ? "Publié" : "Brouillon"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <ExternalLink className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Vues:</span>
                    <span>{(bookingPageData as any)?.views || 0}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">Chargement des données de réservation...</div>
            )}
          </CardContent>
        </Card>

        {/* Informations complémentaires */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <ExternalLink className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Partage et intégration</h3>
              <p className="text-blue-700 text-sm mt-1">
                Utilisez votre lien de réservation sur vos réseaux sociaux, site web, ou cartes de visite pour permettre à vos clients de réserver directement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}