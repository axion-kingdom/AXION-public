import { z } from "zod";
import { emailParam, strongPasswordParam } from "./common.js";

export const loginSchema = z.object({
  email: emailParam,
  password: z.string().min(1, { message: "كلمة المرور مطلوبة" }).max(128),
});

export const forgotPasswordSchema = z.object({
  email: emailParam,
  language: z.string().max(10).optional(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20, { message: "رمز غير صالح" }),
  password: strongPasswordParam,
});

export const verifyTokenSchema = z.object({
  token: z.string().min(20, { message: "رمز غير صالح" }),
});
