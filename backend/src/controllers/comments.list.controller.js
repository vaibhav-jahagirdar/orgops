const { listCommentsParamsSchema, listCommentsQuerySchema } = require("../schemas/comments.list.schema")
const { listComments } = require("../services/comments.list.service")

async function listCommentsController(req, res) {
    try {
        const parsedParams = listCommentsParamsSchema.parse(req.params)
        const parsedQuery  = listCommentsQuerySchema.parse(req.query)

        const result = await listComments(
            parsedParams.orgId,
            parsedParams.taskId,
            parsedQuery.page,
            parsedQuery.limit
        )

        return res.status(200).json(result)

    } catch (err) {
        if (err.name === "ZodError") {
            return res.status(400).json({ error: err.errors })
        }
        if (err.code) {
            return res.status(400).json({ error: err.code })
        }
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" })
    }
}

module.exports = { listCommentsController }