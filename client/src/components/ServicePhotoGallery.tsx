import React, { useState } from 'react';
import { Camera, X, Plus, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface ServicePhoto {
  id: number;
  photoUrl: string;
  caption?: string;
  displayOrder: number;
  isMain: boolean;
}

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  photos?: ServicePhoto[];
  rating?: number;
  reviewCount?: number;
}

interface ServicePhotoGalleryProps {
  service: Service;
  onPhotoClick?: (photo: ServicePhoto) => void;
  onAddPhoto?: (serviceId: number) => void;
  isEditable?: boolean;
}

export default function ServicePhotoGallery({ 
  service, 
  onPhotoClick, 
  onAddPhoto,
  isEditable = false 
}: ServicePhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<ServicePhoto | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const photos = service.photos || [];
  const mainPhoto = photos.find(p => p.isMain) || photos[0];
  const galleryPhotos = photos.filter(p => !p.isMain).slice(0, 3);

  const openPhotoViewer = (photo: ServicePhoto) => {
    setSelectedPhoto(photo);
    setCurrentPhotoIndex(photos.findIndex(p => p.id === photo.id));
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (currentPhotoIndex - 1 + photos.length) % photos.length
      : (currentPhotoIndex + 1) % photos.length;
    
    setCurrentPhotoIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  return (
    <div className="space-y-4">
      {/* Service Info Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-black">{service.name}</h3>
          <p className="text-gray-600 text-sm mt-1">{service.description}</p>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-lg font-bold text-violet-600">
              {service.price}€
            </span>
            <span className="text-sm text-gray-500">
              {service.duration} min
            </span>
            {service.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{service.rating}</span>
                <span className="text-xs text-gray-500">
                  ({service.reviewCount} avis)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Photos Gallery */}
      <Tabs defaultValue="photos" className="w-full">
        <TabsList className="grid w-full grid-cols-3 glass-card border-white/40">
          <TabsTrigger value="photos" className="text-black">
            Photos ({photos.length})
          </TabsTrigger>
          <TabsTrigger value="before-after" className="text-black">
            Avant/Après
          </TabsTrigger>
          <TabsTrigger value="process" className="text-black">
            Processus
          </TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="space-y-4">
          {photos.length > 0 ? (
            <div className="grid grid-cols-4 gap-3">
              {/* Main Photo */}
              {mainPhoto && (
                <div className="col-span-2 row-span-2 relative group">
                  <Card className="overflow-hidden glass-card border-white/40 h-full">
                    <CardContent className="p-0 h-full">
                      <div 
                        className="relative h-full min-h-[200px] cursor-pointer"
                        onClick={() => openPhotoViewer(mainPhoto)}
                      >
                        <img
                          src={mainPhoto.photoUrl}
                          alt={mainPhoto.caption || service.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Camera className="h-8 w-8 text-white" />
                        </div>
                        <Badge className="absolute top-2 left-2 bg-violet-600">
                          Photo principale
                        </Badge>
                        {mainPhoto.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                            <p className="text-white text-sm">{mainPhoto.caption}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Gallery Photos */}
              {galleryPhotos.map((photo, index) => (
                <div key={photo.id} className="relative group">
                  <Card className="overflow-hidden glass-card border-white/40">
                    <CardContent className="p-0">
                      <div 
                        className="aspect-square cursor-pointer relative"
                        onClick={() => openPhotoViewer(photo)}
                      >
                        <img
                          src={photo.photoUrl}
                          alt={photo.caption || `${service.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Camera className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}

              {/* More Photos Indicator */}
              {photos.length > 4 && (
                <div className="relative group cursor-pointer" onClick={() => openPhotoViewer(photos[4])}>
                  <Card className="overflow-hidden glass-card border-white/40">
                    <CardContent className="p-0">
                      <div className="aspect-square relative">
                        <img
                          src={photos[4].photoUrl}
                          alt="Plus de photos"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="text-white text-center">
                            <Plus className="h-6 w-6 mx-auto mb-1" />
                            <span className="text-sm font-medium">
                              +{photos.length - 4} photos
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Add Photo Button */}
              {isEditable && onAddPhoto && (
                <div 
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-colors"
                  onClick={() => onAddPhoto(service.id)}
                >
                  <div className="text-center text-gray-500">
                    <Plus className="h-8 w-8 mx-auto mb-2" />
                    <span className="text-sm">Ajouter une photo</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune photo disponible
              </h3>
              <p className="text-gray-500 mb-4">
                Ajoutez des photos pour présenter cette prestation
              </p>
              {isEditable && onAddPhoto && (
                <Button
                  onClick={() => onAddPhoto(service.id)}
                  className="glass-button hover:glass-effect text-black"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter des photos
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="before-after" className="space-y-4">
          <div className="text-center py-8">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Photos Avant/Après
            </h3>
            <p className="text-gray-500">
              Montrez les résultats de vos prestations
            </p>
          </div>
        </TabsContent>

        <TabsContent value="process" className="space-y-4">
          <div className="text-center py-8">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Photos du Processus
            </h3>
            <p className="text-gray-500">
              Détaillez les étapes de votre prestation
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Photo Viewer Modal */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{service.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {currentPhotoIndex + 1} / {photos.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPhoto(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedPhoto && (
            <div className="relative">
              <img
                src={selectedPhoto.photoUrl}
                alt={selectedPhoto.caption || service.name}
                className="w-full max-h-[60vh] object-contain rounded-lg"
              />
              
              {/* Navigation Buttons */}
              {photos.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigatePhoto('prev')}
                    className="absolute left-2 top-1/2 -translate-y-1/2 glass-button hover:glass-effect"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigatePhoto('next')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 glass-button hover:glass-effect"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
              
              {/* Caption */}
              {selectedPhoto.caption && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{selectedPhoto.caption}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}