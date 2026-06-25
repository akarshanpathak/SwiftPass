import React, { useState } from 'react'
import { getUser } from '../utils/auth'

import {
  FaTicketAlt,
  FaHeart,
  FaCalendarAlt,
  FaFacebook,
  FaUsers,
  FaSignOutAlt,
  FaInstagram,
  FaTwitter,
  FaLinkedin
} from "react-icons/fa";
import { Ticket , User } from 'lucide-react';
import Followers from '../components/Followers';
import MyEvents from '../components/MyEvents';
import Tickets from '../components/Tickets';
import { useDispatch } from 'react-redux';
import { logOutUser } from '../redux/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout, totalFollowerFollowingCount  } from '../services/user.services';
import { useEffect } from 'react';
import { totalNumberOfEventOrganisedByUser } from '../services/event.services';
import Wishlist from '../components/Wishlist';
import Following from '../components/Following';
import toast from 'react-hot-toast';


function Profile() {
  const location = useLocation()
  const currrentuser = getUser();
  const [tab, setTab] = useState(location.state?.tab ||  "profile");
  const [followerCount , setFollowerCount] = useState(0);
  const [followingCount , setFollowingCount] = useState(0);
  const [eventCount , setEventCount] = useState(0);

  const dispatch = useDispatch()
  const navigate = useNavigate()


  if (!currrentuser) {
    return null;
  }

  // fecth follower/following length

  useEffect(()=>{
    const fetchFollowerFollowingLength = async ()=>{
      try {
        const response = await totalFollowerFollowingCount()
        const data = response.data;

        if(data.success){
          setFollowerCount(data.followersCount)
          setFollowingCount(data.followingCount)
        }
        // console.log("Profile" , response.datafollowingCount );
      } catch (error) {
        console.log("Error from profile useeffec " , error);
        
      }
      
    }

    if(currrentuser){
      fetchFollowerFollowingLength()
    }
  } , [currrentuser])

  // fetch total number of event hosted by user

  useEffect(()=>{
    const fetchNumberOfEvent = async ()=>{
      try {
        const response = await totalNumberOfEventOrganisedByUser()
        const data = response.data;
        // console.log("data from totalNumberOfEventOrganisedByUser " , data);
        setEventCount(data.eventCount)
        
      } catch (error) {
        console.log("Error from useeffect total number of event hosted by user " , error);
      }
    }

    if(currrentuser){
      fetchNumberOfEvent()
    }
  } , [currrentuser])

  const handleLogout = async () =>{
    try {
      const res = await logout()

      if(res.data.success){
        dispatch(logOutUser())
        navigate("/")
      }
      
    } catch (error) {
      toast.error(error.message)
      console.error(error)
    }
    
  }


  return (

    <div className='w-full flex flex-col md:flex-row min-h-screen'>

      <div className='w-full md:w-56 border-b md:border-b-0 md:border-r border-gray-200'>

        <div className='flex md:flex-col flex-row md:w-48 w-full text-gray-700 font-poppins overflow-x-auto'>

          <div onClick={() =>(setTab("profile"))} className='cursor-pointer hover:bg-gray-100 duration-200 md:w-full min-w-[140px] h-16 flex items-center justify-between px-4 rounded-xl'>
            <p>Profile</p>
            <User className="text-lg" />
          </div>

          <div onClick={() =>(setTab("Tickets"))} className='cursor-pointer hover:bg-gray-100 duration-200 md:w-full min-w-[140px] h-16 flex items-center justify-between px-4 rounded-xl'>
            <p>Tickets</p>
            <FaTicketAlt className="text-lg" />
          </div>

          <div onClick={() =>(setTab("MyEvents"))} className='cursor-pointer hover:bg-gray-100 duration-200 md:w-full min-w-[140px] h-16 flex items-center justify-between px-4 rounded-xl'>
            <p>My Events</p>
            <FaCalendarAlt className="text-lg" />
          </div>

          <div onClick={() =>(setTab("Followers"))} className='cursor-pointer hover:bg-gray-100 duration-200 md:w-full min-w-[140px] h-16 flex items-center justify-between px-4 rounded-xl'>
            <p>Followers</p>
            <FaUsers className="text-lg" />
          </div>

          <div onClick={() =>(setTab("Following"))} className='cursor-pointer hover:bg-gray-100 duration-200 md:w-full min-w-[140px] h-16 flex items-center justify-between px-4 rounded-xl'>
            <p>Following</p>
            <FaUsers className="text-lg" />
          </div>

          <div onClick={handleLogout} className='cursor-pointer hover:bg-gray-100 duration-200 md:w-full min-w-[140px] h-16 flex items-center justify-between px-4 rounded-xl'>
            <p>Logout</p>
            <FaSignOutAlt className="text-lg" />
          </div>

        </div>

      </div>

      {
        tab === "Tickets" && <Tickets />
      }
      {
        tab === "Followers" && <Followers />
      }
      {
        tab === "Following" && <Following />
      }
      {
        tab === "MyEvents" && <MyEvents /> 
      }
      {
        tab === "profile" && <div className='w-full flex-1 p-4 sm:p-6 md:p-10 bg-gradient-to-br from-green-50 via-white to-green-100 min-h-screen'>

          <div className='bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 p-6 sm:p-10'>

            <div className='flex flex-col xl:flex-row gap-12 items-center xl:items-start'>

              {/* LEFT */}
              <div className='flex flex-col md:flex-row gap-10 items-center'>

                <div className='relative group'>

                  <div className='absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur-xl opacity-40 group-hover:opacity-70 duration-300'></div>

                  <div className='relative w-44 h-44 sm:w-56 sm:h-56 rounded-full overflow-hidden border-[5px] border-white shadow-2xl'>

                    <img
                      className='w-full h-full object-cover group-hover:scale-110 duration-500'
                      src={currrentuser.avatar}
                      alt=""
                    />

                  </div>

                </div>

                <div className='flex flex-col gap-7'>

                  {/* Name */}
                  <div className='text-center md:text-left'>

                    <h1 className='text-3xl sm:text-4xl font-bold text-gray-800 font-poppins tracking-wide'>
                      {currrentuser.name.charAt(0).toUpperCase() + currrentuser.name.slice(1)}
                    </h1>

                    <p className='text-gray-500 mt-2 text-sm sm:text-base'>
                      Event Organizer • Community Builder
                    </p>

                  </div>

                  <div className='flex gap-4 sm:gap-6 flex-wrap justify-center md:justify-start'>

                    <div className='bg-white shadow-md rounded-2xl px-6 py-4 text-center min-w-[110px] hover:-translate-y-1 duration-300'>

                      <p className='text-2xl font-bold text-green-600'>{eventCount || 0}</p>

                      <p className='text-gray-500 text-sm mt-1'>
                        Events
                      </p>

                    </div>

                    <div className='bg-white shadow-md rounded-2xl px-6 py-4 text-center min-w-[110px] hover:-translate-y-1 duration-300'>

                      <p className='text-2xl font-bold text-green-600'>{followerCount}</p>

                      <p className='text-gray-500 text-sm mt-1'>
                        Followers
                      </p>

                    </div>

                    <div className='bg-white shadow-md rounded-2xl px-6 py-4 text-center min-w-[110px] hover:-translate-y-1 duration-300'>

                      <p className='text-2xl font-bold text-green-600'>{followingCount}</p>

                      <p className='text-gray-500 text-sm mt-1'>
                        Following
                      </p>

                    </div>

                  </div>

                  <div className='flex justify-center md:justify-start'>

                    <button className='px-7 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-green-300 duration-300'>

                      Update Details

                    </button>

                  </div>

                </div>

              </div>

              <div className='flex flex-col items-center xl:items-end gap-6 xl:ml-auto'>

                <div className='bg-white shadow-md rounded-2xl px-6 py-4'>

                  <p className='text-gray-500 text-sm mb-4 text-center'>
                    Connect With Me
                  </p>

                  <div className='flex gap-5 text-2xl text-gray-700'>

                    <FaFacebook className="cursor-pointer hover:scale-125 hover:text-green-600 duration-300" />

                    <FaInstagram className="cursor-pointer hover:scale-125 hover:text-green-600 duration-300" />

                    <FaTwitter className="cursor-pointer hover:scale-125 hover:text-green-600 duration-300" />

                    <FaLinkedin className="cursor-pointer hover:scale-125 hover:text-green-600 duration-300" />

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      }

    </div>
  )
}

export default Profile

