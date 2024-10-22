import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export const getUserprofile = async (req, res) => {
  const username = req.params.username;
  try {
    const userProfile = await User.findOne({ username }).select("-password");
    if (!userProfile) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(userProfile);
  } catch (error) {
    console.error(error, "-----");
    res.status(500).json({ error: "An error . Please try again later." });
  }
};

export const followunfollowuser = async (req, res) => {
  const userId = req.params.id;

  const modifyUser = await User.findById(userId);

  const Loggeduser = await User.findById(req.user._id);

  if (userId == Loggeduser._id) {
    return res
      .status(400)
      .json({ error: "You can't follow/unfollow the user" });
  }

  if (!userId) {
    return res.status(400).json({ error: "User not found  " });
  }

  const isFollowing = Loggeduser.following.includes(userId);

  if (isFollowing) {
    await User.findByIdAndUpdate(userId, {
      $pull: { followers: req.user._id },
    });
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { following: userId },
    });
    res.status(200).json({ message: " User unfollowed succesfully" });
  } else {
    await User.findByIdAndUpdate(userId, {
      $push: { followers: req.user._id },
    });
    await User.findByIdAndUpdate(req.user._id, {
      $push: { following: userId },
    });
    const notification = new Notification({
      type: "follow",
      from: Loggeduser._id,
      to: userId,
    });
    await notification.save();

    // TODO: return the id of the user as a response.

    res.status(200).json({ message: " User followed succesfully " });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const Loggeduser = await User.findById(req.user._id);

    const userFollowedbyme = await User.findById(Loggeduser._id).select(
      "following"
    );

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: Loggeduser },
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUsers = users.filter(
      (user) => !userFollowedbyme.following.includes(user._id)
    );

    const suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const { username, fullname, currentPassword, newPassword, bio, link } =
    req.body;

  let { profilepic, coverImg } = req.body;

  const userID = req.user._id;

  try {
    


  let user = await User.findById(userID);

  if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
    return res
      .status(400)
      .json({ error: "provide both current password and new password " });
  }  else if(newPassword && currentPassword) {
    const passwordcorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!passwordcorrect) {
      return res.status(400).json({ error: "incorrect password" });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "password must be atleast 6 characters" });
    }
  }

  if (profilepic) {
    if (user.profilepic) {
      await cloudinary.uploader.destroy(
        user.profilepic.split("/").pop().split(".")[0]
      );
    }
    const uploaderResponse = await cloudinary.uploader.upload(profilepic);

    profilepic = uploaderResponse.secure_url;
  }

  if (coverImg) {
    if (user.coverimg) {
      await cloudinary.uploader.destroy(
        user.coverimg.split("/").pop().split(".")[0]
      );
    }
    const uploaderResponse = await cloudinary.uploader.upload(coverImg);

    coverImg = uploaderResponse.secure_url;
  }

  user.fullname = fullname || user.fullname;
  user.username = username || user.username;
  user.password = user.password || newPassword
  user.bio = bio || user.bio;
  user.link = link || user.link;
  user.profilepic = profilepic || user.profilepic;
  user.coverimg = coverImg || user.coverimg;

  await user.save();

  user.password = null;

  res.status(201).json({result:"success",data:user});

} catch (error) {
  console.log(error)
  res.status(500).json(error.message);
    
}
};
