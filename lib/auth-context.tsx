"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { api, getToken, clearToken } from "@/lib/api";
import type { User } from "@/lib/types";

interface AuthContextValue {
  user: User;
  setUser: (u: User) => void;
  refresh: () => Promise<void>;
  logout: () => void;
}

// null tant que non résolu — le provider ne rend les enfants qu'une fois `user` chargé,
// donc `user` est toujours défini dans les consommateurs.
const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = use(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans <AuthProvider>");
  return ctx;
}

function FullScreen({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-paper">{children}</div>
  );
}

/**
 * Garde de route côté client : vérifie le token, charge l'utilisateur,
 * redirige vers /login si absent ou invalide (401).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    router.replace("/login");
  }, [router]);

  const refresh = useCallback(async () => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    try {
      const me = await api.me();
      setUser(me);
    } catch {
      clearToken();
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading || !user) {
    return (
      <FullScreen>
        <p className="flex items-center gap-3 text-ink-soft">
          <Loader2 className="h-5 w-5 animate-spin" />
          Chargement…
        </p>
      </FullScreen>
    );
  }

  return (
    <AuthContext value={{ user, setUser, refresh, logout }}>
      {children}
    </AuthContext>
  );
}
