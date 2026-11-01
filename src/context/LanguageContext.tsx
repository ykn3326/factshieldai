import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { dictionaries, type Dict } from "@/i18n";
import type { Lang } from "@/types";

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
}
const LanguageContext = createContext<Ctx | null>(null);
const KEY = "fs.lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved === "en" || saved === "hi" || saved === "pa") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(KEY, l);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: dictionaries[lang] }}>{children}</LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslation must be used inside LanguageProvider");
  return ctx;
}
