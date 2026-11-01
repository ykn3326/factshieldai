import { z } from "zod";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MOBILE = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/;

/** Email, or a 10-digit Indian mobile number (optionally with +91). */
export function isEmailOrMobile(v: string) {
  const s = v.trim();
  return EMAIL.test(s) || MOBILE.test(s.replace(/[\s-]/g, "").replace(/^\+?91(?=\d{10}$)/, ""));
}

/** Error values are i18n keys from `errors.*`. */
export const loginSchema = z.object({
  contact: z.string().trim().min(1, "required").refine(isEmailOrMobile, "contactInvalid"),
  password: z.string().min(1, "required").min(8, "pwMin"),
});

export const signupSchema = z
  .object({
    name: z.string().trim().min(1, "required").min(2, "nameMin"),
    contact: z.string().trim().min(1, "required").refine(isEmailOrMobile, "contactInvalid"),
    password: z.string().min(8, "pwMin"),
    confirm: z.string().min(1, "required"),
    prefLang: z.enum(["en", "hi", "pa"]),
    agree: z.boolean().refine((v) => v, "agree"),
  })
  .refine((d) => d.password === d.confirm, { message: "pwMatch", path: ["confirm"] });

export const contactSchema = z.object({
  name: z.string().trim().min(2, "nameMin"),
  email: z.string().trim().regex(EMAIL, "emailInvalid"),
  subject: z.string().trim().min(3, "subjectMin"),
  message: z.string().trim().min(10, "messageMin"),
});

export function passwordStrength(pw: string): 0 | 1 | 2 | 3 | 4 {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 14) s++;
  return Math.max(1, s) as 1 | 2 | 3 | 4;
}
