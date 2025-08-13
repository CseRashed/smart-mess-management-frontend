import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../AuthProvider/AuthProvider';
import useMeals from '../../Hooks/useMeals';
import usePayments from '../../Hooks/usePayment';
import { Link, useNavigate } from 'react-router-dom';
import useAxios from '../../Hooks/useAxios';
import Loader from '../compontens/Loader';

export default function Profile() {
  const { user, handleLogOut } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', _id: '' });
  const [totalMeals, setTotalMeals] = useState(0);
  const [payment, setPayment] = useState(null);

  const month = new Date().toISOString().slice(0, 7);
  const { data: meals = [] } = useMeals(month);
  const { data: payments = [] } = usePayments(month);
  const axiosSecure = useAxios();
  const navigate = useNavigate();
  const uniqueId = localStorage.getItem('uniqueId');

  // Load User Info
  useEffect(() => {
    const email = localStorage.getItem('email');
    if (!email) return;

    const getUserInfo = async () => {
      try {
        const res = await axiosSecure.get(`/members?email=${email}`);
        const data = res.data;
        if (data[0]) {
          setUserInfo(data[0]);
          setForm({
            name: data[0].name || '',
            email: data[0].email || '',
            _id: data[0]._id
          });
        }
      } catch (error) {
        console.error("❌ Failed to fetch user info:", error);
      }
    };

    getUserInfo();
  }, [user?.email, axiosSecure]);

  // Calculate Meals
  useEffect(() => {
    if (!user?.email || !meals.length || !userInfo) return;

    const myMeals = meals.filter(m => m.email === user.email);
    const mealCount = myMeals.reduce((total, entry) => total + entry.meals, 0);
    setTotalMeals(mealCount);
  }, [meals, user?.email, userInfo]);

  // Get Payment
  useEffect(() => {
    if (!form._id) return;
    const myPayment = payments.find(p => p.memberId === form._id);
    setPayment(myPayment?.amount || 0);
  }, [form._id, payments]);

  const handleSignOut = () => {
    handleLogOut();
    navigate('/');
    localStorage.setItem('token', '');
  };

if (!userInfo || payment === null) {
  return (
   <Loader />
  );
}


  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center text-center space-y-2">
          <img
            src="https://i.pravatar.cc/150?u=user"
            alt="Profile"
            className="w-28 h-28 rounded-full shadow border-4 border-emerald-100"
          />
          <h2 className="text-2xl font-semibold text-emerald-700">{userInfo?.name}</h2>
          <p className="text-gray-600 text-sm">{userInfo?.email}</p>
          <p className="text-gray-500 text-sm italic">Role: {userInfo?.role || 'Member'}</p>
          <small className="text-gray-500 text-sm italic">Mess ID: {uniqueId || ''}</small>

          <div className="mt-4 space-y-1 text-sm text-gray-700">
            <p>📅 <strong className="text-emerald-600">Total Meals:</strong> {totalMeals}</p>
            <p>💳 <strong className="text-emerald-600">Total Paid:</strong> ৳{payment}</p>
            <Link onClick={handleSignOut} className='hover:text-green-500 border rounded-xl px-2'>Log Out</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
