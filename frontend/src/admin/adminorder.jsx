import { useEffect, useState } from "react";
import axios from "axios";
import { 
    ShoppingBag, RefreshCw, Download, Search, ChevronLeft, ChevronRight,
    Loader2, AlertCircle, X, Clock, Truck, CheckCircle, XCircle,
    Phone, MapPin, ArrowRight, Hash, Layers, Copy, Printer,
    Calendar, Box, Receipt, Banknote, Shield, Check, Menu
} from "lucide-react";
import toast from "react-hot-toast";

// ============ STATUS CONFIG ============
const STATUS_CONFIG = {
    processing: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500", icon: Clock, label: "Processing", step: 1 },
    delivering: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500", icon: Truck, label: "Delivering", step: 2 },
    completed: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500", icon: CheckCircle, label: "Completed", step: 3 },
    cancelled: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", dot: "bg-red-500", icon: XCircle, label: "Cancelled", step: 0 }
};

const FILTER_TABS = ["all", "processing", "delivering", "completed"];

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [actionLoading, setActionLoading] = useState(null);
    const [copiedField, setCopiedField] = useState(null);
    const itemsPerPage = 10;

    useEffect(() => { loadOrders(); }, []);

    useEffect(() => {
        let result = orders;
        if (statusFilter !== "all") result = result.filter(o => o.status === statusFilter);
        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase();
            result = result.filter(o =>
                o.order_id.toString().includes(search) ||
                o.customer_name.toLowerCase().includes(search) ||
                o.customer_phone.includes(search)
            );
        }
        setFiltered(result);
        setCurrentPage(1);
    }, [statusFilter, searchTerm, orders]);

    async function loadOrders() {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:3000/api/orders/admin_orders", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data);
            setFiltered(res.data);
        } catch (err) {
            toast.error("Failed to load orders");
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    async function markAsDelivering(orderId) {
        setActionLoading(orderId);
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:3000/api/orders/accept_order/${orderId}`, 
                { status: "delivering" },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Order marked as Delivering");
            loadOrders();
            if (selectedOrder?.order_id === orderId) {
                setSelectedOrder(prev => ({ ...prev, status: "delivering" }));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating order");
        } finally {
            setActionLoading(null);
        }
    }

    const copyToClipboard = (text, fieldId) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldId);
        toast.success("Copied!");
        setTimeout(() => setCopiedField(null), 2000);
    };

    const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A";
    const getStatus = (status) => STATUS_CONFIG[status] || STATUS_CONFIG.processing;

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedOrders = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const stats = {
        total: orders.length,
        processing: orders.filter(o => o.status === "processing").length,
        delivering: orders.filter(o => o.status === "delivering").length,
        completed: orders.filter(o => o.status === "completed").length
    };

    return (
        <div className="h-full flex flex-col overflow-hidden bg-gray-50">

            {/* HEADER */}
            <div className="flex-shrink-0 bg-black px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg sm:text-xl font-black text-white">ORDERS</h1>
                        <p className="text-xs text-gray-500 hidden sm:block">{orders.length} total</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                    <button onClick={loadOrders} className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    </button>
                    <button className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center hidden sm:flex">
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* STATS - Scrollable on mobile */}
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
                                    ? isActive ? "bg-black text-white border-black" : "bg-gray-100 border-gray-200"
                                    : isActive ? `${config.bg} ${config.border}` : `${config.bg} ${config.border}`
                            }`}
                        >
                            <p className={`text-xs ${key === "total" ? (isActive ? "text-gray-400" : "text-gray-500") : config.text} capitalize`}>{key}</p>
                            <p className={`text-base sm:text-lg font-black ${key === "total" ? "" : config.text}`}>{value}</p>
                        </button>
                    );
                })}
            </div>

            {/* FILTERS */}
            <div className="flex-shrink-0 bg-white border-b-2 border-gray-100 px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-2 sm:gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-9 sm:h-10 pl-9 sm:pl-10 pr-3 border-2 border-gray-200 focus:border-black outline-none text-sm font-medium"
                    />
                </div>
                
                {/* Desktop Tabs */}
                <div className="hidden md:flex border-2 border-gray-200">
                    {FILTER_TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setStatusFilter(tab)}
                            className={`h-9 sm:h-10 px-3 sm:px-4 text-xs font-bold uppercase ${statusFilter === tab ? "bg-black text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Mobile Filter Dropdown */}
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="md:hidden h-9 px-2 border-2 border-gray-200 text-xs font-bold bg-white"
                >
                    {FILTER_TABS.map((tab) => (
                        <option key={tab} value={tab}>{tab.toUpperCase()}</option>
                    ))}
                </select>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-hidden bg-white">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-4">
                        <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-3" />
                        <h3 className="font-black text-base sm:text-lg mb-2">NO ORDERS FOUND</h3>
                        <button onClick={() => { setSearchTerm(""); setStatusFilter("all"); }} className="px-4 py-2 bg-black text-white text-xs sm:text-sm font-bold">
                            CLEAR FILTERS
                        </button>
                    </div>
                ) : (
                    <div className="h-full flex flex-col">
                        
                        {/* Desktop Table Header */}
                        <div className="flex-shrink-0 bg-gray-50 border-b-2 border-gray-200 px-4 py-2 hidden sm:grid grid-cols-12 gap-2 text-xs font-black text-gray-500 uppercase">
                            <div className="col-span-2">Order</div>
                            <div className="col-span-3">Customer</div>
                            <div className="col-span-2 hidden lg:block">Contact</div>
                            <div className="col-span-2">Total</div>
                            <div className="col-span-2 lg:col-span-2">Status</div>
                            <div className="col-span-1"></div>
                        </div>

                        {/* Orders List */}
                        <div className="flex-1 overflow-y-auto">
                            {paginatedOrders.map((order) => {
                                const status = getStatus(order.status);
                                const StatusIcon = status.icon;
                                return (
                                    <div
                                        key={order.order_id}
                                        onClick={() => setSelectedOrder(order)}
                                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all"
                                    >
                                        {/* Mobile View */}
                                        <div className="sm:hidden p-3 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                                                {order.customer_name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-black text-sm">#{order.order_id}</span>
                                                    <span className={`px-2 py-0.5 text-xs font-bold ${status.bg} ${status.text}`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-bold truncate">{order.customer_name}</p>
                                                <p className="text-xs text-gray-500">{order.customer_phone}</p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="font-black text-red-600 text-sm">Rs. {Number(order.total).toLocaleString()}</p>
                                                <ArrowRight className="w-4 h-4 text-gray-300 ml-auto mt-1" />
                                            </div>
                                        </div>

                                        {/* Desktop View */}
                                        <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-3 items-center">
                                            <div className="col-span-2 font-black text-sm">#{order.order_id}</div>
                                            <div className="col-span-3 flex items-center gap-2">
                                                <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                                                    {order.customer_name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-sm truncate">{order.customer_name}</span>
                                            </div>
                                            <div className="col-span-2 hidden lg:block text-sm text-gray-500 truncate">{order.customer_phone}</div>
                                            <div className="col-span-2 font-black text-red-600 text-sm">Rs. {Number(order.total).toLocaleString()}</div>
                                            <div className="col-span-2 lg:col-span-2">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-bold ${status.bg} ${status.text}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    <span className="hidden xl:inline">{status.label}</span>
                                                </span>
                                            </div>
                                            <div className="col-span-1 text-right">
                                                <ArrowRight className="w-4 h-4 text-gray-300 inline" />
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
                                    <span className="font-black text-black">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filtered.length)}</span>
                                    <span className="hidden sm:inline">{" of "}<span className="font-black text-black">{filtered.length}</span></span>
                                </p>
                                <div className="flex gap-1">
                                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 bg-gray-100 hover:bg-black hover:text-white disabled:opacity-30 flex items-center justify-center">
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <span className="px-2 sm:px-3 flex items-center font-bold text-xs sm:text-sm">{currentPage}/{totalPages}</span>
                                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 bg-gray-100 hover:bg-black hover:text-white disabled:opacity-30 flex items-center justify-center">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* MODAL */}
            {selectedOrder && (
                <OrderModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onMarkDelivering={markAsDelivering}
                    actionLoading={actionLoading}
                    copiedField={copiedField}
                    copyToClipboard={copyToClipboard}
                    formatDate={formatDate}
                    getStatus={getStatus}
                />
            )}
        </div>
    );
}

// ============ ORDER MODAL COMPONENT ============
function OrderModal({ order, onClose, onMarkDelivering, actionLoading, copiedField, copyToClipboard, formatDate, getStatus }) {
    const status = getStatus(order.status);

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

                    {/* Left Panel */}
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
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(order.order_date)}</span>
                                            <span className="flex items-center gap-1"><Box className="w-3 h-3" />{order.items?.length || 0} items</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={onClose} className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-red-600 flex items-center justify-center text-white">
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
                                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center ${isCompleted ? (isCurrent ? "bg-red-600 ring-2 sm:ring-4 ring-red-600/30" : "bg-red-600") : "bg-white/10"}`}>
                                                        <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isCompleted ? "text-white" : "text-white/30"}`} />
                                                    </div>
                                                    <span className={`text-xs mt-1 sm:mt-2 font-bold ${isCompleted ? "text-white" : "text-white/30"} hidden sm:block`}>{item.label}</span>
                                                </div>
                                                {idx < 2 && (
                                                    <div className="flex-1 h-0.5 mx-1 sm:mx-3 bg-white/10 relative">
                                                        <div className="absolute inset-y-0 left-0 bg-red-600 transition-all" style={{ width: item.step < status.step ? '100%' : '0%' }} />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
                            
                            {/* Customer Info */}
                            <div className="bg-gray-50 p-3 sm:p-4 flex items-start sm:items-center gap-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black text-white flex items-center justify-center font-black text-base sm:text-lg flex-shrink-0">
                                    {order.customer_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-black text-sm sm:text-base">{order.customer_name}</h3>
                                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-4 text-xs sm:text-sm text-gray-500 mt-1">
                                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{order.customer_phone}</span>
                                        <span className="flex items-start gap-1"><MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" /><span className="line-clamp-2">{order.customer_address}</span></span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="bg-white border border-gray-200">
                                    <div className="p-3 sm:p-4 flex gap-3 sm:gap-4">
                                        <img src={item.image} alt={item.product_name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover bg-gray-100 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-sm sm:text-base mb-1 sm:mb-2 line-clamp-2">{item.product_name}</h4>
                                            <div className="flex gap-2 mb-1 sm:mb-2 flex-wrap">
                                                <span className="bg-black text-white text-xs px-2 py-0.5 font-bold">SIZE {item.size_value}</span>
                                                <span className="bg-gray-100 text-xs px-2 py-0.5 font-bold">QTY: {item.quantity}</span>
                                            </div>
                                            <p className="font-black text-red-600 text-sm sm:text-base">Rs. {Number(item.line_total).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="px-3 sm:px-4 py-2 bg-gray-50 border-t flex flex-wrap gap-2 sm:gap-4 text-xs">
                                        <CopyField label="PID" value={item.product_id} fieldId={`pid-${idx}`} copiedField={copiedField} onCopy={copyToClipboard} />
                                        <CopyField label="SID" value={item.size_id} fieldId={`sid-${idx}`} copiedField={copiedField} onCopy={copyToClipboard} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mobile Summary (Shows at bottom on mobile) */}
                        <div className="sm:hidden flex-shrink-0 border-t border-gray-200 p-4 space-y-3 bg-gray-50">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">Total</span>
                                <span className="text-xl font-black text-red-600">Rs. {Number(order.total).toLocaleString()}</span>
                            </div>
                            
                            {order.status === "processing" && (
                                <button
                                    onClick={() => onMarkDelivering(order.order_id)}
                                    disabled={actionLoading === order.order_id}
                                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {actionLoading === order.order_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                                    MARK AS DELIVERING
                                </button>
                            )}

                            {order.status === "delivering" && (
                                <div className="w-full h-10 bg-blue-100 text-blue-700 font-black text-sm flex items-center justify-center gap-2">
                                    <Truck className="w-4 h-4" />OUT FOR DELIVERY
                                </div>
                            )}

                            {order.status === "completed" && (
                                <div className="w-full h-10 bg-emerald-100 text-emerald-700 font-black text-sm flex items-center justify-center gap-2">
                                    <CheckCircle className="w-4 h-4" />ORDER COMPLETED
                                </div>
                            )}

                            <div className="flex gap-2">
                                <button className="flex-1 h-10 bg-gray-200 font-bold text-xs flex items-center justify-center gap-2">
                                    <Printer className="w-4 h-4" />PRINT
                                </button>
                                <button onClick={onClose} className="flex-1 h-10 bg-black text-white font-bold text-xs flex items-center justify-center gap-2">
                                    CLOSE
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel (Desktop Only) */}
                    <div className="hidden sm:flex w-72 flex-shrink-0 bg-gray-50 flex-col border-l border-gray-200">
                        <div className="flex-1 p-5 space-y-4 overflow-y-auto">
                            <h4 className="font-black text-sm uppercase">Order Summary</h4>
                            
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-bold">Rs. {Number(order.total).toLocaleString()}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="font-bold text-green-600">FREE</span></div>
                            </div>

                            <div className="bg-black text-white p-4 -mx-5">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">TOTAL</span>
                                    <span className="text-2xl font-black">Rs. {Number(order.total).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 p-3 flex items-center gap-3">
                                <Banknote className="w-5 h-5 text-emerald-600" />
                                <div>
                                    <p className="font-bold text-sm">Cash on Delivery</p>
                                    <p className="text-xs text-gray-500">Collect on delivery</p>
                                </div>
                            </div>

                            <div className="bg-green-50 border border-green-200 p-3 flex items-center gap-3">
                                <Shield className="w-5 h-5 text-green-600" />
                                <span className="text-xs font-bold text-green-700">Secure Order</span>
                            </div>
                        </div>

                        {/* Desktop Actions */}
                        <div className="flex-shrink-0 p-4 border-t border-gray-200 space-y-2">
                            {order.status === "processing" && (
                                <button
                                    onClick={() => onMarkDelivering(order.order_id)}
                                    disabled={actionLoading === order.order_id}
                                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {actionLoading === order.order_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                                    MARK AS DELIVERING
                                </button>
                            )}

                            {order.status === "delivering" && (
                                <div className="w-full h-12 bg-blue-100 text-blue-700 font-black text-sm flex items-center justify-center gap-2">
                                    <Truck className="w-4 h-4" />OUT FOR DELIVERY
                                </div>
                            )}

                            {order.status === "completed" && (
                                <div className="w-full h-12 bg-emerald-100 text-emerald-700 font-black text-sm flex items-center justify-center gap-2">
                                    <CheckCircle className="w-4 h-4" />ORDER COMPLETED
                                </div>
                            )}

                            {order.status === "cancelled" && (
                                <div className="w-full h-12 bg-red-100 text-red-600 font-black text-sm flex items-center justify-center gap-2">
                                    <XCircle className="w-4 h-4" />ORDER CANCELLED
                                </div>
                            )}

                            <div className="flex gap-2">
                                <button className="flex-1 h-10 bg-gray-100 hover:bg-gray-200 font-bold text-xs flex items-center justify-center gap-2">
                                    <Printer className="w-4 h-4" />PRINT
                                </button>
                                <button onClick={onClose} className="flex-1 h-10 bg-black hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-2">
                                    CLOSE<ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// ============ COPY FIELD COMPONENT ============
function CopyField({ label, value, fieldId, copiedField, onCopy }) {
    const isCopied = copiedField === fieldId;
    return (
        <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-gray-500">{label}:</span>
            <code className="font-black bg-white border border-gray-200 px-1 sm:px-1.5 text-xs">{value}</code>
            <button
                onClick={(e) => { e.stopPropagation(); onCopy(value.toString(), fieldId); }}
                className={`w-5 h-5 flex items-center justify-center transition-all ${isCopied ? "bg-green-500 text-white" : "bg-gray-200 hover:bg-black hover:text-white"}`}
            >
                {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
        </div>
    );
}