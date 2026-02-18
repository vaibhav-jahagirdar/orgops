const { listProjectsSchema } = require("../schemas/project.list.schema");
const { listProjects } = require("../services/projects.list.service");

async function listProjectsController(req, res, next) {
  try {
    const { orgId } = req.params;

    const parsed = listProjectsSchema.parse(req.query);

    const projects = await listProjects({
      orgId: parseInt(orgId, 10),
      ...parsed,
    });

    return res.status(200).json({
      page: parsed.page,
      limit: parsed.limit,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { listProjectsController };
