import React from 'react';
import { Navigate } from 'react-router-dom';
import useMembers from '../Hooks/useMembers';

export default function ManagerRoute({ children }) {
  const {
    data: members = [],
    isLoading,
    isError,
  } = useMembers();

  const email = localStorage.getItem('email');

  // Step 1: If loading or no members yet, show loader
  if (isLoading || members.length === 0) {
    return <p className="text-center py-10 font-semibold text-gray-500">Checking access...</p>;
  }

  // Step 2: If error or no email in localStorage
  if (isError || !email) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Step 3: Find the logged-in user from members
  const currentUser = members.find(member => member.email === email);

  // Step 4: If still loading user or not found yet, show loader
  if (!currentUser) {
    return <p className="text-center py-10 font-semibold text-gray-500">Validating user...</p>;
  }

  // Step 5: If not a Manager, redirect to unauthorized
  if (currentUser?.role !== 'Manager') {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Access granted
  return children;
}
