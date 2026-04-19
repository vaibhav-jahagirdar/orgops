import { z } from "zod"
export const TransferOwnershipSchema = z.object({
    targetId: z.number().int().positive(),
})

export const TransferOwnershipResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        userId:  z.number(),
        actorId: z.number(),
        orgId:   z.number(),
    }),
})

export type TransferOwnershipInput    = z.infer<typeof TransferOwnershipSchema>
export type TransferOwnershipResponse = z.infer<typeof TransferOwnershipResponseSchema>