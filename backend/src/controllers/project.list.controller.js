const { listProjects } = require("../services/projects.read.service");
const { listProjectsSchema } = require("../schemas/project.schema.list");

const { listProjectsQuerySchema } = require("../schemas/project.schema.list")

async function getProjects(req, res, next) {
  const currentUserRole = req.membership.role;
  try {
    const orgId = Number(req.params.orgId)

    if (!Number.isInteger(orgId) || orgId <= 0) {
      return res.status(400).json({ error: "Invalid orgId" })
    }

    const parsedQuery = listProjectsQuerySchema.safeParse(req.query)

    if (!parsedQuery.success) {
      return res.status(400).json({
        error: "Invalid query params",
        details: parsedQuery.error.flatten(),
      })
    }

    const result = await listProjects({
      orgId,
      ...parsedQuery.data,
      currentUserRole
    })

    return res.status(200).json(result)
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  getProjects,
}