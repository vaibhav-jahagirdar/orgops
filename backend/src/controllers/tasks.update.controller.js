async function updateTaskController(req, res, next) {
  try {
    const { orgId, projectId, taskId } = req.params;
    const userId = req.user.id;
    const role = req.membership.role;

    const parsed = updateTaskSchema.parse(req.body);

    const updates = { ...parsed };

    if (parsed.due_days !== undefined) {
      updates.due_date = new Date(Date.now() + parsed.due_days * 86400000);
      delete updates.due_days;
    }

    const result = await updateTaskMetadata({
      orgId: Number(orgId),
      projectId: Number(projectId),
      taskId: Number(taskId),
      userId,
      role,
      updates
    });

    return res.status(200).json(result);

  } catch (err) {
    next(err);
  }
}