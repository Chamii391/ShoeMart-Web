import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, Twitter, MessageCircle, ArrowRight, CheckCircle } from 'lucide-react';
import Header from '../components/header';
import Footer from '../components/footer';
import toast from 'react-hot-toast';
import Snowfall from '../components/snow';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.message) {
            toast.error("Please fill in all required fields");
            return;
        }

        setLoading(true);
        
        // Simulate form submission
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            toast.success("Message sent successfully!");
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            
            setTimeout(() => setSubmitted(false), 3000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <Snowfall flakes={60} />

            {/* Hero Section */}
            <section className="relative bg-black text-white py-16 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-red-600/20 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-[80px]"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-10 h-px bg-red-600"></div>
                        <span className="text-red-600 text-xs font-black tracking-[0.3em]">GET IN TOUCH</span>
                        <div className="w-10 h-px bg-red-600"></div>
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter">
                        CONTACT <span className="text-red-600">US</span>
                    </h1>
                    
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="bg-red-600 py-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Phone */}
                        <a 
                            href="tel:+94769962315"
                            className="bg-black/20 hover:bg-black/40 p-6 flex items-center gap-4 transition-all group"
                        >
                            <div className="w-14 h-14 bg-white text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-white/70 text-sm">Call Us</p>
                                <p className="text-white font-bold">+94 76 996 2315</p>
                            </div>
                        </a>

                        {/* Email */}
                        <a 
                            href="mailto:supunshoemart@gmail.com"
                            className="bg-black/20 hover:bg-black/40 p-6 flex items-center gap-4 transition-all group"
                        >
                            <div className="w-14 h-14 bg-white text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-white/70 text-sm">Email Us</p>
                                <p className="text-white font-bold text-sm">supunshoemart@gmail.com</p>
                            </div>
                        </a>

                        {/* Location */}
                        <a 
                            href="https://maps.app.goo.gl/BLYGqrYA1qeUvRWBA"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-black/20 hover:bg-black/40 p-6 flex items-center gap-4 transition-all group"
                        >
                            <div className="w-14 h-14 bg-white text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-white/70 text-sm">Visit Us</p>
                                <p className="text-white font-bold">Colombo, Sri Lanka</p>
                            </div>
                        </a>

                        {/* Hours */}
                        <div className="bg-black/20 p-6 flex items-center gap-4">
                            <div className="w-14 h-14 bg-white text-red-600 flex items-center justify-center">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-white/70 text-sm">Working Hours</p>
                                <p className="text-white font-bold">Mon-Sat: 9AM - 8PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content - Form & Map */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        
                        {/* Contact Form */}
                        <div>
                            <div className="mb-8">
                                <h2 className="text-3xl font-black mb-2">
                                    SEND US A <span className="text-red-600">MESSAGE</span>
                                </h2>
                                <p className="text-gray-600">
                                    Fill out the form below and we'll get back to you shortly
                                </p>
                            </div>

                            {submitted ? (
                                <div className="bg-green-50 border-2 border-green-500 p-8 text-center">
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-2xl font-black text-green-600 mb-2">MESSAGE SENT!</h3>
                                    <p className="text-gray-600">Thank you for contacting us. We'll respond soon.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Name & Email Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-bold mb-2">NAME *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Your name"
                                                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-red-600 outline-none transition-colors"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">EMAIL *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Your email"
                                                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-red-600 outline-none transition-colors"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Phone & Subject Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-bold mb-2">PHONE</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="Your phone number"
                                                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-red-600 outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">SUBJECT</label>
                                            <select
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-red-600 outline-none transition-colors bg-white"
                                            >
                                                <option value="">Select subject</option>
                                                <option value="general">General Inquiry</option>
                                                <option value="order">Order Related</option>
                                                <option value="return">Return/Exchange</option>
                                                <option value="complaint">Complaint</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-bold mb-2">MESSAGE *</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Write your message here..."
                                            rows="5"
                                            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-red-600 outline-none transition-colors resize-none"
                                            required
                                        ></textarea>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-red-600 hover:bg-black text-white py-4 font-black tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                SEND MESSAGE
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}

                            {/* Social Links */}
                            <div className="mt-8 pt-8 border-t-2 border-gray-100">
                                <p className="font-bold mb-4">FOLLOW US</p>
                                <div className="flex gap-3">
                                    <a
                                        href="https://www.facebook.com/profile.php?id=100095641419138&mibextid=ZbWKwL"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 bg-black hover:bg-red-600 text-white flex items-center justify-center transition-all"
                                    >
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                    <a
                                        href="#"
                                        className="w-12 h-12 bg-black hover:bg-red-600 text-white flex items-center justify-center transition-all"
                                    >
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                    <a
                                        href="#"
                                        className="w-12 h-12 bg-black hover:bg-red-600 text-white flex items-center justify-center transition-all"
                                    >
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                    <a
                                        href="https://wa.me/94769962315"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center transition-all"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Map Section */}
                        <div>
                            <div className="mb-8">
                                <h2 className="text-3xl font-black mb-2">
                                    FIND <span className="text-red-600">US</span>
                                </h2>
                                <p className="text-gray-600">
                                    Visit our store to see our collection in person
                                </p>
                            </div>

                            {/* Google Map */}
                            <div className="border-4 border-black">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798467021092!2d79.84904987475796!3d6.914682693078912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2596076e57b63%3A0x9e04a0c8b3b2c03d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1699999999999!5m2!1sen!2sus"
                                    width="100%"
                                    height="400"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="w-full"
                                ></iframe>
                            </div>

                            {/* Address Card */}
                            <div className="mt-4 bg-black text-white p-6">
                                <div className="flex items-start gap-4">
                                    <MapPin className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-black text-lg mb-2">SUPUN SHOES</h3>
                                        <p className="text-gray-400 text-sm mb-4">
                                            Colombo, Sri Lanka
                                        </p>
                                        <a
                                            href="https://maps.app.goo.gl/BLYGqrYA1qeUvRWBA"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-red-600 hover:text-white font-bold text-sm transition-colors"
                                        >
                                            GET DIRECTIONS
                                            <ArrowRight className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Contact */}
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <a
                                    href="tel:+94769962315"
                                    className="bg-red-600 hover:bg-black text-white p-4 text-center font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    <Phone className="w-5 h-5" />
                                    CALL NOW
                                </a>
                                <a
                                    href="https://wa.me/94769962315"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-green-600 hover:bg-green-700 text-white p-4 text-center font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    WHATSAPP
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black mb-2">
                            FREQUENTLY ASKED <span className="text-red-600">QUESTIONS</span>
                        </h2>
                        <p className="text-gray-600">Quick answers to common questions</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {[
                            {
                                q: "How long does delivery take?",
                                a: "We deliver island-wide within 2-3 business days. Colombo orders are delivered within 24 hours."
                            },
                            {
                                q: "Are all products authentic?",
                                a: "Yes! We guarantee 100% authentic products sourced directly from authorized distributors."
                            },
                            {
                                q: "What is your return policy?",
                                a: "We offer a 30-day easy return policy for unused items in original packaging."
                            },
                            {
                                q: "Do you offer Cash on Delivery?",
                                a: "Yes, we accept Cash on Delivery (COD) for all orders across Sri Lanka."
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-white p-6 border-l-4 border-red-600">
                                <h3 className="font-black mb-2">{faq.q}</h3>
                                <p className="text-gray-600 text-sm">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-black py-12">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-black text-white mb-4">
                        STILL HAVE <span className="text-red-600">QUESTIONS?</span>
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Our team is here to help you 7 days a week
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="tel:+94769962315"
                            className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-white text-white hover:text-black px-8 py-4 font-black transition-all"
                        >
                            <Phone className="w-5 h-5" />
                            +94 76 996 2315
                        </a>
                        <a
                            href="mailto:supunshoemart@gmail.com"
                            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-red-600 text-black hover:text-white px-8 py-4 font-black transition-all"
                        >
                            <Mail className="w-5 h-5" />
                            EMAIL US
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}