import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Scissors, Plus, Edit, Trash2, Clock, Euro, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const serviceSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire"),
  description: z.string().optional(),
  price: z.number().min(0, "Le prix doit être positif"),
  duration: z.number().min(5, "La durée minimum est de 5 minutes"),
  category: z.string().optional(),
  requiresDeposit: z.boolean().default(false),
  depositPercentage: z.number().min(0).max(100).default(30),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export default function Services() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer les services avec salonId obligatoire et typage correct
  const { data: services = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/services", "demo"], // Ajout du salonId
    queryFn: () => fetch("/api/services?salonId=demo").then(res => res.json())
  });

  const createServiceMutation = useMutation({
    mutationFn: async (data: ServiceFormData) => {
      const response = await apiRequest("POST", "/api/services", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Service ajouté",
        description: "Le service a été ajouté avec succès.",
      });
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      reset();
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le service.",
        variant: "destructive",
      });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/services/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Service supprimé",
        description: "Le service a été supprimé avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le service.",
        variant: "destructive",
      });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
  });

  const onSubmit = (data: ServiceFormData) => {
    createServiceMutation.mutate(data);
  };

  const openEditDialog = (service: any) => {
    setEditingService(service);
    setValue("name", service.name);
    setValue("description", service.description || "");
    setValue("price", service.price);
    setValue("duration", service.duration);
    setValue("category", service.category || "");
    setValue("requiresDeposit", service.requiresDeposit || false);
    setValue("depositPercentage", service.depositPercentage || 30);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingService(null);
    reset();
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-gray-50/50 to-purple-50/30 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600 text-sm mt-1">
            {services.length} service{services.length > 1 ? 's' : ''} disponible{services.length > 1 ? 's' : ''}
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
          <DialogTrigger asChild>
            <Button 
              size="sm" 
              className="gradient-bg text-white shadow-md hover:scale-105 transition-all duration-200 rounded-lg"
            >
              <Plus className="w-4 h-4 mr-1" />
              Nouveau service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Modifier le service" : "Ajouter un service"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du service *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Ex: Coupe femme"
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Description du service..."
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="price">Prix (€) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register("price", { valueAsNumber: true })}
                    placeholder="35.00"
                  />
                  {errors.price && (
                    <p className="text-xs text-red-600 mt-1">{errors.price.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="duration">Durée (min) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    {...register("duration", { valueAsNumber: true })}
                    placeholder="45"
                  />
                  {errors.duration && (
                    <p className="text-xs text-red-600 mt-1">{errors.duration.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Input
                  id="category"
                  {...register("category")}
                  placeholder="Ex: Coiffure, Esthétique..."
                />
              </div>

              {/* Section Acompte */}
              <div className="space-y-3 p-4 bg-gradient-to-r from-amber-50/80 to-orange-50/80 rounded-lg border border-amber-200/50">
                <div className="flex items-center gap-2">
                  <input
                    id="requiresDeposit"
                    type="checkbox"
                    {...register("requiresDeposit")}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <Label htmlFor="requiresDeposit" className="text-sm font-medium text-amber-800">
                    💰 Demander un acompte pour ce service
                  </Label>
                </div>
                
                <div>
                  <Label htmlFor="depositPercentage" className="text-sm text-amber-700">
                    Pourcentage d'acompte (%)
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="depositPercentage"
                      type="number"
                      min="0"
                      max="100"
                      {...register("depositPercentage", { valueAsNumber: true })}
                      placeholder="30"
                      className="w-20"
                    />
                    <span className="text-sm text-amber-600">% du prix total</span>
                  </div>
                  <p className="text-xs text-amber-600 mt-1">
                    Recommandé : 30% pour fidéliser vos clients, 50-100% pour les nouveaux clients
                  </p>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={createServiceMutation.isPending}
              >
                {createServiceMutation.isPending 
                  ? (editingService ? "Modification..." : "Ajout en cours...") 
                  : (editingService ? "Modifier le service" : "Ajouter le service")
                }
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services list */}
      <div className="space-y-3">
        {services.length === 0 ? (
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl">
            <CardContent className="p-8 text-center">
              <Scissors className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun service
              </h3>
              <p className="text-gray-600 mb-4">
                Commencez par ajouter vos premiers services.
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un service
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {services.map((service) => (
              <Card key={service.id} className="border-0 shadow-md bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {service.name}
                      </h3>
                      {service.category && (
                        <span className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                          {service.category}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        onClick={() => openEditDialog(service)}
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteServiceMutation.mutate(service.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {service.description && (
                    <p className="text-sm text-gray-600 mb-3">
                      {service.description}
                    </p>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {service.duration} min
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Euro className="w-4 h-4 text-green-600" />
                        <span className="text-lg font-semibold text-green-600">
                          {service.price}€
                        </span>
                      </div>
                    </div>
                    
                    {/* Affichage acompte si configuré */}
                    {service.requiresDeposit && (
                      <div className="flex items-center justify-between p-2 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-amber-600" />
                          <span className="text-sm text-amber-700 font-medium">
                            Acompte {service.depositPercentage || 30}%
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-amber-700">
                          {Math.round((service.price * (service.depositPercentage || 30)) / 100)}€
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}