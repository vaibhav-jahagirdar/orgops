const { z } = require("zod");

const updateCommentSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment too long"),
});

module.exports = { updateCommentSchema };