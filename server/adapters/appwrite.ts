import { Client, Databases } from "node-appwrite";
export function makeAppwrite() {
  const endpoint = process.env.APPWRITE_ENDPOINT!;
  const projectId = process.env.APPWRITE_PROJECT_ID!;
  const apiKey = process.env.APPWRITE_API_KEY!;
    if (!endpoint || !endpoint.startsWith("http")) {
      throw new Error(`APPWRITE_ENDPOINT invalide ou manquant: "${endpoint ?? ''}"`);
    }
    if (!projectId) throw new Error("APPWRITE_PROJECT_ID manquant");
    if (!apiKey) throw new Error("APPWRITE_API_KEY manquant");
    const client = new Client()
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setKey(apiKey); // Admin SDK côté serveur
  const databases = new Databases(client);
  return { client, databases };
}
