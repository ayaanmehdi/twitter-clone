import express from "express"
import authrouter from "./routes/auth.route.js";
import dotenv from "dotenv"
import connectToMongoDB from "./db/connecttomongodb.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"
import notificationRoute from "./routes/notification.route.js"
import {v2 as cloudinary} from "cloudinary"
import { protectRoute } from "./controler/protectRoute.js";

const PORT = 8000;
const app = express();

dotenv.config()

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

app.use(express.urlencoded({extended:true}))

app.use(express.json())

app.use(cookieParser())

app.use("/api/auth",authrouter)
app.use("/user",userRoute)
app.use("/api/post",postRoute)
app.use("/api/notification",notificationRoute)


app.listen(PORT,()=>{
    console.log(`server running on PORT ${PORT}`)
    connectToMongoDB()
})