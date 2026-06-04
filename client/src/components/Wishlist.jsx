import React, { useEffect, useState } from 'react'
import { getUser } from '../utils/auth'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getUserWishlist } from '../services/user.services';

function Wishlist() {
  const currrentuser = getUser();
  const navigate  =useNavigate()
  const [wishlist , setWishlist] = useState([]);

  if(!currrentuser){
    toast.error("sign in see your wishlit")
    navigate("/login")
    return;
  }

  useEffect(()=>{
    const fetchWishlist = async ()=>{
      try {
        const response = await getUserWishlist();
        console.log("wishlist " , response.data.wishlist);
        setWishlist(response.data.wishlist)
      } catch (error) {
        toast.error(error.message)
        console.log(error);
        
      }
      
    }

    if(currrentuser){
      fetchWishlist()
    }
  } , [])
  return (
    <div>
      wishlist
    </div>
  )
}

export default Wishlist
