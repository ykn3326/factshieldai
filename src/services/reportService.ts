import { seedHistory } from "@/data/mockUsers";
import type { VerificationReport } from "@/types";

/**
 * Prototype: history lives in localStorage per demo user.
 * Replace with backend calls (GET/POST/DELETE /api/reports) when ready.
 */
const key = (userId: string) => `fs.history.${userId}`;

function read(userId: string): VerificationReport[] {
  const raw = localStorage.getItem(key(userId));
  if (raw === null) {
    const seeded = seedHistory();
    localStorage.setItem(key(userId), JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
function write(userId: string, list: VerificationReport[]) {
  // Drop large image data to stay within storage limits.
  const slim = list.map((r) => ({ ...r, request: { ...r.request, imageDataUrl: undefined } }));
  localStorage.setItem(key(userId), JSON.stringify(slim));
}

export const reportService = {
  list: (userId: string) => read(userId),
  save(userId: string, report: VerificationReport) {
    const list = read(userId).filter((r) => r.id !== report.id);
    write(userId, [report, ...list]);
  },
  remove(userId: string, id: string) {
    write(userId, read(userId).filter((r) => r.id !== id));
  },
  clear(userId: string) {
    write(userId, []);
  },
  get: (userId: string, id: string) => read(userId).find((r) => r.id === id),
  download() {
    window.print();
  },
};
