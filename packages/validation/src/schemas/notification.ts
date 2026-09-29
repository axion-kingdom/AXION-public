import { z } from "zod";
import { uuidParam } from "./common.js";

export const notificationTypeEnum = z.enum([
  "system",
  "safety",
  "task",
  "payroll",
  "announcement",
  "maintenance",
  "warranty",
]);

export const targetPlatformEnum = z.enum(["all", "android", "web"]);

export const createNotificationSchema = z.object({
  type: notificationTypeEnum,
  title: z.string().min(1).max(120),
  body: z.string().min(1).max(1000),
  priority: z.number().int().min(1).max(5).optional(),
  recipients: z.array(uuidParam).max(500).optional(),
  targetPlatform: targetPlatformEnum.optional(),
});
