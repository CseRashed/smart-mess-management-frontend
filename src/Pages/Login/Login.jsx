import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../AuthProvider/AuthProvider';
import { useNavigate, Link } from 'react-router-dom';
import { FaLockOpen } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet-async';

export default function Login() {
   useEffect(() => {
      document.title = 'Login';
    }, []);
  const { handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    uniqueId: '',
  });

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  const { email, password, uniqueId } = formData;

  // Step 1: Validate uniqueId
  if (!uniqueId.trim()) {
    return Swal.fire('Warning', 'Unique ID is required!', 'warning');
  }

  try {
    // Step 2: Firebase Login
    const res = await handleLogin(email, password);
    console.log('✅ Login success:', res.user);

const token = localStorage.getItem('token');

const response = await fetch(`${import.meta.env.VITE_API}/api/mess`, {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // এটা যোগ করো
  },
  body: JSON.stringify({email}),
});

const result = await response.json();

    if(result.success){
      console.log(result.token)
     const token=result.token
      // Step 3: Save uniqueId to localStorage
      localStorage.setItem('uniqueId', uniqueId);
      localStorage.setItem('email', email);
      localStorage.setItem('token',token)
  
      // Step 4: Show success message and redirect
      Swal.fire('Login Successful', '', 'success').then(() => {
        navigate('/dashboard/profile');
      });
    }

  } catch (err) {
    console.error('❌ Login failed:', err);

    // Handle Firebase auth errors
    let errorMsg = 'Login failed!';
    if (err.code === 'auth/user-not-found') {
      errorMsg = 'No account found with this email.';
    } else if (err.code === 'auth/wrong-password') {
      errorMsg = 'Incorrect password.';
    } else if (err.code === 'auth/invalid-email') {
      errorMsg = 'Invalid email format.';
    } else if (err.message) {
      errorMsg = 'Email and Passowrd is Wrong';
    }

    Swal.fire('Login Failed', errorMsg, 'error');
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdfbfb] via-[#eefbf4] to-[#dbf3e5] px-4">
      <div className="backdrop-blur-md py-4 bg-white/80 border border-gray-200 shadow-2xl rounded-3xl p-10 max-w-md w-full">
        <div className="text-center mb-8">
          <FaLockOpen className="mx-auto text-teal-500 text-5xl mb-2" />
          <h2 className="text-3xl font-extrabold text-gray-800">Login to MessMate</h2>
          <p className="text-sm text-gray-500 mt-1">Access your mess dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="uniqueId"
            placeholder="Mess Unique ID"
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

          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold shadow-md transition-all"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
