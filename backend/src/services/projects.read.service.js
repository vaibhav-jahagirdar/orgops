const pool = require("../db");

async function listProjects({
  orgId,
  page,
  limit,
  search,
  sort,
  order,
}) {
  const offset = (page - 1) * limit;

  const values = [orgId];
  let query = `
    SELECT id, name, created_at, created_by
    FROM projects
    WHERE org_id = $1
  `;
  

  if (search) {
    values.push(`%${search}%`);
    query += ` AND name ILIKE $${values.length}`;
  }

  query += ` ORDER BY ${sort} ${order}`;

  values.push(limit);
  values.push(offset);

  query += `
    LIMIT $${values.length - 1}
    OFFSET $${values.length}
  `;

  const result = await pool.query(query, values);

  return result.rows;
}

module.exports = { listProjects };
