import type { Lang, User } from "@/types";

/**
 * Mock auth — a clearly labelled demo session. Passwords are NEVER stored.
 * Swap these functions for Supabase / Firebase Auth calls; the shape stays the same.
 */
const SESSION_KEY = "fs.session";

const idFor = (contact: string) => "demo-" + contact.toLowerCase().replace(/[^a-z0-9]/g, "");

export const authService = {
  async login(contact: string, _password: string): Promise<User> {
    await new Promise((r) => setTimeout(r, 700));
    const prev = authService.load();
    const user: User = {
      id: idFor(contact),
      name: prev?.contact === contact ? prev.name : (contact.split("@")[0] ?? contact),
      contact,
      prefLang: prev?.prefLang ?? "en",
      mode: "registered",
    };
    authService.persist(user);
    return user;
  },
  async signup(name: string, contact: string, _password: string, prefLang: Lang): Promise<User> {
    await new Promise((r) => setTimeout(r, 800));
    const user: User = { id: idFor(contact), name, contact, prefLang, mode: "registered" };
    authService.persist(user);
    return user;
  },
  guest(prefLang: Lang): User {
    const user: User = { id: "guest", name: "Guest", contact: "", prefLang, mode: "guest" };
    authService.persist(user);
    return user;
  },
  logout() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
  },
  persist(user: User) {
    // Guests: session only. Registered demo users: name/contact/lang only — no secrets.
    const store = user.mode === "guest" ? sessionStorage : localStorage;
    authService.logout();
    store.setItem(SESSION_KEY, JSON.stringify(user));
  },
  load(): User | null {
    const raw = localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);
    try {
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  },
};
