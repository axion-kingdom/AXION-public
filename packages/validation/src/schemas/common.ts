import { z } from "zod";

/** معرّف UUID إلزامي في مسار/استعلام — factory لاسم الحقل */
export function createIdParamSchema(field = "id") {
  return z.object({ [field]: z.string().uuid({ message: "معرّف غير صالح (UUID)" }) });
}

/** ترقيم صفحات موحد — قيم افتراضية آمنة وحدود قصوى (OWASP) */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const emailParam = z.string().email({ message: "بريد إلكتروني غير صالح" }).max(254);

export const uuidParam = z.string().uuid({ message: "معرّف غير صالح (UUID)" });

/** كلمة مرور قوية — طول وأصناف (OWASP Password Cheat Sheet) */
export const strongPasswordParam = z
  .string()
  .min(8, { message: "كلمة المرور أقصر من 8 محارف" })
  .max(128)
  .regex(/[a-z]/, { message: "تحتاج حرفاً صغيراً" })
  .regex(/[A-Z]/, { message: "تحتاج حرفاً كبيراً" })
  .regex(/[0-9]/, { message: "تحتاج رقماً" });

export const phoneParam = z
  .string()
  .regex(/^\+?[0-9]{8,15}$/, { message: "رقم هاتف غير صالح" });

export const dateQueryParam = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "تاريخ غير صالح (YYYY-MM-DD)" });

export function optionalBooleanQueryParam() {
  return z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true"));
}
