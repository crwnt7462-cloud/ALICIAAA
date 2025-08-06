import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Calendar,
  Clock,
  Users,
  MapPin,
  Star,
  Settings,
  Palette
} from 'lucide-react';

interface SalonBookingData {
  salonName: string;
  location: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  professionals: Professional[];
  timeSlots: string[];
  availableDates: DateInfo[];
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
}

interface Professional {
  id: number;
  name: string;
  specialties: string[];
  rating: number;
  nextSlot: string;
  image: string;
}

interface DateInfo {
  date: string;
  full: string;
  expanded: boolean;
}

export default function SalonBookingEditor() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const [salonData, setSalonData] = useState<SalonBookingData>({
    salonName: "",
    location: "",
    serviceName: "",
    servicePrice: 0,
    serviceDuration: 0,
    professionals: [],
    timeSlots: [],
    availableDates: [],
    primaryColor: '',
    backgroundColor: '',
    textColor: ''
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simuler une sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Page sauvegardée !",
        description: "Les modifications de la page salon-booking ont été enregistrées avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur de sauvegarde",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addProfessional = () => {
    const newPro: Professional = {
      id: Date.now(),
      name: "Nouveau Professionnel",
      specialties: ["Service"],
      rating: 4.5,
      nextSlot: "Demain 9:00",
      image: "👤"
    };
    setSalonData(prev => ({
      ...prev,
      professionals: [...prev.professionals, newPro]
    }));
  };

  const updateProfessional = (id: number, field: string, value: any) => {
    setSalonData(prev => ({
      ...prev,
      professionals: prev.professionals.map(pro => 
        pro.id === id ? { ...pro, [field]: value } : pro
      )
    }));
  };

  const removeProfessional = (id: number) => {
    setSalonData(prev => ({
      ...prev,
      professionals: prev.professionals.filter(pro => pro.id !== id)
    }));
  };

  const addTimeSlot = () => {
    const newSlot = "15:00";
    setSalonData(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, newSlot]
    }));
  };

  const updateTimeSlot = (index: number, value: string) => {
    setSalonData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map((slot, i) => i === index ? value : slot)
    }));
  };

  const removeTimeSlot = (index: number) => {
    setSalonData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
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
                <h1 className="text-2xl font-bold text-gray-900">Éditeur Page Salon-Booking</h1>
                <p className="text-gray-600">Personnalisez votre page de réservation unifiée</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => window.open('/salon-booking', '_blank')}
                className="rounded-full px-4 py-2 font-medium"
              >
                <Eye className="h-4 w-4 mr-2" />
                Prévisualiser
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-6 py-2 font-medium"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Navigation par onglets */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'general' 
                ? 'bg-white text-violet-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="h-4 w-4 mr-2 inline" />
            Général
          </button>
          <button
            onClick={() => setActiveTab('professionals')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'professionals' 
                ? 'bg-white text-violet-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="h-4 w-4 mr-2 inline" />
            Professionnels
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'schedule' 
                ? 'bg-white text-violet-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Clock className="h-4 w-4 mr-2 inline" />
            Planning
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'design' 
                ? 'bg-white text-violet-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Palette className="h-4 w-4 mr-2 inline" />
            Design
          </button>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations du salon */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-violet-600" />
                  Informations du Salon
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="salonName">Nom du salon</Label>
                  <Input
                    id="salonName"
                    value={salonData.salonName}
                    onChange={(e) => setSalonData(prev => ({ ...prev, salonName: e.target.value }))}
                    placeholder="Nom du salon"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Localisation</Label>
                  <Input
                    id="location"
                    value={salonData.location}
                    onChange={(e) => setSalonData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Adresse du salon"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Service par défaut */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-violet-600" />
                  Service par Défaut
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="serviceName">Nom du service</Label>
                  <Input
                    id="serviceName"
                    value={salonData.serviceName}
                    onChange={(e) => setSalonData(prev => ({ ...prev, serviceName: e.target.value }))}
                    placeholder="Nom du service"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="servicePrice">Prix (€)</Label>
                    <Input
                      id="servicePrice"
                      type="number"
                      value={salonData.servicePrice}
                      onChange={(e) => setSalonData(prev => ({ ...prev, servicePrice: parseInt(e.target.value) }))}
                      placeholder="Prix"
                    />
                  </div>
                  <div>
                    <Label htmlFor="serviceDuration">Durée (min)</Label>
                    <Input
                      id="serviceDuration"
                      type="number"
                      value={salonData.serviceDuration}
                      onChange={(e) => setSalonData(prev => ({ ...prev, serviceDuration: parseInt(e.target.value) }))}
                      placeholder="Durée"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'professionals' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-violet-600" />
                  Professionnels
                </CardTitle>
                <Button onClick={addProfessional} className="bg-violet-600 hover:bg-violet-700">
                  Ajouter un professionnel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salonData.professionals.map((pro) => (
                  <div key={pro.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Professionnel #{pro.id}</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeProfessional(pro.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Supprimer
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nom</Label>
                        <Input
                          value={pro.name}
                          onChange={(e) => updateProfessional(pro.id, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Spécialités (séparées par des virgules)</Label>
                        <Input
                          value={pro.specialties.join(', ')}
                          onChange={(e) => updateProfessional(pro.id, 'specialties', e.target.value.split(', '))}
                        />
                      </div>
                      <div>
                        <Label>Note (sur 5)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={pro.rating}
                          onChange={(e) => updateProfessional(pro.id, 'rating', parseFloat(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Prochain créneau</Label>
                        <Input
                          value={pro.nextSlot}
                          onChange={(e) => updateProfessional(pro.id, 'nextSlot', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'schedule' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-violet-600" />
                  Créneaux Horaires
                </CardTitle>
                <Button onClick={addTimeSlot} className="bg-violet-600 hover:bg-violet-700">
                  Ajouter un créneau
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {salonData.timeSlots.map((slot, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={slot}
                      onChange={(e) => updateTimeSlot(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeTimeSlot(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'design' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-violet-600" />
                Personnalisation du Design
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Couleur principale</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={salonData.primaryColor}
                      onChange={(e) => setSalonData(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-12 h-10 p-1 rounded"
                    />
                    <Input
                      value={salonData.primaryColor}
                      onChange={(e) => setSalonData(prev => ({ ...prev, primaryColor: e.target.value }))}
                      placeholder="#7c3aed"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="backgroundColor">Couleur de fond</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={salonData.backgroundColor}
                      onChange={(e) => setSalonData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-12 h-10 p-1 rounded"
                    />
                    <Input
                      value={salonData.backgroundColor}
                      onChange={(e) => setSalonData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="textColor">Couleur du texte</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="textColor"
                      type="color"
                      value={salonData.textColor}
                      onChange={(e) => setSalonData(prev => ({ ...prev, textColor: e.target.value }))}
                      className="w-12 h-10 p-1 rounded"
                    />
                    <Input
                      value={salonData.textColor}
                      onChange={(e) => setSalonData(prev => ({ ...prev, textColor: e.target.value }))}
                      placeholder="#1f2937"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Aperçu des couleurs */}
              <div className="border rounded-lg p-4" style={{ backgroundColor: salonData.backgroundColor }}>
                <h3 className="text-lg font-semibold mb-2" style={{ color: salonData.textColor }}>
                  Aperçu des couleurs
                </h3>
                <div className="space-y-2">
                  <p style={{ color: salonData.textColor }}>
                    Texte normal avec la couleur sélectionnée
                  </p>
                  <Button 
                    className="text-white font-medium"
                    style={{ backgroundColor: salonData.primaryColor }}
                  >
                    Bouton avec couleur principale
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}