const express = require("express")
const { createPost, allPosts, userPosts, homePosts, like, bookmark, searchPost } = require("../controllers/postControllers")
const upload = require("../upload")

const router = express.Router()

router.post("/", upload.single("file"), createPost)
router.get("/all", allPosts)
router.get("/userPosts/:userId", userPosts)
router.post("/homePosts", homePosts)
router.put("/like", like)
router.put("/bookmark", bookmark)
router.get("/posts", searchPost)

module.exports = router