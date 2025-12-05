import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { 
    Package, 
    Eye, 
    X, 
    Truck, 
    CheckCircle, 
    Phone,
    MapPin,
    Loader2,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Calendar,
    User
} from "lucide-react";

export default function DeliveryOrder() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [completingId, setCompletingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Load Orders
    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                "http://localhost:3000/api/orders/delivry_orders",
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

    // Complete Order
    async function acceptOrder(orderId) {
        setCompletingId(orderId);
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:3000/api/orders/complete_order/${orderId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Order marked as completed");
            loadOrders();

            if (selectedOrder?.order_id === orderId) {
                setSelectedOrder(prev => ({ ...prev, status: "completed" }));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating order");
        } finally {
            setCompletingId(null);
        }
    }

    // Helper
    const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric' 
    }) : "N/A";

    // Pagination
    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const paginatedOrders = orders.slice(
        (currentPage - 1) * itemsPerPage, 
        currentPage * itemsPerPage
    );

    return (
        <div className="h-full flex flex-col overflow-hidden">

            {/* ============ HEADER ============ */}
            <div className="flex-shrink-0 bg-black px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-600 flex items-center justify-center">
                            <Truck className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-xl font-black text-white">DELIVERY ORDERS</h1>
                            <p className="text-xs text-gray-500">{orders.length} orders assigned</p>
                        </div>
                    </div>
                    <button 
                        onClick={loadOrders}
                        disabled={loading}
                        className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                    </button>
                </div>
            </div>

            {/* ============ STATS BAR ============ */}
            <div className="flex-shrink-0 bg-white border-b-2 border-gray-100 px-4 sm:px-6 py-3 flex gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-2 border-blue-200">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <div>
                        <p className="text-xs text-blue-600 font-bold">DELIVERING</p>
                        <p className="text-lg font-black text-blue-700">
                            {orders.filter(o => o.status === "delivering").length}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border-2 border-emerald-200">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <div>
                        <p className="text-xs text-emerald-600 font-bold">COMPLETED</p>
                        <p className="text-lg font-black text-emerald-700">
                            {orders.filter(o => o.status === "completed").length}
                        </p>
                    </div>
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
                ) : orders.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-6">
                        <Truck className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="font-black text-lg mb-2">NO ORDERS ASSIGNED</h3>
                        <p className="text-gray-500 text-sm">No delivery orders available at the moment</p>
                    </div>
                
                /* Orders List */
                ) : (
                    <div className="h-full flex flex-col">
                        
                        {/* Table Header - Desktop */}
                        <div className="flex-shrink-0 bg-gray-50 border-b-2 border-gray-100 px-4 py-3 hidden sm:grid grid-cols-12 gap-2 text-xs font-black text-gray-500 uppercase">
                            <div className="col-span-1">ID</div>
                            <div className="col-span-3">Customer</div>
                            <div className="col-span-3">Address</div>
                            <div className="col-span-2">Total</div>
                            <div className="col-span-1">Status</div>
                            <div className="col-span-2 text-center">Actions</div>
                        </div>

                        {/* Orders */}
                        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                            {paginatedOrders.map((order) => (
                                <div key={order.order_id} className="hover:bg-gray-50 transition-all">
                                    
                                    {/* Mobile View */}
                                    <div className="sm:hidden p-4">
                                        {/* Top Row */}
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <p className="font-black">#{order.order_id}</p>
                                                <p className="font-bold text-sm">{order.customer_name}</p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-bold ${
                                                order.status === "delivering" 
                                                    ? "bg-blue-100 text-blue-700" 
                                                    : "bg-emerald-100 text-emerald-700"
                                            }`}>
                                                {order.status === "delivering" ? (
                                                    <span className="flex items-center gap-1">
                                                        <Truck className="w-3 h-3" />
                                                        Delivering
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Completed
                                                    </span>
                                                )}
                                            </span>
                                        </div>

                                        {/* Address */}
                                        <p className="text-xs text-gray-500 flex items-start gap-2 mb-3">
                                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                            {order.customer_address}
                                        </p>

                                        {/* Bottom Row */}
                                        <div className="flex items-center justify-between">
                                            <p className="font-black text-red-600">Rs. {Number(order.total).toLocaleString()}</p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="w-9 h-9 bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-all"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {order.status === "delivering" && (
                                                    <button
                                                        onClick={() => acceptOrder(order.order_id)}
                                                        disabled={completingId === order.order_id}
                                                        className="h-9 px-3 bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-emerald-700 transition-all disabled:opacity-50"
                                                    >
                                                        {completingId === order.order_id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <CheckCircle className="w-4 h-4" />
                                                                COMPLETE
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop View */}
                                    <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-4 items-center">
                                        <div className="col-span-1 font-black">#{order.order_id}</div>
                                        <div className="col-span-3">
                                            <p className="font-bold text-sm">{order.customer_name}</p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <Phone className="w-3 h-3" />
                                                {order.customer_phone}
                                            </p>
                                        </div>
                                        <div className="col-span-3 text-sm text-gray-500 truncate">
                                            {order.customer_address}
                                        </div>
                                        <div className="col-span-2 font-black text-red-600">
                                            Rs. {Number(order.total).toLocaleString()}
                                        </div>
                                        <div className="col-span-1">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-bold ${
                                                order.status === "delivering" 
                                                    ? "bg-blue-100 text-blue-700" 
                                                    : "bg-emerald-100 text-emerald-700"
                                            }`}>
                                                {order.status === "delivering" ? (
                                                    <Truck className="w-3 h-3" />
                                                ) : (
                                                    <CheckCircle className="w-3 h-3" />
                                                )}
                                            </span>
                                        </div>
                                        <div className="col-span-2 flex gap-2 justify-center">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="w-9 h-9 bg-gray-100 hover:bg-black hover:text-white flex items-center justify-center transition-all"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            {order.status === "delivering" && (
                                                <button
                                                    onClick={() => acceptOrder(order.order_id)}
                                                    disabled={completingId === order.order_id}
                                                    className="h-9 px-3 bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-emerald-700 transition-all disabled:opacity-50"
                                                >
                                                    {completingId === order.order_id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="w-4 h-4" />
                                                            COMPLETE
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex-shrink-0 border-t-2 border-gray-100 px-4 py-3 flex items-center justify-between">
                                <p className="text-xs text-gray-500">
                                    Showing <span className="font-black text-black">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, orders.length)}</span> of <span className="font-black text-black">{orders.length}</span>
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
                    onComplete={acceptOrder}
                    completingId={completingId}
                    formatDate={formatDate}
                />
            )}
        </div>
    );
}


// ============ ORDER DETAIL MODAL ============
function OrderDetailModal({ order, onClose, onComplete, completingId, formatDate }) {

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
                                    <Package className="w-5 h-5 sm:w-6 sm:h-6" />
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
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-bold ${
                            order.status === "delivering" 
                                ? "bg-blue-100 text-blue-700" 
                                : "bg-emerald-100 text-emerald-700"
                        }`}>
                            {order.status === "delivering" ? (
                                <>
                                    <Truck className="w-4 h-4" />
                                    Delivering
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    Completed
                                </>
                            )}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                        
                        {/* Customer Info */}
                        <div className="bg-gray-50 p-4">
                            <h4 className="font-black text-xs uppercase text-gray-500 mb-3">Customer Information</h4>
                            <div className="space-y-2">
                                <p className="font-bold flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-400" />
                                    {order.customer_name}
                                </p>
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
                                Order Items ({order.items?.length || 0})
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
                                <span className="font-black">COLLECT AMOUNT</span>
                                <span className="text-2xl font-black text-red-500">
                                    Rs. {Number(order.total).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex-shrink-0 p-4 border-t-2 border-gray-100 flex gap-3">
                        {order.status === "delivering" && (
                            <button
                                onClick={() => onComplete(order.order_id)}
                                disabled={completingId === order.order_id}
                                className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                                {completingId === order.order_id ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        COMPLETING...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        MARK AS COMPLETED
                                    </>
                                )}
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className={`h-12 bg-black hover:bg-gray-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                                order.status === "delivering" ? "flex-1" : "w-full"
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