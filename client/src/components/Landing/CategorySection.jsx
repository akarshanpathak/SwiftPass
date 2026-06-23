import React from "react";
import {
  MicVocal,
  Trophy,
  Palette,
  Utensils,
  Laptop,
  Tent,
  Camera,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CategorySection = () => {
  const categories = [
    {
      name: "Music",
      icon: MicVocal,
    },
    {
      name: "Sports",
      icon: Trophy,
    },
    {
      name: "Arts",
      icon: Palette,
    },
    {
      name: "Food",
      icon: Utensils,
    },
    {
      name: "Tech",
      icon: Laptop,
    },
    {
      name: "Outdoor",
      icon: Tent,
    },
    {
      name: "Workshops",
      icon: Camera,
    },
  ];
   
  const navigate = useNavigate()
  return (
    <div className="overflow-scroll md:overflow-auto max-w-7xl mx-auto flex justify-around mt-8 items-center">
      {categories.map((category, idx) => {
        const Icon = category.icon;
        return (
          <div
            className="flex mx-4 items-center justify-center gap-3 cursor-pointer shrink-0 flex-col"
            key={idx}
            onClick={()=>{
              navigate("/searchEvent" , {
                state:{
                  category : category.name
                }
              })
            }}
          >
              <div className="w-28 font-serif h-28 sm:mx-0 border flex text-md justify-center items-center hover:bg-green-200 duration-75 rounded-full font-extralight flex-col">
                <Icon strokeWidth={1} size={35} />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {category.name}
              </span>
          </div>
        );
      })}
    </div>
  );
};

export default CategorySection;
