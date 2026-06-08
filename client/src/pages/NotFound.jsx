// src/pages/NotFound.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center px-4">
      <div className="text-center">

        <div className="relative mb-6">
          <h1 className="text-[10rem] sm:text-[14rem] font-black text-green-100 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl px-8 py-4">
              <p className="text-2xl sm:text-3xl font-bold text-gray-800 font-poppins">
                Page Not Found
              </p>
            </div>
          </div>
        </div>

        <p className="text-gray-500 text-sm sm:text-base max-w-sm mx-auto mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-2xl shadow-lg hover:scale-105 hover:shadow-green-300 duration-300"
          >
            Go to Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-white/70 backdrop-blur-xl border border-white/40 text-gray-700 font-semibold rounded-2xl shadow-md hover:scale-105 duration-300"
          >
            Go Back
          </button>
        </div>

      </div>
    </div>
  );
}

export default NotFound;