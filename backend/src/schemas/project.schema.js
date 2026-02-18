const { z } = require("zod");

const createProjectSchema = z.object({
  name: z.string().trim().min(3).max(100),
});

const deleteProjectParamsSchema = z.object({
  orgId: z.coerce.number().int().positive(),
  projectId: z.coerce.number().int().positive(),
});

module.exports = {
  createProjectSchema,
  deleteProjectParamsSchema,
};