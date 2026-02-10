const express = require("express")
const router = express.Router()

const orgsReadController = require("../controllers/orgs.read.controller")

router.get("/",orgsReadController.listOrgsForUser)

module.exports = router;