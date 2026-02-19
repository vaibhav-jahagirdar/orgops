const { z } = require("zod");

const deleteCommentSchema = z.object({
  orgId: z.coerce.number().int().positive(),
  projectId: z.coerce.number().int().positive(),
  taskId: z.coerce.number().int().positive(),
  commentId: z.coerce.number().int().positive()
});

module.exports = { deleteCommentSchema };