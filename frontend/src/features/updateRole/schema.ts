import { z } from "zod"

export const RoleSchema = z.enum(["member", "admin"])


export const UpdateUserRoleSchema = z.object({
    orgId:    z.number().int().positive(),
    targetId: z.number().int().positive(),
    role:     RoleSchema,
})

export const UpdateUserRoleResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        membershipId: z.number().int().positive(),
        role:         RoleSchema,
        action:       z.enum(["PROMOTED", "DEMOTED"]),
    }),
})

export type UpdateUserRoleInput    = z.infer<typeof UpdateUserRoleSchema>
export type UpdateUserRoleResponse = z.infer<typeof UpdateUserRoleResponseSchema>