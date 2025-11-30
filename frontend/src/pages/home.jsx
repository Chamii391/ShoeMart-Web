import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, TrendingUp, Zap, Heart, ShoppingCart, ArrowRight, Award, Shield, Truck, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from "../components/header";
import Footer from '../components/footer';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Navigate to product overview page
  const goToProductOverview = (productId) => {
    navigate(`/overview/${productId}`);
  };

  // Navigate to products page with category filter
  const goToCategory = (category) => {
    navigate(`/products?category=${category}`);
  };

  // Fetch trending products from backend
  useEffect(() => {
    async function loadTrending() {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/api/products/top_viewed");
        setTrending(res.data);
      } catch (error) {
        console.log("Error loading trending products", error);
      } finally {
        setLoading(false);
      }
    }

    loadTrending();
  }, []);

  const heroSlides = [
    {
      title: "NEW ARRIVALS 2024",
      subtitle: "STEP INTO GREATNESS",
      description: "Discover the latest collection of premium footwear designed for champions",
      image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200",
      bg: "from-black/95 via-red-900/40 to-black/95"
    },
    {
      title: "SUMMER COLLECTION",
      subtitle: "ELEVATE YOUR STYLE",
      description: "Lightweight & breathable shoes crafted for every adventure",
      image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1200",
      bg: "from-red-600/90 via-black/80 to-red-600/90"
    },
    {
      title: "EXCLUSIVE DEALS",
      subtitle: "UNBEATABLE PRICES",
      description: "Limited time offers on your favorite premium brands",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200",
      bg: "from-black/90 via-red-800/70 to-black/90"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <>
      <Header />
      
      <div className="bg-white min-h-screen">
        
        {/* ENHANCED HERO SLIDER */}
        <section className="relative w-full h-[750px] overflow-hidden bg-black">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            >
              {/* Dark Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.bg} z-10`}></div>
              
              {/* Background Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              
              {/* Animated Pattern Overlay */}
              <div className="absolute inset-0 z-10 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.03) 10px, rgba(255,255,255,.03) 20px)'
                }}></div>
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center text-white z-20">
                <div className="text-center px-4 max-w-6xl">
                  {/* Animated Badge */}
                  <div className="inline-flex items-center gap-3 mb-8 animate-pulse">
                    <div className="w-12 h-px bg-red-600"></div>
                    <div className="bg-red-600 px-6 py-2.5 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-white transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                      <span className="relative text-xs font-black tracking-[0.4em] uppercase">
                        {slide.title}
                      </span>
                    </div>
                    <div className="w-12 h-px bg-red-600"></div>
                  </div>

                  {/* Main Title with Animation */}
                  <h1 className="text-6xl md:text-8xl lg:text-[120px] font-black mb-8 drop-shadow-2xl leading-none tracking-tighter">
                    <span className="inline-block transform hover:scale-105 transition-transform duration-300">
                      {slide.subtitle}
                    </span>
                  </h1>

                  {/* Description */}
                  <p className="text-lg md:text-2xl mb-12 text-gray-200 max-w-3xl mx-auto font-light tracking-wide leading-relaxed">
                    {slide.description}
                  </p>

                  {/* Fixed Buttons - Always "SHOP NOW" and "NEW ARRIVALS" */}
                  <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                    <button 
                      onClick={() => navigate('/products')}
                      className="group relative bg-red-600 text-white px-14 py-5 font-black text-base tracking-[0.2em] transition-all duration-500 transform hover:scale-105 shadow-2xl overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                      <span className="relative flex items-center gap-3">
                        SHOP NOW
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                      </span>
                    </button>
                    
                    <button 
                      onClick={() => navigate('/new-arrivals')}
                      className="group relative bg-transparent border-3 border-white text-white px-14 py-5 font-black text-base tracking-[0.2em] transition-all duration-500 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                      <span className="relative group-hover:text-black transition-colors flex items-center gap-3">
                        <Sparkles className="w-5 h-5" />
                        NEW ARRIVALS
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Enhanced Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-red-600 text-white p-5 transition-all duration-300 z-30 group border border-white/20"
          >
            <ChevronLeft className="w-7 h-7 group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-red-600 text-white p-5 transition-all duration-300 z-30 group border border-white/20"
          >
            <ChevronRight className="w-7 h-7 group-hover:scale-110 transition-transform" />
          </button>

          {/* Enhanced Slide Indicators */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-30">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-500 ${
                  index === currentSlide 
                    ? 'bg-red-600 w-16 h-2' 
                    : 'bg-white/40 hover:bg-white/70 w-10 h-2'
                }`}
              />
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 hidden md:block">
            <div className="flex flex-col items-center gap-2 animate-bounce">
              <span className="text-white text-xs font-bold tracking-widest">SCROLL</span>
              <div className="w-px h-8 bg-white/50"></div>
            </div>
          </div>
        </section>

        {/* ENHANCED FEATURES BAR */}
        <section className="relative bg-black border-y-4 border-red-600">
          {/* Diagonal Background Pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 20px, rgba(255,255,255,.1) 20px, rgba(255,255,255,.1) 40px)'
          }}></div>
          
          <div className="max-w-7xl mx-auto px-4 py-10 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center gap-5 group cursor-pointer">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-600 blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-red-600 group-hover:bg-white p-5 transition-all duration-300 transform group-hover:scale-110">
                    <Truck className="w-9 h-9 text-white group-hover:text-red-600 transition-colors" />
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-xl text-white tracking-wide mb-1 group-hover:text-red-600 transition-colors">FREE DELIVERY</h3>
                  <p className="text-gray-400 text-sm font-medium">On orders over Rs. 5,000</p>
                </div>
              </div>
              
              <div className="flex items-center gap-5 group cursor-pointer">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-600 blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-red-600 group-hover:bg-white p-5 transition-all duration-300 transform group-hover:scale-110">
                    <Award className="w-9 h-9 text-white group-hover:text-red-600 transition-colors" />
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-xl text-white tracking-wide mb-1 group-hover:text-red-600 transition-colors">100% AUTHENTIC</h3>
                  <p className="text-gray-400 text-sm font-medium">Guaranteed original products</p>
                </div>
              </div>
              
              <div className="flex items-center gap-5 group cursor-pointer">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-600 blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-red-600 group-hover:bg-white p-5 transition-all duration-300 transform group-hover:scale-110">
                    <Shield className="w-9 h-9 text-white group-hover:text-red-600 transition-colors" />
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-xl text-white tracking-wide mb-1 group-hover:text-red-600 transition-colors">SECURE PAYMENT</h3>
                  <p className="text-gray-400 text-sm font-medium">Safe & encrypted checkout</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ENHANCED TRENDING PRODUCTS */}
        <section className="relative py-24 px-4 bg-gradient-to-b from-white via-gray-50 to-white">
          {/* Background Decoration */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/5 rounded-full blur-3xl"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Enhanced Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
                <div className="flex items-center gap-2 bg-red-600 px-5 py-2">
                  <TrendingUp className="w-5 h-5 text-white" />
                  <span className="font-black text-xs tracking-[0.4em] text-white uppercase">
                    HOT PICKS
                  </span>
                </div>
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-black text-black mb-6 tracking-tighter">
                TRENDING THIS WEEK
              </h2>
              <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
              <p className="text-gray-600 text-xl max-w-3xl mx-auto font-medium leading-relaxed">
                The most coveted styles that sneakerheads are obsessing over
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-32">
                <div className="inline-block relative">
                  <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-red-600"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                </div>
                <p className="mt-6 text-gray-600 font-bold text-lg">Loading trending products...</p>
              </div>
            )}

            {/* Enhanced Products Grid */}
            {!loading && trending.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {trending.map((product, index) => (
                  <div
                    key={product.product_id}
                    onClick={() => goToProductOverview(product.product_id)}
                    className="group relative cursor-pointer bg-white transition-all duration-500 hover:shadow-2xl"
                  >
                    {/* Animated Border */}
                    <div className="absolute inset-0 border-2 border-gray-100 group-hover:border-red-600 transition-all duration-500"></div>
                    
                    {/* Product Image */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 h-80">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Gradient Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Trending Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <div className="bg-red-600 text-white px-4 py-2 font-black text-xs tracking-widest shadow-lg transform -rotate-3 hover:rotate-0 transition-transform">
                          #{index + 1} TRENDING
                        </div>
                      </div>

                      {/* Wishlist Button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Added to wishlist:", product);
                        }}
                        className="absolute top-4 right-4 bg-white hover:bg-red-600 p-3 shadow-xl hover:text-white transition-all z-10 transform hover:scale-110"
                      >
                        <Heart className="w-5 h-5" />
                      </button>

                      {/* Quick View Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
                        <button className="bg-white text-black px-8 py-4 font-black text-sm tracking-wider transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 hover:bg-red-600 hover:text-white shadow-2xl">
                          QUICK VIEW
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-6 bg-white relative">
                      <h3 className="font-black text-lg text-gray-900 mb-3 line-clamp-2 min-h-[56px] group-hover:text-red-600 transition-colors leading-tight">
                        {product.name}
                      </h3>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-red-600 text-red-600" />
                        ))}
                        <span className="text-xs text-gray-500 ml-2 font-bold">(4.8)</span>
                      </div>

                      {/* Price Section - MODIFIED: Only original price */}
                      <div className="mb-5">
                        <p className="text-red-600 font-black text-3xl tracking-tight">
                          Rs. {product.price.toLocaleString()}
                        </p>
                      </div>

                      {/* Add to Cart Button - MODIFIED: Removed ShoppingCart icon */}
                     
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Enhanced View All Button */}
            {!loading && trending.length > 0 && (
              <div className="text-center mt-20">
                <button 
                  onClick={() => navigate('/products')}
                  className="group relative bg-red-600 hover:bg-black text-white px-20 py-6 font-black text-lg tracking-[0.2em] transition-all duration-500 transform hover:scale-105 shadow-2xl inline-flex items-center gap-4 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white transform translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                  <span className="relative group-hover:text-black transition-colors flex items-center gap-4">
                    VIEW ALL PRODUCTS
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform duration-300" />
                  </span>
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && trending.length === 0 && (
              <div className="text-center py-32">
                <div className="inline-block p-8 bg-gray-100 rounded-full mb-6">
                  <ShoppingCart className="w-16 h-16 text-gray-400" />
                </div>
                <p className="text-gray-500 text-xl font-bold">
                  No trending products available right now.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ENHANCED SHOP BY CATEGORY */}
        <section className="bg-white py-24 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Enhanced Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
                <span className="font-black text-sm tracking-[0.4em] text-red-600 uppercase">
                  COLLECTIONS
                </span>
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-black mb-6 tracking-tighter">
                SHOP BY CATEGORY
              </h2>
              <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
              <p className="text-gray-600 text-xl font-medium max-w-2xl mx-auto">
                Explore our premium collections tailored for every lifestyle
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Men's Collection - Enhanced */}
              <div 
                onClick={() => goToCategory('men')}
                className="relative h-[550px] overflow-hidden group cursor-pointer"
              >
                {/* Animated Border */}
                <div className="absolute inset-0 border-4 border-black group-hover:border-red-600 transition-all duration-500 z-20"></div>
                
                <img
                  src="https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600"
                  alt="Men's Shoes"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-90 group-hover:opacity-95 transition-opacity z-10"></div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-10 z-20 transform group-hover:translate-y-0 transition-transform">
                  <div className="mb-6">
                    <div className="w-20 h-1.5 bg-red-600 mb-6 transform origin-left group-hover:scale-x-150 transition-transform duration-500"></div>
                    <h3 className="text-6xl font-black text-white mb-4 tracking-tighter transform group-hover:translate-x-2 transition-transform duration-500">
                      MEN'S
                    </h3>
                    <p className="text-gray-200 text-lg font-medium mb-8 transform group-hover:translate-x-2 transition-transform duration-500 delay-75">
                      Power & Performance
                    </p>
                  </div>
                  <button className="relative bg-red-600 hover:bg-white text-white hover:text-black px-12 py-5 font-black text-sm tracking-[0.2em] transition-all duration-500 flex items-center gap-3 group/btn overflow-hidden">
                    <div className="absolute inset-0 bg-black transform translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500"></div>
                    <span className="relative flex items-center gap-3">
                      SHOP NOW
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                    </span>
                  </button>
                </div>
              </div>

              {/* Women's Collection - Enhanced */}
              <div 
                onClick={() => goToCategory('women')}
                className="relative h-[550px] overflow-hidden group cursor-pointer"
              >
                <div className="absolute inset-0 border-4 border-black group-hover:border-red-600 transition-all duration-500 z-20"></div>
                
                <img
                  src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600"
                  alt="Women's Shoes"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-90 group-hover:opacity-95 transition-opacity z-10"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-10 z-20 transform group-hover:translate-y-0 transition-transform">
                  <div className="mb-6">
                    <div className="w-20 h-1.5 bg-red-600 mb-6 transform origin-left group-hover:scale-x-150 transition-transform duration-500"></div>
                    <h3 className="text-6xl font-black text-white mb-4 tracking-tighter transform group-hover:translate-x-2 transition-transform duration-500">
                      WOMEN'S
                    </h3>
                    <p className="text-gray-200 text-lg font-medium mb-8 transform group-hover:translate-x-2 transition-transform duration-500 delay-75">
                      Elegance & Style
                    </p>
                  </div>
                  <button className="relative bg-red-600 hover:bg-white text-white hover:text-black px-12 py-5 font-black text-sm tracking-[0.2em] transition-all duration-500 flex items-center gap-3 group/btn overflow-hidden">
                    <div className="absolute inset-0 bg-black transform translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500"></div>
                    <span className="relative flex items-center gap-3">
                      SHOP NOW
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                    </span>
                  </button>
                </div>
              </div>

              {/* Kids Collection - Enhanced */}
              <div 
                onClick={() => goToCategory('child')}
                className="relative h-[550px] overflow-hidden group cursor-pointer"
              >
                <div className="absolute inset-0 border-4 border-black group-hover:border-red-600 transition-all duration-500 z-20"></div>
                
                <img
                  src="https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600"
                  alt="Child Shoes"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-90 group-hover:opacity-95 transition-opacity z-10"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-10 z-20 transform group-hover:translate-y-0 transition-transform">
                  <div className="mb-6">
                    <div className="w-20 h-1.5 bg-red-600 mb-6 transform origin-left group-hover:scale-x-150 transition-transform duration-500"></div>
                    <h3 className="text-6xl font-black text-white mb-4 tracking-tighter transform group-hover:translate-x-2 transition-transform duration-500">
                      KIDS
                    </h3>
                    <p className="text-gray-200 text-lg font-medium mb-8 transform group-hover:translate-x-2 transition-transform duration-500 delay-75">
                      Fun & Adventure
                    </p>
                  </div>
                  <button className="relative bg-red-600 hover:bg-white text-white hover:text-black px-12 py-5 font-black text-sm tracking-[0.2em] transition-all duration-500 flex items-center gap-3 group/btn overflow-hidden">
                    <div className="absolute inset-0 bg-black transform translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500"></div>
                    <span className="relative flex items-center gap-3">
                      SHOP NOW
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ENHANCED BRANDS SECTION */}
        <section className="relative bg-black py-24 px-4 border-y-4 border-red-600 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
                <Award className="w-6 h-6 text-red-600" />
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
                PREMIUM BRANDS
              </h2>
              <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
              <p className="text-gray-400 text-xl font-medium">
                Official partners with the world's most iconic footwear brands
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {['NIKE', 'ADIDAS', 'PUMA', 'REEBOK', 'NEW BALANCE', 'CONVERSE'].map((brand, index) => (
                <div 
                  key={index}
                  className="relative group cursor-pointer overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  <div className="relative bg-white group-hover:bg-transparent p-10 flex items-center justify-center transition-all duration-500 transform hover:scale-105 border-2 border-white group-hover:border-red-600">
                    <span className="text-xl md:text-2xl font-black text-black group-hover:text-white transition-colors tracking-tighter">
                      {brand}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ENHANCED WHY CHOOSE US */}
        <section className="relative bg-white py-24 px-4 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-20 right-0 w-72 h-72 bg-red-600/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-0 w-96 h-96 bg-black/5 rounded-full blur-3xl"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
                <span className="font-black text-sm tracking-[0.4em] text-red-600 uppercase">
                  BENEFITS
                </span>
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-black mb-6 tracking-tighter">
                WHY CHOOSE US?
              </h2>
              <div className="w-24 h-1 bg-red-600 mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {[
                { icon: Truck, title: 'FAST SHIPPING', desc: 'Express delivery on all orders over Rs. 5,000' },
                { icon: Award, title: '100% AUTHENTIC', desc: 'Guaranteed genuine products from official brands' },
                { icon: Heart, title: 'EASY RETURNS', desc: 'Hassle-free 30-day return & exchange policy' },
                { icon: Shield, title: 'SECURE PAYMENT', desc: '100% safe & encrypted payment gateway' }
              ].map((item, index) => (
                <div key={index} className="text-center group">
                  <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 bg-red-600 blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                    <div className="relative bg-black group-hover:bg-red-600 w-28 h-28 flex items-center justify-center mx-auto transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-6">
                      <item.icon className="w-14 h-14 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-red-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 font-medium text-base leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ENHANCED CUSTOMER REVIEWS */}
        <section className="relative bg-gradient-to-b from-gray-50 to-white py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
                <Star className="w-6 h-6 text-red-600 fill-red-600" />
                <span className="font-black text-sm tracking-[0.4em] text-red-600 uppercase">
                  TESTIMONIALS
                </span>
                <Star className="w-6 h-6 text-red-600 fill-red-600" />
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-black mb-6 tracking-tighter">
                CUSTOMER REVIEWS
              </h2>
              <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
              <p className="text-gray-600 text-xl font-medium">
                Join thousands of satisfied customers across Sri Lanka
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Amal Perera",
                  rating: 5,
                  review: "Best shoe store in Sri Lanka! Amazing quality and fast delivery. Highly recommended!",
                  image: "https://i.pravatar.cc/150?img=12"
                },
                {
                  name: "Tharushi Silva",
                  rating: 5,
                  review: "Love my new sneakers! They're so comfortable and stylish. Will definitely buy again.",
                  image: "https://i.pravatar.cc/150?img=45"
                },
                {
                  name: "Kamal Fernando",
                  rating: 5,
                  review: "Great customer service and authentic products. The prices are reasonable too!",
                  image: "https://i.pravatar.cc/150?img=33"
                }
              ].map((review, index) => (
                <div 
                  key={index}
                  className="relative bg-white p-8 transition-all duration-500 transform hover:-translate-y-3 group"
                >
                  {/* Animated Border */}
                  <div className="absolute inset-0 border-2 border-gray-200 group-hover:border-red-600 transition-all duration-500"></div>
                  
                  {/* Quote Mark */}
                  <div className="absolute -top-4 left-8 w-12 h-12 bg-red-600 flex items-center justify-center text-white text-4xl font-black">
                    "
                  </div>
                  
                  <div className="relative">
                    <div className="flex gap-1 mb-6 mt-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-red-600 text-red-600" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic mb-8 text-lg leading-relaxed font-medium">
                      {review.review}
                    </p>
                    <div className="flex items-center gap-4 pt-6 border-t-2 border-gray-100">
                      <div className="relative">
                        <div className="absolute inset-0 bg-red-600 rounded-full blur-md opacity-50"></div>
                        <img 
                          src={review.image} 
                          alt={review.name}
                          className="relative w-16 h-16 rounded-full object-cover border-3 border-red-600"
                        />
                      </div>
                      <div>
                        <h4 className="font-black text-lg">{review.name}</h4>
                        <p className="text-sm text-gray-500 font-medium">✓ Verified Customer</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
};

export default Home;