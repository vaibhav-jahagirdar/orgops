const { z } = require("zod");

const assignTaskSchema = z.object({
  assignedTo: z
    .number({ invalid_type_error: "assignedTo must be a number" })
    .int()
    .positive()
    .nullable()
});

module.exports = { assignTaskSchema };