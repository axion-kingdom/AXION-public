/**
 * مخططات مدينة binarjoinanalytic — أُعيد بناؤها من الاستخدام الفعلي في مساراتها
 * (دليل السطر بعد كل parse/validateRequest) وأُقرّت في الحي المركزي.
 *
 * مبدأ إعادة البناء الآمن: نتحقق من الحقول المثبتة بالدليل، ونمرر الباقي
 * (passthrough) حتى لا تُسقط الحقول غير الموثقة من سلوك المدينة.
 */
import { z } from "zod";
import { createIdParamSchema, emailParam, strongPasswordParam } from "./common.js";

// ── معرّفات المسارات ───────────────────────────────────────────────────────
export const idParamSchema = createIdParamSchema("id");
export const postParamsSchema = createIdParamSchema("id");
export const planIdSchema = createIdParamSchema("id");
export const priceIdSchema = createIdParamSchema("id");
// معرّف رقمي (الرمز يحوّله عبر Number بعد التحقق)
export const alertIdSchema = z.object({ id: z.coerce.number().int().positive() });

// ── استعلامات ──────────────────────────────────────────────────────────────
export const newsletterSubscribersQuerySchema = z.object({
  search: z.string().max(200).optional(),
  locale: z.string().max(10).optional(),
  status: z.string().max(20).optional(),
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  limit: z.coerce.number().int().min(1).max(500).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

export const newsletterCampaignsQuerySchema = z.object({
  status: z.string().max(20).optional(),
  limit: z.coerce.number().int().min(1).max(500).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

export const blogQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  categoryId: z.coerce.number().int().optional(),
  status: z.string().max(20).optional(),
  featured: z.enum(["true", "false"]).optional(),
  search: z.string().max(200).optional(),
  locale: z.string().max(10).optional(),
});

export const relatedQuerySchema = z.object({
  categoryId: z.coerce.number().int().positive(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const maintenanceLogsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(500).optional(),
});

export const monitoringHistoryQuerySchema = z.object({
  jobName: z.string().max(100).optional(),
  since: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)).optional(),
  status: z.string().max(20).optional(),
  limit: z.coerce.number().int().min(1).max(500).optional(),
});

export const monitoringAlertsQuerySchema = z.object({
  status: z.string().max(20).optional(),
  severity: z.string().max(20).optional(),
  type: z.string().max(20).optional(),
  limit: z.coerce.number().int().min(1).max(500).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

export const testimonialsQuerySchema = z.object({
  locale: z.enum(["ar", "en", "hi"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const youtubeVideosQuerySchema = z.object({
  maxResults: z.coerce.number().int().min(1).max(50).optional(),
});

// ── أجسام (تحقق مثبت + تمرير آمن للباقي) ───────────────────────────────────
export const createNewsletterCampaignSchema = z
  .object({ name: z.string().min(1).max(120).optional(), subject: z.string().max(200).optional() })
  .passthrough();

export const updateNewsletterCampaignSchema = z
  .object({ name: z.string().min(1).max(120).optional(), subject: z.string().max(200).optional() })
  .passthrough();

export const createPostSchema = z
  .object({
    title: z.string().min(1).max(300).optional(),
    publishedAt: z.string().optional(),
  })
  .passthrough();

export const contactFormSchema = z
  .object({
    name: z.string().min(1).max(120).optional(),
    email: emailParam.optional(),
    subject: z.string().max(200).optional(),
    message: z.string().min(1).max(5000).optional(),
  })
  .passthrough();

export const settingsPayloadSchema = z.object({}).passthrough();

export const maintenanceToggleSchema = z
  .object({
    active: z.boolean().optional(),
    message: z.string().optional(),
    startAt: z.string().optional(),
    endAt: z.string().optional(),
  })
  .passthrough();

export const maintenanceExceptionSchema = z
  .object({ reason: z.string().max(500).optional() })
  .passthrough();

export const acknowledgeAlertSchema = z
  .object({ notes: z.string().max(1000).optional() })
  .passthrough();

export const verifyResetTokenSchema = z.object({
  token: z.string().min(20),
});
