import { useState, useContext, useEffect } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { AuthContext } from '../../AuthProvider/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet-async';

export default function Register() {
   useEffect(() => {
      document.title = 'Register';
    }, []);
  const { handleRegister } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    messName: '',
    action: 'create',
    messId: '',
  });

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleSubmit = async e => {
  e.preventDefault();
  const { name, email, password, messName, action, messId } = formData;

  try {
    // Step 1: Firebase register
    const userCredential = await handleRegister(email, password);
    const uid = userCredential?.user?.uid;
    localStorage.setItem('email', email);
    console.log("✅ Firebase registration success:", uid);

    // Step 2: Prepare data for backend
    const messInfo =
      action === 'create'
        ? { mess: messName, name, email, action }
        : { messId, name, email, action };

   const token = localStorage.getItem('token');

const response = await fetch(`${import.meta.env.VITE_API}/api/mess`, {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // এটা যোগ করো
  },
  body: JSON.stringify(messInfo),
});


    const result = await response.json();

    if (result.success) {
      if (action === 'create') {
        localStorage.setItem('uniqueId', result.uniqueId);
      } else {
        localStorage.setItem('uniqueId', messId || '');
      }

  localStorage.setItem('token',result.token)
  
        Swal.fire('Success', 'Registration completed!', 'success').then(() => {
          navigate('/dashboard');
        });

    } else {
      Swal.fire('Error', result.error || 'Something went wrong!', 'error');
    }

  } catch (err) {
    console.error('❌ Firebase or backend error:', err);

    let errorMsg = 'Registration failed!';
    if (err.code === 'auth/email-already-in-use') {
      errorMsg = 'This email is already registered.';
    } else if (err.code === 'auth/invalid-email') {
      errorMsg = 'Invalid email address.';
    } else if (err.code === 'auth/weak-password') {
      errorMsg = 'Password should be at least 6 characters.';
    } else if (err.message) {
      errorMsg = err.message;
    }

    Swal.fire('Error', errorMsg, 'error');
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#c2f0ea] via-[#e0f7e7] to-[#baf0d3] px-4">
      <div className="backdrop-blur-md py-4 bg-white/80 border border-gray-200 shadow-2xl rounded-3xl p-10 max-w-md w-full">
        <div className="text-center mb-8">
          <FaUserPlus className="mx-auto text-teal-500 text-5xl mb-2" />
          <h2 className="text-3xl font-extrabold text-gray-800">Welcome to MessMate</h2>
          <p className="text-sm text-gray-500 mt-1">Create or join a mess to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400 focus:outline-none bg-white/70"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400 focus:outline-none bg-white/70"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400 focus:outline-none bg-white/70"
            onChange={handleChange}
            required
          />

          <select
            name="action"
            value={formData.action}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400 focus:outline-none bg-white/70"
          >
            <option value="create">Create New Mess</option>
            <option value="join">Join Existing Mess</option>
          </select>

          {formData.action === 'create' && (
            <input
              type="text"
              name="messName"
              placeholder="Mess Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400 focus:outline-none bg-white/70"
              onChange={handleChange}
              required
            />
          )}

          {formData.action === 'join' && (
            <input
              type="text"
              name="messId"
              placeholder="Enter Mess ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400 focus:outline-none bg-white/70"
              onChange={handleChange}
              required
            />
          )}

          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold shadow-md transition-all"
          >
            Get Started
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Have an account?{" "}
          <Link to="/login" className="text-emerald-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}    