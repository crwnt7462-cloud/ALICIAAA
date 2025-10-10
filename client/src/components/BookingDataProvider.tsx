import React, { createContext, useContext, ReactNode } from 'react';
import { useBookingData, useBookingCategories } from '@/hooks/useBookingData';

// Types sécurisés pour les données de réservation
interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  popular?: boolean;
  icon?: React.ReactNode;
}

interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
}

interface Salon {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  public_slug: string;
  rating?: number;
  reviews?: number;
  openHours?: string;
  responseTime?: string;
}

interface Professional {
  id: string;
  name: string;
  role: string;
  specialties: string[];
  rating: number;
  experience: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

interface BookingContextType {
  services: Service[];
  timeSlots: TimeSlot[];
  salon: Salon | null;
  professionals: Professional[];
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

interface BookingDataProviderProps {
  children: ReactNode;
  salonSlug?: string;
  serviceId?: string;
  date?: string;
}

export function BookingDataProvider({ 
  children, 
  salonSlug, 
  serviceId, 
  date 
}: BookingDataProviderProps) {
  const { 
    data: bookingData, 
    isLoading: bookingLoading, 
    error: bookingError 
  } = useBookingData(salonSlug, serviceId, date);
  
  const { 
    data: categories = [], 
    isLoading: categoriesLoading, 
    error: categoriesError 
  } = useBookingCategories();

  const isLoading = bookingLoading || categoriesLoading;
  const error = bookingError || categoriesError;

  const value: BookingContextType = {
    services: bookingData?.services || [],
    timeSlots: bookingData?.timeSlots || [],
    salon: bookingData?.salon || null,
    professionals: bookingData?.professionals || [],
    categories,
    isLoading,
    error: error as Error | null
  };

  // Gestion d'erreur avec fallback
  if (error && !isLoading) {
    console.warn('BookingDataProvider: Erreur de chargement des données, utilisation des données de fallback');
  }

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookingContext() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookingContext must be used within a BookingDataProvider');
  }
  return context;
}

// Composant de fallback pour les données hardcodées
export function BookingDataFallback({ children }: { children: ReactNode }) {
  const fallbackData: BookingContextType = {
    services: [
      {
        id: '1',
        name: 'Coupe Signature',
        description: 'Coupe personnalisée selon vos envies',
        duration: 60,
        price: 45,
        category: 'coiffure'
      },
      {
        id: '2',
        name: 'Coloration',
        description: 'Coloration complète ou retouche',
        duration: 90,
        price: 65,
        category: 'coiffure'
      },
      {
        id: '3',
        name: 'Brushing',
        description: 'Mise en forme et séchage',
        duration: 30,
        price: 25,
        category: 'coiffure'
      }
    ],
    timeSlots: [
      { date: '2024-01-27', time: '09:00', available: true },
      { date: '2024-01-27', time: '10:30', available: true },
      { date: '2024-01-27', time: '14:00', available: true },
      { date: '2024-01-27', time: '15:30', available: false },
      { date: '2024-01-27', time: '17:00', available: true }
    ],
    salon: {
      id: '1',
      name: 'Salon Excellence Paris',
      address: '45 Avenue Victor Hugo, 75116 Paris',
      phone: '01 42 34 56 78',
      email: 'contact@salon-excellence.fr',
      description: 'Votre salon de coiffure de référence à Paris',
      public_slug: 'salon-excellence-paris'
    },
    professionals: [
      {
        id: '1',
        name: 'Marie Dubois',
        role: 'Coiffeuse',
        specialties: ['Coupe', 'Coloration'],
        rating: 4.8,
        experience: '5 ans d\'expérience'
      },
      {
        id: '2',
        name: 'Sophie Martin',
        role: 'Styliste',
        specialties: ['Brushing', 'Coiffure événement'],
        rating: 4.9,
        experience: '8 ans d\'expérience'
      }
    ],
    categories: [
      { id: 'coiffure', name: 'Coiffure', icon: 'scissors', count: 15 },
      { id: 'esthetique', name: 'Esthétique', icon: 'sparkles', count: 8 },
      { id: 'manucure', name: 'Manucure', icon: 'palette', count: 12 },
      { id: 'massage', name: 'Massage', icon: 'heart', count: 6 },
      { id: 'barbier', name: 'Barbier', icon: 'award', count: 4 }
    ],
    isLoading: false,
    error: null
  };

  return (
    <BookingContext.Provider value={fallbackData}>
      {children}
    </BookingContext.Provider>
  );
}
