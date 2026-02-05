import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { 
    Package, 
    Eye, 
    X, 
    CheckCircle, 
    Phone,
    MapPin,
    Loader2,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Calendar,
    User,
    AlertCircle,
    TrendingUp,
    Clock,
    History,
    Box,
    Banknote,
    Shield,
    ArrowRight
} from "lucide-react";

const TIME_PERIODS = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "3months", label: "Last 3 Months" }
];

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [timePeriod, setTimePeriod] = useState("all");
    const itemsPerPage = 10;

    useEffect(() => {
        loadOrders();
    }, []);

    useEffect(() => {
        filterOrdersByPeriod();
    }, [timePeriod, orders]);

    async function loadOrders() {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                "http://localhost:3000/api/orders/completed-orders",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrders(res.data);
            setFilteredOrders(res.data);
        } catch (err) {
            toast.error("Failed to load order history");
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    function filterOrdersByPeriod() {
        const now = new Date();
        let filtered = [...orders];

        switch(timePeriod) {
            case "today": {
                filtered = orders.filter(order => {
                    const orderDate = new Date(order.order_date);
                    return orderDate.toDateString() === now.toDateString();
                });
                break;
            }
            
            case "week": {
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                filtered = orders.filter(order => {
                    const orderDate = new Date(order.order_date);
                    return orderDate >= weekAgo;
                });
                break;
            }
            
            case "month": {
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                filtered = orders.filter(order => {
                    const orderDate = new Date(order.order_date);
                    return orderDate >= monthAgo;
                });
                break;
            }
            
            case "3months": {
                const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                filtered = orders.filter(order => {
                    const orderDate = new Date(order.order_date);
                    return orderDate >= threeMonthsAgo;
                });
                break;
            }
            
            case "all":
            default: {
                filtered = orders;
                break;
            }
        }

        setFilteredOrders(filtered);
        setCurrentPage(1);
    }

    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    const formatTime = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => `Rs. ${Number(amount).toLocaleString()}`;

    // Calculate stats
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + Number(order.total), 0);
    const averageOrderValue = filteredOrders.length > 0 
        ? totalRevenue / filteredOrders.length 
        : 0;

    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage, 
        currentPage * itemsPerPage
    );

    return (
        <div className="h-full flex flex-col overflow-hidden bg-gray-50">

            {/* ============ HEADER - FIXED ============ */}
            <div className="flex-shrink-0 bg-black px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                    
                    {/* Left */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 flex items-center justify-center">
                            <History className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-xl font-black text-white">ORDER HISTORY</h1>
                            <p className="text-xs text-gray-500 hidden sm:block">
                                {loading ? "Loading..." : `${filteredOrders.length} completed deliveries`}
                            </p>
                        </div>
                    </div>

                    {/* Right */}
                    <button 
                        onClick={loadOrders}
                        disabled={loading}
                        className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    </button>
                </div>
            </div>

            {/* ============ STATS - SCROLLABLE ============ */}
            <div className="flex-shrink-0 bg-white border-b-2 border-gray-100 px-4 sm:px-6 py-2 sm:py-3 flex gap-2 overflow-x-auto scrollbar-hide">
                
                {/* Total Completed */}
                <div className="flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 border-2 bg-emerald-50 border-emerald-200">
                    <p className="text-xs text-emerald-700">Completed</p>
                    <p className="text-base sm:text-lg font-black text-emerald-700">
                        {loading ? "-" : filteredOrders.length}
                    </p>
                </div>

                {/* Total Revenue */}
                <div className="flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 border-2 bg-gray-100 border-gray-200">
                    <p className="text-xs text-gray-500">Revenue</p>
                    <p className="text-base sm:text-lg font-black text-black">
                        {loading ? "-" : `Rs. ${(totalRevenue / 1000).toFixed(1)}k`}
                    </p>
                </div>

                {/* Average Order Value */}
                <div className="flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 border-2 bg-red-50 border-red-200">
                    <p className="text-xs text-red-600">Avg Order</p>
                    <p className="text-base sm:text-lg font-black text-red-600">
                        {loading ? "-" : `Rs. ${Math.round(averageOrderValue).toLocaleString()}`}
                    </p>
                </div>

                {/* Time Period Indicator */}
                <div className="flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 border-2 bg-black border-black">
                    <p className="text-xs text-gray-400">Period</p>
                    <p className="text-base sm:text-lg font-black text-white">
                        {TIME_PERIODS.find(p => p.value === timePeriod)?.label || "All"}
                    </p>
                </div>
            </div>

            {/* ============ FILTERS ============ */}
            <div className="flex-shrink-0 bg-white border-b-2 border-gray-100 px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-2 sm:gap-4">
                
                {/* Desktop Tabs */}
                <div className="hidden md:flex border-2 border-gray-200">
                    {TIME_PERIODS.map((period) => (
                        <button
                            key={period.value}
                            onClick={() => setTimePeriod(period.value)}
                            className={`h-9 sm:h-10 px-3 sm:px-4 text-xs font-bold uppercase transition-all ${
                                timePeriod === period.value 
                                    ? "bg-black text-white" 
                                    : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {period.label}
                        </button>
                    ))}
                </div>

                {/* Mobile Filter Dropdown */}
                <select
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                    className="md:hidden h-9 px-3 border-2 border-gray-200 text-xs font-bold bg-white focus:border-black outline-none flex-1"
                >
                    {TIME_PERIODS.map((period) => (
                        <option key={period.value} value={period.value}>{period.label.toUpperCase()}</option>
                    ))}
                </select>

                {/* Results Count */}
                <div className="hidden sm:block ml-auto">
                    <p className="text-xs text-gray-500">
                        Showing <span className="font-black text-black">{filteredOrders.length}</span> orders
                    </p>
                </div>
            </div>

            {/* ============ CONTENT ============ */}
            <div className="flex-1 overflow-hidden bg-white">
                
                {/* Loading */}
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                    </div>
                
                /* Empty State */
                ) : filteredOrders.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-4">
                        <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="font-black text-base sm:text-lg mb-2">NO ORDERS FOUND</h3>
                        <p className="text-sm text-gray-500 text-center mb-4">
                            {timePeriod === "all" 
                                ? "No completed orders yet"
                                : `No completed orders in ${TIME_PERIODS.find(p => p.value === timePeriod)?.label.toLowerCase()}`
                            }
                        </p>
                        {timePeriod !== "all" && (
                            <button 
                                onClick={() => setTimePeriod("all")}
                                className="h-10 px-6 bg-black hover:bg-red-600 text-white text-xs sm:text-sm font-bold transition-all"
                            >
                                VIEW ALL ORDERS
                            </button>
                        )}
                    </div>
                
                /* Orders List */
                ) : (
                    <div className="h-full flex flex-col">
                        
                        {/* Desktop Table Header */}
                        <div className="flex-shrink-0 bg-gray-50 border-b-2 border-gray-200 px-4 py-2 hidden sm:grid grid-cols-12 gap-2 text-xs font-black text-gray-500 uppercase">
                            <div className="col-span-1">Order</div>
                            <div className="col-span-2">Date</div>
                            <div className="col-span-3">Customer</div>
                            <div className="col-span-2">Address</div>
                            <div className="col-span-2">Total</div>
                            <div className="col-span-1">Items</div>
                            <div className="col-span-1 text-center">Action</div>
                        </div>

                        {/* Orders */}
                        <div className="flex-1 overflow-y-auto">
                            {paginatedOrders.map((order) => (
                                <div 
                                    key={order.order_id} 
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                                >
                                    
                                    {/* Mobile View */}
                                    <div className="sm:hidden p-3 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-black text-sm">#{order.order_id}</span>
                                                <span className="px-2 py-0.5 text-xs font-bold bg-emerald-50 text-emerald-700">
                                                    Completed
                                                </span>
                                            </div>
                                            <p className="text-sm font-bold truncate">{order.customer_name}</p>
                                            <p className="text-xs text-gray-500">{formatDate(order.order_date)}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <p className="font-black text-red-600 text-sm">{formatCurrency(order.total)}</p>
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="w-7 h-7 bg-gray-100 hover:bg-black hover:text-white flex items-center justify-center transition-all"
                                            >
                                                <Eye className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Desktop View */}
                                    <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-3 items-center">
                                        <div className="col-span-1 font-black text-sm">#{order.order_id}</div>
                                        <div className="col-span-2">
                                            <p className="text-sm font-medium">{formatDate(order.order_date)}</p>
                                            <p className="text-xs text-gray-500">{formatTime(order.order_date)}</p>
                                        </div>
                                        <div className="col-span-3">
                                            <p className="font-bold text-sm truncate">{order.customer_name}</p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                <Phone className="w-3 h-3" />
                                                {order.customer_phone}
                                            </p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm text-gray-600 line-clamp-2">{order.customer_address}</p>
                                        </div>
                                        <div className="col-span-2 font-black text-red-600">{formatCurrency(order.total)}</div>
                                        <div className="col-span-1 text-sm font-medium">{order.items?.length || 0}</div>
                                        <div className="col-span-1 flex justify-center">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="w-8 h-8 bg-gray-100 hover:bg-black hover:text-white flex items-center justify-center transition-all"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex-shrink-0 border-t-2 border-gray-100 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
                                <p className="text-xs text-gray-500">
                                    <span className="font-black text-black">
                                        {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredOrders.length)}
                                    </span>
                                    <span className="hidden sm:inline">
                                        {" of "}<span className="font-black text-black">{filteredOrders.length}</span>
                                    </span>
                                </p>
                                <div className="flex gap-1">
                                    <button 
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                                        disabled={currentPage === 1} 
                                        className="w-8 h-8 bg-gray-100 hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-gray-100 disabled:hover:text-black flex items-center justify-center transition-all"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <span className="px-2 sm:px-3 flex items-center font-bold text-xs sm:text-sm">
                                        {currentPage}/{totalPages}
                                    </span>
                                    <button 
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                                        disabled={currentPage === totalPages} 
                                        className="w-8 h-8 bg-gray-100 hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-gray-100 disabled:hover:text-black flex items-center justify-center transition-all"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ============ MODAL ============ */}
            {selectedOrder && (
                <OrderDetailModal 
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    formatDate={formatDate}
                    formatTime={formatTime}
                    formatCurrency={formatCurrency}
                />
            )}
        </div>
    );
}


// ============ ORDER DETAIL MODAL ============
function OrderDetailModal({ order, onClose, formatDate, formatTime, formatCurrency }) {

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
                <div 
                    className="relative w-full sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] bg-white pointer-events-auto flex flex-col sm:flex-row overflow-hidden shadow-2xl rounded-t-2xl sm:rounded-none"
                    onClick={(e) => e.stopPropagation()}
                >
                    
                    {/* Mobile Handle */}
                    <div className="sm:hidden flex justify-center py-2 bg-black">
                        <div className="w-10 h-1 bg-white/30 rounded-full"></div>
                    </div>

                    {/* ============ LEFT PANEL ============ */}
                    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                        
                        {/* Header */}
                        <div className="flex-shrink-0 bg-black px-4 sm:px-6 py-4 sm:py-5">
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600 flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                            <h2 className="text-xl sm:text-2xl font-black text-white">#{order.order_id}</h2>
                                            <span className="px-2 py-0.5 text-xs font-bold bg-emerald-50 text-emerald-700">
                                                COMPLETED
                                            </span>
                                        </div>
                                        <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(order.order_date)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Box className="w-3 h-3" />
                                                {order.items?.length || 0} items
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={onClose} 
                                    className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-red-600 flex items-center justify-center text-white transition-all"
                                >
                                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            </div>

                            {/* Completed Status */}
                            <div className="pt-3 sm:pt-4 border-t border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-600 flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-sm">Delivered Successfully</p>
                                        <p className="text-xs text-gray-400">{formatDate(order.order_date)} at {formatTime(order.order_date)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                            
                            {/* Customer Info */}
                            <div className="bg-gray-50 border-2 border-gray-100 p-3 sm:p-4">
                                <h3 className="font-black text-xs uppercase text-gray-500 mb-3 tracking-wide">
                                    Customer Information
                                </h3>
                                <div className="space-y-2">
                                    <p className="font-bold text-sm sm:text-base">{order.customer_name}</p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        {order.customer_phone}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                        <span className="line-clamp-3">{order.customer_address}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Delivery Timeline */}
                            <div className="bg-emerald-50 border-2 border-emerald-200 p-3 sm:p-4">
                                <h3 className="font-black text-xs uppercase text-emerald-700 mb-3 tracking-wide">
                                    Delivery Timeline
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-emerald-600 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-emerald-900">Order Completed</p>
                                        <p className="text-xs text-emerald-700">
                                            {formatDate(order.order_date)} • {formatTime(order.order_date)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="font-black text-xs uppercase text-gray-500 mb-3 tracking-wide">
                                    Order Items ({order.items?.length || 0})
                                </h3>
                                <div className="space-y-2">
                                    {order.items?.map((item, idx) => (
                                        <div key={idx} className="bg-white border-2 border-gray-100">
                                            <div className="p-3 sm:p-4 flex gap-3 sm:gap-4">
                                                <img 
                                                    src={item.image} 
                                                    alt={item.product_name}
                                                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover bg-gray-100 flex-shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-sm sm:text-base mb-2 line-clamp-2">
                                                        {item.product_name}
                                                    </h4>
                                                    <div className="flex gap-2 mb-2 flex-wrap">
                                                        <span className="bg-black text-white text-xs px-2 py-0.5 font-bold">
                                                            SIZE {item.size_value}
                                                        </span>
                                                        <span className="bg-gray-100 text-xs px-2 py-0.5 font-bold">
                                                            QTY: {item.quantity}
                                                        </span>
                                                    </div>
                                                    <p className="font-black text-red-600 text-sm sm:text-base">
                                                        {formatCurrency(item.line_total)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Mobile Summary */}
                        <div className="sm:hidden flex-shrink-0 border-t-2 border-gray-100 p-4 space-y-3 bg-gray-50">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm font-bold">Total Paid</span>
                                <span className="text-xl font-black text-red-600">
                                    {formatCurrency(order.total)}
                                </span>
                            </div>
                            
                            <button 
                                onClick={onClose} 
                                className="w-full h-10 bg-black hover:bg-gray-800 text-white font-bold text-sm transition-all"
                            >
                                CLOSE
                            </button>
                        </div>
                    </div>

                    {/* ============ RIGHT PANEL (Desktop Only) ============ */}
                    <div className="hidden sm:flex w-72 flex-shrink-0 bg-gray-50 flex-col border-l-2 border-gray-100">
                        <div className="flex-1 p-5 space-y-4 overflow-y-auto">
                            <h4 className="font-black text-sm uppercase tracking-wide">Payment Summary</h4>
                            
                            {/* Pricing */}
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-bold">{formatCurrency(order.total)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="font-bold text-emerald-600">FREE</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="bg-black text-white p-4 -mx-5">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">TOTAL PAID</span>
                                    <span className="text-2xl font-black">{formatCurrency(order.total)}</span>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white border-2 border-gray-200 p-3 flex items-center gap-3">
                                <Banknote className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                <div>
                                    <p className="font-bold text-sm">Cash on Delivery</p>
                                    <p className="text-xs text-gray-500">Payment collected</p>
                                </div>
                            </div>

                            {/* Security Badge */}
                            <div className="bg-emerald-50 border-2 border-emerald-200 p-3 flex items-center gap-3">
                                <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                <span className="text-xs font-bold text-emerald-700">Verified Order</span>
                            </div>

                            {/* Completed Status */}
                            <div className="bg-emerald-50 border-2 border-emerald-200 p-3">
                                <div className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-emerald-700">Order Delivered</p>
                                        <p className="text-xs text-emerald-600 mt-1">Successfully completed</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Actions */}
                        <div className="flex-shrink-0 p-4 border-t-2 border-gray-100">
                            <button 
                                onClick={onClose} 
                                className="w-full h-10 bg-black hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
                            >
                                CLOSE
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}