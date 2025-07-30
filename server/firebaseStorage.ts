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
  BookingPage,
  Subscription,
  RegisterRequest,
  ClientRegisterRequest
} from '@shared/schema';

export class FirebaseStorage implements IStorage {
  
  // User operations (mandatory for auth)
  async getUser(id: string): Promise<User | undefined> {
    try {
      const userDoc = await adminDb.collection('users').doc(id).get();
      if (!userDoc.exists) return undefined;
      
      const data = userDoc.data();
      return data as User;
    } catch (error) {
      console.error('Erreur getUser Firebase:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const userSnapshot = await adminDb.collection('users').where('email', '==', email).limit(1).get();
      if (userSnapshot.empty) return undefined;
      
      const data = userSnapshot.docs[0].data();
      return data as User;
    } catch (error) {
      console.error('Erreur getUserByEmail Firebase:', error);
      return undefined;
    }
  }

  async createUser(userData: RegisterRequest): Promise<User> {
    try {
      const userRef = adminDb.collection('users').doc();
      const now = new Date();
      
      const newUser = {
        id: userRef.id,
        ...userData,
        createdAt: now,
        updatedAt: now
      };
      
      await userRef.set(newUser);
      return newUser as User;
    } catch (error) {
      console.error('Erreur createUser Firebase:', error);
      throw error;
    }
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  // Client Account operations
  async createClientAccount(clientData: ClientRegisterRequest): Promise<ClientAccount> {
    try {
      const clientRef = adminDb.collection('clients').doc();
      const now = new Date();
      
      const newClient = {
        id: parseInt(clientRef.id.substring(0, 8), 16), // Convert to number
        ...clientData,
        createdAt: now,
        updatedAt: now
      };
      
      await clientRef.set(newClient);
      return newClient as ClientAccount;
    } catch (error) {
      console.error('Erreur createClientAccount Firebase:', error);
      throw error;
    }
  }

  async getClientAccountByEmail(email: string): Promise<ClientAccount | undefined> {
    try {
      const clientSnapshot = await adminDb.collection('clients').where('email', '==', email).limit(1).get();
      if (clientSnapshot.empty) return undefined;
      
      const data = clientSnapshot.docs[0].data();
      return data as ClientAccount;
    } catch (error) {
      console.error('Erreur getClientAccountByEmail Firebase:', error);
      return undefined;
    }
  }

  async authenticateClient(email: string, password: string): Promise<ClientAccount | null> {
    const client = await this.getClientAccountByEmail(email);
    if (client && client.password === password) {
      return client;
    }
    return null;
  }

  // Salon Data operations
  async getSalonData(salonId: string): Promise<any | undefined> {
    try {
      const salonDoc = await adminDb.collection('salons').doc(salonId).get();
      if (!salonDoc.exists) return undefined;
      return salonDoc.data();
    } catch (error) {
      console.error('Erreur getSalonData Firebase:', error);
      return undefined;
    }
  }

  async saveSalonData(salonId: string, salonData: any): Promise<void> {
    try {
      await adminDb.collection('salons').doc(salonId).set(salonData);
      console.log('💾 Sauvegarde salon Firebase:', salonId);
    } catch (error) {
      console.error('Erreur saveSalonData Firebase:', error);
      throw error;
    }
  }

  // Stub implementations for remaining IStorage methods
  async getServices(userId: string) { return []; }
  async createService(service: any) { return service; }
  async updateService(id: number, service: any) { return service; }
  async deleteService(id: number) { return; }
  async getClients(userId: string) { return []; }
  async updateClient(id: number, client: any) { return client; }
  async deleteClient(id: number) { return; }
  async getStaff(userId: string) { return []; }
  async createStaff(staff: any) { return staff; }
  async updateStaff(id: number, staff: any) { return staff; }
  async deleteStaff(id: number) { return; }
  async getAppointments(userId: string) { return []; }
  async createAppointment(appointment: any) { return appointment; }
  async updateAppointment(id: number, appointment: any) { return appointment; }
  async deleteAppointment(id: number) { return; }
  async getClientNotes(clientId: number) { return []; }
  async createClientNote(note: any) { return note; }
  async updateClientNote(id: number, note: any) { return note; }
  async deleteClientNote(id: number) { return; }
  async getCustomTags(userId: string) { return []; }
  async createCustomTag(tag: any) { return tag; }
  async updateCustomTag(id: number, tag: any) { return tag; }
  async deleteCustomTag(id: number) { return; }
  async getSalonPhotos(salonId: string) { return []; }
  async createSalonPhoto(photo: any) { return photo; }
  async deleteSalonPhoto(id: number) { return; }
  async createSalonRegistration(registration: any) { return registration; }
  async getSalonRegistration(id: string) { return undefined; }
  async updateSalonRegistration(id: string, registration: any) { return registration; }
  async deleteSalonRegistration(id: string) { return; }
  async createBusinessRegistration(registration: any) { return registration; }
  async getBusinessRegistration(id: string) { return undefined; }
  async updateBusinessRegistration(id: string, registration: any) { return registration; }
  async deleteBusinessRegistration(id: string) { return; }
  async getReviews(salonId: string) { return []; }
  async createReview(review: any) { return review; }
  async getNotifications(userId: string) { return []; }
  async createNotification(notification: any) { return notification; }
  async markNotificationAsRead(id: number) { return; }
  async getSubscriptions(userId: string) { return []; }
  async createSubscription(subscription: any) { return subscription; }
  async updateSubscription(id: number, subscription: any) { return subscription; }
  async getMessages(conversationId: string) { return []; }
  async createMessage(message: any) { return message; }

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