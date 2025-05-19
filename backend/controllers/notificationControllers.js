const Notification = require("../models/notificationModel")

const allNotifs = async(req, res)=> {
    const { userId } = req.params
    console.log(userId)
   
    try{
        const notifs = await Notification.find({account: userId})
        .populate("who")
        .populate({
            path: "post",
            populate: {
                path: "author"
            }
        })
        .populate("comment")

        console.log(notifs)
        res.status(200).json(notifs)
    }catch (error) {
        res.status(400).json({error: error.message})
    }

}

module.exports = { allNotifs }