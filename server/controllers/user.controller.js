import mongoose from "mongoose";
import { register, login } from "../services/user.services.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.schema.js";
import { Event } from "../models/event.schema.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(401, "All feilds are required");
  }

  const data = await register(name, email, password);

  return res
    .cookie("access-token", data.token, { httpOnly: true })
    .status(201)
    .json({ message: "Registration Successfull", data, success: true });
});

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const { user, token } = await login(email, password);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res.status(200).cookie("accessToken", token, cookieOptions).json({
    success: true,
    message: "Login Successful",
    user,
    token,
  });
});

export const logOutUser = asyncHandler(async (req, res, next) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
  };
  console.log("logout successfull");
  res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .json({ success: true, message: "User logged out successfully" });
});

export const getCurrentLocation = asyncHandler(async (req, res, next) => {
  const { lng, lat } = req.query;
  if (!lng || !lat) {
    throw new ApiError(400, "All feilds are required");
  }

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    {
      headers: {
        "User-Agent": "swiftpass(swiftpass@gmail.com)",
      },
    },
  );

  const data = await response.json();
  // console.log(data);
  res.json(data);
});

export const updateWishlist = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new ApiError(404, "Please provide valid event id");
  }

  const event = await Event.findById(eventId);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  const user = await User.findById(req.user._id);

  const alreadyExist = user.wishlist.some((id) => id.toString() === eventId);

  if (alreadyExist) {
    user.wishlist = user.wishlist.filter((id) => id.toString() !== eventId);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Event removed from wishlist",
      wishlist: user.wishlist,
    });
  }

  user.wishlist.push(eventId);

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Event added to wishlist",
    wishlist: user.wishlist,
  });
});

export const updateFollowers = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(404, "User not exists");
  }

  const userExist = await User.findById(userId);

  if (!userExist) {
    throw new ApiError(404, "User not exist");
  }

  const addUser = req.user._id;

  const alreadyFollows = userExist.followers.some(
    (id) => id.toString() === addUser.toString(),
  );

  if (alreadyFollows) {
    userExist.followers = userExist.followers.filter(
      (id) => id.toString() !== addUser.toString(),
    );

    await userExist.save();

    return res.status(200).json({
      success: true,
      message: "removed form follower",
      followers: userExist.followers,
    });
  }

  userExist.followers.push(addUser);

  await userExist.save();

  return res.status(200).json({
    success: true,
    message: "follower Added successfully",
    followers: userExist.followers,
  });
});

export const updateFollowing = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(404, "User not exists");
  }

  const userExist = await User.findById(userId);

  if (!userExist) {
    throw new ApiError(404, "User not exist");
  }

  const user = await User.findById(req.user._id);

  const alreadyFollows = user.following.some(
    (id) => id.toString() === userId.toString(),
  );

  if (alreadyFollows) {
    user.following = user.following.filter(
      (id) => id.toString() !== userId.toString(),
    );

    await user.save();

    return res.status(200).json({
      success: true,
      message: "removed from following",
      following: user.following,
    });
  }

  user.following.push(userId);

  await user.save();

  return res.status(200).json({
    success: true,
    message: "following updated successfully",
    following: user.following,
  });
});

export const isFollowing = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Provide a valid user ID"); // Changed to 400 (Bad Request)
  }

  const targetUserExist = await User.findById(userId);
  if (!targetUserExist) {
    throw new ApiError(404, "User does not exist");
  }

  const user = req.user || (await User.findById(req.user?._id));
  if (!user) {
    throw new ApiError(401, "User not authorized"); // Changed to 401 (Unauthorized)
  }

  const alreadyFollows = user.following.some((id) => id.equals(userId));

  if (alreadyFollows) {
    return res.status(200).json({
      success: true,
      message: "Already following",
      following: true,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Not following",
    following: false,
  });
});

export const isInWishList = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new ApiError(400, "Please provide a valid event ID");
  }

  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  const user = req.user || (await User.findById(req.user?._id));
  if (!user) {
    throw new ApiError(401, "User not authorized");
  }

  const alreadyExist = user.wishlist.some((id) => id.equals(eventId));

  if (alreadyExist) {
    return res.status(200).json({
      success: true,
      message: "Already in wishlist",
      inWishlist: true,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Not in wishlist",
    inWishlist: false,
  });
});

export const totalFollowerFollowingCount = asyncHandler(
  async (req, res, next) => {
    const user = req.user;
    // console.log(user );
    res.json({
      success: true,
      message: "fetched successfully",
      followersCount: user.followers.length,
      followingCount: user.following.length,
    });
  },
);

export const getUserWishlist = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const eventInUserWishlist = await User.findById(userId).populate("wishlist");

  // console.log("eventInUserWishlist " , eventInUserWishlist.wishlist);

  res.status(200).json({
    success: true,
    message: "wishlist found successfully",
    wishlist: eventInUserWishlist.wishlist,
  });
});

export const getFollowers = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid Id");
  }

  if (!userId) {
    throw new ApiError(400, "Please login to see your follower");
  }

  const followers = await User.findById(userId)
    .select("followers")
    .populate("followers", "name email avatar")
    .lean();

  res.status(200).json({
    success: true,
    message: "Followers found successfully",
    followers,
  });
});

export const getFollowing = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid Id");
  }

  if (!userId) {
    throw new ApiError(400, "Please login to see your follower");
  }

  const following = await User.findById(userId)
    .select("following")
    .populate("following", "name email avatar")
    .lean();

  res.status(200).json({
    success: true,
    message: "following found successfully",
    following,
  });
});

export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    verifyToken: hashedToken,
    verifyTokenExpiry: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    throw new ApiError(404, "Token is invalid or has expired.");
  }

  user.isVerified = true;
  user.verifyToken = undefined;
  user.verifyTokenExpiry = undefined;

  await user.save();

  res
    .status(200)
    .json({ success: true, message: "Email verified successfully!" });
});

export const resendVerification = asyncHandler(async (req, res, next) => {
  // console.log("printing req body from resendVerification " , req.body)
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Please provide valid email");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "Please provide valid email");
  }

  if (user.isVerified) {
    return res.status(400).json({ message: "Already verified" });
  }

  const unhashedToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(unhashedToken)
    .digest("hex");

  user.verifyToken = hashedToken;
  user.verifyTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

  const verifyUrl = `${process.env.FRONTEND_URL}/verifyEmail/${unhashedToken}`;

  await sendEmail({
    email: email,
    subject: "Verify your SwiftPass Account",
    html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
                    <h2 style="color: #07A320;">Welcome to SwiftPass!</h2>
                    <p>Hi ${user.name}, please verify your email to start booking and hosting events.</p>
                    <a href="${verifyUrl}" style="background: #07A320; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a>
                    <p style="margin-top: 20px; font-size: 12px; color: #666;">This link expires in 24 hours.</p>
                </div>
            `,
  });

  await user.save();

  res
    .status(200)
    .json({ success: true, message: "New verification link sent!" });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Please provide an email");
  }

  const user = await User.findOne({ email });

  if (!user) {
    
    return res.status(200).json({
      success: true,
      message: "If an account exists, an OTP has been sent.",
    });
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  user.forgotPasswordOTP = hashedOTP;

  user.forgotPasswordOTPExpiry = Date.now() + 10 * 60 * 1000;

  await user.save();

  const html = `
        <div style="font-family: sans-serif; text-align: center; padding: 20px;">
            <h1>Password Reset OTP</h1>
            <p>Your one-time password for resetting your SwiftPass account is:</p>
            <h2 style="background: #07A320; padding: 10px; display: inline-block; letter-spacing: 5px;">${otp}</h2>
            <p>This code expires in 10 minutes. Do not share this code with anyone.</p>
        </div>
    `;

  try {

    await sendEmail({
      email: user.email,
      subject: "Your Password Reset OTP",
      html,
    });

    res.status(200).json({ success: true, message: "OTP sent to your email." });
  } catch (err) {

    user.forgotPasswordOTP = undefined;

    user.forgotPasswordOTPExpiry = undefined;

    await user.save();

    throw new ApiError(400, "Failed to send OTP email");
  }
});

export const resetPasswordWithOTP = asyncHandler(async (req, res, next) => {
  const { email, password, otp } = req.body;

  if (!email || !password || !otp) {
    throw new ApiError(400, "All feilds are required");
  }

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  const user = await User.findOne({
    email,
    forgotPasswordOTP: hashedOtp,
    forgotPasswordOTPExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid OTP or OTP has expired" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword; // Ensure .pre("save") hashes this!
  user.forgotPasswordOTP = undefined;
  user.forgotPasswordOTPExpiry = undefined;
  await user.save();

  res
    .status(200)
    .json({ success: true, message: "Password updated! You can now login." });
});
