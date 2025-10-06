import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    
    // Parsing des erreurs pour plus de détails
    let errorMessage = `${res.status}: ${res.statusText}`;
    try {
      const errorData = JSON.parse(text);
      if (errorData.error) {
        errorMessage = errorData.error;
        if (errorData.details) {
          errorMessage += ` - ${errorData.details}`;
        }
      }
    } catch {
      errorMessage = text || errorMessage;
    }
    
    throw new Error(errorMessage);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // --- MODE MOCK pour dev local sans backend ---
  // --- MODE MOCK uniquement pour la connexion ---
  if (url === "/api/login" && method === "POST") {
    const d = typeof data === "object" && data !== null ? data as any : {};
    if (d.email === "pro@demo.com" && d.password === "demo123") {
      return new Response(JSON.stringify({
        success: true,
        user: {
          id: "pro-mock-1",
          email: d.email,
          firstName: "Pro",
          lastName: "Démo",
          businessName: "Salon Démo",
          role: "pro"
        },
        token: "mock-token-pro-1"
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: "Identifiants incorrects"
      }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
  }
  if (url === "/api/client/login" && method === "POST") {
    const d = typeof data === "object" && data !== null ? data as any : {};
    if (d.email === "client@demo.com" && d.password === "demo123") {
      return new Response(JSON.stringify({
        success: true,
        client: {
          id: "client-mock-1",
          email: d.email,
          firstName: "Client",
          lastName: "Démo",
          token: "mock-token-client-1",
          role: "client"
        }
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: "Identifiants incorrects"
      }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
  }
  // --- FIN MODE MOCK ---

  // Utiliser le token JWT Supabase pour l'API backend
  let token = localStorage.getItem("proToken");
  
  // Si c'est un token factice (pro-xxx), récupérer un vrai token JWT
  if (token && token.startsWith("pro-")) {
    const supabaseToken = localStorage.getItem("supabaseToken");
    if (supabaseToken) {
      token = supabaseToken;
    } else {
      // Fallback : utiliser le token de test hardcodé pour le développement
      token = "eyJhbGciOiJIUzI1NiIsImtpZCI6IjdPcTFEbTB6VVFOeVNDS3EiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2Vma2Vra2Fqb3lmZ3R5cXppb2h5LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIyOTVjYmFlYS01YmMwLTQ4YzMtOTEzYy0xM2U2MGY0MzU1NzgiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU4OTAwNjIxLCJpYXQiOjE3NTg4OTcwMjEsImVtYWlsIjoiYWdAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbF92ZXJpZmllZCI6dHJ1ZX0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NTg4OTcwMjF9XSwic2Vzc2lvbl9pZCI6IjFmMWQ2YjEzLWU0YmQtNDk0ZC1hY2FhLTc5NTk5NDA0ZjY2YyIsImlzX2Fub255bW91cyI6ZmFsc2V9.5JyfvewWQnEtVWw-6iB4ya4jm61WiKXdd86Y56zTKZ8";
    }
  }
  
  const headers: Record<string, string> = data ? { "Content-Type": "application/json" } : {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        // Retry logic améliorée
        if (error.message.includes('Network error') && failureCount < 2) {
          return true;
        }
        if (error.message.includes('500') && failureCount < 1) {
          return true;
        }
        return false;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
