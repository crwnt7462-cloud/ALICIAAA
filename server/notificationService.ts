import { Expo, ExpoPushMessage, ExpoPushToken } from 'expo-server-sdk';
import { db } from './db';
import { appointments, clients, services } from '../shared/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';

interface NotificationData {
  type: 'new_booking' | 'cancellation' | 'gap_detected' | 'reminder' | 'payment_received';
  title: string;
  body: string;
  data?: any;
}

export class NotificationService {
  private expo: Expo;

  constructor() {
    this.expo = new Expo();
  }

  // Générer notification pour nouvelle réservation
  async sendNewBookingNotification(appointmentId: number) {
    try {
      const appointment = await db
        .select()
        .from(appointments)
        .leftJoin(clients, eq(appointments.clientId, clients.id))
        .leftJoin(services, eq(appointments.serviceId, services.id))
        .where(eq(appointments.id, appointmentId))
        .limit(1);

      if (!appointment[0]) return;

      const { appointments: apt, clients: client, services: service } = appointment[0];
      
      const date = new Date(apt.appointmentDate);
      const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
      const time = apt.startTime;
      
      const notification: NotificationData = {
        type: 'new_booking',
        title: '📅 Nouvelle résa confirmée',
        body: `${client?.firstName} – ${service?.name} – ${dayName}. ${time}\n💳 ${apt.paymentStatus === 'paid' ? 'Acompte reçu' : 'En attente paiement'}`,
        data: { appointmentId, type: 'new_booking' }
      };

      await this.sendToUser(apt.userId, notification);
    } catch (error) {
      console.error('Erreur notification nouvelle réservation:', error);
    }
  }

  // Générer notification pour annulation
  async sendCancellationNotification(appointmentData: any) {
    try {
      const date = new Date(appointmentData.appointmentDate);
      const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
      const time = appointmentData.startTime;

      const notification: NotificationData = {
        type: 'cancellation',
        title: '❌ Annulation reçue',
        body: `${appointmentData.clientName} – ${appointmentData.serviceName} – ${dayName}. ${time}\n➕ Placer quelqu'un de la liste d'attente ?`,
        data: { 
          appointmentId: appointmentData.id, 
          type: 'cancellation',
          suggestWaitingList: true 
        }
      };

      await this.sendToUser(appointmentData.userId, notification);
    } catch (error) {
      console.error('Erreur notification annulation:', error);
    }
  }

  // Détecter et notifier les créneaux libres
  async detectAndNotifyGaps(userId: string, date: string) {
    try {
      const dayAppointments = await db
        .select()
        .from(appointments)
        .leftJoin(clients, eq(appointments.clientId, clients.id))
        .leftJoin(services, eq(appointments.serviceId, services.id))
        .where(
          and(
            eq(appointments.userId, userId),
            eq(appointments.appointmentDate, date),
            eq(appointments.status, 'confirmed')
          )
        )
        .orderBy(appointments.startTime);

      if (dayAppointments.length < 2) return;

      // Analyser les gaps entre rendez-vous
      for (let i = 0; i < dayAppointments.length - 1; i++) {
        const current = dayAppointments[i];
        const next = dayAppointments[i + 1];
        
        const currentEnd = this.addMinutesToTime(
          current.appointments.startTime, 
          current.services?.duration || 60
        );
        const nextStart = next.appointments.startTime;
        
        const gapMinutes = this.getTimeDifference(currentEnd, nextStart);
        
        // Si gap de 45min ou plus, envoyer notification
        if (gapMinutes >= 45) {
          const dayName = new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' });
          
          const notification: NotificationData = {
            type: 'gap_detected',
            title: '⏱ Créneau libre détecté',
            body: `${dayName}. ${currentEnd} – ${Math.floor(gapMinutes/60)}h${gapMinutes%60 > 0 ? gapMinutes%60 : ''} dispo\n📢 Lancer une promo express ?`,
            data: { 
              date,
              startTime: currentEnd,
              duration: gapMinutes,
              type: 'gap_detected'
            }
          };

          await this.sendToUser(userId, notification);
        }
      }
    } catch (error) {
      console.error('Erreur détection gaps:', error);
    }
  }

  // Notification rappel rendez-vous
  async sendReminderNotification(appointmentId: number) {
    try {
      const appointment = await db
        .select()
        .from(appointments)
        .leftJoin(clients, eq(appointments.clientId, clients.id))
        .leftJoin(services, eq(appointments.serviceId, services.id))
        .where(eq(appointments.id, appointmentId))
        .limit(1);

      if (!appointment[0]) return;

      const { appointments: apt, clients: client, services: service } = appointment[0];
      
      const notification: NotificationData = {
        type: 'reminder',
        title: '⏰ RDV dans 2h',
        body: `${client?.firstName} – ${service?.name}\n💡 Préparer matériel et cabine`,
        data: { appointmentId, type: 'reminder' }
      };

      await this.sendToUser(apt.userId, notification);
    } catch (error) {
      console.error('Erreur notification rappel:', error);
    }
  }

  // Notification paiement reçu
  async sendPaymentNotification(appointmentId: number, amount: number) {
    try {
      const appointment = await db
        .select()
        .from(appointments)
        .leftJoin(clients, eq(appointments.clientId, clients.id))
        .where(eq(appointments.id, appointmentId))
        .limit(1);

      if (!appointment[0]) return;

      const { appointments: apt, clients: client } = appointment[0];
      
      const notification: NotificationData = {
        type: 'payment_received',
        title: '💳 Paiement reçu',
        body: `${client?.firstName} – ${amount}€\n✅ Acompte validé`,
        data: { appointmentId, amount, type: 'payment_received' }
      };

      await this.sendToUser(apt.userId, notification);
    } catch (error) {
      console.error('Erreur notification paiement:', error);
    }
  }

  // Envoyer notification à un utilisateur spécifique
  private async sendToUser(userId: string, notification: NotificationData) {
    try {
      // Récupérer le token push de l'utilisateur (à stocker en DB)
      const pushToken = await this.getUserPushToken(userId);
      
      if (!pushToken || !Expo.isExpoPushToken(pushToken)) {
        console.log(`Token push invalide pour user ${userId}`);
        return;
      }

      const message: ExpoPushMessage = {
        to: pushToken,
        title: notification.title,
        body: notification.body,
        data: notification.data,
        sound: 'default',
        badge: 1,
        priority: 'high',
        channelId: 'beauty-pro-notifications'
      };

      const chunks = this.expo.chunkPushNotifications([message]);
      
      for (const chunk of chunks) {
        try {
          const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
          console.log('Notification envoyée:', ticketChunk);
        } catch (error) {
          console.error('Erreur envoi chunk:', error);
        }
      }
    } catch (error) {
      console.error('Erreur envoi notification:', error);
    }
  }

  // Récupérer le token push de l'utilisateur
  private async getUserPushToken(userId: string): Promise<string | null> {
    try {
      // TODO: Ajouter une table push_tokens ou colonne dans users
      // Pour l'instant, return null - à implémenter
      return process.env.TEST_PUSH_TOKEN || null;
    } catch (error) {
      console.error('Erreur récupération token:', error);
      return null;
    }
  }

  // Utilitaires de temps
  private addMinutesToTime(time: string, minutes: number): string {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
  }

  private getTimeDifference(time1: string, time2: string): number {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);
    const totalMinutes1 = h1 * 60 + m1;
    const totalMinutes2 = h2 * 60 + m2;
    return totalMinutes2 - totalMinutes1;
  }
}

export const notificationService = new NotificationService();