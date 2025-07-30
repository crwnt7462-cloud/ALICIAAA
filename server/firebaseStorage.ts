import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { adminDb } from './firebaseAdmin';
import type { IStorage } from './storage';
import type { 
  User, 
  UpsertUser,
  Client,
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
        createdAt: data?.createdAt?.toDate(),
        updatedAt: data?.updatedAt?.toDate()
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
          updatedAt: Timestamp.fromDate(now)
        });
      } else {
        // Create new user
        await userRef.set({
          ...userData,
          createdAt: Timestamp.fromDate(now),
          updatedAt: Timestamp.fromDate(now)
        });
      }
      
      const updatedDoc = await userRef.get();
      const data = updatedDoc.data()!;
      
      return {
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as User;
    } catch (error) {
      console.error('Erreur upsertUser Firebase:', error);
      throw error;
    }
  }

  // Client operations
  async getClientByEmail(email: string): Promise<Client | undefined> {
    try {
      const clientsRef = adminDb.collection('clients');
      const q = query(clientsRef, where('email', '==', email), limit(1));
      const snapshot = await q.get();
      
      if (snapshot.empty) return undefined;
      
      const doc = snapshot.docs[0];
      const data = doc.data();
      
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as Client;
    } catch (error) {
      console.error('Erreur getClientByEmail Firebase:', error);
      return undefined;
    }
  }

  async createClient(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    try {
      const now = new Date();
      const docRef = await adminDb.collection('clients').add({
        ...clientData,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now)
      });
      
      const doc = await docRef.get();
      const data = doc.data()!;
      
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as Client;
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
        updatedAt: data?.updatedAt?.toDate()
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
        updatedAt: Timestamp.fromDate(now)
      }, { merge: true });
      
      const updatedDoc = await salonRef.get();
      const data = updatedDoc.data()!;
      
      return {
        ...data,
        updatedAt: data.updatedAt?.toDate()
      } as BookingPage;
    } catch (error) {
      console.error('Erreur saveSalon Firebase:', error);
      throw error;
    }
  }

  // Appointment operations
  async createAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
    try {
      const now = new Date();
      const docRef = await adminDb.collection('appointments').add({
        ...appointmentData,
        dateTime: Timestamp.fromDate(appointmentData.dateTime),
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now)
      });
      
      const doc = await docRef.get();
      const data = doc.data()!;
      
      return {
        ...data,
        id: doc.id,
        dateTime: data.dateTime?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as Appointment;
    } catch (error) {
      console.error('Erreur createAppointment Firebase:', error);
      throw error;
    }
  }

  async getAppointmentsByUserId(userId: string): Promise<Appointment[]> {
    try {
      const appointmentsRef = adminDb.collection('appointments');
      const q = query(
        appointmentsRef, 
        where('userId', '==', userId),
        orderBy('dateTime', 'desc')
      );
      const snapshot = await q.get();
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          dateTime: data.dateTime?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as Appointment;
      });
    } catch (error) {
      console.error('Erreur getAppointmentsByUserId Firebase:', error);
      return [];
    }
  }

  // Notification operations
  async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    try {
      const now = new Date();
      const docRef = await adminDb.collection('notifications').add({
        ...notificationData,
        createdAt: Timestamp.fromDate(now)
      });
      
      const doc = await docRef.get();
      const data = doc.data()!;
      
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate()
      } as Notification;
    } catch (error) {
      console.error('Erreur createNotification Firebase:', error);
      throw error;
    }
  }

  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    try {
      const notificationsRef = adminDb.collection('notifications');
      const q = query(
        notificationsRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const snapshot = await q.get();
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate()
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