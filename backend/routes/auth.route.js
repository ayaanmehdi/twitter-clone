import express from "express"
import { getme, login, logout, signup } from "../controler/auth.controler.js";
import { protectRoute } from "../controler/protectRoute.js";
const router = express.Router()

router.get("/me",protectRoute,getme)
router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)

export default router;