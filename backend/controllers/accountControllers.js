const Account = require('../models/accountModel')
const Notification = require("../models/notificationModel")
const validator = require("validator")
const jwt = require("jsonwebtoken")

const createToken = (_id)=> {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: "10d" })
}

const trimer = (value)=> {
    return validator.trim(validator.escape(value).replace(" ", ""))
}

const userSignup = async(req, res)=> {
    const { username, email, password } = req.body
    const newUsername = trimer(username)
    const newEmail = trimer(email)
    const newPassword = trimer(password)

    try{
        const account = await Account.signup(newUsername, newEmail, newPassword)

        const token = createToken(account._id)


        res.status(200).json({id: account._id , token})
    }catch(error){
        res.status(400).json({ error: error.message })
    }
}

const userLogin = async(req, res)=> {
    const { email, password } = req.body
    const newEmail = trimer(email)
    const newPassword = trimer(password)

    try{
        const account = await Account.login(newEmail, newPassword)

        const token = createToken(account._id)

        res.status(200).json({id: account._id, token})
    }catch(error){
        res.status(400).json({ error: error.message })
    }
}

const profile = async(req, res)=> {
    const { id } = req.params
    const userInfo = await Account.find({_id: id})
    res.status(200).json(userInfo)
}

const follow = async(req, res)=> {
    const { followWho, follower, eventType } = req.body
    const check = await Account.findOne({_id: followWho, followers: follower})

    if(!check) {
        const changeFollowers = await Account.updateOne({_id: followWho}, {$push: {followers: follower}})
        const changeFollowings = await Account.updateOne({_id: follower}, {$push: {followings: followWho}})
        const sendNotif = await Notification.create({eventType, who: follower, account: followWho})
    }else{
        const changeFollowers = await Account.updateOne({_id: followWho}, {$pull: {followers: follower}})
        const changeFollowings = await Account.updateOne({_id: follower}, {$pull: {followings: followWho}})
    }

    res.status(200).json({message: "updates done"})
}

const liveSearch = async(req, res)=> {
    try{
        const q = req.query.q || ''
        if(!q) {
            return res.status(200).json([])
        }

        const results = await Account.find({username: {$regex: q, $options: 'i'}}).limit(10)
        res.status(200).json(results)
    }catch (error) {
        res.status(500).send("Server error")
    }
}

const searchPeople = async(req, res)=> {
    const q = req.query.q || ''

    if(!q) {
        return res.status(200).json([])
    }

    try{
        const infos = await Account.find({username: {$regex: q, $options: 'i'}})
        if(!infos) {
            throw Error('result not found...')
        }
        console.log(infos)
        res.status(200).json(infos)
    }catch (error) {
        res.json({error: error.message})
    }
    
}

const bookmarks = async(req, res)=> {
    const { userId } = req.params

    try{
        const findAccount = await Account.findOne({_id: userId}).select("bookmarks").select("-_id")
        .populate({
            path: "bookmarks",
            populate: {
                path: "author"
            }
        })

        const bookmarks = findAccount.bookmarks

        res.status(200).json(bookmarks)
    }catch (error) {
        console.log(error)
    }

    

}

module.exports = { userSignup, userLogin, profile, follow, liveSearch, searchPeople, bookmarks }