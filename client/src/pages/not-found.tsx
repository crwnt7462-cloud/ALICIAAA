import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="min-h-[60vh] grid place-items-center p-8 text-center">
      <div>
        <h1 className="text-3xl font-semibold">Page introuvable</h1>
        <p className="mt-2 text-muted-foreground">
          La page que vous cherchez n’existe pas ou a été déplacée.
        </p>
        <Link to="/" className="mt-6 inline-block rounded-xl border px-4 py-2">
          Retour à l’accueil
        </Link>
      </div>
    </main>
  );
}
