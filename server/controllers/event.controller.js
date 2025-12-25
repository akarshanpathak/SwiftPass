import asyncHandler from "../utils/asyncHandler.js";
import { Event } from "../models/event.schema.js";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";

export const createEvent = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    type,
    location,
    startDate,
    endDate,
    price,
    capacity,
  } = req.body;

  if (
    !title ||
    !description ||
    !location ||
    !startDate ||
    !endDate ||
    !price ||
    !capacity
  ) {
    throw new ApiError(400, "Please Provide all required feilds");
  }

  if (!req.file) {
    throw new ApiError(400, "Banner image is required");
  }

  console.log(req.file);

  if (price === undefined) {
    throw new ApiError(400, "Price is required");
  }

  if (price < 0) {
    throw new ApiError(400, "Price cannot be negative");
  }

  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end <= start) {
    throw new ApiError(400, "End Date must be after Start Date");
  }

  if (start < now) {
    throw new ApiError(400, "Start date can't be of past");
  }

  if (capacity <= 0) {
    throw new ApiError(400, "Capacity must be at least 1");
  }

  const newEvent = new Event({
    title,
    description,
    bannerImage: req.file.path,
    type,
    price,
    location,
    capacity,
    startDate,
    endDate,
    organiserId: req.user._id,
  });

  await newEvent.save();

  res
    .status(201)
    .json({ message: "Event Created Successfully", success: true, newEvent });
});

export const getAllEvent = asyncHandler(async (req, res, next) => {
  const events = await Event.find({ status: "PUBLISHED" })
    .populate("organiserId", "name avatar")
    .sort({ startDate: 1 });

  res.status(201).json({
    message: "Event fetched successfully",
    success: true,
    data: events,
    count: events.length,
  });
});

export const getEventById = asyncHandler(async (req, res, next) => {
    const id = req.params.eventId;

    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(400, "Invalid Event ID format");
    }

    const event = await Event.findById(id).populate(
        "organiserId",
        "name avatar"
    );

    if(!event){
        throw new ApiError(404,"Event not found")
    }
   
    res.status(200).json({message:"Event fetched Successfully",success:true,data:event})
});

export const getAllEventForUser=asyncHandler(async(req,res)=>{
    const userId = req.user._id

    if(!mongoose.Types.ObjectId.isValid(userId)){
      throw new ApiError(400,"Invalid User ID format")
    }

    const events=await Event.find({organiserId:userId})

    if(events.length===0){
      return res.status(200).json({
            success: true,
            message: "No events found for this user",
            data: []
      });
    }

    res.status(200).json({message:"Event fetched Successfully",Length:events.length,success:true,data:events})
})