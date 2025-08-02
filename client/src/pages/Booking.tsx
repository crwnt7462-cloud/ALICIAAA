import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, User, Phone, Mail, CreditCard, Check, ArrowLeft, ChevronRight } from 'lucide-react';
import { getGenericGlassButton } from '@/lib/salonColors';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function Booking() {
 const [currentStep, setCurrentStep] = useState(1);
 const [selectedService, setSelectedService] = useState<any>(null);
 const [selectedSlot, setSelectedSlot] = useState<any>(null);
 const [formData, setFormData] = useState({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  notes: ''
 });

 const { toast } = useToast();
 const queryClient = useQueryClient();

 const { data: services = [] } = useQuery<any[]>({
  queryKey: ['/api/services'],
 });

 // Créneaux disponibles (simulés)
 const availableSlots = [
  { date: '2024-01-27', time: '09:00', available: true },
  { date: '2024-01-27', time: '10:30', available: true },
  { date: '2024-01-27', time: '14:00', available: true },
  { date: '2024-01-27', time: '15:30', available: false },
  { date: '2024-01-27', time: '17:00', available: true },
  { date: '2024-01-28', time: '09:00', available: true },
  { date: '2024-01-28', time: '11:00', available: true },
  { date: '2024-01-28', time: '14:30', available: true },
  { date: '2024-01-28', time: '16:00', available: true },
 ];

 const bookingMutation = useMutation({
  mutationFn: (bookingData: any) => apiRequest('/api/appointments', {
   method: 'POST',
   body: JSON.stringify(bookingData),
  }),
  onSuccess: () => {
   toast({
    title: 'Réservation confirmée !',
    description: 'Votre rendez-vous a été enregistré avec succès.',
   });
   queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
   setCurrentStep(4); // Étape de confirmation
  },
  onError: () => {
   toast({
    title: 'Erreur',
    description: 'Une erreur est survenue lors de la réservation.',
    variant: 'destructive',
   });
  },
 });

 const handleServiceSelect = (service: any) => {
  setSelectedService(service);
  setCurrentStep(2);
 };

 const handleSlotSelect = (slot: any) => {
  setSelectedSlot(slot);
  setCurrentStep(3);
 };

 const handleBookingSubmit = () => {
  const bookingData = {
   serviceId: selectedService.id,
   date: selectedSlot.date,
   time: selectedSlot.time,
   clientInfo: formData,
   totalPrice: selectedService.price,
   deposit: Math.round(selectedService.price * 0.3),
  };

  bookingMutation.mutate(bookingData);
 };

 const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { 
   weekday: 'long', 
   day: 'numeric', 
   month: 'long' 
  });
 };

 return (
  <div className="min-h-screen bg-gray-50">
   {/* Header */}
   <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
    <div className="max-w-2xl mx-auto px-4 py-4">
     <div className="flex items-center gap-4">
      <Button
       variant="ghost"
       size="icon"
       onClick={() => window.history.back()}
       className="h-10 w-10 rounded-full"
      >
       <ArrowLeft className="h-4 w-4" />
      </Button>
      <div>
       <h1 className="text-xl font-semibold text-gray-900">
        Réserver un rendez-vous
       </h1>
       <p className="text-sm text-gray-600">Salon Excellence Paris</p>
      </div>
     </div>

     {/* Progress bar */}
     <div className="flex items-center mt-6 mb-2">
      {[1, 2, 3, 4].map((step) => (
       <div key={step} className="flex items-center flex-1">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
         currentStep >= step 
          ? 'bg-gray-900 text-white' 
          : 'bg-gray-200 text-gray-500'
        }`}>
         {currentStep > step ? <Check className="h-4 w-4" /> : step}
        </div>
        {step < 4 && (
         <div className={`flex-1 h-1 mx-2 ${
          currentStep > step ? 'bg-gray-900' : 'bg-gray-200'
         }`} />
        )}
       </div>
      ))}
     </div>

     <div className="flex justify-between text-xs text-gray-500">
      <span>Service</span>
      <span>Créneau</span>
      <span>Informations</span>
      <span>Confirmation</span>
     </div>
    </div>
   </div>

   <div className="max-w-2xl mx-auto px-4 py-6">
    {/* Étape 1: Sélection du service */}
    {currentStep === 1 && (
     <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
       Choisissez votre prestation
      </h2>
      
      {services.map((service) => (
       <Card 
        key={service.id}
        className="border border-gray-200 hover:border-gray-300 cursor-pointer transition-all"
        onClick={() => handleServiceSelect(service)}
       >
        <CardContent className="p-4">
         <div className="flex justify-between items-start">
          <div className="flex-1">
           <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
           <p className="text-sm text-gray-600 mb-2">{service.description}</p>
           <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
             <Clock className="h-3 w-3" />
             <span>{service.duration} min</span>
            </div>
           </div>
          </div>
          <div className="text-right">
           <div className="text-lg font-semibold text-gray-900">{service.price}€</div>
           <div className="text-xs text-gray-500">Acompte: {Math.round(service.price * 0.3)}€</div>
          </div>
         </div>
        </CardContent>
       </Card>
      ))}
     </div>
    )}

    {/* Étape 2: Sélection du créneau */}
    {currentStep === 2 && selectedService && (
     <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
       <Button
        variant="ghost"
        size="sm"
        onClick={() => setCurrentStep(1)}
       >
        <ArrowLeft className="h-4 w-4" />
       </Button>
       <div>
        <h2 className="text-lg font-semibold text-gray-900">
         Choisissez votre créneau
        </h2>
        <p className="text-sm text-gray-600">{selectedService.name} - {selectedService.price}€</p>
       </div>
      </div>

      <div className="space-y-6">
       {Object.entries(
        availableSlots.reduce((acc: any, slot) => {
         if (!acc[slot.date]) acc[slot.date] = [];
         acc[slot.date].push(slot);
         return acc;
        }, {})
       ).map(([date, slots]: [string, any]) => (
        <div key={date}>
         <h3 className="font-medium text-gray-900 mb-3">
          {formatDate(date)}
         </h3>
         <div className="grid grid-cols-3 gap-2">
          {slots.map((slot: any) => (
           <Button
            key={`${slot.date}-${slot.time}`}
            variant={slot.available ? "outline" : "ghost"}
            disabled={!slot.available}
            onClick={() => slot.available && handleSlotSelect(slot)}
            className={`h-12 ${
             slot.available 
              ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50' 
              : 'text-gray-400 cursor-not-allowed'
            }`}
           >
            {slot.time}
           </Button>
          ))}
         </div>
        </div>
       ))}
      </div>
     </div>
    )}

    {/* Étape 3: Informations client */}
    {currentStep === 3 && selectedService && selectedSlot && (
     <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
       <Button
        variant="ghost"
        size="sm"
        onClick={() => setCurrentStep(2)}
       >
        <ArrowLeft className="h-4 w-4" />
       </Button>
       <div>
        <h2 className="text-lg font-semibold text-gray-900">
         Vos informations
        </h2>
        <p className="text-sm text-gray-600">
         {formatDate(selectedSlot.date)} à {selectedSlot.time}
        </p>
       </div>
      </div>

      <Card>
       <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
         <div>
          <Label htmlFor="firstName">Prénom *</Label>
          <Input
           id="firstName"
           value={formData.firstName}
           onChange={(e) => setFormData({...formData, firstName: e.target.value})}
           placeholder="Votre prénom"
           className="mt-1"
          />
         </div>
         <div>
          <Label htmlFor="lastName">Nom *</Label>
          <Input
           id="lastName"
           value={formData.lastName}
           onChange={(e) => setFormData({...formData, lastName: e.target.value})}
           placeholder="Votre nom"
           className="mt-1"
          />
         </div>
        </div>

        <div>
         <Label htmlFor="email">Email *</Label>
         <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="votre@email.com"
          className="mt-1"
         />
        </div>

        <div>
         <Label htmlFor="phone">Téléphone *</Label>
         <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          placeholder="06 12 34 56 78"
          className="mt-1"
         />
        </div>

        <div>
         <Label htmlFor="notes">Notes (optionnel)</Label>
         <Input
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="Informations complémentaires..."
          className="mt-1"
         />
        </div>

        <Button
         onClick={handleBookingSubmit}
         disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone || bookingMutation.isPending}
         className="w-full mt-6 h-12 bg-gray-900 hover:bg-gray-800"
        >
         {bookingMutation.isPending ? 'Réservation...' : 'Confirmer la réservation'}
        </Button>
       </CardContent>
      </Card>
     </div>
    )}

    {/* Étape 4: Confirmation */}
    {currentStep === 4 && (
     <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
       <Check className="h-8 w-8 text-green-600" />
      </div>
      <div>
       <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Réservation confirmée !
       </h2>
       <p className="text-gray-600">
        Vous recevrez un email de confirmation sous peu.
       </p>
      </div>

      <Card>
       <CardContent className="p-6 text-left">
        <h3 className="font-semibold text-gray-900 mb-4">Récapitulatif</h3>
        <div className="space-y-2 text-sm">
         <div className="flex justify-between">
          <span>Service:</span>
          <span>{selectedService?.name}</span>
         </div>
         <div className="flex justify-between">
          <span>Date:</span>
          <span>{formatDate(selectedSlot?.date)} à {selectedSlot?.time}</span>
         </div>
         <div className="flex justify-between">
          <span>Prix:</span>
          <span>{selectedService?.price}€</span>
         </div>
         <div className="flex justify-between font-semibold">
          <span>Acompte payé:</span>
          <span>{Math.round(selectedService?.price * 0.3)}€</span>
         </div>
        </div>
       </CardContent>
      </Card>

      <Button
       onClick={() => window.history.back()}
       className="w-full"
      >
       Retour à l'accueil
      </Button>
     </div>
    )}
   </div>
  </div>
 );
}