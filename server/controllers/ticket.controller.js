import asyncHandler from "../utils/asyncHandler.js";
import { Ticket } from "../models/ticket.schema.js";
import mongoose  from "mongoose";
import ApiError from "../utils/ApiError.js";

export const getAllticketOfuser = asyncHandler(async (req , res , next) =>{
    const userId = req.user._id;

    const userTickets = await Ticket.find({attendee : userId}).populate("event")

    console.log(userTickets.length);

    if(userTickets.length === 0){
        return res.status(200).json({message : "No Ticket found" , success : true , userTickets : []})
    }
    
    
    return res.json({message : "Tickets found successfully" , userTickets , success : true})
})

export const getTicketById = asyncHandler(async (req , res , next) =>{
    const {ticketId} = req.params;

    if(!mongoose.Types.ObjectId.isValid(ticketId)){
        throw new ApiError(400 , "Id is not valid")
    }
    
    const ticket = await Ticket.findById(ticketId);

    if(!ticket){
        throw new ApiError(404 , "Ticket not found")
    }
    
    return  res.status(200).json({success : true , message : "Ticket found Successfully" , ticket})
})