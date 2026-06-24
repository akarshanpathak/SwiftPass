import { api } from "./api";
export const getCurrentLocation=(lat,lng)=>{
    return api.get(`/user/getCurrentLocation/?lat=${lat}&lng=${lng}`)
}

export const updateWishlist = (eventId)=>{
    return api.post(`/user/updateWishlist/${eventId}`)
}

export const updateFollowers = (userId) =>{
    return api.post(`/user/updateFollowers/${userId}`)
}

export const updateFollowing = (userId) =>{
    return api.post(`/user/updateFollowing/${userId}`)
}

export const isFollowing = (userId) =>{
    return api.get(`/user/isFollowing/${userId}`)
}

export const isInWishList = (eventId) =>{
    return api.get(`/user/isInWishList/${eventId}`)
}

export const totalFollowerFollowingCount = () =>{
    return api.get("/user/totalFollowerFollowingCount")
}

export const getUserWishlist = () => {
    return api.get("/user/getUserWishlist")
}

export const getFollowers = () =>{
    return api.get("/user/getFollowers")
}

export const getFollowing = () =>{
    return api.get("/user/getFollowing")
}

export const verifyEmail = (token) =>{
    return api.get(`/user/verifyEmail/${token}`)
}

export const resendVerificationEmail = (email) =>{
    // console.log("email from resendVerificationEmail " , email)
    return api.post("/user/resendVerification" , {email})
}