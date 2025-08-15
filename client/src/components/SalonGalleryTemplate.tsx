import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Plus, 
  Edit3, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Upload,
  ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ObjectUploader } from '@/components/ObjectUploader';

interface Photo {
  id: number;
  imageUrl: string;
  title: string;
  description?: string;
  tags: string[];
  highResUrl: string;
}

interface Album {
  id: number;
  name: string;
  description: string;
  coverImageUrl?: string;
  photoCount: number;
}

interface SalonGalleryTemplateProps {
  salonId: number;
  isOwner?: boolean;
  salonSlug?: string;
}

/**
 * Template de galerie standardisé pour tous les salons
 * Features:
 * - Carrousel horizontal avec navigation par flèches
 * - Swipe tactile pour mobile
 * - Viewer plein écran avec navigation
 * - Gestion des albums
 * - Upload de photos (propriétaires uniquement)
 */
export function SalonGalleryTemplate({ salonId, isOwner = false }: SalonGalleryTemplateProps) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Charger les albums
  useEffect(() => {
    const loadAlbums = async () => {
      try {
        const response = await fetch(`/api/salons/${salonId}/albums`);
        if (response.ok) {
          const albumsData = await response.json();
          setAlbums(albumsData);
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
  const loadAlbumPhotos = async (albumId: number) => {
    try {
      const response = await fetch(`/api/salons/${salonId}/albums/${albumId}/photos`);
      if (response.ok) {
        const photos = await response.json();
        setAlbumPhotos(photos);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des photos:', error);
    }
  };

  // Sélectionner un album
  const selectAlbum = (album: Album) => {
    setSelectedAlbum(album);
    loadAlbumPhotos(album.id);
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
      const nextPhotoData = albumPhotos[newIndex];
      if (nextPhotoData) {
        setSelectedPhoto(nextPhotoData);
      }
    }
  }, [photoIndex, albumPhotos]);

  const prevPhoto = useCallback(() => {
    if (photoIndex > 0) {
      const newIndex = photoIndex - 1;
      setPhotoIndex(newIndex);
      const prevPhotoData = albumPhotos[newIndex];
      if (prevPhotoData) {
        setSelectedPhoto(prevPhotoData);
      }
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

  // Gestion de l'upload
  const handleGetUploadParameters = async () => {
    const response = await fetch('/api/objects/upload', { method: 'POST' });
    const data = await response.json();
    return {
      method: 'PUT' as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = async (result: any) => {
    if (result.successful?.[0]) {
      const uploadURL = result.successful[0].uploadURL;
      // Logique pour traiter l'upload selon les besoins du salon
      console.log('Photo uploadée:', uploadURL);
      // Recharger les photos
      if (selectedAlbum) {
        loadAlbumPhotos(selectedAlbum.id);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  // Vue principale des albums
  if (!selectedAlbum) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Galerie Photos</h2>
            <p className="text-gray-600">Découvrez nos réalisations</p>
          </div>
          {isOwner && (
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel album
            </Button>
          )}
        </div>

        {albums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <div
                key={album.id}
                className="avyento-card overflow-hidden cursor-pointer group"
                onClick={() => selectAlbum(album)}
              >
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  {album.coverImageUrl ? (
                    <img
                      src={album.coverImageUrl}
                      alt={album.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{album.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{album.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{album.photoCount} photos</Badge>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun album</h3>
            <p className="text-gray-500">Aucune photo n'a encore été ajoutée</p>
          </div>
        )}
      </div>
    );
  }

  // Vue album avec carrousel horizontal
  return (
    <div className="space-y-6">
      {/* Header album - Design Avyento minimaliste */}
      <div className="relative h-40 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative h-full flex flex-col items-center justify-center text-center p-4">
          {/* Bouton retour compact en haut à gauche */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedAlbum(null);
              setAlbumPhotos([]);
            }}
            className="absolute top-3 left-3 text-white hover:bg-white/20 backdrop-blur-sm text-xs px-2 py-1"
          >
            <ChevronLeft className="h-3 w-3 mr-1" />
            Retour
          </Button>
          
          {/* Contenu centré */}
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-2">{selectedAlbum.name}</h2>
            <p className="text-white/90 text-sm mb-1">{selectedAlbum.description}</p>
            <p className="text-white/70 text-xs">{albumPhotos.length} photos</p>
          </div>
          
          {isOwner && (
            <div className="absolute top-3 right-3">
              <ObjectUploader
                maxNumberOfFiles={10}
                maxFileSize={20971520}
                onGetUploadParameters={handleGetUploadParameters}
                onComplete={handleUploadComplete}
                buttonClassName="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 text-xs px-2 py-1"
              >
                <Upload className="h-3 w-3 mr-1" />
                Ajouter
              </ObjectUploader>
            </div>
          )}
        </div>
      </div>

      {/* Carrousel horizontal des photos */}
      {albumPhotos.length > 0 ? (
        <div className="space-y-6">
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

          <div className="relative">
            {/* Flèches de navigation */}
            {albumPhotos.length > 1 && (
              <>
                <button
                  onClick={() => {
                    const container = document.getElementById(`carousel-${selectedAlbum.id}`);
                    if (container) {
                      container.scrollBy({ left: -350, behavior: 'smooth' });
                    }
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 backdrop-blur-sm hover:bg-white shadow-xl rounded-full p-3 transition-all transform hover:scale-110"
                  style={{ marginLeft: '-20px' }}
                >
                  <ChevronLeft className="h-6 w-6 text-gray-700" />
                </button>
                
                <button
                  onClick={() => {
                    const container = document.getElementById(`carousel-${selectedAlbum.id}`);
                    if (container) {
                      container.scrollBy({ left: 350, behavior: 'smooth' });
                    }
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 backdrop-blur-sm hover:bg-white shadow-xl rounded-full p-3 transition-all transform hover:scale-110"
                  style={{ marginRight: '-20px' }}
                >
                  <ChevronRight className="h-6 w-6 text-gray-700" />
                </button>
              </>
            )}
            
            {/* Container carrousel */}
            <div 
              id={`carousel-${selectedAlbum.id}`}
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
                        <Button size="sm" variant="secondary">
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>

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
            
            {/* Indication swipe mobile */}
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

                {/* Indicateurs sur mobile */}
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
    </div>
  );
}