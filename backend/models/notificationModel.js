const mongoose = require("mongoose")
const Schema = mongoose.Schema

const notificationSchema = new Schema({
    eventType: {
        type: String,
        required: true,
        enum: ["like", "follow", "comment", "mention", "reply"]
    },
    who: {
        type: mongoose.Types.ObjectId, ref: "Account",
        required: true
    },
    post: {
        type: mongoose.Types.ObjectId, ref: "Post",
    },
    account: {
        type: mongoose.Types.ObjectId, ref: "Account",
        required: true
    },
    comment: {
        type: mongoose.Types.ObjectId, ref: "Comment",
    }
}, {timestamps: true})

const Notification = mongoose.model("Notification", notificationSchema)
module.exports = Notification