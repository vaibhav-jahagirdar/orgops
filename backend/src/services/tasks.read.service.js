const pool = require("../db");

async function listTasks({
  orgId,
  projectId,
  userId,
  role,
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


  let where = `WHERE org_id = $1 AND project_id = $2`;
  const values = [orgId, projectId];


  if (role === "member") {
    values.push(userId);
    where += ` AND assigned_to = $${values.length}`;
  }

  if (search) {
    values.push(`%${search}%`);
    where += ` AND title ILIKE $${values.length}`;
  }

  const countQuery = `SELECT COUNT(*) FROM tasks ${where}`;
  const countResult = await pool.query(countQuery, values);
  const total = parseInt(countResult.rows[0].count, 10);

 
  values.push(limit);
  values.push(offset);

  const dataQuery = `
    SELECT id, title, status, priority, description,
           due_date, updated_at, assigned_to
    FROM tasks
    ${where}
    ORDER BY ${safeSort} ${safeOrder}
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