import { api } from "./api";
export const getCurrentLocation=(lat,lng)=>{
    return api.get(`/user/getCurrentLocation/?lat=${lat}&lng=${lng}`)
}

export const updateWishlist = (eventId)=>{
    return api.post(`/user/updateWishlist/${eventId}`)
}