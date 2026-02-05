import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/productCart";
import Header from "../components/header";
import Footer from "../components/footer";
import { 
  Search, 
  X, 
  Package, 
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid,
  ChevronDown,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Snowfall from "../components/snow";

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [gridView, setGridView] = useState("grid-4");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Get category from URL params
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

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

  // Helper function to safely check alt names
  const checkAltNames = (product, query) => {
    if (!product.altNames) return false;
    if (typeof product.altNames === 'string') {
      return product.altNames.toLowerCase().includes(query);
    }
    if (Array.isArray(product.altNames)) {
      return product.altNames.some(altName => 
        altName && altName.toLowerCase().includes(query)
      );
    }
    return false;
  };

  // Helper function to get alt names as array
  const getAltNamesArray = (product) => {
    if (!product.altNames) return [];
    if (typeof product.altNames === 'string') {
      return product.altNames.split(',').map(name => name.trim()).filter(Boolean);
    }
    if (Array.isArray(product.altNames)) {
      return product.altNames.filter(Boolean);
    }
    return [];
  };

  // Update search suggestions
  useEffect(() => {
    if (searchQuery.length > 0) {
      const query = searchQuery.toLowerCase();
      const suggestions = products
        .filter(product => {
          const matchesName = product.name?.toLowerCase().includes(query);
          const matchesAltName = checkAltNames(product, query);
          const matchesBrand = product.brand?.toLowerCase().includes(query);
          return matchesName || matchesAltName || matchesBrand;
        })
        .slice(0, 5)
        .map(product => ({
          id: product.product_id,
          name: product.name,
          altNames: getAltNamesArray(product)
        }));

      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, products]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleSuggestionClick = (productName) => {
    setSearchQuery(productName);
    setShowSuggestions(false);
  };
  const handleSearchBlur = () => setTimeout(() => setShowSuggestions(false), 200);
  const clearSearch = () => {
    setSearchQuery("");
    setShowSuggestions(false);
  };
  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("featured");
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const query = searchQuery.toLowerCase();
      const matchesName = product.name?.toLowerCase().includes(query);
      const matchesAltName = checkAltNames(product, query);
      const matchesBrand = product.brand?.toLowerCase().includes(query);
      const matchesSearch = !query || matchesName || matchesAltName || matchesBrand;
      const matchesCategory = selectedCategory === "all" || product.main_category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-high") return (b.price || 0) - (a.price || 0);
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      return 0;
    });

  const categories = [
    { id: "all", label: "All" },
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "child", label: "Kids" },
  ];

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name", label: "Name" },
  ];

  // Highlight matching text
  const highlightMatch = (text, query) => {
    if (!query || !text) return text;
    try {
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
      return parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() 
          ? <span key={i} className="text-red-600 font-semibold">{part}</span>
          : part
      );
    } catch {
      return text;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      <Snowfall flakes={60} />

      {/* ═══════════════════════════════════════════════════════════════════════
          MAIN FILTER BAR - Search + Categories + Sort
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="sticky top-0 z-40 bg-white border-b border-gray-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Search Bar Row */}
          <div className="py-4 border-b border-gray-100">
            <div className="relative max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery && setShowSuggestions(true)}
                  onBlur={handleSearchBlur}
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-100/80 hover:bg-gray-100 focus:bg-white border-2 border-transparent focus:border-red-500 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>

              {/* Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  {searchSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion.name)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-red-50 transition-colors">
                        <Search className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-red-600 transition-colors">
                          {highlightMatch(suggestion.name, searchQuery)}
                        </p>
                        {suggestion.altNames?.length > 0 && (
                          <p className="text-xs text-gray-400 truncate">
                            Also: {suggestion.altNames.slice(0, 2).join(", ")}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Categories & Sort Row */}
          <div className="flex items-center justify-between py-3 gap-4">
            
            {/* Categories - Desktop */}
            <div className="hidden md:flex items-center gap-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === cat.id
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Mobile Filter */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </button>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-9 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 focus:outline-none cursor-pointer transition-colors"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Grid Toggle - Desktop */}
              <div className="hidden lg:flex items-center bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setGridView("grid-3")}
                  className={`p-2 rounded-full transition-all ${
                    gridView === "grid-3" ? "bg-white shadow-sm" : "text-gray-400"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGridView("grid-4")}
                  className={`p-2 rounded-full transition-all ${
                    gridView === "grid-4" ? "bg-white shadow-sm" : "text-gray-400"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Categories */}
          {showMobileFilters && (
            <div className="md:hidden pb-3 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setShowMobileFilters(false);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          ACTIVE FILTERS CHIPS
      ═══════════════════════════════════════════════════════════════════════ */}
      {(searchQuery || selectedCategory !== "all") && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Active:</span>
              
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium">
                  "{searchQuery}"
                  <button onClick={clearSearch} className="hover:bg-red-100 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium capitalize">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory("all")} className="hover:bg-gray-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              <button onClick={clearAllFilters} className="text-xs text-gray-400 hover:text-red-600 underline ml-2">
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          PRODUCTS GRID
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-gray-200 rounded-full" />
                <div className="absolute inset-0 w-12 h-12 border-4 border-red-600 rounded-full border-t-transparent animate-spin" />
              </div>
              <p className="mt-4 text-gray-400 text-sm">Loading products...</p>
            </div>
          )}

          {/* Products */}
          {!loading && filteredProducts.length > 0 && (
            <div className={`grid gap-5 ${
              gridView === "grid-3"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }`}>
              {filteredProducts.map((product, index) => (
                <div
                  key={product.product_id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Package className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-400 text-sm mb-6 text-center max-w-sm">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-red-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}