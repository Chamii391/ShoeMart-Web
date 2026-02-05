import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  TrendingUp, 
  Heart, 
  ShoppingCart, 
  ArrowRight, 
  Award, 
  Shield, 
  Truck, 
  Sparkles,
  Play,
  MousePointer,
  Quote,
  CheckCircle2,
  Zap
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from "../components/header";
import Footer from '../components/footer';
import Snowfall from '../components/snow';



const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState(null);
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
      subtitle: "STEP INTO",
      highlight: "GREATNESS",
      description: "Discover the latest collection of premium footwear designed for champions",
      image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200",
      accent: "from-red-600/20 via-transparent to-black/80"
    },
    {
      title: "SUMMER COLLECTION",
      subtitle: "ELEVATE YOUR",
      highlight: "STYLE",
      description: "Lightweight & breathable shoes crafted for every adventure",
      image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1200",
      accent: "from-black/80 via-transparent to-red-900/40"
    },
    {
      title: "EXCLUSIVE DEALS",
      subtitle: "UNBEATABLE",
      highlight: "PRICES",
      description: "Limited time offers on your favorite premium brands",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200",
      accent: "from-red-900/30 via-black/60 to-black/90"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const features = [
    { icon: Truck, title: 'FREE DELIVERY', desc: 'Orders over Rs. 5,000', color: 'from-red-500 to-red-600' },
    { icon: Award, title: '100% AUTHENTIC', desc: 'Genuine products', color: 'from-gray-800 to-black' },
    { icon: Shield, title: 'SECURE PAYMENT', desc: 'Encrypted checkout', color: 'from-red-600 to-red-700' },
  ];

  const categories = [
    { 
      name: "MEN'S", 
      tagline: 'Power & Performance',
      image: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600',
      category: 'men'
    },
    { 
      name: "WOMEN'S", 
      tagline: 'Elegance & Style',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600',
      category: 'women'
    },
    { 
      name: "KIDS", 
      tagline: 'Fun & Adventure',
      image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600',
      category: 'child'
    },
  ];

  const reviews = [
    {
      name: "Amal Perera",
      rating: 5,
      review: "Best shoe store in Sri Lanka! Amazing quality and fast delivery. Highly recommended!",
      image: "https://i.pravatar.cc/150?img=12",
      location: "Colombo"
    },
    {
      name: "Tharushi Silva",
      rating: 5,
      review: "Love my new sneakers! They're so comfortable and stylish. Will definitely buy again.",
      image: "https://i.pravatar.cc/150?img=45",
      location: "Kandy"
    },
    {
      name: "Kamal Fernando",
      rating: 5,
      review: "Great customer service and authentic products. The prices are reasonable too!",
      image: "https://i.pravatar.cc/150?img=33",
      location: "Galle"
    }
  ];

  const brands = ['NIKE', 'ADIDAS', 'PUMA', 'REEBOK', 'NEW BALANCE', 'CONVERSE'];

  return (
    <>
      <Header />
      <Snowfall flakes={60}/>
     
      
      <main className="bg-white min-h-screen overflow-hidden">
        
        {/* ═══════════════════════════════════════════════════════════════════════
            HERO SECTION - FIXED CLICKABLE BUTTONS
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="relative w-full h-screen min-h-[700px] max-h-[900px] overflow-hidden bg-black">
          
          {/* Slides */}
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-out ${
                index === currentSlide 
                  ? 'opacity-100 scale-100 z-10' 
                  : 'opacity-0 scale-110 z-0'
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover scale-105"
                />
              </div>
              
              {/* Gradient Overlays - pointer-events-none so they don't block clicks */}
              <div className="absolute inset-0 bg-black/60 pointer-events-none" />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.accent} pointer-events-none`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none" />
              
              {/* Geometric Pattern - pointer-events-none */}
              <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
              />
            </div>
          ))}

          {/* Content Layer - Higher z-index for clickability */}
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="max-w-4xl">
                
                {/* Animated Badge */}
                <div 
                  className={`inline-flex items-center gap-3 mb-8 transition-all duration-700 delay-200 ${
                    heroSlides[currentSlide] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                >
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full">
                    <Sparkles className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-bold tracking-[0.2em] text-white uppercase">
                      {heroSlides[currentSlide].title}
                    </span>
                  </div>
                </div>

                {/* Main Title */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.9] tracking-tight">
                  <span className="text-white block">
                    {heroSlides[currentSlide].subtitle}
                  </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-red-600 block mt-2">
                    {heroSlides[currentSlide].highlight}
                  </span>
                </h1>

                {/* Description */}
                <p className="text-lg md:text-xl text-gray-300 max-w-xl mb-10 font-light leading-relaxed">
                  {heroSlides[currentSlide].description}
                </p>

                {/* CTA Buttons - FIXED: Added proper z-index and pointer-events */}
                <div className="flex flex-wrap gap-4 relative z-30">
                  <button 
                    onClick={() => navigate('/products')}
                    className="group relative overflow-hidden bg-red-600 text-white px-8 py-4 font-bold text-sm tracking-wider rounded-full transition-all duration-500 hover:shadow-2xl hover:shadow-red-600/30 hover:scale-105 cursor-pointer"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative flex items-center gap-2 group-hover:text-red-600 transition-colors duration-500">
                      SHOP NOW
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                  
                  <button 
                    onClick={() => navigate('/new-arrival')}
                    className="group relative overflow-hidden bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-8 py-4 font-bold text-sm tracking-wider rounded-full transition-all duration-500 hover:bg-white hover:border-white cursor-pointer"
                  >
                    <span className="relative flex items-center gap-2 group-hover:text-black transition-colors duration-300">
                      <Play className="w-4 h-4" />
                      NEW ARRIVALS
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows - z-index 40 */}
          <button
            onClick={prevSlide}
            className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 group cursor-pointer"
            aria-label="Previous slide"
          >
            <div className="relative p-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 group-hover:bg-red-600 group-hover:border-red-600 group-hover:scale-110">
              <ChevronLeft className="w-6 h-6 text-white" />
            </div>
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 group cursor-pointer"
            aria-label="Next slide"
          >
            <div className="relative p-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-300 group-hover:bg-red-600 group-hover:border-red-600 group-hover:scale-110">
              <ChevronRight className="w-6 h-6 text-white" />
            </div>
          </button>

          {/* Slide Indicators - z-index 40 */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className="group relative p-2 cursor-pointer"
                aria-label={`Go to slide ${index + 1}`}
              >
                <div className={`relative h-1.5 rounded-full transition-all duration-500 ${
                  index === currentSlide 
                    ? 'w-12 bg-red-600' 
                    : 'w-6 bg-white/30 group-hover:bg-white/60'
                }`}>
                  {index === currentSlide && (
                    <div className="absolute inset-0 bg-red-400 rounded-full animate-pulse" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 right-8 z-30 hidden lg:flex flex-col items-center gap-2 text-white/60 pointer-events-none">
            <MousePointer className="w-4 h-4 animate-bounce" />
            <span className="text-xs font-medium tracking-widest rotate-90 origin-center translate-y-6">
              SCROLL
            </span>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            FEATURES BAR
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="relative -mt-16 z-40 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group relative bg-white rounded-2xl p-6 shadow-xl shadow-black/5 border border-gray-100 hover:shadow-2xl hover:shadow-black/10 transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4">
                    <div className={`relative p-4 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm tracking-wide">
                        {feature.title}
                      </h3>
                      <p className="text-gray-500 text-sm mt-0.5">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            TRENDING PRODUCTS
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="relative py-24 px-4">
          {/* Background Decorations */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-900/5 rounded-full blur-3xl translate-x-1/2 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative">
            
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-red-600" />
                <span className="inline-flex items-center gap-2 text-red-600 text-xs font-bold tracking-[0.2em] uppercase">
                  <TrendingUp className="w-4 h-4" />
                  Hot Picks
                </span>
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-red-600" />
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 tracking-tight">
                Trending This Week
              </h2>
              
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                The most coveted styles that sneakerheads are obsessing over
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-gray-200 rounded-full" />
                  <div className="absolute inset-0 w-16 h-16 border-4 border-red-600 rounded-full border-t-transparent animate-spin" />
                </div>
                <p className="mt-6 text-gray-500 font-medium">Loading trending products...</p>
              </div>
            )}

            {/* Products Grid */}
            {!loading && trending.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {trending.map((product, index) => (
                  <div
                    key={product.product_id}
                    onClick={() => goToProductOverview(product.product_id)}
                    onMouseEnter={() => setHoveredProduct(product.product_id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-2 border border-gray-100"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      
                      {/* Trending Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <div className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                          <Zap className="w-3 h-3" />
                          #{index + 1} Trending
                        </div>
                      </div>

                      {/* Wishlist Button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Added to wishlist:", product);
                        }}
                        className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-red-600 hover:text-white cursor-pointer"
                      >
                        <Heart className="w-4 h-4" />
                      </button>

                      {/* Quick View */}
                      <div className="absolute inset-x-4 bottom-4 z-10 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            goToProductOverview(product.product_id);
                          }}
                          className="w-full py-3 bg-white text-gray-900 font-bold text-sm rounded-xl hover:bg-red-600 hover:text-white transition-colors duration-300 shadow-lg cursor-pointer"
                        >
                          Quick View
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[48px] group-hover:text-red-600 transition-colors">
                        {product.name}
                      </h3>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400 font-medium">(4.8)</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-black text-gray-900">
                          Rs. {product.price.toLocaleString()}
                        </p>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Add to cart:", product);
                          }}
                          className="p-2.5 bg-gray-100 rounded-xl group-hover:bg-red-600 transition-colors duration-300 cursor-pointer"
                        >
                          <ShoppingCart className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* View All Button */}
            {!loading && trending.length > 0 && (
              <div className="text-center mt-16">
                <button 
                  onClick={() => navigate('/products')}
                  className="group inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-4 font-bold text-sm tracking-wider rounded-full transition-all duration-500 hover:bg-red-600 hover:shadow-2xl hover:shadow-red-600/30 hover:scale-105 cursor-pointer"
                >
                  View All Products
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && trending.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No trending products available right now.</p>
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            SHOP BY CATEGORY
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-16">
              <span className="inline-block text-red-600 text-xs font-bold tracking-[0.2em] uppercase mb-4">
                Collections
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 tracking-tight">
                Shop By Category
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Explore our premium collections tailored for every lifestyle
              </p>
            </div>
            
            {/* Category Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((cat, index) => (
                <div 
                  key={index}
                  onClick={() => goToCategory(cat.category)}
                  className="group relative h-[500px] rounded-3xl overflow-hidden cursor-pointer"
                >
                  {/* Background Image */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />
                  
                  {/* Border Glow Effect */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-red-600/50 transition-colors duration-500 pointer-events-none" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                    <div className="transform group-hover:translate-y-0 translate-y-4 transition-transform duration-500">
                      
                      {/* Category Line */}
                      <div className="w-12 h-1 bg-red-600 mb-6 transform origin-left group-hover:w-20 transition-all duration-500" />
                      
                      {/* Title */}
                      <h3 className="text-4xl lg:text-5xl font-black text-white mb-2 tracking-tight">
                        {cat.name}
                      </h3>
                      
                      {/* Tagline */}
                      <p className="text-gray-300 text-lg mb-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                        {cat.tagline}
                      </p>
                      
                      {/* CTA Button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          goToCategory(cat.category);
                        }}
                        className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full font-bold text-sm tracking-wide opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-150 hover:bg-white hover:text-black cursor-pointer"
                      >
                        Shop Now
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            PREMIUM BRANDS
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="py-20 px-4 bg-black relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }} />
          </div>
          
          <div className="max-w-7xl mx-auto relative">
            
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <Award className="w-5 h-5 text-red-600" />
                <span className="text-red-600 text-xs font-bold tracking-[0.2em] uppercase">
                  Official Partners
                </span>
                <Award className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Premium Brands
              </h2>
            </div>
            
            {/* Brands Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {brands.map((brand, index) => (
                <div 
                  key={index}
                  className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-red-600 hover:border-red-600 transition-all duration-500 cursor-pointer"
                >
                  <div className="text-center">
                    <span className="text-lg font-black text-white/80 group-hover:text-white transition-colors tracking-tight">
                      {brand}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            WHY CHOOSE US
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-4 bg-white relative overflow-hidden">
          {/* Decorations */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-900/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative">
            
            {/* Header */}
            <div className="text-center mb-16">
              <span className="inline-block text-red-600 text-xs font-bold tracking-[0.2em] uppercase mb-4">
                Benefits
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                Why Choose Us?
              </h2>
            </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Truck, title: 'Fast Shipping', desc: 'Express delivery on all orders over Rs. 5,000' },
                { icon: Award, title: '100% Authentic', desc: 'Guaranteed genuine products from official brands' },
                { icon: Heart, title: 'Easy Returns', desc: 'Hassle-free 30-day return & exchange policy' },
                { icon: Shield, title: 'Secure Payment', desc: '100% safe & encrypted payment gateway' }
              ].map((item, index) => (
                <div key={index} className="group text-center p-6">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-red-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150 pointer-events-none" />
                    <div className="relative w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center group-hover:bg-red-600 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 shadow-xl">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            CUSTOMER REVIEWS
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="text-red-600 text-xs font-bold tracking-[0.2em] uppercase">
                  Testimonials
                </span>
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                Customer Reviews
              </h2>
              <p className="text-gray-500 text-lg">
                Join thousands of satisfied customers across Sri Lanka
              </p>
            </div>
            
            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((review, index) => (
                <div 
                  key={index}
                  className="group relative bg-white rounded-2xl p-8 shadow-lg shadow-black/5 border border-gray-100 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-2 transition-all duration-500"
                >
                  {/* Quote Icon */}
                  <div className="absolute -top-4 left-6">
                    <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/30">
                      <Quote className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    
                    {/* Review Text */}
                    <p className="text-gray-600 mb-6 leading-relaxed italic">
                      "{review.review}"
                    </p>
                    
                    {/* Author */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                      <img 
                        src={review.image} 
                        alt={review.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-red-600/20"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900">{review.name}</h4>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                          Verified • {review.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            NEWSLETTER CTA
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="py-20 px-4 bg-black relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
              Get <span className="text-red-600">20% Off</span> Your First Order
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              Subscribe to our newsletter and be the first to know about new arrivals and exclusive deals.
            </p>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Newsletter signup");
              }}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input 
                type="email" 
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-600 focus:bg-white/15 transition-all"
              />
              <button 
                type="submit"
                className="px-8 py-4 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30 cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>

      </main>
      
      <Footer />
    </>
  );
};

export default Home;