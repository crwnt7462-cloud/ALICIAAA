// Gestion des clients avec notes et popup
import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Search, User, Star, Calendar, MessageCircle, Phone, Mail, Plus, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ClientNote {
  id: string;
  content: string;
  date: string;
  category: 'general' | 'preference' | 'allergie' | 'important';
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  totalVisits: number;
  favoriteService: string;
  status: 'vip' | 'fidele' | 'regulier' | 'nouveau';
  notes: ClientNote[];
}

export default function ClientManagement() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState({
    content: '',
    category: 'general' as const
  });

  const clients: Client[] = [
    {
      id: '1',
      name: 'Marie Dupont',
      email: 'marie@example.com',
      phone: '06 12 34 56 78',
      lastVisit: '2024-01-20',
      totalVisits: 15,
      favoriteService: 'Coupe + Couleur',
      status: 'vip',
      notes: [
        { id: '1', content: 'Préfère les RDV le matin', date: '2024-01-15', category: 'preference' },
        { id: '2', content: 'Allergique aux produits à base d\'ammoniaque', date: '2024-01-10', category: 'allergie' }
      ]
    },
    {
      id: '2',
      name: 'Sophie Martin',
      email: 'sophie.martin@gmail.com',
      phone: '06 98 76 54 32',
      lastVisit: '2024-01-18',
      totalVisits: 8,
      favoriteService: 'Soin du visage',
      status: 'fidele',
      notes: [
        { id: '3', content: 'Très satisfaite du dernier soin', date: '2024-01-18', category: 'general' }
      ]
    },
    {
      id: '3',
      name: 'Emma Laurent',
      email: 'emma.laurent@outlook.fr',
      phone: '07 11 22 33 44',
      lastVisit: '2024-01-22',
      totalVisits: 3,
      favoriteService: 'Manucure',
      status: 'regulier',
      notes: []
    }
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vip': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'fidele': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'regulier': return 'bg-green-100 text-green-800 border-green-200';
      case 'nouveau': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'allergie': return 'bg-red-100 text-red-800 border-red-200';
      case 'important': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'preference': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const addNote = () => {
    if (!newNote.content.trim() || !selectedClient) return;

    const note: ClientNote = {
      id: Date.now().toString(),
      content: newNote.content,
      date: new Date().toISOString().split('T')[0],
      category: newNote.category
    };

    // Simuler l'ajout en mémoire
    selectedClient.notes.push(note);
    
    toast({
      title: "Note ajoutée",
      description: `Note ajoutée pour ${selectedClient.name}`
    });

    setNewNote({ content: '', category: 'general' });
    setIsNoteDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/business-features')}
              className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Gestion Clients</h1>
              <p className="text-gray-600">Gérez vos clients et leurs notes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Liste des clients */}
          <div className="lg:col-span-5">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Clients ({filteredClients.length})</CardTitle>
                  <Badge variant="secondary">{clients.length} total</Badge>
                </div>
                
                {/* Recherche */}
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Rechercher un client..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="space-y-0 max-h-96 overflow-y-auto">
                  {filteredClients.map((client) => (
                    <div
                      key={client.id}
                      className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedClient?.id === client.id ? 'bg-violet-50 border-violet-200' : ''
                      }`}
                      onClick={() => setSelectedClient(client)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{client.name}</h4>
                        <Badge className={`text-xs ${getStatusColor(client.status)}`}>
                          {client.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{client.email}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{client.totalVisits} visites</span>
                        <span>Dernière: {new Date(client.lastVisit).toLocaleDateString('fr-FR')}</span>
                      </div>
                      {client.notes.length > 0 && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            {client.notes.length} note{client.notes.length > 1 ? 's' : ''}
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Détail du client */}
          <div className="lg:col-span-7">
            {selectedClient ? (
              <div className="space-y-6">
                {/* Informations client */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{selectedClient.name}</CardTitle>
                          <Badge className={`${getStatusColor(selectedClient.status)} mt-1`}>
                            {selectedClient.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Email</p>
                        <p className="font-medium">{selectedClient.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Téléphone</p>
                        <p className="font-medium">{selectedClient.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Dernière visite</p>
                        <p className="font-medium">{new Date(selectedClient.lastVisit).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total visites</p>
                        <p className="font-medium">{selectedClient.totalVisits}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-600">Service préféré</p>
                        <p className="font-medium">{selectedClient.favoriteService}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes du client */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Notes Client</CardTitle>
                      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter une note
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Nouvelle note pour {selectedClient.name}</DialogTitle>
                            <DialogDescription>
                              Ajoutez une note personnalisée pour ce client
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Catégorie :</label>
                              <select
                                value={newNote.category}
                                onChange={(e) => setNewNote({...newNote, category: e.target.value as any})}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                              >
                                <option value="general">Général</option>
                                <option value="preference">Préférence</option>
                                <option value="allergie">Allergie</option>
                                <option value="important">Important</option>
                              </select>
                            </div>
                            
                            <Textarea
                              placeholder="Tapez votre note..."
                              value={newNote.content}
                              onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                              rows={4}
                            />
                          </div>
                          
                          <DialogFooter>
                            <Button
                              onClick={addNote}
                              disabled={!newNote.content.trim()}
                              className="bg-violet-600 hover:bg-violet-700 text-white"
                            >
                              Ajouter la note
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      {selectedClient.notes.length === 0 ? (
                        <div className="text-center py-8">
                          <Edit className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-600">Aucune note pour ce client</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-3"
                            onClick={() => setIsNoteDialogOpen(true)}
                          >
                            Ajouter la première note
                          </Button>
                        </div>
                      ) : (
                        selectedClient.notes.map((note) => (
                          <div key={note.id} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <Badge className={`text-xs ${getCategoryColor(note.category)}`}>
                                {note.category}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(note.date).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900">{note.content}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez un client</h3>
                  <p className="text-gray-600">Choisissez un client dans la liste pour voir ses détails et notes</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}