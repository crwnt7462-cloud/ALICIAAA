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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-black">
            Confirmer votre réservation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Récapitulatif principal */}
          <div className="glass-card border-white/40 p-4 text-center">
            <h3 className="text-lg font-semibold text-black mb-2">{bookingDetails.serviceName}</h3>
            <p className="text-gray-600 mb-1">{formatDateForDisplay()}</p>
            <p className="text-gray-600 mb-1">à {bookingDetails.appointmentTime} avec {bookingDetails.staffName}</p>
            <p className="text-2xl font-bold text-black mt-3">{bookingDetails.servicePrice}€</p>
            {depositAmount > 0 && (
              <p className="text-sm text-gray-600 mt-1">Acompte: {depositAmount}€</p>
            )}
          </div>

          {/* Salon */}
          <div className="glass-card border-white/40 p-3 text-center">
            <h4 className="font-semibold text-black">{salonInfo.name}</h4>
            <p className="text-sm text-gray-600">{salonInfo.address}</p>
          </div>

          {/* Conditions simples */}
          <div className="glass-card border-white/40 p-3">
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Annulation gratuite jusqu'à 24h avant</p>
              <p>• Retard de +15min = annulation automatique</p>
              {depositAmount > 0 && <p>• Acompte de {depositAmount}€ requis</p>}
            </div>
          </div>

          {/* Case à cocher obligatoire */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="accept-policies"
              checked={acceptedPolicies}
              onCheckedChange={setAcceptedPolicies}
            />
            <label
              htmlFor="accept-policies"
              className="text-sm text-gray-700 leading-relaxed"
            >
              J'accepte les conditions du salon et confirme ma réservation.
            </label>
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 glass-button hover:glass-effect text-black"
            >
              Modifier
            </Button>
            <Button
              onClick={onConfirm}
              disabled={!acceptedPolicies || isLoading}
              className="flex-1 glass-button hover:glass-effect text-white bg-violet-600 hover:bg-violet-700"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Confirmation...
                </div>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Confirmer et payer
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}