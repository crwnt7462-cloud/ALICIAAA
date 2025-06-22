import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share, Copy, QrCode, MessageCircle, Mail, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ShareBooking() {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  // Utiliser l'ID de l'utilisateur connecté pour générer le lien unique
  const salonId = "demo-user"; // À récupérer depuis l'auth plus tard
  const bookingUrl = `${window.location.origin}/book/${salonId}`;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(bookingUrl);
      setCopied(true);
      toast({
        title: "Lien copié",
        description: "Le lien de réservation a été copié dans le presse-papiers",
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive",
      });
    }
  };

  const shareViaWhatsApp = () => {
    const message = encodeURIComponent(`Prenez rendez-vous facilement en ligne : ${bookingUrl}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Prise de rendez-vous en ligne');
    const body = encodeURIComponent(`Bonjour,\n\nVous pouvez prendre rendez-vous directement en ligne via ce lien :\n${bookingUrl}\n\nÀ bientôt !`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-gray-50/50 to-purple-50/30 min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Partager le lien de réservation</h1>
          <p className="text-gray-600 mt-1 text-xs">
            Partagez ce lien avec vos clients pour qu'ils puissent réserver en ligne
          </p>
        </div>
      </div>

      {/* Lien de réservation */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Share className="w-5 h-5 text-purple-600" />
            Lien de réservation public
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="bookingUrl" className="text-sm font-medium">URL de réservation</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="bookingUrl"
                value={bookingUrl}
                readOnly
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={copyToClipboard}
                className={`px-3 ${copied ? 'bg-green-600' : 'gradient-bg'} text-white`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
            <strong>Comment ça marche :</strong>
            <ul className="mt-1 space-y-1">
              <li>• Vos clients accèdent au lien depuis n'importe quel appareil</li>
              <li>• Ils choisissent leur service et créneau</li>
              <li>• Ils remplissent leurs informations</li>
              <li>• Ils paient un acompte de 30% sécurisé</li>
              <li>• Le rendez-vous est confirmé automatiquement</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Options de partage */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Partager rapidement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            className="w-full justify-start bg-green-600 hover:bg-green-700 text-white rounded-xl py-3"
            onClick={shareViaWhatsApp}
          >
            <MessageCircle className="w-4 h-4 mr-3" />
            Partager via WhatsApp
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl py-3"
            onClick={shareViaEmail}
          >
            <Mail className="w-4 h-4 mr-3" />
            Partager par email
          </Button>
        </CardContent>
      </Card>

      {/* QR Code */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <QrCode className="w-5 h-5 text-purple-600" />
            QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center mx-auto">
            <div className="text-center">
              <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">QR Code généré automatiquement</p>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            Affichez ce QR code dans votre salon pour que vos clients puissent réserver facilement
          </p>
          <Button variant="outline" className="w-full">
            Télécharger le QR Code
          </Button>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Statistiques de réservation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">24</p>
              <p className="text-xs text-gray-600">Réservations ce mois</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">680€</p>
              <p className="text-xs text-gray-600">Acomptes reçus</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">92%</p>
              <p className="text-xs text-gray-600">Taux de conversion</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">4.8/5</p>
              <p className="text-xs text-gray-600">Satisfaction client</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}