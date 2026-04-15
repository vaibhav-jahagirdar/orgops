import { z } from "zod"

export const projectDetailParamsSchema = z.object({
  orgId: z.coerce.number().int().positive(),
  projectId: z.coerce.number().int().positive(),
})

export const projectSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  createdAt: z.string(),
  archivedAt: z.string().nullable(),
  isArchived: z.boolean(),
})

export const creatorSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  email: z.string().email(),
})

export const projectHealthStatusSchema = z.enum([
  "not_started",
  "on_track",
  "nearly_done",
  "at_risk",
  "completed",
])

export const healthSchema = z.object({
  status: projectHealthStatusSchema,
  progressPercent: z.number().int().min(0).max(100).optional(),
})

export const projectStatsSchema = z.object({
  total: z.number().int().min(0),
  todo: z.number().int().min(0),
  inProgress: z.number().int().min(0),
  done: z.number().int().min(0),
  overdue: z.number().int().min(0),
  memberCount: z.number().int().min(0),
})

export const memberPreviewSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().nullable(),
  email: z.string().email().nullable(),
})

export const taskAssigneeSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().nullable(),
  email: z.string().email().nullable(),
})

export const projectTaskSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  status: z.string().optional(),
  priority: z.string().nullable().optional(),
  dueDate: z.string().nullable(),
  createdAt: z.string(),
  assignee: taskAssigneeSchema.nullable(),
})

export const projectDetailResponseSchema = z.object({
  project: projectSchema,
  creator: creatorSchema,
  health: healthSchema,
  stats: projectStatsSchema,
  membersPreview: z.array(memberPreviewSchema),
  tasks: z.array(projectTaskSchema),
})

export type ProjectDetailParams = z.infer<typeof projectDetailParamsSchema>
export type ProjectDetailResponse = z.infer<typeof projectDetailResponseSchema>