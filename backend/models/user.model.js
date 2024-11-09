import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 6,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
      minlength: 6,

      unique: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    confirmPassword: {
      type: String,
      select: false,
    },
    profilepic: {
      type: String,
      default: "",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        ref: "User",
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        ref: "User",
      },
    ],

    coverimg: {
      default: "",
      type: String,
    },
    bio: {
      type: String,
      default: "",
    },
    link:{
        type:String,
        default:""
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
