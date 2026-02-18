const { z } = require("zod");

const listTasksSchema = z.object({
  params: z.object({
    orgId: z.string().regex(/^\d+$/),
    projectId: z.string().regex(/^\d+$/),
  }),

  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sort: z
      .enum([
        "created_at",
        "updated_at",
        "due_date",
        "priority",
        "status",
        "title",
      ])
      .optional(),

    order: z.enum(["ASC", "DESC"]).optional(),
    search: z.string().max(100).optional(),
  }),
});

module.exports = { listTasksSchema };