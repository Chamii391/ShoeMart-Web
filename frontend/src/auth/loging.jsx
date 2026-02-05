import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Snowfall from '../components/snow';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/users/login', {
        username,
        password
      });

      toast.success("Login successful!");
      localStorage.setItem('token', response.data.token);
      localStorage.setItem("userRole", response.data.role);
      localStorage.setItem("UserId", response.data.userid);
      localStorage.setItem("username", response.data.username);

      if (response.data.role === "admin") {
        navigate("/admin-page");
      } else if (response.data.role === "customer") {
        navigate("/");
      } else if (response.data.role === "delivery") {
        navigate("/deliver-page");
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <Snowfall flakes={60} />
    <div className="h-screen w-full bg-black flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-20"></div>
      
      <div className="w-full max-w-sm relative z-10">
        
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center">
              <svg 
                className="w-10 h-10 text-red-600" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M2 18h20v2H2v-2zm2.55-7.86c-.21-.4-.17-.87.07-1.24l3.14-4.84c.28-.43.76-.69 1.27-.69h2.09c.37 0 .72.15.98.41l.93.93c.26.26.62.41.98.41h5.99c.55 0 1 .45 1 1v2c0 1.1-.9 2-2 2h-1.5L19 13h-2l-2-3h-1.5l-1-1.5H11l-2 3.5H7l-.75 1.5H4.5c-.73 0-1.41-.38-1.79-.99l-.16-.27z"/>
              </svg>
            </Link>
            <h1 className="text-2xl font-black text-black mt-3">
              SUPUN<span className="text-red-600">SHOES</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">Welcome back!</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Username */}
            <div className="relative">
              <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                type="text"
                placeholder="Username"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-red-600 focus:bg-white outline-none transition-all"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-red-600 focus:bg-white outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-red-600 hover:text-black transition-colors">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-black text-white py-3 rounded-lg font-bold tracking-wide transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "SIGN IN"
              )}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-red-600 font-bold hover:text-black transition-colors">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <p className="text-center mt-6">
          <Link to="/" className="text-gray-400 text-sm hover:text-red-600 transition-colors">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
    </>
  );
}