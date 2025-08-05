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
      {/* Modal exactement comme l'image */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full relative overflow-hidden">
        {/* Bouton X en haut à droite */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 z-10"
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* Contenu exactement comme l'image */}
        <div className="p-6 pt-12 text-center space-y-6">
          {/* Date et heure comme dans l'image */}
          <div className="space-y-1">
            <p className="text-lg text-gray-700">{formatDateForDisplay()}</p>
            <p className="text-lg text-gray-700">à {bookingDetails.appointmentTime}</p>
            <p className="text-lg text-gray-700">avec {bookingDetails.staffName}</p>
          </div>

          {/* Prix principal exactement comme l'image */}
          <div className="py-6">
            <p className="text-5xl font-light text-gray-900">{bookingDetails.servicePrice}€</p>
            {depositAmount > 0 && (
              <p className="text-sm text-gray-600 mt-2">Acompte requis: {depositAmount}€</p>
            )}
          </div>

          {/* Nom du salon exactement comme l'image */}
          <div className="space-y-1">
            <h3 className="text-xl font-medium text-gray-900">{salonInfo.name}</h3>
            <p className="text-gray-600">{salonInfo.address}</p>
          </div>

          {/* Conditions importantes exactement comme l'image */}
          <div className="bg-yellow-50 rounded-lg p-4 text-left mx-4">
            <h4 className="font-semibold text-gray-900 mb-3">Conditions importantes</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• Annulation gratuite jusqu'à 24h avant</p>
              <p>• Retard de +15min = annulation automatique</p>
              {depositAmount > 0 && <p>• Acompte de {depositAmount}€ requis pour confirmer</p>}
            </div>
          </div>

          {/* Case à cocher exactement comme l'image */}
          <div className="flex items-start space-x-3 text-left px-4">
            <Checkbox
              id="accept-policies"
              checked={acceptedPolicies}
              onCheckedChange={(checked) => setAcceptedPolicies(checked === true)}
              className="mt-1"
            />
            <label
              htmlFor="accept-policies"
              className="text-sm text-gray-700 leading-relaxed flex-1 cursor-pointer"
            >
              J'accepte les conditions du salon et confirme ma réservation. Je comprends que l'acompte sera débité immédiatement.
            </label>
          </div>

          {/* Bouton exactement comme l'image */}
          <button
            onClick={onConfirm}
            disabled={!acceptedPolicies || isLoading}
            className="w-full h-14 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mx-4"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Traitement...
              </div>
            ) : (
              "Confirmer et payer"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}