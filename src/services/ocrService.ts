import { API_BASE_URL, USE_MOCK_DATA } from "@/lib/config";
import { DEMO_OCR_TEXT } from "@/data/sampleInputs";

/** OCR runs on the backend (e.g. Tesseract / cloud vision). Keys stay server-side. */
export const ocrService = {
  async extract(imageDataUrl: string): Promise<string> {
    if (USE_MOCK_DATA) return DEMO_OCR_TEXT;
    const res = await fetch(`${API_BASE_URL}/api/ocr`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageDataUrl }),
    });
    if (!res.ok) throw new Error("OCR failed");
    return (await res.json()).text as string;
  },
};
