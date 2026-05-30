import { api } from "./api";
import toast from "react-hot-toast";


export const createOrder=async (eventId)=>{
    return api.post(`/payments/createOrders/${eventId}`)
}

export const verifyPayment = async (res, event) => {
    try {
        console.log("verifying payment");
        console.log(res);
        console.log(event._id);
        
        
        const { data } = await api.post("/payments/verify", {
            ...res,
            eventId: event._id
        });

        return data; 

    } catch (error) {
        console.log(error.message);
        console.log(error);
        
        throw error; 
    }
}