import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    // Redirection immédiate pour les pages inexistantes
    console.log(`🔍 Page 404 - Redirection vers /`);
    window.location.replace('/');
  }, []);

  // Retourner null pour empêcher tout rendu
  return null;
}
    </div>
  );
}
