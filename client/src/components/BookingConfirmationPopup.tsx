import React, { useState } from 'react';
import { X, CreditCard } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      {/* Popup moderne comme l'image */}
      <div className="relative">
        {/* Fond coloré arrondi */}
        <div className="bg-gradient-to-b from-pink-400 to-pink-500 rounded-3xl p-8 max-w-sm w-full shadow-2xl">
          {/* Bouton X */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-pink-800/70 hover:text-pink-800"
          >
            <X className="w-6 h-6" />
          </button>
          
          {/* Icône centrale */}
          <div className="flex justify-center mb-6 mt-4">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        {/* Zone de contenu blanche */}
        <div className="bg-white rounded-2xl shadow-xl mx-4 -mt-6 relative z-10 p-6 text-center">
          {/* Message principal */}
          <p className="text-gray-600 text-base leading-relaxed mb-6">
            Confirmez votre réservation pour le {formatDateForDisplay()} à {bookingDetails.appointmentTime} avec {bookingDetails.staffName} chez {salonInfo.name}.
            {depositAmount > 0 && ` Un acompte de ${depositAmount}€ sera débité.`}
          </p>

          {/* Case à cocher */}
          <div className="flex items-start space-x-3 text-left mb-6">
            <Checkbox
              id="accept-policies"
              checked={acceptedPolicies}
              onCheckedChange={(checked) => setAcceptedPolicies(checked === true)}
              className="mt-1"
            />
            <label
              htmlFor="accept-policies"
              className="text-sm text-gray-600 leading-relaxed flex-1 cursor-pointer"
            >
              J'accepte les conditions du salon et confirme ma réservation.
            </label>
          </div>

          {/* Boutons comme dans l'image */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-12 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Later
            </button>
            <button
              onClick={onConfirm}
              disabled={!acceptedPolicies || isLoading}
              className="flex-1 h-12 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? "..." : "Confirmer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}