require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const accountRoutes = require("./routes/accountRoutes")
const postRoutes = require("./routes/postRoutes")
const commentRoutes = require("./routes/commentRoutes")
const requireAuth = require('./middlewares/userAuth')
const cors = require("cors")
const startSchedule = require('./schedule')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
/* app.use(requireAuth) */
app.use(cors())
app.use("/api/account", accountRoutes)
app.use("/api/post", postRoutes)
app.use("/api/comment", commentRoutes)

mongoose.connect(process.env.MONGO_URI)
.then(()=> {
    app.listen(process.env.PORT, ()=> {
        console.log("connected to DB and server start listen on port", process.env.PORT)
    })
    startSchedule()
})
.catch((err)=> {
    console.log(err)
})