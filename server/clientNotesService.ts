// Service pour gérer les notes de suivi et photos clients
import { db } from "./db";
import { clientNotes, clientPhotos } from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import { sql } from "drizzle-orm";

export interface CreateNoteRequest {
  clientId: number;
  userId: string;
  content: string;
  author: string;
}

export interface UpdateNoteRequest {
  noteId: number;
  content: string;
  userId: string;
}

export interface CreatePhotoRequest {
  clientId: number;
  userId: string;
  photoUrl: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  caption?: string;
}

export class ClientNotesService {

  /**
   * Créer une nouvelle note de suivi
   */
  async createNote(request: CreateNoteRequest) {
    console.log('📝 CRÉATION NOTE CLIENT:', request);

    try {
      const newNote = await db.insert(clientNotes).values({
        clientId: request.clientId,
        userId: request.userId,
        content: request.content,
        author: request.author,
        isEditable: true
      }).returning();

      console.log('✅ Note créée:', newNote[0]);
      return newNote[0];

    } catch (error) {
      console.error('❌ Erreur création note:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour une note existante
   */
  async updateNote(request: UpdateNoteRequest) {
    console.log('✏️ MISE À JOUR NOTE:', request);

    try {
      const updatedNote = await db
        .update(clientNotes)
        .set({
          content: request.content,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(clientNotes.id, request.noteId),
            eq(clientNotes.userId, request.userId),
            eq(clientNotes.isEditable, true)
          )
        )
        .returning();

      if (updatedNote.length === 0) {
        throw new Error('Note non trouvée ou non modifiable');
      }

      console.log('✅ Note mise à jour:', updatedNote[0]);
      return updatedNote[0];

    } catch (error) {
      console.error('❌ Erreur mise à jour note:', error);
      throw error;
    }
  }

  /**
   * Supprimer une note
   */
  async deleteNote(noteId: number, userId: string) {
    console.log('🗑️ SUPPRESSION NOTE:', { noteId, userId });

    try {
      const deletedNote = await db
        .delete(clientNotes)
        .where(
          and(
            eq(clientNotes.id, noteId),
            eq(clientNotes.userId, userId)
          )
        )
        .returning();

      if (deletedNote.length === 0) {
        throw new Error('Note non trouvée');
      }

      console.log('✅ Note supprimée');
      return { success: true };

    } catch (error) {
      console.error('❌ Erreur suppression note:', error);
      throw error;
    }
  }

  /**
   * Récupérer toutes les notes d'un client
   */
  async getClientNotes(clientId: number, userId: string) {
    try {
      const notes = await db
        .select()
        .from(clientNotes)
        .where(
          and(
            eq(clientNotes.clientId, clientId),
            eq(clientNotes.userId, userId)
          )
        )
        .orderBy(desc(clientNotes.createdAt));

      return notes;

    } catch (error) {
      console.error('❌ Erreur récupération notes:', error);
      return [];
    }
  }

  /**
   * Ajouter une photo client
   */
  async addPhoto(request: CreatePhotoRequest) {
    console.log('📸 AJOUT PHOTO CLIENT:', request);

    try {
      // Validation de la taille (max 10MB)
      if (request.fileSize && request.fileSize > 10 * 1024 * 1024) {
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      // Validation du type MIME
      if (request.mimeType && !['image/jpeg', 'image/png', 'image/jpg'].includes(request.mimeType)) {
        throw new Error('Format de fichier non supporté (JPG/PNG uniquement)');
      }

      const newPhoto = await db.insert(clientPhotos).values({
        clientId: request.clientId,
        userId: request.userId,
        photoUrl: request.photoUrl,
        fileName: request.fileName,
        fileSize: request.fileSize,
        mimeType: request.mimeType,
        caption: request.caption
      }).returning();

      console.log('✅ Photo ajoutée:', newPhoto[0]);
      return newPhoto[0];

    } catch (error) {
      console.error('❌ Erreur ajout photo:', error);
      throw error;
    }
  }

  /**
   * Supprimer une photo
   */
  async deletePhoto(photoId: number, userId: string) {
    console.log('🗑️ SUPPRESSION PHOTO:', { photoId, userId });

    try {
      const deletedPhoto = await db
        .delete(clientPhotos)
        .where(
          and(
            eq(clientPhotos.id, photoId),
            eq(clientPhotos.userId, userId)
          )
        )
        .returning();

      if (deletedPhoto.length === 0) {
        throw new Error('Photo non trouvée');
      }

      console.log('✅ Photo supprimée');
      return { success: true };

    } catch (error) {
      console.error('❌ Erreur suppression photo:', error);
      throw error;
    }
  }

  /**
   * Récupérer toutes les photos d'un client
   */
  async getClientPhotos(clientId: number, userId: string) {
    try {
      const photos = await db
        .select()
        .from(clientPhotos)
        .where(
          and(
            eq(clientPhotos.clientId, clientId),
            eq(clientPhotos.userId, userId)
          )
        )
        .orderBy(desc(clientPhotos.uploadedAt));

      return photos;

    } catch (error) {
      console.error('❌ Erreur récupération photos:', error);
      return [];
    }
  }

  /**
   * Mettre à jour la légende d'une photo
   */
  async updatePhotoCaption(photoId: number, caption: string, userId: string) {
    try {
      const updatedPhoto = await db
        .update(clientPhotos)
        .set({ caption })
        .where(
          and(
            eq(clientPhotos.id, photoId),
            eq(clientPhotos.userId, userId)
          )
        )
        .returning();

      if (updatedPhoto.length === 0) {
        throw new Error('Photo non trouvée');
      }

      return updatedPhoto[0];

    } catch (error) {
      console.error('❌ Erreur mise à jour légende:', error);
      throw error;
    }
  }
}

export const clientNotesService = new ClientNotesService();