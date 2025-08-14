import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, User, Phone, Mail, Calendar, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertClientSchema, type Client } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type InsertClientForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
};

const clientFormSchema = insertClientSchema.extend({
  notes: insertClientSchema.shape.notes.optional(),
});

export default function Clients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["/api/clients"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertClientForm) => 
      apiRequest("POST", "/api/clients", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Client créé",
        description: "Le client a été ajouté avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le client.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertClientForm> }) =>
      apiRequest("PATCH", `/api/clients/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      setIsDialogOpen(false);
      setEditingClient(null);
      form.reset();
      toast({
        title: "Client modifié",
        description: "Les informations du client ont été mises à jour.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier le client.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/clients/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le client.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<InsertClientForm>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  const filteredClients = clients.filter((client: Client) =>
    `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone?.includes(searchQuery)
  );

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    form.reset({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email || "",
      phone: client.phone || "",
      notes: client.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleNewClient = () => {
    setEditingClient(null);
    form.reset({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: "",
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: InsertClientForm) => {
    if (editingClient) {
      updateMutation.mutate({ id: editingClient.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-violet-100 via-purple-50 to-amber-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestion des clients</h1>
          <p className="text-gray-600 text-sm mt-1">
            {filteredClients.length} client{filteredClients.length > 1 ? "s" : ""}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button 
              className="glass-button text-black px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl inline-flex items-center"
              onClick={handleNewClient}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau client
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingClient ? "Modifier le client" : "Nouveau client"}
              </DialogTitle>
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
                          <Input {...field} />
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
                          <Input {...field} />
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
                        <Input type="email" {...field} />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Notes optionnelles..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsDialogOpen(false)}
                    className="glass-button text-black px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="glass-button text-black px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl disabled:opacity-50"
                  >
                    {editingClient ? "Modifier" : "Créer"}
                  </button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Rechercher un client..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 glass-effect border-white/20"
        />
      </div>

      {/* Clients List */}
      <div className="grid gap-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="glass-card border-0 shadow-md rounded-xl">
                <CardContent className="p-4">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredClients.length === 0 ? (
          <Card className="glass-card border-0 shadow-md rounded-xl">
            <CardContent className="p-8 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? "Aucun client trouvé" : "Aucun client"}
              </h3>
              <p className="text-gray-600 text-sm">
                {searchQuery 
                  ? "Essayez de modifier votre recherche" 
                  : "Commencez par ajouter votre premier client"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredClients.map((client: Client) => (
            <Card key={client.id} className="glass-card border-0 shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {client.firstName} {client.lastName}
                      </h3>
                      <div className="flex items-center space-x-4 text-xs text-gray-600 mt-1">
                        {client.email && (
                          <div className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {client.email}
                          </div>
                        )}
                        {client.phone && (
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {client.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(client)}
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(client.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {client.notes && (
                  <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded-lg">
                    {client.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}