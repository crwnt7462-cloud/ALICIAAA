import { ArrowLeft, Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message envoyé",
      description: "Nous vous répondrons dans les plus brefs délais"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Contact</h1>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations de contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-violet-600" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-gray-600">support@rendly.fr</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-violet-600" />
              <div>
                <p className="font-medium">Téléphone</p>
                <p className="text-sm text-gray-600">01 23 45 67 89</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-violet-600" />
              <div>
                <p className="font-medium">Adresse</p>
                <p className="text-sm text-gray-600">123 Rue de la Tech, Paris</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-violet-600" />
              <div>
                <p className="font-medium">Horaires</p>
                <p className="text-sm text-gray-600">Lun-Ven 9h-18h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Envoyez-nous un message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nom</Label>
                <Input placeholder="Votre nom" required />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="votre@email.com" required />
              </div>
              <div>
                <Label>Sujet</Label>
                <Input placeholder="Sujet de votre message" required />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea placeholder="Votre message..." required />
              </div>
              <Button type="submit" className="w-full gradient-bg">
                Envoyer le message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}