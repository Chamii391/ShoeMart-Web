import { Link, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Addproducts from "./addproducts";
import AdminProduct from "./adminproduct";
import EditProduct from "./editproduct";
import AdminOrders from "./adminorder";
import toast from "react-hot-toast";
import { 
    LayoutDashboard, 
    Package, 
    PlusCircle, 
    Users, 
    ShoppingCart, 
    LogOut, 
    Menu, 
    X,
    ChevronRight,
    TrendingUp,
    Clock,
    AlertCircle,
    Loader2
} from "lucide-react";

export default function AdminPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const username = localStorage.getItem("username") || "Admin";

    function logOut() {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("userRole");
        toast.success("Logged out successfully");
        navigate("/");
    }

    // Menu items
    const menuItems = [
        { path: "/admin-page", icon: LayoutDashboard, label: "Dashboard", exact: true },
        { path: "/admin-page/products", icon: Package, label: "Products" },
        { path: "/admin-page/add-products", icon: PlusCircle, label: "Add Product" },
        { path: "/admin-page/orders", icon: ShoppingCart, label: "Orders" },
        { path: "/admin-page/users", icon: Users, label: "Customers" },
    ];

    const isActive = (path, exact = false) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path) && path !== "/admin-page";
    };

    return (
        <div className="w-full h-screen flex bg-gray-50 overflow-hidden">

            {/* Sidebar - Desktop */}
            <aside className={`hidden lg:flex flex-col bg-black text-white transition-all duration-300 ${
                sidebarOpen ? "w-64" : "w-20"
            }`}>
                
                {/* Logo */}
                <div className="p-5 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-600 flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M2 18h20v2H2v-2zm2.55-7.86c-.21-.4-.17-.87.07-1.24l3.14-4.84c.28-.43.76-.69 1.27-.69h2.09c.37 0 .72.15.98.41l.93.93c.26.26.62.41.98.41h5.99c.55 0 1 .45 1 1v2c0 1.1-.9 2-2 2h-1.5L19 13h-2l-2-3h-1.5l-1-1.5H11l-2 3.5H7l-.75 1.5H4.5c-.73 0-1.41-.38-1.79-.99l-.16-.27z"/>
                            </svg>
                        </div>
                        {sidebarOpen && (
                            <div>
                                <h1 className="font-black text-lg leading-none">
                                    SUPUN<span className="text-red-600">SHOES</span>
                                </h1>
                                <p className="text-[10px] text-gray-500 tracking-widest mt-1">ADMIN PANEL</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Toggle Button */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="absolute top-5 -right-3 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors z-50"
                >
                    <ChevronRight className={`w-4 h-4 transition-transform ${sidebarOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Navigation */}
                <nav className="flex-1 py-6">
                    <ul className="space-y-1 px-3">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 font-medium transition-all ${
                                        isActive(item.path, item.exact)
                                            ? "bg-red-600 text-white"
                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                    <item.icon className="w-5 h-5 flex-shrink-0" />
                                    {sidebarOpen && <span>{item.label}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* User & Logout */}
                <div className="p-4 border-t border-white/10">
                    {sidebarOpen && (
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-10 h-10 bg-red-600 flex items-center justify-center font-black text-lg">
                                {username.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-sm">{username}</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                        </div>
                    )}
                    
                    <button
                        onClick={logOut}
                        className={`w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 font-bold transition-all ${
                            sidebarOpen ? "px-4" : "px-2"
                        }`}
                    >
                        <LogOut className="w-5 h-5" />
                        {sidebarOpen && <span>LOGOUT</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black/60 z-40"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}

            {/* Mobile Sidebar */}
            <aside className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-black text-white z-50 transform transition-transform duration-300 ${
                mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}>
                {/* Close Button */}
                <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="absolute top-4 right-4 text-white hover:text-red-600"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Logo */}
                <div className="p-5 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-600 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M2 18h20v2H2v-2zm2.55-7.86c-.21-.4-.17-.87.07-1.24l3.14-4.84c.28-.43.76-.69 1.27-.69h2.09c.37 0 .72.15.98.41l.93.93c.26.26.62.41.98.41h5.99c.55 0 1 .45 1 1v2c0 1.1-.9 2-2 2h-1.5L19 13h-2l-2-3h-1.5l-1-1.5H11l-2 3.5H7l-.75 1.5H4.5c-.73 0-1.41-.38-1.79-.99l-.16-.27z"/>
                            </svg>
                        </div>
                        <div>
                            <h1 className="font-black text-lg leading-none">
                                SUPUN<span className="text-red-600">SHOES</span>
                            </h1>
                            <p className="text-[10px] text-gray-500 tracking-widest mt-1">ADMIN PANEL</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6">
                    <ul className="space-y-1 px-3">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 font-medium transition-all ${
                                        isActive(item.path, item.exact)
                                            ? "bg-red-600 text-white"
                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={logOut}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 font-bold transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>LOGOUT</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Left - Mobile Menu & Title */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="lg:hidden p-2 hover:bg-gray-100"
                            >
                                <Menu className="w-6 h-6" />
                            </button>

                            <div>
                                <h1 className="text-xl font-black text-black">
                                    {menuItems.find(item => isActive(item.path, item.exact))?.label || "Dashboard"}
                                </h1>
                                <p className="text-xs text-gray-500">
                                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        {/* Right - User */}
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="font-bold text-sm">{username}</p>
                                <p className="text-xs text-gray-500">Admin</p>
                            </div>
                            <div className="w-10 h-10 bg-red-600 text-white flex items-center justify-center font-black">
                                {username.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Routes>
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="products" element={<AdminProduct />} />
                        <Route path="add-products" element={<Addproducts />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="edit-product" element={<EditProduct />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

// ============ DASHBOARD WITH REAL DATA ============
function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalCustomers: 0,
        pendingOrders: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);

    // Load all dashboard data
    useEffect(() => {
        loadDashboardData();
    }, []);

    async function loadDashboardData() {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch all data in parallel
            const [
                productsRes,
                ordersRes,
                customersRes,
                pendingRes,
                recentOrdersRes,
                lowStockRes
            ] = await Promise.all([
                axios.get("http://localhost:3000/api/products/count", { headers }),
                axios.get("http://localhost:3000/api/orders/count-total", { headers }),
                axios.get("http://localhost:3000/api/users/count-customers", { headers }),
                axios.get("http://localhost:3000/api/orders/count-processing", { headers }),
                axios.get("http://localhost:3000/api/orders/recent-four", { headers }),
                axios.get("http://localhost:3000/api/products/low-stock", { headers })
            ]);

            setStats({
                
                    totalProducts: productsRes.data.total_products || 0,
                    totalOrders: ordersRes.data.total_orders || 0,
                    totalCustomers: customersRes.data.total_customers || 0,
                    pendingOrders: pendingRes.data.processing_orders || 0
                });

            setRecentOrders(recentOrdersRes.data || []);
            setLowStockProducts(lowStockRes.data || []);
            
        } catch (error) {
            console.error("Error loading dashboard data:", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    }

    // Format date
    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Get status style
    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case "processing":
                return "bg-amber-100 text-amber-700";
            case "delivering":
                return "bg-blue-100 text-blue-700";
            case "completed":
                return "bg-emerald-100 text-emerald-700";
            case "cancelled":
                return "bg-red-100 text-red-600";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // Stats config
    const statsConfig = [
        { label: "Total Products", value: stats.totalProducts, icon: Package, color: "bg-black" },
        { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "bg-red-600" },
        { label: "Customers", value: stats.totalCustomers, icon: Users, color: "bg-black" },
        { label: "Pending Orders", value: stats.pendingOrders, icon: Clock, color: "bg-red-600" },
    ];

    // Loading state
    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-red-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Welcome Banner */}
            <div className="bg-black text-white p-6 mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black mb-1">Welcome Back! 👋</h2>
                        <p className="text-gray-400">Here's what's happening with your store today</p>
                    </div>
                    <Link 
                        to="/admin-page/add-products"
                        className="hidden sm:flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 font-bold transition-all"
                    >
                        <PlusCircle className="w-5 h-5" />
                        ADD PRODUCT
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statsConfig.map((stat, index) => (
                    <div key={index} className="bg-white p-5 border-2 border-gray-100 hover:border-red-600 transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`${stat.color} p-2 text-white`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <TrendingUp className="w-4 h-4 text-green-500" />
                        </div>
                        <p className="text-3xl font-black">{stat.value.toLocaleString()}</p>
                        <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h3 className="font-black text-lg mb-4">QUICK ACTIONS</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link 
                        to="/admin-page/add-products" 
                        className="bg-red-600 hover:bg-red-700 text-white p-4 flex items-center gap-3 transition-all group"
                    >
                        <PlusCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-sm">Add Product</span>
                    </Link>
                    <Link 
                        to="/admin-page/orders" 
                        className="bg-black hover:bg-gray-800 text-white p-4 flex items-center gap-3 transition-all group"
                    >
                        <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-sm">View Orders</span>
                    </Link>
                    <Link 
                        to="/admin-page/products" 
                        className="bg-black hover:bg-gray-800 text-white p-4 flex items-center gap-3 transition-all group"
                    >
                        <Package className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-sm">Manage Products</span>
                    </Link>
                    <Link 
                        to="/admin-page/users" 
                        className="bg-red-600 hover:bg-red-700 text-white p-4 flex items-center gap-3 transition-all group"
                    >
                        <Users className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-sm">Customers</span>
                    </Link>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Recent Orders */}
                <div className="bg-white border-2 border-gray-100">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-black flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-red-600" />
                            RECENT ORDERS
                        </h3>
                        <Link to="/admin-page/orders" className="text-red-600 text-sm font-bold hover:text-black">
                            View All →
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentOrders.length === 0 ? (
                            <div className="p-8 text-center">
                                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No recent orders</p>
                            </div>
                        ) : (
                            recentOrders.map((order, index) => (
                                <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                    <div>
                                        <p className="font-bold">Order #{order.order_id}</p>
                                        <p className="text-sm text-gray-500">
                                            {order.firstname && order.lastname 
                                                ? `${order.firstname} ${order.lastname}`
                                                : "Guest Customer"
                                            }
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {formatDate(order.order_date)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-red-600">
                                            Rs. {Number(order.total).toLocaleString()}
                                        </p>
                                        <span className={`text-xs px-2 py-1 font-bold capitalize ${getStatusStyle(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Low Stock Alert */}
                <div className="bg-white border-2 border-gray-100">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-black flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            LOW STOCK ALERT
                        </h3>
                        <Link to="/admin-page/products" className="text-red-600 text-sm font-bold hover:text-black">
                            View All →
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {lowStockProducts.length === 0 ? (
                            <div className="p-8 text-center">
                                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No low stock products</p>
                            </div>
                        ) : (
                            lowStockProducts.map((product, index) => (
                                <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-100 flex items-center justify-center overflow-hidden">
                                            {product.image ? (
                                                <img 
                                                    src={product.image} 
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Package className="w-6 h-6 text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm line-clamp-1">{product.name}</p>
                                            <p className="text-xs text-gray-500">Size: {product.size_value}</p>
                                        </div>
                                    </div>
                                    <span className={`text-sm px-3 py-1 font-black ${
                                        product.stock <= 2 ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"
                                    }`}>
                                        {product.stock} left
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Customers Component
function AdminUsers() {
    return (
        <div>
            <div className="bg-white border-2 border-gray-100 p-8 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-black mb-2">CUSTOMERS</h2>
                <p className="text-gray-500">Customer management module coming soon...</p>
            </div>
        </div>
    );
}