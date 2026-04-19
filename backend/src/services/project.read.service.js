const db = require("../db")

function toInt(v, fallback = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

function computeHealth({ total, done, overdue }) {
  
  if (total === 0) return "not_started"
  if (done === total) return "completed"

  const progress = Math.round((done / total) * 100)

  const remaining = Math.max(total - done, 0)
  const overdueRatio = remaining === 0 ? 0 : overdue / remaining

  if (overdue >= 3 || overdueRatio >= 0.4) return "at_risk"
  if (progress >= 80 && overdue <= 1) return "nearly_done"
  return "on_track"
}

async function projectInfo({ projectId, orgId }) {
  const pid = Number(projectId)
  const oid = Number(orgId)

  if (!Number.isInteger(pid) || pid <= 0) {
    const err = new Error("Invalid projectId")
    err.statusCode = 400
    throw err
  }
  if (!Number.isInteger(oid) || oid <= 0) {
    const err = new Error("Invalid orgId")
    err.statusCode = 400
    throw err
  }

  const projectQuery = db.query(
    `
    SELECT
      p.id,
      p.name,
      p.created_at,
      p.archived_at,
      u.id AS creator_id,
      u.name AS creator_name,
      u.email AS creator_email
    FROM projects p
    LEFT JOIN users u ON u.id = p.created_by
    WHERE p.id = $1 AND p.org_id = $2
    LIMIT 1
    `,
    [pid, oid]
  )

  const statsQuery = db.query(
    `
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE t.status = 'todo')::int AS todo,
      COUNT(*) FILTER (WHERE t.status = 'in_progress')::int AS in_progress,
      COUNT(*) FILTER (WHERE t.status = 'done')::int AS done,
      COUNT(*) FILTER (
        WHERE t.due_date IS NOT NULL
          AND t.status <> 'done'
          AND t.due_date < CURRENT_DATE
      )::int AS overdue,
      COUNT(DISTINCT t.assigned_to)::int AS member_count
    FROM tasks t
    WHERE t.project_id = $1
    `,
    [pid]
  )

  const membersQuery = db.query(
    `
    SELECT DISTINCT
      u.id,
      u.name,
      u.email
    FROM tasks t
    JOIN users u ON u.id = t.assigned_to
    WHERE t.project_id = $1
    ORDER BY u.name ASC
    LIMIT 8
    `,
    [pid]
  )

  const tasksQuery = db.query(
    `
    SELECT
      t.id,
      t.title,
      t.status,
      t.priority,
      t.due_date,
      t.description,
      t.created_at,
      assignee.id AS assignee_id,
      assignee.name AS assignee_name,
      assignee.email AS assignee_email
    FROM tasks t
    LEFT JOIN users assignee ON assignee.id = t.assigned_to
    WHERE t.project_id = $1
    ORDER BY t.created_at DESC, t.id DESC
    `,
    [pid]
  )

  const [projectRes, statsRes, membersRes, tasksRes] = await Promise.all([
    projectQuery,
    statsQuery,
    membersQuery,
    tasksQuery,
  ])

  const project = projectRes.rows[0]
  if (!project) {
    const err = new Error("Project not found")
    err.statusCode = 404
    throw err
  }

  const s = statsRes.rows[0] || {}
  const stats = {
    total: toInt(s.total),
    todo: toInt(s.todo),
    inProgress: toInt(s.in_progress),
    done: toInt(s.done),
    overdue: toInt(s.overdue),
    memberCount: toInt(s.member_count),
  }

  const progressPercent =
    stats.total === 0 ? 0 : Math.round((stats.done / stats.total) * 100)

  const status = computeHealth({
    total: stats.total,
    done: stats.done,
    overdue: stats.overdue,
  })
  console.log(`Project ${project.id} health status: ${status} (progress: ${progressPercent}%, overdue: ${stats.overdue}`)

  return {
    data: {
      project: {
        id: project.id,
        name: project.name,
        createdAt: project.created_at,
        archivedAt: project.archived_at,
        isArchived: Boolean(project.archived_at),
        
      },
      creator: {
        id: project.creator_id,
        name: project.creator_name,
        email: project.creator_email,
      },
      health: {
        status, 
      },
      stats,
      membersPreview: membersRes.rows.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
      })),
      tasks: tasksRes.rows.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        dueDate: t.due_date,
        createdAt: t.created_at,
        assignee: t.assignee_id
          ? {
              id: t.assignee_id,
              name: t.assignee_name,
              email: t.assignee_email,
            }
          : null,
      })),
    },
  }
}

module.exports = { projectInfo }