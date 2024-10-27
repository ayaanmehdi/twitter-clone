import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import Post from "../models/posts.model.js";
import Notification from "../models/notification.model.js";

export const createPost = async (req, res) => {
  const { text } = req.body;
  let { img } = req.body;

  try {
    const userId = req.user._id.toString();

    const user = await User.findById(userId);

    if (!text && !img) {
      return res.status(400).json({ error: "post must be have image or text" });
    }

    if (img) {
      const uploaderresponse = await cloudinary.uploader.upload(img);

      img = uploaderresponse.secure_url;
    }

    const newpost = new Post({
      postedby: userId,
      text,
      img,
    });

    await newpost.save();

    res.status(201).json(newpost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.postedby.toString() !== req.user._id.toString()) {
      res.status(400).json({ error: "you can't delete the post" });
    }
    if (post.img) {
      const imgid = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgid);
    }

    await Post.findByIdAndDelete(post._id);

    res.status(201).json({ message: "post deleted succesfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const likePost = async (req, res) => {

    try {
        

        const post = await Post.findById(req.params.id);

        let messageforclient;

        if (post.like.includes(req.user._id)) {
            post.like.pull(req.user._id);
            await post.save();
            

            messageforclient={
                liked:false
            }
        
        } else {
            post.like.push(req.user._id);
            messageforclient={
                liked:true,
                
            }
            await post.save();
        
        }

        const newnotification = new Notification({
            from:req.user._id,
            to:post.postedby,
            type:"like"

        })

        const notificationSavedOrNot = await newnotification.save()

        if(notificationSavedOrNot)
            messageforclient.notificationSetOrNot = true
        else 
        messageforclient.notificationSetOrNot = false
        
        res.status(200).json({message:messageforclient})

        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
};

export const commentPost = async (req,res)=>{

  try {
    
 
     const {text} = req.body;

     const postId = req.params.id
     const userId = req.user._id

     const post = await Post.findById(postId);

     if(!text){
      res.status(400).json({error:"comment can't be empty"})
     }

     await post.comments.push({text,user:userId})

     post.save();

     res.status(201).json({message:"comment added succesfully"})

    } catch (error) {
      res.status(500).json({error:error.message})
    }
}

export const getAllPosts = async (req,res)=>{

  try {
    
    const allposts = await Post.find().sort({createdAt:-1}).populate({
      path:"postedby",
      select:"-password"
    })

if(allposts.length===0){
  return res.status(200).json([])
}

    res.status(200).json(allposts)


    } catch (error) {
     res.status(500).json({error:error.message})
     console.log(error)
    }
}