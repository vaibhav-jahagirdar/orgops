const pool = require("../db");

async function listTasks({
  orgId,
  projectId,
  userId,
  role,
  assignedTo,
  status,
  overdue,
  sort = "created_at",
  order = "DESC",
  page = 1,
  limit = 10,
  search = "",
}) {
  page = Math.max(parseInt(page, 10) || 1, 1);
  limit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const offset = (page - 1) * limit;

  const allowedSortFields = [
    "created_at",
    "updated_at",
    "due_date",
    "priority",
    "status",
    "title",
  ];

  const allowedOrder = ["ASC", "DESC"];

  const safeSort = allowedSortFields.includes(sort)
    ? sort
    : "created_at";

  const safeOrder = allowedOrder.includes(order?.toUpperCase())
    ? order.toUpperCase()
    : "DESC";


  let where = `WHERE t.org_id = $1`;
  const values = [orgId];

  if (projectId) {
    values.push(projectId);
    where += ` AND t.project_id = $${values.length}`;
  }


  if (role === "member") {
    values.push(userId);
    where += ` AND t.assigned_to = $${values.length}`;
  }


  if (assignedTo === "me") {
    values.push(userId);
    where += ` AND t.assigned_to = $${values.length}`;
  }

 
  if (status) {
    values.push(status);
    where += ` AND t.status = $${values.length}`;
  }


  if (overdue) {
    where += ` AND t.due_date < NOW() AND t.status != 'done'`;
  }


  if (search) {
    values.push(`%${search}%`);
    where += ` AND (t.title ILIKE $${values.length} OR t.description ILIKE $${values.length})`;
  }


  const countQuery = `SELECT COUNT(*) FROM tasks t ${where}`;
  const countResult = await pool.query(countQuery, values);
  const total = parseInt(countResult.rows[0].count, 10);


  values.push(limit);
  values.push(offset);

 
  const dataQuery = `
    SELECT 
      t.id,
      t.title,
      t.status,
      t.priority,
      t.description,
      t.due_date,
      t.updated_at,
      t.assigned_to,
      u.name AS assigned_user_name,
      p.name AS project_name
    FROM tasks t
    LEFT JOIN users u ON u.id = t.assigned_to
    LEFT JOIN projects p ON p.id = t.project_id
    ${where}
    ORDER BY t.${safeSort} ${safeOrder}
    LIMIT $${values.length - 1}
    OFFSET $${values.length}
  `;

  const result = await pool.query(dataQuery, values);

  return {
    tasks: result.rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

module.exports = { listTasks };