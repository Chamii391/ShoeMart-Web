import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center group mb-4">
              <svg 
                className="w-8 h-8 text-red-600" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M2 18h20v2H2v-2zm2.55-7.86c-.21-.4-.17-.87.07-1.24l3.14-4.84c.28-.43.76-.69 1.27-.69h2.09c.37 0 .72.15.98.41l.93.93c.26.26.62.41.98.41h5.99c.55 0 1 .45 1 1v2c0 1.1-.9 2-2 2h-1.5L19 13h-2l-2-3h-1.5l-1-1.5H11l-2 3.5H7l-.75 1.5H4.5c-.73 0-1.41-.38-1.79-.99l-.16-.27z"/>
              </svg>
              <span className="ml-2 text-xl font-black">
                SUPUN<span className="text-red-600">SHOES</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium footwear for every step of your journey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm tracking-wider mb-4 text-red-600">SHOP</h4>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-400 hover:text-white text-sm transition-colors">All Products</Link></li>
              <li><Link to="/products?category=men" className="text-gray-400 hover:text-white text-sm transition-colors">Men</Link></li>
              <li><Link to="/products?category=women" className="text-gray-400 hover:text-white text-sm transition-colors">Women</Link></li>
              <li><Link to="/products?category=kids" className="text-gray-400 hover:text-white text-sm transition-colors">Kids</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-sm tracking-wider mb-4 text-red-600">SUPPORT</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white text-sm transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</Link></li>
              <li><Link to="/shipping" className="text-gray-400 hover:text-white text-sm transition-colors">Shipping</Link></li>
              <li><Link to="/returns" className="text-gray-400 hover:text-white text-sm transition-colors">Returns</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm tracking-wider mb-4 text-red-600">CONTACT</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-red-600" />
                +94 77 123 4567
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-red-600" />
                info@supunshoes.com
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-red-600" />
                Colombo, Sri Lanka
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Copyright */}
            <p className="text-gray-500 text-sm">
              © 2024 SUPUN SHOES. All rights reserved.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;