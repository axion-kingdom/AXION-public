/**
 * حي الحماية المركزي — تحديد معدل موحد لكل مدن المملكة.
 * السياسة الواحدة: مستويات (public/authenticated/admin) بنوافذ وحدود موثقة.
 */
import rateLimit from "express-rate-limit";
import type { Request, Response } from "express";

export type RateLimitLevel = "public" | "authenticated" | "admin";

export interface RateLimitPolicyEntry {
  windowMs: number;
  max: number;
}

/**
 * السياسة المركزية الموحدة (15 دقيقة):
 * public 100 · authenticated 200 · admin 300 (الحد الأدنى الآمن عبر المدن)
 */
export const RATE_LIMIT_POLICY: Record<RateLimitLevel, RateLimitPolicyEntry> = {
  public: { windowMs: 15 * 60 * 1000, max: 100 },
  authenticated: { windowMs: 15 * 60 * 1000, max: 200 },
  admin: { windowMs: 15 * 60 * 1000, max: 300 },
};

export interface CreateRateLimiterOptions {
  windowMs: number;
  max: number;
  keyGenerator?: (req: Request) => string;
  skip?: (req: Request) => boolean;
  message?: string | Record<string, unknown>;
  /** استجابة مخصصة عند التجاوز (تستخدمها المدن بنماذج أخطائها) */
  handler?: (req: Request, res: Response, next?: unknown) => void;
  standardHeaders?: boolean | "draft-7" | "draft-6" | "draft-8";
  legacyHeaders?: boolean;
  /** خيارات تحقق express-rate-limit (مثل إعدادات trustProxy) */
  validate?: unknown;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

/** معمل الوسيط الموحد — يُبنى عليه كل وسيط في المدن. */
export function createRateLimiter(options: CreateRateLimiterOptions) {
  return rateLimit({
    windowMs: options.windowMs,
    limit: options.max,
    standardHeaders: options.standardHeaders ?? "draft-7",
    legacyHeaders: options.legacyHeaders ?? false,
    keyGenerator: options.keyGenerator,
    skip: options.skip,
    message: options.message ?? "طلبات كثيرة جداً — حاول لاحقاً",
    ...(options.handler ? { handler: options.handler } : {}),
    ...(options.validate ? { validate: options.validate } : {}),
    ...(options.skipSuccessfulRequests !== undefined ? { skipSuccessfulRequests: options.skipSuccessfulRequests } : {}),
    ...(options.skipFailedRequests !== undefined ? { skipFailedRequests: options.skipFailedRequests } : {}),
  });
}

/** وسيط بسياسة المستوى — الاستهلاك المباشر من السياسة الموحدة. */
export function rateLimitByLevel(level: RateLimitLevel) {
  const policy = RATE_LIMIT_POLICY[level];
  return createRateLimiter(policy);
}
