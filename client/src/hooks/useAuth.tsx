import { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '@/api';

type Session = { id: string; role?: string } | null;
type AuthState = { status: 'loading' | 'ready'; user: Session };

const AuthCtx = createContext<{ auth: AuthState; setUser: (u: Session) => void }>({
  auth: { status: 'loading', user: null },
  setUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ status: 'loading', user: null });

  useEffect(() => {
    let ignore = false;
    apiRequest<{ ok: boolean; user: Session }>('/api/me')
      .then((r) => { if (!ignore) setAuth({ status: 'ready', user: r.user }); })
      .catch(() => { if (!ignore) setAuth({ status: 'ready', user: null }); });
    return () => { ignore = true; };
  }, []);

  const setUser = (u: Session) => setAuth({ status: 'ready', user: u });

  return <AuthCtx.Provider value={{ auth, setUser }}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const { auth, setUser } = useContext(AuthCtx);
  return { ...auth, isAuthenticated: !!auth.user?.id, setUser };
}