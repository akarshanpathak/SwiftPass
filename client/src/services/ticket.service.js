import { api } from "./api";

export const getAllTicketOfUser = () =>{
    return api.get("/ticket/getAllTicketOfUser")
}