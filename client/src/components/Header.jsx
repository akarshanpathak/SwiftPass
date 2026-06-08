import React, { useState } from "react";
import {
  Search,
  Plus,
  Heart,
  TicketSlash,
  User,
  MapPin,
  Menu,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const currrentuser = getUser();
  // console.log("currrentuser from header" , currrentuser);

  const handleCreateEvent = ()=>{
    // console.log("clicking handle create event");
    navigate("/create-event")
  }

  const handleWishlist = () =>{
    navigate("/wishlist")
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm w-full">
      {/* MAIN NAVBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span
              onClick={() => (navigate("/"))}
              className="text-green-700 font-extrabold text-2xl tracking-tight cursor-pointer"
            >
              SwiftPass
            </span>
          </div>

          {/* Desktop Search - Visible from md (768px) up */}
          <div className="hidden md:flex flex-1 max-w-2xl items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 flex-1">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search events"
                className="outline-none w-full text-sm text-gray-700"
              />
            </div>
            <div className="h-6 w-px bg-gray-200 mx-1"></div>
            <div className="flex items-center gap-2 flex-1">
              <MapPin size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                className="outline-none w-full text-sm text-gray-700"
              />
            </div>
            <button className="bg-green-700 hover:bg-green-800 text-white rounded-full p-2 transition-colors">
              <Search size={16} />
            </button>
          </div>

          {/* Right Section: Actions & User */}
          <div className="flex items-center gap-2 lg:gap-6">
            {/* Desktop Actions - Visible from lg (1024px) up */}
            <nav className="hidden lg:flex items-center gap-6 text-gray-500">
              <Action onClick={handleCreateEvent} icon={<Plus size={20} />} label="Create" />
              <Action onClick={handleWishlist} icon={<Heart size={20} />} label="Wishlist" />
              <Action icon={<TicketSlash size={20} />} label="Tickets" />
            </nav>

            {/* Desktop User - Visible from lg up */}
            <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-gray-200">
              {currrentuser && (
                <>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Account</p>
                    <p className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                      {currrentuser && currrentuser.name}
                    </p>
                  </div>
                  <div onClick={()=>(navigate("/profile"))} className="h-9 w-9 rounded-full bg-green-50 flex items-center justify-center text-green-700 border border-green-100 cursor-pointer">
                    <User size={20} />
                  </div>
                </>
              )}
              {
                !currrentuser && (
                  <>
                      <button onClick={()=>(navigate("/login"))} className=" border-[1px] hover:bg-green-500 hover:border-green-500 duration-150 shadow-md shadow-green-200 border-green-700 px-6 p-2  text-sm rounded-xl font-semibold">Login</button>
                  </>
                )
              }
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE SEARCH BAR - Visible only on small screens */}
      <div className="md:hidden px-4 pb-4">
        <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-100 transition-all">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      {/* MOBILE OVERLAY MENU */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-[112px] md:top-16 left-0 w-full bg-white border-t border-gray-100 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col p-4 gap-4">
            <MobileNavItem onClick={handleCreateEvent} icon={<Plus />} label="Create Event" />
            <MobileNavItem onClick={handleWishlist} icon={<Heart />} label="Wishlist" />
            <MobileNavItem icon={<TicketSlash />} label="My Tickets" />
            <div className="h-px bg-gray-100 my-2" />
            <div onClick={()=>(navigate("/profile"))} className="flex items-center gap-3 p-2">
              <div className={`h-10 w-10 rounded-full ${!currrentuser && "hidden"} bg-gray-100 flex items-center justify-center`}>
                <User  size={20} className={`text-gray-500 `} />
              </div>
              <span className="text-sm font-medium text-gray-600 truncate">
                {
                !currrentuser && (
                  <>
                      <button onClick={()=>(navigate("/login"))} className=" border-[1px] hover:bg-green-500 hover:border-green-500 duration-150 shadow-md shadow-green-200 border-green-700 px-6 p-2  text-sm rounded-xl font-semibold">Login</button>
                  </>
                )
              }
                {currrentuser?.name}
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// Sub-components for cleaner code
const Action = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-0.5 cursor-pointer hover:text-green-700 transition-colors">
    {icon}
    <span className="text-[11px] font-bold uppercase tracking-wider">
      {label}
    </span>
  </button>
);

const MobileNavItem = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-700 font-medium">
    <span className="text-gray-400">{icon}</span>
    {label}
  </button>
);

export default Header;
