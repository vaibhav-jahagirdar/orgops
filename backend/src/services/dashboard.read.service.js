const pool = require("../db");

async function getDashboardData({ orgId, userId }) {
  try {
    const [
      activeProjectsRes,
      tasksDueTodayRes,
      overdueTasksRes,
      totalTasksRes,
      completedTasksRes,
      membersRes,
      myOverdueRes,
      myTodayRes,
      myUpcomingRes,
      deadlinesRes,
      projectsRes,
      unassignedRes,
      overloadedRes,
      riskyRes,
      activityTasksRes,
      activityProjectsRes
    ] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM projects WHERE org_id = $1`, [orgId]),

      pool.query(
        `SELECT id FROM tasks
         WHERE org_id = $1
         AND due_date = CURRENT_DATE
         AND status IN ('todo','in_progress')`,
        [orgId]
      ),

      pool.query(
        `SELECT id FROM tasks
         WHERE org_id = $1
         AND due_date < CURRENT_DATE
         AND status IN ('todo','in_progress')`,
        [orgId]
      ),

      pool.query(`SELECT COUNT(*) FROM tasks WHERE org_id = $1`, [orgId]),

      pool.query(
        `SELECT COUNT(*) FROM tasks WHERE org_id = $1 AND status = 'done'`,
        [orgId]
      ),

      pool.query(
        `SELECT COUNT(*) FROM membership WHERE org_id = $1`,
        [orgId]
      ),

      pool.query(
        `SELECT t.id, t.title, t.due_date, t.priority, t.status, p.name as project
         FROM tasks t
         JOIN projects p ON t.project_id = p.id
         WHERE t.org_id = $1 AND t.assigned_to = $2
         AND t.due_date < CURRENT_DATE
         AND t.status IN ('todo','in_progress')`,
        [orgId, userId]
      ),

      pool.query(
        `SELECT t.id, t.title, t.due_date, t.priority, t.status, p.name as project
         FROM tasks t
         JOIN projects p ON t.project_id = p.id
         WHERE t.org_id = $1 AND t.assigned_to = $2
         AND t.due_date = CURRENT_DATE
         AND t.status IN ('todo','in_progress')`,
        [orgId, userId]
      ),

      pool.query(
        `SELECT t.id, t.title, t.due_date, t.priority, t.status, p.name as project
         FROM tasks t
         JOIN projects p ON t.project_id = p.id
         WHERE t.org_id = $1 AND t.assigned_to = $2
         AND t.due_date > CURRENT_DATE
         AND t.status IN ('todo','in_progress')
         ORDER BY t.due_date ASC
         LIMIT 5`,
        [orgId, userId]
      ),

      pool.query(
        `SELECT t.id, t.title, t.due_date, t.priority, p.name as project
         FROM tasks t
         JOIN projects p ON t.project_id = p.id
         WHERE t.org_id = $1
         AND t.due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
         AND t.status IN ('todo','in_progress')
         ORDER BY t.due_date ASC
         LIMIT 5`,
        [orgId]
      ),

      pool.query(
        `SELECT 
          p.id,
          p.name,
          COUNT(t.id) AS total_tasks,
          COUNT(*) FILTER (WHERE t.status = 'done') AS completed_tasks,
          COUNT(*) FILTER (
            WHERE t.due_date < CURRENT_DATE AND t.status != 'done'
          ) AS overdue_tasks
         FROM projects p
         LEFT JOIN tasks t ON t.project_id = p.id
         WHERE p.org_id = $1
         GROUP BY p.id`,
        [orgId]
      ),

      pool.query(
        `SELECT COUNT(*) FROM tasks
         WHERE org_id = $1 AND assigned_to IS NULL`,
        [orgId]
      ),

      pool.query(
        `SELECT u.id, u.name, COUNT(t.id) as task_count
         FROM tasks t
         JOIN users u ON u.id = t.assigned_to
         WHERE t.org_id = $1
         GROUP BY u.id
         HAVING COUNT(t.id) > 10`,
        [orgId]
      ),

      // ✅ FIXED risky query
      pool.query(
        `SELECT COUNT(*) FROM projects p
         WHERE p.org_id = $1
         AND (
           SELECT COUNT(*) FROM tasks t
           WHERE t.project_id = p.id
           AND t.due_date < CURRENT_DATE
           AND t.status != 'done'
         ) > 3`,
        [orgId]
      ),

      // ✅ FIXED updated_at → created_at
      pool.query(
        `SELECT id, title, created_at
         FROM tasks
         WHERE org_id = $1
         ORDER BY created_at DESC
         LIMIT 5`,
        [orgId]
      ),

      pool.query(
        `SELECT id, name, created_at
         FROM projects
         WHERE org_id = $1
         ORDER BY created_at DESC
         LIMIT 5`,
        [orgId]
      )
    ]);

    const total = Number(totalTasksRes.rows[0]?.count || 0);
    const done = Number(completedTasksRes.rows[0]?.count || 0);

    const completionRate =
      total > 0 ? Math.round((done / total) * 100) : 0;

    const projects = projectsRes.rows.map(p => ({
      id: p.id,
      name: p.name,
      totalTasks: Number(p.total_tasks) || 0,
      overdueTasks: Number(p.overdue_tasks) || 0,
      progress:
        Number(p.total_tasks) > 0
          ? Math.round(
              (Number(p.completed_tasks) / Number(p.total_tasks)) * 100
            )
          : 0
    }));

    const activity = [
      ...activityTasksRes.rows.map(t => ({
        id: t.id,
        message: `Task updated: ${t.title}`,
        createdAt: t.created_at
      })),
      ...activityProjectsRes.rows.map(p => ({
        id: p.id,
        message: `Project updated: ${p.name}`,
        createdAt: p.created_at
      }))
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    return {
      kpis: {
        activeProjects: Number(activeProjectsRes.rows[0]?.count || 0),
        dueToday: tasksDueTodayRes.rowCount,
        overdue: overdueTasksRes.rowCount,
        completionRate,
        members: Number(membersRes.rows[0]?.count || 0)
      },

      myTasks: {
        overdue: myOverdueRes.rows,
        today: myTodayRes.rows,
        upcoming: myUpcomingRes.rows
      },

      deadlines: deadlinesRes.rows,

      projects,

      activity,

      insights: {
        overloadedUsers: overloadedRes.rows,
        unassignedTasks: Number(unassignedRes.rows[0]?.count || 0),
        riskyProjects: Number(riskyRes.rows[0]?.count || 0)
      }
    };
  } catch (err) {
    console.error("DASHBOARD SERVICE ERROR:", err);
    throw err;
  }
}

module.exports = { getDashboardData };