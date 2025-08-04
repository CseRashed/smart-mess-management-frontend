import { Outlet } from "react-router-dom";
import Navbar from "./compontens/Navbar";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";

export default function App() {
   useEffect(() => {
      document.title = 'Home';
    }, []);
  return (
    <div>
   
      <Navbar />
      
        <div className="py-8">
        <Outlet />
      </div>
       {/* Contact Section */}
      <footer className="bg-gray-800 text-white text-center py-6">
        <p> 📞 Contact me: +8801645668965 </p>
        <p>  cserashedul@gmail.com</p>
        <p>© 2025 Smart Mess Manager</p>
      </footer>
    </div>
  );
}
