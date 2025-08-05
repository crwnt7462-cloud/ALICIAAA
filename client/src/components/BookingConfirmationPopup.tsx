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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-2">
      {/* Modal glassmorphism comme le site */}
      <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl shadow-2xl max-w-sm w-full max-h-[95vh] overflow-y-auto">
        {/* Header glassmorphism */}
        <div className="flex items-center justify-between p-4 border-b border-white/20 bg-white/40 backdrop-blur-md rounded-t-2xl">
          <h2 className="text-lg font-semibold text-black">
            Confirmer réservation
          </h2>
          <button 
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-gray-800 rounded-full hover:bg-white/30 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Contenu glassmorphism */}
        <div className="p-4 space-y-3">
          {/* Service - Card glassmorphism standard */}
          <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-xl p-4 text-center">
            <h3 className="text-lg font-bold text-black mb-2">
              {bookingDetails.serviceName}
            </h3>
            <div className="text-sm text-gray-700 space-y-1 mb-3">
              <p>{formatDateForDisplay()} à {bookingDetails.appointmentTime}</p>
              <p>avec {bookingDetails.staffName}</p>
            </div>
            <p className="text-2xl font-bold text-black mb-1">{bookingDetails.servicePrice}€</p>
            {depositAmount > 0 && (
              <p className="text-xs text-gray-600 bg-white/50 backdrop-blur-sm rounded-full px-3 py-1 inline-block border border-white/40">
                Acompte: {depositAmount}€
              </p>
            )}
          </div>

          {/* Salon glassmorphism */}
          <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-xl p-3 text-center">
            <p className="font-bold text-black text-sm">{salonInfo.name}</p>
            <p className="text-xs text-gray-600">{salonInfo.address}</p>
          </div>

          {/* Conditions glassmorphism */}
          <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-xl p-3">
            <p className="font-semibold text-black text-sm mb-2">Conditions importantes</p>
            <div className="text-xs text-gray-700 space-y-1">
              <p>• Annulation gratuite jusqu'à 24h avant</p>
              <p>• Retard +15min = annulation automatique</p>
              {depositAmount > 0 && <p>• Acompte {depositAmount}€ requis</p>}
            </div>
          </div>

          {/* Case à cocher glassmorphism */}
          <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-xl p-3">
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

          {/* Boutons - style site avec violet pour confirmer */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 h-10 bg-white/30 backdrop-blur-md border border-white/40 text-black rounded-xl text-sm font-medium hover:bg-white/50 transition-all"
            >
              Modifier
            </button>
            <button
              onClick={onConfirm}
              disabled={!acceptedPolicies || isLoading}
              className="flex-1 h-10 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-violet-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 flex items-center justify-center transition-all"
            >
              {isLoading ? (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span className="text-xs">...</span>
                </div>
              ) : (
                <>
                  <CreditCard className="h-3 w-3 mr-1" />
                  <span className="text-xs">Confirmer</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}