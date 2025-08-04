import React, { useEffect, useState } from 'react';
import useMembers from '../../Hooks/useMembers';
import Swal from 'sweetalert2';
import useMess from '../../Hooks/useMess';
import { Helmet } from 'react-helmet-async';

export default function AddMeals() {
   useEffect(() => {
      document.title = 'Meals';
    }, []);
  const { data: membersList = [], isLoading, isError, error } = useMembers();
  const [mealDate, setMealDate] = useState('');
  const [meals, setMeals] = useState({});
  const { mess } = useMess();

  const handleMealChange = (memberId, value) => {
    setMeals(prev => ({
      ...prev,
      [memberId]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!mealDate) {
      Swal.fire('Please select a date before submitting.', '', 'warning');
      return;
    }

    const dataToSubmit = membersList.map(member => ({
      memberId: member._id,
      email:member.email,
      name: member.name,
      uniqueId:mess?.uniqueId,
      meals: Number(meals[member._id]) || 0,
      date: mealDate,
    }));

    try {
     const token = localStorage.getItem('token'); // 🔑 Token আনো

const res = await fetch(`${import.meta.env.VITE_API}/meals`, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'Authorization': `Bearer ${token}` // ✅ Token পাঠাও
  },
  body: JSON.stringify(dataToSubmit),
});

const result = await res.json();


      if (result.insertedCount > 0 || result.acknowledged) {
        Swal.fire('Success!', 'Meals submitted successfully!', 'success');
        setMeals({});
        setMealDate('');
      } else {
        Swal.fire('Error!', 'Failed to submit meals.', 'error');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error!', 'Something went wrong.', 'error');
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading members...</p>;
  if (isError) return <p className="text-center mt-10 text-red-500">Error: {error.message}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Add Meals for Members</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-600 font-medium mb-2">Select Date</label>
          <input
            type="date"
            value={mealDate}
           onChange={(e) => setMealDate(e.target.value)}
  min={new Date().toISOString().slice(0, 8) + '01'}
  max={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    .toISOString()
    .slice(0, 10)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300 w-full max-w-xs"
            required
          />
        </div>

        <table className="w-full border-collapse border border-gray-300 mb-6">
          <thead>
            <tr className="bg-emerald-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Member Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Meals Taken</th>
            </tr>
          </thead>
          <tbody>
            {membersList.map(member => (
              <tr key={member._id} className="hover:bg-emerald-50">
                <td className="border border-gray-300 px-4 py-2">{member.name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="number"
                    min="0"
                    value={meals[member._id] || ''}
                    onChange={e => handleMealChange(member._id, e.target.value)}
                    className="w-20 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    required
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-md font-semibold transition"
        >
          Submit Meals
        </button>
      </form>
    </div>
  );
}
