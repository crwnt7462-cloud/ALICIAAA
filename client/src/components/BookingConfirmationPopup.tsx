import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard } from 'lucide-react';

interface BookingDetails {
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  appointmentDate: string;
  appointmentTime: string;
  staffName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  depositRequired: number;
  isWeekendPremium?: boolean;
  discount?: number;
}

interface SalonInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  rating?: number;
  reviewCount?: number;
  website?: string;
  policies: {
    cancellation: string;
    lateness: string;
    deposit: string;
    rescheduling: string;
  };
  openingHours: Record<string, string>;
}

interface BookingConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookingDetails: BookingDetails;
  salonInfo: SalonInfo;
  isLoading?: boolean;
}

export default function BookingConfirmationPopup({
  isOpen,
  onClose,
  onConfirm,
  bookingDetails,
  salonInfo,
  isLoading = false
}: BookingConfirmationPopupProps) {
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);

  const finalPrice = bookingDetails.servicePrice - (bookingDetails.discount || 0);
  const depositAmount = bookingDetails.depositRequired || 0;

  // Fonction de formatage date sécurisée
  const formatDateForDisplay = () => {
    try {
      if (bookingDetails.appointmentDate && bookingDetails.appointmentTime) {
        // Si la date est déjà au format français
        if (bookingDetails.appointmentDate.includes('juillet') || bookingDetails.appointmentDate.includes('janvier')) {
          return bookingDetails.appointmentDate;
        }
        return bookingDetails.appointmentDate;
      }
      return bookingDetails.appointmentDate || 'Date à définir';
    } catch (error) {
      return bookingDetails.appointmentDate || 'Date à définir';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg border-0 bg-white/95 backdrop-blur-xl shadow-2xl p-0 gap-0 rounded-2xl">
        {/* Header moderne */}
        <div className="px-6 py-5 border-b border-gray-100">
          <DialogTitle className="text-center text-xl font-semibold text-gray-900">
            Confirmation de réservation
          </DialogTitle>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Récapitulatif principal */}
          <div className="bg-gray-50/80 rounded-xl p-5 text-center border-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{bookingDetails.serviceName}</h3>
            <div className="space-y-1 text-gray-600 mb-4">
              <p className="text-base">{formatDateForDisplay()}</p>
              <p className="text-base">à {bookingDetails.appointmentTime}</p>
              <p className="text-sm">avec {bookingDetails.staffName}</p>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-2xl font-bold text-gray-900">{bookingDetails.servicePrice}€</p>
              {depositAmount > 0 && (
                <p className="text-sm text-gray-500 mt-1">Acompte requis: {depositAmount}€</p>
              )}
            </div>
          </div>

          {/* Salon */}
          <div className="bg-gray-50/80 rounded-xl p-4 border-0">
            <h4 className="font-semibold text-gray-900 mb-1">{salonInfo.name}</h4>
            <p className="text-sm text-gray-600">{salonInfo.address}</p>
          </div>

          {/* Conditions simples */}
          <div className="bg-amber-50/80 rounded-xl p-4 border-0">
            <h5 className="font-medium text-gray-900 mb-2">Conditions importantes</h5>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• Annulation gratuite jusqu'à 24h avant</p>
              <p>• Retard de +15min = annulation automatique</p>
              {depositAmount > 0 && <p>• Acompte de {depositAmount}€ requis pour confirmer</p>}
            </div>
          </div>

          {/* Case à cocher obligatoire */}
          <div className="flex items-start space-x-3 p-4 bg-blue-50/50 rounded-xl border-0">
            <Checkbox
              id="accept-policies"
              checked={acceptedPolicies}
              onCheckedChange={setAcceptedPolicies}
              className="mt-0.5"
            />
            <label
              htmlFor="accept-policies"
              className="text-sm text-gray-700 leading-relaxed flex-1"
            >
              J'accepte les conditions du salon et confirme ma réservation. Je comprends que l'acompte sera débité immédiatement.
            </label>
          </div>
        </div>

        {/* Boutons modernes */}
        <div className="flex gap-3 px-6 py-5 border-t border-gray-100 bg-gray-50/30">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-12 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            Modifier
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!acceptedPolicies || isLoading}
            className="flex-1 h-12 bg-gray-900 hover:bg-gray-800 text-white border-0 transition-colors disabled:bg-gray-400"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Traitement...
              </div>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Confirmer et payer
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}