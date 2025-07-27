import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  ArrowLeft, ChevronDown, ChevronUp, Eye, EyeOff
} from "lucide-react";

export default function SalonBooking() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('partial'); // partial, full, gift
  const [formData, setFormData] = useState({
    staffMember: '',
    phone: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    acceptCGU: false,
    saveCard: false
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Données du salon
  const salon = {
    name: "Bonhomme",
    location: "Paris Archives"
  };

  // Service par défaut
  const service = {
    id: 1,
    name: "Coupe Bonhomme",
    duration: 30,
    price: 39
  };

  // Créneaux horaires disponibles par jour
  const timeSlots = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00'];
  
  // Dates disponibles
  const availableDates = [
    { date: 'lundi 28 juillet', full: 'lundi 28 juillet 2025', expanded: false },
    { date: 'mardi 29 juillet', full: 'mardi 29 juillet 2025', expanded: false },
    { date: 'mercredi 30 juillet', full: 'mercredi 30 juillet 2025', expanded: false },
    { date: 'jeudi 31 juillet', full: 'jeudi 31 juillet 2025', expanded: false },
    { date: 'vendredi 1 août', full: 'vendredi 1 août 2025', expanded: false },
    { date: 'samedi 2 août', full: 'samedi 2 août 2025', expanded: false },
    { date: 'lundi 4 août', full: 'lundi 4 août 2025', expanded: false }
  ];

  // Catégories de services
  const serviceCategories = [
    {
      id: 1,
      name: 'Cheveux',
      expanded: false,
      services: [
        { id: 1, name: 'Coupe Bonhomme', price: '39', duration: '30min' },
        { id: 2, name: 'Coupe Dégradée (Américain & "à blanc")', price: '46', duration: '45min' },
        { id: 3, name: 'Coupe Transformation', price: '45', duration: '45min' },
        { id: 4, name: 'Repigmentation Camo', price: '26', duration: '30min' },
        { id: 5, name: 'Coupe Petit Bonhomme (enfant -12 ans)', price: '25', duration: '30min' },
        { id: 6, name: 'Forfait Cheveux + Barbe', price: '64', duration: '1h' }
      ]
    },
    {
      id: 2,
      name: 'Barbe',
      expanded: false,
      services: [
        { id: 7, name: 'Taille de barbe classique', price: '25', duration: '30min' },
        { id: 8, name: 'Rasage traditionnel', price: '35', duration: '45min' },
        { id: 9, name: 'Barbe + Moustache', price: '30', duration: '35min' }
      ]
    },
    {
      id: 3,
      name: 'Rasage',
      expanded: false,
      services: [
        { id: 10, name: 'Rasage complet', price: '40', duration: '45min' },
        { id: 11, name: 'Rasage + Soins', price: '50', duration: '1h' }
      ]
    },
    {
      id: 4,
      name: 'Permanente & Défrisage',
      expanded: false,
      services: [
        { id: 12, name: 'Permanente homme', price: '80', duration: '2h' },
        { id: 13, name: 'Défrisage', price: '90', duration: '2h30' }
      ]
    },
    {
      id: 5,
      name: 'Épilations Barbiers',
      expanded: false,
      services: [
        { id: 14, name: 'Épilation sourcils', price: '15', duration: '15min' },
        { id: 15, name: 'Épilation nez/oreilles', price: '12', duration: '10min' }
      ]
    },
    {
      id: 6,
      name: 'Soins Barbier',
      expanded: false,
      services: [
        { id: 16, name: 'Soin visage homme', price: '45', duration: '45min' },
        { id: 17, name: 'Masque purifiant', price: '35', duration: '30min' }
      ]
    },
    {
      id: 7,
      name: 'Forfaits',
      expanded: false,
      services: [
        { id: 18, name: 'Forfait Complet', price: '85', duration: '1h30' },
        { id: 19, name: 'Forfait Détente', price: '70', duration: '1h15' }
      ]
    },
    {
      id: 8,
      name: 'Coloration & Décoloration',
      expanded: false,
      services: [
        { id: 20, name: 'Coloration homme', price: '55', duration: '1h' },
        { id: 21, name: 'Décoloration', price: '65', duration: '1h30' }
      ]
    },
    {
      id: 9,
      name: 'SPA DU CHEVEU',
      expanded: false,
      services: [
        { id: 22, name: 'Soin capillaire premium', price: '60', duration: '1h' },
        { id: 23, name: 'Traitement anti-chute', price: '75', duration: '1h15' }
      ]
    }
  ];

  const [dateStates, setDateStates] = useState(availableDates);
  const [categoryStates, setCategoryStates] = useState(serviceCategories);

  const toggleDateExpansion = (index: number) => {
    setDateStates(prev => prev.map((date, i) => 
      i === index ? { ...date, expanded: !date.expanded } : date
    ));
  };

  const toggleCategoryExpansion = (index: number) => {
    setCategoryStates(prev => prev.map((category, i) => 
      i === index ? { ...category, expanded: !category.expanded } : category
    ));
  };

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setCurrentStep(2);
  };

  const handleTimeSlotSelect = (time: string) => {
    setSelectedSlot({ time, date: selectedDate });
    setCurrentStep(3);
  };

  const handleDateSelect = (dateInfo: any) => {
    setSelectedDate(dateInfo.full);
    setSelectedSlot({ date: dateInfo.full, time: '10:00' });
    setCurrentStep(3);
  };

  // Étape 1: Sélection du service avec catégories
  const renderServiceSelection = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Tabs navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex space-x-6">
            <button className="text-black font-medium border-b-2 border-black pb-2">
              Prendre RDV
            </button>
            <button className="text-gray-500 pb-2">Avis</button>  
            <button className="text-gray-500 pb-2">À-propos</button>
            <button className="text-gray-500 pb-2">Offrir</button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Choix de la prestation</h2>
        
        <div className="space-y-3">
          {categoryStates.map((category, index) => (
            <div key={category.id} className="bg-white rounded-lg border border-gray-200">
              <div 
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => toggleCategoryExpansion(index)}
              >
                <span className="font-medium text-gray-900">{category.name}</span>
                {category.expanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
              
              {category.expanded && (
                <div className="border-t border-gray-100">
                  {category.services.map((service) => (
                    <div key={service.id} className="p-4 border-b border-gray-50 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{service.name}</h3>
                          <p className="text-sm text-gray-600">{service.price} € • {service.duration}</p>
                        </div>
                        <Button 
                          onClick={() => handleServiceSelect(service)}
                          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all"
                        >
                          Choisir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Étape 2: Sélection de la date 
  const renderDateSelection = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Tabs navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex space-x-6">
            <button className="text-black font-medium border-b-2 border-black pb-2">
              Prendre RDV
            </button>
            <button className="text-gray-500 pb-2">Avis</button>  
            <button className="text-gray-500 pb-2">À-propos</button>
            <button className="text-gray-500 pb-2">Offrir</button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">1. Prestation sélectionnée</h2>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{selectedService?.name || 'Coupe Bonhomme'}</h3>
                <p className="text-sm text-gray-600">{selectedService?.duration || '30min'} • {selectedService?.price || '39'} €</p>
              </div>
              <Button variant="ghost" className="text-violet-600 text-sm font-medium" onClick={() => setCurrentStep(1)}>
                Supprimer
              </Button>
            </div>

            <Select value={formData.staffMember} onValueChange={(value) => setFormData(prev => ({ ...prev, staffMember: value }))}>
              <SelectTrigger className="w-full mt-3">
                <SelectValue placeholder="Avec qui ?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Peu importe</SelectItem>
                <SelectItem value="marie">Marie</SelectItem>
                <SelectItem value="sophie">Sophie</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={() => toast({ title: "Fonctionnalité", description: "Ajouter une prestation supplémentaire" })}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
        >
          Ajouter une prestation à la suite
        </Button>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">2. Choix de la date & heure</h2>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <span className="font-medium text-gray-900">Lundi 28 juillet</span>
                <ChevronUp className="h-5 w-5 text-gray-400" />
              </div>
              <div className="p-4">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {timeSlots.slice(0, 9).map((time) => (
                    <Button
                      key={time}
                      variant="outline"
                      className="py-2 text-sm border-gray-200 hover:border-violet-600 hover:text-violet-600 rounded-full hover:bg-violet-50 transition-all"
                      onClick={() => handleTimeSlotSelect(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
                <Button variant="ghost" className="w-full text-gray-600 text-sm">
                  Voir plus
                </Button>
              </div>
            </div>

            {dateStates.slice(1).map((dateInfo, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200">
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleDateExpansion(index + 1)}
                >
                  <span className="font-medium text-gray-900 capitalize">{dateInfo.date}</span>
                  {dateInfo.expanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                {dateInfo.expanded && (
                  <div className="p-4 border-t border-gray-100">
                    <div className="grid grid-cols-3 gap-3">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant="outline"
                          className="py-2 text-sm border-gray-200 hover:border-violet-600 hover:text-violet-600 rounded-full hover:bg-violet-50 transition-all"
                          onClick={() => {
                            setSelectedDate(dateInfo.full);
                            handleTimeSlotSelect(time);
                          }}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <Button variant="ghost" className="w-full text-gray-600 text-sm py-3">
              Afficher plus de disponibilités
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Étape 3: Identification
  const renderIdentification = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setCurrentStep(2)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">{salon.name} - {salon.location}</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">1. Prestation sélectionnée</h2>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{service.name}</h3>
                <p className="text-sm text-gray-600">{service.duration}min • {service.price} €</p>
              </div>
              <Button variant="ghost" className="text-violet-600 text-sm font-medium">
                Supprimer
              </Button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">2. Date et heure sélectionnées</h2>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{selectedDate || 'lundi 28 juillet 2025'}</h3>
                <p className="text-sm text-gray-600">à {selectedSlot?.time || '10:00'}</p>
              </div>
              <Button variant="ghost" className="text-violet-600 text-sm font-medium" onClick={() => setCurrentStep(2)}>
                Modifier
              </Button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">3. Identification</h2>
          
          <div className="text-center mb-6">
            <p className="text-gray-900 font-medium">Nouveau sur Planity ?</p>
          </div>

          <Button 
            onClick={() => setCurrentStep(4)}
            variant="outline"
            className="w-full py-3 mb-6 border-violet-300 text-violet-700 font-medium rounded-full hover:bg-violet-50 transition-all"
          >
            Créer mon compte
          </Button>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Téléphone portable <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <div className="flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
                  <span className="text-sm mr-1">🇫🇷</span>
                </div>
                <Input
                  type="tel"
                  placeholder="Entrer votre numéro..."
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="flex-1 rounded-l-none border-l-0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="cgu"
                checked={formData.acceptCGU}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptCGU: checked as boolean }))}
              />
              <label htmlFor="cgu" className="text-sm text-gray-600 leading-4">
                J'accepte les <span className="underline">CGU</span> de Planity.
              </label>
            </div>

            <Button 
              onClick={() => setCurrentStep(5)}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
              disabled={!formData.acceptCGU || !formData.email || !formData.phone || !formData.password}
            >
              Créer mon compte
            </Button>

            <p className="text-xs text-gray-500 text-center leading-4">
              Vos informations sont traitées par Planity, consultez notre{' '}
              <span className="underline">politique de confidentialité</span>. Ce site est protégé
              par reCAPTCHA et est soumis à la{' '}
              <span className="underline">Politique de Confidentialité</span> et aux{' '}
              <span className="underline">Conditions d'Utilisation</span> de Google.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Étape 4: Finalisation inscription
  const renderAccountCompletion = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setCurrentStep(3)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">{salon.name} - {salon.location}</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Terminer mon inscription</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Prénom <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Agash"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Nom <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Nathan"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full"
              />
            </div>

            <Button 
              onClick={() => setCurrentStep(6)}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
              disabled={!formData.firstName || !formData.lastName}
            >
              Confirmer mon inscription
            </Button>

            <Button variant="ghost" className="w-full text-gray-600 text-sm">
              Se déconnecter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Étape 5: Paiement
  const renderPayment = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setCurrentStep(4)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">{salon.name} - {salon.location}</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">4. Moyen de paiement</h2>
          
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">Comment souhaitez-vous payer ?</h3>
            
            <div className="space-y-3">
              <label className="flex items-start space-x-3">
                <input 
                  type="radio" 
                  name="payment" 
                  value="partial"
                  checked={paymentMethod === 'partial'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900">Payer une partie maintenant, le reste sur place</div>
                  <div className="text-sm text-gray-600">
                    Payer une partie {Math.round(service.price * 0.5)} € maintenant puis le reste {Math.round(service.price * 0.5)} € sur place.
                  </div>
                </div>
              </label>

              <label className="flex items-start space-x-3">
                <input 
                  type="radio" 
                  name="payment" 
                  value="full"
                  checked={paymentMethod === 'full'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div>
                  <div className="font-medium text-gray-900">Payer la totalité</div>
                  <div className="text-sm text-gray-600">
                    Payer maintenant le montant total {service.price},00 € de votre réservation.
                  </div>
                </div>
              </label>

              <label className="flex items-start space-x-3">
                <input 
                  type="radio" 
                  name="payment" 
                  value="gift"
                  checked={paymentMethod === 'gift'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div>
                  <div className="font-medium text-gray-900">Payer avec une carte cadeau</div>
                  <div className="text-sm text-gray-600">
                    La carte cadeau ne sera pas prélevée maintenant, vous paierez avec sur place.
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-900">{service.name}</span>
              <span className="text-gray-900">{service.price},00 €</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">{service.price},00 €</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between">
                <span className="text-gray-900">À régler maintenant</span>
                <span className="text-gray-900">{Math.round(service.price * 0.5)},50 €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-900">À régler sur place</span>
                <span className="text-gray-900">{Math.round(service.price * 0.5)},50 €</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-2">Politique d'annulation</h4>
            <p className="text-sm text-gray-600">
              Vous pouvez annuler gratuitement votre réservation jusqu'au 28 juillet à 08:00, et être remboursé de la
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Étape 6: Formulaire de paiement
  const renderPaymentForm = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setCurrentStep(5)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">{salon.name} - {salon.location}</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-2">Politique d'annulation</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            Vous pouvez annuler gratuitement votre réservation jusqu'au 28 juillet à 08:00, et être remboursé de la
            totalité du montant. Passé cette date, l'acompte ne sera plus remboursable.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            En cas de non présentation au rendez-vous, l'acompte ne sera pas remboursé.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex space-x-3">
            <Button
              variant={paymentMethod === 'card' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('card')}
              className="flex-1 py-3 border-violet-200 text-violet-700 bg-violet-50"
            >
              💳 Carte bancaire
            </Button>
            <Button
              variant={paymentMethod === 'apple' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('apple')}
              className="flex-1 py-3"
            >
              🍎 Apple Pay
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Numéro de carte</label>
            <div className="relative">
              <Input
                type="text"
                placeholder="1234 1234 1234 1234"
                className="w-full pr-16"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-1">
                <div className="w-6 h-4 bg-blue-600 rounded text-xs text-white flex items-center justify-center font-bold">VISA</div>
                <div className="w-6 h-4 bg-red-500 rounded"></div>
                <div className="w-6 h-4 bg-blue-500 rounded"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Date d'expiration</label>
              <Input type="text" placeholder="MM / AA" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Code de sécurité</label>
              <div className="relative">
                <Input type="text" placeholder="CVC" className="pr-10" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 border border-gray-300 rounded px-1">123</div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Pays</label>
            <Select defaultValue="france">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="france">France</SelectItem>
                <SelectItem value="belgique">Belgique</SelectItem>
                <SelectItem value="suisse">Suisse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Sauvegarder la carte pour les futures réservations ?</h4>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name="saveCard" 
                  value="yes"
                  checked={formData.saveCard === true}
                  onChange={() => setFormData(prev => ({ ...prev, saveCard: true }))}
                />
                <span className="text-sm text-gray-700">Oui</span>
              </label>
              <label className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name="saveCard" 
                  value="no"
                  checked={formData.saveCard === false}
                  onChange={() => setFormData(prev => ({ ...prev, saveCard: false }))}
                />
                <span className="text-sm text-gray-700">Non</span>
              </label>
            </div>
          </div>

          <Button 
            onClick={() => {
              toast({
                title: 'Réservation confirmée !',
                description: 'Votre rendez-vous a été enregistré avec succès.',
              });
              setLocation('/');
            }}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
          >
            Confirmer la réservation
          </Button>
        </div>
      </div>
    </div>
  );

  // Navigation entre les étapes
  switch (currentStep) {
    case 1:
      return renderServiceSelection();
    case 2:
      return renderDateSelection();
    case 3:
      return renderIdentification();
    case 4:
      return renderAccountCompletion();
    case 5:
      return renderPayment();
    case 6:
      return renderPaymentForm();
    default:
      return renderServiceSelection();
  }
}