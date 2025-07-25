import { db } from "./db";
import { notifications, users } from "@shared/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export interface NotificationData {
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'message' | 'reminder' | 'payment' | 'system';
  data?: Record<string, any>;
  actionUrl?: string;
}

export interface MessageNotificationData {
  recipientId: string;
  senderName: string;
  messagePreview: string;
  messageId: number;
}

export class NotificationService {
  // Envoyer une notification générale
  async sendNotification(notificationData: NotificationData): Promise<boolean> {
    try {
      await db
        .insert(notifications)
        .values({
          userId: notificationData.userId,
          title: notificationData.title,
          message: notificationData.message,
          type: notificationData.type,
          data: notificationData.data ? JSON.stringify(notificationData.data) : null,
          actionUrl: notificationData.actionUrl,
          isRead: false,
          createdAt: new Date()
        });

      console.log(`🔔 Notification envoyée: ${notificationData.title} à ${notificationData.userId}`);
      return true;

    } catch (error) {
      console.error("Erreur lors de l'envoi de notification:", error);
      return false;
    }
  }

  // Notification de nouveau message
  async sendMessageNotification(data: MessageNotificationData): Promise<boolean> {
    return this.sendNotification({
      userId: data.recipientId,
      title: `Nouveau message de ${data.senderName}`,
      message: data.messagePreview,
      type: 'message',
      data: { messageId: data.messageId, senderName: data.senderName },
      actionUrl: `/messaging`
    });
  }

  // Notification de nouvelle réservation
  async sendBookingNotification(userId: string, clientName: string, serviceName: string, date: string, time: string): Promise<boolean> {
    return this.sendNotification({
      userId,
      title: "Nouvelle réservation",
      message: `${clientName} a réservé "${serviceName}" le ${date} à ${time}`,
      type: 'booking',
      data: { clientName, serviceName, date, time },
      actionUrl: `/appointments`
    });
  }

  // Notification de rappel de RDV
  async sendAppointmentReminder(userId: string, serviceName: string, date: string, time: string): Promise<boolean> {
    return this.sendNotification({
      userId,
      title: "Rappel de rendez-vous",
      message: `N'oubliez pas votre rendez-vous "${serviceName}" demain à ${time}`,
      type: 'reminder',
      data: { serviceName, date, time },
      actionUrl: `/appointments`
    });
  }

  // Notification de paiement
  async sendPaymentNotification(userId: string, amount: number, status: 'success' | 'failed'): Promise<boolean> {
    const title = status === 'success' ? "Paiement confirmé" : "Problème de paiement";
    const message = status === 'success' 
      ? `Votre paiement de ${amount}€ a été traité avec succès`
      : `Le paiement de ${amount}€ a échoué. Veuillez réessayer`;

    return this.sendNotification({
      userId,
      title,
      message,
      type: 'payment',
      data: { amount, status },
      actionUrl: status === 'failed' ? `/payment` : `/appointments`
    });
  }

  // Obtenir les notifications d'un utilisateur
  async getUserNotifications(userId: string, limit: number = 20): Promise<any[]> {
    try {
      const userNotifications = await db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, userId))
        .orderBy(desc(notifications.createdAt))
        .limit(limit);

      return userNotifications.map(notif => ({
        ...notif,
        data: notif.data ? JSON.parse(notif.data) : null
      }));

    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
      return [];
    }
  }

  // Marquer une notification comme lue
  async markAsRead(notificationId: number): Promise<boolean> {
    try {
      await db
        .update(notifications)
        .set({ isRead: true, readAt: new Date() })
        .where(eq(notifications.id, notificationId));

      return true;

    } catch (error) {
      console.error("Erreur lors du marquage comme lu:", error);
      return false;
    }
  }

  // Marquer toutes les notifications comme lues
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      await db
        .update(notifications)
        .set({ isRead: true, readAt: new Date() })
        .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

      return true;

    } catch (error) {
      console.error("Erreur lors du marquage global:", error);
      return false;
    }
  }

  // Compter les notifications non lues
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const result = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(notifications)
        .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

      return Number(result[0]?.count || 0);

    } catch (error) {
      console.error("Erreur lors du comptage:", error);
      return 0;
    }
  }

  // Supprimer les anciennes notifications
  async cleanupOldNotifications(daysOld: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await db
        .delete(notifications)
        .where(sql`${notifications.createdAt} < ${cutoffDate}`)
        .returning();

      console.log(`🧹 ${result.length} notifications anciennes supprimées`);
      return result.length;

    } catch (error) {
      console.error("Erreur lors du nettoyage:", error);
      return 0;
    }
  }
}

export const notificationService = new NotificationService();