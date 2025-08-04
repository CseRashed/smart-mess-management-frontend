import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

function Notice() {
  useEffect(() => {
     document.title = 'Notice';
   }, []);

const handleSubmit = async (e) => {
  e.preventDefault();
  const notice = e.target.notice.value.trim();
  if (!notice) {
    Swal.fire('Warning', 'Please write a notice before submitting.', 'warning');
    return;
  }

  const token = localStorage.getItem('token');
  const uniqueId=localStorage.getItem('uniqueId')
  try {
    const res = await fetch(`${import.meta.env.VITE_API}/notice`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,  // Token pathano hocche ekhane
      },
      body: JSON.stringify({ notice ,uniqueId}),
    });

    const data = await res.json();

    if (res.ok) {
      Swal.fire('Success', 'Notice updated successfully!', 'success');
      e.target.reset();  // Form clear kora holo
    } else {
      Swal.fire('Error', data.message || 'Failed to update notice.', 'error');
    }
  } catch (error) {
    console.error('Fetch error:', error);
    Swal.fire('Error', 'Something went wrong. Try again later.', 'error');
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
        Add New Notice
      </h2>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
         name='notice'
          placeholder="Write your notice here..."
          className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          required
        />
        <button
          type="submit"
          className="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Notice;
