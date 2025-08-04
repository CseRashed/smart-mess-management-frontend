import React, { useState, useContext } from 'react';
import { FaEdit, FaTrash, FaPlus, FaCrown } from 'react-icons/fa';
import useMembers from '../../Hooks/useMembers';
import Swal from 'sweetalert2';
import { AuthContext } from '../AuthProvider/AuthProvider';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';

export default function Members() {
  useEffect(() => {
    document.title = 'Members';
  }, []);


  const { handleRegister } = useContext(AuthContext);
  const { data: members = [], isLoading, isError, error, refetch } = useMembers();
  const uniqueId = localStorage.getItem('uniqueId');


  const handleAdd = async (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    if (!name || !email || !password) {
      return Swal.fire('Warning', 'Name, Email and Password are required', 'warning');
    }

    try {
      const userCredential = await handleRegister(email, password);
      const firebaseUser = userCredential?.user;

      const info = { name, email, uniqueId };

   const token = localStorage.getItem('token'); // 🔑 Token আনো

const res = await fetch(`${import.meta.env.VITE_API}/members`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`, // ✅ Token পাঠাও
  },
  body: JSON.stringify(info),
});

const data = await res.json();


      if (data?.success) {
        Swal.fire('✅ Success', 'Member added successfully!', 'success').then(() => {
          refetch();
          e.target.reset();
        });
      } else {
        Swal.fire('⚠️ Failed', data?.error || 'Something went wrong!', 'warning');
      }
    } catch (err) {
      console.error('❌ Firebase registration failed:', err);
      Swal.fire('Error', err.message || 'Firebase registration failed', 'error');
    }
  };
const handleDelete = (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to delete this member?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e3342f',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      const token = localStorage.getItem('token');

      fetch(`${import.meta.env.VITE_API}/members/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message?.toLowerCase().includes('deleted')) {
            Swal.fire('Deleted!', 'Member has been deleted.', 'success');
            refetch(); // or update state
          } else {
            Swal.fire('Error!', 'Failed to delete member.', 'error');
          }
        })
        .catch((err) => {
          console.error('Delete error:', err);
          Swal.fire('Error!', 'Failed to delete member.', 'error');
        });
    }
  });
};



  const handleSetManager = (memberId) => {
    const manager = members.find((mem) => mem.role === 'Manager');
    const managerId = manager?._id;

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to make this member the manager?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, make manager',
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('token'); // টোকেন নেওয়া হচ্ছে লোকাল স্টোরেজ থেকে

fetch(`${import.meta.env.VITE_API}/members`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`, // 🔐 টোকেন পাঠানো হচ্ছে
  },
  body: JSON.stringify({ memberId, managerId }),
})

          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              Swal.fire('✅ Success', 'Manager updated successfully!', 'success');
              refetch();
            } else {
              Swal.fire('⚠️ Failed', data.message || 'Failed to update manager', 'warning');
            }
          })
          .catch((err) => {
            console.error('❌ Manager update failed:', err);
            Swal.fire('Error', 'Something went wrong while updating manager.', 'error');
          });
      }
    });
  };

  // Sort: manager always first
  const sortedMembers = [...members].sort((a, b) => {
    if (a.role === 'Manager') return -1;
    if (b.role === 'Manager') return 1;
    return 0;
  });

  if (isLoading) return <p className="text-center mt-10">Loading members...</p>;
  if (isError) return <p className="text-center mt-10 text-red-500">Error: {error.message}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">👥 Manage Members</h2>

      <div className="bg-white p-4 shadow rounded mb-6">
        <form onSubmit={handleAdd} className="grid md:grid-cols-3 gap-4">
          <input type="text" name="name" required placeholder="Full Name" className="border px-4 py-2 rounded" />
          <input type="email" name="email" required placeholder="Email" className="border px-4 py-2 rounded" />
          <input type="password" name="password" required placeholder="Password" className="border px-4 py-2 rounded" />
          <div className="md:col-span-3 mt-4">
            <button type="submit" className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600">
              <FaPlus className="inline mr-1" /> Add Member
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedMembers.map((member, index) => (
              <tr key={member._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{member.name}</td>
                <td className="p-3">{member.email}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleSetManager(member._id)}
                    title="Set as Manager"
                    className={member.role === 'Manager' ? 'text-yellow-500 hover:text-emerald-600' : 'text-gray-500 hover:text-emerald-600'}
                  >
                    <FaCrown />
                  </button>
                </td>
                {member.role === 'Manager' ? (
                  <td className="p-3 text-right text-sm italic text-gray-400">Manager cannot be deleted</td>
                ) : (
                  <td className="p-3 text-right space-x-2">
                    <button className="text-blue-500 hover:text-blue-700 cursor-not-allowed" title="Edit feature coming soon">
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(member._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
