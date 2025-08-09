import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookingData: {
    serviceName: string;
    servicePrice: number;
    date: string;
    time: string;
    professionalName: string;
    salonName: string;
    salonLocation: string;
    salonPolicies: {
      cancellation: string;
      lateness: string;
      deposit: string;
      modification: string;
    };
  };
}

export default function BookingConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  bookingData
}: BookingConfirmationModalProps) {
  const [acceptConditions, setAcceptConditions] = useState(false);

  if (!isOpen) return null;

  const depositAmount = Math.round(bookingData.servicePrice * 0.5);

  const handleConfirm = () => {
    if (!acceptConditions) return;
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal compact */}
      <div className="relative w-full max-w-sm mx-4">
        <div 
          className="bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/30 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          {/* Header compact */}
          <div className="flex items-center justify-between p-4 pb-2 border-b border-white/20">
            <h2 className="text-lg font-semibold text-gray-900">Confirmer</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-7 w-7 p-0 rounded-full hover:bg-gray-100/50"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Récapitulatif compact */}
          <div className="p-4 space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Service</span>
                <span className="font-medium text-gray-900">{bookingData.serviceName}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Date & Heure</span>
                <span className="font-medium text-gray-900">{bookingData.date} à {bookingData.time}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Professionnel</span>
                <span className="font-medium text-gray-900">{bookingData.professionalName}</span>
              </div>
            </div>

            <div className="border-t border-white/20 pt-2">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-gray-600">Prix total</span>
                <span className="font-medium text-gray-900">{bookingData.servicePrice}€</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Acompte</span>
                <span className="font-bold text-gray-900 text-lg">{depositAmount}€</span>
              </div>
            </div>

            {/* Politiques condensées */}
            <div className="bg-gray-50/50 rounded-lg p-3 space-y-1">
              <p className="text-xs font-medium text-gray-700 mb-2">Conditions du salon :</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• {bookingData.salonPolicies.cancellation}</li>
                <li>• {bookingData.salonPolicies.lateness}</li>
                <li>• {bookingData.salonPolicies.deposit}</li>
              </ul>
            </div>

            {/* Checkbox validation */}
            <div className="flex items-start space-x-2 pt-2">
              <Checkbox
                id="accept-conditions"
                checked={acceptConditions}
                onCheckedChange={(checked) => setAcceptConditions(checked as boolean)}
                className="mt-0.5"
              />
              <label 
                htmlFor="accept-conditions" 
                className="text-xs text-gray-700 leading-4 cursor-pointer"
              >
                J'accepte les conditions du salon et confirme ma réservation
              </label>
            </div>

            {/* Bouton confirmation */}
            <Button
              onClick={handleConfirm}
              disabled={!acceptConditions}
              className="w-full mt-4 glass-button hover:glass-effect text-black font-medium py-2.5 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmer & Payer {depositAmount}€
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}