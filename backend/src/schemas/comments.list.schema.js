const { z } = require("zod");

const listCommentsParamsSchema = z.object({
  orgId: z.coerce.number().int().positive(),
  taskId: z.coerce.number().int().positive(),
});

const listCommentsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

module.exports = {
  listCommentsParamsSchema,
  listCommentsQuerySchema
};