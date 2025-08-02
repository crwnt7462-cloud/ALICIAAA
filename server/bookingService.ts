import { db } from "./db";
import { appointments, services, staff, clients, users } from "@shared/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { confirmationService } from "./confirmationService";
import { stripeService } from "./stripeService";

export interface BookingRequest {
  userId: string;
  clientEmail: string;
  clientName: string;
  clientPhone: string;
  serviceId: number;
  staffId?: number;
  appointmentDate: string;
  startTime: string;
  depositAmount?: number;
  specialRequests?: string;
}

export class BookingService {
  // Créer une nouvelle réservation avec paiement d'acompte
  async createBooking(bookingData: BookingRequest): Promise<any> {
    try {
      // 1. Récupérer le service pour calculer le prix et la durée
      const [service] = await db.select().from(services).where(eq(services.id, bookingData.serviceId));
      if (!service) {
        throw new Error("Service non trouvé");
      }

      // 2. Vérifier la disponibilité du créneau
      const isAvailable = await this.checkTimeSlotAvailability(
        bookingData.userId,
        bookingData.appointmentDate,
        bookingData.startTime,
        service.durationMinutes,
        bookingData.staffId
      );

      if (!isAvailable) {
        throw new Error("Ce créneau n'est plus disponible");
      }

      // 3. Calculer l'heure de fin et le prix total
      const [startHour, startMinute] = bookingData.startTime.split(':').map(Number);
      const endTime = this.calculateEndTime(startHour, startMinute, service.durationMinutes);
      const totalPrice = parseFloat(service.price.toString());
      const depositAmount = bookingData.depositAmount || Math.round(totalPrice * 0.3); // 30% d'acompte par défaut

      // 4. Créer la réservation en base
      const [appointment] = await db
        .insert(appointments)
        .values({
          userId: bookingData.userId,
          clientEmail: bookingData.clientEmail,
          clientName: bookingData.clientName,
          clientPhone: bookingData.clientPhone,
          serviceId: bookingData.serviceId,
          serviceName: service.name,
          staffId: bookingData.staffId,
          appointmentDate: bookingData.appointmentDate,
          startTime: bookingData.startTime,
          endTime: endTime,
          totalPrice: totalPrice.toString(),
          depositPaid: depositAmount.toString(),
          status: "confirmed",
          notes: bookingData.specialRequests || "",
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();

      // 5. Créer ou récupérer le compte client automatiquement
      await this.createOrUpdateClientAccount({
        email: bookingData.clientEmail,
        name: bookingData.clientName,
        phone: bookingData.clientPhone,
        appointmentId: appointment.id
      });

      // 6. Envoyer les confirmations automatiques
      await confirmationService.sendBookingConfirmation({
        appointmentId: appointment.id,
        clientEmail: bookingData.clientEmail,
        clientName: bookingData.clientName,
        serviceName: service.name,
        date: bookingData.appointmentDate,
        time: bookingData.startTime,
        totalPrice: totalPrice,
        depositPaid: depositAmount,
        businessName: "Salon Excellence",
        businessAddress: "15 rue de la Paix, 75001 Paris"
      });

      console.log(`✅ Nouvelle réservation créée: ${service.name} le ${bookingData.appointmentDate} à ${bookingData.startTime}`);
      console.log(`💰 Prix total: ${totalPrice}€ - Acompte: ${depositAmount}€`);
      console.log(`📧 Client: ${bookingData.clientName} (${bookingData.clientEmail})`);

      return {
        appointment,
        totalPrice,
        depositPaid: depositAmount,
        remainingAmount: totalPrice - depositAmount,
        confirmationSent: true
      };

    } catch (error) {
      console.error("Erreur lors de la création de la réservation:", error);
      throw error;
    }
  }

  // Vérifier la disponibilité d'un créneau
  async checkTimeSlotAvailability(
    userId: string,
    date: string,
    startTime: string,
    durationMinutes: number,
    staffId?: number
  ): Promise<boolean> {
    try {
      const endTime = this.calculateEndTime(
        parseInt(startTime.split(':')[0]),
        parseInt(startTime.split(':')[1]),
        durationMinutes
      );

      // Rechercher les conflits de créneaux
      const conflicts = await db
        .select()
        .from(appointments)
        .where(
          and(
            eq(appointments.userId, userId),
            eq(appointments.appointmentDate, date),
            staffId ? eq(appointments.staffId, staffId) : undefined
          )
        );

      // Vérifier les chevauchements
      for (const conflict of conflicts) {
        const conflictStart = conflict.startTime;
        const conflictEnd = conflict.endTime || this.calculateEndTime(
          parseInt(conflictStart.split(':')[0]),
          parseInt(conflictStart.split(':')[1]),
          60 // Durée par défaut si manquante
        );

        if (this.timesOverlap(startTime, endTime, conflictStart, conflictEnd)) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Erreur lors de la vérification de disponibilité:", error);
      return false;
    }
  }

  // Calculer l'heure de fin
  private calculateEndTime(startHour: number, startMinute: number, durationMinutes: number): string {
    const totalMinutes = startHour * 60 + startMinute + durationMinutes;
    const endHour = Math.floor(totalMinutes / 60);
    const endMinute = totalMinutes % 60;
    return `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
  }

  // Vérifier si deux créneaux se chevauchent
  private timesOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
    const toMinutes = (time: string) => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    };

    const s1 = toMinutes(start1);
    const e1 = toMinutes(end1);
    const s2 = toMinutes(start2);
    const e2 = toMinutes(end2);

    return s1 < e2 && s2 < e1;
  }

  // Obtenir les créneaux disponibles pour une date
  async getAvailableTimeSlots(
    userId: string,
    date: string,
    serviceId: number,
    staffId?: number
  ): Promise<string[]> {
    try {
      // Récupérer le service pour connaître la durée
      const [service] = await db.select().from(services).where(eq(services.id, serviceId));
      if (!service) {
        throw new Error("Service non trouvé");
      }

      // Horaires d'ouverture par défaut (à améliorer avec la configuration du salon)
      const openHour = 9;
      const closeHour = 19;
      const slotDuration = 30; // Créneaux de 30 minutes
      
      const availableSlots: string[] = [];
      
      // Générer tous les créneaux possibles
      for (let hour = openHour; hour < closeHour; hour++) {
        for (let minute = 0; minute < 60; minute += slotDuration) {
          const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          
          // Vérifier si le créneau peut accueillir le service complet
          const endTime = this.calculateEndTime(hour, minute, service.durationMinutes);
          const endHour = parseInt(endTime.split(':')[0]);
          
          if (endHour <= closeHour) {
            const isAvailable = await this.checkTimeSlotAvailability(
              userId,
              date,
              timeSlot,
              service.durationMinutes,
              staffId
            );
            
            if (isAvailable) {
              availableSlots.push(timeSlot);
            }
          }
        }
      }

      return availableSlots;
    } catch (error) {
      console.error("Erreur lors de la récupération des créneaux:", error);
      return [];
    }
  }

  // Annuler une réservation
  async cancelAppointment(appointmentId: number, reason?: string): Promise<boolean> {
    try {
      const [appointment] = await db
        .select()
        .from(appointments)
        .where(eq(appointments.id, appointmentId));

      if (!appointment) {
        throw new Error("Rendez-vous non trouvé");
      }

      // Mettre à jour le statut
      await db
        .update(appointments)
        .set({
          status: "cancelled",
          notes: reason ? `${appointment.notes || ""}\nAnnulation: ${reason}` : appointment.notes,
          updatedAt: new Date()
        })
        .where(eq(appointments.id, appointmentId));

      // Envoyer notification d'annulation
      await confirmationService.sendCancellationNotification({
        appointmentId,
        clientEmail: appointment.clientEmail,
        clientName: appointment.clientName,
        serviceName: appointment.serviceName,
        date: appointment.appointmentDate,
        time: appointment.startTime,
        reason: reason || "Annulation demandée"
      });

      console.log(`❌ Rendez-vous annulé: ${appointment.serviceName} le ${appointment.appointmentDate}`);
      return true;

    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
      return false;
    }
  }

  // Modifier une réservation
  async rescheduleAppointment(
    appointmentId: number,
    newDate: string,
    newTime: string
  ): Promise<boolean> {
    try {
      const [appointment] = await db
        .select()
        .from(appointments)
        .where(eq(appointments.id, appointmentId));

      if (!appointment) {
        throw new Error("Rendez-vous non trouvé");
      }

      // Vérifier la disponibilité du nouveau créneau
      const [service] = await db.select().from(services).where(eq(services.id, appointment.serviceId));
      if (!service) {
        throw new Error("Service non trouvé");
      }

      const isAvailable = await this.checkTimeSlotAvailability(
        appointment.userId,
        newDate,
        newTime,
        service.durationMinutes,
        appointment.staffId
      );

      if (!isAvailable) {
        throw new Error("Le nouveau créneau n'est pas disponible");
      }

      // Calculer la nouvelle heure de fin
      const [newHour, newMinute] = newTime.split(':').map(Number);
      const newEndTime = this.calculateEndTime(newHour, newMinute, service.durationMinutes);

      // Mettre à jour la réservation
      await db
        .update(appointments)
        .set({
          appointmentDate: newDate,
          startTime: newTime,
          endTime: newEndTime,
          updatedAt: new Date()
        })
        .where(eq(appointments.id, appointmentId));

      // Envoyer notification de modification
      await confirmationService.sendRescheduleNotification({
        appointmentId,
        clientEmail: appointment.clientEmail,
        clientName: appointment.clientName,
        serviceName: appointment.serviceName,
        oldDate: appointment.appointmentDate,
        oldTime: appointment.startTime,
        newDate,
        newTime
      });

      console.log(`🔄 Rendez-vous reporté: ${appointment.serviceName} du ${appointment.appointmentDate} au ${newDate}`);
      return true;

    } catch (error) {
      console.error("Erreur lors du report:", error);
      return false;
    }
  }

  // Obtenir les réservations d'un client
  async getClientAppointments(clientEmail: string): Promise<any[]> {
    try {
      const clientAppointments = await db
        .select({
          id: appointments.id,
          serviceName: appointments.serviceName,
          date: appointments.appointmentDate,
          time: appointments.startTime,
          endTime: appointments.endTime,
          totalPrice: appointments.totalPrice,
          depositPaid: appointments.depositPaid,
          status: appointments.status,
          notes: appointments.notes,
          businessName: users.businessName,
          businessPhone: users.phone,
          businessAddress: users.address
        })
        .from(appointments)
        .leftJoin(users, eq(appointments.userId, users.id))
        .where(eq(appointments.clientEmail, clientEmail))
        .orderBy(desc(appointments.appointmentDate), desc(appointments.startTime));

      return clientAppointments;
    } catch (error) {
      console.error("Erreur lors de la récupération des rendez-vous client:", error);
      return [];
    }
  }

  // Créer ou mettre à jour le compte client automatiquement lors d'une réservation
  async createOrUpdateClientAccount(clientData: {
    email: string;
    name: string;
    phone: string;
    appointmentId: number;
  }): Promise<void> {
    try {
      // Vérifier si le client existe déjà
      const [existingClient] = await db
        .select()
        .from(clients)
        .where(eq(clients.email, clientData.email));

      if (!existingClient) {
        // Créer un nouveau compte client
        const [firstName, ...lastNameParts] = clientData.name.split(' ');
        const lastName = lastNameParts.join(' ') || '';

        await db.insert(clients).values({
          email: clientData.email,
          firstName: firstName,
          lastName: lastName,
          phone: clientData.phone,
          totalAppointments: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        console.log(`✅ Nouveau compte client créé automatiquement: ${clientData.email}`);
      } else {
        // Mettre à jour le nombre de rendez-vous
        await db
          .update(clients)
          .set({ 
            totalAppointments: (existingClient.totalAppointments || 0) + 1,
            updatedAt: new Date()
          })
          .where(eq(clients.id, existingClient.id));

        console.log(`✅ Compte client mis à jour: ${clientData.email} (${(existingClient.totalAppointments || 0) + 1} RDV)`);
      }
    } catch (error) {
      console.error('Erreur lors de la synchronisation du compte client:', error);
    }
  }

  // Récupérer les rendez-vous d'un client avec informations du salon
  async getAppointmentsForClient(clientEmail: string): Promise<any[]> {
    try {
      const clientAppointments = await db
        .select({
          id: appointments.id,
          serviceName: appointments.serviceName,
          salonName: users.businessName,
          date: appointments.appointmentDate,
          time: appointments.startTime,
          status: appointments.status,
          totalPrice: appointments.totalPrice,
          depositPaid: appointments.depositPaid,
          address: users.address,
          professionalName: users.firstName,
          professionalPhone: users.phone
        })
        .from(appointments)
        .leftJoin(users, eq(appointments.userId, users.id))
        .where(eq(appointments.clientEmail, clientEmail))
        .orderBy(desc(appointments.appointmentDate));

      // Calculer les informations supplémentaires
      return clientAppointments.map(apt => ({
        ...apt,
        salonName: apt.salonName || 'Salon non défini',
        address: apt.address || 'Adresse à confirmer',
        canCancel: new Date(apt.date + ' ' + apt.time) > new Date(Date.now() + 24 * 60 * 60 * 1000),
        remainingAmount: parseFloat(apt.totalPrice) - parseFloat(apt.depositPaid || '0')
      }));

    } catch (error) {
      console.error('Erreur lors de la récupération des RDV client:', error);
      return [];
    }
  }
}

export const bookingService = new BookingService();