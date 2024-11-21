import User from "../models/user.model.js";
import generatejwtandcookie from "../utils/generatejwt.js";
import bcrypt from "bcryptjs";



export const signup = async (req, res) => {
  try{

  
  const { username, fullname, confirmPassword, password } = req.body;

  const alreadyusername = await User.findOne({ username });
  const alreadyfullname = await User.findOne({ fullname })

  if (alreadyusername) {
    return res.status(200).json({ error: "username has already taken" });
  }
  if (alreadyfullname) {
    return res.status(200).json({ error: "fullname has already taken" });
  }

  const salts = 10;

  const hashedpassword = await bcrypt.hash(password, salts);

  if (confirmPassword !== password) {
    return res.status(200).json({ error: "password don't match" });
  }

  if(password.length<6){
    return res.status(200).json({ error: "password must be have 6 characters " });
  }

  const newUser = new User({
    username,
    fullname,
    password: hashedpassword,
  });

  if (newUser) {
    generatejwtandcookie(newUser._id,res)

    newUser.save();

    res.status(201).json({ 
      fullname:newUser.fullname,
      username:newUser.username,
      profilepic:newUser.profilepic,
      followers:newUser.followers,
      following:newUser.following,
      bio:newUser.bio,
      link:newUser.link,
      coverimg:newUser.coverimg
     });
  }
}catch(error){
  console.error(error,"-----");
  res.status(500).json({ error: "An error . Please try again later." });
}
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    const passwordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user) {
      return res.status(200).json({ error: "Incorrect username" });
    }

    if (!passwordCorrect) {
      return res.status(200).json({ error: "Incorrect password" });
    }

    
    generatejwtandcookie(user._id,res)
    res.status(200).json({
      _id: user._id,
      username: user.username,
      fullname:user.fullname,
      followers:user.followers,
      following:user.following,
      profilepic: user.profilepic,
    })
  } catch (error) {
    console.error(error,"-----");
    res.status(500).json({ error: "An error . Please try again later." });
  }
};

export const logout = (req,res)=>{
  res.cookie("jwt", "", { maxAge:0 });
  res.status(200).json({message:"loggedout sucessfully"})
}

export const getme = async (req,res)=>{
   try {
    const user = await User.findById(req.user._id).select("-password")
    res.status(200).json(user)
   } catch (error) {
    res.status(401).json({error:"unauthrozed user"})
   }
}

