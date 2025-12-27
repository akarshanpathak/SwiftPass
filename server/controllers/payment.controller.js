import asyncHandler from "../utils/asyncHandler.js"
import mongoose from "mongoose"
import { Event } from "../models/event.schema.js"
import ApiError from "../utils/ApiError.js"
import Razorpay from "razorpay"
import dotenv from "dotenv"

dotenv.config()

const razorpay=new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})

export const createRazorpayOrder=asyncHandler(async(req,res)=>{
    const eventId=req.params.eventId 
    
    if(!mongoose.Types.ObjectId.isValid(eventId)){
        throw new ApiError(400, "Invalid Event ID format");
    }
    
    const event=await Event.findById(eventId);
    
    if(!event){
      throw new ApiError(404,"Event not found")
    }

    if(event.ticketSold >= event.capacity  || event.status==="SOLD_OUT"){
        throw new ApiError(400,"Tickets are not Available")
    }

    const razorpayOptions={
        amount:Math.round(event.price*100),
        currency:"INR",
        receipt:`receipt_${Date.now()}_${req.user._id.toString().slice(-4)}`,
        notes:{
            eventId:event._id.toString(),
            userId:req.user._id.toString(),
            customerName:req.user.name
        }
    }

    const order=await razorpay.orders.create(razorpayOptions)

    if(!order){
         throw new ApiError(500, "Something went wrong while creating the Razorpay order");
    }

    res.status(200).json({
        success:true,
        message: "Order initiated successfully",
        order,
        key_id: process.env.RAZORPAY_KEY_ID 
    })
})