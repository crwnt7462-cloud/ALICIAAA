import { useState, useEffect } from 'react';
import { 
  Camera, 
  Plus, 
  Edit3, 
 
  X, 
  ChevronLeft, 
  ChevronRight,
  Upload,
  Image as ImageIcon,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ObjectUploader } from './ObjectUploader';

interface Album {
  id: number;
  name: string;
  description: string;
  coverImageUrl: string;
  photoCount: number;
  isPublic: boolean;
  sortOrder: number;
}

interface Photo {
  id: number;
  imageUrl: string;
  thumbnailUrl: string;
  highResUrl: string;
  title: string;
  description: string;
  tags: string[];
  width: number;
  height: number;
}

interface AdvancedGalleryProps {
  salonId: string;
  isOwner?: boolean; // Si l'utilisateur peut éditer
}

export function AdvancedGallery({ salonId, isOwner = false }: AdvancedGalleryProps) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [newAlbumDialog, setNewAlbumDialog] = useState(false);
  const [editPhotoDialog, setEditPhotoDialog] = useState(false);
  const [photoToEdit, setPhotoToEdit] = useState<Photo | null>(null);

  // Charger les albums
  useEffect(() => {
    const loadAlbums = async () => {
      try {
        const response = await fetch(`/api/salons/${salonId}/albums`);
        if (response.ok) {
          const data = await response.json();
          setAlbums(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des albums:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAlbums();
  }, [salonId]);

  // Charger les photos d'un album
  const loadAlbumPhotos = async (album: Album) => {
    try {
      const response = await fetch(`/api/salons/${salonId}/albums/${album.id}/photos`);
      if (response.ok) {
        const photos = await response.json();
        setAlbumPhotos(photos);
        setSelectedAlbum(album);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des photos:', error);
    }
  };

  // Ouvrir le viewer de photo
  const openPhotoViewer = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setPhotoIndex(index);
  };

  // Navigation dans le viewer
  const nextPhoto = () => {
    if (photoIndex < albumPhotos.length - 1) {
      const newIndex = photoIndex + 1;
      setPhotoIndex(newIndex);
      setSelectedPhoto(albumPhotos[newIndex] || null);
    }
  };

  const prevPhoto = () => {
    if (photoIndex > 0) {
      const newIndex = photoIndex - 1;
      setPhotoIndex(newIndex);
      setSelectedPhoto(albumPhotos[newIndex] || null);
    }
  };

  // Gestion upload photos
  const handleGetUploadParameters = async () => {
    try {
      const response = await fetch('/api/objects/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      return {
        method: 'PUT' as const,
        url: data.uploadURL
      };
    } catch (error) {
      console.error('Erreur upload:', error);
      throw error;
    }
  };

  const handleUploadComplete = (result: any) => {
    console.log('Upload terminé:', result);
    // Actualiser les photos après upload
    if (selectedAlbum) {
      loadAlbumPhotos(selectedAlbum);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  // Vue album sélectionné
  if (selectedAlbum) {
    return (
      <div className="space-y-6">
        {/* Header album */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedAlbum(null);
                setAlbumPhotos([]);
              }}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Retour aux albums
            </Button>
            <div>
              <h2 className="avyento-title text-gray-900 mb-1">{selectedAlbum.name}</h2>
              <p className="text-gray-600 text-sm">{selectedAlbum.description}</p>
              <p className="text-gray-500 text-xs mt-1">{albumPhotos.length} photos</p>
            </div>
          </div>
          
          {isOwner && (
            <div className="flex items-center gap-2">
              <ObjectUploader
                maxNumberOfFiles={10}
                maxFileSize={20971520} // 20MB
                onGetUploadParameters={handleGetUploadParameters}
                onComplete={handleUploadComplete}
                buttonClassName="avyento-button-primary"
              >
                <Upload className="h-4 w-4 mr-2" />
                Ajouter des photos
              </ObjectUploader>
            </div>
          )}
        </div>

        {/* Grille photos */}
        {albumPhotos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {albumPhotos.map((photo, index) => (
              <div
                key={photo.id}
                className="avyento-card overflow-hidden cursor-pointer group hover:shadow-lg transition-all"
                onClick={() => openPhotoViewer(photo, index)}
              >
                <div className="aspect-square relative">
                  <img
                    src={photo.thumbnailUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                  {isOwner && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPhotoToEdit(photo);
                          setEditPhotoDialog(true);
                        }}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                {photo.title && (
                  <div className="p-3">
                    <h4 className="font-medium text-sm text-gray-900 mb-1">{photo.title}</h4>
                    {photo.description && (
                      <p className="text-xs text-gray-600 line-clamp-2">{photo.description}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune photo dans cet album</h3>
            <p className="text-gray-500 mb-4">Commencez par ajouter quelques photos</p>
            {isOwner && (
              <ObjectUploader
                maxNumberOfFiles={10}
                onGetUploadParameters={handleGetUploadParameters}
                onComplete={handleUploadComplete}
                buttonClassName="avyento-button-primary"
              >
                <Upload className="h-4 w-4 mr-2" />
                Ajouter des photos
              </ObjectUploader>
            )}
          </div>
        )}

        {/* Viewer photo haute résolution */}
        {selectedPhoto && (
          <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
            <DialogContent className="max-w-6xl w-full max-h-[90vh] p-0">
              <div className="relative">
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 bg-black/50 backdrop-blur-sm z-10 p-4">
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <h3 className="font-semibold">{selectedPhoto.title}</h3>
                      <p className="text-sm opacity-90">
                        Photo {photoIndex + 1} sur {albumPhotos.length}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPhoto(null)}
                      className="text-white hover:bg-white/20"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Image */}
                <div className="relative bg-black">
                  <img
                    src={selectedPhoto.highResUrl}
                    alt={selectedPhoto.title}
                    className="w-full max-h-[80vh] object-contain"
                    loading="eager"
                  />
                  
                  {/* Navigation */}
                  {albumPhotos.length > 1 && (
                    <>
                      <button
                        onClick={prevPhoto}
                        disabled={photoIndex === 0}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextPhoto}
                        disabled={photoIndex === albumPhotos.length - 1}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}
                </div>

                {/* Description */}
                {selectedPhoto.description && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm text-white p-4">
                    <p className="text-sm">{selectedPhoto.description}</p>
                    {selectedPhoto.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedPhoto.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Dialog édition photo */}
        {photoToEdit && (
          <Dialog open={editPhotoDialog} onOpenChange={setEditPhotoDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Éditer la photo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Titre</label>
                  <Input 
                    defaultValue={photoToEdit.title}
                    placeholder="Titre de la photo"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea 
                    defaultValue={photoToEdit.description}
                    placeholder="Description de la photo"
                    rows={3}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setEditPhotoDialog(false)}>
                    Annuler
                  </Button>
                  <Button className="avyento-button-primary">
                    Enregistrer
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  // Vue liste des albums
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="avyento-title text-gray-900 mb-1">Albums photo</h2>
          <p className="text-gray-600 text-sm">Découvrez nos réalisations organisées par thématique</p>
        </div>
        
        {isOwner && (
          <Dialog open={newAlbumDialog} onOpenChange={setNewAlbumDialog}>
            <DialogTrigger asChild>
              <Button className="avyento-button-primary">
                <Plus className="h-4 w-4 mr-2" />
                Nouvel album
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un nouvel album</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nom de l'album</label>
                  <Input placeholder="Ex: Réalisations du mois" />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea placeholder="Décrivez le contenu de cet album..." rows={3} />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <Eye className="h-4 w-4" />
                    Album public
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-500">
                    <EyeOff className="h-4 w-4" />
                    Album privé
                  </label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setNewAlbumDialog(false)}>
                    Annuler
                  </Button>
                  <Button className="avyento-button-primary">
                    Créer l'album
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Grille albums */}
      {albums.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <div
              key={album.id}
              className="avyento-card overflow-hidden cursor-pointer group hover:shadow-lg transition-all"
              onClick={() => loadAlbumPhotos(album)}
            >
              <div className="aspect-[4/3] relative">
                <img
                  src={album.coverImageUrl}
                  alt={album.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-semibold text-lg mb-1">{album.name}</h3>
                  <p className="text-sm opacity-90 line-clamp-2">{album.description}</p>
                  <p className="text-xs opacity-75 mt-2">{album.photoCount} photos</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun album créé</h3>
          <p className="text-gray-500 mb-4">Créez votre premier album pour organiser vos photos</p>
          {isOwner && (
            <Button 
              className="avyento-button-primary"
              onClick={() => setNewAlbumDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer un album
            </Button>
          )}
        </div>
      )}
    </div>
  );
}