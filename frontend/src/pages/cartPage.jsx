import { useEffect, useState } from "react";
import {
    getCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    getCartTotal
} from "../utils/cart";
import { Trash2, Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    // Load cart safely (React 18 strict mode)
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
    }

    // Delete one
    function deleteItem(item) {
        const updated = removeFromCart(item.product_id, item.size_value);
        setCart(updated);
        toast.success("Item removed");
    }

    // Clear all
    function handleClearCart() {
        clearCart();
        setCart([]);
        toast.success("Cart cleared");
    }

    const total = getCartTotal();

    // --- CHECKOUT ALL CART ITEMS ---
    function goToCheckout() {
        if (cart.length === 0) {
            toast.error("Your cart is empty!");
            return;
        }

        navigate("/checout", {
            state: {
                checkoutItems: cart,   // pass full cart
                total: total
            }
        });
    }

    return (
        <div className="max-w-4xl mx-auto p-6">

            <h1 className="text-3xl font-bold text-red-600 mb-6">
                🛒 Your Cart
            </h1>

            {cart.length === 0 && (
                <div className="text-center text-gray-600 text-lg py-20">
                    Your cart is empty 😔
                </div>
            )}

            {cart.length > 0 && (
                <div className="space-y-4">

                    {/* Clear Cart */}
                    <div className="flex justify-between mb-4">
                        <button
                            onClick={handleClearCart}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                            Clear Cart
                        </button>

                        {/* Checkout Button */}
                        <button
                            onClick={goToCheckout}
                            className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800"
                        >
                            Proceed to Checkout →
                        </button>
                    </div>

                    {/* Items */}
                    {cart.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 bg-white shadow-md p-4 rounded-xl border border-red-300"
                        >
                            {/* Image */}
                            <img
                                src={item.image}
                                className="w-24 h-24 object-cover rounded-lg border"
                            />

                            {/* Details */}
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-black">
                                    {item.name}
                                </h2>

                                <p className="text-gray-600">
                                    Size: <b>{item.size_value}</b>
                                </p>

                                <p className="text-gray-700 font-semibold">
                                    Rs. {item.price.toLocaleString()}
                                </p>
                            </div>

                            {/* Quantity */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => decreaseQty(item)}
                                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                                >
                                    <Minus size={18} />
                                </button>

                                <span className="text-xl font-bold">{item.qty}</span>

                                <button
                                    onClick={() => increaseQty(item)}
                                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            {/* Delete */}
                            <button
                                onClick={() => deleteItem(item)}
                                className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}

                    {/* Total */}
                    <div className="mt-6 p-4 bg-gray-100 rounded-xl shadow flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Total:</h2>
                        <p className="text-3xl font-bold text-red-600">
                            Rs. {total.toLocaleString()}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
