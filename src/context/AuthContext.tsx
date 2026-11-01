import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authService } from "@/services/authService";
import type { Lang, User } from "@/types";

interface Ctx {
  user: User | null;
  ready: boolean;
  isRegistered: boolean;
  login: (contact: string, password: string) => Promise<User>;
  signup: (name: string, contact: string, password: string, prefLang: Lang) => Promise<User>;
  continueAsGuest: (prefLang: Lang) => User;
  logout: () => void;
  updateUser: (patch: Partial<Pick<User, "name" | "contact" | "prefLang">>) => void;
}
const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(authService.load());
    setReady(true);
  }, []);

  const value: Ctx = {
    user,
    ready,
    isRegistered: user?.mode === "registered",
    login: async (c, p) => {
      const u = await authService.login(c, p);
      setUser(u);
      return u;
    },
    signup: async (n, c, p, l) => {
      const u = await authService.signup(n, c, p, l);
      setUser(u);
      return u;
    },
    continueAsGuest: (l) => {
      const u = authService.guest(l);
      setUser(u);
      return u;
    },
    logout: () => {
      authService.logout();
      setUser(null);
    },
    updateUser: (patch) => {
      if (!user) return;
      const u = { ...user, ...patch };
      authService.persist(u);
      setUser(u);
    },
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
