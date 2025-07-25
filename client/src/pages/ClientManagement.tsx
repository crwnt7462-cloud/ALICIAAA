import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Camera, Tag, AlertTriangle, Heart, User } from 'lucide-react';
import { useLocation } from 'wouter';
import AuthGuard from '@/components/AuthGuard';
import { apiRequest } from '@/lib/queryClient';

type ClientNote = {
  id: string;
  clientId: string;
  professionalId: string;
  notes?: string;
  photos: string[];
  allergies: string[];
  tags: string[];
  preferences?: string;
  lastVisit?: string;
  createdAt: string;
  updatedAt: string;
};

type Client = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  note?: ClientNote;
};

type CustomTag = {
  id: string;
  professionalId: string;
  name: string;
  color: string;
  category: string;
  createdAt: string;
};

export default function ClientManagement() {
  const [, setLocation] = useLocation();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [noteForm, setNoteForm] = useState({
    notes: '',
    allergies: [] as string[],
    tags: [] as string[],
    preferences: '',
    photos: [] as string[]
  });
  const [newTag, setNewTag] = useState({ name: '', color: '#6366f1', category: 'general' });
  const [newClient, setNewClient] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer la liste des clients avec leurs notes
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['/api/clients-with-notes'],
    refetchOnWindowFocus: false
  });

  // Récupérer les tags personnalisés
  const { data: customTags = [] } = useQuery<CustomTag[]>({
    queryKey: ['/api/custom-tags'],
    refetchOnWindowFocus: false
  });

  // Mutation pour sauvegarder les notes client
  const saveNoteMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/client-notes', data);
    },
    onSuccess: () => {
      toast({
        title: "Notes sauvegardées",
        description: "Les informations client ont été mises à jour avec succès"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/clients-with-notes'] });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les notes",
        variant: "destructive"
      });
    }
  });

  // Mutation pour créer un tag personnalisé
  const createTagMutation = useMutation({
    mutationFn: async (tagData: any) => {
      return await apiRequest('POST', '/api/custom-tags', tagData);
    },
    onSuccess: () => {
      toast({
        title: "Tag créé",
        description: "Le nouveau tag a été ajouté avec succès"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/custom-tags'] });
      setNewTag({ name: '', color: '#6366f1', category: 'general' });
    }
  });

  // Mutation pour créer un nouveau client
  const createClientMutation = useMutation({
    mutationFn: async (clientData: any) => {
      return await apiRequest('POST', '/api/clients', clientData);
    },
    onSuccess: () => {
      toast({
        title: "Client créé",
        description: "Le nouveau client a été ajouté avec succès"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/clients-with-notes'] });
      setNewClient({ firstName: '', lastName: '', email: '', phone: '' });
      setIsCreateDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de créer le client",
        variant: "destructive"
      });
    }
  });

  // Initialiser le formulaire quand un client est sélectionné
  useEffect(() => {
    if (selectedClient && selectedClient.note) {
      setNoteForm({
        notes: selectedClient.note.notes || '',
        allergies: selectedClient.note.allergies || [],
        tags: selectedClient.note.tags || [],
        preferences: selectedClient.note.preferences || '',
        photos: selectedClient.note.photos || []
      });
    } else if (selectedClient) {
      setNoteForm({
        notes: '',
        allergies: [],
        tags: [],
        preferences: '',
        photos: []
      });
    }
  }, [selectedClient]);

  const handleSaveNote = () => {
    if (!selectedClient) return;

    saveNoteMutation.mutate({
      clientId: selectedClient.id.toString(),
      ...noteForm
    });
  };

  const addAllergie = (allergie: string) => {
    if (allergie && !noteForm.allergies.includes(allergie)) {
      setNoteForm(prev => ({
        ...prev,
        allergies: [...prev.allergies, allergie]
      }));
    }
  };

  const removeAllergie = (allergie: string) => {
    setNoteForm(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergie)
    }));
  };

  const addTag = (tagName: string) => {
    if (tagName && !noteForm.tags.includes(tagName)) {
      setNoteForm(prev => ({
        ...prev,
        tags: [...prev.tags, tagName]
      }));
    }
  };

  const removeTag = (tag: string) => {
    setNoteForm(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const getTagColor = (tagName: string) => {
    const customTag = customTags.find(t => t.name === tagName);
    return customTag?.color || '#6366f1';
  };

  const getTagCategory = (tagName: string) => {
    const customTag = customTags.find(t => t.name === tagName);
    return customTag?.category || 'general';
  };

  if (isLoading) {
    return (
      <AuthGuard requiredAuth="pro">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des clients...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requiredAuth="pro">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation('/business-features')}
                  className="p-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Gestion Clientèle</h1>
                  <p className="text-sm text-gray-600">Notes, photos et préférences clients</p>
                </div>
              </div>
              
              {/* Création de tags personnalisés */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau Tag
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Créer un tag personnalisé</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Nom du tag</Label>
                      <Input
                        value={newTag.name}
                        onChange={(e) => setNewTag(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: VIP, Fidèle, Difficile..."
                      />
                    </div>
                    <div>
                      <Label>Catégorie</Label>
                      <Select value={newTag.category} onValueChange={(value) => setNewTag(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">Général</SelectItem>
                          <SelectItem value="allergie">Allergie</SelectItem>
                          <SelectItem value="preference">Préférence</SelectItem>
                          <SelectItem value="comportement">Comportement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Couleur</Label>
                      <Input
                        type="color"
                        value={newTag.color}
                        onChange={(e) => setNewTag(prev => ({ ...prev, color: e.target.value }))}
                      />
                    </div>
                    <Button 
                      onClick={() => createTagMutation.mutate(newTag)}
                      disabled={!newTag.name || createTagMutation.isPending}
                      className="w-full"
                    >
                      Créer le tag
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Liste des clients */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Clients ({clients.length})</CardTitle>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Nouveau Client
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Ajouter un nouveau client</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label>Prénom</Label>
                              <Input 
                                value={newClient.firstName}
                                onChange={(e) => setNewClient(prev => ({ ...prev, firstName: e.target.value }))}
                                placeholder="Prénom" 
                              />
                            </div>
                            <div>
                              <Label>Nom</Label>
                              <Input 
                                value={newClient.lastName}
                                onChange={(e) => setNewClient(prev => ({ ...prev, lastName: e.target.value }))}
                                placeholder="Nom" 
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Email</Label>
                            <Input 
                              type="email" 
                              value={newClient.email}
                              onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="email@exemple.com" 
                            />
                          </div>
                          <div>
                            <Label>Téléphone</Label>
                            <Input 
                              value={newClient.phone}
                              onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="06 12 34 56 78" 
                            />
                          </div>
                          <Button 
                            onClick={() => createClientMutation.mutate(newClient)}
                            disabled={!newClient.firstName || !newClient.lastName || !newClient.email || createClientMutation.isPending}
                            className="w-full"
                          >
                            {createClientMutation.isPending ? "Création..." : "Créer le client"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-96 overflow-y-auto">
                    {clients.map((client: Client) => (
                      <div
                        key={client.id}
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedClient?.id === client.id ? 'bg-purple-50 border-purple-200' : ''
                        }`}
                        onClick={() => setSelectedClient(client)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {client.firstName} {client.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">{client.email}</p>
                            {client.note && (
                              <div className="flex gap-1 mt-2">
                                {client.note.tags.slice(0, 2).map(tag => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    style={{ backgroundColor: getTagColor(tag) + '20', color: getTagColor(tag) }}
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                                {client.note.tags.length > 2 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{client.note.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            {client.note?.allergies && client.note.allergies.length > 0 && (
                              <AlertTriangle className="w-4 h-4 text-orange-500" />
                            )}
                            {client.note?.notes && (
                              <Edit3 className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Détails du client sélectionné */}
            <div className="lg:col-span-2">
              {selectedClient ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <User className="w-6 h-6 text-purple-600" />
                        <div>
                          <CardTitle className="text-lg">
                            {selectedClient.firstName} {selectedClient.lastName}
                          </CardTitle>
                          <p className="text-sm text-gray-600">{selectedClient.email}</p>
                        </div>
                      </div>
{isEditing ? (
                        <Button
                          onClick={handleSaveNote}
                          disabled={saveNoteMutation.isPending}
                          size="sm"
                        >
                          Sauvegarder
                        </Button>
                      ) : (
                        <Button
                          onClick={() => setIsEditing(true)}
                          variant="outline"
                          size="sm"
                        >
                          Modifier
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    
                    {/* Notes personnelles */}
                    <div>
                      <Label className="text-base font-medium">Notes personnelles</Label>
                      <Textarea
                        value={noteForm.notes}
                        onChange={(e) => setNoteForm(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Ajoutez vos notes sur ce client..."
                        disabled={!isEditing}
                        className="mt-2"
                        rows={4}
                      />
                    </div>

                    {/* Allergies */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        <Label className="text-base font-medium">Allergies</Label>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {noteForm.allergies.map(allergie => (
                          <Badge
                            key={allergie}
                            variant="secondary"
                            className="bg-orange-100 text-orange-800"
                          >
                            {allergie}
                            {isEditing && (
                              <button
                                onClick={() => removeAllergie(allergie)}
                                className="ml-2 text-orange-600 hover:text-orange-800"
                              >
                                ×
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                      {isEditing && (
                        <Input
                          placeholder="Ajouter une allergie (Appuyez sur Entrée)"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const value = e.currentTarget.value.trim();
                              if (value) {
                                addAllergie(value);
                                e.currentTarget.value = '';
                              }
                            }
                          }}
                        />
                      )}
                    </div>

                    {/* Tags personnalisés */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="w-5 h-5 text-purple-500" />
                        <Label className="text-base font-medium">Tags</Label>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {noteForm.tags.map(tag => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            style={{ backgroundColor: getTagColor(tag) + '20', color: getTagColor(tag) }}
                          >
                            {tag}
                            {isEditing && (
                              <button
                                onClick={() => removeTag(tag)}
                                className="ml-2 hover:opacity-70"
                              >
                                ×
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                      {isEditing && (
                        <Select onValueChange={(value) => addTag(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Ajouter un tag" />
                          </SelectTrigger>
                          <SelectContent>
                            {customTags.map(tag => (
                              <SelectItem key={tag.id} value={tag.name}>
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: tag.color }}
                                  ></div>
                                  {tag.name}
                                  <span className="text-xs text-gray-500">({tag.category})</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    {/* Préférences */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Heart className="w-5 h-5 text-pink-500" />
                        <Label className="text-base font-medium">Préférences</Label>
                      </div>
                      <Textarea
                        value={noteForm.preferences}
                        onChange={(e) => setNoteForm(prev => ({ ...prev, preferences: e.target.value }))}
                        placeholder="Préférences, habitudes, demandes spéciales..."
                        disabled={!isEditing}
                        rows={3}
                      />
                    </div>

                    {/* Photos */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Camera className="w-5 h-5 text-blue-500" />
                        <Label className="text-base font-medium">Photos</Label>
                      </div>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Fonctionnalité photos à venir
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Coiffures, avant/après, références...
                        </p>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex gap-3 pt-4 border-t">
                        <Button
                          onClick={handleSaveNote}
                          disabled={saveNoteMutation.isPending}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Sauvegarder les modifications
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Annuler
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Sélectionnez un client
                    </h3>
                    <p className="text-gray-600">
                      Choisissez un client dans la liste pour voir et modifier ses informations
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}