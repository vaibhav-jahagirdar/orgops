const {
  createProjectSchema,
  deleteProjectParamsSchema,
} = require("../schemas/project.schema");

const {
  createProject,
  deleteProject,
} = require("../services/projects.service");

async function createProjectController(req, res, next) {
  try {
    const parsed = createProjectSchema.parse(req.body);

    const orgId = Number(req.params.orgId);
    const userId = req.user.id;

    const project = await createProject(
      parsed.name,
      orgId,
      userId
    );

    return res.status(201).json({ project });

  } catch (error) {
    next(error);
  }
}

async function deleteProjectController(req, res, next) {
  try {
    const parsedParams = deleteProjectParamsSchema.parse(req.params);

    const userId = req.user.id;

    const result = await deleteProject(
      userId,
      parsedParams.orgId,
      parsedParams.projectId
    );

    return res.status(200).json(result);

  } catch (error) {
    next(error);
  }
}

module.exports = {
  createProjectController,
  deleteProjectController,
};