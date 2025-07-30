import { adminDb } from './firebaseAdmin';
import type { IStorage } from './storage';
import type { 
  User, 
  UpsertUser,
  ClientAccount,
  Appointment,
  Service,
  Staff,
  Review,
  Notification,
  Message,
  BookingPage,
  Subscription
} from '@shared/schema';

export class FirebaseStorage implements IStorage {
  
  // User operations (mandatory for auth)
  async getUser(id: string): Promise<User | undefined> {
    try {
      const userDoc = await adminDb.collection('users').doc(id).get();
      if (!userDoc.exists) return undefined;
      
      const data = userDoc.data();
      return {
        ...data,
        createdAt: data?.createdAt,
        updatedAt: data?.updatedAt
      } as User;
    } catch (error) {
      console.error('Erreur getUser Firebase:', error);
      return undefined;
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
      const userRef = adminDb.collection('users').doc(userData.id);
      const now = new Date();
      
      const userDoc = await userRef.get();
      
      if (userDoc.exists) {
        // Update existing user
        await userRef.update({
          ...userData,
          updatedAt: now
        });
      } else {
        // Create new user
        await userRef.set({
          ...userData,
          createdAt: now,
          updatedAt: now
        });
      }
      
      const updatedDoc = await userRef.get();
      const data = updatedDoc.data()!;
      
      return {
        ...data,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      } as User;
    } catch (error) {
      console.error('Erreur upsertUser Firebase:', error);
      throw error;
    }
  }

  // Client operations
  async getClientByEmail(email: string): Promise<ClientAccount | undefined> {
    try {
      const clientsRef = adminDb.collection('clients');
      const snapshot = await clientsRef.where('email', '==', email).limit(1).get();
      
      if (snapshot.empty) return undefined;
      
      const doc = snapshot.docs[0];
      const data = doc.data();
      
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as ClientAccount;
    } catch (error) {
      console.error('Erreur getClientByEmail Firebase:', error);
      return undefined;
    }
  }

  async createClient(clientData: any): Promise<ClientAccount> {
    try {
      const now = new Date();
      const docRef = await adminDb.collection('clients').add({
        ...clientData,
        createdAt: now,
        updatedAt: now
      });
      
      const doc = await docRef.get();
      const data = doc.data()!;
      
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      } as ClientAccount;
    } catch (error) {
      console.error('Erreur createClient Firebase:', error);
      throw error;
    }
  }

  // Salon/BookingPage operations
  async getSalon(id: string): Promise<BookingPage | undefined> {
    try {
      const salonDoc = await adminDb.collection('salons').doc(id).get();
      if (!salonDoc.exists) return undefined;
      
      const data = salonDoc.data();
      return {
        ...data,
        updatedAt: data?.updatedAt
      } as BookingPage;
    } catch (error) {
      console.error('Erreur getSalon Firebase:', error);
      return undefined;
    }
  }

  async saveSalon(salonData: BookingPage): Promise<BookingPage> {
    try {
      const salonRef = adminDb.collection('salons').doc(salonData.id);
      const now = new Date();
      
      await salonRef.set({
        ...salonData,
        updatedAt: now
      }, { merge: true });
      
      const updatedDoc = await salonRef.get();
      const data = updatedDoc.data()!;
      
      return {
        ...data,
        updatedAt: data.updatedAt
      } as BookingPage;
    } catch (error) {
      console.error('Erreur saveSalon Firebase:', error);
      throw error;
    }
  }

  // Appointment operations
  async createAppointment(appointmentData: any): Promise<Appointment> {
    try {
      const now = new Date();
      const docRef = await adminDb.collection('appointments').add({
        ...appointmentData,
        dateTime: appointmentData.dateTime,
        createdAt: now,
        updatedAt: now
      });
      
      const doc = await docRef.get();
      const data = doc.data()!;
      
      return {
        ...data,
        id: doc.id,
        dateTime: data.dateTime,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      } as Appointment;
    } catch (error) {
      console.error('Erreur createAppointment Firebase:', error);
      throw error;
    }
  }

  async getAppointmentsByUserId(userId: string): Promise<Appointment[]> {
    try {
      const appointmentsRef = adminDb.collection('appointments');
      const snapshot = await appointmentsRef
        .where('userId', '==', userId)
        .orderBy('dateTime', 'desc')
        .get();
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          dateTime: data.dateTime,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        } as Appointment;
      });
    } catch (error) {
      console.error('Erreur getAppointmentsByUserId Firebase:', error);
      return [];
    }
  }

  // Notification operations
  async createNotification(notificationData: any): Promise<Notification> {
    try {
      const now = new Date();
      const docRef = await adminDb.collection('notifications').add({
        ...notificationData,
        createdAt: now
      });
      
      const doc = await docRef.get();
      const data = doc.data()!;
      
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt
      } as Notification;
    } catch (error) {
      console.error('Erreur createNotification Firebase:', error);
      throw error;
    }
  }

  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    try {
      const notificationsRef = adminDb.collection('notifications');
      const snapshot = await notificationsRef
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt
        } as Notification;
      });
    } catch (error) {
      console.error('Erreur getNotificationsByUserId Firebase:', error);
      return [];
    }
  }

  // Méthodes supplémentaires selon les besoins...
  // TODO: Implémenter toutes les autres méthodes de l'interface IStorage
}

export const firebaseStorage = new FirebaseStorage();