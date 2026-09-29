import { describe, expect, it } from "vitest";
import { generateContracts } from "./contract.js";

describe("حي التحقق — عقود OpenAPI", () => {
  it("يولّد عقوداً لكل المخططات الأساسية", () => {
    const c = generateContracts();
    expect(c.version).toBe("0.1.0");
    for (const name of [
      "loginSchema",
      "resetPasswordSchema",
      "createNotificationSchema",
      "paginationSchema",
    ]) {
      expect(c.schemas[name], `مفقود: ${name}`).toBeDefined();
    }
  });

  it("العقد يحمل صيغة JSON Schema صالحة", () => {
    const c = generateContracts();
    const login = c.schemas.loginSchema as {
      $schema?: string;
      definitions?: Record<string, { type?: string; required?: string[] }>;
    };
    expect(login.$schema).toContain("json-schema.org");
    const loginDef = login.definitions?.loginSchema;
    expect(loginDef).toBeDefined();
    expect(loginDef?.type).toBe("object");
    expect(loginDef?.required).toContain("email");
  });
});
