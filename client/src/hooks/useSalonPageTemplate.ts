
import { useState, useEffect } from 'react';

// Types nécessaires pour le hook et les données
export interface OpeningHoursDay {
  open?: string;
  close?: string;
  closed?: boolean;
}

export interface OpeningHours {
  lundi: OpeningHoursDay;
  mardi: OpeningHoursDay;
  mercredi: OpeningHoursDay;
  jeudi: OpeningHoursDay;
  vendredi: OpeningHoursDay;
  samedi: OpeningHoursDay;
  dimanche: OpeningHoursDay;
}

export interface SalonData {
  id: string | number;
  name: string;
  slug: string;
  description: string;
  address: string;
  phone: string;
  rating: number;
  reviewsCount: number;
  coverImageUrl?: string;
  logo?: string;
  openingHours: OpeningHours;
  amenities: string[];
  priceRange: string;
  customColors?: {
    primary?: string;
    accent?: string;
    buttonText?: string;
  };
}

export interface SalonService {
  id: string | number;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
}

export interface SalonStaff {
  id: string | number;
  name: string;
  role: string;
  specialties: string[];
  rating: number;
  reviewsCount: number;
}

export interface SalonReview {
  id: string | number;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
  verified: boolean;
  ownerResponse?: {
    message: string;
    date: string;
  };
}

// Hook principal
export function useSalonPageTemplate(salonSlug: string) {
  const [salonData, setSalonData] = useState<SalonData | null>(null);
  const [services, setServices] = useState<SalonService[]>([]);
  const [staff, setStaff] = useState<SalonStaff[]>([]);
  const [reviews, setReviews] = useState<SalonReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOwner, setIsOwner] = useState<boolean>(false);

    // Correction structurelle : un seul useEffect, fermeture correcte des blocs
    useEffect(() => {
      async function loadSalonData() {
        setLoading(true);
        try {
          // Appel API public et ownership en parallèle
          const [publicResponse, ownershipResponse] = await Promise.allSettled([
            fetch(`/api/public/salons/${salonSlug}`),
            fetch(`/api/salons/${salonSlug}`)
          ]);

          // Si données publiques disponibles
          if (publicResponse.status === 'fulfilled' && publicResponse.value.ok) {
            const publicData = await publicResponse.value.json();
            if (publicData.salon) {
              const salon = publicData.salon;
              const mappedSalonData: SalonData = {
                id: salon.id,
                name: salon.name,
                slug: salon.slug || salonSlug,
                description: salon.description || `Salon de beauté professionnel ${salon.name}`,
                address: salon.address || 'Adresse non renseignée',
                phone: salon.phone || 'Téléphone non renseigné',
                rating: salon.rating || 4.8,
                reviewsCount: salon.reviewCount || 0,
                coverImageUrl: salon.photos?.[0] || salon.coverImageUrl,
                logo: salon.logoUrl,
                openingHours: salon.openingHours || {
                  lundi: { open: '09:00', close: '19:00' },
                  mardi: { open: '09:00', close: '19:00' },
                  mercredi: { open: '09:00', close: '19:00' },
                  jeudi: { open: '09:00', close: '19:00' },
                  vendredi: { open: '09:00', close: '19:00' },
                  samedi: { open: '09:00', close: '18:00' },
                  dimanche: { closed: true, open: '', close: '' }
                },
                amenities: salon.amenities || ['WiFi gratuit', 'Climatisation', 'Parking', 'Accessible PMR'],
                priceRange: salon.priceRange || '€€',
                customColors: salon.customColors
              };
              setSalonData(mappedSalonData);

              // Extraire les services
              if (salon.serviceCategories && salon.serviceCategories.length > 0) {
                const extractedServices: SalonService[] = [];
                salon.serviceCategories.forEach((category: any) => {
                  if (category.services && category.services.length > 0) {
                    category.services.forEach((service: any) => {
                      extractedServices.push({
                        id: service.id,
                        name: service.name,
                        description: service.description || `Service ${service.name}`,
                        price: service.price,
                        duration: service.duration,
                        category: category.name || 'Services'
                      });
                    });
                  }
                });
                setServices(extractedServices);
              }
              // Extraire l'équipe
              if (salon.professionals && salon.professionals.length > 0) {
                setStaff(salon.professionals);
              }
              // Extraire les avis
              if (salon.reviews && salon.reviews.length > 0) {
                setReviews(salon.reviews);
              }
              setLoading(false);
              return;
            }
          }
          // Si données ownership disponibles (propriétaire connecté)
          if (ownershipResponse.status === 'fulfilled' && ownershipResponse.value.ok) {
            const ownershipData = await ownershipResponse.value.json();
            if (ownershipData.salon) {
              setIsOwner(true);
              const salon = ownershipData.salon;
              const mappedSalonData: SalonData = {
                id: salon.id,
                name: salon.name,
                slug: salon.slug || salonSlug,
                description: salon.description || `Salon de beauté professionnel ${salon.name}`,
                address: salon.address || 'Adresse non renseignée',
                phone: salon.phone || 'Téléphone non renseigné',
                rating: salon.rating || 4.8,
                reviewsCount: salon.reviewCount || 0,
                coverImageUrl: salon.photos?.[0] || salon.coverImageUrl,
                logo: salon.logoUrl,
                openingHours: salon.openingHours || {
                  lundi: { open: '09:00', close: '19:00' },
                  mardi: { open: '09:00', close: '19:00' },
                  mercredi: { open: '09:00', close: '19:00' },
                  jeudi: { open: '09:00', close: '19:00' },
                  vendredi: { open: '09:00', close: '19:00' },
                  samedi: { open: '09:00', close: '18:00' },
                  dimanche: { closed: true, open: '', close: '' }
                },
                amenities: salon.amenities || ['WiFi gratuit', 'Climatisation', 'Parking', 'Accessible PMR'],
                priceRange: salon.priceRange || '€€',
                customColors: salon.customColors
              };
              setSalonData(mappedSalonData);
              // Extraire les services
              if (salon.serviceCategories && salon.serviceCategories.length > 0) {
                const extractedServices: SalonService[] = [];
                salon.serviceCategories.forEach((category: any) => {
                  if (category.services && category.services.length > 0) {
                    category.services.forEach((service: any) => {
                      extractedServices.push({
                        id: service.id,
                        name: service.name,
                        description: service.description || `Service ${service.name}`,
                        price: service.price,
                        duration: service.duration,
                        category: category.name || 'Services'
                      });
                    });
                  }
                });
                setServices(extractedServices);
              }
              // Extraire l'équipe
              if (salon.professionals && salon.professionals.length > 0) {
                setStaff(salon.professionals);
              }
              // Extraire les avis
              if (salon.reviews && salon.reviews.length > 0) {
                setReviews(salon.reviews);
              }
              setLoading(false);
              return;
            }
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Erreur lors du chargement du salon:', error);
        } finally {
          setLoading(false);
        }
      }
      loadSalonData();
    }, [salonSlug]);

    return { salonData, services, staff, reviews, loading, isOwner };
  }
