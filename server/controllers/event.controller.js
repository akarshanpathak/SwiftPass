import asyncHandler from "../utils/asyncHandler.js";
import { Event } from "../models/event.schema.js";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";
import { deleteImageFromCloudinary } from "../config/cloudinary.js";

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
    bannerImagePublicId:req.file.filename,
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

export const updateEventsDetail=asyncHandler(async (req,res)=>{
    const eventId=req.params.eventId;

    if(!mongoose.Types.ObjectId.isValid(eventId)){
      throw new ApiError(400, "Invalid Event ID format");
    }

    const event=await Event.findById(eventId);
    
    if(!event){
      throw new ApiError(404,"Event not found")
    }
    
    const userId=req.user._id;

    if(userId.toString()!== event.organiserId.toString()){
      throw new ApiError(400, "You are only allowed to update events created by you.");
    }

    const updates=req.body

    if(req.file){
      const publicId=event.bannerImagePublicId;
      await deleteImageFromClodinary(publicId)
      updates.bannerImage=req.file.path
      updates.bannerImagePublicId=req.file.filename
    }

    if(updates.price && event.ticketSold>0){
        throw new ApiError(400, `You are not allowed to change price as ${event.ticketSold} tickets have already sold`);
    }

    if(updates.capacity  && updates.capacity<event.ticketSold){
      throw new ApiError(400, "Capacity can't be less than sold tickets");
    }
    
     const currDate = new Date();
    
    const checkStart = updates.startDate ? new Date(updates.startDate) : new Date(event.startDate);
    const checkEnd = updates.endDate ? new Date(updates.endDate) : new Date(event.endDate);

    if (updates.startDate && checkStart < currDate) {
        throw new ApiError(400, "Start date cannot be in the past");
    }
    
    if (checkEnd <= checkStart) {
        throw new ApiError(400, "End date must be after the Start date");
    }
    
    const restrictedFields = ["_id", "organiserId", "ticketSold"];

    restrictedFields.forEach(feild => delete updates[feild])
   
    const updatedEvent=await Event.findByIdAndUpdate(eventId,
      {$set:updates},
      {
        new:true,
        runValidators:true
      }
    )
    
    res.status(200).json({ message:"Event details have been updated successfully",success: true, data: updatedEvent });
})

export const changeEventStatus=asyncHandler(async(req,res)=>{
    const eventId=req.params.eventId 
    
   if(!mongoose.Types.ObjectId.isValid(eventId)){
        throw new ApiError(400, "Invalid Event ID format");
    }
     
    const event=await Event.findById(eventId);
    
    if(!event){
      throw new ApiError(404,"Event not found")
    }

    const userId=req.user._id

    if(userId.toString()!== event.organiserId.toString()){
      throw new ApiError(400, "You are only allowed to update events created by you.");
    }

    const {status}=req.body

    if(!status){
      throw new ApiError(400, "Status is required");
    }
    
    const validStatuses = ["DRAFT", "PUBLISHED", "SOLD_OUT", "COMPLETED"];
     
    if(!validStatuses.includes(status.toUpperCase())){
      throw new ApiError(400, "Invalid status value");
    }

    if (status.toUpperCase() === "PUBLISHED") {
        if (!event.bannerImage) {
            throw new ApiError(400, "Cannot publish event without a banner image and location");
        }
    }
    
    if (event.status === "COMPLETED" && status.toUpperCase() !== "COMPLETED") {
        throw new ApiError(400, "Cannot change status of an event that has already ended.");
    }
    

    event.status=status.toUpperCase();
    await event.save()

   res.status(200).json({
        success: true,
        message: `Event status updated to ${event.status}`,
        data: { status: event.status,event }
   });
})

// add delete Event route