import { Button } from "@/components/ui/button";

// Interface pour le composant BookingConfirmationModal
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

// Composant BookingConfirmationModal
const BookingConfirmationModal = ({ isOpen, onClose, onConfirm, bookingData }: BookingConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Confirmer votre réservation</h2>
        
        <div className="space-y-3 mb-6">
          <p><strong>Service:</strong> {bookingData.serviceName}</p>
          <p><strong>Prix:</strong> {bookingData.servicePrice}€</p>
          <p><strong>Date:</strong> {bookingData.date}</p>
          <p><strong>Heure:</strong> {bookingData.time}</p>
          <p><strong>Professionnel:</strong> {bookingData.professionalName}</p>
          <p><strong>Salon:</strong> {bookingData.salonName}</p>
          <p><strong>Adresse:</strong> {bookingData.salonLocation}</p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Conditions:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• {bookingData.salonPolicies.cancellation}</li>
            <li>• {bookingData.salonPolicies.lateness}</li>
            <li>• {bookingData.salonPolicies.deposit}</li>
            <li>• {bookingData.salonPolicies.modification}</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Annuler
          </Button>
          <Button onClick={onConfirm} className="flex-1 bg-violet-600 hover:bg-violet-700 text-white">
            Confirmer et payer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationModal;