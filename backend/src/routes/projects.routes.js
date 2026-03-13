const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const {requireMembership} = require("../middleware/requireMembership");

const {
  createProjectController,
  deleteProjectController,
} = require("../controllers/projects.controller");


router.post(
  "/:orgId/projects",
  requireAuth,
  requireMembership("admin"),
  createProjectController
);


router.delete(
  "/:orgId/projects/:projectId",
  requireAuth,
  requireMembership("admin"),
  deleteProjectController
);

module.exports = router;