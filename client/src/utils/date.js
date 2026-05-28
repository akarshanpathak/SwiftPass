export const findDay=(date)=>{
    return new Date(date).toLocaleDateString("en-US",{weekday:"long"})
}
export const findDate=(date)=>{
   return new Date(date).getDate()
}
export const findMonth=(date)=>{
   return new Date(date).toLocaleString("en-us",{month:"long"})
}

export const findTime=(date)=>{
    const curr=new Date(date);
    const timeString=curr.toLocaleTimeString("en-US",{
        hour:"2-digit",
        minute:"2-digit",
        hour12:true
    })
    return timeString
}