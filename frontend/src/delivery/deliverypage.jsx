import toast from "react-hot-toast";
import { Link, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { 
    Truck, 
    Package, 
    LogOut, 
    Menu, 
    X,
    ChevronRight,
    Home,
    CheckCircle,
    MapPin,
    Phone,
    Loader2,
    TrendingUp,
    Calendar,
    User,
    Navigation,
    Eye,
    Clock,
    History
} from "lucide-react";
import DeliveryOrder from "./deliveryOrder";
import OrderHistory from "./orderhistory";

export default function DeliveryPage() {

    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const username = localStorage.getItem("username") || "Driver";

    function logOut() {
        localStorage.removeItem("token");
        toast.success("Log out successful");
        navigate("/");
    }

    const menuItems = [
        { path: "/deliver-page", icon: Home, label: "Dashboard", exact: true },
        { path: "/deliver-page/orders", icon: Truck, label: "Active Deliveries", exact: true },
        { path: "/deliver-page/orders-history", icon: History, label: "Order History", exact: true },
    ];

    // Fixed isActive function
    const isActive = (path, exact = false) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname === path;
    };

    return (
        <div className="w-full h-screen flex bg-gray-50 overflow-hidden">

            {/* ============ SIDEBAR - DESKTOP ============ */}
            <aside className={`hidden lg:flex flex-col bg-black text-white transition-all duration-300 border-r-4 border-red-600 ${
                sidebarOpen ? "w-64" : "w-20"
            }`}>
                
                {/* Logo */}
                <div className="p-5 border-b-2 border-red-600/20">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <Truck className="w-6 h-6 text-white" />
                        </div>
                        {sidebarOpen && (
                            <div>
                                <h1 className="font-black text-lg leading-none">
                                    SUPUN<span className="text-red-600">SHOES</span>
                                </h1>
                                <p className="text-[10px] text-gray-500 tracking-widest mt-1">DELIVERY PANEL</p>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Toggle Button */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="absolute top-5 -right-3 w-6 h-6 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg z-50"
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
                                    className={`flex items-center gap-3 px-4 py-3 font-bold transition-all rounded ${
                                        isActive(item.path, item.exact)
                                            ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                                            : "text-gray-400 hover:bg-red-600/10 hover:text-white"
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
                <div className="p-4 border-t-2 border-red-600/20">
                    {sidebarOpen && (
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center font-black text-lg shadow-lg">
                                {username.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm truncate text-white">{username}</p>
                                <p className="text-xs text-gray-500">Delivery Driver</p>
                            </div>
                        </div>
                    )}
                    
                    <button
                        onClick={logOut}
                        className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 font-bold transition-all shadow-lg ${
                            sidebarOpen ? "px-4" : "px-2"
                        }`}
                    >
                        <LogOut className="w-5 h-5" />
                        {sidebarOpen && <span>LOGOUT</span>}
                    </button>
                </div>
            </aside>

            {/* ============ MOBILE OVERLAY ============ */}
            {mobileMenuOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* ============ SIDEBAR - MOBILE ============ */}
            <aside className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-black text-white z-50 transform transition-transform duration-300 border-r-4 border-red-600 ${
                mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}>
                <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="absolute top-4 right-4 w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white hover:bg-red-700 transition-all"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-5 border-b-2 border-red-600/20">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg">
                            <Truck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="font-black text-lg leading-none">
                                SUPUN<span className="text-red-600">SHOES</span>
                            </h1>
                            <p className="text-[10px] text-gray-500 tracking-widest mt-1">DELIVERY PANEL</p>
                        </div>
                    </Link>
                </div>

                <div className="p-4 border-b-2 border-red-600/20">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center font-black text-xl shadow-lg">
                            {username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-bold text-white">{username}</p>
                            <p className="text-xs text-gray-500">Delivery Driver</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 py-4 overflow-y-auto">
                    <ul className="space-y-1 px-3">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 font-bold transition-all rounded ${
                                        isActive(item.path, item.exact)
                                            ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                                            : "text-gray-400 hover:bg-red-600/10 hover:text-white"
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4 border-t-2 border-red-600/20">
                    <button
                        onClick={logOut}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 font-bold transition-all shadow-lg"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>LOGOUT</span>
                    </button>
                </div>
            </aside>

            {/* ============ MAIN CONTENT ============ */}
            <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* Header */}
                <header className="flex-shrink-0 bg-white border-b-4 border-red-600/20 px-4 sm:px-6 py-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="lg:hidden w-10 h-10 bg-black text-white flex items-center justify-center rounded shadow-md"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-lg sm:text-xl font-black text-black">
                                    {menuItems.find(item => isActive(item.path, item.exact))?.label || "Dashboard"}
                                </h1>
                                <p className="text-xs text-gray-500 hidden sm:block">Welcome back, {username}!</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="font-bold text-sm text-black">{username}</p>
                                <p className="text-xs text-gray-500">Delivery Driver</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg text-white flex items-center justify-center font-black shadow-lg">
                                {username.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Routes */}
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    <Routes>
                        <Route path="/" element={<DeliveryDashboard username={username} />} />
                        <Route path="orders" element={<DeliveryOrder />} />
                        <Route path="orders-history" element={<OrderHistory />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}


// ============ DELIVERY DASHBOARD - PROFESSIONAL RED THEME ============
function DeliveryDashboard({ username }) {
    const [orderSummary, setOrderSummary] = useState({
        delivering_count: 0,
        completed_count: 0,
        recent_orders: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrderSummary();
    }, []);

    async function loadOrderSummary() {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                "http://localhost:3000/api/orders/orders-summary",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrderSummary(res.data);
        } catch (err) {
            console.error("Failed to load order summary:", err);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    }

    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    const formatCurrency = (amount) => `Rs. ${Number(amount).toLocaleString()}`;

    // Calculate stats
    const totalOrders = orderSummary.delivering_count + orderSummary.completed_count;
    const successRate = totalOrders > 0 
        ? Math.round((orderSummary.completed_count / totalOrders) * 100) 
        : 0;

    const stats = [
        { 
            label: "Total Orders", 
            value: totalOrders, 
            icon: Package, 
            gradient: "from-black to-gray-800",
            textColor: "text-black",
            iconBg: "bg-black"
        },
        { 
            label: "Active Deliveries", 
            value: orderSummary.delivering_count, 
            icon: Truck, 
            gradient: "from-red-600 to-red-700",
            textColor: "text-red-600",
            iconBg: "bg-red-600"
        },
        { 
            label: "Completed", 
            value: orderSummary.completed_count, 
            icon: CheckCircle, 
            gradient: "from-red-500 to-red-600",
            textColor: "text-red-500",
            iconBg: "bg-red-500"
        },
        { 
            label: "Success Rate", 
            value: `${successRate}%`, 
            icon: TrendingUp, 
            gradient: "from-red-700 to-red-800",
            textColor: "text-red-700",
            iconBg: "bg-red-700"
        },
    ];

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-full">
            
            {/* ============ WELCOME BANNER ============ */}
            <div className="relative overflow-hidden bg-gradient-to-r from-black via-gray-900 to-black text-white rounded-xl p-6 mb-6 shadow-xl border-4 border-red-600">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-600/10 rounded-full -ml-24 -mb-24"></div>
                
                <div className="relative flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                        <Truck className="w-7 h-7" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black mb-1">
                            Welcome Back, <span className="text-red-500">{username}</span>! 👋
                        </h2>
                        <p className="text-gray-400 text-sm">
                            {loading 
                                ? "Loading your deliveries..." 
                                : `You have ${orderSummary.delivering_count} active ${orderSummary.delivering_count === 1 ? 'delivery' : 'deliveries'} today`
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* ============ STATS GRID ============ */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600 font-semibold">Loading dashboard...</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {stats.map((stat, index) => (
                            <div 
                                key={index} 
                                className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-red-600 hover:shadow-xl transition-all group"
                            >
                                <div className={`${stat.iconBg} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <p className={`text-3xl font-black ${stat.textColor} mb-1`}>
                                    {stat.value}
                                </p>
                                <p className="text-sm text-gray-600 font-semibold">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* ============ RECENT ORDERS ============ */}
                    <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg">
                        
                        {/* Header */}
                        <div className="p-5 border-b-2 border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center justify-between">
                                <h3 className="font-black text-lg flex items-center gap-2">
                                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                                        <Navigation className="w-4 h-4 text-white" />
                                    </div>
                                    Recent Deliveries
                                </h3>
                                {orderSummary.recent_orders?.length > 0 && (
                                    <Link 
                                        to="/deliver-page/orders"
                                        className="text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1 hover:gap-2 transition-all"
                                    >
                                        View All
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Orders List */}
                        {orderSummary.recent_orders?.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Package className="w-8 h-8 text-red-300" />
                                </div>
                                <p className="text-gray-500 font-semibold">No recent orders</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {orderSummary.recent_orders.map((order) => (
                                    <div 
                                        key={order.order_id} 
                                        className="p-5 hover:bg-red-50 transition-all group"
                                    >
                                        {/* Desktop View */}
                                        <div className="hidden sm:flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-800 rounded-lg text-white flex items-center justify-center font-black shadow-md group-hover:scale-110 transition-transform">
                                                    {order.firstname?.charAt(0)?.toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="font-black text-black">#{order.order_id}</span>
                                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                                            order.status === "delivering" 
                                                                ? "bg-red-100 text-red-700 border border-red-200" 
                                                                : "bg-gray-100 text-gray-700 border border-gray-200"
                                                        }`}>
                                                            {order.status === "delivering" ? "🚚 Delivering" : "✓ Completed"}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 font-medium">
                                                        {order.firstname} {order.lastname}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="font-black text-lg text-red-600">
                                                        {formatCurrency(order.total)}
                                                    </p>
                                                    <p className="text-xs text-gray-500 font-medium">
                                                        {formatDate(order.order_date)}
                                                    </p>
                                                </div>
                                                
                                                <Link
                                                    to="/deliver-page/orders"
                                                    className="px-4 py-2 bg-black hover:bg-red-600 text-white text-sm font-bold rounded-lg flex items-center gap-2 transition-all shadow-md"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    View
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Mobile View */}
                                        <div className="sm:hidden">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-black">#{order.order_id}</span>
                                                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                                                            order.status === "delivering" 
                                                                ? "bg-red-100 text-red-700" 
                                                                : "bg-gray-100 text-gray-700"
                                                        }`}>
                                                            {order.status === "delivering" ? "Delivering" : "Completed"}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-semibold">
                                                        {order.firstname} {order.lastname}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {formatDate(order.order_date)}
                                                    </p>
                                                </div>
                                                <p className="font-black text-lg text-red-600">
                                                    {formatCurrency(order.total)}
                                                </p>
                                            </div>
                                            <Link
                                                to="/deliver-page/orders"
                                                className="w-full px-4 py-2 bg-black text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 shadow-md"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ============ QUICK ACTIONS ============ */}
                    <div className="grid sm:grid-cols-2 gap-4 mt-6">
                        <Link
                            to="/deliver-page/orders"
                            className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl p-6 flex items-center justify-between transition-all group shadow-lg border-2 border-red-800"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                            <div className="relative">
                                <h4 className="font-black text-lg mb-1">Active Deliveries</h4>
                                <p className="text-sm text-red-100">View orders in transit</p>
                            </div>
                            <Truck className="w-10 h-10 group-hover:translate-x-2 transition-transform" />
                        </Link>

                        <Link
                            to="/deliver-page/orders-history"
                            className="relative overflow-hidden bg-gradient-to-r from-black to-gray-900 hover:from-gray-900 hover:to-black text-white rounded-xl p-6 flex items-center justify-between transition-all group shadow-lg border-2 border-red-600"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full -mr-16 -mt-16"></div>
                            <div className="relative">
                                <h4 className="font-black text-lg mb-1">Order History</h4>
                                <p className="text-sm text-gray-400">View completed orders</p>
                            </div>
                            <CheckCircle className="w-10 h-10 group-hover:scale-110 transition-transform text-red-500" />
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}