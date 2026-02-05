import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/header";
import Footer from "../components/footer";
import ProductCard from "../components/productCart";
import { Sparkles, Package, Loader2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Snowfall from "../components/snow";

export default function NewProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Load new products
    useEffect(() => {
        async function loadNewProducts() {
            try {
                const res = await axios.get("http://localhost:3000/api/products/new-products");
                setProducts(res.data);
            } catch (error) {
                console.error("Error loading new products:", error);
            } finally {
                setLoading(false);
            }
        }

        loadNewProducts();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <Snowfall flakes={60}/>
            
            {/* Hero Section */}
            <section className="bg-black border-b-4 border-red-600">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        
                        {/* Left - Title */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-600 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-black text-white">
                                    NEW <span className="text-red-600">ARRIVALS</span>
                                </h1>
                                <p className="text-gray-400 text-sm mt-1">
                                    Fresh styles just dropped
                                </p>
                            </div>
                        </div>

                        {/* Right - Product Count */}
                        <div className="bg-white/10 px-4 py-2">
                            <p className="text-white text-sm">
                                <span className="font-black text-red-600">{products.length}</span> new products
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    
                    {/* Loading */}
                    {loading && (
                        <div className="flex items-center justify-center py-32">
                            <div className="text-center">
                                <Loader2 className="w-10 h-10 text-red-600 animate-spin mx-auto mb-4" />
                                <p className="text-gray-500 font-medium">Loading new arrivals...</p>
                            </div>
                        </div>
                    )}

                    {/* Products Grid - Using Your Existing ProductCard */}
                    {!loading && products.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.product_id} product={product} />
                            ))}
                        </div>
                    )}

                    {/* No Products */}
                    {!loading && products.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-32">
                            <Package className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-xl font-black mb-2">NO NEW PRODUCTS</h3>
                            <p className="text-gray-500 mb-6">Check back soon for new arrivals</p>
                            <button
                                onClick={() => navigate("/products")}
                                className="bg-red-600 hover:bg-black text-white px-6 py-3 font-bold text-sm transition-all flex items-center gap-2"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                VIEW ALL PRODUCTS
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}