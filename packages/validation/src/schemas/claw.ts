/**
 * مخططات مدينة claw-web — أُعيد بناؤها من الاستخدام الفعلي في مساراتها
 * (POST /api/auth/login — username/password · POST /api/auth/create-user — username/password/role)
 * النمط: نفس مبدأ city.ts — حقول مثبتة بالدليل، وحدود مطابقة لتنفيذ المدينة.
 */
import { z } from "zod";

export const clawLoginSchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(200),
});

export const clawCreateUserSchema = z.object({
  username: z.string().min(3).max(100),
  password: z.string().min(8).max(200),
  role: z.enum(["admin", "viewer"]),
});

export const clawSchemas = {
  login: clawLoginSchema,
  createUser: clawCreateUserSchema,
} as const;
