const express = require("express");
const { refreshSessionController } = require("../controllers/auth/auth.refresh.controller");

const router = express.Router();

router.post("/refresh", refreshSessionController);

module.exports = router;