const { z } = require("zod");

const createCommentSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment too long")
});

module.exports = { createCommentSchema };