import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { clearCart } from "../utils/cart";

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
        }
    }

    // TOTAL
    const total = buyNow ? buyNow.price * buyNow.qty : cartTotal;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-red-600">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                {/* ORDER SUMMARY */}
                <div className="border rounded-xl p-5 shadow">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                    {/* BUY NOW */}
                    {buyNow && (
                        <>
                            <img
                                src={buyNow.image}
                                className="w-40 h-40 object-cover rounded-lg border"
                            />

                            <div className="mt-4">
                                <p className="text-lg font-semibold">{buyNow.name}</p>
                                <p className="text-gray-600 mt-1">Size: {buyNow.size}</p>
                                <p className="text-gray-600">Qty: {buyNow.qty}</p>

                                <p className="text-lg font-bold text-red-600 mt-2">
                                    Rs. {Number(total).toLocaleString()}
                                </p>
                            </div>
                        </>
                    )}

                    {/* CART ITEMS */}
                    {!buyNow && cartItems && (
                        <div className="space-y-3">
                            {cartItems.map((item, index) => (
                                <div key={index} className="flex gap-4 border-b pb-3">
                                    <img src={item.image} className="w-20 h-20 rounded-lg border" />
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-gray-600">Size: {item.size_value}</p>
                                        <p className="text-gray-600">Qty: {item.qty}</p>
                                        <p className="font-bold text-red-600">
                                            Rs. {(item.price * item.qty).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            <h2 className="text-2xl mt-4 font-bold text-red-600">
                                Total: Rs. {total.toLocaleString()}
                            </h2>
                        </div>
                    )}
                </div>

                {/* SHIPPING INFO */}
                <div className="border rounded-xl p-5 shadow">
                    <h2 className="text-xl font-bold mb-4">Shipping Details</h2>

                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full border px-4 py-2 rounded-lg"
                        />

                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full border px-4 py-2 rounded-lg"
                        />

                        <textarea
                            placeholder="Full Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full border px-4 py-2 rounded-lg h-28"
                        />

                        <button
                            onClick={placeOrder}
                            className="w-full mt-4 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700"
                        >
                            Place Order (Cash On Delivery)
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
