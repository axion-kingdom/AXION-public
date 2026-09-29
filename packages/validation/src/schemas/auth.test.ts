import { describe, expect, it } from "vitest";
import { loginSchema, forgotPasswordSchema, resetPasswordSchema } from "./auth.js";

describe("حي التحقق — مخططات المصادقة", () => {
  it("loginSchema يرفض البريد التالف وكلمة المرور الفارغة", () => {
    expect(loginSchema.safeParse({ email: "bad", password: "" }).success).toBe(false);
    expect(loginSchema.safeParse({ email: "guard@axion.kingdom", password: "x" }).success).toBe(true);
  });

  it("forgotPasswordSchema يتطلب بريداً صالحاً", () => {
    expect(forgotPasswordSchema.safeParse({ email: "bad" }).success).toBe(false);
    expect(forgotPasswordSchema.safeParse({ email: "guard@axion.kingdom" }).success).toBe(true);
  });

  it("resetPasswordSchema يفرض رمزاً طويلاً وكلمة مرور قوية", () => {
    expect(resetPasswordSchema.safeParse({ token: "short", password: "Weak1" }).success).toBe(false);
    expect(
      resetPasswordSchema.safeParse({ token: "x".repeat(20), password: "StrongPass1" }).success
    ).toBe(true);
  });
});
