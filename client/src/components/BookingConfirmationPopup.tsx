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
      {/* Modal glassmorphism compact */}
      <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl shadow-2xl max-w-xs w-full max-h-[90vh] overflow-y-auto">
        {/* Header glassmorphism */}
        <div className="flex items-center justify-between p-3 border-b border-white/20 bg-white/40 backdrop-blur-md rounded-t-2xl">
          <h2 className="text-base font-semibold text-black">
            Confirmer réservation
          </h2>
          <button 
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 rounded-full hover:bg-white/30 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Contenu glassmorphism */}
        <div className="p-3 space-y-2">
          {/* Service glassmorphism */}
          <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-lg p-3 text-center">
            <h3 className="text-sm font-bold text-black mb-1">
              {bookingDetails.serviceName}
            </h3>
            <div className="text-xs text-gray-700 space-y-0.5 mb-2">
              <p>{formatDateForDisplay()} à {bookingDetails.appointmentTime}</p>
              <p>avec {bookingDetails.staffName}</p>
            </div>
            <p className="text-xl font-bold text-black">{bookingDetails.servicePrice}€</p>
            {depositAmount > 0 && (
              <p className="text-xs text-gray-600 mt-1">
                Acompte: {depositAmount}€
              </p>
            )}
          </div>

          {/* Salon glassmorphism */}
          <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-lg p-2 text-center">
            <p className="font-semibold text-black text-xs">{salonInfo.name}</p>
            <p className="text-xs text-gray-600">{salonInfo.address}</p>
          </div>

          {/* Conditions glassmorphism */}
          <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-lg p-2">
            <p className="font-semibold text-black text-xs mb-1">Conditions</p>
            <div className="text-xs text-gray-700 space-y-0.5">
              <p>• Annulation gratuite 24h avant</p>
              <p>• Retard +15min = annulation</p>
              {depositAmount > 0 && <p>• Acompte {depositAmount}€</p>}
            </div>
          </div>

          {/* Case à cocher glassmorphism */}
          <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-lg p-2">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="accept-policies"
                checked={acceptedPolicies}
                onCheckedChange={(checked) => setAcceptedPolicies(checked === true)}
                className="mt-0.5 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
              />
              <label
                htmlFor="accept-policies"
                className="text-xs text-black flex-1 cursor-pointer"
              >
                J'accepte les conditions et confirme ma réservation.
              </label>
            </div>
          </div>

          {/* Boutons glassmorphism */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 h-8 bg-white/30 backdrop-blur-md border border-white/40 text-black rounded-lg text-xs font-medium hover:bg-white/50 transition-all"
            >
              Modifier
            </button>
            <button
              onClick={onConfirm}
              disabled={!acceptedPolicies || isLoading}
              className="flex-1 h-8 glass-button text-black rounded-lg text-xs font-medium hover:glass-effect transition-all flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <CreditCard className="h-3 w-3 mr-1" />
                  Confirmer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}