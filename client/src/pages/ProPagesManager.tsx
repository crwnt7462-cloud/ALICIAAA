import { useState } from 'react';
import { useLocation } from 'wouter';
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
  Globe
} from 'lucide-react';

export default function ProPagesManager() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [bookingUrl] = useState("https://beauty-booking.app/salon/excellence-paris");

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
              onClick={() => setLocation('/pro-dashboard')}
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
                className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-6 py-2 font-medium transition-all hover:scale-105"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Globe className="h-4 w-4" />
                <span>Informations générales</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Settings className="h-4 w-4" />
                <span>Horaires & contact</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <ExternalLink className="h-4 w-4" />
                <span>Photos & description</span>
              </div>
            </div>
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
                  className="rounded-full px-4 py-2 font-medium hover:bg-gray-50 transition-all hover:scale-105"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copier
                </Button>
                <Button
                  onClick={handleModifyBookingPage}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 font-medium transition-all hover:scale-105"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
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

              {/* Options de personnalisation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Settings className="h-4 w-4" />
                  <span>Services affichés</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Globe className="h-4 w-4" />
                  <span>URL personnalisée</span>
                </div>
              </div>
            </div>
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