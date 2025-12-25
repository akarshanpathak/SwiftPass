import {mongoose,Schema} from "mongoose";

const eventSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    bannerImage:{
        type:String,
        default:"https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZXZlbnR8ZW58MHx8MHx8fDA%3D"
    },
    bannerImagePublicId:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:["OFFLINE","ONLINE"],
        default:"OFFLINE"
    },
    location:{
        type:String,
        required:true,
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    price:{
        type:Number,
        required:true,
    },
    capacity:{
        type:Number,
        required:true
    },
    ticketSold:{
        type:Number,
        default:0,
        immutable:true
    },
    status:{
        type:String,
        enum:["DRAFT","PUBLISHED","SOLD_OUT","COMPLETED"],
        default:"DRAFT"
    },
    organiserId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
        immutable:true
    }
},
    {
        timestamps:true
    }
)

const Event=mongoose.model("Event",eventSchema);

export {Event}