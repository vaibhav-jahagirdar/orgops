const pool = require("../db");

async function editComment(orgId, userId, newComment, commentId) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const commentResult = await client.query(
      `SELECT comment 
             FROM task_comments 
             WHERE id = $1 AND org_id = $2 
             AND created_by = $3
             AND created_at >= NOW() - INTERVAL '15 minutes
             AND deleted_by IS NULL
              AND deleted_at IS NULL'
             FOR UPDATE`,
      [commentId, orgId, userId],
    );

    if (commentResult.rowCount === 0) {
      throw { code: "INVALID_COMMENT" };
    }
    const commentRow = commentResult.rows[0];

    if (commentRow.comment === newComment) {
      throw { code: "INVALID_EDIT" };
    }
    const updateComment = await client.query(
      `UPDATE task_comments
             SET comment = $1
             WHERE id = $2
             AND org_id = $3
             AND created_BY = $4
              AND created_at >= NOW() - INTERVAL '15 minutes'
              AND deleted_by IS NULL
              AND deleted_at IS NULL
              RETURNING comment, id, task_id, updated_at `,
      [newComment, commentId, orgId, userId],
    );

    if(updateComment.rowCount === 0) {
        throw {code:"EDIT_WINDOW_EXPIRED"}
    }
    await client.query("COMMIT")
    return updateComment.rows[0]
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}


module.exports = {
    editComment
}