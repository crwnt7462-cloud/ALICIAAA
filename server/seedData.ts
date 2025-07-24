import { db } from "./db";
import { users, bookingPages, clientAccounts } from "@shared/schema";
import bcrypt from "bcrypt";

export async function seedTestData() {
  try {
    // Créer le compte test professionnel avec mot de passe hashé
    const hashedPassword = await bcrypt.hash("test1234", 10);
    
    const [testUser] = await db
      .insert(users)
      .values({
        id: "test-pro-user",
        email: "test@monapp.com",
        password: hashedPassword,
        businessName: "Salon Excellence Test",
        firstName: "Marie",
        lastName: "Dubois",
        phone: "01 42 34 56 78",
        address: "123 Avenue de la Beauté",
        city: "Paris",
        postalCode: "75001",
        isVerified: true,
        mentionHandle: "@usemyrr"
      })
      .onConflictDoNothing()
      .returning();

    // Créer une page de salon associée
    if (testUser) {
      await db
        .insert(bookingPages)
        .values({
          userId: testUser.id,
          pageUrl: "salon-excellence-test",
          salonName: "Salon Excellence Test",
          salonDescription: "Salon de beauté professionnel spécialisé dans les soins capillaires et esthétiques",
          salonAddress: "123 Avenue de la Beauté, 75001 Paris",
          salonPhone: "01 42 34 56 78",
          salonEmail: "test@monapp.com",
          selectedServices: [1, 2, 3],
          template: "moderne",
          primaryColor: "#8B5CF6",
          secondaryColor: "#F59E0B",
          showPrices: true,
          enableOnlineBooking: true,
          requireDeposit: true,
          depositPercentage: 30,
          businessHours: {
            monday: { open: '09:00', close: '18:00', closed: false },
            tuesday: { open: '09:00', close: '18:00', closed: false },
            wednesday: { open: '09:00', close: '18:00', closed: false },
            thursday: { open: '09:00', close: '19:00', closed: false },
            friday: { open: '09:00', close: '19:00', closed: false },
            saturday: { open: '08:00', close: '17:00', closed: false },
            sunday: { open: '10:00', close: '16:00', closed: false }
          },
          isPublished: true,
          views: 0,
          bookings: 0
        })
        .onConflictDoNothing();
    }

    // Créer un compte client test
    await db
      .insert(clientAccounts)
      .values({
        id: "test-client-user",
        email: "client@test.com",
        password: await bcrypt.hash("client123", 10),
        firstName: "Jean",
        lastName: "Martin",
        phone: "06 12 34 56 78",
        isVerified: true,
        mentionHandle: "@jeanmartin"
      })
      .onConflictDoNothing();

    console.log("✅ Données de test créées avec succès");
    console.log("Compte PRO: test@monapp.com / test1234");
    console.log("Handle PRO: @usemyrr");
    console.log("Compte CLIENT: client@test.com / client123");
    
  } catch (error) {
    console.error("Erreur lors de la création des données de test:", error);
  }
}