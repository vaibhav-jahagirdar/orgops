const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth/auth.controller");
const requireAuth = require("../middleware/requireAuth");
const getMe = require("../controllers/auth/auth.me.controller")

router.get("/me", requireAuth, getMe);


router.post("/register", authController.register);
router.post("/login", authController.login);


module.exports = router;
