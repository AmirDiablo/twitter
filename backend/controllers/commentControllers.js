const Comment = require("../models/commentModel")


const fetchComments = async(req, res)=> {
    const { postId } = req.params

    const comment = await Comment.find({postId: postId, replyTo: undefined})
    .populate("userId")

    res.status(200).json(comment)
}

const postComment = async(req, res)=> {
    const { userId, text, postId, replyTo, mainComment } = req.body

    console.log(replyTo)

    try{
        const comment = await Comment.create({text, userId, postId, replyTo, mainComment})
        const commentId = comment._id

        if(replyTo !== undefined) {
            const update = await Comment.updateOne({_id: replyTo}, {$push: {repliesList: commentId}})
        }

        const populated = await Comment.findOne({_id: commentId})
        .populate("userId")

        res.status(200).json(populated)
    }catch(error){
        console.log(error)
        res.status(400).json({error: error.message})
    }
    
}

const fetchReplies = async(req, res)=> {
    const { mainComment } = req.params

    const replies = await Comment.find({mainComment: mainComment})
    .populate("userId")
    .populate("replyTo")
    .populate({
        path: "replyTo",
        populate: {
            path: "userId"
        }
    })

    console.log(replies)
    
    res.status(200).json(replies)
}

module.exports = { fetchComments, postComment, fetchReplies }