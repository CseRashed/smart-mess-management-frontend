// src/pages/Unauthorized.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react'; // Modern icon

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-red-50 to-red-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="flex justify-center mb-5">
          <div className="bg-red-100 p-4 rounded-full">
            <ShieldAlert className="text-red-500 w-10 h-10" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-red-600 mb-3">Unauthorized Access</h1>
        <p className="text-gray-600 mb-6">
          Sorry, you don’t have permission to view this page.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
        >
          ⬅ Go Back Home
        </Link>
      </div>
    </div>
  );
}
