import { useEffect, useState } from "react";
import { databases } from "../lib/appwrite";

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID as string;
const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID as string;

export default function AppwriteTest() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await databases.listDocuments(databaseId, collectionId);
        setDocuments(result.documents);
      } catch (err: any) {
        setError(err.message ?? "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p>⏳ Chargement depuis Appwrite...</p>;
  if (error) return <p>❌ Erreur : {error}</p>;

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Documents Appwrite</h2>
      {documents.length === 0 ? (
        <p>Aucun document trouvé.</p>
      ) : (
        <ul className="list-disc ml-5">
          {documents.map((doc) => (
            <li key={doc.$id}>
              {doc.$id} — {JSON.stringify(doc)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
