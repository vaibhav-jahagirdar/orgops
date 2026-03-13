const express = require("express");
const router = express.Router();

const orgController = require("../controllers/orgs.controller")
const requireAuth = require("../middleware/requireAuth")

router.post("/create",requireAuth, orgController.createOrg);

module.exports = router;