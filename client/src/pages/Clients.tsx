import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

  const { data: clients = [] } = useQuery({
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
    onSuccess: () => {
      toast({
        title: "Client ajouté",
        description: "Le client a été ajouté avec succès.",
      });
      setIsDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
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
    <div className="p-4 space-y-4">
      {/* Search and Filter */}
      <div className="flex space-x-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher un client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600"
          />
        </div>
        <Button
          variant="outline"
          className="px-4 py-3 bg-gray-100 dark:bg-dark-700 rounded-xl border border-gray-200 dark:border-gray-600"
        >
          <Filter className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </Button>
      </div>

      {/* Client List */}
      <div className="space-y-3">
        {clients.map((client: any) => (
          <Card key={client.id}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {client.firstName[0]}{client.lastName[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      {client.firstName} {client.lastName}
                    </h3>
                    {renderStars(client.rating)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Dernière visite: {
                      client.lastVisit 
                        ? new Date(client.lastVisit).toLocaleDateString('fr-FR')
                        : 'Aucune visite'
                    }
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {client.visitCount || 0} visites • {client.totalSpent || 0}€ total
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button
                    size="sm"
                    className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium"
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    RDV
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="px-3 py-1 bg-gray-100 dark:bg-dark-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                  >
                    <MessageCircle className="w-3 h-3" />
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
