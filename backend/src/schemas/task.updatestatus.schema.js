const { z } = require("zod");

const updateTaskStatusSchema = z.object({
  status: z.enum(["todo", "in_progress", "blocked", "done"])
});

module.exports = {
  updateTaskStatusSchema
};