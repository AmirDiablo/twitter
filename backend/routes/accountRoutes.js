const express = require("express")
const { userSignup, userLogin, profile, follow, liveSearch, searchPeople, bookmarks, changeProfile, replies } = require("../controllers/accountControllers")
const userAuth = require("../middlewares/userAuth")
const uploadBoth = require("../profileUploader")

const router = express.Router()

router.post("/signup", userSignup)
router.post("/login", userLogin)
router.get("/profile/:id", profile)
router.put("/follow", follow)
router.get('/liveSearch', liveSearch)
router.get("/people", searchPeople)
router.get("/bookmarks/:userId", bookmarks)
router.post('/changeProfile', userAuth, uploadBoth.fields([ {name: 'profile', maxCount: 1}, {name: "header", maxCount: 1} ]), changeProfile)
router.get("/replies", userAuth, replies)

module.exports = router