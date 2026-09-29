import { describe, expect, it, vi } from "vitest";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { validateRequest } from "./validate.js";

function makeReqRes(body?: unknown) {
  const req = { body, query: {}, params: {} } as Request;
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  const next = vi.fn() as NextFunction;
  return { req, res, next };
}

describe("حي التحقق — بوابة الوسيط", () => {
  it("يقبل المدخل الصالح ويمرر الطلب", () => {
    const { req, res, next } = makeReqRes({ email: "guard@axion.kingdom", password: "x" });
    validateRequest({ body: z.object({ email: z.string().email(), password: z.string() }) })(
      req,
      res,
      next
    );
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("يرفض المدخل غير الصالح باستجابة RFC 9457", () => {
    const { req, res, next } = makeReqRes({ email: "bad", password: "x" });
    validateRequest({ body: z.object({ email: z.string().email(), password: z.string() }) })(
      req,
      res,
      next
    );
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "https://axion.kingdom/problems/validation-error",
        status: 400,
        problems: expect.objectContaining({ body: expect.any(Array) }),
      })
    );
  });

  it("يعيد كتابة req.body بالقيم المعالجة (defaults)", () => {
    const { req, res, next } = makeReqRes({});
    validateRequest({
      body: z.object({ page: z.coerce.number().default(1) }),
    })(req, res, next);
    expect(next).toHaveBeenCalled();
    expect((req.body as { page: number }).page).toBe(1);
  });

  it("يسجّل الرفض تلقائياً (الجندي الصامت يكتب الدليل)", async () => {
    const { setValidationLogger, defaultValidationLogger } = await import("./validate.js");
    const logged: unknown[] = [];
    setValidationLogger((entry) => logged.push(entry));
    const { req, res, next } = makeReqRes({ email: "bad" });
    validateRequest({ body: z.object({ email: z.string().email() }) })(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(logged).toHaveLength(1);
    expect((logged[0] as { type: string }).type).toBe("validation-rejected");
    setValidationLogger(defaultValidationLogger);
  });
});
