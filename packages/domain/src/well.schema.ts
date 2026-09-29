/**
 * STEP-006 — Well Domain Zod Schemas
 * مركزة schemas الخاصة بالآبار بدلاً من تعريفها inline داخل route handlers
 *
 * الاستخدام:
 *   import { createWellSchema, updateWellSchema, ... } from '@shared/schemas/well.schema';
 */

import { z } from 'zod';

export const createWellSchema = z.object({
  project_id: z.string().min(1),
  wellNumber: z.number().int().positive(),
  ownerName: z.string().min(1).max(200),
  region: z.string().min(1),
  numberOfBases: z.number().int().nonnegative(),
  numberOfPanels: z.number().int().nonnegative(),
  wellDepth: z.number().positive(),
  waterLevel: z.number().nullable().optional(),
  numberOfPipes: z.number().int().nonnegative(),
  fanType: z.string().nullable().optional(),
  pumpPower: z.number().nullable().optional(),
  startDate: z.string().nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
});

export const updateWellSchema = z.object({
  project_id: z.string().min(1).optional(),
  wellNumber: z.number().int().positive().optional(),
  ownerName: z.string().min(1).max(200).optional(),
  region: z.string().min(1).optional(),
  numberOfBases: z.number().int().nonnegative().optional(),
  numberOfPanels: z.number().int().nonnegative().optional(),
  wellDepth: z.number().positive().optional(),
  waterLevel: z.number().nullable().optional(),
  numberOfPipes: z.number().int().nonnegative().optional(),
  fanType: z.string().nullable().optional(),
  pumpPower: z.number().nullable().optional(),
  startDate: z.string().nullable().optional(),
  completionDate: z.string().nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
  status: z.string().optional(),
  completionPercentage: z.string().nullable().optional(),
  beneficiaryPhone: z.string().nullable().optional(),
}).passthrough();

export const createWellTaskSchema = z.object({
  taskType: z.string().min(1).max(200),
  description: z.string().optional(),
  taskOrder: z.number().int().positive().optional(),
  assignedWorkerId: z.string().optional(),
  estimatedCost: z.number().nonnegative().optional(),
});

export const updateWellTaskStatusSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
});

export const createWellCrewSchema = z.object({
  crewType: z.string().min(1),
  teamName: z.string().nullable().optional(),
  workersCount: z.number().int().nonnegative().nullable().optional(),
  mastersCount: z.number().int().nonnegative().nullable().optional(),
  workDays: z.union([z.string(), z.number()]).nullable().optional(),
  workerDailyWage: z.union([z.string(), z.number()]).nullable().optional(),
  masterDailyWage: z.union([z.string(), z.number()]).nullable().optional(),
}).passthrough();

export const createWellTransportSchema = z.object({
  railType: z.string().nullable().optional(),
  withPanels: z.boolean().nullable().optional(),
  transportPrice: z.union([z.string(), z.number()]).nullable().optional(),
  crewEntitlements: z.union([z.string(), z.number()]).nullable().optional(),
  transportDate: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
}).passthrough();

export type CreateWellInput = z.infer<typeof createWellSchema>;
export type UpdateWellInput = z.infer<typeof updateWellSchema>;
export type CreateWellTaskInput = z.infer<typeof createWellTaskSchema>;
export type UpdateWellTaskStatusInput = z.infer<typeof updateWellTaskStatusSchema>;
export type CreateWellCrewInput = z.infer<typeof createWellCrewSchema>;
export type CreateWellTransportInput = z.infer<typeof createWellTransportSchema>;
