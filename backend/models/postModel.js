const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator  = require("validator")

const contentSchema = new Schema({
    file: {
        type: String
    },
    text: {
        type: String
    }
})

const postSchema = new Schema({
    content: {
        type: contentSchema,
        required: true
    },
    author: {
        type: mongoose.Types.ObjectId, ref: "Account",
        required: true
    },
    type: {
        type: String,
        required: true
    },
    likes: [ {type: mongoose.Types.ObjectId, ref: "Account"} ],
    commentNumber : {
        type: Number,
        required: true,
        default: 0
    },
    bookmarks: [ {type: mongoose.Types.ObjectId, ref: "Account"} ],
    category: {
        type: [String],
    },
    whoCanReply: {
        type: String,
        default: "Everyone"
    },
    mention: {
        type: [String],
    },
    status: {
        type: String,
        enum: ['scheduled', 'published'],
        default: 'published',
        required: true
    },
    scheduledTime: {
        type: Date,
        default: null
    }
})

const Post = mongoose.model("Post", postSchema)
module.exports = Post