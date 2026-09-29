import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

export interface ValidationTargets {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

export type ValidationLogger = (entry: {
  type: "validation-rejected";
  ts: string;
  path: string;
  method: string;
  problems: Record<string, unknown>;
}) => void;

/** الجندي الصامت يسجّل كل رفض تلقائياً — بلا تدخل بشري */
export const defaultValidationLogger: ValidationLogger = (entry) => {
  // eslint-disable-next-line no-console
  console.info(`[@axion/validation] REJECTED ${JSON.stringify(entry)}`);
};

let activeLogger: ValidationLogger = defaultValidationLogger;

/** ربط سجل مخصص (Telemetry/ELK) — أتمتة المراقبة */
export function setValidationLogger(logger: ValidationLogger): void {
  activeLogger = logger;
}

/**
 * بوابة التحقق المركزية — ترفض المدخلات غير الصالحة باستجابة
 * Problem Details (RFC 9457) قبل وصولها لأي منطق مدينة.
 * هذه هي "الجندي الصامت": يفحص كل طلب بلا تدخل بشري.
 */
export function validateRequest(targets: ValidationTargets) {
  return (req: Request, res: Response, next: NextFunction) => {
    const problems: Record<string, unknown> = {};

    if (targets.body) {
      const r = targets.body.safeParse(req.body);
      if (!r.success) problems.body = r.error.issues;
      else req.body = r.data;
    }
    if (targets.query) {
      const r = targets.query.safeParse(req.query);
      if (!r.success) problems.query = r.error.issues;
      else req.query = r.data as Request["query"];
    }
    if (targets.params) {
      const r = targets.params.safeParse(req.params);
      if (!r.success) problems.params = r.error.issues;
    }

    if (Object.keys(problems).length > 0) {
      activeLogger({
        type: "validation-rejected",
        ts: new Date().toISOString(),
        path: req.path,
        method: req.method,
        problems,
      });
      return res.status(400).json({
        type: "https://axion.kingdom/problems/validation-error",
        title: "Validation Error",
        status: 400,
        detail: "أحد الحقول المدخلة غير صالح",
        problems,
      });
    }
    return next();
  };
}
