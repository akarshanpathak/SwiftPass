import  jwt  from "jsonwebtoken"
import {User} from "../models/user.schema.js"
import ApiError from "../utils/ApiError.js";

export const protect=async (req,res,next)=>{
    
    try {
        const token=req.cookies["accessToken"];
    
        if(!token){
            // console.log("not fouind")/
            // return res.status(401).json({message:,success:false})
            throw new ApiError(401 , "Not Authorised,No token")
        }
    
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
    
        const user=await User.findById(decoded.id).select("-password")
        req.user=user
        next();
    } catch (error) {
        console.log("Authorisation failed protect: ",error);
        
        return res.status(400).json({message:error.message,success:false})
    }
}


export const authoriseOrganizer=async(req,res,next)=>{
    console.log("in authoriseOrganizer server side");
    try {

       if(req.user && (req.user.role==="organizer" || req.user.role==="admin")){
            next();
       }
       else{
             console.log("in authoriseOrganizer server side else block");
            
            res.status(403).json({ message: "Only organizers can perform this action",success:false });
       }

    } catch (error) {
        console.log("Authorisation failed ! organizer: ",error);
        return res.status(400).json({message:error.message,success:false})
    }
}