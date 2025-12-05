import { useEffect, useState } from "react";
import axios from "axios";
import { 
    ShoppingBag, 
    Eye, 
    X, 
    Clock, 
    Truck, 
    CheckCircle, 
    XCircle,
    Package,
    Phone,
    MapPin,
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Ban,
    RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";

// Status Config
const STATUS_CONFIG = {
    processing: { 
        bg: "bg-amber-50", 
        text: "text-amber-700", 
        border: "border-amber-200",
        icon: Clock, 
        label: "Processing" 
    },
    delivering: { 
        bg: "bg-blue-50", 
        text: "text-blue-700", 
        border: "border-blue-200",
        icon: Truck, 
        label: "Delivering" 
    },
    completed: { 
        bg: "bg-emerald-50", 
        text: "text-emerald-700", 
        border: "border-emerald-200",
        icon: CheckCircle, 
        label: "Completed" 
    },
    cancelled: { 
        bg: "bg-red-50", 
        text: "text-red-600", 
        border: "border-red-200",
        icon: XCircle, 
        label: "Cancelled" 
    }
};

export default function UsersOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filter, setFilter] = useState("all");
    const [cancellingId, setCancellingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const userid = localStorage.getItem("UserId");

    // Load Orders
    useEffect(() => {
        loadOrders();
    }, [userid]);

    async function loadOrders() {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                `http://localhost:3000/api/orders/view_orders/${userid}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrders(res.data);
        } catch (err) {
            toast.error("Failed to load orders");
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    // Cancel Order
    async function cancelOrder(orderId) {
        if (!window.confirm("Are you sure you want to cancel this order?")) {
            return;
        }

        setCancellingId(orderId);

        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:3000/api/orders/cancel_order/${orderId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Order cancelled successfully");
            loadOrders();

            if (selectedOrder?.order_id === orderId) {
                setSelectedOrder(prev => ({ ...prev, status: "cancelled" }));
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel order");
        } finally {
            setCancellingId(null);
        }
    }

    // Helper Functions
    const getStatus = (status) => STATUS_CONFIG[status] || STATUS_CONFIG.processing;
    const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric' 
    }) : "N/A";

    // Filtering
    const filteredOrders = filter === "all" 
        ? orders 
        : orders.filter(o => o.status === filter);

    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage, 
        currentPage * itemsPerPage
    );

    // Stats
    const stats = {
        total: orders.length,
        processing: orders.filter(o => o.status === "processing").length,
        delivering: orders.filter(o => o.status === "delivering").length,
        completed: orders.filter(o => o.status === "completed").length,
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">

            {/* ============ HEADER ============ */}
            <div className="flex-shrink-0 bg-black px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-600 flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-xl font-black text-white">MY ORDERS</h1>
                            <p className="text-xs text-gray-500">{orders.length} total orders</p>
                        </div>
                    </div>
                    <button 
                        onClick={loadOrders}
                        className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                    </button>
                </div>
            </div>

            {/* ============ STATS ============ */}
            <div className="flex-shrink-0 bg-white border-b-2 border-gray-100 px-4 sm:px-6 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
                {Object.entries(stats).map(([key, value]) => {
                    const isActive = filter === (key === "total" ? "all" : key);
                    const config = key === "total" ? null : STATUS_CONFIG[key];
                    return (
                        <button
                            key={key}
                            onClick={() => { setFilter(key === "total" ? "all" : key); setCurrentPage(1); }}
                            className={`flex-shrink-0 px-4 py-2 border-2 transition-all ${
                                isActive 
                                    ? key === "total" 
                                        ? "bg-black text-white border-black" 
                                        : `${config.bg} ${config.border}`
                                    : "bg-gray-50 border-gray-200 hover:border-gray-300"
                            }`}
                        >
                            <p className={`text-xs font-bold uppercase ${
                                isActive && key !== "total" ? config.text : "text-gray-500"
                            }`}>
                                {key}
                            </p>
                            <p className={`text-lg font-black ${
                                isActive && key !== "total" ? config.text : ""
                            }`}>
                                {value}
                            </p>
                        </button>
                    );
                })}
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
                    <div className="h-full flex flex-col items-center justify-center p-6">
                        <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="font-black text-lg mb-2">NO ORDERS FOUND</h3>
                        <p className="text-gray-500 text-sm mb-4">
                            {filter !== "all" ? "No orders with this status" : "You haven't placed any orders yet"}
                        </p>
                        {filter !== "all" && (
                            <button 
                                onClick={() => setFilter("all")}
                                className="px-4 py-2 bg-black text-white text-sm font-bold"
                            >
                                VIEW ALL ORDERS
                            </button>
                        )}
                    </div>
                
                /* Orders List */
                ) : (
                    <div className="h-full flex flex-col">
                        
                        {/* Table Header - Desktop */}
                        <div className="flex-shrink-0 bg-gray-50 border-b-2 border-gray-100 px-4 py-3 hidden sm:grid grid-cols-12 gap-2 text-xs font-black text-gray-500 uppercase">
                            <div className="col-span-2">Order ID</div>
                            <div className="col-span-3">Customer</div>
                            <div className="col-span-2">Date</div>
                            <div className="col-span-2">Total</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-1">Action</div>
                        </div>

                        {/* Orders */}
                        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                            {paginatedOrders.map((order) => {
                                const status = getStatus(order.status);
                                const StatusIcon = status.icon;
                                
                                return (
                                    <div key={order.order_id} className="hover:bg-gray-50 transition-all">
                                        
                                        {/* Mobile View */}
                                        <div className="sm:hidden p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <p className="font-black">#{order.order_id}</p>
                                                    <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                                                </div>
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-bold ${status.bg} ${status.text}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {status.label}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <p className="font-black text-red-600">Rs. {Number(order.total).toLocaleString()}</p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setSelectedOrder(order)}
                                                        className="w-9 h-9 bg-black text-white flex items-center justify-center hover:bg-red-600 transition-all"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    {order.status === "processing" && (
                                                        <button
                                                            onClick={() => cancelOrder(order.order_id)}
                                                            disabled={cancellingId === order.order_id}
                                                            className="w-9 h-9 bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-all disabled:opacity-50"
                                                        >
                                                            {cancellingId === order.order_id 
                                                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                                                : <Ban className="w-4 h-4" />
                                                            }
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Desktop View */}
                                        <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-4 items-center">
                                            <div className="col-span-2 font-black">#{order.order_id}</div>
                                            <div className="col-span-3">
                                                <p className="font-bold text-sm truncate">{order.customer_name}</p>
                                                <p className="text-xs text-gray-500 truncate">{order.customer_phone}</p>
                                            </div>
                                            <div className="col-span-2 text-sm text-gray-500">
                                                {formatDate(order.created_at)}
                                            </div>
                                            <div className="col-span-2 font-black text-red-600">
                                                Rs. {Number(order.total).toLocaleString()}
                                            </div>
                                            <div className="col-span-2">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-bold ${status.bg} ${status.text}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {status.label}
                                                </span>
                                            </div>
                                            <div className="col-span-1 flex gap-2">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="w-9 h-9 bg-gray-100 hover:bg-black hover:text-white flex items-center justify-center transition-all"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {order.status === "processing" && (
                                                    <button
                                                        onClick={() => cancelOrder(order.order_id)}
                                                        disabled={cancellingId === order.order_id}
                                                        className="w-9 h-9 bg-red-100 hover:bg-red-600 text-red-600 hover:text-white flex items-center justify-center transition-all disabled:opacity-50"
                                                    >
                                                        {cancellingId === order.order_id 
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
                            <div className="flex-shrink-0 border-t-2 border-gray-100 px-4 py-3 flex items-center justify-between">
                                <p className="text-xs text-gray-500">
                                    Showing <span className="font-black text-black">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</span> of <span className="font-black text-black">{filteredOrders.length}</span>
                                </p>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="w-9 h-9 bg-gray-100 hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-gray-100 disabled:hover:text-black flex items-center justify-center transition-all"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <span className="px-3 flex items-center font-bold text-sm">
                                        {currentPage} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="w-9 h-9 bg-gray-100 hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-gray-100 disabled:hover:text-black flex items-center justify-center transition-all"
                                    >
                                        <ChevronRight className="w-4 h-4" />
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
                    onCancel={cancelOrder}
                    cancellingId={cancellingId}
                    getStatus={getStatus}
                    formatDate={formatDate}
                />
            )}
        </div>
    );
}


// ============ ORDER DETAIL MODAL ============
function OrderDetailModal({ order, onClose, onCancel, cancellingId, getStatus, formatDate }) {
    const status = getStatus(order.status);
    const StatusIcon = status.icon;

    const STEPS = [
        { step: 1, icon: Clock, label: "Processing" },
        { step: 2, icon: Truck, label: "Delivering" },
        { step: 3, icon: CheckCircle, label: "Completed" }
    ];

    const currentStep = order.status === "processing" ? 1 
        : order.status === "delivering" ? 2 
        : order.status === "completed" ? 3 : 0;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
                <div 
                    className="relative w-full sm:max-w-2xl max-h-[90vh] bg-white pointer-events-auto flex flex-col overflow-hidden rounded-t-2xl sm:rounded-none shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    
                    {/* Mobile Handle */}
                    <div className="sm:hidden flex justify-center py-2 bg-black rounded-t-2xl">
                        <div className="w-10 h-1 bg-white/30 rounded-full" />
                    </div>

                    {/* Header */}
                    <div className="flex-shrink-0 bg-black text-white p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 flex items-center justify-center">
                                    <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-black">ORDER #{order.order_id}</h2>
                                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(order.created_at)}
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                className="w-10 h-10 bg-white/10 hover:bg-red-600 flex items-center justify-center transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Status Badge */}
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-bold ${status.bg} ${status.text}`}>
                            <StatusIcon className="w-4 h-4" />
                            {status.label}
                        </span>

                        {/* Progress Steps */}
                        {order.status !== "cancelled" && (
                            <div className="flex items-center mt-6 pt-4 border-t border-white/10">
                                {STEPS.map((item, idx) => {
                                    const isCompleted = item.step <= currentStep;
                                    const isCurrent = item.step === currentStep;
                                    return (
                                        <div key={item.step} className="flex-1 flex items-center">
                                            <div className="flex flex-col items-center flex-1">
                                                <div className={`w-10 h-10 flex items-center justify-center transition-all ${
                                                    isCompleted 
                                                        ? isCurrent 
                                                            ? "bg-red-600 ring-4 ring-red-600/30" 
                                                            : "bg-red-600" 
                                                        : "bg-white/10"
                                                }`}>
                                                    <item.icon className={`w-5 h-5 ${isCompleted ? "text-white" : "text-white/30"}`} />
                                                </div>
                                                <span className={`text-xs mt-2 font-bold hidden sm:block ${
                                                    isCompleted ? "text-white" : "text-white/30"
                                                }`}>
                                                    {item.label}
                                                </span>
                                            </div>
                                            {idx < 2 && (
                                                <div className="w-full h-0.5 bg-white/10 mx-2 relative hidden sm:block">
                                                    <div 
                                                        className="absolute inset-y-0 left-0 bg-red-600 transition-all"
                                                        style={{ width: item.step < currentStep ? '100%' : '0%' }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                        
                        {/* Customer Info */}
                        <div className="bg-gray-50 p-4">
                            <h4 className="font-black text-xs uppercase text-gray-500 mb-3">Delivery Information</h4>
                            <div className="space-y-2">
                                <p className="font-bold">{order.customer_name}</p>
                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    {order.customer_phone}
                                </p>
                                <p className="text-sm text-gray-600 flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                    {order.customer_address}
                                </p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div>
                            <h4 className="font-black text-xs uppercase text-gray-500 mb-3">
                                Items ({order.items?.length || 0})
                            </h4>
                            <div className="space-y-3">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 p-3 bg-white border-2 border-gray-100">
                                        <img 
                                            src={item.image} 
                                            alt={item.product_name}
                                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover bg-gray-100 flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm sm:text-base line-clamp-1">{item.product_name}</p>
                                            <div className="flex gap-2 mt-1 mb-2">
                                                <span className="bg-black text-white text-xs px-2 py-0.5 font-bold">
                                                    SIZE {item.size_value}
                                                </span>
                                                <span className="bg-gray-100 text-xs px-2 py-0.5 font-bold">
                                                    QTY: {item.quantity}
                                                </span>
                                            </div>
                                            <p className="font-black text-red-600">
                                                Rs. {Number(item.line_total).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-black text-white p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-400">Subtotal</span>
                                <span className="font-bold">Rs. {Number(order.total).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-gray-400">Shipping</span>
                                <span className="font-bold text-green-400">FREE</span>
                            </div>
                            <div className="border-t border-white/20 pt-3 flex justify-between items-center">
                                <span className="font-black">TOTAL</span>
                                <span className="text-2xl font-black text-red-500">
                                    Rs. {Number(order.total).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex-shrink-0 p-4 border-t-2 border-gray-100 flex gap-3">
                        {order.status === "processing" && (
                            <button
                                onClick={() => onCancel(order.order_id)}
                                disabled={cancellingId === order.order_id}
                                className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                                {cancellingId === order.order_id ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        CANCELLING...
                                    </>
                                ) : (
                                    <>
                                        <Ban className="w-4 h-4" />
                                        CANCEL ORDER
                                    </>
                                )}
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className={`h-12 bg-black hover:bg-gray-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                                order.status === "processing" ? "flex-1" : "w-full"
                            }`}
                        >
                            CLOSE
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}