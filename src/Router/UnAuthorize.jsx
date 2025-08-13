// src/pages/Unauthorized.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-red-50 to-red-100 px-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center transform transition-all duration-700 hover:scale-105">
        <div className="flex justify-center mb-5">
          <div className="bg-red-100 p-5 rounded-full animate-bounce">
            <ShieldAlert className="text-red-500 w-12 h-12" />
          </div>
        </div>
        <h1 className="text-3xl font-extrabold text-red-600 mb-4 animate-slideIn">
          Unauthorized
        </h1>
        <p className="text-gray-600 mb-8 animate-slideIn delay-200">
          Sorry, you don’t have permission to view this page.
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-lg hover:bg-red-600 transition transform hover:scale-105 animate-pulse"
        >
          ⬅ Go Back Home
        </Link>
      </div>
    </div>
  );
}
