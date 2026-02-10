const pool = require("../db")

async function createOrg(actorUserId, name) {
  const client = await pool.connect()
  try {
    await client.query("BEGIN");

    const orgResult = await client.query(
      `INSERT INTO orgs (name)
      VALUES ($1)
      RETURNING id`,
      [name]
    )

    const orgId = orgResult.rows[0].id;

    await client.query(`
      INSERT INTO membership (user_id, org_id, role)
      VALUES ($1,$2, 'owner')`,
    [actorUserId, orgId])

    await client.query("COMMIT");

    return {
      orgId,
      name, 
    }
  } catch (error) {
    await client.query("ROLLBACK"); 
    throw error; 
  } finally {
    client.release
  }
}

module.exports = {
  createOrg,
}