import Notification from "../models/notification.model.js";

export const getNotification = async (req,res)=>{
      const userId = req.user._id;

      const notification = await Notification.find({to:userId}).populate({
        path:"from",
        select:"username profilepic"
      })

      await Notification.updateMany({to:userId},{read:true})

      res.status(200).json(notification)


}





export const deleteNotification = async (req,res)=>{
    const userId = req.user._id;

    const notification = await Notification.find({to:userId})

    await Notification.deleteMany({to:userId})

    res.status(200).json({message:"notification deleted succesfully"})
}