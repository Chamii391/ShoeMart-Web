import toast from "react-hot-toast";
import { Link, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
    ShoppingBag, 
    Edit3, 
    LogOut, 
    Menu, 
    X,
    ChevronRight,
    Home,
    Package,
    Clock,
    CheckCircle,
    Truck,
    XCircle
} from "lucide-react";
import UsersOrders from "./vieworders";
import EditProfile from "./editprofile";

export default function ClientPage() {

    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const username = localStorage.getItem("username") || "User";

    function logOut() {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("userRole");
        localStorage.removeItem("UserId");

        toast.success("Log out successful");
        navigate("/");
    }

    const menuItems = [
        { path: "/client-page", icon: Home, label: "Dashboard", exact: true },
        { path: "/client-page/orders", icon: ShoppingBag, label: "Orders" },
        { path: "/client-page/edit-profile", icon: Edit3, label: "Edit Profile" },
    ];

    const isActive = (path, exact = false) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path) && path !== "/client-page";
    };

    return (
        <div className="w-full h-screen flex bg-gray-50 overflow-hidden">

            {/* ============ SIDEBAR - DESKTOP ============ */}
            <aside className={`hidden lg:flex flex-col bg-black text-white transition-all duration-300 ${
                sidebarOpen ? "w-64" : "w-20"
            }`}>
                
                {/* Logo */}
                <div className="p-5 border-b border-white/10">
                    <Link to="/" className="flex items-center gap-3">
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
                    </Link>
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
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm truncate">{username}</p>
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

            {/* ============ MOBILE OVERLAY ============ */}
            {mobileMenuOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* ============ SIDEBAR - MOBILE ============ */}
            <aside className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-black text-white z-50 transform transition-transform duration-300 ${
                mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}>
                {/* Close Button */}
                <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/10 flex items-center justify-center text-white hover:bg-red-600 transition-all"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Logo */}
                <div className="p-5 border-b border-white/10">
                    <Link to="/" className="flex items-center gap-3">
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
                    </Link>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-600 flex items-center justify-center font-black text-xl">
                            {username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-bold">{username}</p>
                            <p className="text-xs text-gray-500">Customer</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4">
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

            {/* ============ MAIN CONTENT ============ */}
            <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* Header */}
                <header className="flex-shrink-0 bg-white border-b-2 border-gray-100 px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="lg:hidden w-10 h-10 bg-black text-white flex items-center justify-center"
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
                                <p className="font-bold text-sm">{username}</p>
                                <p className="text-xs text-gray-500">Customer</p>
                            </div>
                            <div className="w-10 h-10 bg-red-600 text-white flex items-center justify-center font-black">
                                {username.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Routes */}
                <main className="flex-1 overflow-y-auto">
                    <Routes>
                        <Route path="/" element={<ClientDashboard username={username} />} />
                        <Route path="orders" element={<UsersOrders/>} />
                        <Route path="edit-profile" element={<EditProfile/>} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}


// ============ CLIENT DASHBOARD - CLEAN VERSION ============
function ClientDashboard({ username }) {

    // Dummy Stats
    const stats = [
        { label: "Total Orders", value: "12", icon: ShoppingBag, color: "bg-black" },
        { label: "Processing", value: "2", icon: Clock, color: "bg-amber-500" },
        { label: "Delivering", value: "1", icon: Truck, color: "bg-blue-600" },
        { label: "Completed", value: "9", icon: CheckCircle, color: "bg-emerald-600" },
    ];

    // Dummy Recent Orders (5)
    const recentOrders = [
        { id: "ORD-1001", date: "Dec 18, 2024", items: 2, total: "12,500", statusLabel: "Processing", statusBg: "bg-amber-100", statusText: "text-amber-700", StatusIcon: Clock },
        { id: "ORD-1002", date: "Dec 15, 2024", items: 1, total: "8,900", statusLabel: "Delivering", statusBg: "bg-blue-100", statusText: "text-blue-700", StatusIcon: Truck },
        { id: "ORD-1003", date: "Dec 12, 2024", items: 3, total: "24,500", statusLabel: "Completed", statusBg: "bg-emerald-100", statusText: "text-emerald-700", StatusIcon: CheckCircle },
        { id: "ORD-1004", date: "Dec 10, 2024", items: 1, total: "6,200", statusLabel: "Completed", statusBg: "bg-emerald-100", statusText: "text-emerald-700", StatusIcon: CheckCircle },
        { id: "ORD-1005", date: "Dec 5, 2024", items: 2, total: "15,800", statusLabel: "Cancelled", statusBg: "bg-red-100", statusText: "text-red-600", StatusIcon: XCircle },
    ];

    return (
        <div className="p-4 sm:p-6">
            
            {/* ============ WELCOME BANNER ============ */}
            <div className="bg-black text-white p-5 sm:p-6 mb-6">
                <h2 className="text-xl sm:text-2xl font-black mb-1">
                    Welcome Back, {username}! 👋
                </h2>
                <p className="text-gray-400 text-sm">
                    Here's your order summary
                </p>
            </div>

            {/* ============ STATS GRID ============ */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {stats.map((stat, index) => (
                    <div 
                        key={index} 
                        className="bg-white p-4 sm:p-5 border-2 border-gray-100 hover:border-red-600 transition-all"
                    >
                        <div className={`${stat.color} w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white mb-3`}>
                            <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <p className="text-2xl sm:text-3xl font-black">{stat.value}</p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* ============ RECENT ORDERS ============ */}
            <div className="bg-white border-2 border-gray-100">
                
                {/* Header */}
                <div className="p-4 sm:p-5 border-b-2 border-gray-100">
                    <h3 className="font-black text-sm sm:text-base flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-red-600" />
                        RECENT ORDERS
                    </h3>
                </div>

                {/* Orders List */}
                <div className="divide-y divide-gray-100">
                    {recentOrders.map((order) => (
                        <div 
                            key={order.id} 
                            className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50 transition-all"
                        >
                            {/* Order Info */}
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <Package className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                                </div>
                                <div>
                                    <p className="font-black text-sm sm:text-base">{order.id}</p>
                                    <p className="text-xs text-gray-500">
                                        {order.date} • {order.items} {order.items === 1 ? 'item' : 'items'}
                                    </p>
                                </div>
                            </div>

                            {/* Status & Price */}
                            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold ${order.statusBg} ${order.statusText}`}>
                                    <order.StatusIcon className="w-3.5 h-3.5" />
                                    {order.statusLabel}
                                </span>
                                <p className="font-black text-red-600 text-sm sm:text-base">
                                    Rs. {order.total}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}