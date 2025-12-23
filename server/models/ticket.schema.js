import mongoose,{Schema} from "mongoose";

const ticketSchema=new Schema({
    event:{
        type:Schema.Types.ObjectId,
        ref:"Event",
        required:true
    },
    attendee:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    ticketId:{
        type:String,
        required:true,
        unique:true
    },
    status:{
        type:String,
        enum: ["VALID", "USED", "CANCELLED", "REFUNDED"],
        default:"VALID", 
    },
    scannedAt:{
        type:Date,
        default:null
    },
    paymentIntentId:{
        type:String,
        required:true,
        unique:true
    },
    pricePaid:{
        type:Number,
        required:true
    },
    pdfUrl:{
        type:String
    }
},  {
        timestamps:true
    }
)

const Ticket=mongoose.model("Ticket",ticketSchema)

export {Ticket}

