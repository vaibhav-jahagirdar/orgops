import {z} from "zod"


export const projectSchema = z.object({
    name: z.string().min(3, "Project name atleast be 3 characters")
    .max(50, "Project name must be less than 50 characters")
    .transform((v) => v.trim())
})

export type projectInput =  z.infer<typeof projectSchema>