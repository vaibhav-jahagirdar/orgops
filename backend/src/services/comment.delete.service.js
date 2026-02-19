const pool = require("../db");

async function deleteComment(commentId, taskId, orgId, userId, role) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const commentResult = await client.query(
      `SELECT created_by
            FROM task_comments WHERE id = $1
            AND task_id = $2 
            AND org_id = $3
            FOR UPDATE `,
      [commentId, taskId, orgId],
    );
    if (commentResult.rowCount === 0) {
      throw { code: "INVALID_COMMENT" };
    }

    const commentRow = commentResult.rows[0];

    if (
      commentRow.created_by !== userId &&
      role !== "owner" &&
      role !== "admin"
    ) {
      throw { code: "FORBIDDEN" };
    }

    const deleteCommentResult = await client.query(
      `DELETE FROM task_comments 
         WHERE id = $1
            AND task_id = $2 
            AND org_id = $3
              RETURNING id `,
      [commentId, taskId, orgId],
    );
   if(deleteCommentResult.rowCount === 0) {
    throw {code: "DELETE_FAILED"}
   }
   await client.query("COMMIT")
   return deleteCommentResult.rows[0]

  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}
