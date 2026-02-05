import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Mail, Snowflake } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Snowfall from '../components/snow';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    
    // Validation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/users/register', {
        firstname,
        lastname,
        username,
        password
      });

      toast.success("Registration successful!");
      console.log(response.data);
      navigate('/login');

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <Snowfall flakes={60}/>
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-20"></div>
      
      <div className="w-full max-w-sm relative z-10">
        
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          
          {/* Logo */}
          <div className="text-center mb-6">
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
            <p className="text-gray-400 text-sm mt-1">Create your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-3">
            
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* First Name */}
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  onChange={(e) => setFirstname(e.target.value)}
                  value={firstname}
                  type="text"
                  placeholder="First Name"
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-red-600 focus:bg-white outline-none transition-all text-sm"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  onChange={(e) => setLastname(e.target.value)}
                  value={lastname}
                  type="text"
                  placeholder="Last Name"
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-red-600 focus:bg-white outline-none transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                type="text"
                placeholder="Username"
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-red-600 focus:bg-white outline-none transition-all text-sm"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-red-600 focus:bg-white outline-none transition-all text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-red-600 focus:bg-white outline-none transition-all text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-0.5 accent-red-600 cursor-pointer"
                required
              />
              <label htmlFor="terms" className="text-xs text-gray-500 cursor-pointer">
                I agree to the{' '}
                <Link to="/terms" className="text-red-600 hover:text-black">Terms</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-red-600 hover:text-black">Privacy Policy</Link>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-black text-white py-3 rounded-lg font-bold tracking-wide transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "CREATE ACCOUNT"
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-500 text-sm mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-red-600 font-bold hover:text-black transition-colors">
              Sign In
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <p className="text-center mt-5">
          <Link to="/" className="text-gray-400 text-sm hover:text-red-600 transition-colors">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
    </>
  );
}