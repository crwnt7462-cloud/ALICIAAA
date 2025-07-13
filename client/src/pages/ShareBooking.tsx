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