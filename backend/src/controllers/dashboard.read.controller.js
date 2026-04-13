const { getDashboardData } = require("../services/dashboard.read.service")
const asyncHandler = require("../utils/asyncHandler")

const getDashboardDataController = asyncHandler(async (req, res) => {
  const userId = req.user?.id
  const orgId = Number(req.params.orgId)

  console.log("dashboard inputs:", {
    userId,
    orgId: req.params.orgId
  })

  // 🔴 HARD VALIDATION
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  if (!orgId || Number.isNaN(orgId)) {
    return res.status(400).json({ error: "Invalid orgId" })
  }

  // 🔴 CALL SERVICE WITH CLEAN DATA
  const data = await getDashboardData({
    orgId,
    userId
  })

  // 🔴 GUARANTEE SHAPE (optional but strong)
  if (!data || typeof data !== "object") {
    throw new Error("Invalid dashboard response from service")
  }

  res.status(200).json(data)
})

module.exports = { getDashboardDataController }