// import { formToJSON } from "axios";
import { api } from "./api";

export const registerUser=async(formData)=>{
    return api.post("/user/register",formData)
}

export const loginUser=async(formData)=>{
    return api.post("/user/login",formData)
}
