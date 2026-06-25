import React, { useState, useRef, useEffect } from 'react';
import { Mail, Lock, ArrowLeft, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { resetPassword, sendOtp } from '../services/user.services';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const inputRefs = useRef([]); 

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // console.log("sending start")
            const res = await sendOtp(email)
            toast.success("OTP sent to your email!");
            setStep(2);
            // console.log("sending staendrt")
        } catch (error) {
            // console.log(error)
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        const finalOtp = otp.join("");
        if (finalOtp.length < 6) return toast.error("Please enter full OTP");

        setLoading(true);
        try {
            const res = await resetPassword(email , password , finalOtp)
            toast.success("Password reset successful!");
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid OTP or request failed");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        if (element.value !== "" && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-poppins">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8 overflow-hidden transition-all duration-500">
                
                <button onClick={() => step === 1 ? navigate('/login') : setStep(1)} className="text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-2 text-sm font-medium">
                    <ArrowLeft size={16} /> Back
                </button>

                {step === 1 ? (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                        <h1 className="text-2xl font-black text-gray-800 mb-2">Forgot Password?</h1>
                        <p className="text-gray-500 mb-8 text-sm">Enter your email and we'll send you an OTP to reset your password.</p>

                        <form onSubmit={handleSendOTP} className="space-y-6">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input 
                                    type="email" 
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-green-500 transition-all text-sm"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <button 
                                disabled={loading}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:bg-gray-400"
                            >
                                {loading ? "Sending..." : "Send OTP"}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-indigo-100 text-green-600 rounded-2xl flex items-center justify-center">
                                <ShieldCheck size={28} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Security Check</h1>
                                <p className="text-xs text-gray-500 italic truncate w-48">Sent to: {email}</p>
                            </div>
                        </div>

                        <form onSubmit={handleResetPassword} className="space-y-8">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-3 block">Enter 6-Digit OTP</label>
                                <div className="flex justify-between gap-2">
                                    {otp.map((data, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            maxLength="1"
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            value={data}
                                            onChange={(e) => handleOtpChange(e.target, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            className="w-12 h-14 text-center text-xl font-bold bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-green-500 focus:bg-white transition-all"
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-bold text-gray-400 uppercase block">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        required
                                        className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-green-500 transition-all text-sm font-bold tracking-widest"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button 
                                disabled={loading}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:bg-gray-400"
                            >
                                {loading ? "Updating..." : "Reset Password"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;