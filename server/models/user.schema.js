import mongoose, { Schema } from "mongoose";

const userSchema=new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["admin","organizer","attendee"],
        default:"attendee"
    },
    avatar:{
        type:String,
        default:"https://cdn.vectorstock.com/i/1000v/66/13/default-avatar-profile-icon-social-media-user-vector-49816613.jpg",
    },
    
},
    {
        timestamps:true
    }
)

const User=mongoose.model("User",userSchema)

export {User}



