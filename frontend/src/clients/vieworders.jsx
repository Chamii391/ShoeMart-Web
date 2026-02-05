import { useEffect, useState } from "react";
import axios from "axios";
import { 
    ShoppingBag, RefreshCw, Search, ChevronLeft, ChevronRight,
    Loader2, AlertCircle, X, Clock, Truck, CheckCircle, XCircle,
    Phone, MapPin, ArrowRight, Calendar, Box, Receipt, Banknote,
    Shield, Ban, Eye, Package
} from "lucide-react";
import Swal from "sweetalert2";

// ============ STATUS CONFIG ============
const STATUS_CONFIG = {
    processing: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500", icon: Clock, label: "Processing", step: 1 },
    delivering: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500", icon: Truck, label: "Delivering", step: 2 },
    completed: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500", icon: CheckCircle, label: "Completed", step: 3 },
    cancelled: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", dot: "bg-red-500", icon: XCircle, label: "Cancelled", step: 0 }
};

const FILTER_TABS = ["all", "processing", "delivering", "completed", "cancelled"];

export default function UsersOrders() {
    const [orders, setOrders] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [cancellingId, setCancellingId] = useState(null);
    const itemsPerPage = 10;

    const userid = localStorage.getItem("UserId");

    useEffect(() => { loadOrders(); }, [userid]);

    useEffect(() => {
        let result = orders;
        if (statusFilter !== "all") result = result.filter(o => o.status === statusFilter);
        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase();
            result = result.filter(o =>
                o.order_id.toString().includes(search) ||
                o.customer_name?.toLowerCase().includes(search) ||
                o.customer_phone?.includes(search)
            );
        }
        setFiltered(result);
        setCurrentPage(1);
    }, [statusFilter, searchTerm, orders]);

    async function loadOrders() {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                `http://localhost:3000/api/orders/view_orders/${userid}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrders(res.data);
            setFiltered(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    async function cancelOrder(orderId) {
        const result = await Swal.fire({
            title: '<strong>Cancel Order?</strong>',
            html: `
                <p>Are you sure you want to cancel order <strong>#${orderId}</strong>?</p>
                <p class="text-amber-600 text-sm mt-2">⚠️ This action cannot be undone</p>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DC2626',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, Cancel Order',
            cancelButtonText: 'Keep Order',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            setCancellingId(orderId);
            try {
                const token = localStorage.getItem("token");
                await axios.put(
                    `http://localhost:3000/api/orders/cancel_order/${orderId}`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                Swal.fire({
                    icon: 'success',
                    title: 'Order Cancelled!',
                    text: `Order #${orderId} has been cancelled successfully.`,
                    timer: 2000,
                    showConfirmButton: false
                });
                
                loadOrders();
                if (selectedOrder?.order_id === orderId) {
                    setSelectedOrder(prev => ({ ...prev, status: "cancelled" }));
                }
            } catch (error) {
                Swal.fire('Error!', 'Failed to cancel order. Please try again.', 'error');
                console.log(error);
            } finally {
                setCancellingId(null);
            }
        }
    }

    const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A";
    const formatDateTime = (date) => date ? new Date(date).toLocaleString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    }) : "N/A";
    const getStatus = (status) => STATUS_CONFIG[status] || STATUS_CONFIG.processing;

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedOrders = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const stats = {
        total: orders.length,
        processing: orders.filter(o => o.status === "processing").length,
        delivering: orders.filter(o => o.status === "delivering").length,
        completed: orders.filter(o => o.status === "completed").length,
        cancelled: orders.filter(o => o.status === "cancelled").length
    };

    return (
        <div className="h-full flex flex-col overflow-hidden bg-gray-50">

            {/* ============ HEADER - FIXED ============ */}
            <div className="flex-shrink-0 bg-black px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                    
                    {/* Left */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 flex items-center justify-center">
                            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-xl font-black text-white">MY ORDERS</h1>
                            <p className="text-xs text-gray-500 hidden sm:block">{orders.length} total orders</p>
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
                {Object.entries(stats).map(([key, value]) => {
                    const isActive = statusFilter === (key === "total" ? "all" : key);
                    const config = key === "total" ? null : STATUS_CONFIG[key];
                    return (
                        <button
                            key={key}
                            onClick={() => setStatusFilter(key === "total" ? "all" : key)}
                            className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 border-2 transition-all ${
                                key === "total"
                                    ? isActive ? "bg-black text-white border-black" : "bg-gray-100 border-gray-200 hover:bg-gray-200"
                                    : isActive 
                                        ? `${config.bg} ${config.border}` 
                                        : `${config.bg} ${config.border} hover:opacity-80`
                            }`}
                        >
                            <p className={`text-xs ${key === "total" ? (isActive ? "text-gray-400" : "text-gray-500") : config.text} capitalize`}>
                                {key}
                            </p>
                            <p className={`text-base sm:text-lg font-black ${key === "total" ? (isActive ? "text-white" : "text-black") : config.text}`}>
                                {value}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* ============ FILTERS ============ */}
            <div className="flex-shrink-0 bg-white border-b-2 border-gray-100 px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-2 sm:gap-4">
                
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-9 sm:h-10 pl-9 sm:pl-10 pr-3 border-2 border-gray-200 focus:border-black outline-none text-sm font-medium transition-all"
                    />
                </div>
                
                {/* Desktop Tabs */}
                <div className="hidden md:flex border-2 border-gray-200">
                    {FILTER_TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setStatusFilter(tab)}
                            className={`h-9 sm:h-10 px-3 sm:px-4 text-xs font-bold uppercase transition-all ${
                                statusFilter === tab 
                                    ? "bg-black text-white" 
                                    : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Mobile Filter Dropdown */}
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="md:hidden h-9 px-2 border-2 border-gray-200 text-xs font-bold bg-white focus:border-black outline-none"
                >
                    {FILTER_TABS.map((tab) => (
                        <option key={tab} value={tab}>{tab.toUpperCase()}</option>
                    ))}
                </select>
            </div>

            {/* ============ CONTENT ============ */}
            <div className="flex-1 overflow-hidden bg-white">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-4">
                        <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mb-4">
                            <Package className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="font-black text-base sm:text-lg mb-2">NO ORDERS FOUND</h3>
                        <p className="text-sm text-gray-500 mb-4 text-center">
                            {searchTerm || statusFilter !== "all" 
                                ? "No orders match your search criteria" 
                                : "You haven't placed any orders yet"
                            }
                        </p>
                        {(searchTerm || statusFilter !== "all") && (
                            <button 
                                onClick={() => { setSearchTerm(""); setStatusFilter("all"); }} 
                                className="h-10 px-6 bg-black hover:bg-red-600 text-white text-xs sm:text-sm font-bold transition-all"
                            >
                                CLEAR FILTERS
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex flex-col">
                        
                        {/* Desktop Table Header */}
                        <div className="flex-shrink-0 bg-gray-50 border-b-2 border-gray-200 px-4 py-2 hidden sm:grid grid-cols-12 gap-2 text-xs font-black text-gray-500 uppercase">
                            <div className="col-span-2">Order</div>
                            <div className="col-span-2">Date</div>
                            <div className="col-span-2">Items</div>
                            <div className="col-span-2">Total</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2 text-center">Actions</div>
                        </div>

                        {/* Orders List */}
                        <div className="flex-1 overflow-y-auto">
                            {paginatedOrders.map((order) => {
                                const status = getStatus(order.status);
                                const StatusIcon = status.icon;
                                const isProcessing = order.status === "processing";
                                const isCancelling = cancellingId === order.order_id;
                                
                                return (
                                    <div 
                                        key={order.order_id} 
                                        className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                                    >
                                        
                                        {/* Mobile View */}
                                        <div className="sm:hidden p-3 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                                                #{order.order_id}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-bold text-sm">{formatDate(order.order_date)}</span>
                                                    <span className={`px-2 py-0.5 text-xs font-bold ${status.bg} ${status.text}`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500">{order.items?.length || 0} items</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <p className="font-black text-red-600 text-sm">Rs. {Number(order.total).toLocaleString()}</p>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => setSelectedOrder(order)}
                                                        className="w-7 h-7 bg-gray-100 hover:bg-black hover:text-white flex items-center justify-center transition-all"
                                                    >
                                                        <Eye className="w-3 h-3" />
                                                    </button>
                                                    {isProcessing && (
                                                        <button
                                                            onClick={() => cancelOrder(order.order_id)}
                                                            disabled={isCancelling}
                                                            className="w-7 h-7 bg-red-100 hover:bg-red-600 hover:text-white text-red-600 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {isCancelling 
                                                                ? <Loader2 className="w-3 h-3 animate-spin" />
                                                                : <Ban className="w-3 h-3" />
                                                            }
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Desktop View */}
                                        <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-3 items-center">
                                            <div className="col-span-2 font-black text-sm">#{order.order_id}</div>
                                            <div className="col-span-2 text-sm text-gray-600">{formatDate(order.order_date)}</div>
                                            <div className="col-span-2 text-sm font-medium">{order.items?.length || 0} items</div>
                                            <div className="col-span-2 font-black text-red-600">Rs. {Number(order.total).toLocaleString()}</div>
                                            <div className="col-span-2">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-bold ${status.bg} ${status.text}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {status.label}
                                                </span>
                                            </div>
                                            <div className="col-span-2 flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="w-8 h-8 bg-gray-100 hover:bg-black hover:text-white flex items-center justify-center transition-all"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {isProcessing && (
                                                    <button
                                                        onClick={() => cancelOrder(order.order_id)}
                                                        disabled={isCancelling}
                                                        className="w-8 h-8 bg-red-100 hover:bg-red-600 hover:text-white text-red-600 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Cancel Order"
                                                    >
                                                        {isCancelling 
                                                            ? <Loader2 className="w-4 h-4 animate-spin" />
                                                            : <Ban className="w-4 h-4" />
                                                        }
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex-shrink-0 border-t-2 border-gray-100 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
                                <p className="text-xs text-gray-500">
                                    <span className="font-black text-black">
                                        {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filtered.length)}
                                    </span>
                                    <span className="hidden sm:inline">
                                        {" of "}<span className="font-black text-black">{filtered.length}</span>
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
                <OrderModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onCancel={cancelOrder}
                    cancellingId={cancellingId}
                    formatDate={formatDate}
                    formatDateTime={formatDateTime}
                    getStatus={getStatus}
                />
            )}
        </div>
    );
}

// ============ ORDER MODAL COMPONENT ============
function OrderModal({ order, onClose, onCancel, cancellingId, formatDate, formatDateTime, getStatus }) {
    const status = getStatus(order.status);
    const isCancelling = cancellingId === order.order_id;

    const STEPS = [
        { step: 1, icon: Clock, label: "Processing" },
        { step: 2, icon: Truck, label: "Delivering" },
        { step: 3, icon: CheckCircle, label: "Completed" }
    ];

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
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 flex items-center justify-center">
                                        <Receipt className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                            <h2 className="text-xl sm:text-2xl font-black text-white">#{order.order_id}</h2>
                                            <span className={`px-2 py-0.5 text-xs font-bold ${status.bg} ${status.text}`}>
                                                {status.label.toUpperCase()}
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

                            {/* Progress Steps */}
                            {order.status !== "cancelled" && (
                                <div className="flex items-center pt-3 sm:pt-4 border-t border-white/10">
                                    {STEPS.map((item, idx) => {
                                        const isCompleted = item.step <= status.step;
                                        const isCurrent = item.step === status.step;
                                        return (
                                            <div key={item.step} className="flex-1 flex items-center">
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transition-all ${
                                                        isCompleted 
                                                            ? (isCurrent ? "bg-red-600 ring-2 sm:ring-4 ring-red-600/30" : "bg-red-600") 
                                                            : "bg-white/10"
                                                    }`}>
                                                        <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isCompleted ? "text-white" : "text-white/30"}`} />
                                                    </div>
                                                    <span className={`text-xs mt-1 sm:mt-2 font-bold hidden sm:block ${isCompleted ? "text-white" : "text-white/30"}`}>
                                                        {item.label}
                                                    </span>
                                                </div>
                                                {idx < 2 && (
                                                    <div className="flex-1 h-0.5 mx-1 sm:mx-3 bg-white/10 relative">
                                                        <div 
                                                            className="absolute inset-y-0 left-0 bg-red-600 transition-all duration-300" 
                                                            style={{ width: item.step < status.step ? '100%' : '0%' }} 
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Cancelled Status */}
                            {order.status === "cancelled" && (
                                <div className="pt-3 sm:pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-3 text-red-400">
                                        <XCircle className="w-5 h-5" />
                                        <span className="font-bold text-sm">Order has been cancelled</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                            
                            {/* Delivery Information */}
                            <div className="bg-gray-50 border-2 border-gray-100 p-3 sm:p-4">
                                <h3 className="font-black text-xs uppercase text-gray-500 mb-3 tracking-wide">
                                    Delivery Information
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

                            {/* Order Timeline */}
                            <div className="bg-gray-50 border-2 border-gray-100 p-3 sm:p-4">
                                <h3 className="font-black text-xs uppercase text-gray-500 mb-3 tracking-wide">
                                    Order Timeline
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Order Placed:</span>
                                        <span className="font-bold">{formatDateTime(order.order_date)}</span>
                                    </div>
                                    {order.updated_at && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Last Updated:</span>
                                            <span className="font-bold">{formatDateTime(order.updated_at)}</span>
                                        </div>
                                    )}
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
                                                        Rs. {Number(item.line_total).toLocaleString()}
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
                                <span className="text-gray-500 text-sm font-bold">Total Amount</span>
                                <span className="text-xl font-black text-red-600">
                                    Rs. {Number(order.total).toLocaleString()}
                                </span>
                            </div>
                            
                            {order.status === "processing" && (
                                <button
                                    onClick={() => onCancel(order.order_id)}
                                    disabled={isCancelling}
                                    className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-black text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isCancelling 
                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                        : <Ban className="w-4 h-4" />
                                    }
                                    {isCancelling ? "CANCELLING..." : "CANCEL ORDER"}
                                </button>
                            )}

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
                            <h4 className="font-black text-sm uppercase tracking-wide">Order Summary</h4>
                            
                            {/* Pricing */}
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-bold">Rs. {Number(order.total).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="font-bold text-emerald-600">FREE</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="bg-black text-white p-4 -mx-5">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">TOTAL</span>
                                    <span className="text-2xl font-black">Rs. {Number(order.total).toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white border-2 border-gray-200 p-3 flex items-center gap-3">
                                <Banknote className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                <div>
                                    <p className="font-bold text-sm">Cash on Delivery</p>
                                    <p className="text-xs text-gray-500">Payment on delivery</p>
                                </div>
                            </div>

                            {/* Security Badge */}
                            <div className="bg-emerald-50 border-2 border-emerald-200 p-3 flex items-center gap-3">
                                <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                <span className="text-xs font-bold text-emerald-700">Secure Order</span>
                            </div>

                            {/* Status Info Cards */}
                            {order.status === "processing" && (
                                <div className="bg-amber-50 border-2 border-amber-200 p-3">
                                    <div className="flex items-start gap-2">
                                        <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-bold text-amber-700">Order is being processed</p>
                                            <p className="text-xs text-amber-600 mt-1">You can cancel before it ships</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {order.status === "delivering" && (
                                <div className="bg-blue-50 border-2 border-blue-200 p-3">
                                    <div className="flex items-start gap-2">
                                        <Truck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-bold text-blue-700">Your order is on the way</p>
                                            <p className="text-xs text-blue-600 mt-1">Expected delivery soon</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {order.status === "completed" && (
                                <div className="bg-emerald-50 border-2 border-emerald-200 p-3">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-bold text-emerald-700">Order delivered successfully</p>
                                            <p className="text-xs text-emerald-600 mt-1">Thank you for shopping!</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {order.status === "cancelled" && (
                                <div className="bg-red-50 border-2 border-red-200 p-3">
                                    <div className="flex items-start gap-2">
                                        <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-bold text-red-700">Order has been cancelled</p>
                                            <p className="text-xs text-red-600 mt-1">No charges applied</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Desktop Actions */}
                        <div className="flex-shrink-0 p-4 border-t-2 border-gray-100 space-y-2">
                            {order.status === "processing" && (
                                <button
                                    onClick={() => onCancel(order.order_id)}
                                    disabled={isCancelling}
                                    className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-black text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isCancelling 
                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                        : <Ban className="w-4 h-4" />
                                    }
                                    {isCancelling ? "CANCELLING..." : "CANCEL ORDER"}
                                </button>
                            )}

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