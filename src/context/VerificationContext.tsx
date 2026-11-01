import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { VerificationJob, VerificationReport } from "@/types";

interface Ctx {
  job: VerificationJob | null;
  setJob: (j: VerificationJob | null) => void;
  reports: Record<string, VerificationReport>;
  addReport: (r: VerificationReport) => void;
  ready: boolean;
}
const VerificationContext = createContext<Ctx | null>(null);
const JOB = "fs.job";
const REPORTS = "fs.reports";

function safeSet(k: string, v: unknown) {
  try {
    sessionStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* storage full (large image) — keep in memory only */
  }
}

/** Current job + reports for this browser session (works for guests, never persisted long-term). */
export function VerificationProvider({ children }: { children: ReactNode }) {
  const [job, setJobState] = useState<VerificationJob | null>(null);
  const [reports, setReports] = useState<Record<string, VerificationReport>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setJobState(JSON.parse(sessionStorage.getItem(JOB) ?? "null"));
      setReports(JSON.parse(sessionStorage.getItem(REPORTS) ?? "{}"));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const setJob = useCallback((j: VerificationJob | null) => {
    setJobState(j);
    if (j) safeSet(JOB, j);
    else sessionStorage.removeItem(JOB);
  }, []);

  const addReport = useCallback((r: VerificationReport) => {
    setReports((prev) => {
      const next = { ...prev, [r.id]: r };
      safeSet(REPORTS, next);
      return next;
    });
  }, []);

  return (
    <VerificationContext.Provider value={{ job, setJob, reports, addReport, ready }}>
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  const ctx = useContext(VerificationContext);
  if (!ctx) throw new Error("useVerification must be used inside VerificationProvider");
  return ctx;
}
