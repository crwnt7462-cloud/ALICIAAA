import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface SalonPhoto {
  id: number;
  userId: string;
  photoUrl: string;
  photoType: string;
  caption: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  userId: string;
}

export default function SalonPhotosManager({ userId }: Props) {
  const [photos, setPhotos] = useState<SalonPhoto[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [newPhoto, setNewPhoto] = useState({
    photoUrl: "",
    photoType: "gallery",
    caption: "",
    sortOrder: 0,
  });

  useEffect(() => {
    fetchPhotos();
  }, [userId]);

  const fetchPhotos = async () => {
    try {
      const response = await fetch(`/api/salon-photos/${userId}`);
      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error("Error fetching photos:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les photos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPhoto = async () => {
    try {
      if (!newPhoto.photoUrl) {
        toast({
          title: "Erreur",
          description: "Veuillez fournir une URL de photo",
          variant: "destructive",
        });
        return;
      }

      const photoData = {
        ...newPhoto,
        userId,
      };

      const response = await apiRequest("/api/salon-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(photoData),
      });

      setPhotos([...photos, response]);
      setNewPhoto({
        photoUrl: "",
        photoType: "gallery",
        caption: "",
        sortOrder: 0,
      });
      setShowAddForm(false);

      toast({
        title: "Succès",
        description: "Photo ajoutée avec succès",
      });
    } catch (error) {
      console.error("Error adding photo:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la photo",
        variant: "destructive",
      });
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    try {
      await apiRequest(`/api/salon-photos/${photoId}`, {
        method: "DELETE",
      });

      setPhotos(photos.filter(photo => photo.id !== photoId));

      toast({
        title: "Succès",
        description: "Photo supprimée avec succès",
      });
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la photo",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Chargement des photos...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Gestion des Photos du Salon</h1>
        <p className="text-gray-600">
          Ajoutez et gérez les photos de votre salon qui s'afficheront sur votre page publique.
        </p>
      </div>

      <div className="mb-6">
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-violet-500/30 backdrop-blur-md border border-violet-300/20 hover:bg-violet-500/30 backdrop-blur-md border border-violet-300/20 text-white"
        >
          {showAddForm ? "Annuler" : "Ajouter une Photo"}
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6 border border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Ajouter une nouvelle photo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="photoUrl">URL de la photo *</Label>
              <Input
                id="photoUrl"
                value={newPhoto.photoUrl}
                onChange={(e) => setNewPhoto({ ...newPhoto, photoUrl: e.target.value })}
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div>
              <Label htmlFor="photoType">Type de photo</Label>
              <Select
                value={newPhoto.photoType}
                onValueChange={(value) => setNewPhoto({ ...newPhoto, photoType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="logo">Logo</SelectItem>
                  <SelectItem value="interior">Intérieur</SelectItem>
                  <SelectItem value="team">Équipe</SelectItem>
                  <SelectItem value="results">Résultats</SelectItem>
                  <SelectItem value="gallery">Galerie</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="caption">Légende</Label>
              <Textarea
                id="caption"
                value={newPhoto.caption}
                onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                placeholder="Description de la photo..."
              />
            </div>

            <div>
              <Label htmlFor="sortOrder">Ordre d'affichage</Label>
              <Input
                id="sortOrder"
                type="number"
                value={newPhoto.sortOrder}
                onChange={(e) => setNewPhoto({ ...newPhoto, sortOrder: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddPhoto} className="bg-violet-500/30 backdrop-blur-md border border-violet-300/20 hover:bg-violet-500/30 backdrop-blur-md border border-violet-300/20">
                Ajouter
              </Button>
              <Button onClick={() => setShowAddForm(false)} variant="outline">
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <Card key={photo.id} className="border border-gray-200 rounded-xl shadow-sm">
            <CardContent className="p-4">
              <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-violet-500/30 backdrop-blur-md border border-violet-300/20">
                <img
                  src={photo.photoUrl}
                  alt={photo.caption || "Photo du salon"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e5e5e5'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' fill='%23999' text-anchor='middle' dy='.3em'%3EImage non disponible%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">
                    {photo.photoType}
                  </span>
                  <span className="text-xs text-gray-500">
                    Ordre: {photo.sortOrder}
                  </span>
                </div>

                {photo.caption && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {photo.caption}
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {photos.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune photo ajoutée
          </h3>
          <p className="text-gray-500 mb-4">
            Commencez par ajouter des photos de votre salon pour les afficher sur votre page publique.
          </p>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-violet-500/30 backdrop-blur-md border border-violet-300/20 hover:bg-violet-500/30 backdrop-blur-md border border-violet-300/20 text-white"
          >
            Ajouter votre première photo
          </Button>
        </div>
      )}
    </div>
  );
}