import React from 'react';
import { Award, Users, ShoppingBag, Heart, Target, Eye, Truck, Shield, Star, CheckCircle } from 'lucide-react';
import Header from '../components/header';
import Footer from '../components/footer';
import Snowfall from '../components/snow';

export default function About() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <Snowfall flakes={60} />

            {/* Hero Section */}
            <section className="relative bg-black text-white py-20 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-red-600/10 rounded-full blur-[80px]"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="w-12 h-px bg-red-600"></div>
                        <span className="text-red-600 text-xs font-black tracking-[0.3em]">ABOUT US</span>
                        <div className="w-12 h-px bg-red-600"></div>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
                        OUR <span className="text-red-600">STORY</span>
                    </h1>
                    
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Bringing premium footwear to Sri Lanka since 2002. 
                        We believe everyone deserves to step into greatness.
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-red-600 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center text-white">
                            <p className="text-5xl font-black">10K+</p>
                            <p className="text-sm font-medium mt-2 text-white/80">Happy Customers</p>
                        </div>
                        <div className="text-center text-white">
                            <p className="text-5xl font-black">500+</p>
                            <p className="text-sm font-medium mt-2 text-white/80">Shoe Styles</p>
                        </div>
                        <div className="text-center text-white">
                            <p className="text-5xl font-black">50+</p>
                            <p className="text-sm font-medium mt-2 text-white/80">Premium Brands</p>
                        </div>
                        <div className="text-center text-white">
                            <p className="text-5xl font-black">5+</p>
                            <p className="text-sm font-medium mt-2 text-white/80">Years Experience</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Content */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Image */}
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-full h-full border-4 border-red-600"></div>
                            <img
                                src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800"
                                alt="About Us"
                                className="relative z-10 w-full h-96 object-cover"
                            />
                            <div className="absolute -bottom-4 -right-4 bg-black text-white p-6">
                                <p className="text-4xl font-black">2018</p>
                                <p className="text-sm text-gray-400">Est. Year</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div>
                            <h2 className="text-4xl font-black mb-6">
                                WHO WE <span className="text-red-600">ARE</span>
                            </h2>
                            
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                SUPUN SHOES started with a simple mission: to provide Sri Lankans with access to 
                                premium, authentic footwear at fair prices. What began as a small shop in Colombo 
                                has grown into one of the country's most trusted online shoe retailers.
                            </p>
                            
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                We partner directly with top global brands to bring you the latest styles and 
                                guarantee 100% authenticity on every pair. Our team of shoe enthusiasts carefully 
                                curates each collection to ensure you find the perfect fit for every occasion.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-red-600" />
                                    <span className="font-medium">100% Authentic</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-red-600" />
                                    <span className="font-medium">Premium Quality</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-red-600" />
                                    <span className="font-medium">Island-wide Delivery</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-red-600" />
                                    <span className="font-medium">Easy Returns</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Mission */}
                        <div className="bg-white p-8 border-l-4 border-red-600">
                            <div className="w-14 h-14 bg-red-600 text-white flex items-center justify-center mb-6">
                                <Target className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-black mb-4">OUR MISSION</h3>
                            <p className="text-gray-600 leading-relaxed">
                                To provide every Sri Lankan with access to premium, authentic footwear 
                                that combines style, comfort, and durability. We strive to make quality 
                                shoes accessible to everyone while delivering exceptional customer service.
                            </p>
                        </div>

                        {/* Vision */}
                        <div className="bg-white p-8 border-l-4 border-black">
                            <div className="w-14 h-14 bg-black text-white flex items-center justify-center mb-6">
                                <Eye className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-black mb-4">OUR VISION</h3>
                            <p className="text-gray-600 leading-relaxed">
                                To become Sri Lanka's most trusted destination for premium footwear, 
                                known for our authenticity, quality, and commitment to customer satisfaction. 
                                We aim to inspire confidence with every step our customers take.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black mb-4">
                            WHY CHOOSE <span className="text-red-600">US</span>
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            We're not just selling shoes – we're delivering confidence, style, and quality
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center p-6 group hover:bg-black transition-all duration-300">
                            <div className="w-16 h-16 bg-red-600 text-white flex items-center justify-center mx-auto mb-4 group-hover:bg-white group-hover:text-red-600 transition-all">
                                <Shield className="w-8 h-8" />
                            </div>
                            <h3 className="font-black text-lg mb-2 group-hover:text-white transition-colors">AUTHENTIC</h3>
                            <p className="text-gray-600 text-sm group-hover:text-gray-400 transition-colors">
                                100% genuine products from authorized sources
                            </p>
                        </div>

                        <div className="text-center p-6 group hover:bg-black transition-all duration-300">
                            <div className="w-16 h-16 bg-red-600 text-white flex items-center justify-center mx-auto mb-4 group-hover:bg-white group-hover:text-red-600 transition-all">
                                <Truck className="w-8 h-8" />
                            </div>
                            <h3 className="font-black text-lg mb-2 group-hover:text-white transition-colors">FAST DELIVERY</h3>
                            <p className="text-gray-600 text-sm group-hover:text-gray-400 transition-colors">
                                Island-wide delivery within 2-3 business days
                            </p>
                        </div>

                        <div className="text-center p-6 group hover:bg-black transition-all duration-300">
                            <div className="w-16 h-16 bg-red-600 text-white flex items-center justify-center mx-auto mb-4 group-hover:bg-white group-hover:text-red-600 transition-all">
                                <Award className="w-8 h-8" />
                            </div>
                            <h3 className="font-black text-lg mb-2 group-hover:text-white transition-colors">BEST QUALITY</h3>
                            <p className="text-gray-600 text-sm group-hover:text-gray-400 transition-colors">
                                Premium materials and craftsmanship guaranteed
                            </p>
                        </div>

                        <div className="text-center p-6 group hover:bg-black transition-all duration-300">
                            <div className="w-16 h-16 bg-red-600 text-white flex items-center justify-center mx-auto mb-4 group-hover:bg-white group-hover:text-red-600 transition-all">
                                <Heart className="w-8 h-8" />
                            </div>
                            <h3 className="font-black text-lg mb-2 group-hover:text-white transition-colors">CUSTOMER LOVE</h3>
                            <p className="text-gray-600 text-sm group-hover:text-gray-400 transition-colors">
                                10,000+ happy customers and counting
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="bg-black text-white py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black mb-4">
                            OUR <span className="text-red-600">VALUES</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-6xl font-black text-red-600 mb-4">01</div>
                            <h3 className="font-black text-xl mb-3">INTEGRITY</h3>
                            <p className="text-gray-400 text-sm">
                                We never compromise on authenticity. Every product we sell is 100% genuine.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="text-6xl font-black text-red-600 mb-4">02</div>
                            <h3 className="font-black text-xl mb-3">EXCELLENCE</h3>
                            <p className="text-gray-400 text-sm">
                                From product selection to customer service, we strive for excellence in everything.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="text-6xl font-black text-red-600 mb-4">03</div>
                            <h3 className="font-black text-xl mb-3">CUSTOMER FIRST</h3>
                            <p className="text-gray-400 text-sm">
                                Your satisfaction is our priority. We go above and beyond to serve you better.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Brands We Carry */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black mb-4">
                            BRANDS WE <span className="text-red-600">CARRY</span>
                        </h2>
                        <p className="text-gray-600">
                            Partnered with the world's most iconic footwear brands
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {['NIKE', 'ADIDAS', 'PUMA', 'REEBOK', 'NEW BALANCE', 'CONVERSE'].map((brand, index) => (
                            <div
                                key={index}
                                className="bg-gray-100 hover:bg-black p-8 flex items-center justify-center transition-all group cursor-pointer"
                            >
                                <span className="text-xl font-black text-black group-hover:text-white transition-colors">
                                    {brand}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black mb-4">
                            WHAT CUSTOMERS <span className="text-red-600">SAY</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                name: "Amal Perera",
                                comment: "Best shoe store in Sri Lanka! Authentic products and amazing customer service.",
                                image: "https://i.pravatar.cc/150?img=12"
                            },
                            {
                                name: "Tharushi Silva",
                                comment: "Love my new sneakers! Fast delivery and great quality. Highly recommended!",
                                image: "https://i.pravatar.cc/150?img=45"
                            },
                            {
                                name: "Kamal Fernando",
                                comment: "Finally found a trustworthy place for authentic shoes. Will definitely buy again!",
                                image: "https://i.pravatar.cc/150?img=33"
                            }
                        ].map((testimonial, index) => (
                            <div key={index} className="bg-white p-6 border-2 border-gray-100">
                                <div className="flex mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-red-600 text-red-600" />
                                    ))}
                                </div>
                                <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <span className="font-bold">{testimonial.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-red-600 py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-black text-white mb-4">
                        READY TO STEP INTO STYLE?
                    </h2>
                    <p className="text-white/80 mb-8 max-w-xl mx-auto">
                        Explore our collection and find your perfect pair today
                    </p>
                    <a
                        href="/products"
                        className="inline-block bg-black hover:bg-white text-white hover:text-black px-10 py-4 font-black tracking-wider transition-all"
                    >
                        SHOP NOW
                    </a>
                </div>
            </section>

            <Footer />
        </div>
    );
}