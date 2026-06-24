import React, { useState } from "react";
import bgImage from "../assets/bgImage.jpg";
import { registerUser } from "../services/auth.service";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react"; 

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await registerUser(formData);
      setLoading(false);
      
      setIsRegistered(true);
      toast.success("Verification email sent!");
    } catch (error) {
      setLoading(false);
      const errorMsg = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMsg);
    }
  };

  return (
    <div>
      <div
        className="min-h-screen w-full bg-center bg-cover bg-no-repeat flex items-center justify-center font-poppins"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="min-h-screen flex justify-center items-center w-full bg-black/50 p-4">
          <div className="bg-white w-full max-w-[500px] rounded-2xl shadow-2xl overflow-hidden transition-all">
            <div className="m-8 flex flex-col gap-8">
              {/* Logo */}
              <div>
                <span className="text-green-700 font-extrabold text-2xl tracking-tighter">
                  SwiftPass
                </span>
              </div>

              {!isRegistered ? (
                /* --- VIEW 1: REGISTRATION FORM --- */
                <>
                  <div className="text-4xl font-extrabold text-gray-800">
                    <h1>Welcome!</h1>
                    <h1 className="text-gray-400">Enter your details</h1>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="border border-gray-300 rounded-xl px-4 py-2 flex flex-col gap-1 focus-within:border-green-700 transition-colors">
                      <p className="text-[10px] uppercase font-bold text-gray-400">Name</p>
                      <input
                        id="name"
                        type="text"
                        required
                        disabled={loading}
                        onChange={handleOnChange}
                        className="outline-none mb-1 text-sm bg-transparent"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="border border-gray-300 rounded-xl px-4 py-2 flex flex-col gap-1 focus-within:border-green-700 transition-colors">
                      <p className="text-[10px] uppercase font-bold text-gray-400">Email</p>
                      <input
                        id="email"
                        type="email"
                        required
                        disabled={loading}
                        onChange={handleOnChange}
                        className="outline-none mb-1 text-sm bg-transparent"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="border border-gray-300 rounded-xl px-4 py-2 flex flex-col gap-1 focus-within:border-green-700 transition-colors">
                      <p className="text-[10px] uppercase font-bold text-gray-400">Password</p>
                      <input
                        id="password"
                        type="password"
                        required
                        disabled={loading}
                        onChange={handleOnChange}
                        className="outline-none mb-1 text-sm bg-transparent"
                        placeholder="••••••••"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-green-700 hover:bg-green-800 text-white font-bold text-sm px-4 py-4 rounded-xl transition-all active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg shadow-green-700/20"
                    >
                      {loading ? "Creating Account..." : "Register"}
                    </button>
                  </form>

                  <div className="mx-auto mt-2">
                    <p className="text-sm text-gray-500">
                      Already have an account?{" "}
                      <span
                        onClick={() => navigate("/login")}
                        className="hover:text-green-700 text-green-700 font-bold underline cursor-pointer"
                      >
                        Login
                      </span>
                    </p>
                  </div>
                </>
              ) : (
                /* --- VIEW 2: SUCCESS STATE (Check Email) --- */
                <div className="py-10 text-center flex flex-col items-center animate-in fade-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <Mail size={40} />
                  </div>
                  
                  <h1 className="text-3xl font-black text-gray-800 mb-4 tracking-tight">
                    Verify your Email
                  </h1>
                  
                  <p className="text-gray-500 mb-8 leading-relaxed">
                    We've sent a verification link to <br />
                    <span className="font-bold text-gray-800">{formData.email}</span>. <br />
                    Please check your inbox (and spam) to activate your account.
                  </p>

                  <div className="w-full space-y-4">
                    <button
                      onClick={() => navigate("/login")}
                      className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98]"
                    >
                      Continue to Login <ArrowRight size={18} />
                    </button>
                    
                    <p className="text-xs text-gray-400">
                      Didn't get an email? <button onClick={() => setIsRegistered(false)} className="underline hover:text-gray-600 font-medium">Try again</button>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;