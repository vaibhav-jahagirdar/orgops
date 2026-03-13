import {z} from "zod"


export const regsiterSchema = z.object({
    name : z.string().min(3, "Name must be atleast 3 characters"),
    email: z.string().email("Enter a email"),
    password : z.string().min(8, "Password must be atleast 8 characters")

})

export type RegisterInput = z.infer<typeof regsiterSchema >