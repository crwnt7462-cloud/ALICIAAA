import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Search, Filter, Star, UserPlus, MessageCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertClientSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Clients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: clients = [] } = useQuery<any[]>({
    queryKey: ["/api/clients", searchQuery],
    enabled: true,
  });

  const form = useForm({
    resolver: zodResolver(insertClientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: "",
      preferences: "",
    },
  });

  const createClientMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/clients", data);
      return response.json();
    },
    onSuccess: (newClient) => {
      toast({
        title: "Client ajouté",
        description: "Le client a été ajouté avec succès. Redirection vers la réservation...",
      });
      setIsDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      
      // Rediriger automatiquement vers la page de réservation avec le client pré-sélectionné
      setTimeout(() => {
        setLocation(`/booking?clientId=${newClient.id}&clientName=${encodeURIComponent(newClient.firstName + ' ' + newClient.lastName)}`);
      }, 1000);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le client.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    createClientMutation.mutate(data);
  };

  const renderStars = (rating: number = 5) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4 bg-gradient-to-br from-gray-50/50 to-purple-50/30 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Clients</h1>
          <p className="text-gray-600 mt-1 flex items-center text-xs">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
            {clients.length} clients actifs
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-bg text-white px-3 py-1.5 rounded-lg font-medium shadow-md hover:scale-105 transition-all duration-200 text-xs">
              <UserPlus className="w-3 h-3 mr-1" />
              Nouveau client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter un client</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    {...form.register("firstName")}
                    placeholder="Prénom"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    {...form.register("lastName")}
                    placeholder="Nom"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  {...form.register("email")}
                  type="email"
                  placeholder="email@exemple.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  {...form.register("phone")}
                  placeholder="06 12 34 56 78"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  {...form.register("notes")}
                  placeholder="Notes sur le client..."
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full" disabled={createClientMutation.isPending}>
                {createClientMutation.isPending ? "Ajout..." : "Ajouter le client"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Rechercher un client..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-10 bg-white border-gray-200"
        />
      </div>

      {/* Client List */}
      <div className="space-y-3">
        {clients.map((client: any) => (
          <Card key={client.id} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {client.firstName?.[0]}{client.lastName?.[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {client.firstName} {client.lastName}
                    </h3>
                    {renderStars(client.rating)}
                  </div>
                  <p className="text-sm text-gray-500 mb-1">
                    {client.email || 'Pas d\'email'}
                  </p>
                  <div className="flex items-center text-xs text-gray-400 space-x-3">
                    <span>{client.visitCount || 0} visites</span>
                    <span>•</span>
                    <span>{client.totalSpent || 0}€ total</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-8">
                    <Calendar className="w-4 h-4 mr-1" />
                    RDV
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Client Button */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-semibold mt-6">
            <UserPlus className="w-4 h-4 mr-2" />
            Ajouter un nouveau client
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau client</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Prénom</Label>
                <Input {...form.register('firstName')} />
              </div>
              <div>
                <Label>Nom</Label>
                <Input {...form.register('lastName')} />
              </div>
            </div>

            <div>
              <Label>Email</Label>
              <Input type="email" {...form.register('email')} />
            </div>

            <div>
              <Label>Téléphone</Label>
              <Input {...form.register('phone')} />
            </div>

            <div>
              <Label>Préférences</Label>
              <Textarea {...form.register('preferences')} placeholder="Couleurs préférées, allergies, etc." />
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea {...form.register('notes')} placeholder="Notes privées sur le client" />
            </div>

            <Button type="submit" className="w-full" disabled={createClientMutation.isPending}>
              {createClientMutation.isPending ? "Ajout en cours..." : "Ajouter le client"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
