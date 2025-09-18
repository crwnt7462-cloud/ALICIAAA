import React, { useEffect, useState } from 'react';
import { databases } from '../lib/appwrite';

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

export default function AppwriteDemo() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    databases.listDocuments(databaseId, collectionId)
      .then((response) => setDocuments(response.documents))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <h2>Documents Appwrite</h2>
      {error && <div style={{color: 'red'}}>{error}</div>}
      <ul>
        {documents.map(doc => (
          <li key={doc.$id}>{JSON.stringify(doc)}</li>
        ))}
      </ul>
    </div>
  );
}
