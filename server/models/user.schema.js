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
        default:"https://img.magnific.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
    },
    wishlist :[
        {
            type : Schema.Types.ObjectId,
            ref : "Event"
        }
    ]
    
},
    {
        timestamps:true
    }
)

const User=mongoose.model("User",userSchema)

export {User}



