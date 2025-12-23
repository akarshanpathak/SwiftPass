import { register,login } from "../services/user.services.js"
import ApiError from "../utils/ApiError.js"
import asyncHandler from "../utils/asyncHandler.js"


export const registerUser=asyncHandler(async (req,res)=>{
    
        const {name,email,password}=req.body

        if(!name || !email || !password){
            throw new ApiError(401,"All feilds are required")
        }

        const data=await register(name,email,password);

        return res.cookie("access-token",data.token,{httpOnly:true}).status(201).json({message:"Registration Successfull",data,success:true})
})

export const loginUser=asyncHandler(async (req,res,next)=>{
   
        const {email,password}=req.body
    
        if(!email || !password){
            console.log("All feilds are Required");
            throw new ApiError(401,"All feilds are required")
        }

        const user=await login(email,password) 

        res.cookie("access-token",user.token,{httpOnly:true}).status(201).json({message:"Login Successfull",user,success:true})

})