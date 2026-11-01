import { describe, expect, it } from "vitest";
import { languageDetectionService } from "@/services/languageDetectionService";
import { pickTemplate } from "@/data/mockReports";
import { isEmailOrMobile } from "@/lib/validation";
import { validateImageFile, isValidUrl } from "@/components/verify/VerificationBox";
import { SAMPLE_INPUTS } from "@/data/sampleInputs";

describe("content language detection", () => {
  it("Gurmukhi → Punjabi", () => expect(languageDetectionService.detect(SAMPLE_INPUTS.pa)).toBe("pa"));
  it("Devanagari → Hindi", () => expect(languageDetectionService.detect(SAMPLE_INPUTS.hi)).toBe("hi"));
  it("Latin → English", () => expect(languageDetectionService.detect(SAMPLE_INPUTS.en)).toBe("en"));
  it("digits only → other", () => expect(languageDetectionService.detect("12345 !!")).toBe("other"));
});

describe("demo report selection", () => {
  it("samples map to one status each", () => {
    expect(pickTemplate(SAMPLE_INPUTS.en).status).toBe("misleading");
    expect(pickTemplate(SAMPLE_INPUTS.hi).status).toBe("verified");
    expect(pickTemplate(SAMPLE_INPUTS.pa).status).toBe("review");
    expect(pickTemplate(SAMPLE_INPUTS.en2).status).toBe("unverified");
  });
});

describe("validation", () => {
  it("accepts email or 10-digit Indian mobile with optional +91", () => {
    expect(isEmailOrMobile("a@b.com")).toBe(true);
    expect(isEmailOrMobile("9876543210")).toBe(true);
    expect(isEmailOrMobile("+91 98765 43210")).toBe(true);
    expect(isEmailOrMobile("12345")).toBe(false);
  });
  it("images limited to supported types and 10 MB", () => {
    expect(validateImageFile({ name: "a.png", type: "image/png", size: 1000 })).toBeNull();
    expect(validateImageFile({ name: "a.pdf", type: "application/pdf", size: 1000 })).toBe("fileType");
    expect(validateImageFile({ name: "a.jpg", type: "image/jpeg", size: 10 * 1024 * 1024 + 1 })).toBe("fileSize");
  });
  it("links must be http/https", () => {
    expect(isValidUrl("https://example.com/x")).toBe(true);
    expect(isValidUrl("ftp://example.com")).toBe(false);
  });
});
