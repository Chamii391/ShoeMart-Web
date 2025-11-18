import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ShoppingCart, Bolt } from "lucide-react";
import { addToCart } from "../utils/cart";

export default function ProductOverview() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // FEEDBACK STATE
    const [comment, setComment] = useState("");
    const [feedbacks, setFeedbacks] = useState([]);

    // ---------------------------------------------------
    // Load product
    // ---------------------------------------------------
    useEffect(() => {
        async function loadProduct() {
            try {
                const res = await axios.get(
                    `http://localhost:3000/api/products/view_product/${id}`
                );
                setProduct(res.data);
                setSelectedImage(res.data.images[0]);
            } catch (error) {
                toast.error("Error loading product");
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        loadProduct();
        loadFeedback();
    }, [id]);

    // ---------------------------------------------------
    // Load Feedback
    // ---------------------------------------------------
    async function loadFeedback() {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(
                `http://localhost:3000/api/feedbacks/view_feedback/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setFeedbacks(res.data.feedbacks || []);
        } catch (error) {
            console.log(error);
        }
    }

    // ---------------------------------------------------
    // Submit Feedback
    // ---------------------------------------------------
    async function submitFeedback() {
        if (!comment.trim()) return toast.error("Please write feedback");

        try {
            const token = localStorage.getItem("token");

            await axios.post(
                "http://localhost:3000/api/feedbacks/add_feedback",
                {
                    product_id: id,
                    comment
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            toast.success("Feedback added successfully!");
            setComment(""); // clear text
            loadFeedback(); // reload list
        } catch (error) {
            toast.error(error.response?.data?.message || "Error submitting feedback");
        }
    }

    // ---------------------------------------------------
    // Size select
    // ---------------------------------------------------
    function handleSizeSelect(sizeObj) {
        setSelectedSize(sizeObj);
        setQuantity(1);
    }

    // Increase quantity
    function increaseQty() {
        if (!selectedSize) return toast.error("Select a size first");

        if (quantity < selectedSize.stock) {
            setQuantity(quantity + 1);
        } else {
            toast.error("Cannot select more than available stock");
        }
    }

    // Decrease quantity
    function decreaseQty() {
        if (quantity > 1) setQuantity(quantity - 1);
    }

    // ---- ADD TO CART ----
    function handleAddToCart() {
        if (!selectedSize)
            return toast.error("Please select a size first");

        try {
            addToCart(product, selectedSize, quantity);
            toast.success("Added to cart!");
        } catch (error) {
            toast.error(error.message);
        }
    }

    // ---- BUY NOW ----
    function handleBuyNow() {
        if (!selectedSize)
            return toast.error("Please select a size first");

        navigate("/checout", {
            state: {
                buyNow: {
                    product_id: product.product_id,
                    name: product.name,
                    size: selectedSize.size_value,
                    qty: quantity,
                    price: product.price,
                    image: product.images[0]
                }
            }
        });
    }

    // ---------------------------------------------------
    // UI HANDLING
    // ---------------------------------------------------
    if (loading) {
        return (
            <div className="p-10 text-center text-gray-600 text-xl">
                Loading product...
            </div>
        );
    }

    if (!product) {
        return (
            <div className="p-10 text-center text-red-600 text-xl">
                Product not found
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                {/* IMAGE GALLERY */}
                <div>
                    <div className="w-full h-96 bg-gray-100 rounded-xl overflow-hidden border flex items-center justify-center">
                        <img
                            src={selectedImage}
                            className="w-full h-full object-cover"
                            alt=""
                        />
                    </div>

                    <div className="flex gap-3 mt-4">
                        {product.images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                onClick={() => setSelectedImage(img)}
                                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border 
                                    ${selectedImage === img ? "border-red-600" : "border-gray-300"}
                                `}
                            />
                        ))}
                    </div>
                </div>

                {/* PRODUCT DETAILS */}
                <div>
                    <h1 className="text-3xl font-bold text-black">{product.name}</h1>
                    <p className="text-gray-600 mt-1">{product.altNames}</p>

                    <p className="text-red-600 text-3xl font-bold mt-4">
                        Rs. {Number(product.price).toLocaleString()}
                    </p>

                    {/* Sizes */}
                    <div className="mt-6">
                        <h3 className="font-bold text-lg mb-2">Select Size</h3>

                        <div className="flex gap-3 flex-wrap">
                            {product.sizes.map((s, index) => (
                                <button
                                    key={index}
                                    disabled={s.stock === 0}
                                    onClick={() => handleSizeSelect(s)}
                                    className={`px-4 py-2 rounded-lg border font-semibold transition
                                        ${
                                            selectedSize?.size_value === s.size_value
                                                ? "bg-red-600 text-white border-red-700"
                                                : "bg-white text-black border-gray-400"
                                        }
                                        ${
                                            s.stock === 0
                                                ? "opacity-40 cursor-not-allowed"
                                                : "hover:bg-red-100"
                                        }
                                    `}
                                >
                                    Size {s.size_value}
                                    <span
                                        className={`block text-xs mt-1 ${
                                            s.stock === 0
                                                ? "text-red-500"
                                                : "text-green-600"
                                        }`}
                                    >
                                        {s.stock === 0 ? "Out of Stock" : "In Stock"}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="mt-6">
                        <h3 className="font-bold text-lg mb-2">Quantity</h3>

                        {!selectedSize ? (
                            <p className="text-red-500 text-sm">Select a size first</p>
                        ) : (
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={decreaseQty}
                                    className="px-4 py-2 bg-gray-200 text-black font-bold rounded-lg hover:bg-gray-300"
                                >
                                    –
                                </button>

                                <span className="text-xl font-bold">{quantity}</span>

                                <button
                                    onClick={increaseQty}
                                    className="px-4 py-2 bg-gray-200 text-black font-bold rounded-lg hover:bg-gray-300"
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={handleAddToCart}
                            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
                        >
                            <ShoppingCart size={20} />
                            Add to Cart
                        </button>

                        <button
                            onClick={handleBuyNow}
                            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900"
                        >
                            <Bolt size={20} />
                            Buy Now
                        </button>
                    </div>

                    {/* Description */}
                    <div className="mt-6">
                        <h3 className="font-bold text-lg">Description</h3>
                        <p className="text-gray-700 mt-2">{product.description}</p>
                    </div>
                </div>
            </div>

            {/* FEEDBACK SECTION */}
            <div className="mt-12 border-t pt-8">
                <h2 className="text-2xl font-bold mb-4">Customer Feedback</h2>

                {/* Write Feedback */}
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your feedback..."
                    className="w-full p-3 border rounded-lg"
                    rows="3"
                ></textarea>

                <button
                    onClick={submitFeedback}
                    className="mt-3 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
                >
                    Submit Feedback
                </button>

                {/* Feedback List */}
                <div className="mt-6">
                    {feedbacks.length === 0 ? (
                        <p className="text-gray-500">No feedback yet.</p>
                    ) : (
                        feedbacks.map((f, index) => (
                            <div
                                key={index}
                                className="bg-gray-100 p-4 rounded-lg mb-3"
                            >
                                <p className="font-semibold">{f.user_name}</p>
                                <p className="text-gray-700">{f.comment}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(f.created_at).toLocaleString()}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
