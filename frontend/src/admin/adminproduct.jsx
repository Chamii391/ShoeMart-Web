import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { 
    Trash2, 
    Edit3, 
    Package, 
    PlusCircle, 
    Search,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    Loader2,
    Download,
    RefreshCw,
    SlidersHorizontal
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function AdminProduct() {
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const itemsPerPage = 10;

    const navigate = useNavigate();

    // Load Products
    useEffect(() => {
        let isMounted = true;
        loadProducts();

        async function loadProducts() {
            try {
                const res = await axios.get("http://localhost:3000/api/products/view_products");
                if (isMounted) {
                    setProducts(res.data);
                    setFiltered(res.data);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                toast.error("Failed to load products.");
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        return () => { isMounted = false; };
    }, []);

    // Refresh
    async function refreshProducts() {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:3000/api/products/view_products");
            setProducts(res.data);
            setFiltered(res.data);
            toast.success("Refreshed");
        } catch (error) {
            toast.error("Failed to refresh");
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }

    // Delete
    async function handleDelete(productId, productName) {
        const confirm = await Swal.fire({
            title: "DELETE PRODUCT",
            html: `<p style="color:#6b7280">Are you sure you want to delete</p><p style="font-weight:700;color:#000">"${productName}"?</p>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#000000",
            confirmButtonText: "DELETE",
            cancelButtonText: "CANCEL",
            reverseButtons: true
        });

        if (!confirm.isConfirmed) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `http://localhost:3000/api/products/delete_product/${productId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Deleted successfully");
            setProducts(prev => prev.filter(p => p.product_id !== productId));
            setFiltered(prev => prev.filter(p => p.product_id !== productId));
            setSelectedProducts(prev => prev.filter(id => id !== productId));

        } catch (error) {
            toast.error(error.response?.data?.message || "Delete failed");
        }
    }

    // Bulk Delete
    async function handleBulkDelete() {
        if (selectedProducts.length === 0) return;

        const confirm = await Swal.fire({
            title: "DELETE SELECTED",
            html: `<p style="color:#6b7280">Delete <span style="font-weight:700;color:#dc2626">${selectedProducts.length}</span> selected products?</p>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#000000",
            confirmButtonText: "DELETE ALL",
            cancelButtonText: "CANCEL",
            reverseButtons: true
        });

        if (!confirm.isConfirmed) return;
        toast.success(`${selectedProducts.length} products deleted`);
        setSelectedProducts([]);
    }

    // Filter
    useEffect(() => {
        let result = products;

        if (categoryFilter !== "all") {
            result = result.filter(p => p.main_category === categoryFilter);
        }

        if (searchTerm.trim()) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.product_id.toString().includes(searchTerm)
            );
        }

        setFiltered(result);
        setCurrentPage(1);
    }, [categoryFilter, searchTerm, products]);

    // Pagination
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedProducts = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Stock calculation
    const getTotalStock = (sizes) => {
        if (!sizes || sizes.length === 0) return 0;
        return sizes.reduce((total, s) => total + (s.stock || 0), 0);
    };

    // Selection handlers
    const toggleSelect = (productId) => {
        setSelectedProducts(prev => 
            prev.includes(productId) 
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedProducts.length === paginatedProducts.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(paginatedProducts.map(p => p.product_id));
        }
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">

            {/* ============ HEADER - FIXED ============ */}
            <div className="flex-shrink-0 bg-black px-6 py-4">
                <div className="flex items-center justify-between">
                    
                    {/* Left */}
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-600 flex items-center justify-center">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white">PRODUCTS</h1>
                            <p className="text-xs text-gray-500">{products.length} total items</p>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={refreshProducts}
                            className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        </button>
                        <button className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all">
                            <Download className="w-4 h-4" />
                        </button>
                        <Link
                            to="/admin-page/add-products"
                            className="h-10 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 font-bold text-sm transition-all"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">ADD NEW</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* ============ FILTERS - FIXED ============ */}
            <div className="flex-shrink-0 bg-white border-b-2 border-gray-100 px-6 py-3">
                <div className="flex items-center gap-4">
                    
                    {/* Search */}
                    <div className="flex-1 relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 border-2 border-gray-200 focus:border-black outline-none text-sm font-medium transition-all"
                        />
                    </div>

                    {/* Category Tabs */}
                    <div className="hidden md:flex items-center border-2 border-gray-200">
                        {[
                            { key: "all", label: "All" },
                            { key: "men", label: "Men" },
                            { key: "women", label: "Women" },
                            { key: "child", label: "Kids" }
                        ].map((cat) => (
                            <button
                                key={cat.key}
                                onClick={() => setCategoryFilter(cat.key)}
                                className={`h-10 px-4 text-xs font-bold uppercase transition-all ${
                                    categoryFilter === cat.key
                                        ? "bg-black text-white"
                                        : "bg-white text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Mobile Filter */}
                    <div className="md:hidden">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="h-10 px-3 border-2 border-gray-200 text-sm font-bold"
                        >
                            <option value="all">All</option>
                            <option value="men">Men</option>
                            <option value="women">Women</option>
                            <option value="child">Kids</option>
                        </select>
                    </div>

                    {/* Results Count */}
                    <div className="hidden lg:block text-xs text-gray-500">
                        <span className="font-black text-black">{filtered.length}</span> results
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedProducts.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4">
                        <span className="text-sm font-bold">
                            <span className="text-red-600">{selectedProducts.length}</span> selected
                        </span>
                        <button 
                            onClick={() => setSelectedProducts([])}
                            className="text-xs font-bold text-gray-500 hover:text-black"
                        >
                            Clear
                        </button>
                        <button 
                            onClick={handleBulkDelete}
                            className="text-xs font-bold text-red-600 hover:text-red-700"
                        >
                            Delete Selected
                        </button>
                    </div>
                )}
            </div>

            {/* ============ TABLE CONTAINER - SCROLLABLE ============ */}
            <div className="flex-1 overflow-hidden bg-white">
                
                {/* Loading */}
                {loading && (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <Loader2 className="w-8 h-8 text-red-600 animate-spin mx-auto mb-3" />
                            <p className="text-sm font-bold text-gray-500">Loading...</p>
                        </div>
                    </div>
                )}

                {/* Empty */}
                {!loading && filtered.length === 0 && (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="font-black text-lg mb-1">NO PRODUCTS</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                {searchTerm || categoryFilter !== "all" 
                                    ? "Try different filters"
                                    : "Add your first product"
                                }
                            </p>
                            {searchTerm || categoryFilter !== "all" ? (
                                <button
                                    onClick={() => { setSearchTerm(""); setCategoryFilter("all"); }}
                                    className="px-4 py-2 bg-black text-white text-sm font-bold"
                                >
                                    CLEAR FILTERS
                                </button>
                            ) : (
                                <Link
                                    to="/admin-page/add-products"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-bold"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    ADD PRODUCT
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                {/* Table */}
                {!loading && filtered.length > 0 && (
                    <div className="h-full flex flex-col">
                        
                        {/* Table Header - Fixed */}
                        <div className="flex-shrink-0 bg-gray-50 border-b-2 border-gray-200">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="w-12 p-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
                                                onChange={toggleSelectAll}
                                                className="w-4 h-4 accent-red-600"
                                            />
                                        </th>
                                        <th className="text-left p-3 text-xs font-black text-gray-500 uppercase">Product</th>
                                        <th className="text-left p-3 text-xs font-black text-gray-500 uppercase hidden md:table-cell w-28">Category</th>
                                        <th className="text-left p-3 text-xs font-black text-gray-500 uppercase hidden lg:table-cell w-48">Sizes</th>
                                        <th className="text-left p-3 text-xs font-black text-gray-500 uppercase w-28">Price</th>
                                        <th className="text-left p-3 text-xs font-black text-gray-500 uppercase w-32">Status</th>
                                        <th className="text-right p-3 text-xs font-black text-gray-500 uppercase w-32">Actions</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>

                        {/* Table Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto">
                            <table className="w-full">
                                <tbody>
                                    {paginatedProducts.map((product) => {
                                        const totalStock = getTotalStock(product.sizes);
                                        const isLowStock = totalStock > 0 && totalStock <= 5;
                                        const isOutOfStock = totalStock === 0;
                                        const isSelected = selectedProducts.includes(product.product_id);

                                        return (
                                            <tr
                                                key={product.product_id}
                                                className={`border-b border-gray-100 transition-all ${
                                                    isSelected ? "bg-red-50" : "hover:bg-gray-50"
                                                }`}
                                            >
                                                {/* Checkbox */}
                                                <td className="w-12 p-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleSelect(product.product_id)}
                                                        className="w-4 h-4 accent-red-600"
                                                    />
                                                </td>

                                                {/* Product */}
                                                <td className="p-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-gray-100 flex-shrink-0 overflow-hidden">
                                                            {product.images?.length > 0 ? (
                                                                <img
                                                                    src={product.images[0]}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <Package className="w-5 h-5 text-gray-300" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-sm text-black truncate max-w-[180px]">
                                                                {product.name}
                                                            </p>
                                                            <p className="text-xs text-gray-400">
                                                                #{product.product_id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Category */}
                                                <td className="p-3 hidden md:table-cell w-28">
                                                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 font-bold uppercase">
                                                        {product.main_category}
                                                    </span>
                                                </td>

                                                {/* Sizes */}
                                                <td className="p-3 hidden lg:table-cell w-48">
                                                    {product.sizes?.length === 0 ? (
                                                        <span className="text-gray-400 text-xs">No sizes</span>
                                                    ) : (
                                                        <div className="flex flex-wrap gap-1">
                                                            {product.sizes.slice(0, 6).map((s, idx) => (
                                                                <span 
                                                                    key={idx} 
                                                                    className={`w-7 h-7 flex items-center justify-center text-xs font-bold ${
                                                                        s.stock === 0 
                                                                            ? "bg-gray-100 text-gray-300" 
                                                                            : s.stock <= 3
                                                                                ? "bg-red-50 text-red-600"
                                                                                : "bg-gray-100 text-gray-600"
                                                                    }`}
                                                                    title={`${s.stock} in stock`}
                                                                >
                                                                    {s.size_value}
                                                                </span>
                                                            ))}
                                                            {product.sizes.length > 6 && (
                                                                <span className="w-7 h-7 flex items-center justify-center text-xs font-bold bg-gray-100 text-gray-400">
                                                                    +{product.sizes.length - 6}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Price */}
                                                <td className="p-3 w-28">
                                                    <span className="font-black text-sm">
                                                        Rs.{Number(product.price).toLocaleString()}
                                                    </span>
                                                </td>

                                                {/* Status */}
                                                <td className="p-3 w-32">
                                                    {isOutOfStock ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                                            <span className="text-xs font-bold text-gray-500">OUT</span>
                                                        </div>
                                                    ) : isLowStock ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                                            <span className="text-xs font-bold text-red-600">LOW ({totalStock})</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                            <span className="text-xs font-bold text-green-700">{totalStock} units</span>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="p-3 w-32">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button
                                                            onClick={() => navigate("/admin-page/edit-product", { state: product })}
                                                            className="h-8 px-3 bg-black hover:bg-red-600 text-white text-xs font-bold transition-all flex items-center gap-1"
                                                        >
                                                            <Edit3 className="w-3 h-3" />
                                                            <span className="hidden xl:inline">Edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product.product_id, product.name)}
                                                            className="h-8 w-8 bg-gray-100 hover:bg-red-600 hover:text-white text-gray-500 flex items-center justify-center transition-all"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination - Fixed */}
                        <div className="flex-shrink-0 bg-white border-t-2 border-gray-100 px-4 py-3">
                            <div className="flex items-center justify-between">
                                
                                {/* Info */}
                                <p className="text-xs text-gray-500">
                                    <span className="font-black text-black">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filtered.length)}</span>
                                    {" of "}
                                    <span className="font-black text-black">{filtered.length}</span>
                                </p>

                                {/* Controls */}
                                {totalPages > 1 && (
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className={`w-8 h-8 flex items-center justify-center text-xs font-bold transition-all ${
                                                currentPage === 1
                                                    ? "bg-gray-100 text-gray-300"
                                                    : "bg-gray-100 text-black hover:bg-black hover:text-white"
                                            }`}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>

                                        {/* Page Numbers */}
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let page;
                                            if (totalPages <= 5) {
                                                page = i + 1;
                                            } else if (currentPage <= 3) {
                                                page = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                page = totalPages - 4 + i;
                                            } else {
                                                page = currentPage - 2 + i;
                                            }

                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`w-8 h-8 flex items-center justify-center text-xs font-bold transition-all ${
                                                        currentPage === page
                                                            ? "bg-red-600 text-white"
                                                            : "bg-gray-100 text-black hover:bg-black hover:text-white"
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        })}

                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className={`w-8 h-8 flex items-center justify-center text-xs font-bold transition-all ${
                                                currentPage === totalPages
                                                    ? "bg-gray-100 text-gray-300"
                                                    : "bg-gray-100 text-black hover:bg-black hover:text-white"
                                            }`}
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}