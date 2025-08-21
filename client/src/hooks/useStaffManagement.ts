import { useState, useEffect } from 'react';

export interface Professional {
  id: string;
  name: string;
  photo: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  nextAvailable: string;
  role?: string;
  email?: string;
  phone?: string;
  bio?: string;
  experience?: string;
}

// Données initiales des professionnels
const initialProfessionals: Professional[] = [
  {
    id: "antoine",
    name: "Antoine",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format",
    rating: 4.9,
    reviewCount: 127,
    specialties: ["Coupe homme", "Barbe", "Coiffure classique"],
    nextAvailable: "Aujourd'hui 14h30",
    role: "Barbier Senior",
    email: "antoine@salon.fr",
    phone: "06 12 34 56 78",
    bio: "Spécialiste des coupes masculines traditionnelles et modernes",
    experience: "8 ans d'expérience"
  },
  {
    id: "marie",
    name: "Marie",
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&auto=format",
    rating: 4.8,
    reviewCount: 89,
    specialties: ["Coupe femme", "Coloration", "Brushing"],
    nextAvailable: "Demain 10h00",
    role: "Coloriste Experte",
    email: "marie@salon.fr",
    phone: "06 98 76 54 32",
    bio: "Experte en colorations et soins capillaires",
    experience: "6 ans d'expérience"
  },
  {
    id: "julien",
    name: "Julien",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&auto=format",
    rating: 4.7,
    reviewCount: 156,
    specialties: ["Coupe moderne", "Styling", "Coupe dégradée"],
    nextAvailable: "Aujourd'hui 16h00",
    role: "Styliste Créatif",
    email: "julien@salon.fr",
    phone: "06 55 44 33 22",
    bio: "Passionné par les coupes tendances et créatives",
    experience: "4 ans d'expérience"
  },
  {
    id: "sophie",
    name: "Sophie",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&auto=format",
    rating: 4.9,
    reviewCount: 203,
    specialties: ["Coiffure mixte", "Extensions", "Chignon"],
    nextAvailable: "Demain 9h30",
    role: "Coiffeuse Polyvalente",
    email: "sophie@salon.fr",
    phone: "06 77 88 99 00",
    bio: "Experte en coiffures événementielles et extensions",
    experience: "10 ans d'expérience"
  }
];

// Clé pour le localStorage
const STAFF_STORAGE_KEY = 'salon_staff_data';

// Système d'événements pour la synchronisation
class StaffEventManager {
  private listeners: ((professionals: Professional[]) => void)[] = [];

  subscribe(callback: (professionals: Professional[]) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  notify(professionals: Professional[]) {
    this.listeners.forEach(callback => callback(professionals));
  }
}

const staffEventManager = new StaffEventManager();

// Hook pour la gestion du staff avec synchronisation
export function useStaffManagement() {
  const [professionals, setProfessionals] = useState<Professional[]>(() => {
    // Charger depuis localStorage ou utiliser les données initiales
    const stored = localStorage.getItem(STAFF_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialProfessionals;
  });

  // Synchroniser avec localStorage et notifier les autres composants
  const updateProfessionals = (newProfessionals: Professional[]) => {
    setProfessionals(newProfessionals);
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(newProfessionals));
    staffEventManager.notify(newProfessionals);
  };

  // Écouter les changements d'autres composants
  useEffect(() => {
    const unsubscribe = staffEventManager.subscribe((newProfessionals) => {
      setProfessionals(newProfessionals);
    });
    return unsubscribe;
  }, []);

  const addProfessional = (professional: Omit<Professional, 'id'>) => {
    const newProfessional: Professional = {
      ...professional,
      id: `professional_${Date.now()}`
    };
    updateProfessionals([...professionals, newProfessional]);
  };

  const updateProfessional = (id: string, updates: Partial<Professional>) => {
    const updated = professionals.map(p => 
      p.id === id ? { ...p, ...updates } : p
    );
    updateProfessionals(updated);
  };

  const deleteProfessional = (id: string) => {
    const filtered = professionals.filter(p => p.id !== id);
    updateProfessionals(filtered);
  };

  return {
    professionals,
    addProfessional,
    updateProfessional,
    deleteProfessional,
    setProfessionals: updateProfessionals
  };
}