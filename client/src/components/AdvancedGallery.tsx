import { useState, useEffect, useRef, useCallback } from 'react';
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
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

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
  const nextPhoto = useCallback(() => {
    if (photoIndex < albumPhotos.length - 1) {
      const newIndex = photoIndex + 1;
      setPhotoIndex(newIndex);
      setSelectedPhoto(albumPhotos[newIndex] || null);
    }
  }, [photoIndex, albumPhotos]);

  const prevPhoto = useCallback(() => {
    if (photoIndex > 0) {
      const newIndex = photoIndex - 1;
      setPhotoIndex(newIndex);
      setSelectedPhoto(albumPhotos[newIndex] || null);
    }
  }, [photoIndex, albumPhotos]);

  // Gestion des gestes tactiles pour le swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && photoIndex < albumPhotos.length - 1) {
      nextPhoto();
    }
    if (isRightSwipe && photoIndex > 0) {
      prevPhoto();
    }
  };

  // Gestion navigation clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;
      
      if (e.key === 'ArrowLeft') {
        prevPhoto();
      } else if (e.key === 'ArrowRight') {
        nextPhoto();
      } else if (e.key === 'Escape') {
        setSelectedPhoto(null);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [selectedPhoto, prevPhoto, nextPhoto]);

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
        {/* Header album avec design moderne */}
        <div className="relative">
          {/* Image de couverture en arrière-plan */}
          <div className="h-48 relative overflow-hidden rounded-xl">
            <img
              src={selectedAlbum.coverImageUrl}
              alt={selectedAlbum.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
          </div>
          
          {/* Contenu superposé */}
          <div className="absolute inset-0 flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedAlbum(null);
                  setAlbumPhotos([]);
                }}
                className="text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Retour aux albums
              </Button>
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-2">{selectedAlbum.name}</h2>
                <p className="text-white/90 text-lg">{selectedAlbum.description}</p>
                <p className="text-white/70 text-sm mt-1">{albumPhotos.length} photos</p>
              </div>
            </div>
            
            {isOwner && (
              <div className="flex items-center gap-2">
                <ObjectUploader
                  maxNumberOfFiles={10}
                  maxFileSize={20971520} // 20MB
                  onGetUploadParameters={handleGetUploadParameters}
                  onComplete={handleUploadComplete}
                  buttonClassName="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Ajouter des photos
                </ObjectUploader>
              </div>
            )}
          </div>
        </div>

        {/* Carrousel de photos */}
        {albumPhotos.length > 0 ? (
          <div className="space-y-6">
            {/* Navigation carrousel */}
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm">{albumPhotos.length} photos dans cet album</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openPhotoViewer(albumPhotos[0], 0)}
                >
                  Voir en grand
                </Button>
              </div>
            </div>

            {/* Carrousel horizontal avec flèches */}
            <div className="relative">
              {/* Flèche gauche */}
              {albumPhotos.length > 1 && (
                <button
                  onClick={() => {
                    const container = document.getElementById('horizontal-carousel');
                    if (container) {
                      container.scrollBy({ left: -350, behavior: 'smooth' });
                    }
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 backdrop-blur-sm hover:bg-white shadow-xl rounded-full p-3 transition-all transform hover:scale-110"
                  style={{ marginLeft: '-20px' }}
                >
                  <ChevronLeft className="h-6 w-6 text-gray-700" />
                </button>
              )}
              
              {/* Flèche droite */}
              {albumPhotos.length > 1 && (
                <button
                  onClick={() => {
                    const container = document.getElementById('horizontal-carousel');
                    if (container) {
                      container.scrollBy({ left: 350, behavior: 'smooth' });
                    }
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 backdrop-blur-sm hover:bg-white shadow-xl rounded-full p-3 transition-all transform hover:scale-110"
                  style={{ marginRight: '-20px' }}
                >
                  <ChevronRight className="h-6 w-6 text-gray-700" />
                </button>
              )}
              
              {/* Container carrousel scrollable */}
              <div 
                id="horizontal-carousel"
                className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-2"
                style={{ 
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none',
                  scrollBehavior: 'smooth'
                }}
              >
                {albumPhotos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="flex-shrink-0 w-80 avyento-card overflow-hidden"
                  >
                    {/* Image principale */}
                    <div className="relative">
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        className="w-full h-64 object-cover cursor-pointer"
                        onClick={() => openPhotoViewer(photo, index)}
                        loading="lazy"
                      />
                      {isOwner && (
                        <div className="absolute top-4 right-4">
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

                    {/* Encadré descriptif */}
                    {(photo.title || photo.description) && (
                      <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 border-l-4 border-violet-500">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {photo.title && (
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {photo.title}
                              </h3>
                            )}
                            {photo.description && (
                              <p className="text-gray-700 text-sm leading-relaxed mb-2 line-clamp-2">
                                {photo.description}
                              </p>
                            )}
                            {photo.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {photo.tags.slice(0, 3).map((tag, i) => (
                                  <Badge 
                                    key={i} 
                                    variant="secondary" 
                                    className="text-xs bg-violet-100 text-violet-800 border-violet-200"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                                {photo.tags.length > 3 && (
                                  <Badge 
                                    variant="secondary" 
                                    className="text-xs bg-violet-100 text-violet-800 border-violet-200"
                                  >
                                    +{photo.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="ml-2 text-right">
                            <div className="text-xs text-gray-500">
                              {index + 1}/{albumPhotos.length}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Indication swipe sur mobile */}
              <div className="md:hidden text-center mt-2">
                <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                  <span>Balayez horizontalement</span>
                  <ChevronRight className="h-3 w-3" />
                </p>
              </div>
            </div>
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

        {/* Viewer photo haute résolution avec swipe */}
        {selectedPhoto && (
          <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
            <DialogContent className="max-w-6xl w-full max-h-[90vh] p-0">
              <div 
                className="relative"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 bg-black/50 backdrop-blur-sm z-10 p-4">
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <h3 className="font-semibold">{selectedPhoto.title}</h3>
                      <p className="text-sm opacity-90">
                        Photo {photoIndex + 1} sur {albumPhotos.length}
                      </p>
                      <p className="text-xs opacity-75 mt-1">
                        Balayez ou utilisez les flèches pour naviguer
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
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextPhoto}
                        disabled={photoIndex === albumPhotos.length - 1}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}

                  {/* Indicateurs de swipe sur mobile */}
                  <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 md:hidden">
                    <div className="flex items-center gap-2 bg-black/50 rounded-full px-3 py-1">
                      {albumPhotos.map((_, index) => (
                        <div
                          key={index}
                          className={`h-2 w-2 rounded-full transition-all ${
                            index === photoIndex ? 'bg-white' : 'bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
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

      {/* Albums en tiroir */}
      {albums.length > 0 ? (
        <div className="space-y-8">
          {albums.map((album) => (
            <div key={album.id} className="text-center">
              {/* Photo de couverture */}
              <div 
                className="avyento-card overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 max-w-md mx-auto"
                onClick={() => loadAlbumPhotos(album)}
              >
                <div className="aspect-[4/3] relative">
                  <img
                    src={album.coverImageUrl}
                    alt={album.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
                      <ChevronRight className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Nom de l'album en dessous */}
              <div className="mt-4 space-y-2">
                <h3 className="text-2xl font-bold text-gray-900 avyento-title">
                  {album.name}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                  {album.description}
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Camera className="h-4 w-4" />
                    {album.photoCount} photos
                  </span>
                  {album.isPublic && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Eye className="h-3 w-3 mr-1" />
                      Public
                    </Badge>
                  )}
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