const cron = require("node-cron")
const Post = require('./models/postModel')

//this function runs every minute to publish posts whose scheduledTime <= now
function startSchedule() {
    cron.schedule('* * * * *', async()=> {
        try{
            const now = new Date()
            const postsToPublish = await Post.find({
                status: 'scheduled',
                scheduledTime: {$lte: now}
            })

            for(const post of postsToPublish) {
                post.status = 'published',
                await post.save()
            }
        }catch (error) {
            console.log(error)
        }
    })

    console.log("Post scheduler started, running  every minute")
}

module.exports = startSchedule