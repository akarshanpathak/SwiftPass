import express from "express"
import { getCurrentLocation, loginUser, registerUser, updateWishlist } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router=express.Router();

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/getCurrentLocation",getCurrentLocation)
router.post("/updateWishlist/:eventId", protect , updateWishlist)

export default router