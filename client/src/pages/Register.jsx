import React, { useState } from "react";
import bgImage from "../assets/bgImage.jpg";
import { registerUser } from "../services/auth.service";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Register() {

  // ✅ FIX 1: initialize formData as an object (NOT undefined)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const navigate=useNavigate()

  const handleOnChange = (e) => {
    setFormData({
      ...formData,             
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();        
    try {
        setLoading(true);
        const data = await registerUser(formData);
        console.log(data.data.data.userResponse);
        setLoading(false)
        toast.success("Registration successfull")
        navigate("/login")
    } catch (error) {
        setError(error.message)
        setLoading(false);
        toast.error("Something went wrong")
    }
    
  };

  return (
    <div>
      <div
        className="min-h-screen w-full bg-center bg-cover bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="min-h-screen flex justify-center items-center w-full bg-black/50">
          <div className="bg-white w-[500px]">
            <div className="m-6 flex flex-col gap-8">

              <div>
                <span className="text-green-700 font-extrabold text-2xl">
                  SwiftPass
                </span>
              </div>

              <div className="text-4xl font-extrabold text-gray-800">
                <h1>Welcome!</h1>
                <h1>Enter your details</h1>
              </div>

              {/* form submission */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">

                <div className="border border-gray-300 rounded-md px-2 flex flex-col gap-2">
                  <p className="text-sm text-gray-500">Name</p>
                  <input
                    id="name"
                    type="text"
                    required
                    onChange={handleOnChange}
                    className="outline-none mb-2 text-sm"
                  />
                </div>

                <div className="border border-gray-300 rounded-md px-2 flex flex-col gap-2">
                  <p className="text-sm text-gray-500">Email</p>
                  <input
                    id="email"
                    type="email"
                    required
                    onChange={handleOnChange}
                    className="outline-none mb-2 text-sm"
                  />
                </div>

                <div className="border border-gray-300 rounded-md px-2 flex flex-col gap-2">
                  <p className="text-sm text-gray-500">Password</p>
                  <input
                    id="password"
                    type="password"
                    required
                    onChange={handleOnChange}
                    className="outline-none mb-2 text-sm bg-transparent"
                  />
                </div>

                <button
                 
                  type="submit"
                  className="bg-green-700 hover:bg-green-900 text-white font-bold text-sm px-4 py-3 rounded-md transition-colors"
                >
                  Register
                </button>

              </form>

              <div className="mx-auto">
                <p className="text-sm ">Already have an account <span onClick={()=>(navigate("/login"))} className="hover:text-blue-900 text-blue-900 underline cursor-pointer">Login</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
