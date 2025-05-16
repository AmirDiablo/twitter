const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema ({
    text: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId, ref: "Account",
        required: true
    },
    postId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    replyTo: {
        type: mongoose.Types.ObjectId, ref: "Comment"
    },
    repliesList: {
        type: [ {type: mongoose.Types.ObjectId} ]
    },
    mainComment: {
        type: mongoose.Types.ObjectId, ref: "Comment",
        default: null
    }
}, {timestamps: true})

const Comment = mongoose.model("Comment", commentSchema)
module.exports = Comment