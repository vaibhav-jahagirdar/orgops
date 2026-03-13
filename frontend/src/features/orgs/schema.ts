import {z} from "zod"

export const orgSchema = z.object({
    name: z.string().min(3, "Org Name must be at least 3 characters")
    .max(50, "Organization must be less than 50 characters")
    .transform((v) => v.trim()),
})

export type orgInput = z.infer<typeof orgSchema>