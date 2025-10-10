import { useState, useCallback, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Plus, 
  Edit3, 
  Trash2, 
  Mail, 
  Phone, 
  Star,
  Users,
  Clock,
  Loader2,
  Shield,
  TrendingUp,
  UserCheck
} from "lucide-react";
import { useStaffManagement, type Professional } from "@/hooks/useStaffManagement";
import { useStaffReviews } from "@/hooks/useStaffReviews";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge as UIBadge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useToast } from "@/hooks/use-toast";

// Types
type StaffMember = { 
  id: string | number; 
  isActive?: boolean; 
  availableToday?: boolean; 
  [k: string]: any 
};

type StaffStats = { 
  totalRevenue?: number; 
  totalAppointments?: number; 
  averageRating?: number;
  activeMembers?: number;
};



export default function StaffManagementModern() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Professional | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "role" | "rating" | "appointments">("name");
  
  // Récupérer les services du salon avec sécurité
  const { data: salonData, isLoading: isLoadingSalon, error: salonError } = useQuery({
    queryKey: ['/api/salon/my-salon'],
    queryFn: async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch('/api/salon/my-salon', {
          credentials: 'include',
          cache: 'no-store',
          referrerPolicy: 'same-origin',
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('🏢 Données salon récupérées:', data);
        return data;
      } catch (error) {
        console.error('Erreur lors du chargement du salon:', error);
        throw error;
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });
  
  // Récupérer les statistiques de l'équipe
  const { data: staffStats = {}, isLoading: isLoadingStats } = useQuery<StaffStats>({
    queryKey: ["/api/staff/stats"],
    queryFn: async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch('/api/staff/stats', {
          credentials: 'include',
          cache: 'no-store',
          referrerPolicy: 'same-origin',
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        return response.json();
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
        return {};
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });
  
  // Utiliser le hook synchronisé de gestion du staff
  const { professionals: staffMembers, isLoading: isLoadingStaff, addProfessional, updateProfessional, deleteProfessional } = useStaffManagement();

  const [newStaff, setNewStaff] = useState<Partial<Professional> & { selectedServices?: string[]; jobTitle?: string }>({
    name: "",
    role: "",
    email: "",
    phone: "",
    photo: "",
    bio: "",
    specialties: [],
    selectedServices: [],
    jobTitle: "",
    experience: "",
    rating: 0,
    reviewCount: 0,
    nextAvailable: ""
  });

  // Mutation pour ajouter un membre
  const addStaffMutation = useMutation({
    mutationFn: async (staffData: Omit<Professional, 'id'>) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      try {
        const response = await fetch('/api/staff', {
          method: 'POST',
          credentials: 'include',
          cache: 'no-store',
          referrerPolicy: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify(staffData),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        return response.json();
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/staff/stats'] });
      toast({ title: "Membre ajouté", description: "Le membre a été ajouté avec succès" });
    },
    onError: (error) => {
      toast({ 
        title: "Erreur", 
        description: `Impossible d'ajouter le membre: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Mutation pour supprimer un membre
  const deleteStaffMutation = useMutation({
    mutationFn: async (id: string) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      try {
        const response = await fetch(`/api/staff/${id}`, {
          method: 'DELETE',
          credentials: 'include',
          cache: 'no-store',
          referrerPolicy: 'same-origin',
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        return response.json();
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/staff/stats'] });
      toast({ title: "Membre supprimé", description: "Le membre a été supprimé avec succès" });
    },
    onError: (error) => {
      toast({ 
        title: "Erreur", 
        description: `Impossible de supprimer le membre: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Mutation pour mettre à jour un membre
  const updateStaffMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Professional }) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      try {
        const response = await fetch(`/api/staff/${id}`, {
          method: 'PUT',
          credentials: 'include',
          cache: 'no-store',
          referrerPolicy: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify(data),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        return response.json();
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/staff/stats'] });
      toast({ title: "Membre mis à jour", description: "Le membre a été mis à jour avec succès" });
    },
    onError: (error) => {
      toast({ 
        title: "Erreur", 
        description: `Impossible de mettre à jour le membre: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleAddStaff = useCallback(() => {
    if (!newStaff.name || !newStaff.role || !newStaff.email) {
      toast({ 
        title: "Champs requis", 
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const staffData: Omit<Professional, 'id'> = {
      name: newStaff.name!,
      role: newStaff.role!,
      email: newStaff.email!,
      phone: newStaff.phone || "",
      photo: newStaff.photo || "",
      bio: newStaff.bio || "",
      specialties: newStaff.specialties || [],
      experience: newStaff.experience || "",
      rating: newStaff.rating || 0,
      reviewCount: newStaff.reviewCount || 0,
      nextAvailable: newStaff.nextAvailable || ""
    };

    addStaffMutation.mutate(staffData);
    
    setNewStaff({
      name: "",
      role: "",
      email: "",
      phone: "",
      photo: "",
      bio: "",
      specialties: [],
      selectedServices: [],
      jobTitle: "",
      experience: "",
      rating: 5.0,
      reviewCount: 0,
      nextAvailable: ""
    });
    setIsAddingStaff(false);
  }, [newStaff, addStaffMutation, toast]);

  const handleDeleteStaff = useCallback((id: string) => {
    deleteStaffMutation.mutate(id);
  }, [deleteStaffMutation]);

  const handleEditStaff = useCallback((staff: Professional) => {
    setEditingStaff(staff);
  }, []);

  const handleUpdateStaff = useCallback(() => {
    if (editingStaff) {
      updateStaffMutation.mutate({ id: editingStaff.id, data: editingStaff });
      setEditingStaff(null);
    }
  }, [editingStaff, updateStaffMutation]);

  // Filtrage et tri des membres
  const filteredAndSortedStaff = useMemo(() => {
    let filtered = staffMembers.filter(member => {
      const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = filterRole === "all" || member.role === filterRole;
      
      return matchesSearch && matchesRole;
    });

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "role":
          return (a.role || "").localeCompare(b.role || "");
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "appointments":
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [staffMembers, searchTerm, filterRole, sortBy]);

  // Rôles uniques pour le filtre
  const uniqueRoles = useMemo(() => {
    const roles = staffMembers.map(member => member.role).filter(Boolean);
    return Array.from(new Set(roles));
  }, [staffMembers]);

  // Statistiques calculées
  const computedStats = useMemo(() => {
    const totalMembers = staffMembers.length;
    const activeMembers = staffMembers.filter(member => (member as any).isActive !== false).length;
    const averageRating = staffMembers.length > 0 
      ? staffMembers.reduce((sum, member) => sum + (member.rating || 0), 0) / staffMembers.length 
      : 0;
    
    return {
      totalMembers,
      activeMembers,
      averageRating: Math.round(averageRating * 10) / 10,
      ...staffStats
    };
  }, [staffMembers, staffStats]);

  // États de chargement
  const isLoading = addStaffMutation.isPending || deleteStaffMutation.isPending || updateStaffMutation.isPending || isLoadingStaff;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      {/* Header Mobile */}
      <div className="lg:hidden">
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/dashboard')}
              className="h-10 w-10 p-0 rounded-full hover:bg-violet-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">Gestion de l'équipe</h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      {/* Desktop Layout avec Sidebar */}
      <div className="hidden lg:flex h-screen">
        {/* Sidebar */}
        <div className="w-60 bg-white/80 backdrop-blur-sm shadow-lg border-r border-gray-200">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="px-6 py-8">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="text-xl font-bold text-gray-800">Avyento</span>
              </div>
            </div>
            
            {/* Statistiques */}
            <div className="px-6 py-4">
              <div className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Statistiques</h3>
                  <Shield className="w-4 h-4 text-violet-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total membres</span>
                    <span className="font-semibold text-violet-700">{computedStats.totalMembers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Actifs</span>
                    <span className="font-semibold text-green-600">{computedStats.activeMembers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Note moyenne</span>
                    <span className="font-semibold text-amber-600">{computedStats.averageRating}/5</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
              <button 
                onClick={() => setLocation('/dashboard')}
                className="w-full flex items-center space-x-4 px-4 py-4 text-gray-600 hover:bg-violet-50 hover:text-violet-700 rounded-2xl transition-all duration-200"
              >
                <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span className="font-medium">Dashboard</span>
              </button>
              
              <div className="flex items-center space-x-4 px-4 py-4 bg-violet-50 rounded-2xl text-violet-600 font-medium">
                <div className="w-6 h-6 bg-violet-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span>Équipe</span>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Gestion de l'équipe
                </h1>
                <p className="text-gray-600 mt-2">Gérez votre équipe professionnelle</p>
              </div>
              
              <Dialog open={isAddingStaff} onOpenChange={setIsAddingStaff}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-5 h-5 mr-2" />
                    )}
                    Ajouter un membre
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Ajouter un membre</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input
                        id="name"
                        value={newStaff.name || ""}
                        onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                        placeholder="Nom complet"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Poste</Label>
                      <Input
                        id="role"
                        value={newStaff.role || ""}
                        onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                        placeholder="Poste"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newStaff.email || ""}
                        onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                        placeholder="Email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        value={newStaff.phone || ""}
                        onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                        placeholder="Téléphone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="photo">URL Photo</Label>
                      <Input
                        id="photo"
                        value={newStaff.photo || ""}
                        onChange={(e) => setNewStaff({...newStaff, photo: e.target.value})}
                        placeholder="URL de la photo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Intitulé exact du métier</Label>
                      <Input
                        id="jobTitle"
                        value={newStaff.jobTitle || ""}
                        onChange={(e) => setNewStaff({...newStaff, jobTitle: e.target.value})}
                        placeholder="Spécialités"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Expérience</Label>
                      <Input
                        id="experience"
                        value={newStaff.experience || ""}
                        onChange={(e) => setNewStaff({...newStaff, experience: e.target.value})}
                        placeholder="Expérience"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="bio">Biographie</Label>
                      <Textarea
                        id="bio"
                        value={newStaff.bio || ""}
                        onChange={(e) => setNewStaff({...newStaff, bio: e.target.value})}
                        placeholder="Décrivez l'expérience et les spécialités..."
                        rows={3}
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Services proposés par ce professionnel</Label>
                      <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                        {salonData?.services?.map((service: any) => (
                          <div key={service.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`service-${service.id}`}
                              checked={newStaff.selectedServices?.includes(service.id) || false}
                              onCheckedChange={(checked) => {
                                const currentServices = newStaff.selectedServices || [];
                                if (checked) {
                                  setNewStaff({
                                    ...newStaff,
                                    selectedServices: [...currentServices, service.id]
                                  });
                                } else {
                                  setNewStaff({
                                    ...newStaff,
                                    selectedServices: currentServices.filter((id: string) => id !== service.id)
                                  });
                                }
                              }}
                            />
                            <Label htmlFor={`service-${service.id}`} className="text-sm">
                              {service.name} - {service.price}€
                            </Label>
                          </div>
                        )) || (
                          <p className="text-sm text-gray-500">Aucun service configuré</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddingStaff(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleAddStaff} className="bg-violet-600 hover:bg-violet-700">
                      Ajouter
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Filtres et recherche */}
            <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="search" className="text-sm font-medium text-gray-700 mb-2 block">
                    Rechercher
                  </Label>
                  <Input
                    id="search"
                    placeholder="Nom, poste, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="filter-role" className="text-sm font-medium text-gray-700 mb-2 block">
                    Filtrer par rôle
                  </Label>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Tous les rôles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les rôles</SelectItem>
                      {uniqueRoles.map(role => (
                        <SelectItem key={role} value={role || ""}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sort-by" className="text-sm font-medium text-gray-700 mb-2 block">
                    Trier par
                  </Label>
                  <Select value={sortBy} onValueChange={(value: "name" | "role" | "rating" | "appointments") => setSortBy(value)}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Nom</SelectItem>
                      <SelectItem value="role">Rôle</SelectItem>
                      <SelectItem value="rating">Note</SelectItem>
                      <SelectItem value="appointments">Rendez-vous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* État de chargement */}
            {isLoadingStaff && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3">
                  <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
                  <span className="text-gray-600">Chargement de l'équipe...</span>
                </div>
              </div>
            )}

            {/* Debug info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-4 p-3 bg-gray-100 rounded-lg text-xs">
                <div><strong>Salon Data:</strong> {salonData ? '✅ Loaded' : '❌ Loading'}</div>
                <div><strong>Staff Count:</strong> {staffMembers.length}</div>
                <div><strong>Loading:</strong> {isLoadingStaff ? 'Yes' : 'No'}</div>
              </div>
            )}

            {/* Liste des membres de l'équipe */}
            {!isLoadingStaff && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedStaff.map((member) => {
                // Récupérer les vraies notes pour cet employé
                const { data: reviewsData } = useStaffReviews(member.id);
                const realRating = reviewsData?.averageRating || member.rating;
                const realReviewCount = reviewsData?.reviewCount || member.reviewCount;
                
                return (
                <Card key={member.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border-0 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-16 h-16 rounded-2xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900 text-lg truncate">{member.name}</h3>
                            {realRating && realRating > 0 && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-medium text-gray-700">
                                  {realRating.toFixed(1)}
                                </span>
                                {realReviewCount > 0 && (
                                  <span className="text-xs text-gray-500">
                                    ({realReviewCount})
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          {member.nextAvailable && member.nextAvailable.includes("Aujourd'hui") && (
                            <UIBadge variant="secondary" className="bg-green-50 text-green-700 text-xs">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                              Dispo
                            </UIBadge>
                          )}
                        </div>
                        <p className="text-violet-600 font-medium text-sm">{member.role}</p>
                        {member.jobTitle && (
                          <p className="text-gray-500 text-xs italic">{member.jobTitle}</p>
                        )}
                        {member.experience && (
                          <p className="text-gray-500 text-xs">{member.experience}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{member.phone}</span>
                      </div>
                      {member.bio && (
                        <div className="text-sm text-gray-600">
                          <p className="line-clamp-2">{member.bio}</p>
                        </div>
                      )}
                      {member.nextAvailable && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{member.nextAvailable}</span>
                        </div>
                      )}
                    </div>

                    {member.specialties && member.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {member.specialties.slice(0, 3).map((specialty: string, index: number) => (
                          <UIBadge key={index} variant="secondary" className="text-xs bg-violet-50 text-violet-700">
                            {specialty}
                          </UIBadge>
                        ))}
                        {member.specialties.length > 3 && (
                          <UIBadge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                            +{member.specialties.length - 3}
                          </UIBadge>
                        )}
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditStaff(member)}
                        className="flex-1 hover:bg-violet-50 hover:border-violet-200 transition-all duration-200"
                        disabled={isLoading}
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Modifier
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteStaff(member.id)}
                        className="text-red-600 hover:bg-red-50 hover:border-red-200 transition-all duration-200"
                        disabled={isLoading}
                      >
                        {deleteStaffMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                );
                })}
              </div>
            )}

            {/* État vide */}
            {!isLoadingStaff && filteredAndSortedStaff.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-12 h-12 text-violet-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm || filterRole !== "all" ? "Aucun résultat" : "Aucun membre"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filterRole !== "all" 
                    ? "Aucun membre ne correspond à vos critères."
                    : "Ajoutez votre premier membre d'équipe."
                  }
                </p>
                {!searchTerm && filterRole === "all" && (
                  <Button 
                    onClick={() => setIsAddingStaff(true)}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Ajouter le premier membre
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="lg:hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Votre équipe
              </h2>
              <p className="text-sm text-gray-600">{computedStats.totalMembers} membres</p>
            </div>
            
            <Dialog open={isAddingStaff} onOpenChange={setIsAddingStaff}>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-1" />
                  )}
                  Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm mx-4">
                <DialogHeader>
                  <DialogTitle>Ajouter un membre</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobile-name">Nom complet</Label>
                    <Input
                      id="mobile-name"
                      value={newStaff.name || ""}
                      onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                      placeholder="Nom complet"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile-role">Poste</Label>
                    <Input
                      id="mobile-role"
                      value={newStaff.role || ""}
                      onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                      placeholder="Poste"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile-email">Email</Label>
                    <Input
                      id="mobile-email"
                      type="email"
                      value={newStaff.email || ""}
                      onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                      placeholder="Email"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsAddingStaff(false)} className="flex-1">
                    Annuler
                  </Button>
                  <Button onClick={handleAddStaff} className="flex-1 bg-violet-600 hover:bg-violet-700">
                    Ajouter
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {isLoadingStaff ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-3">
                  <Loader2 className="w-5 h-5 animate-spin text-violet-600" />
                  <span className="text-gray-600">Chargement...</span>
                </div>
              </div>
            ) : staffMembers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Aucun membre d'équipe</p>
              </div>
            ) : (
              staffMembers.map((member) => (
              <Card key={member.id} className="bg-white rounded-xl shadow-sm border-0">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{member.name}</h3>
                        {member.availableToday && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-violet-600 text-xs font-medium">{member.role}</p>
                      <p className="text-gray-500 text-xs">{member.experience}</p>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {member.specialties.slice(0, 2).map((specialty, index) => (
                          <UIBadge key={index} variant="secondary" className="text-xs bg-violet-50 text-violet-700 px-1.5 py-0.5">
                            {specialty}
                          </UIBadge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditStaff(member)}
                      className="flex-1 text-xs"
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      Modifier
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteStaff(member.id)}
                      className="text-red-600 hover:bg-red-50 text-xs"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
            )}
          </div>
        </div>
      </div>

      {/* Dialog d'édition */}
      {editingStaff && (
        <Dialog open={!!editingStaff} onOpenChange={() => setEditingStaff(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier {editingStaff.name}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Nom complet</Label>
                <Input
                  value={editingStaff.name}
                  onChange={(e) => setEditingStaff({...editingStaff, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Poste</Label>
                <Input
                  value={editingStaff.role}
                  onChange={(e) => setEditingStaff({...editingStaff, role: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={editingStaff.email}
                  onChange={(e) => setEditingStaff({...editingStaff, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input
                  value={editingStaff.phone}
                  onChange={(e) => setEditingStaff({...editingStaff, phone: e.target.value})}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Biographie</Label>
                <Textarea
                  value={editingStaff.bio}
                  onChange={(e) => setEditingStaff({...editingStaff, bio: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setEditingStaff(null)}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button 
                onClick={handleUpdateStaff} 
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                disabled={isLoading}
              >
                {updateStaffMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Sauvegarder
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Mobile Navigation */}
      <MobileBottomNav />
    </div>
  );
}