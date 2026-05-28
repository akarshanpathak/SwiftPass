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
  // console.log(categories);

  return (
    <div className="overflow-scroll md:overflow-auto max-w-7xl mx-auto flex justify-around mt-8 items-center">
      {categories.map((category, idx) => {
        const Icon = category.icon;
        return (
          <div
            className="flex mx-4 items-center justify-center gap-3 cursor-pointer shrink-0 flex-col"
            key={idx}
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
// categories.map((category,idx)=>(
//                     <div key={idx}>
//                         <div className="flex flex-col gap-4 rounded-full border border-gray-500 ">
//                             {category.icon}
//                         </div>
//                         <span>
//                             {category.name}
//                         </span>
//                     </div>
//                 ))

// return (
//         <div className="py-24 bg-gray-50">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <h2 className="text-4xl font-extrabold text-gray-900 mb-16 text-center">
//                     Browse by <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Category</span>
//                 </h2>

//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//                     {categories.map((cat, index) => (
//                         <div
//                             key={index}
//                             className="group relative h-48 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
//                         >
//                             {/* Background Image */}
//                             <img
//                                 src={cat.image}
//                                 alt={cat.name}
//                                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                             />

//                             {/* Overlay */}
//                             <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-80 mix-blend-multiply group-hover:opacity-90 transition-opacity duration-300`}></div>

//                             {/* Content */}
//                             <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white">
//                                 <div className="bg-white/20 backdrop-blur-md p-4 rounded-full mb-3 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
//                                     <cat.icon className="w-8 h-8" />
//                                 </div>
//                                 <h3 className="text-xl font-bold tracking-wide group-hover:tracking-wider transition-all duration-300">{cat.name}</h3>
//                                 <span className="mt-2 text-xs font-medium uppercase tracking-widest opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
//                                     Explore
//                                 </span>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
