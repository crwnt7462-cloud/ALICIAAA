import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Edit, Trash2, Clock, Euro, Users, Star, Phone, Mail, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import type { StaffMember } from "../../../shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const staffSchema = z.object({
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Téléphone requis"),
  role: z.string().min(1, "Rôle requis"),
  specialties: z.array(z.string()).min(1, "Au moins une spécialité requise"),
  commissionRate: z.number().min(0).max(100, "Taux entre 0 et 100%"),
  isActive: z.boolean().default(true)
});

type StaffForm = z.infer<typeof staffSchema>;

const staffRoles = [
  { value: "coiffeur", label: "Coiffeur/Coiffeuse" },
  { value: "coloriste", label: "Coloriste" },
  { value: "estheticien", label: "Esthéticien(ne)" },
  { value: "manucure", label: "Manucure" },
  { value: "masseur", label: "Masseur/Masseuse" },
  { value: "manager", label: "Manager" }
];

const specialtyOptions = [
  "Coupe femme", "Coupe homme", "Coloration", "Mèches", "Balayage", 
  "Permanente", "Lissage", "Brushing", "Chignon", "Extensions",
  "Manucure", "Pédicure", "Nail art", "Pose vernis",
  "Soin visage", "Épilation", "Massage", "Soins corps"
];

export default function Staff() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: staff = [], isLoading } = useQuery<StaffMember[]>({
    queryKey: ["/api/staff"],
  });

  type StaffStats = {
    totalRevenue?: number;
    totalAppointments?: number;
    averageRating?: number;
  };
  const { data: staffStats = {} } = useQuery<StaffStats>({
    queryKey: ["/api/staff/stats"],
  });

  const form = useForm<StaffForm>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "",
      specialties: [],
      commissionRate: 50,
      isActive: true
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: StaffForm) => apiRequest("POST", "/api/staff", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
      toast({ title: "Membre de l'équipe ajouté avec succès" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ 
        title: "Erreur", 
        description: "Impossible d'ajouter le membre",
        variant: "destructive" 
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<StaffForm> }) => 
      apiRequest("PUT", `/api/staff/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
      toast({ title: "Membre modifié avec succès" });
      setIsDialogOpen(false);
      setEditingStaff(null);
      form.reset();
    },
    onError: () => {
      toast({ 
        title: "Erreur", 
        description: "Impossible de modifier le membre",
        variant: "destructive" 
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/staff/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
      toast({ title: "Membre supprimé avec succès" });
    },
    onError: () => {
      toast({ 
        title: "Erreur", 
        description: "Impossible de supprimer le membre",
        variant: "destructive" 
      });
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => 
      apiRequest("PUT", `/api/staff/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
      toast({ title: "Statut modifié avec succès" });
    }
  });

  const onSubmit = (data: StaffForm) => {
    if (editingStaff) {
      updateMutation.mutate({ id: editingStaff.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (member: any) => {
    setEditingStaff(member);
    form.reset({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone,
      role: member.role,
      specialties: member.specialties || [],
      commissionRate: member.commissionRate || 50,
      isActive: member.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) {
      deleteMutation.mutate(id);
    }
  };

  const toggleActive = (id: number, isActive: boolean) => {
    toggleActiveMutation.mutate({ id, isActive: !isActive });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Gestion Équipe</h1>
          <p className="text-gray-600 mt-1">Gérez votre équipe et leurs performances</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => {
                setEditingStaff(null);
                form.reset();
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un membre
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingStaff ? "Modifier le membre" : "Nouveau membre"}
              </DialogTitle>
              <DialogDescription>
                {editingStaff ? "Modifiez les informations" : "Ajoutez un nouveau membre à l'équipe"}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Marie" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Dupont" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="marie@salon.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="01 23 45 67 89" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rôle</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un rôle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {staffRoles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="commissionRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taux de commission (%)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          placeholder="50"
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingStaff ? "Modifier" : "Ajouter"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {staff.filter((s: any) => s.isActive).length}
            </div>
            <p className="text-sm text-gray-600">Actifs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {staffStats.totalRevenue || 0}€
            </div>
            <p className="text-sm text-gray-600">CA équipe</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {staffStats.totalAppointments || 0}
            </div>
            <p className="text-sm text-gray-600">RDV ce mois</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {staffStats.averageRating || 0}
            </div>
            <p className="text-sm text-gray-600">Note moyenne</p>
          </CardContent>
        </Card>
      </div>

      {/* Staff Grid */}
      {staff.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {staff.map((member: any) => (
            <Card key={member.id} className={`hover:shadow-lg transition-shadow ${!member.isActive ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-purple-100 text-purple-600 font-semibold">
                        {member.firstName[0]}{member.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {member.firstName} {member.lastName}
                      </CardTitle>
                      <Badge variant={member.isActive ? "default" : "secondary"} className="mt-1">
                        {staffRoles.find(r => r.value === member.role)?.label || member.role}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(member)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(member.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 truncate">{member.email}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{member.phone}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Euro className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      {member.commissionRate || 50}% commission
                    </span>
                  </div>
                  
                  {member.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{member.rating}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">
                      {member.appointmentsThisMonth || 0} RDV ce mois
                    </span>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(member.id, member.isActive)}
                    className={member.isActive ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                  >
                    {member.isActive ? "Désactiver" : "Activer"}
                  </Button>
                </div>
                
                {member.specialties && member.specialties.length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs text-gray-500 mb-2">Spécialités:</p>
                    <div className="flex flex-wrap gap-1">
                      {member.specialties.slice(0, 3).map((specialty: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {member.specialties.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{member.specialties.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun membre dans l'équipe
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez par ajouter vos premiers collaborateurs
            </p>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter le premier membre
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}