import type { Dict } from "@/i18n";

/** Maps a zod error key (e.g. "pwMin") to the translated message. */
export const errText = (t: Dict, key?: string) => (key ? (t.errors[key as keyof Dict["errors"]] ?? key) : undefined);
