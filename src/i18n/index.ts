import en, { type Dict } from "./en";
import hi from "./hi";
import pa from "./pa";
import type { Lang } from "@/types";

export const dictionaries: Record<Lang, Dict> = { en, hi, pa };
export const LANGS: { code: Lang; native: string }[] = [
  { code: "en", native: "English" },
  { code: "hi", native: "हिन्दी" },
  { code: "pa", native: "ਪੰਜਾਬੀ" },
];
export const LOCALES: Record<Lang, string> = { en: "en-IN", hi: "hi-IN", pa: "pa-IN" };

export function fmt(str: string, vars: Record<string, string>) {
  return str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}
export type { Dict };
