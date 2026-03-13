const { listOrgsForUser, getOrg } = require("../services/orgs.read.service")
const asyncHandler = require("../utils/asyncHandler")

const listMyOrgs = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const orgs = await listOrgsForUser(userId)
    res.json({ orgs })
})

const getOrgById = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const { orgId } = req.params
    const org = await getOrg(orgId, userId)
    res.json({ org })
})

module.exports = { listMyOrgs, getOrgById }