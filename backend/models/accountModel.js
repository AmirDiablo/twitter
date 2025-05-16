const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require("bcrypt")
const validator = require('validator')

const accountSchema = new Schema ({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        default: "default.jfif"
    },
    header: {
        type: String
    },
    followers: [ {type: mongoose.Types.ObjectId, ref: "Account"} ],
    followings: [ {type: mongoose.Types.ObjectId, ref: "Account"} ],
    bookmarks: [ {type: mongoose.Types.ObjectId, ref: "Post"} ]
}, {timestamps: true})

accountSchema.statics.signup = async function(username, email, password) {
    const check = await this.findOne({ $or: [ {username: username}, {email: email} ] })

    if(!username || !email || !password) {
        throw Error("all fields must be filled")
    }

    if(check) {
        throw Error("this email or username is already in use")
    }

    if(!validator.isAlphanumeric(username)) {
        throw Error("username must be alphaNumeric")
    }

    if(!validator.isLength(username, {min: 3, max:20})) {
        throw Error("username must be at least 3 chars and maximum of 20")
    }

    if(!validator.isEmail(email)) {
        throw Error("enter a valid email address")
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const account = await this.create({ username, email, password: hash })

    return account
}

accountSchema.statics.login = async function(email, password) {
    const user = await this.findOne({email})

    if(!email || !password) {
        throw Error("all fields must be filled")
    }

    if(!user) {
        throw Error("incorrect email")
    }

    if(!validator.isEmail(email)) {
        throw Error("enter a valid email address")
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match) {
        throw Error("incorrect password")
    }

    return user
}

const Account = mongoose.model("Account", accountSchema)

module.exports = Account