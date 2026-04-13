const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireMembership = require("../middleware/requireMembership");
const { renameProjectController } = require("../controllers/projects.rename.controller");


router.patch(
  "/orgs/:orgId/projects/:projectId",
  requireAuth,
  requireMembership("admin"), 
  renameProjectController
);

module.exports = router;