import User from "../models/user.model.js";
import jwt from "jsonwebtoken"
export const protectRoute = async (req,res,next)=>{
    try {

        const token = req.cookies.jwt;

        if(!token){
            return res.status(400).json({error:"unauthorized user"})
        }
        
        const decode = jwt.verify(token,process.env.jwt_SeCRET)

        if(!decode){
            return res.status(400).json({error:"login again"})
        }
        const user = await User.findById(decode.userid).select("-password")

        if(!user){
            
            return res.status(400).json({error:"user not found"})
           
        }

        req.user = user;

        next()

     

    } catch (error) {
        console.log(error.message)
        res.status(401).json({error:error.message})
    }
}