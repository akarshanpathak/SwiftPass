import React, { useState } from "react";
import bgImage from "../assets/bgImage.jpg";
import {loginInstart,loginInSuccessFull,loginInFailed} from "../redux/userSlice"
import {useDispatch,useSelector} from "react-redux"
import {loginUser} from "../services/auth.service"
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
 function Login() {
  const [formData, setFormData] = useState({
  email: "",
  password: ""
  });
  const navigate=useNavigate()
  const currentUser=useSelector(state=>state.user)
  // console.log("currrentuser",currentUser);
  
  const dispatch=useDispatch();
  const handleOnChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value})
  }
  const handleSubmit=async(e)=>{
    e.preventDefault()
    try {

      console.log("Login start");
      console.log(formData);
      
      const data=await loginUser(formData)
      console.log("main log ",data.data.user);
      dispatch(loginInSuccessFull(data.data.user))
      toast.success(data.data.message)
      navigate("/")
              
    } catch (error) {
      dispatch(loginInFailed(data.data.message))
      console.log(error);
      
    }
  }
  // console.log(formData);
  return (
    <div>
      <div
        className="min-h-screen  w-full bg-center bg-cover bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="min-h-screen flex  justify-center items-center  w-full bg-black/50">
              <div className="bg-white w-[500px]">
                  <div className="m-6 flex flex-col gap-8"> 
                    <div><span className='text-green-700 font-extrabold  text-2xl'>SwiftPass</span></div>
                    <div className="text-4xl font-extrabold text-gray-800">
                        <h1>Welcome! </h1>
                        <h1>Enter your details</h1>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-8 ">
                      <div className="border border-gray-300 rounded-md px-2 flex flex-col gap-2">
                        <p className="text-sm text-gray-500">Email</p>
                        <input onChange={handleOnChange} id="email" className="outline-none mb-2 text-sm" type="email" />
                      </div>
                      <div className="border border-gray-300 rounded-md px-2 flex flex-col gap-2">
                        <p className="text-sm text-gray-500">Password</p>
                        <input onChange={handleOnChange} id="password" className="outline-none mb-2 text-sm bg-transparent" type="password" />
                      </div>
                      <button disabled={currentUser && currentUser.loading} type="submit" className="bg-green-700 text-white font-bold text-sm px-4  py-3 rounded-md">Login </button>
                    </form>
                    
                    <div className="mx-auto">
                      <p className="text-sm ">Don't have an account <span onClick={()=>(navigate("/register"))} className="hover:text-blue-900 text-blue-900 underline cursor-pointer">sign in</span></p>
                    </div>
                  </div>
              </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
