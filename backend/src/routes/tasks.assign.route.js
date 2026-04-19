const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const{requireMembership} = require("../middleware/requireMembership");

const { assignTaskController } = require("../controllers/task.assign.controller");


router.patch(
  "/:orgId/tasks/:taskId/assign",
  requireAuth,
  requireMembership("admin"), 
  assignTaskController
);

module.exports = router;