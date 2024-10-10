import express from "express"
import authrouter from "./routes/auth.route.js";
import dotenv from "dotenv"
import connectToMongoDB from "./db/connecttomongodb.js";
import cookieParser from "cookie-parser";
const PORT = 8000;
const app = express();

dotenv.config()


app.use(express.urlencoded({extended:true}))

app.use(express.json())

app.use(cookieParser())

app.use("/api/auth",authrouter)


app.listen(PORT,()=>{
    console.log(`server running on PORT ${PORT}`)
    connectToMongoDB()
})