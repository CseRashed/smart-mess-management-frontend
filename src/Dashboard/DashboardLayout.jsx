import React, { useContext, useEffect, useState } from 'react';
import { FaTimes, FaBars } from 'react-icons/fa';
import { Link, Outlet } from 'react-router-dom';
import useMess from '../../Hooks/useMess';
import { AuthContext } from '../AuthProvider/AuthProvider';
import useMembers from '../../Hooks/useMembers';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: members = [], isError } = useMembers();
  const { mess, isLoading, error } = useMess();
  const { handleLogOut } = useContext(AuthContext);
  const [notic, setNotice] = useState('');
  const uniqueId = localStorage.getItem('uniqueId');

  useEffect(() => {
    if (!uniqueId) return;
    fetch(`${import.meta.env.VITE_API}/notice?uniqueId=${uniqueId}`)
      .then((res) => res.json())
      .then((data) => setNotice(data.notice));
  }, [uniqueId]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  const email = localStorage.getItem('email');
  const currentUser = members.find((member) => member.email === email);

  const handleLogout = async () => {
    try {
      await handleLogOut();
      localStorage.setItem('token', '');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // 👇 Sidebar auto-close on mobile
  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 relative overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white shadow-md p-6 z-40 transition-transform duration-300 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Close Button (Mobile) */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h2 className="text-xl font-bold text-emerald-600">Smart Mess</h2>
          <button onClick={() => setIsSidebarOpen(false)}>
            <FaTimes className="text-2xl text-gray-700" />
          </button>
        </div>

        {/* Logo (Desktop) */}
        <h2 className="hidden md:block text-2xl font-bold text-emerald-600 mb-8">Smart Mess</h2>

        {/* Navigation */}
        <nav className="space-y-4 text-gray-700">
          <Link to="profile" onClick={handleNavClick} className="block hover:text-emerald-600">
            Profile
          </Link>

          {currentUser?.role === "Manager" && (
            <>
              <Link to="/dashboard" onClick={handleNavClick} className="block hover:text-emerald-600">
                Dashboard
              </Link>

              <Link to="members" onClick={handleNavClick} className="block hover:text-emerald-600">
                Members
              </Link>

              <Link to="induvitualAmount" onClick={handleNavClick} className="block hover:text-emerald-600">
                Payment
              </Link>

              <Link to="addMeals" onClick={handleNavClick} className="block hover:text-emerald-600">
                Add Meal
              </Link>

              <Link to="mealsheet" onClick={handleNavClick} className="block hover:text-emerald-600">
                Meal Sheet
              </Link>

              <Link to="expenses" onClick={handleNavClick} className="block hover:text-emerald-600">
                Expenses
              </Link>

              <Link to="summary" onClick={handleNavClick} className="block hover:text-emerald-600">
                Summary
              </Link>

              <Link to="history" onClick={handleNavClick} className="block hover:text-emerald-600">
                History
              </Link>

              <Link to="notice" onClick={handleNavClick} className="block text-red-600 hover:text-emerald-600">
                Notice
              </Link>
            </>
          )}

          <Link to="/" onClick={() => { handleNavClick(); handleLogout(); }} className="block hover:text-red-600">
            Log Out
          </Link>
        </nav>
      </aside>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar (Mobile) */}
        <div className="md:hidden p-4 shadow bg-white">
          <button onClick={() => setIsSidebarOpen(true)}>
            <FaBars className="text-2xl text-gray-700" />
          </button>
        </div>

        {/* Mess Info */}
        <div className="relative w-fit mx-auto mt-6">
          <h1 className="text-2xl font-bold text-teal-700">
            {mess?.mess?.toUpperCase() || 'No Mess Found'}
          </h1>
          <sup className="absolute -top-4 -right-10 text-xs md:text-sm text-teal-500 font-medium tracking-wide">
            ({mess?.uniqueId || 'N/A'})
          </sup>
        </div>

        {/* Notice Marquee */}
        <marquee
          behavior="scroll"
          direction="left"
          scrollamount="5"
          style={{ fontWeight: 'bold', color: '#EB2370' }}
        >
          <span style={{ marginRight: '50px' }}>{notic}</span>
        </marquee>
{/* <Loader></Loader> */}
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto overflow-x-auto p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
