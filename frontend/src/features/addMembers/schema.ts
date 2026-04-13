import { z } from "zod";

export const addMemberFormSchema = z
  .object({
    userId: z
      .union([z.string(), z.number()])
      .optional()
      .transform((val) => {
        if (val === undefined || val === null || val === "") return undefined;
        const n = Number(val);
        return Number.isNaN(n) ? undefined : n;
      }),
    email: z.string().trim().toLowerCase().optional(), 
    role: z.enum(["member", "admin"]).default("member"),
  })
  .transform((data) => ({
    ...data,
    email: data.email === "" ? undefined : data.email,
  }))
  .refine(
    (data) => {
      if (data.email && !z.string().email().safeParse(data.email).success)
        return false;
      return !!data.userId || !!data.email;
    },
    { message: "Provide a valid email or user ID", path: ["email"] }
  );

export type AddMemberFormInput = z.input<typeof addMemberFormSchema>;   
export type AddMemberFormValues = z.infer<typeof addMemberFormSchema>;  