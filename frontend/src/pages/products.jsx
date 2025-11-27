import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/productCart";
import Header from "../components/header";
import Footer from "../components/footer";
import { Search, X, TrendingUp, Package, Filter } from "lucide-react";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("featured");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchSuggestions, setSearchSuggestions] = useState([]);

    useEffect(() => {
        async function loadProducts() {
            try {
                const res = await axios.get("http://localhost:3000/api/products/view_products");
                setProducts(res.data);
            } catch (error) {
                console.error("Error loading products:", error);
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, []);

    // Update search suggestions when query changes
    useEffect(() => {
        if (searchQuery.length > 0) {
            const suggestions = products
                .filter(product => 
                    product.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .slice(0, 5) // Show max 5 suggestions
                .map(product => ({
                    id: product.product_id,
                    name: product.name,
                    category: product.main_category,
                    price: product.price
                }));
            
            setSearchSuggestions(suggestions);
            setShowSuggestions(suggestions.length > 0);
        } else {
            setSearchSuggestions([]);
            setShowSuggestions(false);
        }
    }, [searchQuery, products]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle suggestion click
    const handleSuggestionClick = (productName) => {
        setSearchQuery(productName);
        setShowSuggestions(false);
    };

    // Handle clicking outside to close suggestions
    const handleSearchBlur = () => {
        setTimeout(() => setShowSuggestions(false), 200);
    };

    // Filter and sort products
    const filteredProducts = products
        .filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "all" || product.main_category === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === "price-low") return a.price - b.price;
            if (sortBy === "price-high") return b.price - a.price;
            if (sortBy === "name") return a.name.localeCompare(b.name);
            return 0;
        });

    return (
        <div className="min-h-screen bg-white">
            <Header />
            
            {/* Compact Hero Section */}
            <section className="bg-black border-b-4 border-red-600">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        
                        {/* Left - Title */}
                        <div>
                            <h1 className="text-4xl font-black text-white">
                                ALL <span className="text-red-600">PRODUCTS</span>
                            </h1>
                            <p className="text-gray-400 text-sm mt-2">
                                {products.length} items available
                            </p>
                        </div>

                        {/* Right - Search with Suggestions */}
                        <div className="relative w-full lg:w-96">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={() => searchQuery && setShowSuggestions(true)}
                                    onBlur={handleSearchBlur}
                                    className="w-full pl-12 pr-10 py-3 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                                />
                                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                {searchQuery && (
                                    <button 
                                        onClick={() => {
                                            setSearchQuery("");
                                            setShowSuggestions(false);
                                        }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2"
                                    >
                                        <X className="w-5 h-5 text-gray-400 hover:text-black" />
                                    </button>
                                )}

                                {/* Search Suggestions Dropdown */}
                                {showSuggestions && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-red-600 shadow-xl z-50">
                                        {searchSuggestions.map((suggestion) => (
                                            <button
                                                key={suggestion.id}
                                                onClick={() => handleSuggestionClick(suggestion.name)}
                                                className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors border-b border-gray-100 last:border-0"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-bold text-black hover:text-red-600">
                                                            {suggestion.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {suggestion.category}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm font-black text-red-600">
                                                        Rs.{suggestion.price.toLocaleString()}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                        
                                        {searchSuggestions.length > 0 && (
                                            <div className="bg-black text-white p-2 text-center">
                                                <button 
                                                    onClick={() => setShowSuggestions(false)}
                                                    className="text-xs font-bold hover:text-red-600"
                                                >
                                                    VIEW ALL {filteredProducts.length} RESULTS
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filter & Sort Bar */}
            <section className="sticky top-[72px] bg-white border-b border-gray-200 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        
                        {/* Categories */}
                        <div className="flex items-center gap-6">
                            {["all", "men", "women", "child"].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`font-bold text-sm tracking-wide transition-all ${
                                        selectedCategory === cat
                                            ? "text-red-600 border-b-2 border-red-600"
                                            : "text-gray-400 hover:text-black"
                                    }`}
                                >
                                    {cat.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        {/* Sort & Count */}
                        <div className="flex items-center gap-6">
                            <span className="text-sm text-gray-500">
                                <span className="font-black text-black">{filteredProducts.length}</span> items
                            </span>
                            
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-1 bg-gray-100 text-sm font-medium focus:outline-none cursor-pointer"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="name">Name</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    
                    {/* Loading */}
                    {loading && (
                        <div className="flex items-center justify-center py-32">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 mb-4">
                                    <div className="w-full h-full border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
                                </div>
                                <p className="text-gray-500 font-medium">Loading products...</p>
                            </div>
                        </div>
                    )}

                    {/* Products */}
                    {!loading && filteredProducts.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.product_id} product={product} />
                            ))}
                        </div>
                    )}

                    {/* No Results */}
                    {!loading && filteredProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-32">
                            <Package className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-xl font-black mb-2">No Products Found</h3>
                            <p className="text-gray-500 mb-4">Try adjusting your search</p>
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory("all");
                                }}
                                className="bg-red-600 hover:bg-black text-white px-6 py-2 font-bold text-sm transition-all"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}