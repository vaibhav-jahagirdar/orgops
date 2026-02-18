const { listTasks } = require("../services/tasks.list.service");
const { listTasksSchema } = require("../schemas/tasks.list.schema");

async function listTasksController(req, res, next) {
  try {
    const parsed = listTasksSchema.parse({
      params: req.params,
      query: req.query,
    });

    const orgId = parseInt(parsed.params.orgId, 10);
    const projectId = parseInt(parsed.params.projectId, 10);

    const page = parsed.query.page ? parseInt(parsed.query.page, 10) : 1;
    const limit = parsed.query.limit ? parseInt(parsed.query.limit, 10) : 10;

    const result = await listTasks({
      orgId,
      projectId,
      userId: req.user.id,
      role: req.membership.role,
      sort: parsed.query.sort,
      order: parsed.query.order,
      page,
      limit,
      search: parsed.query.search,
    });

    return res.status(200).json(result);

  } catch (err) {
    next(err);
  }
}

module.exports = { listTasksController };