const membershipService = require("../services/memberships.service");
const { addMemberBodySchema } = require("../schemas/addMember")
const AppError = require("../utils/AppError");

async function addMember(req, res, next) {
  console.log("controller hit", req.user, req.body, req.params);
  
  try {

    const actorUserId = req.user?.id;
    const orgId = Number(req.params.orgId); 
    console.log("orgId:", orgId)

    if (!actorUserId) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    if (!orgId || Number.isNaN(orgId)) {
      throw new AppError("Invalid org id", 400, "INVALID_ORG_ID");
    }

  
    const parsedBody = addMemberBodySchema.parse(req.body);

    const membership = await membershipService.addMember({
      actorUserId,
      orgId,
      userId: parsedBody.userId,
      email: parsedBody.email,
      role: parsedBody.role,
    });

    return res.status(201).json({ success: true, data: membership });
  } catch (err) {
    return next(err); 
  }
}

module.exports = { addMember };