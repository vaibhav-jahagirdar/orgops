const pool = require("../db")
console.log("🔥 USING projects.read.service.js V2")

const ALLOWED_SORTS = new Set(["created_at", "name"])
const ALLOWED_ORDERS = new Set(["ASC", "DESC"])

function normalizeListOptions(raw = {}) {
  const page = Math.max(parseInt(raw.page, 10) || 1, 1)
  const limit = Math.min(Math.max(parseInt(raw.limit, 10) || 10, 1), 100)
  const search = typeof raw.search === "string" ? raw.search.trim() : ""

  const sort =
    typeof raw.sort === "string" && ALLOWED_SORTS.has(raw.sort)
      ? raw.sort
      : "created_at"

  const orderRaw = typeof raw.order === "string" ? raw.order.toUpperCase() : "DESC"
  const order = ALLOWED_ORDERS.has(orderRaw) ? orderRaw : "DESC"

  return { page, limit, search, sort, order }
}

function buildWhereClause({ orgId, search }, params) {
  params.push(orgId)
  let where = `WHERE p.org_id = $${params.length} AND p.archived_at IS NULL`

  if (search) {
    params.push(`%${search}%`)
    where += ` AND p.name ILIKE $${params.length}`
  }

  return where
}

function buildOrderBy(sort, order) {
  if (sort === "name") {
    return `ORDER BY p.name ${order}, p.id DESC`
  }
  return `ORDER BY p.created_at ${order}, p.id DESC`
}

async function listProjects(rawOptions = {}) {
  const parsedOrgId = Number(rawOptions.orgId)
  if (!Number.isInteger(parsedOrgId) || parsedOrgId <= 0) {
    const err = new Error("Invalid orgId")
    err.statusCode = 400
    throw err
  }

  const { page, limit, search, sort, order } = normalizeListOptions(rawOptions)
  const offset = (page - 1) * limit

  const baseParams = []
  const whereClause = buildWhereClause({ orgId: parsedOrgId, search }, baseParams)
  const orderBy = buildOrderBy(sort, order)

  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM projects p
    ${whereClause}
  `

  const dataParams = [...baseParams, limit, offset]
  const dataQuery = `
    SELECT
      p.id,
      p.name,
      p.created_at,
      p.created_by,
      u.name AS created_by_name,
      u.email AS created_by_email,
      COALESCE(task_stats.task_count, 0)::int AS task_count,
      COALESCE(task_stats.todo_count, 0)::int AS todo_count,
      COALESCE(task_stats.in_progress_count, 0)::int AS in_progress_count,
      COALESCE(task_stats.done_count, 0)::int AS done_count,
      COALESCE(task_stats.overdue_count, 0)::int AS overdue_count
    FROM projects p
    LEFT JOIN users u ON p.created_by = u.id
    LEFT JOIN LATERAL (
      SELECT
        COUNT(*) AS task_count,
        COUNT(*) FILTER (WHERE t.status = 'todo') AS todo_count,
        COUNT(*) FILTER (WHERE t.status = 'in_progress') AS in_progress_count,
        COUNT(*) FILTER (WHERE t.status = 'done') AS done_count,
        COUNT(*) FILTER (
          WHERE t.due_date IS NOT NULL
            AND t.status <> 'done'
            AND t.due_date < NOW()
        ) AS overdue_count
      FROM tasks t
      WHERE t.project_id = p.id
    ) AS task_stats ON TRUE
    ${whereClause}
    ${orderBy}
    LIMIT $${dataParams.length - 1}
    OFFSET $${dataParams.length}
  `

  const countsQuery = `
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE archived_at IS NULL)::int AS active,
      COUNT(*) FILTER (WHERE archived_at IS NOT NULL)::int AS archived
    FROM projects
    WHERE org_id = $1
  `

  const [countResult, dataResult, countsResult] = await Promise.all([
    pool.query({ text: countQuery, values: baseParams }),
    pool.query({ text: dataQuery, values: dataParams }),
    pool.query({ text: countsQuery, values: [parsedOrgId] }),
  ])

  const total = countResult.rows[0]?.total || 0
  const totalPages = Math.max(Math.ceil(total / limit), 1)
console.log("ROW SAMPLE:", dataResult.rows[0])
  return {
    data: dataResult.rows,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      search,
      sort,
      order,
    },
    counts: countsResult.rows[0] || {
      total: 0,
      active: 0,
      archived: 0,
    },
  }
}

module.exports = { listProjects }