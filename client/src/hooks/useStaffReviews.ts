import { useQuery } from '@tanstack/react-query';

export interface StaffReview {
  id: string;
  rating: number;
  comment: string;
  clientName: string;
  date: string;
}

export interface StaffReviewsData {
  averageRating: number;
  reviewCount: number;
  reviews: StaffReview[];
}

export function useStaffReviews(staffId: number | string) {
  return useQuery<StaffReviewsData>({
    queryKey: ['/api/staff', staffId, 'reviews'],
    queryFn: async () => {
      const response = await fetch(`/api/staff/${staffId}/reviews`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des avis');
      }
      return response.json();
    },
    enabled: !!staffId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
