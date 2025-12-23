import asyncHandler from "../utils/asyncHandler.js";
import { Event } from "../models/event.schema.js"
import ApiError  from "../utils/ApiError.js"

export const createEvent=asyncHandler(async(req,res,next)=>{
   
    const { title,description,type,location,startDate,endDate,price,capacity }= req.body

    if(!title || !description || ! location || !startDate || !endDate || !price || !capacity ){
        throw new ApiError(400,"Please Provide all required feilds");
    }

    if(!req.file){
        throw new ApiError(400,"Banner image is required")
    }
    
    console.log(req.file);
    

    if(price===undefined){
        throw new ApiError(400,"Price is required")
    }

    if (price < 0) {
        throw new ApiError(400, "Price cannot be negative");
    }   

    const now=new Date();
    const start=new Date(startDate)
    const end=new Date(endDate)

    if(end<=start){
        throw new ApiError(400,"End Date must be after Start Date");
    }

    if(start<now){
        throw new ApiError(400,"Start date can't be of past");
    }

    if(capacity<=0){
        throw new ApiError(400,"Capacity must be at least 1");
    }

    const newEvent=new Event({
        title,
        description,
        bannerImage:req.file.path,
        type,
        price,
        location,
        capacity,
        startDate,
        endDate,
        organiserId:req.user._id
    })

    await newEvent.save();

    res.status(201).json({message:"Event Created Successfully",success:true,newEvent})
})