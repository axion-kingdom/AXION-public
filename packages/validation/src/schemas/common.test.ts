import { describe, expect, it } from "vitest";
import {
  createIdParamSchema,
  paginationSchema,
  emailParam,
  strongPasswordParam,
  phoneParam,
  dateQueryParam,
} from "./common.js";

describe("حي التحقق — مخططات مشتركة", () => {
  it("createIdParamSchema يقبل UUID صالحاً ويرفض غيره", () => {
    const s = createIdParamSchema("id");
    expect(s.parse({ id: "93393261-79b9-4b44-9da3-92bb9034ca0d" }).id).toBeTruthy();
    expect(s.safeParse({ id: "not-a-uuid" }).success).toBe(false);
  });

  it("paginationSchema يعطي قيماً افتراضية وحدوداً قصوى", () => {
    expect(paginationSchema.parse({}).page).toBe(1);
    expect(paginationSchema.parse({ limit: "100" }).limit).toBe(100);
    expect(paginationSchema.safeParse({ limit: "101" }).success).toBe(false);
    expect(paginationSchema.safeParse({ page: "0" }).success).toBe(false);
  });

  it("emailParam يرفض البريد التالف", () => {
    expect(emailParam.safeParse("bad").success).toBe(false);
    expect(emailParam.safeParse("guard@axion.kingdom").success).toBe(true);
  });

  it("strongPasswordParam يفرض الطول والأصناف", () => {
    expect(strongPasswordParam.safeParse("short1A").success).toBe(false);
    expect(strongPasswordParam.safeParse("lowercaseonly1").success).toBe(false);
    expect(strongPasswordParam.safeParse("StrongPass1").success).toBe(true);
  });

  it("phoneParam و dateQueryParam بصيغ موحدة", () => {
    expect(phoneParam.safeParse("+966501234567").success).toBe(true);
    expect(phoneParam.safeParse("abc").success).toBe(false);
    expect(dateQueryParam.safeParse("2026-08-09").success).toBe(true);
    expect(dateQueryParam.safeParse("09/08/2026").success).toBe(false);
  });
});
