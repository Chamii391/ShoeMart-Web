import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { 
    ShoppingCart, Zap, Star, Heart, Minus, Plus, MessageCircle, 
    Check, ChevronRight, Truck, Shield, RotateCcw, Share2, 
    ChevronLeft, ZoomIn, Loader2, Package, Send, ArrowRight
} from "lucide-react";
import { addToCart } from "../utils/cart";
import Header from "../components/header";
import Footer from "../components/footer";
import ProductCard from "../components/productCart";
import Snowfall from "../components/snow";

export default function ProductOverview() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageIndex, setImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [comment, setComment] = useState("");
    const [feedbacks, setFeedbacks] = useState([]);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    
    // Related Products State
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loadingRelated, setLoadingRelated] = useState(true);
    
    // Image zoom
    const [isZooming, setIsZooming] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        loadProduct();
        loadFeedback();
        increaseView();
    }, [id]);

    // Load related products when product loads
    useEffect(() => {
        if (product) {
            loadRelatedProducts();
        }
    }, [product]);

    async function loadProduct() {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:3000/api/products/view_product/${id}`);
            setProduct(res.data);
            setSelectedImage(res.data.images[0]);
        } catch (error) {
            toast.error("Error loading product");
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    // Load Related Products (Frontend Only)
    async function loadRelatedProducts() {
        setLoadingRelated(true);
        try {
            const res = await axios.get("http://localhost:3000/api/products/view_products");
            
            // Filter by same category and exclude current product
            const related = res.data
                .filter(p => 
                    p.main_category === product.main_category && 
                    p.product_id !== product.product_id
                )
                .slice(0, 4); // Get only 4 products
            
            setRelatedProducts(related);
        } catch (error) {
            console.log("Error loading related products:", error);
        } finally {
            setLoadingRelated(false);
        }
    }

    async function loadFeedback() {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:3000/api/feedbacks/view_feedback/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFeedbacks(res.data.feedbacks || []);
        } catch (error) {
            console.log(error);
        }
    }

    async function increaseView() {
        try {
            await axios.post(`http://localhost:3000/api/products/increase_views/${id}`);
        } catch (error) {
            console.log(error);
        }
    }

    async function submitFeedback() {
        if (!comment.trim()) return toast.error("Please write a review");
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:3000/api/feedbacks/add_feedback",
                { product_id: id, comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Review submitted!");
            setComment("");
            loadFeedback();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error submitting review");
        }
    }

    // Image handlers
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setZoomPosition({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100
        });
    };

    const changeImage = (direction) => {
        const newIndex = direction === "next" 
            ? (imageIndex + 1) % product.images.length
            : imageIndex === 0 ? product.images.length - 1 : imageIndex - 1;
        setImageIndex(newIndex);
        setSelectedImage(product.images[newIndex]);
    };

    const selectImage = (img, idx) => {
        setSelectedImage(img);
        setImageIndex(idx);
    };

    // Size & Quantity
    const handleSizeSelect = (size) => {
        setSelectedSize(size);
        setQuantity(1);
    };

    const updateQuantity = (type) => {
        if (type === "inc" && selectedSize && quantity < selectedSize.stock) {
            setQuantity(q => q + 1);
        } else if (type === "dec" && quantity > 1) {
            setQuantity(q => q - 1);
        }
    };

    // Cart actions
    const handleAddToCart = () => {
        if (!selectedSize) return toast.error("Select a size");
        setAddingToCart(true);
        try {
            addToCart(product, selectedSize, quantity);
            toast.success("Added to cart!");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setTimeout(() => setAddingToCart(false), 500);
        }
    };

    const handleBuyNow = () => {
        if (!selectedSize) return toast.error("Select a size");
        navigate("/checkout", {
            state: {
                buyNow: {
                    product_id: product.product_id,
                    name: product.name,
                    size: selectedSize.size_value,
                    size_id: selectedSize.size_id,
                    qty: quantity,
                    price: product.price,
                    image: product.images[0]
                }
            }
        });
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied!");
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="flex items-center justify-center h-96">
                    <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                </div>
            </div>
        );
    }

    // Not found
    if (!product) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="flex flex-col items-center justify-center h-96">
                    <Package className="w-16 h-16 text-gray-300 mb-4" />
                    <h2 className="text-xl font-black mb-4">PRODUCT NOT FOUND</h2>
                    <button onClick={() => navigate('/products')} className="bg-black text-white px-6 py-3 font-bold">
                        BROWSE PRODUCTS
                    </button>
                </div>
            </div>
        );
    }

    const totalStock = product.sizes?.reduce((sum, s) => sum + s.stock, 0) || 0;

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <Snowfall flakes={60}/>

            {/* Breadcrumb */}
            <div className="bg-black text-white">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-sm">
                    <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white">Home</button>
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                    <button onClick={() => navigate('/products')} className="text-gray-400 hover:text-white">Products</button>
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                    <span className="font-bold truncate max-w-[200px]">{product.name}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* LEFT - Images */}
                    <div className="space-y-3">
                        {/* Main Image */}
                        <div 
                            className="relative bg-gray-50 aspect-square overflow-hidden cursor-crosshair group"
                            onMouseMove={handleMouseMove}
                            onMouseEnter={() => setIsZooming(true)}
                            onMouseLeave={() => setIsZooming(false)}
                        >
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform"
                                style={{
                                    transform: isZooming ? 'scale(2)' : 'scale(1)',
                                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                                }}
                            />

                            {/* Navigation */}
                            {product.images.length > 1 && (
                                <>
                                    <button onClick={() => changeImage("prev")} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-black hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => changeImage("next")} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-black hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </>
                            )}

                            {/* Zoom indicator */}
                            {isZooming && (
                                <div className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-bold flex items-center gap-1">
                                    <ZoomIn className="w-3 h-3" /> ZOOM
                                </div>
                            )}

                            {/* Actions */}
                            <div className="absolute top-3 right-3 flex flex-col gap-2">
                                <button 
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                    className={`w-10 h-10 flex items-center justify-center transition-all ${isWishlisted ? "bg-red-600 text-white" : "bg-white hover:bg-red-600 hover:text-white"}`}
                                >
                                    <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                                </button>
                                <button onClick={handleShare} className="w-10 h-10 bg-white hover:bg-black hover:text-white flex items-center justify-center transition-all">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Counter */}
                            <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 text-xs font-bold">
                                {imageIndex + 1}/{product.images.length}
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-2">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => selectImage(img, idx)}
                                    className={`w-16 h-16 border-2 overflow-hidden transition-all ${imageIndex === idx ? "border-red-600" : "border-gray-200 hover:border-black"}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT - Details */}
                    <div className="space-y-5">
                        
                        {/* Category */}
                        <span className="bg-black text-white px-3 py-1 text-xs font-bold uppercase">
                            {product.main_category}
                        </span>

                        {/* Name */}
                        <h1 className="text-2xl lg:text-3xl font-black leading-tight">{product.name}</h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-red-600 text-red-600" />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">({feedbacks.length} reviews)</span>
                            <span className="text-sm text-gray-400">• {totalStock} in stock</span>
                        </div>

                        {/* Price */}
                        <div className="bg-gray-50 p-4">
                            <p className="text-3xl font-black text-red-600">
                                Rs. {Number(product.price).toLocaleString()}
                            </p>
                        </div>

                        {/* Size Selection */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-black text-sm">SELECT SIZE</h3>
                                {selectedSize && (
                                    <span className="text-xs text-gray-500">{selectedSize.stock} available</span>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((s, idx) => {
                                    const isSelected = selectedSize?.size_value === s.size_value;
                                    const isOut = s.stock === 0;
                                    return (
                                        <button
                                            key={idx}
                                            disabled={isOut}
                                            onClick={() => handleSizeSelect(s)}
                                            className={`w-12 h-12 border-2 font-bold text-sm transition-all relative ${
                                                isSelected ? "bg-red-600 text-white border-red-600"
                                                : isOut ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed"
                                                : "border-black hover:bg-black hover:text-white"
                                            }`}
                                        >
                                            {s.size_value}
                                            {isOut && <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-px bg-red-400 rotate-45"></div></div>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div>
                            <h3 className="font-black text-sm mb-2">QUANTITY</h3>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border-2 border-black">
                                    <button onClick={() => updateQuantity("dec")} disabled={quantity === 1} className="w-10 h-10 hover:bg-black hover:text-white disabled:opacity-30 flex items-center justify-center">
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 h-10 flex items-center justify-center font-black border-x-2 border-black">
                                        {quantity}
                                    </span>
                                    <button onClick={() => updateQuantity("inc")} disabled={!selectedSize || quantity >= selectedSize.stock} className="w-10 h-10 hover:bg-black hover:text-white disabled:opacity-30 flex items-center justify-center">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                {selectedSize && (
                                    <span className="text-sm font-bold">
                                        Total: Rs. {(Number(product.price) * quantity).toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={addingToCart}
                                className="flex-1 h-12 bg-black hover:bg-gray-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                            >
                                {addingToCart ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
                                ADD TO CART
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
                            >
                                <Zap className="w-4 h-4" />
                                BUY NOW
                            </button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                            <div className="text-center p-3 bg-gray-50">
                                <Truck className="w-5 h-5 mx-auto mb-1" />
                                <p className="text-xs font-bold">Free Delivery</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50">
                                <Shield className="w-5 h-5 mx-auto mb-1" />
                                <p className="text-xs font-bold">Authentic</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50">
                                <RotateCcw className="w-5 h-5 mx-auto mb-1" />
                                <p className="text-xs font-bold">Easy Returns</p>
                            </div>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div className="pt-4 border-t border-gray-200">
                                <h3 className="font-black text-sm mb-2">DESCRIPTION</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                            </div>
                        )}

                        {/* Product Info */}
                        <div className="text-xs text-gray-400 pt-4 border-t border-gray-200 flex gap-4">
                            <span>SKU: {product.product_id}</span>
                            {product.color && <span>Color: {product.color}</span>}
                        </div>
                    </div>
                </div>

                {/* ============ RELATED PRODUCTS SECTION ============ */}
                <div className="mt-12 pt-8 border-t-2 border-black">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Package className="w-5 h-5 text-red-600" />
                            <h2 className="text-xl font-black">YOU MAY ALSO LIKE</h2>
                            <span className="bg-black text-white px-2 py-0.5 text-xs font-bold uppercase">
                                {product.main_category}
                            </span>
                        </div>
                        <button 
                            onClick={() => navigate('/products')}
                            className="text-red-600 text-sm font-bold hover:text-black flex items-center gap-1 transition-all"
                        >
                            VIEW ALL
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Loading Related */}
                    {loadingRelated && (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                        </div>
                    )}

                    {/* Related Products Grid */}
                    {!loadingRelated && relatedProducts.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard 
                                    key={relatedProduct.product_id} 
                                    product={relatedProduct} 
                                />
                            ))}
                        </div>
                    )}

                    {/* No Related Products */}
                    {!loadingRelated && relatedProducts.length === 0 && (
                        <div className="bg-gray-50 p-8 text-center">
                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm mb-4">No related products found</p>
                            <button 
                                onClick={() => navigate('/products')}
                                className="bg-black hover:bg-red-600 text-white px-6 py-2 font-bold text-sm transition-all"
                            >
                                BROWSE ALL PRODUCTS
                            </button>
                        </div>
                    )}
                </div>

                {/* Reviews Section */}
                <div className="mt-12 pt-8 border-t-2 border-black">
                    <div className="flex items-center gap-3 mb-6">
                        <MessageCircle className="w-5 h-5 text-red-600" />
                        <h2 className="text-xl font-black">REVIEWS</h2>
                        <span className="bg-black text-white px-2 py-0.5 text-xs font-bold">{feedbacks.length}</span>
                    </div>

                    {/* Write Review */}
                    <div className="bg-gray-50 p-4 mb-6">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write your review..."
                            className="w-full p-3 border-2 border-gray-200 focus:border-black outline-none resize-none text-sm"
                            rows="3"
                        />
                        <button onClick={submitFeedback} className="mt-3 bg-red-600 hover:bg-black text-white px-6 py-2 font-bold text-sm flex items-center gap-2 transition-all">
                            <Send className="w-4 h-4" />
                            SUBMIT
                        </button>
                    </div>

                    {/* Reviews List */}
                    {feedbacks.length === 0 ? (
                        <div className="text-center py-10 bg-gray-50">
                            <MessageCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">No reviews yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {feedbacks.map((f, idx) => (
                                <div key={idx} className="bg-gray-50 p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold text-sm">
                                            {f.user_name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-sm">{f.user_name}</p>
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="w-3 h-3 fill-red-600 text-red-600" />
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400">{new Date(f.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-gray-600">{f.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}