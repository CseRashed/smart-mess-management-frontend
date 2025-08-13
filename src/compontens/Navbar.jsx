import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { jwtDecode } from "jwt-decode"; //

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // seconds
    return decoded.exp < currentTime; // true হলে expired
  } catch {
    return true;
  }
}

export default function Navbar() {
  const user = useContext(AuthContext);
  const email = user?.user?.email;
  const token = localStorage.getItem("token");
  const expired = isTokenExpired(token);

  const showDashboard = email && !expired;

  return (
    <nav className="backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl md:text-3xl font-extrabold text-teal-600 tracking-wide"
      >
        Smart <span className="text-gray-800">Mess</span>
      </Link>

      {/* Navigation Links */}
      <div className="space-x-3 md:space-x-6 text-sm md:text-base font-medium">
        {showDashboard ? (
          <Link
            to="/dashboard/profile"
            className="text-teal-600 hover:text-white hover:bg-teal-500 transition px-4 py-2 rounded-md border border-teal-500"
          >
            Dashboard
          </Link>
        ) : (
          <Link
            to="/register"
            className="text-teal-600 hover:text-white hover:bg-teal-500 transition px-4 py-2 rounded-md border border-teal-500"
          >
            Register
          </Link>
        )}
      </div>
    </nav>
  );
}
