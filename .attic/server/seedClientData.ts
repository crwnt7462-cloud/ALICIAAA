import bcrypt from "bcrypt";
import { db } from "./db";
import { clientAccounts } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function seedClientData() {
  try {
    console.log("🌱 Création de données de test client...");

    // Vérifier si le client test existe déjà
    const [existingClient] = await db
      .select()
      .from(clientAccounts)
      .where(eq(clientAccounts.email, "client@test.com"));

    if (!existingClient) {
      // Créer un client de test
      const hashedPassword = await bcrypt.hash("client123", 12);
      
      await db.insert(clientAccounts).values({
        email: "client@test.com",
        password: hashedPassword,
        firstName: "Marie",
        lastName: "Dupont",
        phone: "06 12 34 56 78",
        loyaltyPoints: 150,
        clientStatus: "vip",
        isActive: true,
        isVerified: true,
      });

      console.log("✅ Compte client test créé:");
      console.log("Email: client@test.com");
      console.log("Mot de passe: client123");
    } else {
      console.log("✅ Compte client test déjà existant");
    }

    // Créer un deuxième client
    const [existingClient2] = await db
      .select()
      .from(clientAccounts)
      .where(eq(clientAccounts.email, "marie.martin@email.com"));

    if (!existingClient2) {
      const hashedPassword2 = await bcrypt.hash("password123", 12);
      
      await db.insert(clientAccounts).values({
        email: "marie.martin@email.com",
        password: hashedPassword2,
        firstName: "Marie",
        lastName: "Martin",
        phone: "06 98 76 54 32",
        loyaltyPoints: 250,
        clientStatus: "premium",
        isActive: true,
        isVerified: true,
      });

      console.log("✅ Deuxième compte client créé:");
      console.log("Email: marie.martin@email.com");
      console.log("Mot de passe: password123");
    }

  } catch (error) {
    console.error("❌ Erreur lors de la création des clients test:", error);
  }
}