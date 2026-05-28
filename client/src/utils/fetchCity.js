export const fetchCity=async(lat,lng)=>{
    console.log("in fetch city ");
    const res=await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
    const data=await res.json()
    return data
}