const {
  createProjectSchema,
  deleteProjectParamsSchema,
} = require("../schemas/project.schema");

const {
  createProject,
  deleteProject,
} = require("../services/projects.service");

const asyncHandler = require("../utils/asyncHandler");

const createProjectController = asyncHandler(async (req, res) => {
  const parsed = createProjectSchema.parse(req.body);

  const orgId = Number(req.params.orgId);
  const userId = req.user.id;

  const project = await createProject(
    parsed.name,
    orgId,
    userId
  );

  return res.status(201).json({ project });
});

const deleteProjectController = asyncHandler(async (req, res) => {
  const parsedParams = deleteProjectParamsSchema.parse(req.params);

  const userId = req.user.id;

  const result = await deleteProject(
    userId,
    parsedParams.orgId,
    parsedParams.projectId
  );

  return res.status(200).json(result);
});

module.exports = {
  createProjectController,
  deleteProjectController,
};