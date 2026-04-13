import { z } from "zod"


export const listProjectsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),

  search: z
    .string()
    .trim()
    .max(100)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),

  sort: z.enum(["created_at", "name"]).default("created_at"),

 
  order: z.enum(["asc", "desc"]).default("desc"),
})

export type ListProjectsQuery = z.infer<typeof listProjectsQuerySchema>


export const projectSchema = z.object({
  id: z.number(),
  name: z.string(),
  created_at: z.string(), 
  created_by: z.number(),

  
  task_count: z.number().optional(),
  todo_count: z.number().optional(),
  in_progress_count: z.number().optional(),
  done_count: z.number().optional(),
  overdue_count: z.number().optional(),
})

export const projectsMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
  search: z.string().optional(),
  sort: z.enum(["created_at", "name"]),
  order: z.string(), 
})

export const projectsCountsSchema = z.object({
  total: z.number(),
  active: z.number(),
  archived: z.number(),
})

export const listProjectsResponseSchema = z.object({
  data: z.array(projectSchema),
  meta: projectsMetaSchema,
  counts: projectsCountsSchema.optional(),
})

export type Project = z.infer<typeof projectSchema>
export type ListProjectsResponse = z.infer<typeof listProjectsResponseSchema>