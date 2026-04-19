const { createCommentSchema } = require("../schemas/task.comment.create.schema")
const { createComment }       = require("../services/task.comment.create.service")

const statusMap = {
  TASK_DOES_NOT_EXIST: 404,
  COMMENTING_FAILED:   500,
  USER_NOT_FOUND:      404,
}

async function createCommentController(req, res) {
  try {
    console.log("---- CREATE COMMENT START ----")

    console.log("params:", req.params)
    console.log("body:", req.body)
    console.log("user:", req.user)

    const { orgId, taskId } = req.params

    if (!req.user || !req.user.id) {
      console.error("AUTH ERROR: req.user missing")
      return res.status(401).json({ error: "UNAUTHORIZED" })
    }

    const userId = req.user.id

    const parsed = createCommentSchema.parse(req.body)
    console.log("validated body:", parsed)

    const result = await createComment(
      Number(orgId),
      Number(taskId),
      userId,
      parsed.comment
    )

    console.log("service result:", result)
    console.log("---- CREATE COMMENT SUCCESS ----")

    return res.status(201).json(result)

  } catch (err) {
    console.error("---- CREATE COMMENT ERROR ----")
    console.error("error object:", err)

    if (err.name === "ZodError") {
      console.error("ZOD ERROR:", err.errors)
      return res.status(400).json({ error: err.errors })
    }

    if (err.code) {
      console.error("KNOWN ERROR CODE:", err.code)
      const status = statusMap[err.code] ?? 400
      return res.status(status).json({ error: err.code })
    }

    console.error("UNHANDLED ERROR:", err)
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" })
  }
}

module.exports = { createCommentController }