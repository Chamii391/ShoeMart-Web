import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ShoppingCart, Zap, Star, Heart, Minus, Plus, MessageCircle, Check, X } from "lucide-react";
import { addToCart } from "../utils/cart";
import Header from "../components/header";
import Footer from "../components/footer";

export default function ProductOverview() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [comment, setComment] = useState("");
    const [feedbacks, setFeedbacks] = useState([]);
    
    // Image zoom states
    const [isZooming, setIsZooming] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        async function loadProduct() {
            try {
                const res = await axios.get(`http://localhost:3000/api/products/view_product/${id}`);
                setProduct(res.data);
                setSelectedImage(res.data.images[0]);
            } catch (error) {
                toast.error("Error loading product");
            } finally {
                setLoading(false);
            }
        }

        async function increaseView() {
            try {
                await axios.post(`http://localhost:3000/api/products/increase_views/${id}`);
            } catch (error) {
                console.log("View count error:", error);
            }
        }

        loadProduct();
        increaseView();
        loadFeedback();
    }, [id]);

    async function loadFeedback() {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                `http://localhost:3000/api/feedbacks/view_feedback/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFeedbacks(res.data.feedbacks || []);
        } catch (error) {
            console.log(error);
        }
    }

    async function submitFeedback() {
        if (!comment.trim()) return toast.error("Please write feedback");

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:3000/api/feedbacks/add_feedback",
                { product_id: id, comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Feedback added!");
            setComment("");
            loadFeedback();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error submitting feedback");
        }
    }

    // Image zoom handlers
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPosition({ x, y });
    };

    const handleMouseEnter = () => {
        setIsZooming(true);
    };

    const handleMouseLeave = () => {
        setIsZooming(false);
    };

    function handleSizeSelect(sizeObj) {
        setSelectedSize(sizeObj);
        setQuantity(1);
    }

    function increaseQty() {
        if (!selectedSize) return toast.error("Select a size first");
        if (quantity < selectedSize.stock) {
            setQuantity(quantity + 1);
        } else {
            toast.error("Max stock reached");
        }
    }

    function decreaseQty() {
        if (quantity > 1) setQuantity(quantity - 1);
    }

    function handleAddToCart() {
        if (!selectedSize) return toast.error("Please select a size first");
        try {
            addToCart(product, selectedSize, quantity);
            toast.success("Added to cart!");
        } catch (error) {
            toast.error(error.message);
        }
    }

    function handleBuyNow() {
        if (!selectedSize) return toast.error("Please select a size first");
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

    if (loading) {
        return (
            <>
                <Header />
                <div className="flex items-center justify-center h-96">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
                </div>
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Header />
                <div className="text-center py-20">
                    <h2 className="text-2xl font-black mb-4">Product Not Found</h2>
                    <button onClick={() => navigate('/products')} className="bg-red-600 text-white px-6 py-3 font-bold">
                        Browse Products
                    </button>
                </div>
            </>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Breadcrumb */}
            <div className="bg-gray-50 border-b">
                <div className="max-w-7xl mx-auto px-6 py-3">
                    <div className="flex items-center gap-2 text-sm">
                        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-red-600">Home</button>
                        <span className="text-gray-300">/</span>
                        <button onClick={() => navigate('/products')} className="text-gray-500 hover:text-red-600">Products</button>
                        <span className="text-gray-300">/</span>
                        <span className="font-bold text-black truncate max-w-xs">{product.name}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* LEFT - Image Gallery with Zoom */}
                    <div>
                        {/* Main Image with Zoom */}
                        <div 
                            className="relative bg-gray-100 aspect-square mb-4 overflow-hidden cursor-crosshair group"
                            onMouseMove={handleMouseMove}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-200"
                                style={{
                                    transform: isZooming ? `scale(2)` : 'scale(1)',
                                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                                }}
                            />
                            
                            {/* Zoom Indicator */}
                            {isZooming && (
                                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 text-xs font-bold">
                                    🔍 ZOOMED
                                </div>
                            )}

                            {/* Wishlist */}
                            <button className="absolute top-4 right-4 bg-white hover:bg-red-600 hover:text-white p-3 shadow-lg transition-all">
                                <Heart className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Thumbnails */}
                        <div className="grid grid-cols-4 gap-3">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(img)}
                                    className={`aspect-square border-2 transition-all ${
                                        selectedImage === img 
                                            ? "border-red-600 scale-105" 
                                            : "border-gray-200 hover:border-black"
                                    }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Zoom Hint */}
                        <p className="text-xs text-gray-400 text-center mt-3">
                            Hover over image to zoom
                        </p>
                    </div>

                    {/* RIGHT - Product Details */}
                    <div>
                        {/* Product Name */}
                        <h1 className="text-4xl font-black text-black mb-3 leading-tight">
                            {product.name}
                        </h1>
                        
                        {product.altNames && (
                            <p className="text-gray-500 mb-4">{product.altNames}</p>
                        )}

                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-red-600 text-red-600" />
                                ))}
                            </div>
                            <span className="text-sm font-medium text-gray-600">
                                4.8 ({feedbacks.length} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="bg-gray-50 p-6 mb-6">
                            <div className="flex items-baseline gap-4">
                                <p className="text-5xl font-black text-red-600">
                                    Rs. {Number(product.price).toLocaleString()}
                                </p>
                                <div className="flex flex-col">
                                    <span className="text-gray-400 line-through text-lg">
                                        Rs. {Math.round(Number(product.price) * 1.3).toLocaleString()}
                                    </span>
                                    <span className="bg-red-600 text-white px-2 py-1 text-xs font-black inline-block">
                                        SAVE 23%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-black text-lg">SELECT SIZE</h3>
                                <button className="text-sm text-red-600 hover:underline">Size Guide</button>
                            </div>

                            <div className="grid grid-cols-5 gap-2">
                                {product.sizes.map((s, index) => (
                                    <button
                                        key={index}
                                        disabled={s.stock === 0}
                                        onClick={() => handleSizeSelect(s)}
                                        className={`relative py-3 border-2 font-bold transition-all ${
                                            selectedSize?.size_value === s.size_value
                                                ? "bg-red-600 text-white border-red-600"
                                                : s.stock === 0
                                                ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed"
                                                : "border-black hover:bg-black hover:text-white"
                                        }`}
                                    >
                                        {s.size_value}
                                        {s.stock === 0 && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-full h-px bg-red-500 transform rotate-45"></div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="mb-6">
                            <h3 className="font-black text-lg mb-3">QUANTITY</h3>
                            
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border-2 border-black">
                                    <button
                                        onClick={decreaseQty}
                                        disabled={quantity === 1}
                                        className="px-5 py-3 hover:bg-black hover:text-white transition-all disabled:opacity-30"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-6 py-3 font-black text-xl border-x-2 border-black min-w-[70px] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={increaseQty}
                                        className="px-5 py-3 hover:bg-black hover:text-white transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                {selectedSize && (
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${selectedSize.stock > 5 ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                                        <p className="text-sm font-medium text-gray-600">
                                            {selectedSize.stock} in stock
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 mb-6">
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-black hover:bg-red-600 text-white py-4 font-black text-base tracking-wider transition-all flex items-center justify-center gap-3 group"
                            >
                                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                ADD TO CART
                            </button>

                            <button
                                onClick={handleBuyNow}
                                className="w-full bg-red-600 hover:bg-black text-white py-4 font-black text-base tracking-wider transition-all flex items-center justify-center gap-3 group"
                            >
                                <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                BUY NOW
                            </button>
                        </div>

                        {/* Features */}
                        <div className="border-t-2 border-gray-100 pt-6 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 flex items-center justify-center">
                                    <Check className="w-5 h-5 text-green-600" />
                                </div>
                                <span className="text-sm font-medium">Free shipping over Rs. 5,000</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 flex items-center justify-center">
                                    <Check className="w-5 h-5 text-green-600" />
                                </div>
                                <span className="text-sm font-medium">100% authentic guarantee</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 flex items-center justify-center">
                                    <Check className="w-5 h-5 text-green-600" />
                                </div>
                                <span className="text-sm font-medium">Easy 30-day returns</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="border-t-2 border-gray-100 mt-6 pt-6">
                            <h3 className="font-black text-lg mb-3">DESCRIPTION</h3>
                            <p className="text-gray-700 leading-relaxed">{product.description}</p>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-16 border-t-4 border-black pt-10">
                    <div className="flex items-center gap-3 mb-8">
                        <MessageCircle className="w-7 h-7 text-red-600" />
                        <h2 className="text-3xl font-black">CUSTOMER REVIEWS</h2>
                        <span className="bg-red-600 text-white px-3 py-1 text-sm font-bold">
                            {feedbacks.length}
                        </span>
                    </div>

                    {/* Write Review */}
                    <div className="bg-gray-50 p-6 mb-8 border-l-4 border-red-600">
                        <h3 className="font-black mb-4">SHARE YOUR EXPERIENCE</h3>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us what you think about this product..."
                            className="w-full p-4 border-2 border-gray-200 focus:border-red-600 outline-none resize-none"
                            rows="4"
                        />
                        <button
                            onClick={submitFeedback}
                            className="mt-4 bg-red-600 hover:bg-black text-white px-8 py-3 font-bold text-sm tracking-wider transition-all"
                        >
                            SUBMIT REVIEW
                        </button>
                    </div>

                    {/* Reviews List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {feedbacks.length === 0 ? (
                            <div className="col-span-2 text-center py-12 bg-gray-50">
                                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No reviews yet. Be the first!</p>
                            </div>
                        ) : (
                            feedbacks.map((f, index) => (
                                <div key={index} className="bg-white border-2 border-gray-100 p-5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-red-600 text-white flex items-center justify-center font-black text-lg">
                                            {f.user_name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-black">{f.user_name}</p>
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="w-3 h-3 fill-red-600 text-red-600" />
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {new Date(f.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed">{f.comment}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}