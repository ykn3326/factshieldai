import type { ContentLang } from "@/types";

/**
 * Demo detector: counts characters per Unicode script.
 * Replace `detect` with a call to the backend language-ID endpoint when ready.
 */
export const languageDetectionService = {
  isDemo: true,
  detect(text: string): ContentLang {
    let guru = 0, deva = 0, latin = 0;
    for (const ch of text) {
      const c = ch.codePointAt(0)!;
      if (c >= 0x0a00 && c <= 0x0a7f) guru++;
      else if (c >= 0x0900 && c <= 0x097f) deva++;
      else if ((c >= 65 && c <= 90) || (c >= 97 && c <= 122)) latin++;
    }
    const max = Math.max(guru, deva, latin);
    if (max === 0) return "other";
    if (max === guru) return "pa";
    if (max === deva) return "hi";
    return "en";
  },
};
