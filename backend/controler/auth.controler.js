import User from "../models/user.model.js";
import generatejwtandcookie from "../utils/generatejwt.js";
import bcrypt from "bcryptjs";



export const signup = async (req, res) => {
  try{

  
  const { username, fullname, confirmPassword, password, gender } = req.body;

  const alreadyuser = await User.findOne({ username });

  if (alreadyuser) {
    return res.status(400).json({ error: "user already exists" });
  }

  const salts = 10;

  const hashedpassword = await bcrypt.hash(password, salts);

  const boypic = `https://avatar.iran.liara.run/public/boy?username=${username}`;

  const girlpic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

  if (confirmPassword !== password) {
    return res.status(400).json({ error: "password don't match" });
  }

  const newUser = new User({
    username,
    fullname,
    password: hashedpassword,

    gender,
    profilepic: gender === "male" ? boypic : girlpic,
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
}catch{
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
      return res.status(400).json({ error: "Incorrect username" });
    }

    if (!passwordCorrect) {
      return res.status(401).json({ error: "Incorrect password" });
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
    res.status(400).json({error:"unauthrozed user"})
   }
}

