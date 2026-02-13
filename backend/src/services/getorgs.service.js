async function getOrg(orgId, userId) {
  const result = await pool.query(
    `
    SELECT o.id, o.name, o.created_at, m.role
    FROM orgs o
    JOIN membership m ON o.id = m.org_id
    WHERE o.id = $1
      AND m.user_id = $2
    `,
    [orgId, userId]
  );

  if (result.rowCount === 0) {
    throw { code: "ORG_NOT_FOUND_OR_FORBIDDEN" };
  }

  return result.rows[0];
}

module.exports = {
    getOrg
}