const validator = require("validator")
const Post = require("../models/postModel")
const Notification = require("../models/notificationModel")
const Account = require("../models/accountModel")

const trimer = (value)=> {
    return validator.trim(validator.escape(value).replace(" ", ""))
}

const detectHashtag = (str)=> {
    const pattern = /#[a-zA-Z]+[\d_]*/g;
    const matches = str.match(pattern)
    return matches
}

const detectMention = (str)=> {
    const pattern = /@[a-zA-Z]+[\d_]*/g;
    const matches = str.match(pattern)
    return matches
}

const createPost = async(req, res)=> {
    const { text, user, permission, scheduledTime } = req.body || null
    const uploadedFile = req.file || null
    //make content object for "content" post collection field
    const content = {file: (uploadedFile ?? "").filename, text: text}

    let type;

    //check if the post is text / combined / media only and then check the mimetype of file
    //when i wrote content.file.file (in some cases that user didnt choose a file) it returns an error
    //so i write this way that when user dont choose a file, it returns "undefined"
    if((uploadedFile ?? "").filename === undefined && text) {
        console.log("this post just a normal text")
        type = "text"
    }
    if((uploadedFile ?? "").filename !== undefined && text) {
        console.log("combined post")
        const fileType = uploadedFile.mimetype.split("/")[0]
        type = `text/${fileType}`
    }
    if((uploadedFile ?? "").filename !== undefined && text.length == 0) {
        console.log("media only")
        const fileType = uploadedFile.mimetype.split("/")[0]
        type = fileType
    }

    if(!uploadedFile && !text) {
        throw Error("write a text or choose a file to upload")
    }

    let status = 'published'
    let scheduledDate = null

    if(scheduledTime) {
        const schedule = new Date(scheduledTime)
        if(isNaN(schedule.getTime()) || schedule < new Date()) {
            throw Error("Invalid scheduled time")
        }

        status = "scheduled"
        scheduledDate = schedule
    }

    console.log(scheduledTime)
    /* const newSchdeduleTime =  */

    const hashtags = await detectHashtag(text)
    const mentions = await detectMention(text)

    try{
        const post = await Post.create({content, author: user, type, whoCanReply: permission, mention: mentions, category: hashtags, status: status, scheduledTime: scheduledDate})
        if(mentions) {
            for(let i=0; i<mentions.length; i++) {
                const mentionedAccount = mentions[i].slice(1)
                const findAccount = await Account.findOne({username: mentionedAccount})
                const findId = findAccount._id
                const sendNotif = await Notification.create({eventType: "mention", who: user, post: post._id, account: findId})
            }
        }
        res.status(200).json(post)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

const allPosts = async(req, res)=> {
    try{
        const posts = await Post.find({status: "published"})
        .populate("author")
        res.status(200).json(posts)
    }catch(error){
        console.log(err)
        res.status(400).json({error: err.message})
    }
}

const homePosts = async(req, res)=> {
    const { followings } = req.body
    
    try{
        const posts = await Post.find({author: {$in: followings}})
        .populate("author")
        res.status(200).json(posts)
    }catch(error){
        console.log(err)
        res.status(400).json({error: err.message})
    }
}

const userPosts = async(req, res)=> {
    const { userId } = req.params
    try{
        const posts = await Post.find({author: userId})
        .populate("author")
        res.status(200).json(posts)
    }catch(error){
        console.log(error)
        res.status(400).json({error: error.message})
    }
}

const like = async(req, res)=> {
    const { postId, userId, postOwner, eventType } = req.body

    const check = await Post.findOne({_id: postId, likes: userId})

    console.log(check)

    if(!check) {
        const like = await Post.updateOne({_id: postId}, {$push: {likes: userId}})
        const sendNotif = await Notification.create({eventType, who: userId, post: postId, account: postOwner})
    }else{
        const unlike = await Post.updateOne({_id: postId}, {$pull: {likes: userId}})
    }

    res.status(200).json({message: "updates done"})
}

const bookmark = async(req, res)=> {
    const { postId, userId } = req.body

    const check = await Post.findOne({_id: postId, bookmarks: userId})

    console.log(check)

    if(!check) {
        const bookmark = await Post.updateOne({_id: postId}, {$push: {bookmarks: userId}})
        const userbookmarkList = await Account.updateOne({_id: userId}, {$push: {bookmarks: postId}})
    }else{
        const undoBookmark = await Post.updateOne({_id: postId}, {$pull: {bookmarks: userId}})
        const deleteFromUserBookmarkList = await Account.updateOne({_id: userId}, {$pull: {bookmarks: postId}})
    }

    res.status(200).json({message: "updates done"})
}

const searchPost = async(req, res)=> {
    const q = req.query.q || ''

    if(!q) {
        return res.status(200).json([])
    }

    try{
        const infos = await Post.find({category: {$regex: q, $options: 'i'}})
        .populate("author")
        
        if(!infos) {
            throw Error("result not found...")
        }
    
        res.status(200).json(infos)
        }catch (error) {
            res.json({error: error.message})
    }
}

module.exports = { createPost, allPosts, userPosts, homePosts, like, bookmark, searchPost }