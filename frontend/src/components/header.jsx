import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  
  const isActive = (path) => location.pathname === path;
  
  const cartItemCount = 3; // Replace with actual cart count
  const userRole = localStorage.getItem("userRole");

  // Profile navigation function
  function handleProfileClick() {
    if (userRole === "admin") {
      navigate("/admin-page");
    } else if (userRole === "customer") {
      navigate("/client-page");
    } else if (userRole === "delivery") {
      navigate("/deliver-page");
    } else {
      navigate("/login");
    }
  }
  
  return (
    <>
      {/* Main Header */}
      <header className="bg-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <div className="flex items-center">
                <svg 
                  className="w-10 h-10 text-red-600 transform -rotate-12 group-hover:rotate-0 transition-transform duration-300" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M2 18h20v2H2v-2zm2.55-7.86c-.21-.4-.17-.87.07-1.24l3.14-4.84c.28-.43.76-.69 1.27-.69h2.09c.37 0 .72.15.98.41l.93.93c.26.26.62.41.98.41h5.99c.55 0 1 .45 1 1v2c0 1.1-.9 2-2 2h-1.5L19 13h-2l-2-3h-1.5l-1-1.5H11l-2 3.5H7l-.75 1.5H4.5c-.73 0-1.41-.38-1.79-.99l-.16-.27z"/>
                </svg>
                <div className="ml-2">
                  <span className="text-2xl md:text-3xl font-black tracking-tight text-black">
                    SUPUN
                  </span>
                  <span className="text-2xl md:text-3xl font-black text-red-600">SHOES</span>
                  <div className="text-[10px] tracking-[0.3em] text-gray-500 uppercase -mt-1">
                    Step Into Style
                  </div>
                </div>
              </div>
            </Link>
            
            {/* Navigation - Desktop Center */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-4 py-2 text-sm font-bold tracking-wide transition-all duration-300 relative group ${
                  isActive('/') ? 'text-red-600' : 'text-black hover:text-red-600'
                }`}
              >
                HOME
                <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-red-600 transition-all duration-300 ${
                  isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>

              {/* Shop Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsShopDropdownOpen(true)}
                onMouseLeave={() => setIsShopDropdownOpen(false)}
              >
                <Link
                  to="/products"
                  className={`px-4 py-2 text-sm font-bold tracking-wide transition-all duration-300 relative group flex items-center ${
                    isActive('/products') ? 'text-red-600' : 'text-black hover:text-red-600'
                  }`}
                >
                  SHOP
                  <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-300 ${isShopDropdownOpen ? 'rotate-180' : ''}`} />
                  <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-red-600 transition-all duration-300 ${
                    isActive('/products') ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
                
                {/* Shop Dropdown Menu */}
                <div className={`absolute top-full left-0 w-56 bg-white shadow-xl border-t-2 border-red-600 transition-all duration-300 ${
                  isShopDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                }`}>
                  <div className="py-2">
                    <Link to="/products?category=men" className="block px-4 py-3 text-sm font-medium text-black hover:bg-red-600 hover:text-white transition-colors">
                      👞 Men's Shoes
                    </Link>
                    <Link to="/products?category=women" className="block px-4 py-3 text-sm font-medium text-black hover:bg-red-600 hover:text-white transition-colors">
                      👠 Women's Shoes
                    </Link>
                    <Link to="/products?category=sports" className="block px-4 py-3 text-sm font-medium text-black hover:bg-red-600 hover:text-white transition-colors">
                      👟 Sports & Running
                    </Link>
                    <Link to="/products?category=kids" className="block px-4 py-3 text-sm font-medium text-black hover:bg-red-600 hover:text-white transition-colors">
                      🧒 Kids' Collection
                    </Link>
                    <div className="border-t border-gray-200 my-2"></div>
                    <Link to="/products?sale=true" className="block px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-600 hover:text-white transition-colors">
                      🔥 SALE - Up to 50% Off
                    </Link>
                  </div>
                </div>
              </div>

              <Link
                to="/new-arrival"
                className={`px-4 py-2 text-sm font-bold tracking-wide transition-all duration-300 relative group ${
                  isActive('/new-arrival') ? 'text-red-600' : 'text-black hover:text-red-600'
                }`}
              >
                NEW ARRIVALS
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] px-1 rounded">NEW</span>
                <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-red-600 transition-all duration-300 ${
                  isActive('/new-arrival') ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>

              <Link
                to="/about"
                className={`px-4 py-2 text-sm font-bold tracking-wide transition-all duration-300 relative group ${
                  isActive('/about') ? 'text-red-600' : 'text-black hover:text-red-600'
                }`}
              >
                ABOUT
                <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-red-600 transition-all duration-300 ${
                  isActive('/about') ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>

              <Link
                to="/contact"
                className={`px-4 py-2 text-sm font-bold tracking-wide transition-all duration-300 relative group ${
                  isActive('/contact') ? 'text-red-600' : 'text-black hover:text-red-600'
                }`}
              >
                CONTACT
                <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-red-600 transition-all duration-300 ${
                  isActive('/contact') ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            </nav>

            {/* Right Side - Login, Cart, Profile */}
            <div className="hidden lg:flex items-center space-x-4">
              
              {/* 1. Login Button */}
              <Link
                to="/login"
                className="px-6 py-2 bg-red-600 text-white text-sm font-bold tracking-wide rounded-full hover:bg-black transition-all duration-300 shadow-md hover:shadow-lg"
              >
                LOGIN
              </Link>

              {/* 2. Cart */}
              <Link 
                to="/cart" 
                className="relative p-2 text-black hover:text-red-600 transition-all duration-300"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* 3. Profile Icon - Using Button with onClick */}
              <button 
                onClick={handleProfileClick}
                className="p-2 text-black hover:text-red-600 transition-all duration-300"
              >
                <User className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile - Right Side */}
            <div className="flex items-center space-x-3 lg:hidden">
              
              {/* Mobile Cart */}
              <Link 
                to="/cart" 
                className="relative p-2 text-black hover:text-red-600 transition-all duration-300"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Profile - Using Button with onClick */}
              <button 
                onClick={handleProfileClick}
                className="p-2 text-black hover:text-red-600 transition-all duration-300"
              >
                <User className="w-6 h-6" />
              </button>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-black hover:text-red-600 hover:bg-gray-100 rounded-full transition-all duration-300"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden bg-white border-t border-gray-200 transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-screen' : 'max-h-0'
        }`}>
          <div className="container mx-auto px-6 py-4">
            <nav className="space-y-1">
              
              {/* Mobile Login Button */}
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center px-4 py-3 text-sm font-bold bg-red-600 text-white rounded-lg transition-all mb-4 hover:bg-black"
              >
                LOGIN / REGISTER
              </Link>

              <div className="border-t border-gray-200 my-3"></div>

              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 text-sm font-bold rounded-lg transition-all ${
                  isActive('/') ? 'bg-red-600 text-white' : 'text-black hover:bg-gray-100'
                }`}
              >
                🏠 HOME
              </Link>
              <Link
                to="/products"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 text-sm font-bold rounded-lg transition-all ${
                  isActive('/products') ? 'bg-red-600 text-white' : 'text-black hover:bg-gray-100'
                }`}
              >
                👟 SHOP ALL
              </Link>
              <Link
                to="/products?category=men"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 pl-8 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                Men's Shoes
              </Link>
              <Link
                to="/products?category=women"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 pl-8 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                Women's Shoes
              </Link>
              <Link
                to="/products?category=sports"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 pl-8 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                Sports & Running
              </Link>
              <Link
                to="/products?category=kids"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 pl-8 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                Kids' Collection
              </Link>
              <Link
                to="/new-arrival"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 text-sm font-bold rounded-lg transition-all ${
                  isActive('/new-arrival') ? 'bg-red-600 text-white' : 'text-black hover:bg-gray-100'
                }`}
              >
                ✨ NEW ARRIVALS
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 text-sm font-bold rounded-lg transition-all ${
                  isActive('/about') ? 'bg-red-600 text-white' : 'text-black hover:bg-gray-100'
                }`}
              >
                ℹ️ ABOUT
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 text-sm font-bold rounded-lg transition-all ${
                  isActive('/contact') ? 'bg-red-600 text-white' : 'text-black hover:bg-gray-100'
                }`}
              >
                📞 CONTACT
              </Link>

              <div className="border-t border-gray-200 my-3"></div>

              {/* Mobile Profile Button */}
              <button
                onClick={() => {
                  handleProfileClick();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold bg-black text-white rounded-lg transition-all hover:bg-red-600"
              >
                👤 MY PROFILE
              </button>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;