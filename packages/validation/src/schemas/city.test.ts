import { describe, expect, it } from "vitest";
import {
  blogQuerySchema,
  contactFormSchema,
  createNewsletterCampaignSchema,
  maintenanceToggleSchema,
  monitoringAlertsQuerySchema,
  newsletterSubscribersQuerySchema,
  planIdSchema,
  testimonialsQuerySchema,
  youtubeVideosQuerySchema,
} from "./city.js";
import { resetPasswordSchema } from "./auth.js";

describe("حي التحقق — مخططات مدينة binarjoinanalytic (معاد بناؤها من الاستخدام)", () => {
  it("معرّفات المسارات تقبل UUID وترفض التالف", () => {
    expect(planIdSchema.safeParse({ id: "93393261-79b9-4b44-9da3-92bb9034ca0d" }).success).toBe(true);
    expect(planIdSchema.safeParse({ id: "x" }).success).toBe(false);
  });

  it("استعلام المشتركين يقبل الحقول الموثقة ويرفض الحدود المجنونة", () => {
    const ok = newsletterSubscribersQuerySchema.safeParse({
      search: "a",
      locale: "ar",
      dateFrom: "2026-08-01",
      limit: "50",
    });
    expect(ok.success).toBe(true);
    expect(newsletterSubscribersQuerySchema.safeParse({ limit: "9999" }).success).toBe(false);
  });

  it("أجسام الإنشاء تحقق المثبت وتمرر غير الموثق (لا تسقط حقول المدينة)", () => {
    const r = createNewsletterCampaignSchema.safeParse({
      name: "حملة",
      unknownField: { anything: true },
    });
    expect(r.success).toBe(true);
    expect((r.data as Record<string, unknown>).unknownField).toEqual({ anything: true });
  });

  it("تبديل الصيانة والمراقبة والرئيسية واليوتيوب بحدود آمنة", () => {
    expect(maintenanceToggleSchema.safeParse({ active: true }).success).toBe(true);
    expect(monitoringAlertsQuerySchema.safeParse({ status: "open", limit: "20" }).success).toBe(true);
    expect(testimonialsQuerySchema.safeParse({ locale: "en", limit: "10" }).success).toBe(true);
    expect(youtubeVideosQuerySchema.safeParse({ maxResults: "15" }).success).toBe(true);
    expect(testimonialsQuerySchema.safeParse({ locale: "fr" }).success).toBe(false);
  });

  it("نموذج التواصل يتحقق من البريد إذا وُجد", () => {
    expect(contactFormSchema.safeParse({ email: "bad", message: "x" }).success).toBe(false);
    expect(contactFormSchema.safeParse({ email: "guard@axion.kingdom", message: "x" }).success).toBe(true);
  });

  it("blogQuerySchema يعالج القيم النصية للترقيم", () => {
    const r = blogQuerySchema.safeParse({ page: "2", limit: "30", featured: "true" });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.page).toBe(2);
      expect(r.data.featured).toBe("true");
    }
  });

  it("resetPasswordSchema منسجم مع مخططات المصادقة المركزية", () => {
    expect(resetPasswordSchema.safeParse({ token: "short", password: "Weak1" }).success).toBe(false);
    expect(
      resetPasswordSchema.safeParse({ token: "x".repeat(20), password: "StrongPass1" }).success
    ).toBe(true);
  });
});
