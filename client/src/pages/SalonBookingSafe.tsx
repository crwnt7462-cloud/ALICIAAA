import { ErrorBoundary } from '../components/ErrorBoundary';
import { RetryPanel } from '../components/RetryPanel';
import { useSalonLoader } from '../hooks/useSalonLoader';

// Import du composant SalonBooking existant
import SalonBookingOriginal from './SalonBookingFixed';

export default function SalonBookingSafe() {
  const { loading, error, salon, services, retry } = useSalonLoader();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="glass-card p-8">
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-purple-700">Chargement du salon...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <RetryPanel onRetry={retry} message={error} />;
  }

  if (!salon) {
    return <RetryPanel onRetry={retry} message="Aucun salon trouvé" />;
  }

  // Envelopper le composant existant avec ErrorBoundary
  return (
    <ErrorBoundary>
      <SalonBookingOriginal />
    </ErrorBoundary>
  );
}