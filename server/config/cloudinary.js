import { v2 as clodinary } from "cloudinary";
import  multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary"
import dotenv from "dotenv"
dotenv.config()

clodinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const storage=new CloudinaryStorage({
    cloudinary:clodinary,
    params:{
        folder:'swiftpass_events',
        allowed_format:[ 'jpg' , 'png' , 'jpeg' , 'webp']
    },
});

export const upload=multer({storage:storage})