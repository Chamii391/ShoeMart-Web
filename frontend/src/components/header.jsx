import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Home, Package, Info, Mail, LogIn, Search, User, ShoppingCart } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-6">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="text-4xl font-light tracking-wider text-gray-900">
              SUPUN
            </div>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium tracking-wide transition-colors ${
                isActive('/')
                  ? 'text-gray-900 border-b-2 border-gray-900 pb-1'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              HOME
            </Link>

            <Link
              to="/products"
              className={`text-sm font-medium tracking-wide transition-colors ${
                isActive('/products')
                  ? 'text-gray-900 border-b-2 border-gray-900 pb-1'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              SHOP
            </Link>

            <Link
              to="/about"
              className={`text-sm font-medium tracking-wide transition-colors ${
                isActive('/about')
                  ? 'text-gray-900 border-b-2 border-gray-900 pb-1'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ABOUT
            </Link>

            <Link
              to="/contact"
              className={`text-sm font-medium tracking-wide transition-colors ${
                isActive('/contact')
                  ? 'text-gray-900 border-b-2 border-gray-900 pb-1'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              CONTACT US
            </Link>
          </nav>

          {/* Right Side - Search Bar & Icons */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-80 px-4 py-2 pl-10 bg-gray-100 text-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>

            {/* User Icon */}
            <Link to="/login" className="text-gray-700 hover:text-gray-900 transition">
              <User className="w-6 h-6" />
            </Link>

            {/* Cart Icon with Badge */}
            <Link to="/cart" className="relative text-gray-700 hover:text-gray-900 transition">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

        </div>
      </div>
    </header>
  );
};

export default Header;