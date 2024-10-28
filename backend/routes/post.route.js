import express from "express"
import { protectRoute } from "../controler/protectRoute.js"
import { commentPost, createPost ,deletePost, getAllPosts, getFollowingPosts, getLikedPosts, likePost} from "../controler/post.controller.js"

const router = express.Router()

router.get("/all",protectRoute,getAllPosts)
router.get("/following",protectRoute,getFollowingPosts)
router.get("/likedpost",protectRoute,getLikedPosts)
router.post("/create",protectRoute,createPost)
router.post("/like/:id",protectRoute,likePost)
router.post("/comment/:id",protectRoute,commentPost)
router.delete("/:id",protectRoute,deletePost)

export default router