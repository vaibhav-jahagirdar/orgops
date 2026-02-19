const { z } = require("zod");

const listCommentsParamsSchema = z.object({
  orgId: z.coerce.number().int().positive(),
  projectId: z.coerce.number().int().positive(),
  taskId: z.coerce.number().int().positive(),
});

const listCommentsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

module.exports = {
  listCommentsParamsSchema,
  listCommentsQuerySchema
};