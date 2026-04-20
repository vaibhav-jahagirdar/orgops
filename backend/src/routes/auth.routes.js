const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth/auth.controller");
const requireAuth = require("../middleware/requireAuth");
const getMe = require("../controllers/auth/auth.me.controller")
const {logoutController} = require("../controllers/auth/auth.logout.controller")

router.get("/me", requireAuth, getMe);


router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", logoutController);

module.exports = router;
