-- Ajout de la colonne gallery_images pour stocker les images de la galerie du salon
ALTER TABLE public.salons ADD COLUMN IF NOT EXISTS gallery_images jsonb;