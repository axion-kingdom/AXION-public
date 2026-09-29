import { zodToJsonSchema } from "zod-to-json-schema";
import {
  createIdParamSchema,
  paginationSchema,
  emailParam,
  strongPasswordParam,
  phoneParam,
  dateQueryParam,
} from "./schemas/common.js";
import {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyTokenSchema,
} from "./schemas/auth.js";
import { createNotificationSchema } from "./schemas/notification.js";

export interface ContractRegistry {
  version: string;
  generatedAt: string;
  schemas: Record<string, unknown>;
}

/** توليد عقود JSON Schema (متوافقة مع OpenAPI 3.1) من مخططات الحي */
export function generateContracts(): ContractRegistry {
  const schemas: Record<string, unknown> = {
    paginationSchema: zodToJsonSchema(paginationSchema, "paginationSchema"),
    emailParam: zodToJsonSchema(emailParam, "emailParam"),
    strongPasswordParam: zodToJsonSchema(strongPasswordParam, "strongPasswordParam"),
    phoneParam: zodToJsonSchema(phoneParam, "phoneParam"),
    dateQueryParam: zodToJsonSchema(dateQueryParam, "dateQueryParam"),
    loginSchema: zodToJsonSchema(loginSchema, "loginSchema"),
    forgotPasswordSchema: zodToJsonSchema(forgotPasswordSchema, "forgotPasswordSchema"),
    resetPasswordSchema: zodToJsonSchema(resetPasswordSchema, "resetPasswordSchema"),
    verifyTokenSchema: zodToJsonSchema(verifyTokenSchema, "verifyTokenSchema"),
    createNotificationSchema: zodToJsonSchema(createNotificationSchema, "createNotificationSchema"),
    createIdParamSchema: zodToJsonSchema(createIdParamSchema("id"), "createIdParamSchema"),
  };
  return {
    version: "0.1.0",
    generatedAt: new Date().toISOString(),
    schemas,
  };
}
