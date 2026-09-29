import { describe, it, expect } from "vitest";
import { RATE_LIMIT_POLICY, createRateLimiter, rateLimitByLevel } from "./index.js";

describe("حي الحماية المركزي", () => {
  it("السياسة الموحدة تحدد الحدود لكل مستوى", () => {
    expect(RATE_LIMIT_POLICY.public.max).toBe(100);
    expect(RATE_LIMIT_POLICY.authenticated.max).toBe(200);
    expect(RATE_LIMIT_POLICY.admin.max).toBe(300);
  });

  it("ينتج وسيطاً واحداً لكل مستوى", () => {
    const handler = rateLimitByLevel("public");
    expect(typeof handler).toBe("function");
  });

  it("المعمل يبني وسيطاً بإعدادات مخصصة", () => {
    const handler = createRateLimiter({ windowMs: 60000, max: 10 });
    expect(typeof handler).toBe("function");
  });
});
