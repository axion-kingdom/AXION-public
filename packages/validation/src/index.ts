/**
 * @axion/validation — حي التحقق المركزي
 *
 * الوعد: «كل مدينة تُدخل بياناتها من بوابتي — تحقق موحد، ومخططات مركزية
 * تحمي المدن التي لا تملك مخططاتها.»
 *
 * المعايير: OWASP Input Validation · JSON Schema/OpenAPI 3.1 · صيغ موحدة.
 * الأتمتة: بوابة تحقق مركزية + عقود مولّدة + فحص انحراف العقود في CI.
 */
export * from "./schemas/common.js";
export * from "./schemas/auth.js";
export * from "./schemas/notification.js";
export * from "./schemas/city.js";
export * from "./schemas/claw.js";
export * from "./schemas/ayati.js";
export * from "./middleware/validate.js";
export { generateContracts, type ContractRegistry } from "./contract.js";
