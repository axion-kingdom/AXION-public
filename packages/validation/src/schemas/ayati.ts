/**
 * مخططات مدينة ayati — أُعيد بناؤها من الاستخدام الفعلي (lib/api-zod/generated)
 * المسار الموثق: GET /health + /healthz → HealthCheckResponse { status: string }.
 */
import { z } from "zod";

export const ayatiHealthSchema = z.object({
  status: z.string(),
});

export const ayatiSchemas = {
  health: ayatiHealthSchema,
} as const;
