const Account = require('../models/accountModel')
const Notification = require("../models/notificationModel")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const fs = require("fs")
const path = require("path")
const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')

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

        res.status(200).json({userInfo: account , token})
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

        res.status(200).json({userInfo: account, token})
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

    const account = await Account.findOne({_id: followWho})
    const followers = []
    for(let i=0; i<account.followers.length; i++) {
        const id = account.followers[i].toString()
        followers.push(id)
    }

    return res.status(200).json({followers: followers})
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

const changeProfile = async (req, res) => {
    try {
        // 1. دریافت userId از req.user
        const userId = req.user._id

        //گرفتن نام پروفایل و هدر قبلی
        const userAccount = await Account.findOne({_id: userId})
        const prevProfile = userAccount.profile
        const prevHeader = userAccount.header
        const prevUsername = userAccount.username

        // 2. دریافت username از body
        const { username } = req.body

        // 3. دریافت فایل‌ها از req.files
        const files = req.files

        // 4. استخراج نام فایل‌ها با نام‌های متفاوت برای جلوگیری از تداخل
        let profileFilename = null
        let headerFilename = null

        if (files && files.profile) {
            profileFilename = files.profile[0].filename
        }

        if (files && files.header) {
            headerFilename = files.header[0].filename
        }

        // ساخت مسیر مطلق
        const uploadsDir = path.join(__dirname, '../uploads');
        const profilePath = path.join(uploadsDir, `/profiles/${prevProfile}`);
        const headerPath = path.join(uploadsDir, `/headers/${prevHeader}`)

        // 5. ساخت آبجکت به‌روزرسانی
        const updateFields = {}

        //بررسی اینکه آیا این نام کاربری قابل استفاده است یا خیر
        const check = await Account.findOne({username: username})

        if(username != prevUsername) {
            if(check) {
                return res.status(400).json({sucess: false, message: "this username is taken by another user"})
            }
        }
        
        if (username) {
            updateFields.username = username
        }
        
        if (profileFilename) {
            updateFields.profile = profileFilename  // حالا این با schema هماهنگ است
            
            if(fs.existsSync(profilePath)) {
                fs.unlink(profilePath, (err)=> {
                    if(err) {
                        console.log(err)
                    }

                    console.log("file deleted")
                })
            }
        }
        
        if (headerFilename) {
            updateFields.header = headerFilename    // حالا این با schema هماهنگ است

            if(fs.existsSync(headerPath)) {
                fs.unlink(headerPath, (err)=> {
                    if(err) {
                        console.log(err)
                    }

                    console.log("file deleted")
                })
            }
        }

        // 6. به‌روزرسانی در دیتابیس
        const updateResult = await Account.updateOne(
            { _id: userId },  // اینجا userId باید ObjectId معتبر باشد
            { $set: updateFields }
        )


        // 7. بررسی نتیجه
        if (updateResult.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        if (updateResult.modifiedCount === 0) {
            return res.json({
                success: true,
                message: 'No changes made',
                data: updateResult
            })
        }

        return res.json({
            success: true,
            message: 'Profile updated successfully',
            data: updateResult,
            userInfo: {
                _id: userAccount._id,
                username: username,
                password: userAccount.password,
                email: userAccount.email,
                profile: profileFilename ? profileFilename : userAccount.profile,
                header: headerFilename ? headerFilename : userAccount.header,
                followers: userAccount.followers,
                followings: userAccount.followings,
                bookmarks: userAccount.bookmarks
            }
        })

    } catch (error) {
        console.error('ERROR in changeProfile:')
        console.error('Error name:', error.name)
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
        
        // خطای خاص CastError
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format',
                error: `The value "${error.value}" is not a valid ObjectId`,
                userId: req.user?._id
            })
        }

        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { userSignup, userLogin, profile, follow, liveSearch, searchPeople, bookmarks, changeProfile }