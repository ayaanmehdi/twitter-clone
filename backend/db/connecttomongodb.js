import { log } from "console";
import mongoose from "mongoose";




const connectToMongoDB =  async () =>{
    try {
        
mongoose.connect(process.env.LOCALHOST_URI)


log("connected to mongo")

    } catch (error) {
        log("the error",error.message)
    }
}

export default connectToMongoDB;

