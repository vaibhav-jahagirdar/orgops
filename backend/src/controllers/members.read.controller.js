const { listMembersForOrg } = require("../services/members.read.service");
const asyncHandler = require("../utils/asyncHandler");

const listOrgMembersController = asyncHandler(async (req, res) => {
  const { orgId } = req.params;
  const currentUserRole = req.membership.role;
  if (!orgId) {
    return res.status(400).json({
      message: "orgId is required",
    });
  }

  const result = await listMembersForOrg(orgId, {
    page: req.query.page,
    limit: req.query.limit,
    search: req.query.search,
    role: req.query.role,
    sort: req.query.sort,
  });

  return res.status(200).json({
    message: "Members fetched successfully",
    ...result,
    currentUserRole
  });
});

module.exports = {
  listOrgMembersController,
};
