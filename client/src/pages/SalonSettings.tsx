import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Building2, MapPin, Clock, Phone, Mail, Save } from 'lucide-react';

export default function SalonSettings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [salonData, setSalonData] = useState({
    name: "Excellence Beauty Paris",
    address: "123 Avenue des Champs-Élysées, 75008 Paris",
    phone: "01 42 00 00 00",
    email: "contact@excellence-beauty.fr",
    description: "Salon de beauté premium au cœur de Paris, spécialisé dans les soins capillaires et esthétiques depuis 15 ans.",
    hours: {
      lundi: "9h00 - 19h00",
      mardi: "9h00 - 19h00",
      mercredi: "9h00 - 19h00",
      jeudi: "9h00 - 20h00",
      vendredi: "9h00 - 20h00",
      samedi: "9h00 - 18h00",
      dimanche: "Fermé"
    }
  });

  const handleSave = () => {
    toast({
      title: "Modifications sauvegardées",
      description: "Les informations de votre salon ont été mises à jour",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setLocation('/pro-pages')}
                className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Configuration du Salon</h1>
                <p className="text-gray-600">Modifiez les informations publiques de votre établissement</p>
              </div>
            </div>
            <Button onClick={handleSave} className="bg-violet-600 hover:bg-violet-700 text-white rounded-full">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Informations générales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Informations générales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom du salon</Label>
                <Input
                  id="name"
                  value={salonData.name}
                  onChange={(e) => setSalonData({ ...salonData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={salonData.phone}
                  onChange={(e) => setSalonData({ ...salonData, phone: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={salonData.email}
                onChange={(e) => setSalonData({ ...salonData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="address">Adresse complète</Label>
              <Input
                id="address"
                value={salonData.address}
                onChange={(e) => setSalonData({ ...salonData, address: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={salonData.description}
                onChange={(e) => setSalonData({ ...salonData, description: e.target.value })}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Horaires */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horaires d'ouverture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(salonData.hours).map(([day, hours]) => (
                <div key={day} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium capitalize">{day}</div>
                  <Input
                    value={hours}
                    onChange={(e) => setSalonData({
                      ...salonData,
                      hours: { ...salonData.hours, [day]: e.target.value }
                    })}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-8">
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder les modifications
          </Button>
        </div>
      </div>
    </div>
  );
}