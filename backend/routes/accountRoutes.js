const express = require("express")
const { userSignup, userLogin, profile, follow, liveSearch, searchPeople } = require("../controllers/accountControllers")

const router = express.Router()

router.post("/signup", userSignup)
router.post("/login", userLogin)
router.get("/profile/:id", profile)
router.put("/follow", follow)
router.get('/liveSearch', liveSearch)
router.get("/people", searchPeople)

module.exports = router