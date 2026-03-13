const pool = require("../db");

async function listProjects({ orgId, page = 1, limit = 10, search, sort, order }) {

  page = Math.max(parseInt(page) || 1, 1);
  limit = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
  const offset = (page - 1) * limit;

  const allowedSort = ["created_at", "name"];
  const allowedOrder = ["ASC", "DESC"];

  const safeSort = allowedSort.includes(sort) ? sort : "created_at";
  const safeOrder = allowedOrder.includes(order?.toUpperCase())
    ? order.toUpperCase()
    : "DESC";

  const values = [orgId];
  let where = `WHERE org_id = $1
  AND archived_at IS NULL`;

  if (search) {
    values.push(`%${search}%`);
    where += ` AND name ILIKE $${values.length}`;
  }



  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM projects
    ${where}
  `;

  const countResult = await pool.query(countQuery, values);
  const total = countResult.rows[0].total;



  const dataValues = [...values, limit, offset];

  const dataQuery = `
    SELECT id, name, created_at, created_by
    FROM projects
    ${where}
    ORDER BY ${safeSort} ${safeOrder}, id DESC
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `;

  const dataResult = await pool.query(dataQuery, dataValues);

  const totalPages = Math.ceil(total / limit);

  return {
    data: dataResult.rows,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
}

module.exports = { listProjects };