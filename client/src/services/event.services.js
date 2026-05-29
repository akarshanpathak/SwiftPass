import { api } from "./api"
export const fetchEvents = async () => {
    return api.get("/event/getAllEvent")
}

export const createEvent = async (formData) => {
    const submitFormData = new FormData();

    submitFormData.append("title", formData.title);
    submitFormData.append("description", formData.description);
    submitFormData.append("type", formData.type);
    submitFormData.append("platform", formData.platform);
    submitFormData.append("meetingLink", formData.meetingLink);

    submitFormData.append("startDate", formData.startDate);
    submitFormData.append("endDate", formData.endDate);

    // submitFormData.append("startTime", formData.startTime);
    // submitFormData.append("endTime", formData.endTime);

    if(formData.price === ""){
        submitFormData.append("price", 0);
    }
    else{
        submitFormData.append("price", formData.price);
    }

   

    submitFormData.append("capacity", formData.capacity);

    submitFormData.append("location", formData.location);
    submitFormData.append("city", formData.city);

    submitFormData.append(
        "coordinates",
        JSON.stringify(formData.coordinates)
    );

    submitFormData.append(
        "bannerImage",
        formData.bannerImage
    );

    submitFormData.append("category" , formData.category)
    return api.post("/event/createEvent", submitFormData)
}

export const eventForCurrentLocation = async (location) => {
    return api.get(`/event/getAllForLocation?location=${location}`)
}

export const onlineEvent = async () => {
    return api.get("/event/onlineEvent")
}

export const recentEvent = async () => {
    return api.get("/event/recentEvent")
}

export const forYou = async (location) => {
    return api.get(`/event/getAllForLocation?location=${location}`)
}

export const today = async (location) => {
    return api.get(`/event/todaysEvent?location=${location}`)
}

export const thisWeekend = async (location) => {
    return api.get(`/event/thisWeekend?location=${location}`)
}

export const getEventById = async (id) => {
    return await api.get(`/event/getEventById/${id}`)
}

export const searchLocationForSuggesstion = async (query) => {
    return await api.get(`/event/searchLocation?query=${query}`)
}

export const totalNumberOfEventOrganisedByUser = () =>{
    return api.get("/event/totalNumberOfEventOrganisedByUser")
}

