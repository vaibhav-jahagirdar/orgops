import { z } from "zod"

export const memberRoleSchema = z.enum(["owner", "admin", "member"])
export type MemberRole = z.infer<typeof memberRoleSchema>

export const memberSortSchema = z.enum([
  "role",
  "name_asc",
  "name_desc",
  "joined_desc",
  "joined_asc"
])
export type MemberSort = z.infer<typeof memberSortSchema>

export const listMembersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional().default(""),
  role: memberRoleSchema.optional(), 
  sort: memberSortSchema.default("role")
})
export type ListMembersQuery = z.infer<typeof listMembersQuerySchema>

export const memberSchema = z.object({
  membership_id: z.number().int(),
  user_id: z.number().int(),
  org_id: z.number().int(),
  role: memberRoleSchema,
  joined_at: z.string(), 
  name: z.string().nullable(),
  email: z.string().email()
})

export type Member = z.infer<typeof memberSchema>

export const membersMetaSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(1),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
  search: z.string(),
  role: z.union([memberRoleSchema, z.literal("all")]),
  sort: memberSortSchema
})

export type MembersMeta = z.infer<typeof membersMetaSchema>

export const membersCountsSchema = z.object({
  total: z.number().int().min(0),
  owners: z.number().int().min(0),
  admins: z.number().int().min(0),
  members: z.number().int().min(0)
})

export type MembersCounts = z.infer<typeof membersCountsSchema>

export const listMembersResponseSchema = z.object({
  message: z.string().optional(), 
  data: z.array(memberSchema),
  meta: membersMetaSchema,
  counts: membersCountsSchema,
  currentUserRole: memberRoleSchema
})

export type ListMembersResponse = z.infer<typeof listMembersResponseSchema>