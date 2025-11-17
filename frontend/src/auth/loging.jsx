import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault(); // Prevent reload

    try {
      const response = await axios.post('http://localhost:3000/api/users/login', {
        username,
        password
      });

      toast.success("Login successful!");
      localStorage.setItem('token', response.data.token);
      localStorage.setItem("userRole", response.data.role); 
      console.log(response.data.role)

      if(response.data.role == "admin"){
        navigate("/admin-page")
      }
      

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">

        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gray-900 blur-xl opacity-40"></div>
              <div className="relative bg-linear-to-br from-gray-900 via-gray-800 to-gray-700 p-4 rounded-2xl shadow-2xl">
                <ShoppingBag className="w-12 h-12 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-1">
            SUPUN
          </h1>
          <p className="text-lg font-semibold text-gray-700 tracking-widest">SHOE MART</p>
          <p className="text-xs text-gray-500 mt-2 tracking-wider">Step Into Style</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600 mb-8">Sign in to continue shopping</p>

          <form className="space-y-6" onSubmit={handleLogin}>

            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  type="text"
                  placeholder="Enter your username"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-400"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Register Section */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">Don't have an account?</p>
            <Link
              to="/register"
              className="inline-block w-full bg-linear-to-r from-gray-100 to-gray-300 text-gray-900 py-3 rounded-lg font-semibold hover:from-gray-200 hover:to-gray-400 transition shadow-md hover:shadow-lg border border-gray-300"
            >
              Create New Account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          By continuing, you agree to our{' '}
          <a href="#" className="text-gray-700 hover:text-gray-900 underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-gray-700 hover:text-gray-900 underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
