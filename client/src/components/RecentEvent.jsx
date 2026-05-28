import React from "react";
import {findDate,findDay,findMonth,findTime} from "../utils/date"
import { useNavigate } from "react-router-dom";
function RecentEvent({ data }) {
  if (!data) return null;
  const navigate=useNavigate()
  return (
    <div onClick={()=>(navigate(`/eventDetails/${data._id}`,{state:data}) )} className="w-full max-w-7xl ">
      <div className=" w-64 md:w-80 rounded-xl overflow-hidden hover:shadow-xl transition-transform duration-150">
        
        {/* Image */}
        <div className="aspect-[16/9] overflow-hidden cursor-pointer">
          <img
            src={data.bannerImage}
            alt={data.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col">
          <span className="bg-red-100 w-max text-xs font-semibold rounded-xl p-2 ">Allmost full</span>
          <span className="mt-4 cursor-pointer font-semibold text-lg line-clamp-3">
            {data.title}
          </span>
          <span className="flex text-xs font-semibold ">
            {
              findDay(data.startDate)
            },{" "}
            {
              findMonth(data.startDate)
            }{" "}
            {
              findDate(data.startDate)
            }
            {" "}<span className=""><li className="ml-6"></li></span>
            {
              findTime(data.startDate)
            }
            
          </span>
          <span className="font-semibold ">
            {data.price==0?"Free":`\u20B9 ${data.price}`}
          </span>
          
        </div>

      </div>
    </div>
  );
}

export default RecentEvent;
