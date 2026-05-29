import mongoose from "mongoose";
import { register, login } from "../services/user.services.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.schema.js";
import { Event } from "../models/event.schema.js";

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
  console.log("printing req.body ", req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    console.log("All feilds are Required");
    throw new ApiError(401, "All feilds are required");
  }

  const user = await login(email, password);

  return res
    .cookie("access-token", user.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
    })
    .status(201)
    .json({ message: "Login Successfull", user, success: true });
});


export const getCurrentLocation = asyncHandler(async (req, res, next) => {
  const { lng, lat } = req.query
  if (!lng || !lat) {
    throw new ApiError(400, "All feilds are required")
  }

  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
    headers: {
      "User-Agent": "swiftpass(swiftpass@gmail.com)"
    }
  })

  const data = await response.json();
  console.log(data);
  res.json(data);

})

export const updateWishlist = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new ApiError(404, "Please provide valid event id")
  }

  const event = await Event.findById(eventId)

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  const user = await User.findById(req.user._id);

  const alreadyExist = user.wishlist.some((id) => id.toString() === eventId)

  if (alreadyExist) {
    user.wishlist = user.wishlist.filter((id) => id.toString() !== eventId)

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
})

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
    (id) => id.toString() === addUser.toString()
  );

  if (alreadyFollows) {

    userExist.followers = userExist.followers.filter(
      (id) => id.toString() !== addUser.toString()
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
    (id) => id.toString() === userId.toString()
  );

  if (alreadyFollows) {

    user.following = user.following.filter(
      (id) => id.toString() !== userId.toString()
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

  const user = req.user || await User.findById(req.user?._id);
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

  const user = req.user || await User.findById(req.user?._id);
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

export const totalFollowerFollowingCount = asyncHandler (async (req , res , next) =>{
  const user = req.user
  // console.log(user );
  res.json({success : true , message :"fetched successfully" ,followersCount : user.followers.length , followingCount : user.following.length})
})