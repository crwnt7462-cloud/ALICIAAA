// Service pour gérer les chevauchements de rendez-vous selon les nouvelles spécifications
import { db } from "./db";
import { appointments } from "@shared/schema";
import { eq, and, gte, lte, or } from "drizzle-orm";
import { sql } from "drizzle-orm";

export interface OverlapCheckRequest {
  date: string;
  startTime: string;
  endTime: string;
  staffId?: number;
  userId: string;
  isManualBlock?: boolean;
  createdByPro?: boolean;
  excludeAppointmentId?: number;
}

export interface OverlapResult {
  hasConflict: boolean;
  conflictingAppointments: any[];
  canProceed: boolean;
  reason?: string;
}

export class OverlapService {
  
  /**
   * Vérifier les conflits selon les nouvelles règles :
   * - Blocs manuels créés par pro : AUTORISÉS à chevaucher
   * - Réservations en ligne : INTERDITES de chevaucher
   */
  async checkOverlap(request: OverlapCheckRequest): Promise<OverlapResult> {
    console.log('🔍 OVERLAP CHECK:', request);
    
    try {
      // Rechercher les rendez-vous potentiellement en conflit
      const conflictingQuery = db
        .select()
        .from(appointments)
        .where(
          and(
            eq(appointments.appointmentDate, request.date),
            eq(appointments.userId, request.userId),
            // Vérifier le chevauchement temporel
            or(
              // Le nouveau RDV commence pendant un RDV existant
              and(
                gte(sql`'${request.startTime}'::time`, appointments.startTime),
                lte(sql`'${request.startTime}'::time`, appointments.endTime)
              ),
              // Le nouveau RDV finit pendant un RDV existant
              and(
                gte(sql`'${request.endTime}'::time`, appointments.startTime),
                lte(sql`'${request.endTime}'::time`, appointments.endTime)
              ),
              // Le nouveau RDV englobe complètement un RDV existant
              and(
                lte(sql`'${request.startTime}'::time`, appointments.startTime),
                gte(sql`'${request.endTime}'::time`, appointments.endTime)
              )
            ),
            // Exclure le rendez-vous en cours de modification
            request.excludeAppointmentId 
              ? sql`${appointments.id} != ${request.excludeAppointmentId}`
              : sql`TRUE`,
            // Exclure les rendez-vous annulés
            sql`${appointments.status} != 'cancelled'`
          )
        );

      let conflictingAppointments;
      
      // Ajouter le filtre staff si spécifié
      if (request.staffId) {
        conflictingAppointments = await conflictingQuery.where(eq(appointments.staffId, request.staffId));
      } else {
        conflictingAppointments = await conflictingQuery;
      }
      
      console.log('⚡ Conflits trouvés:', conflictingAppointments);

      const hasConflict = conflictingAppointments.length > 0;

      // NOUVELLE LOGIQUE : Si c'est un bloc manuel créé par pro, autoriser le chevauchement
      if (request.isManualBlock && request.createdByPro) {
        console.log('✅ BLOC MANUEL PRO: Chevauchement autorisé');
        return {
          hasConflict,
          conflictingAppointments,
          canProceed: true,
          reason: 'Bloc manuel créé par professionnel - chevauchement autorisé'
        };
      }

      // Pour les réservations en ligne, interdire tout conflit
      if (hasConflict) {
        console.log('❌ RÉSERVATION EN LIGNE: Conflit détecté');
        return {
          hasConflict: true,
          conflictingAppointments,
          canProceed: false,
          reason: 'Créneau déjà occupé - veuillez choisir un autre horaire'
        };
      }

      console.log('✅ Aucun conflit - RDV autorisé');
      return {
        hasConflict: false,
        conflictingAppointments: [],
        canProceed: true
      };

    } catch (error) {
      console.error('❌ Erreur lors de la vérification des conflits:', error);
      return {
        hasConflict: false,
        conflictingAppointments: [],
        canProceed: false,
        reason: 'Erreur lors de la vérification des disponibilités'
      };
    }
  }

  /**
   * Créer un bloc manuel avec possibilité de chevauchement
   */
  async createManualBlock(blockData: {
    date: string;
    startTime: string;
    endTime: string;
    staffId?: number;
    userId: string;
    notes?: string;
    createdBy: string; // ID du professionnel qui crée
  }) {
    console.log('🔧 CRÉATION BLOC MANUEL:', blockData);

    try {
      const newBlock = await db.insert(appointments).values({
        userId: blockData.userId,
        staffId: blockData.staffId,
        appointmentDate: blockData.date,
        startTime: blockData.startTime,
        endTime: blockData.endTime,
        status: 'blocked',
        notes: blockData.notes || 'Créneau bloqué manuellement',
        isManualBlock: true,
        createdByPro: true,
        allowOverlap: true,
        source: 'manual_block',
        paymentStatus: 'not_applicable'
      }).returning();

      console.log('✅ Bloc manuel créé:', newBlock[0]);
      return newBlock[0];

    } catch (error) {
      console.error('❌ Erreur création bloc manuel:', error);
      throw error;
    }
  }

  /**
   * Obtenir tous les rendez-vous avec indication des blocs manuels
   */
  async getAppointmentsWithBlockInfo(userId: string, date: string) {
    try {
      const appointmentsList = await db
        .select({
          id: appointments.id,
          startTime: appointments.startTime,
          endTime: appointments.endTime,
          status: appointments.status,
          isManualBlock: appointments.isManualBlock,
          createdByPro: appointments.createdByPro,
          allowOverlap: appointments.allowOverlap,
          notes: appointments.notes,
          clientName: appointments.clientName,
          staffId: appointments.staffId
        })
        .from(appointments)
        .where(
          and(
            eq(appointments.userId, userId),
            eq(appointments.appointmentDate, date),
            sql`${appointments.status} != 'cancelled'`
          )
        )
        .orderBy(appointments.startTime);

      return appointmentsList;

    } catch (error) {
      console.error('❌ Erreur récupération rendez-vous:', error);
      return [];
    }
  }
}

export const overlapService = new OverlapService();