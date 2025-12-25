import { v2 as cloudinary } from "cloudinary";
import  multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary"
import dotenv from "dotenv"
dotenv.config()

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'swiftpass_events',
        allowed_format:[ 'jpg' , 'png' , 'jpeg' , 'webp']
    },
});

export const deleteImageFromCloudinary=async (publicId)=>{
    try {
        await cloudinary.uploader.destroy(publicId)

        console.log("Previous Image deleted>>");
        
    } catch (error) {
        console.log("Deletion failed ",error);
        
    }
}

export const upload=multer({storage:storage})