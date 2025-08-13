// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-red-50 to-red-100 px-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 max-w-sm sm:max-w-md md:max-w-lg w-full text-center transform transition-all duration-700 hover:scale-105">
        {/* Icon */}
        <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
          <div className="bg-red-100 p-4 sm:p-5 md:p-6 rounded-full animate-spin-slow">
            <AlertCircle className="text-red-500 w-10 sm:w-12 md:w-14 h-10 sm:h-12 md:h-14" />
          </div>
        </div>

        {/* 404 Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-red-600 mb-2 sm:mb-3 md:mb-4 animate-bounceIn">
          404
        </h1>

        {/* Main message */}
        <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-2 sm:mb-3 md:mb-4 animate-fadeIn delay-200">
          Ooops! Page Not Found
        </p>

        {/* Additional description */}
        <p className="text-sm sm:text-base md:text-lg text-gray-500 mb-6 sm:mb-7 md:mb-8 max-w-xs sm:max-w-sm md:max-w-md mx-auto animate-fadeIn delay-400">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Go back home button */}
        <Link
          to="/"
          className="inline-block px-6 sm:px-8 py-2 sm:py-3 bg-red-500 text-white font-semibold rounded-lg shadow-lg hover:bg-red-600 transition transform hover:scale-105 animate-pulse text-sm sm:text-base"
        >
          ⬅ Go Back Home
        </Link>
      </div>
    </div>
  );
}
