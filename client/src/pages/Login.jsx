import React, { useState } from "react";
import bgImage from "../assets/bgImage.jpg";
import { loginInstart, loginInSuccessFull, loginInFailed } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../services/auth.service";
import {resendVerificationEmail} from "../services/user.services"
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [showResend, setShowResend] = useState(false); 
  const [resending, setResending] = useState(false);  

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (showResend) setShowResend(false); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("in login page")
      dispatch(loginInstart());
      const res = await loginUser(formData);
      // console.log( "after login", res.data)
      dispatch(loginInSuccessFull(res.data));
      toast.success(res.data.message || "Login Successful");
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      dispatch(loginInFailed(errorMessage));
      toast.error(errorMessage);

      if (errorMessage.toLowerCase().includes("verify") || error.response?.status === 401) {
        setShowResend(true);
      }
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      await resendVerificationEmail(formData.email);
      toast.success("Verification link sent to your email!");
      setShowResend(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend email");
    } finally {
      setResending(false);
    }
  };

  return (
    <div>
      <div
        className="min-h-screen w-full bg-center bg-cover bg-no-repeat flex items-center justify-center font-poppins"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="min-h-screen flex justify-center items-center w-full bg-black/50 p-4">
          <div className="bg-white w-full max-w-[500px] rounded-2xl shadow-2xl overflow-hidden">
            <div className="m-8 flex flex-col gap-8">
              <div>
                <span className="text-green-700 font-extrabold text-2xl tracking-tighter">SwiftPass</span>
              </div>

              <div className="text-4xl font-extrabold text-gray-800">
                <h1>Welcome!</h1>
                <h1 className="text-gray-400 text-3xl">Enter your details</h1>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="border border-gray-300 rounded-xl px-4 py-2 flex flex-col gap-1 focus-within:border-green-700 transition-colors">
                  <p className="text-[10px] uppercase font-bold text-gray-400">Email</p>
                  <input
                    onChange={handleOnChange}
                    id="email"
                    required
                    className="outline-none mb-1 text-sm bg-transparent"
                    type="email"
                    placeholder="name@company.com"
                  />
                </div>

                <div className="border border-gray-300 rounded-xl px-4 py-2 flex flex-col gap-1 focus-within:border-green-700 transition-colors">
                  <p className="text-[10px] uppercase font-bold text-gray-400">Password</p>
                  <input
                    onChange={handleOnChange}
                    id="password"
                    required
                    className="outline-none mb-1 text-sm bg-transparent"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>

                <div className="relative flex justify-end">
                  <span onClick={()=>(navigate("/ForgotPassword"))} className="text-xs absolute bottom-0 text-blue-500 cursor-pointer hover:text-blue-700">Forgotten password</span>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    disabled={loading}
                    type="submit"
                    className="bg-green-700 text-white font-bold text-sm px-4 hover:bg-green-800 py-4 rounded-xl transition-all active:scale-[0.98] disabled:bg-gray-400"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>

                  {/* ✅ RESEND BUTTON: Only shows if user is not verified */}
                  {showResend && (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resending}
                      className="text-xs  text-orange-600 hover:text-orange-700 underline underline-offset-4 transition-all disabled:text-gray-400"
                    >
                      {resending ? "Sending link..." : "Email not verified? Resend verification link"}
                    </button>
                  )}
                </div>
              </form>

              <div className="mx-auto mt-2">
                <p className="text-sm text-gray-500">
                  Don't have an account?{" "}
                  <span
                    onClick={() => navigate("/register")}
                    className="hover:text-green-700 text-green-700 font-bold underline cursor-pointer"
                  >
                    Register
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;