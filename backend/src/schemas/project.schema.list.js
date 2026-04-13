const { z } = require("zod")

const ALLOWED_SORTS = ["created_at", "name"]
const ALLOWED_ORDERS = ["asc", "desc"]

const listProjectsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),

    search: z
      .string()
      .trim()
      .max(100)
      .optional()
      .transform((v) => (v && v.length ? v : undefined)),

    sort: z
      .enum(ALLOWED_SORTS)
      .optional()
      .default("created_at"),

  
    order: z
      .string()
      .trim()
      .toLowerCase()
      .refine((v) => ALLOWED_ORDERS.includes(v), {
        message: "order must be 'asc' or 'desc'",
      })
      .optional()
      .default("desc")
      .transform((v) => v.toUpperCase()),
  })
  .strict()

module.exports = {
  listProjectsQuerySchema,
  ALLOWED_SORTS,
  ALLOWED_ORDERS,
}