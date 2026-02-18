const { renameProject } = require("../services/projects.rename.service");
const { renameProjectSchema } = require("../schemas/project.rename.schema");

async function renameProjectController(req, res, next) {
  try {
    const parsed = renameProjectSchema.parse({
      params: req.params,
      body: req.body,
    });

    const orgId = Number(parsed.params.orgId);
    const projectId = Number(parsed.params.projectId);
    const newName = parsed.body.name;

    const userId = req.user.id; // from requireAuth middleware

    const updatedProject = await renameProject(
      projectId,
      orgId,
      newName,
      userId
    );

    return res.status(200).json({
      project: updatedProject,
    });

  } catch (err) {
    next(err); // centralized error middleware
  }
}

module.exports = { renameProjectController };