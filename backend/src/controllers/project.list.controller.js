const { listProjects } = require("../services/projects.read.service");
const { listProjectsSchema } = require("../schemas/project.schema.list");

async function listProjectsController(req, res, next) {
  try {
    const { orgId } = req.params;

    const queryParams = listProjectsSchema.parse(req.query);

    const result = await listProjects({
      orgId: Number(orgId),
      ...queryParams,
    });

    return res.status(200).json(result);

  } catch (error) {
    next(error);
  }
}

module.exports = { listProjectsController };