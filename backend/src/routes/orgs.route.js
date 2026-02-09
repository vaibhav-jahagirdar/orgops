const express = require("express");
const router = express.Router();

const orgController = require("../controllers/orgs.controller");

router.post("/", orgController.createOrg);

module.exports = router;