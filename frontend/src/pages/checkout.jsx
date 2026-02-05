import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { clearCart } from "../utils/cart";
import { MapPin, Phone, User, Lock, Truck, CreditCard, Check, ShoppingBag, ArrowLeft, Shield } from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";
import Snowfall from "../components/snow";

export default function Checkout() {
    const navigate = useNavigate();
    const { state } = useLocation();

    // BUY NOW or CART?
    const buyNow = state?.buyNow || null;
    const cartItems = state?.checkoutItems || null;
    const cartTotal = state?.total || 0;

    // HOOKS
    const [customerName, setCustomerName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);

    // Redirect if empty
    useEffect(() => {
        if (!buyNow && (!cartItems || cartItems.length === 0)) {
            toast.error("No items to checkout");
            navigate("/cart");
        }
    }, [buyNow, cartItems, navigate]);

    // PLACE ORDER
    async function placeOrder() {
        if (!customerName.trim()) return toast.error("Enter your name");
        if (!phone.trim()) return toast.error("Enter your phone");
        if (!address.trim()) return toast.error("Enter your address");

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login first");
            return navigate("/login");
        }

        setLoading(true);

        try {
            // BUY NOW (single item)
            if (buyNow) {
                await axios.post(
                    "http://localhost:3000/api/orders/make_order",
                    {
                        customer_address: address,
                        customer_phone: phone,
                        description: "COD Order (Buy Now)",
                        items: [
                            {
                                product_id: buyNow.product_id,
                                size_value: buyNow.size,
                                quantity: buyNow.qty
                            }
                        ]
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

            } else {
                // CART ORDER (MULTIPLE ITEMS)
                const itemsArray = cartItems.map((item) => ({
                    product_id: item.product_id,
                    size_value: item.size_value,
                    quantity: item.qty
                }));

                await axios.post(
                    "http://localhost:3000/api/orders/make_order",
                    {
                        customer_address: address,
                        customer_phone: phone,
                        description: "COD Order (Cart)",
                        items: itemsArray
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // CLEAR CART AFTER SUCCESS
                clearCart();
            }

            toast.success("Order placed successfully!");
            navigate("/thank-you");

        } catch (err) {
            toast.error(err.response?.data?.message || "Order failed");
        } finally {
            setLoading(false);
        }
    }

    // TOTAL CALCULATION
    const subtotal = buyNow ? buyNow.price * buyNow.qty : cartTotal;
    const shipping = subtotal > 5000 ? 0 : 500;
    const total = subtotal + shipping;
    const itemCount = buyNow ? buyNow.qty : cartItems?.reduce((sum, item) => sum + item.qty, 0) || 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Snowfall flakes={60}/>

            {/* Checkout Header */}
            <div className="bg-black">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => navigate(-1)}
                                className="text-white hover:text-red-600 transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-black text-white">
                                    CHECKOUT
                                </h1>
                                <p className="text-gray-400 text-sm">{itemCount} item(s) in order</p>
                            </div>
                        </div>

                        {/* Progress Steps */}
                        <div className="hidden md:flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-red-600 text-white flex items-center justify-center text-sm font-bold">
                                    <Check className="w-4 h-4" />
                                </div>
                                <span className="text-white text-sm font-medium">Cart</span>
                            </div>
                            <div className="w-8 h-px bg-red-600"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-red-600 text-white flex items-center justify-center text-sm font-bold">
                                    2
                                </div>
                                <span className="text-white text-sm font-medium">Checkout</span>
                            </div>
                            <div className="w-8 h-px bg-gray-600"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gray-700 text-gray-400 flex items-center justify-center text-sm font-bold">
                                    3
                                </div>
                                <span className="text-gray-400 text-sm font-medium">Complete</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT - Shipping Form */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Shipping Details */}
                        <div className="bg-white p-6 border-2 border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-red-600 text-white flex items-center justify-center">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="font-black text-lg">SHIPPING DETAILS</h2>
                                    <p className="text-gray-500 text-sm">Where should we deliver?</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-bold mb-2">FULL NAME</label>
                                    <div className="relative">
                                        <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 focus:border-red-600 outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-bold mb-2">PHONE NUMBER</label>
                                    <div className="relative">
                                        <Phone className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="tel"
                                            placeholder="Enter your phone number"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 focus:border-red-600 outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-bold mb-2">DELIVERY ADDRESS</label>
                                    <div className="relative">
                                        <MapPin className="w-5 h-5 text-gray-400 absolute left-4 top-4" />
                                        <textarea
                                            placeholder="Enter your full address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 focus:border-red-600 outline-none transition-colors resize-none"
                                            rows="3"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white p-6 border-2 border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-red-600 text-white flex items-center justify-center">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="font-black text-lg">PAYMENT METHOD</h2>
                                    <p className="text-gray-500 text-sm">Select payment option</p>
                                </div>
                            </div>

                            {/* COD Option */}
                            <div className="border-2 border-red-600 bg-red-50 p-4 flex items-center gap-4">
                                <div className="w-6 h-6 border-2 border-red-600 rounded-full flex items-center justify-center">
                                    <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold">Cash on Delivery (COD)</p>
                                    <p className="text-sm text-gray-600">Pay when you receive your order</p>
                                </div>
                                <div className="bg-red-600 text-white px-3 py-1 text-xs font-bold">
                                    SELECTED
                                </div>
                            </div>

                            {/* Other Options (Disabled) */}
                            <div className="border-2 border-gray-200 p-4 flex items-center gap-4 mt-3 opacity-50">
                                <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-500">Card Payment</p>
                                    <p className="text-sm text-gray-400">Coming soon</p>
                                </div>
                            </div>
                        </div>

                        {/* Security Note */}
                        <div className="bg-gray-100 p-4 flex items-center gap-3">
                            <Lock className="w-5 h-5 text-green-600" />
                            <p className="text-sm text-gray-600">
                                Your personal data is safe and secure with us
                            </p>
                        </div>
                    </div>

                    {/* RIGHT - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border-2 border-black p-6 sticky top-24">
                            <div className="flex items-center gap-3 mb-6">
                                <ShoppingBag className="w-6 h-6 text-red-600" />
                                <h2 className="font-black text-lg">ORDER SUMMARY</h2>
                            </div>

                            {/* Items */}
                            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                {/* BUY NOW Item */}
                                {buyNow && (
                                    <div className="flex gap-3 pb-4 border-b border-gray-200">
                                        <img
                                            src={buyNow.image}
                                            alt={buyNow.name}
                                            className="w-20 h-20 object-cover bg-gray-100"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-sm line-clamp-2">{buyNow.name}</h3>
                                            <p className="text-gray-500 text-xs mt-1">
                                                Size: {buyNow.size} | Qty: {buyNow.qty}
                                            </p>
                                            <p className="font-black text-red-600 mt-1">
                                                Rs. {(buyNow.price * buyNow.qty).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Cart Items */}
                                {!buyNow && cartItems && cartItems.map((item, index) => (
                                    <div key={index} className="flex gap-3 pb-4 border-b border-gray-200 last:border-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover bg-gray-100"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-sm line-clamp-2">{item.name}</h3>
                                            <p className="text-gray-500 text-xs mt-1">
                                                Size: {item.size_value} | Qty: {item.qty}
                                            </p>
                                            <p className="font-black text-red-600 mt-1">
                                                Rs. {(item.price * item.qty).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Calculations */}
                            <div className="space-y-3 py-4 border-t border-gray-200">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-bold">Rs. {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-bold">
                                        {shipping === 0 ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : (
                                            `Rs. ${shipping.toLocaleString()}`
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between py-4 border-t-2 border-black">
                                <span className="font-black text-lg">TOTAL</span>
                                <span className="font-black text-2xl text-red-600">
                                    Rs. {total.toLocaleString()}
                                </span>
                            </div>

                            {/* Place Order Button */}
                            <button
                                onClick={placeOrder}
                                disabled={loading}
                                className="w-full bg-red-600 hover:bg-black text-white py-4 font-black tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Lock className="w-5 h-5" />
                                        PLACE ORDER
                                    </>
                                )}
                            </button>

                            {/* Trust Badges */}
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <Shield className="w-4 h-4 text-green-600" />
                                        <span>Secure</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <Truck className="w-4 h-4 text-green-600" />
                                        <span>Fast Delivery</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <Check className="w-4 h-4 text-green-600" />
                                        <span>Authentic</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <CreditCard className="w-4 h-4 text-green-600" />
                                        <span>COD Available</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}