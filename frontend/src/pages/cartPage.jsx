import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    getCartTotal
} from "../utils/cart";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, X, Tag, Lock } from "lucide-react";
import toast from "react-hot-toast";
import Header from "../components/header";
import Footer from "../components/footer";
import Snowfall from "../components/snow";

export default function CartPage() {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    // Load cart safely
    useEffect(() => {
        let isMounted = true;

        function load() {
            const items = getCart();
            if (isMounted) setCart(items);
        }

        load();

        return () => { isMounted = false };
    }, []);

    // Increase quantity
    function increaseQty(item) {
        if (item.qty >= item.maxStock) {
            toast.error("No more stock available");
            return;
        }

        const updated = updateCartQty(
            item.product_id,
            item.size_value,
            item.qty + 1,
            item.maxStock
        );

        setCart([...updated]);
        toast.success("Quantity updated");
    }

    // Decrease quantity
    function decreaseQty(item) {
        if (item.qty === 1) return;

        const updated = updateCartQty(
            item.product_id,
            item.size_value,
            item.qty - 1,
            item.maxStock
        );

        setCart([...updated]);
        toast.success("Quantity updated");
    }

    // Delete one
    function deleteItem(item) {
        const updated = removeFromCart(item.product_id, item.size_value);
        setCart(updated);
        toast.success("Item removed from cart");
    }

    // Clear all
    function handleClearCart() {
        if (window.confirm("Are you sure you want to clear your cart?")) {
            clearCart();
            setCart([]);
            toast.success("Cart cleared");
        }
    }

    const total = getCartTotal();
    const shippingFee = total > 5000 ? 0 : 500;
    const finalTotal = total + shippingFee;

    // Checkout
    function goToCheckout() {
        if (cart.length === 0) {
            toast.error("Your cart is empty!");
            return;
        }

        navigate("/checkout", {
            state: {
                checkoutItems: cart,
                total: finalTotal
            }
        });
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />
           <Snowfall flakes={60} />

            {/* Hero Section */}
            <section className="bg-black border-b-4 border-red-600">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-black text-white flex items-center gap-3">
                                <ShoppingBag className="w-8 h-8 text-red-600" />
                                SHOPPING <span className="text-red-600">CART</span>
                            </h1>
                            <p className="text-gray-400 text-sm mt-2">
                                {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
                            </p>
                        </div>

                        {cart.length > 0 && (
                            <button
                                onClick={handleClearCart}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all"
                            >
                                <X className="w-4 h-4" />
                                CLEAR CART
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                
                {/* Empty Cart State */}
                {cart.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-8">
                            <ShoppingBag className="w-16 h-16 text-gray-300" />
                        </div>
                        <h2 className="text-3xl font-black text-black mb-4">
                            YOUR CART IS EMPTY
                        </h2>
                        <p className="text-gray-500 mb-8">
                            Looks like you haven't added anything to your cart yet
                        </p>
                        <button
                            onClick={() => navigate('/products')}
                            className="flex items-center gap-2 bg-red-600 hover:bg-black text-white px-8 py-4 font-black text-sm tracking-wider transition-all"
                        >
                            START SHOPPING
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Cart Items */}
                {cart.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Left - Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white border-2 border-gray-100 hover:border-red-600 transition-all duration-300 p-4"
                                >
                                    <div className="flex gap-4">
                                        
                                        {/* Product Image */}
                                        <div className="relative flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-32 h-32 object-cover bg-gray-100"
                                            />
                                            <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-black">
                                                SIZE {item.size_value}
                                            </div>
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-black text-lg text-black mb-1">
                                                    {item.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 mb-2">
                                                    Size: <span className="font-bold text-black">{item.size_value}</span>
                                                </p>
                                                <p className="text-xl font-black text-red-600">
                                                    Rs. {item.price.toLocaleString()}
                                                </p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center gap-3 border-2 border-gray-200">
                                                    <button
                                                        onClick={() => decreaseQty(item)}
                                                        disabled={item.qty === 1}
                                                        className="p-2 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    
                                                    <span className="font-black text-lg min-w-[30px] text-center">
                                                        {item.qty}
                                                    </span>
                                                    
                                                    <button
                                                        onClick={() => increaseQty(item)}
                                                        disabled={item.qty >= item.maxStock}
                                                        className="p-2 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Subtotal & Delete */}
                                                <div className="flex items-center gap-4">
                                                    <p className="font-black text-lg">
                                                        Rs. {(item.price * item.qty).toLocaleString()}
                                                    </p>
                                                    <button
                                                        onClick={() => deleteItem(item)}
                                                        className="p-2 bg-red-600 hover:bg-black text-white transition-all"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Stock Warning */}
                                            {item.qty >= item.maxStock && (
                                                <p className="text-xs text-red-600 font-bold mt-2">
                                                    Maximum stock reached
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right - Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-50 border-2 border-black p-6 sticky top-24">
                                
                                <h2 className="text-2xl font-black mb-6 border-b-2 border-black pb-4">
                                    ORDER SUMMARY
                                </h2>

                                {/* Summary Details */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-bold">Rs. {total.toLocaleString()}</span>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-bold">
                                            {shippingFee === 0 ? (
                                                <span className="text-green-600">FREE</span>
                                            ) : (
                                                `Rs. ${shippingFee.toLocaleString()}`
                                            )}
                                        </span>
                                    </div>

                                    {/* Free Shipping Notice */}
                                    {shippingFee > 0 && (
                                        <div className="bg-red-50 border border-red-200 p-3 text-xs">
                                            <p className="text-red-600 font-medium">
                                                Add Rs. {(5000 - total).toLocaleString()} more for FREE shipping!
                                            </p>
                                        </div>
                                    )}

                                    <div className="border-t-2 border-gray-300 pt-4 flex justify-between">
                                        <span className="text-lg font-black">TOTAL</span>
                                        <span className="text-2xl font-black text-red-600">
                                            Rs. {finalTotal.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <button
                                    onClick={goToCheckout}
                                    className="w-full bg-red-600 hover:bg-black text-white py-4 font-black text-sm tracking-wider transition-all duration-300 flex items-center justify-center gap-2 mb-4"
                                >
                                    <Lock className="w-4 h-4" />
                                    PROCEED TO CHECKOUT
                                    <ArrowRight className="w-5 h-5" />
                                </button>

                                {/* Continue Shopping */}
                                <button
                                    onClick={() => navigate('/products')}
                                    className="w-full bg-white border-2 border-black hover:bg-black hover:text-white text-black py-4 font-black text-sm tracking-wider transition-all"
                                >
                                    CONTINUE SHOPPING
                                </button>

                                {/* Security Badges */}
                                <div className="mt-6 pt-6 border-t border-gray-300">
                                    <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Lock className="w-3 h-3" />
                                            <span>Secure Checkout</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Tag className="w-3 h-3" />
                                            <span>Best Price</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Promo Box */}
                            <div className="mt-4 bg-black text-white p-6">
                                <h3 className="font-black mb-2">HAVE A PROMO CODE?</h3>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter code"
                                        className="flex-1 px-3 py-2 bg-white text-black focus:outline-none"
                                    />
                                    <button className="bg-red-600 hover:bg-red-700 px-4 py-2 font-bold text-sm transition-all">
                                        APPLY
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
}