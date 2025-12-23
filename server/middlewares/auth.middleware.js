import  jwt  from "jsonwebtoken"
import {User} from "../models/user.schema.js"

export const protect=async (req,res,next)=>{

    try {
        const token=req.cookies["access-token"];
    
        if(!token){
            return res.status(401).json({message:"Not Authorised,No token",success:false})
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
    try {

       if(req.user && (req.user.role==="organizer" || req.user.role==="admin")){
            next();
       }
       else{
            res.status(403).json({ message: "Only organizers can perform this action",success:false });
       }

    } catch (error) {
        console.log("Authorisation failed ! organizer: ",error);
        return res.status(400).json({message:error.message,success:false})
    }
}