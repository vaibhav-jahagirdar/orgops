const pool = require("../db")


async function updateTasks(updates, orgId, taskId) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const allowedFields = {
            title: "title",
            description: "description",
            priority: "priority",
            due_date: "due_date"
        }

        const fields = [];
        const values = [];
        let index = 1;

        for(const key in allowedFields) {
            if(updates[key] !== undefined) {
                fields.push(`${allowedFields[key]} = $${index}`)
                values.push(updates[key])
                index++;
            }
        }
            
        if(fields.length === 0) {
            throw {code: "NO_FIELDS_TO_UPDATE"}
        }

        values.push(taskId);
        values.push(orgId);


        const result = await client.query(
            `UPDATE tasks
             SET ${fields.join(",")}
             WHERE id = $${index} AND org_id = $${index + 1}
             RETURNING id, title , description , priority, due_date`,
             values
        )

        if(result.rowCount === 0) {
            throw {code: "TASK_NOT_FOUND"}
        }
        await client.query("COMMIT");
        return result.rows[0]
    } catch (error) {
        await client.query("ROLLBACK");
        throw error
        
    } finally {
        client.release()
    }
}