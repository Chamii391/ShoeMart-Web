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
    Filter,
    History
} from "lucide-react";

const TIME_PERIODS = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "3months", label: "Last 3 Months" },
    { value: "all", label: "All Time" }
];

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [timePeriod, setTimePeriod] = useState("all");
    const itemsPerPage = 8;

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

            {/* ============ HEADER ============ */}
            <div className="flex-shrink-0 bg-gradient-to-r from-red-600 to-red-700 px-4 sm:px-6 py-4 border-b-4 border-black">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center shadow-lg">
                            <History className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-white">ORDER HISTORY</h1>
                            <p className="text-xs sm:text-sm text-red-100">
                                {loading ? "Loading..." : `${filteredOrders.length} completed ${filteredOrders.length === 1 ? 'delivery' : 'deliveries'}`}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={loadOrders}
                            disabled={loading}
                            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg text-white flex items-center justify-center transition-all disabled:opacity-50"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ============ STATS BAR ============ */}
            <div className="flex-shrink-0 bg-white border-b-2 border-gray-200 px-4 sm:px-6 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    {/* Total Completed */}
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border-2 border-red-200 hover:border-red-600 transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <CheckCircle className="w-8 h-8 text-red-600" />
                            <span className="text-3xl font-black text-red-900">
                                {loading ? "-" : filteredOrders.length}
                            </span>
                        </div>
                        <p className="text-xs font-bold text-red-700 uppercase">Completed Orders</p>
                    </div>

                    {/* Total Revenue */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200 hover:border-black transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <TrendingUp className="w-8 h-8 text-black" />
                            <span className="text-2xl font-black text-black">
                                {loading ? "-" : `₨${(totalRevenue / 1000).toFixed(1)}k`}
                            </span>
                        </div>
                        <p className="text-xs font-bold text-gray-700 uppercase">Total Revenue</p>
                    </div>

                    {/* Average Order Value */}
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border-2 border-red-200 hover:border-red-600 transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <Package className="w-8 h-8 text-red-600" />
                            <span className="text-2xl font-black text-red-900">
                                {loading ? "-" : formatCurrency(averageOrderValue).replace("Rs. ", "₨")}
                            </span>
                        </div>
                        <p className="text-xs font-bold text-red-700 uppercase">Avg Order Value</p>
                    </div>

                    {/* Time Period */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200 hover:border-black transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <Clock className="w-8 h-8 text-black" />
                            <span className="text-lg font-black text-black capitalize">
                                {TIME_PERIODS.find(p => p.value === timePeriod)?.label || "All"}
                            </span>
                        </div>
                        <p className="text-xs font-bold text-gray-700 uppercase">Time Period</p>
                    </div>
                </div>
            </div>

            {/* ============ FILTERS ============ */}
            <div className="flex-shrink-0 bg-white border-b-2 border-gray-200 px-4 sm:px-6 py-3">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-bold text-gray-900">Filter by:</span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                        {TIME_PERIODS.map((period) => (
                            <button
                                key={period.value}
                                onClick={() => setTimePeriod(period.value)}
                                className={`px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-all ${
                                    timePeriod === period.value
                                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {period.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ============ CONTENT ============ */}
            <div className="flex-1 overflow-hidden bg-white">
                
                {/* Loading */}
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <Loader2 className="w-10 h-10 text-red-600 animate-spin mx-auto mb-4" />
                            <p className="text-gray-600 font-semibold">Loading order history...</p>
                        </div>
                    </div>
                
                /* Empty State */
                ) : filteredOrders.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-6">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-10 h-10 text-red-600" />
                        </div>
                        <h3 className="font-black text-xl mb-2 text-gray-900">No Orders Found</h3>
                        <p className="text-gray-500 text-center max-w-sm mb-4">
                            {timePeriod === "all" 
                                ? "No completed orders yet"
                                : `No completed orders in ${TIME_PERIODS.find(p => p.value === timePeriod)?.label.toLowerCase()}`
                            }
                        </p>
                        {timePeriod !== "all" && (
                            <button 
                                onClick={() => setTimePeriod("all")}
                                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
                            >
                                View All Orders
                            </button>
                        )}
                    </div>
                
                /* Orders List */
                ) : (
                    <div className="h-full flex flex-col">
                        
                        {/* Table Header - Desktop */}
                        <div className="flex-shrink-0 bg-gray-50 border-b-2 border-gray-200 px-4 py-3 hidden sm:grid grid-cols-12 gap-4 text-xs font-bold text-gray-600 uppercase">
                            <div className="col-span-1">Order ID</div>
                            <div className="col-span-2">Date & Time</div>
                            <div className="col-span-3">Customer</div>
                            <div className="col-span-2">Address</div>
                            <div className="col-span-2">Amount</div>
                            <div className="col-span-1">Items</div>
                            <div className="col-span-1 text-center">Action</div>
                        </div>

                        {/* Orders */}
                        <div className="flex-1 overflow-y-auto">
                            {paginatedOrders.map((order, index) => (
                                <div 
                                    key={order.order_id} 
                                    className="border-b border-gray-100 hover:bg-red-50 transition-all"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    
                                    {/* Mobile View */}
                                    <div className="sm:hidden p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-black text-gray-900">#{order.order_id}</span>
                                                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1 border border-red-200">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Completed
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(order.order_date)} • {formatTime(order.order_date)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <p className="font-bold text-sm">{order.customer_name}</p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                <Phone className="w-3 h-3" />
                                                {order.customer_phone}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-gray-500">Total Amount</p>
                                                <p className="font-black text-lg text-red-600">
                                                    {formatCurrency(order.total)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md"
                                            >
                                                View
                                            </button>
                                        </div>
                                    </div>

                                    {/* Desktop View */}
                                    <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-4 items-center">
                                        <div className="col-span-1">
                                            <span className="font-black text-gray-900">#{order.order_id}</span>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm font-semibold text-gray-900">{formatDate(order.order_date)}</p>
                                            <p className="text-xs text-gray-500">{formatTime(order.order_date)}</p>
                                        </div>
                                        <div className="col-span-3">
                                            <p className="font-bold text-sm text-gray-900">{order.customer_name}</p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                <Phone className="w-3 h-3" />
                                                {order.customer_phone}
                                            </p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {order.customer_address}
                                            </p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="font-black text-red-600">
                                                {formatCurrency(order.total)}
                                            </p>
                                        </div>
                                        <div className="col-span-1">
                                            <span className="text-sm text-gray-600 font-semibold">
                                                {order.items?.length || 0}
                                            </span>
                                        </div>
                                        <div className="col-span-1 flex justify-center">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-2 bg-gray-100 hover:bg-red-600 hover:text-white rounded-lg transition-all"
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
                            <div className="flex-shrink-0 border-t-2 border-gray-200 px-4 py-3 flex items-center justify-between bg-gray-50">
                                <p className="text-sm text-gray-600">
                                    Showing <span className="font-bold text-black">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                                    <span className="font-bold text-black">{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</span> of{" "}
                                    <span className="font-bold text-black">{filteredOrders.length}</span> orders
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1.5 bg-white border-2 border-gray-300 rounded-lg text-sm font-bold disabled:opacity-50 hover:border-black transition-all"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-3 py-1.5 text-sm font-bold">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1.5 bg-white border-2 border-gray-300 rounded-lg text-sm font-bold disabled:opacity-50 hover:border-black transition-all"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ============ ORDER DETAIL MODAL ============ */}
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
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                <div 
                    className="relative w-full sm:max-w-2xl max-h-[90vh] bg-white flex flex-col overflow-hidden rounded-t-3xl sm:rounded-2xl shadow-2xl border-4 border-red-600"
                    onClick={(e) => e.stopPropagation()}
                >
                    
                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center shadow-lg">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black">ORDER #{order.order_id}</h2>
                                    <div className="flex items-center gap-3 text-sm text-red-100 mt-1">
                                        <span>{formatDate(order.order_date)}</span>
                                        <span>•</span>
                                        <span>{formatTime(order.order_date)}</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg font-bold">
                            <CheckCircle className="w-5 h-5" />
                            Delivered Successfully
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        
                        {/* Customer Info Card */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border-2 border-gray-200">
                            <h4 className="font-bold text-sm text-gray-900 uppercase mb-4 flex items-center gap-2">
                                <User className="w-4 h-4 text-red-600" />
                                Customer Information
                            </h4>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1 font-semibold">Name</p>
                                    <p className="font-bold text-gray-900">{order.customer_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1 font-semibold">Phone</p>
                                    <p className="font-bold text-gray-900">{order.customer_phone}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-xs text-gray-500 mb-1 font-semibold">Delivery Address</p>
                                    <p className="font-bold text-gray-900">{order.customer_address}</p>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Timeline */}
                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
                            <h4 className="font-bold text-sm text-red-700 uppercase mb-4 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Delivery Timeline
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-md">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Order Completed</p>
                                        <p className="text-xs text-gray-500 font-semibold">{formatDate(order.order_date)} • {formatTime(order.order_date)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div>
                            <h4 className="font-bold text-sm text-gray-900 uppercase mb-4 flex items-center gap-2">
                                <Package className="w-4 h-4 text-red-600" />
                                Order Items ({order.items?.length || 0})
                            </h4>
                            <div className="space-y-3">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="bg-white rounded-lg border-2 border-gray-200 p-4 hover:border-red-600 hover:shadow-lg transition-all">
                                        <div className="flex gap-4">
                                            <img 
                                                src={item.image} 
                                                alt={item.product_name}
                                                className="w-20 h-20 object-cover rounded-lg bg-gray-100 border-2 border-gray-200"
                                            />
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-900 mb-2">{item.product_name}</p>
                                                <div className="flex gap-2 mb-2">
                                                    <span className="px-2 py-1 bg-black text-white text-xs font-bold rounded">
                                                        SIZE {item.size_value}
                                                    </span>
                                                    <span className="px-2 py-1 bg-gray-100 border border-gray-300 text-xs font-bold rounded">
                                                        QTY: {item.quantity}
                                                    </span>
                                                </div>
                                                <p className="font-black text-red-600">
                                                    {formatCurrency(item.line_total)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-gradient-to-br from-black to-gray-900 text-white rounded-xl p-5 border-4 border-red-600">
                            <h4 className="font-black text-sm uppercase mb-4">Payment Summary</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="font-bold">{formatCurrency(order.total)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Delivery Fee</span>
                                    <span className="text-red-400 font-bold">FREE</span>
                                </div>
                                <div className="border-t-2 border-red-600/50 pt-3 flex justify-between items-center">
                                    <span className="text-lg font-black">Total Paid</span>
                                    <span className="text-2xl font-black text-red-500">
                                        {formatCurrency(order.total)}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t-2 border-red-600/50">
                                <p className="text-xs text-gray-400">✓ Payment collected via Cash on Delivery</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t-2 border-gray-200 p-4 bg-gray-50">
                        <button
                            onClick={onClose}
                            className="w-full h-12 bg-gradient-to-r from-black to-gray-900 hover:from-gray-900 hover:to-black text-white font-black rounded-lg transition-all shadow-lg"
                        >
                            CLOSE
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}