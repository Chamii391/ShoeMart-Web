import { useEffect, useState } from "react";
import axios from "axios";
import { Eye } from "lucide-react";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // -------------------------------------------
    // Load all orders
    // -------------------------------------------
    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(
                "http://localhost:3000/api/orders/admin_orders",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setOrders(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    // -------------------------------------------
    // ACCEPT ORDER
    // -------------------------------------------
    async function acceptOrder(orderId) {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.put(
                `http://localhost:3000/api/orders/accept_order/${orderId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            alert(res.data.message);
            loadOrders(); // reload
        } catch (error) {
            alert(error.response?.data?.message || "Error updating order");
        }
    }

    return (
        <div className="p-6">

            <h1 className="text-3xl font-bold text-red-600 mb-6">
                📦 All Orders
            </h1>

            {loading && (
                <p className="text-center text-gray-500">Loading orders...</p>
            )}

            {!loading && orders.length === 0 && (
                <p className="text-center text-gray-500">No orders found.</p>
            )}

            {!loading && orders.length > 0 && (
                <div className="bg-white border rounded-xl shadow overflow-hidden">
                    <table className="w-full table-auto">
                        <thead className="bg-red-600 text-white">
                            <tr>
                                <th className="p-3 text-left">Order ID</th>
                                <th className="p-3 text-left">Customer</th>
                                <th className="p-3 text-left">Phone</th>
                                <th className="p-3 text-left">Address</th>
                                <th className="p-3 text-left">Total (Rs)</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((order) => (
                                <tr
                                    key={order.order_id}
                                    className="border-b hover:bg-red-50 transition"
                                >
                                    <td className="p-3 font-semibold">{order.order_id}</td>
                                    <td className="p-3">{order.customer_name}</td>
                                    <td className="p-3">{order.customer_phone}</td>
                                    <td className="p-3">{order.customer_address}</td>

                                    <td className="p-3 font-bold text-red-600">
                                        Rs. {Number(order.total).toLocaleString()}
                                    </td>

                                    <td className="p-3 capitalize font-semibold">
                                        {order.status}
                                    </td>

                                    <td className="p-3 flex gap-2 justify-center">

                                        {/* View Button */}
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            <Eye size={20} />
                                        </button>

                                        {/* Accept Order Button (only if status is processing) */}
                                        {order.status === "processing" && (
                                            <button
                                                onClick={() => acceptOrder(order.order_id)}
                                                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                            >
                                                Accept
                                            </button>
                                        )}

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* -------- ORDER DETAILS POPUP -------- */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-[600px] max-h-[80vh] overflow-auto">

                        <h2 className="text-2xl font-bold mb-4">
                            Order #{selectedOrder.order_id}
                        </h2>

                        <p><b>Customer:</b> {selectedOrder.customer_name}</p>
                        <p><b>Phone:</b> {selectedOrder.customer_phone}</p>
                        <p><b>Address:</b> {selectedOrder.customer_address}</p>

                        <h3 className="text-xl font-bold mt-4 mb-2">Items</h3>

                        <div className="space-y-3">
                            {selectedOrder.items.map((item, idx) => (
                                <div key={idx} className="flex gap-4 border p-3 rounded-lg">
                                    <img
                                        src={item.image}
                                        className="w-20 h-20 object-cover rounded border"
                                    />

                                    <div>
                                        <p className="font-bold">{item.product_name}</p>
                                        <p>Size: {item.size_value}</p>
                                        <p>Qty: {item.quantity}</p>
                                        <p className="font-bold text-red-600">
                                            Rs. {item.line_total.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h2 className="text-2xl font-bold mt-4 text-right">
                            Total: Rs. {selectedOrder.total.toLocaleString()}
                        </h2>

                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="mt-6 w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900"
                        >
                            Close
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
}
