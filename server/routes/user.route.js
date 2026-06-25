import express from "express"
import { forgotPassword, getCurrentLocation, getFollowers, getFollowing, getUserWishlist, isFollowing, isInWishList, loginUser, logOutUser, registerUser , resendVerification, resetPasswordWithOTP, totalFollowerFollowingCount, updateFollowers, updateFollowing, updateWishlist, verifyEmail } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router=express.Router();

router.post("/register",registerUser)
router.post("/login",loginUser)
router.post("/logout" , protect , logOutUser)
router.get("/getCurrentLocation",getCurrentLocation)
router.post("/updateWishlist/:eventId", protect , updateWishlist)
router.post("/updateFollowers/:userId", protect , updateFollowers)
router.post("/updateFollowing/:userId", protect , updateFollowing)
router.get("/isFollowing/:userId", protect , isFollowing)
router.get("/isInWishList/:eventId", protect , isInWishList)
router.get("/totalFollowerFollowingCount", protect , totalFollowerFollowingCount)
router.get("/getUserWishlist", protect , getUserWishlist)
router.get("/getFollowers", protect , getFollowers)
router.get("/getFollowing", protect , getFollowing)
router.get("/verifyEmail/:token", verifyEmail);
router.post("/resendVerification", resendVerification);
router.post("/forgotPassword" , forgotPassword)
router.post("/resetPasswordWithOTP" , resetPasswordWithOTP)

export default router