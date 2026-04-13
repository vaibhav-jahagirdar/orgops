const { z } = require("zod");


const roleSchema = z.enum(["member", "admin"]);

const addMemberBodySchema = z
  .object({
    userId: z.coerce.number().int().positive().optional(),
    email: z.string().trim().toLowerCase().email().optional(),
    role: roleSchema.default("member"),
  })
  .refine((data) => data.userId || data.email, {
    message: "UserId or email is required",
    path: ["userId"],
  });

const addMemberContextSchema = z.object({
  actorUserId: z.coerce.number().int().positive(),
  orgId: z.coerce.number().int().positive(),
});

module.exports = {
  addMemberBodySchema,
  addMemberContextSchema,
};