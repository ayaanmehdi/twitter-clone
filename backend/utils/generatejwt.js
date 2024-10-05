import jwt from "jsonwebtoken"

const generatejwtandcookie = (id,res)=>{
const token = jwt.sign({id},process.env.jwt_SeCRET,{
    expiresIn:'80d'
})
 res.cookie("jwt",token,{
    maxAge: 80*24*60*60*1000,
    httpOnly:true, // prevent xxs atack,
    sameSite:"strict",
    secure:process.env.NoDE !== "development"
 })
}

export default generatejwtandcookie