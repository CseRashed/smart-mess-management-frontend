import React from "react";

export default function Loader() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-transparent">
      <div className="relative w-32 h-32">
        {/* Chasing balls */}
        <div className="absolute w-8 h-8 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-full animate-chase1 "></div>
        <div className="absolute w-8 h-8 bg-gradient-to-tr from-pink-400 to-red-500 rounded-full animate-chase2 "></div>
        <div className="absolute w-8 h-8 bg-gradient-to-tr from-green-400 to-yellow-400 rounded-full animate-chase3 "></div>
      </div>

      <style>
        {`
          @keyframes chase1 {
            0% { transform: rotate(0deg) translateX(60px) scale(1); }
            25% { transform: rotate(90deg) translateX(60px) scale(1.2); }
            50% { transform: rotate(180deg) translateX(60px) scale(0.9); }
            75% { transform: rotate(270deg) translateX(60px) scale(1.1); }
            100% { transform: rotate(360deg) translateX(60px) scale(1); }
          }
          @keyframes chase2 {
            0% { transform: rotate(120deg) translateX(60px) scale(1); }
            25% { transform: rotate(210deg) translateX(60px) scale(1.2); }
            50% { transform: rotate(300deg) translateX(60px) scale(0.9); }
            75% { transform: rotate(30deg) translateX(60px) scale(1.1); }
            100% { transform: rotate(120deg) translateX(60px) scale(1); }
          }
          @keyframes chase3 {
            0% { transform: rotate(240deg) translateX(60px) scale(1); }
            25% { transform: rotate(330deg) translateX(60px) scale(1.2); }
            50% { transform: rotate(60deg) translateX(60px) scale(0.9); }
            75% { transform: rotate(150deg) translateX(60px) scale(1.1); }
            100% { transform: rotate(240deg) translateX(60px) scale(1); }
          }

          .animate-chase1 { animation: chase1 3s linear infinite; transform-origin: center center; }
          .animate-chase2 { animation: chase2 3s linear infinite; transform-origin: center center; }
          .animate-chase3 { animation: chase3 3s linear infinite; transform-origin: center center; }
        `}
      </style>
    </div>
  );
}
