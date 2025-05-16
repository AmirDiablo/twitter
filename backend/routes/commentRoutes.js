const express = require("express")
const { fetchComments, postComment, fetchReplies } = require("../controllers/commentControllers")
const router = express.Router()

router.get("/:postId", fetchComments)
router.post("/postComment", postComment)
router.get("/replies/:mainComment", fetchReplies)

module.exports = router