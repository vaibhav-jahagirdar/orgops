const pool = require("../db");

async function getTaskById({ taskId, orgId }) {
  if (!taskId || !orgId) {
    const err = new Error("taskId and orgId are required");
    err.status = 400;
    throw err;
  }

  const query = `
    SELECT 
      t.id,
      t.title,
      t.description,
      t.status,
      t.priority,
      t.due_date,
      t.created_at,
      t.updated_at,

      p.id AS project_id,
      p.name AS project_name,

      u1.id AS assigned_to_id,
      u1.name AS assigned_to_name,

      u2.id AS created_by_id,
      u2.name AS created_by_name

    FROM tasks t
    LEFT JOIN projects p 
      ON p.id = t.project_id AND p.org_id = t.org_id
    LEFT JOIN users u1 ON u1.id = t.assigned_to
    LEFT JOIN users u2 ON u2.id = t.created_by

    WHERE t.id = $1 AND t.org_id = $2
    LIMIT 1
  `;

  const values = [taskId, orgId];

  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    due_date: row.due_date,

    project: row.project_id
      ? {
          id: row.project_id,
          name: row.project_name,
        }
      : null,

    assigned_to: row.assigned_to_id
      ? {
          id: row.assigned_to_id,
          name: row.assigned_to_name,
        }
      : null,

    created_by: {
      id: row.created_by_id,
      name: row.created_by_name,
    },

    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

module.exports = { getTaskById };