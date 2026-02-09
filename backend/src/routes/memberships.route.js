const express = require("express");
const router = express.Router();

const membershipController = require("../controllers/memberships.controller");

router.post("/orgs/:orgId/members", membershipController.addMember);

module.exports = router;
