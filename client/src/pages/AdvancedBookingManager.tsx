import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Plus,
  User,
  Camera,
  FileText,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Appointment {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
  isManualBlock: boolean;
  createdByPro: boolean;
  allowOverlap: boolean;
  notes?: string;
  clientName?: string;
  staffId?: number;
}

interface ClientNote {
  id: number;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  isEditable: boolean;
}

interface ClientPhoto {
  id: number;
  photoUrl: string;
  fileName?: string;
  caption?: string;
  uploadedAt: string;
}

export default function AdvancedBookingManager() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showManualBlockModal, setShowManualBlockModal] = useState(false);
  const [showClientNotesModal, setShowClientNotesModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // États pour le bloc manuel
  const [blockData, setBlockData] = useState({
    startTime: '',
    endTime: '',
    notes: '',
    staffId: null as number | null
  });

  // États pour les notes client
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [clientNotes, setClientNotes] = useState<ClientNote[]>([]);
  const [clientPhotos, setClientPhotos] = useState<ClientPhoto[]>([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState<{ id: number; content: string } | null>(null);

  // Charger les rendez-vous avec info sur les blocs manuels
  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('GET', `/api/appointments/with-blocks/${selectedDate}`);
      setAppointments(response);
    } catch (error) {
      console.error('Erreur chargement rendez-vous:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les rendez-vous",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Vérifier les conflits avant création
  const checkOverlap = async (data: any) => {
    try {
      const response = await apiRequest('POST', '/api/appointments/check-overlap', {
        date: selectedDate,
        startTime: data.startTime,
        endTime: data.endTime,
        staffId: data.staffId,
        isManualBlock: true
      });
      return response;
    } catch (error) {
      console.error('Erreur vérification overlap:', error);
      return { hasConflict: false, canProceed: false, reason: 'Erreur de vérification' };
    }
  };

  // Créer un bloc manuel
  const createManualBlock = async () => {
    if (!blockData.startTime || !blockData.endTime) {
      toast({
        title: "Données manquantes",
        description: "Veuillez remplir les heures de début et fin",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      // Vérifier d'abord les conflits
      const overlapCheck = await checkOverlap(blockData);
      
      if (!overlapCheck.canProceed && !overlapCheck.reason?.includes('autorisé')) {
        toast({
          title: "Conflit détecté",
          description: overlapCheck.reason || "Créneau non disponible",
          variant: "destructive"
        });
        return;
      }

      // Créer le bloc manuel
      await apiRequest('POST', '/api/appointments/manual-block', {
        date: selectedDate,
        startTime: blockData.startTime,
        endTime: blockData.endTime,
        staffId: blockData.staffId,
        notes: blockData.notes || 'Créneau bloqué manuellement'
      });

      toast({
        title: "Bloc créé",
        description: overlapCheck.hasConflict 
          ? "Bloc manuel créé avec chevauchement autorisé" 
          : "Bloc manuel créé avec succès",
        variant: overlapCheck.hasConflict ? "default" : "default"
      });

      setShowManualBlockModal(false);
      setBlockData({ startTime: '', endTime: '', notes: '', staffId: null });
      loadAppointments();

    } catch (error) {
      console.error('Erreur création bloc manuel:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le bloc manuel",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger les notes et photos d'un client
  const loadClientData = async (clientId: number) => {
    try {
      const [notesResponse, photosResponse] = await Promise.all([
        apiRequest('GET', `/api/clients/${clientId}/notes`),
        apiRequest('GET', `/api/clients/${clientId}/photos`)
      ]);
      
      setClientNotes(notesResponse);
      setClientPhotos(photosResponse);
    } catch (error) {
      console.error('Erreur chargement données client:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données client",
        variant: "destructive"
      });
    }
  };

  // Ajouter une note client
  const addClientNote = async () => {
    if (!newNote.trim() || !selectedClientId) return;

    try {
      await apiRequest('POST', `/api/clients/${selectedClientId}/notes`, {
        content: newNote,
        author: 'Professionnel'
      });

      setNewNote('');
      loadClientData(selectedClientId);
      
      toast({
        title: "Note ajoutée",
        description: "Note de suivi créée avec succès"
      });
    } catch (error) {
      console.error('Erreur ajout note:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la note",
        variant: "destructive"
      });
    }
  };

  // Mettre à jour une note
  const updateNote = async () => {
    if (!editingNote) return;

    try {
      await apiRequest('PUT', `/api/clients/notes/${editingNote.id}`, {
        content: editingNote.content
      });

      setEditingNote(null);
      if (selectedClientId) loadClientData(selectedClientId);
      
      toast({
        title: "Note modifiée",
        description: "Note mise à jour avec succès"
      });
    } catch (error) {
      console.error('Erreur modification note:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la note",
        variant: "destructive"
      });
    }
  };

  // Supprimer une note
  const deleteNote = async (noteId: number) => {
    try {
      await apiRequest('DELETE', `/api/clients/notes/${noteId}`);
      
      if (selectedClientId) loadClientData(selectedClientId);
      
      toast({
        title: "Note supprimée",
        description: "Note retirée avec succès"
      });
    } catch (error) {
      console.error('Erreur suppression note:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la note",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [selectedDate]);

  const formatTime = (time: string) => {
    return time.slice(0, 5); // HH:MM
  };

  const renderAppointmentCard = (appointment: Appointment) => {
    const isManualBlock = appointment.isManualBlock;
    const hasOverlap = appointments.some(other => 
      other.id !== appointment.id &&
      other.startTime < appointment.endTime &&
      other.endTime > appointment.startTime
    );

    return (
      <Card 
        key={appointment.id} 
        className={`mb-3 ${isManualBlock ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="font-medium">
                  {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                </span>
                
                {isManualBlock && (
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    <Settings className="w-3 h-3 mr-1" />
                    Bloc manuel
                  </Badge>
                )}
                
                {hasOverlap && (
                  <Badge variant="secondary" className="text-red-600 border-red-600">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Chevauchement
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-gray-600">
                {appointment.clientName || appointment.notes || 'Aucune information'}
              </p>
              
              {appointment.notes && !isManualBlock && (
                <p className="text-xs text-gray-500 mt-1">Note: {appointment.notes}</p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {appointment.status}
              </Badge>
              
              {appointment.createdByPro && (
                <CheckCircle className="w-4 h-4 text-green-500" title="Créé par professionnel" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Gestion Avancée des Réservations
          </h1>
          <p className="text-gray-600">
            Système de chevauchements manuels et gestion des fiches clients
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Planning principal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Planning du {selectedDate}
                  </span>
                  <Button 
                    onClick={() => setShowManualBlockModal(true)}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Bloc manuel
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-auto"
                  />
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-2 text-gray-500">Chargement...</p>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Aucun rendez-vous pour cette date</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {appointments
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map(renderAppointmentCard)}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panneau latéral - Outils client */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Gestion Client
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedClientId(1); // Exemple - remplacer par sélection client
                      setShowClientNotesModal(true);
                      loadClientData(1);
                    }}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Notes de suivi
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedClientId(1); // Exemple - remplacer par sélection client
                      setShowClientNotesModal(true);
                      loadClientData(1);
                    }}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Photos client
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Règles de Chevauchement</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Blocs manuels : chevauchement autorisé</span>
                </div>
                <div className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Réservations en ligne : conflit interdit</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Badge orange : bloc créé par professionnel</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal bloc manuel */}
      <Dialog open={showManualBlockModal} onOpenChange={setShowManualBlockModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un Bloc Manuel</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Heure début</label>
                <Input
                  type="time"
                  value={blockData.startTime}
                  onChange={(e) => setBlockData({...blockData, startTime: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Heure fin</label>
                <Input
                  type="time"
                  value={blockData.endTime}
                  onChange={(e) => setBlockData({...blockData, endTime: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Notes (optionnel)</label>
              <Textarea
                value={blockData.notes}
                onChange={(e) => setBlockData({...blockData, notes: e.target.value})}
                placeholder="Raison du blocage..."
              />
            </div>
            
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-800">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                Les blocs manuels peuvent chevaucher avec des rendez-vous existants
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowManualBlockModal(false)}>
              Annuler
            </Button>
            <Button onClick={createManualBlock} disabled={loading}>
              {loading ? 'Création...' : 'Créer le bloc'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal notes/photos client */}
      <Dialog open={showClientNotesModal} onOpenChange={setShowClientNotesModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Fiche Client - Notes et Photos</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Section Notes */}
            <div>
              <h3 className="text-lg font-medium mb-3">Notes de suivi</h3>
              
              <div className="space-y-3 mb-4">
                <Textarea
                  placeholder="Ajouter une nouvelle note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <Button onClick={addClientNote} disabled={!newNote.trim()}>
                  Ajouter la note
                </Button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {clientNotes.map((note) => (
                  <Card key={note.id} className="p-3">
                    {editingNote?.id === note.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editingNote.content}
                          onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={updateNote}>Sauvegarder</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingNote(null)}>
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm mb-2">{note.content}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>Par {note.author} • {new Date(note.createdAt).toLocaleDateString()}</span>
                          <div className="flex gap-2">
                            {note.isEditable && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => setEditingNote({id: note.id, content: note.content})}
                              >
                                Modifier
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => deleteNote(note.id)}
                              className="text-red-600"
                            >
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Section Photos */}
            <div>
              <h3 className="text-lg font-medium mb-3">Photos client</h3>
              
              <div className="grid grid-cols-2 gap-3">
                {clientPhotos.map((photo) => (
                  <Card key={photo.id} className="p-2">
                    <img 
                      src={photo.photoUrl} 
                      alt={photo.caption || 'Photo client'}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <p className="text-xs text-gray-600">
                      {photo.caption || 'Sans légende'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(photo.uploadedAt).toLocaleDateString()}
                    </p>
                  </Card>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-3">
                <Camera className="w-4 h-4 mr-2" />
                Ajouter une photo
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowClientNotesModal(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}