import express from "express";
import {protectRoute} from "../controler/protectRoute.js"
import { followunfollowuser, getSuggestedUsers, getUserprofile, updateUserProfile } from "../controler/user.controller.js";
const router = express.Router();

router.get("/profile/:username",protectRoute,getUserprofile)
router.get("/suggested",protectRoute,getSuggestedUsers)
router.post("/follow/:id",protectRoute,followunfollowuser)
router.post("/update",protectRoute,updateUserProfile)

export default router