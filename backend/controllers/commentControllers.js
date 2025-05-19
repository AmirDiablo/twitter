const Comment = require("../models/commentModel")
const Notification = require("../models/notificationModel")


const fetchComments = async(req, res)=> {
    const { postId } = req.params

    const comment = await Comment.find({postId: postId, replyTo: undefined})
    .populate("userId")

    res.status(200).json(comment)
}

const postComment = async(req, res)=> {
    const { userId, text, postId, replyTo, mainComment, authorId, commentOwner } = req.body

    try{
        const comment = await Comment.create({text, userId, postId, replyTo, mainComment})
        const commentId = comment._id

        if(replyTo !== undefined) {
            const update = await Comment.updateOne({_id: replyTo}, {$push: {repliesList: commentId}})
            const sendNotif = await Notification.create({eventType: "reply", who: userId, post: postId, account: commentOwner, comment: commentId})
        }

        const populated = await Comment.findOne({_id: commentId})
        .populate("userId")

        const sendNotif = await Notification.create({eventType: "comment", who: userId, post: postId, account: authorId , comment: commentId})

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