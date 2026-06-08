import React, { use, useEffect, useState } from "react";
import { MapPin, ArrowRight,CalendarDays  ,ChevronDown,ChevronUp,LocateFixed,SquarePlay, Icon } from "lucide-react";
import {getCurrentLocation} from "../../services/user.services.js"
import {useDispatch,useSelector} from "react-redux"
import {setCurrentLocation} from "../../redux/userSlice.js"
import { act } from "react";
import { forYou, recentEvent, today } from "../../services/event.services.js";
import RecentEvent from "../RecentEvent.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const CityEventsSection = () => {
    const [openDialog,setOpenDialog]=useState(false);
    const [event,setEvent]=useState(null)
    const [city,setCity]=useState(null)
    const option=["All","For you","Today","This Weekend"]
    const [eventType,setEventType]=useState("currentLocation")
    const dispatch=useDispatch()
    const [activeTab,setActiveTab]=useState("All")
    const navigate=useNavigate()
    const eventToDisplay=async()=>{
      // console.log("in event to display");
      
      if(activeTab=="All"){
        const response=await recentEvent();
        setEvent(response.data.data);
        // console.log("event for all ",response.data.data);
        
      }
      else if (activeTab=="For you"){
         if(city){
          const response=await forYou(city.toLowerCase());
            //  console.log("event for you ",response.data.data);
             setEvent(response.data.data);
          }
      }
      else if(activeTab=="Today"){
        if(city){
          const response=await today(city.toLowerCase());
            //  console.log("this weekend events",response.data.events);
             setEvent(response.data.data);
        }
      }
      else if(activeTab == "This Weekend"){
        if(city){
            const response=await today(city.toLowerCase());
            // console.log("this weekend events",response.data.events);
            setEvent(response.data.data);
        }
      }
      
      // console.log("from cityevent",response.data.data);
    }
    const dialogOption=[
      {
        icon:LocateFixed,
        text:"Use my current location",
        fetch:"currentLocation"
      },
      {
        icon:SquarePlay,
        text:"Browse online events",
        fetch:"onlineEvent"
      },
      
    ]
    const getLocation = async () => {
      if (!navigator.geolocation) {
        toast.error("Geolocation not supported")
        // console.log("Geolocation not supported");
        return;
      }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
          if(pos.coords.latitude && pos.coords.longitude){
            const data=await getCurrentLocation(pos.coords.latitude,pos.coords.longitude)
            // console.log("data is : ",data);
            dispatch(setCurrentLocation(data.data.address.city))
            setCity(data.data.address.city) 
          }
        },
        (err) => {
          toast.error(err.message)
          // console.log("Error fetching location:", err.message);
        }
      ); 
    };
    useEffect(()=>{
      getLocation()
      
    },[])
    useEffect(()=>{
      if(event){
        // console.log(event);
      }
      eventToDisplay()
    },[activeTab,city])
    const setDialog=()=>{
      setOpenDialog((prev)=>!prev)
    }
    
  return (
    <div>
      <div className="mt-8 flex flex-col gap-6">
      
      <div className="h-[1px] bg-gray-300"></div>

      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:items-center sm:flex-row gap-2 ml-4">
          <span className="font-semibold text-gray-800 text-lg">Browsing events in</span>

          <div  className="relative cursor-pointer flex text-blue-600 ml-3">
            <button onClick={setDialog} className="font-bold flex items-center">
              {
                openDialog?<ChevronDown className="w-8 h-8" strokeWidth={3} />:<ChevronUp className="w-8 h-8" strokeWidth={3} />
              }
            </button>

            <input
              type="text"
              placeholder={`${city}....`}
              className="rounded-md px-3 font-semibold py-1 text-lg outline-none"
            />
            {
              openDialog && <div className="absolute top-10 bg-white">
                 {
                  dialogOption.map((val,idx)=>{
                    const Icon=val.icon;
                    return <div onClick={()=>{setEventType(val.fetch)}} key={idx} className="items-center  border-b-2 hover:bg-gray-100 font-semibold border-gray-200 w-full  px-6 py-8 h-[50px] flex gap-4">
                      <span><Icon/></span>
                      <span className=" text-sm text-gray-700">{val.text}</span>
                    </div>
                  })
                 }
              </div>
            }
          </div>
        </div>
      </div>

      <div className="h-[1px] bg-gray-300"></div>
    </div>
    <div className="flex justify-center items-center mt-2 ml-7" >
      <div className="max-w-7xl w-full">
        <ul className="flex gap-6 text-gray-500 text-sm font-semibold">
          {
            option.map((val,idx)=>(
              <div className={`${activeTab==val?"text-blue-700":""} cursor-pointer flex flex-col gap-4 hover:text-gray-900`} key={idx} >
                <li onClick={()=>{setActiveTab(val)}} className={`  ${activeTab==val?"border-blue-700 text-blue-700 border-b-2 hover:border-blue-700":"hover:border-gray-900 hover:text-gray-900 hover:border-b-2"} pb-4`} >
                  {val}
                </li>
                
              </div>
            ))
          }
      </ul>
      </div>
    </div>
    <div className="flex items-center justify-center mt-4 ml-7">
        <div className="w-full max-w-7xl flex gap-10 flex-wrap">
          {
            event?event && event.map((eve,idx)=>{
                return <div  key={idx}>
                      <RecentEvent data={eve}/>
                </div>
              })
              :
              <div className="flex w-full  justify-center h-80 items-center">
                <div className="flex flex-col gap-4 items-center justify-center">
                  <span>
                    <CalendarDays strokeWidth={0.7} size={80}/>
                  </span>
                   <div className="flex flex-col justify-center items-center gap-1" >
                    <span className="font- text-lg font-semibold text-gray-800">
                     {
                      activeTab==="For you"?"No Event in Your Area":"Event not found"
                     } 
                   </span>
                   <span className="text-sm text-gray-600 font-semibold">
                     {
                      activeTab==="For you"?"Try Different Location":""
                     } 
                   </span>
                   </div>
                 </div>
              </div>
          }
            {
              
            }
        </div>
    </div>
    </div>
  );
};

export default CityEventsSection;

// return (
//         <div className="py-20 bg-white">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex justify-between items-center mb-12">
//                     <div>
//                         <h2 className="text-3xl font-bold text-gray-900">
//                             Popular <span className="text-green-700">Destinations</span>
//                         </h2>
//                         <p className="mt-2 text-gray-500">Explore events happening in top cities around the world.</p>
//                     </div>
//                     <button className="hidden md:flex items-center gap-2 font-semibold text-green-700 hover:text-green-800 transition-colors">
//                         View all cities <ArrowRight className="w-5 h-5" />
//                     </button>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                     {cities.map((city, index) => (
//                         <div
//                             key={index}
//                             className="relative group overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer shadow-md"
//                         >
//                             <img
//                                 src={city.image}
//                                 alt={city.name}
//                                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                             />
//                             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

//                             <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
//                                 <div className="flex items-center gap-2 text-green-400 mb-2">
//                                     <MapPin className="w-4 h-4" />
//                                     <span className="text-sm font-medium tracking-wide">TRENDING</span>
//                                 </div>
//                                 <h3 className="text-2xl font-bold text-white mb-1">{city.name}</h3>
//                                 <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">{city.events}</p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
