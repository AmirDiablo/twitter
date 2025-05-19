const express = require("express")
const { allNotifs } = require("../controllers/notificationControllers")
const router = express.Router()

router.get("/:userId", allNotifs)

module.exports = router