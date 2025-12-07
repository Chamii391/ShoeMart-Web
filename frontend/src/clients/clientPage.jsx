import toast from "react-hot-toast";
import { Link, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { 
    LayoutDashboard, 
    ShoppingBag, 
    Edit3, 
    Package, 
    LogOut, 
    Menu, 
    X,
    ChevronRight,
    TrendingUp,
    Clock,
    Truck,
    CheckCircle,
    XCircle,
    Loader2,
    ArrowRight
} from "lucide-react";
import UsersOrders from "./vieworders";
import EditProfile from "./editprofile";

export default function ClientPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const username = localStorage.getItem("username") || "User";
    const userid = localStorage.getItem("UserId");

    function logOut() {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("userRole");
        localStorage.removeItem("UserId");
        toast.success("Logged out successfully");
        navigate("/");
    }

    // Menu items
    const menuItems = [
        { path: "/client-page", icon: LayoutDashboard, label: "Dashboard", exact: true },
        { path: "/client-page/orders", icon: ShoppingBag, label: "My Orders" },
        { path: "/client-page/edit-profile", icon: Edit3, label: "Edit Profile" },
        { path: "/products", icon: Package, label: "Continue Shopping", external: true },
    ];

    const isActive = (path, exact = false) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path) && path !== "/client-page";
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
                                <p className="text-[10px] text-gray-500 tracking-widest mt-1">MY ACCOUNT</p>
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
                                        !item.external && isActive(item.path, item.exact)
                                            ? "bg-red-600 text-white"
                                            : item.external
                                                ? "text-gray-400 hover:bg-red-600 hover:text-white"
                                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                    <item.icon className="w-5 h-5 flex-shrink-0" />
                                    {sidebarOpen && (
                                        <>
                                            <span className="flex-1">{item.label}</span>
                                            {item.external && <ArrowRight className="w-4 h-4" />}
                                        </>
                                    )}
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
                                <p className="text-xs text-gray-500">Customer</p>
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
                            <p className="text-[10px] text-gray-500 tracking-widest mt-1">MY ACCOUNT</p>
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
                                        !item.external && isActive(item.path, item.exact)
                                            ? "bg-red-600 text-white"
                                            : item.external
                                                ? "text-gray-400 hover:bg-red-600 hover:text-white"
                                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="flex-1">{item.label}</span>
                                    {item.external && <ArrowRight className="w-4 h-4" />}
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
                                    {menuItems.find(item => !item.external && isActive(item.path, item.exact))?.label || "Dashboard"}
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
                                <p className="text-xs text-gray-500">Customer</p>
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
                        <Route path="/" element={<ClientDashboard userid={userid} />} />
                        <Route path="orders" element={<UsersOrders />} />
                        <Route path="edit-profile" element={<EditProfile />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

// ============ CLIENT DASHBOARD WITH REAL DATA ============
function ClientDashboard({ userid }) {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalOrders: 0,
        processingOrders: 0,
        deliveringOrders: 0,
        completedOrders: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const username = localStorage.getItem("username") || "User";

    useEffect(() => {
        loadDashboardData();
    }, [userid]);

    async function loadDashboardData() {
        if (!userid) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                `http://localhost:3000/api/orders/user-stats/${userid}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setStats({
                totalOrders: res.data.counts.total_orders || 0,
                processingOrders: res.data.counts.processing_orders || 0,
                deliveringOrders: res.data.counts.delivering_orders || 0,
                completedOrders: res.data.counts.completed_orders || 0
            });

            setRecentOrders(res.data.recent_orders || []);

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
        { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "bg-black" },
        { label: "Processing", value: stats.processingOrders, icon: Clock, color: "bg-amber-500" },
        { label: "Delivering", value: stats.deliveringOrders, icon: Truck, color: "bg-blue-600" },
        { label: "Completed", value: stats.completedOrders, icon: CheckCircle, color: "bg-emerald-600" },
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
                        <h2 className="text-2xl font-black mb-1">Welcome Back, {username}! 👋</h2>
                        <p className="text-gray-400">Here's your order summary</p>
                    </div>
                    <Link 
                        to="/products"
                        className="hidden sm:flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 font-bold transition-all"
                    >
                        <Package className="w-5 h-5" />
                        SHOP NOW
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
                        <p className="text-3xl font-black">{stat.value}</p>
                        <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white border-2 border-gray-100">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-black flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-red-600" />
                        RECENT ORDERS
                    </h3>
                    <Link to="/client-page/orders" className="text-red-600 text-sm font-bold hover:text-black">
                        View All →
                    </Link>
                </div>
                <div className="divide-y divide-gray-100">
                    {recentOrders.length === 0 ? (
                        <div className="p-8 text-center">
                            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-900 font-bold mb-1">No orders yet</p>
                            <p className="text-gray-500 text-sm mb-4">Start shopping to see your orders here</p>
                            <Link to="/products" className="text-red-600 hover:text-red-700 font-bold text-sm">
                                Browse Products →
                            </Link>
                        </div>
                    ) : (
                        recentOrders.map((order, index) => (
                            <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 flex items-center justify-center">
                                        <Package className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold">Order #{order.order_id}</p>
                                        <p className="text-xs text-gray-500">{formatDate(order.order_date)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-red-600">Rs. {Number(order.total).toLocaleString()}</p>
                                    <span className={`text-xs px-2 py-1 font-bold capitalize ${getStatusStyle(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Active Orders Alert */}
            {(stats.processingOrders > 0 || stats.deliveringOrders > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    {stats.processingOrders > 0 && (
                        <div className="bg-amber-50 border-2 border-amber-200 p-4 flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-500 flex items-center justify-center text-white">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-black text-amber-800">{stats.processingOrders} Order{stats.processingOrders > 1 ? 's' : ''} Processing</p>
                                <p className="text-sm text-amber-600">Being prepared for shipment</p>
                            </div>
                        </div>
                    )}
                    {stats.deliveringOrders > 0 && (
                        <div className="bg-blue-50 border-2 border-blue-200 p-4 flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 flex items-center justify-center text-white">
                                <Truck className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-black text-blue-800">{stats.deliveringOrders} Order{stats.deliveringOrders > 1 ? 's' : ''} On The Way</p>
                                <p className="text-sm text-blue-600">Out for delivery</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}