import type { Databases, Models } from "node-appwrite";
const DB_ID = process.env.APPWRITE_DB_ID!;
const COL_ID = process.env.APPWRITE_COLLECTION_SALONS!;

export type SalonDoc = Models.Document & {
  name?: string;
  // étendre selon le schéma Appwrite
};

export function makeSalonRepoAppwrite(databases: Databases) {
  return {
    async list(): Promise<SalonDoc[]> {
      const res = await databases.listDocuments(DB_ID, COL_ID);
      return res.documents as SalonDoc[];
    },
    async get(id: string): Promise<SalonDoc | null> {
      try {
        const doc = await databases.getDocument(DB_ID, COL_ID, id);
        return doc as SalonDoc;
      } catch (e) {
        return null;
      }
    },
    // TODO: create/update/delete si besoin
  };
}
