import asyncHandler from "../utils/asyncHandler.js"
import mongoose from "mongoose"
import { Event } from "../models/event.schema.js"
import ApiError from "../utils/ApiError.js"
import Razorpay from "razorpay"
import dotenv from "dotenv"
import crypto from "crypto"; // Built-in Node.js module
import { Ticket } from "../models/ticket.schema.js";
import { log } from "console"
// import { log } from "console"


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


export const verifyPayment = asyncHandler(async (req, res) => {
    const { 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature, 
        eventId 
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
        throw new ApiError(400, "Payment verification failed. Signature mismatch.");
    }

    const event = await Event.findById(eventId);

    if (!event) {
        throw new ApiError(404, "Event not found during ticket generation");
    }

    const uniqueTicketId = `SP-${new Date().getFullYear()}-${crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase()}`;
    console.log("Logs");
    
    console.log(" 1 " + eventId);
    console.log(" 2 " + req.user._id);
    console.log(" 3 " + uniqueTicketId);
    console.log(" 4 " + razorpay_payment_id);
    console.log(" 5 " + event.price);
    
    console.log("Logs");
    
    
    
    
    const ticket = await Ticket.create({
        event: eventId,
        attendee: req.user._id,
        ticketId: uniqueTicketId,
        paymentIntentId: razorpay_payment_id,
        pricePaid: event.price,
        status: "VALID"
    });

    event.ticketSold += 1;

    if (event.ticketSold >= event.capacity) {
        event.status = "SOLD_OUT";
    }

    await event.save({ validateBeforeSave: false });

    res.status(201).json({
        success: true,
        message: "Payment verified and ticket generated successfully",
        data: ticket
    });
});
