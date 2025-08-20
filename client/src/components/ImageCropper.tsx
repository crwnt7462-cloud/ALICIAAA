import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Crop, Save, X, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCropperProps {
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImageUrl: string) => void;
  imageUrl: string;
  aspectRatio?: number; // largeur/hauteur (ex: 16/9 pour couverture)
}

export default function ImageCropper({ 
  isOpen, 
  onClose, 
  onCropComplete, 
  imageUrl, 
  aspectRatio = 16 / 9 
}: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setCrop(prev => ({
      ...prev,
      x: Math.max(0, Math.min(prev.x + deltaX, 100 - prev.width)),
      y: Math.max(0, Math.min(prev.y + deltaY, 100 - prev.height))
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleCropImage = async () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Définir la taille du canvas selon l'aspect ratio
    const targetWidth = 800;
    const targetHeight = targetWidth / aspectRatio;
    
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Calculer les dimensions de recadrage
    const scaleX = image.naturalWidth / 100;
    const scaleY = image.naturalHeight / 100;
    
    const sourceX = crop.x * scaleX;
    const sourceY = crop.y * scaleY;
    const sourceWidth = crop.width * scaleX;
    const sourceHeight = crop.height * scaleY;

    // Appliquer rotation et zoom
    ctx.save();
    ctx.translate(targetWidth / 2, targetHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Dessiner l'image recadrée
    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      -targetWidth / 2,
      -targetHeight / 2,
      targetWidth,
      targetHeight
    );
    
    ctx.restore();

    // Convertir en URL et appeler le callback
    const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
    onCropComplete(croppedImageUrl);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] bg-slate-900/95 backdrop-blur-xl border-slate-600/50">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-white flex items-center gap-2">
            <Crop className="h-5 w-5" />
            Recadrer la photo de couverture
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex gap-6">
          {/* Zone de recadrage */}
          <div className="flex-1 relative bg-slate-800/50 rounded-lg overflow-hidden">
            <div 
              className="relative w-full h-full flex items-center justify-center"
              onMouseDown={handleMouseDown}
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Image à recadrer"
                className="max-w-full max-h-full object-contain"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: isDragging ? 'none' : 'transform 0.2s ease'
                }}
              />
              
              {/* Overlay de recadrage */}
              <div 
                className="absolute border-2 border-violet-400 bg-violet-400/10 backdrop-blur-sm"
                style={{
                  left: `${crop.x}%`,
                  top: `${crop.y}%`,
                  width: `${crop.width}%`,
                  height: `${crop.height}%`,
                  aspectRatio: aspectRatio
                }}
              >
                <div className="absolute inset-0 border-2 border-dashed border-white/50" />
              </div>
            </div>
          </div>

          {/* Contrôles */}
          <div className="w-64 bg-slate-800/30 backdrop-blur-sm rounded-lg p-4 space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Zoom: {Math.round(zoom * 100)}%
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-violet-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Rotation: {rotation}°
                </label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="15"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="w-full accent-violet-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Position X: {Math.round(crop.x)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max={100 - crop.width}
                  value={crop.x}
                  onChange={(e) => setCrop(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                  className="w-full accent-violet-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Position Y: {Math.round(crop.y)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max={100 - crop.height}
                  value={crop.y}
                  onChange={(e) => setCrop(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                  className="w-full accent-violet-500"
                />
              </div>
            </div>

            {/* Boutons de contrôle rapide */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(prev => Math.min(3, prev + 0.2))}
                className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(prev => Math.max(0.5, prev - 0.2))}
                className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRotation(prev => (prev + 90) % 360)}
                className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600 col-span-2"
              >
                <RotateCw className="h-4 w-4 mr-2" />
                Rotation 90°
              </Button>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-white">Presets:</p>
              <div className="grid grid-cols-1 gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCrop({ x: 10, y: 10, width: 80, height: 80 / aspectRatio });
                    setZoom(1);
                    setRotation(0);
                  }}
                  className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600 text-xs"
                >
                  Centre
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCrop({ x: 0, y: 0, width: 100, height: 100 / aspectRatio });
                    setZoom(1);
                    setRotation(0);
                  }}
                  className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600 text-xs"
                >
                  Pleine largeur
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-between pt-4 border-t border-slate-600/50">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
          >
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button
            onClick={handleCropImage}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Appliquer le recadrage
          </Button>
        </div>

        {/* Canvas caché pour le recadrage */}
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}