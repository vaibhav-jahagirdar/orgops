const { z } = require("zod");

const listProjectsSchema = z.object({
  page: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val, 10) : 1))
    .refine(val => val > 0, { message: "Invalid page" }),

  limit: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val, 10) : 10))
    .refine(val => val > 0 && val <= 100, {
      message: "Limit must be between 1 and 100",
    }),

  search: z.string().optional(),

  sort: z
    .enum(["name", "created_at"])
    .optional()
    .default("created_at"),

  order: z
    .enum(["ASC", "DESC"])
    .optional()
    .default("DESC"),
});

module.exports = { listProjectsSchema };
