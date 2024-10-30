import express from "express"
import { protectRoute } from "../controler/protectRoute.js";
import { deleteNotification, getNotification } from "../controler/notification.controller.js";
const router = express.Router();

router.get("/",protectRoute,getNotification)
router.delete("/delete",protectRoute,deleteNotification)

export default router