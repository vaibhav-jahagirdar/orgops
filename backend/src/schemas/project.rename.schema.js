

const { z } = require("zod");

const renameProjectSchema = z.object({
  params: z.object({
    orgId: z.string().regex(/^\d+$/),
    projectId: z.string().regex(/^\d+$/),
  }),
  body: z.object({
    name: z
      .string()
      .trim()
      .min(3, "Name too short")
      .max(100, "Name too long"),
  }),
});

module.exports = { renameProjectSchema };