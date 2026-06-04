import express from "express"
import { getCurrentLocation, getUserWishlist, isFollowing, isInWishList, loginUser, registerUser , totalFollowerFollowingCount, updateFollowers, updateFollowing, updateWishlist } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router=express.Router();

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/getCurrentLocation",getCurrentLocation)
router.post("/updateWishlist/:eventId", protect , updateWishlist)
router.post("/updateFollowers/:userId", protect , updateFollowers)
router.post("/updateFollowing/:userId", protect , updateFollowing)
router.get("/isFollowing/:userId", protect , isFollowing)
router.get("/isInWishList/:eventId", protect , isInWishList)
router.get("/totalFollowerFollowingCount", protect , totalFollowerFollowingCount)
router.get("/getUserWishlist", protect , getUserWishlist)

export default router