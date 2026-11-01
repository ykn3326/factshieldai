/**
 * Single app configuration.
 * NEVER put API keys or secrets here — everything in import.meta.env.VITE_* is
 * shipped to the browser. Real keys (OCR, LLM, search, auth admin) belong on the
 * Python/Flask backend or in server environment variables only.
 */
export const API_BASE_URL: string = import.meta.env["VITE_API_BASE_URL"] ?? "";
export const USE_MOCK_DATA: boolean = (import.meta.env["VITE_USE_MOCK"] ?? "true") !== "false" || !API_BASE_URL;
