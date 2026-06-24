import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { verifyEmail } from '../services/user.services';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const triggerVerification = async () => {
            try {
                const { data } = await verifyEmail(token);
                console.log("data from VerifyEmail " ,  data)
                if (data.success) {
                    setLoading(false);
                }
            } catch (err) {
                setError(err.response?.data?.message || "Verification failed");
                setLoading(false);
            }
        };
        triggerVerification();
    }, [token]);

    if (loading) return <div className="h-screen flex items-center justify-center">Verifying...</div>;

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
            <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center">
                {error ? (
                    <>
                        <h1 className="text-red-500 text-3xl font-bold mb-4">Oops!</h1>
                        <p className="text-gray-500 mb-6">{error}</p>
                        <button onClick={() => navigate('/login')} className="bg-gray-100 px-6 py-2 rounded-xl">Try Again</button>
                    </>
                ) : (
                    <>
                        <h1 className="text-green-500 text-3xl font-bold mb-4">Verified!</h1>
                        <p className="text-gray-500 mb-8">Your account is active. You can now book tickets and host events.</p>
                        <button onClick={() => navigate('/login')} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">Login to My Account</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;