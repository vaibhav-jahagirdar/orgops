const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireMembership = require("../middleware/requireMembership");
const { listProjectsController } = require("../controllers/projects.list.controller");

// GET /orgs/:orgId/projects
router.get(
  "/orgs/:orgId/projects",
  requireAuth,
  requireMembership(), 
  listProjectsController
);

module.exports = router;
