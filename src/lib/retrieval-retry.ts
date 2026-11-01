/** One bounded recovery layer for transient retrieval failures; never retries denials. */
export async function retrieveWithBackoff(call: () => Promise<Response>, signal: AbortSignal): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const response = await call();
    if (!(response.status === 429 || response.status >= 500) || attempt >= 2) return response;
    const header = response.headers.get("Retry-After");
    const seconds = header && /^\d+(\.\d+)?$/.test(header) ? Number(header) * 1000 : header ? Date.parse(header) - Date.now() : NaN;
    const delay = Number.isFinite(seconds) ? Math.max(1000, seconds) : 4000 * 2 ** attempt + Math.random() * 1000;
    await response.body?.cancel();
    await new Promise<void>((resolve, reject) => {
      if (signal.aborted) { reject(new DOMException("Aborted", "AbortError")); return; }
      const abort = () => { clearTimeout(timer); reject(new DOMException("Aborted", "AbortError")); };
      const timer = setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, delay);
      signal.addEventListener("abort", abort, { once: true });
    });
  }
}