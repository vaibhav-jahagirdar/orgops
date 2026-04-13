const pool = require("../db")

const ALLOWED_ROLES = new Set(["owner", "admin", "member"])
const ALLOWED_SORTS = new Set(["role", "name_asc", "name_desc", "joined_desc", "joined_asc"])

function normalizeListOptions(raw = {}) {
  const page = Math.max(parseInt(raw.page, 10) || 1, 1)
  const limit = Math.min(Math.max(parseInt(raw.limit, 10) || 20, 1), 100)

  const search = typeof raw.search === "string" ? raw.search.trim() : ""
  const role = typeof raw.role === "string" && ALLOWED_ROLES.has(raw.role) ? raw.role : "all"
  const sort = typeof raw.sort === "string" && ALLOWED_SORTS.has(raw.sort) ? raw.sort : "role"

  return { page, limit, search, role, sort }
}

function buildOrderBy(sort) {
  switch (sort) {
    case "name_asc":
      return `ORDER BY COALESCE(u.name, '') ASC, u.email ASC`
    case "name_desc":
      return `ORDER BY COALESCE(u.name, '') DESC, u.email DESC`
    case "joined_asc":
      return `ORDER BY m.joined_date ASC, m.membership_id ASC`
    case "joined_desc":
      return `ORDER BY m.joined_date DESC, m.membership_id DESC`
    case "role":
    default:
      return `
        ORDER BY
          CASE m.role
            WHEN 'owner' THEN 1
            WHEN 'admin' THEN 2
            ELSE 3
          END,
          COALESCE(u.name, '') ASC,
          u.email ASC
      `
  }
}

function buildWhereClause({ orgId, role, search }, params) {
  params.push(orgId)
  let where = `WHERE m.org_id = $${params.length}`

  if (role !== "all") {
    params.push(role)
    where += ` AND m.role = $${params.length}`
  }

  if (search) {
    params.push(`%${search}%`)
    const idx = params.length
    where += ` AND (u.name ILIKE $${idx} OR u.email ILIKE $${idx})`
  }

  return where
}

async function listMembersForOrg(orgId, rawOptions = {}) {
  const parsedOrgId = Number(orgId)
  if (!Number.isInteger(parsedOrgId) || parsedOrgId <= 0) {
    const err = new Error("Invalid orgId")
    err.statusCode = 400
    throw err
  }

  const options = normalizeListOptions(rawOptions)
  const { page, limit, role, search, sort } = options
  const offset = (page - 1) * limit

  const baseParams = []
  const whereClause = buildWhereClause({ orgId: parsedOrgId, role, search }, baseParams)
  const orderBy = buildOrderBy(sort)

  const dataParams = [...baseParams, limit, offset]
  const dataQuery = `
    SELECT
      m.membership_id,
      m.user_id,
      m.org_id,
      m.role,
      m.joined_date AS joined_at,
      u.name,
      u.email
    FROM membership m
    JOIN users u ON u.id = m.user_id
    ${whereClause}
    ${orderBy}
    LIMIT $${dataParams.length - 1}
    OFFSET $${dataParams.length}
  `

  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM membership m
    JOIN users u ON u.id = m.user_id
    ${whereClause}
  `

  const roleCountsQuery = `
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE role = 'owner')::int AS owners,
      COUNT(*) FILTER (WHERE role = 'admin')::int AS admins,
      COUNT(*) FILTER (WHERE role = 'member')::int AS members
    FROM membership
    WHERE org_id = $1
  `

  const startedAt = Date.now()
  try {
    const [dataResult, countResult, roleCountsResult] = await Promise.all([
      pool.query({ text: dataQuery, values: dataParams }),
      pool.query({ text: countQuery, values: baseParams }),
      pool.query({ text: roleCountsQuery, values: [parsedOrgId] }),
    ])

    const total = countResult.rows[0]?.total || 0
    const totalPages = Math.max(Math.ceil(total / limit), 1)

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
        role,
        sort,
      },
      counts: roleCountsResult.rows[0] || {
        total: 0,
        owners: 0,
        admins: 0,
        members: 0,
      },
    }
  } finally {
    console.log("listMembersForOrg duration(ms):", Date.now() - startedAt)
  }
}

module.exports = {
  listMembersForOrg,
}