import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Trash, Edit } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function AdminProduct() {
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);

    const [categoryFilter, setCategoryFilter] = useState("all");

    const navigate = useNavigate();

    // Load Products
    useEffect(() => {
        let isMounted = true;

        async function loadProducts() {
            try {
                const res = await axios.get("http://localhost:3000/api/products/view_products");
                if (isMounted) {
                    setProducts(res.data);
                    setFiltered(res.data);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                toast.error("Failed to load products.");
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadProducts();

        return () => { isMounted = false; };
    }, []);

    // DELETE PRODUCT FUNCTION
    async function handleDelete(productId) {

    const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "Are you sure you want to delete this product?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel",
        reverseButtons: true
    });

    if (!confirm.isConfirmed) return;

    try {
        const token = localStorage.getItem("token");

        await axios.delete(
            `http://localhost:3000/api/products/delete_product/${productId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire("Deleted!", "Product has been deleted.", "success");

        // Update UI instantly
        setProducts(prev => prev.filter(p => p.product_id !== productId));
        setFiltered(prev => prev.filter(p => p.product_id !== productId));

    } catch (error) {
        Swal.fire("Error!", error.response?.data?.message || "Delete failed", "error");
    }
}


    // Filter products by category
    useEffect(() => {
        if (categoryFilter === "all") {
            setFiltered(products);
        } else {
            setFiltered(products.filter(p => p.main_category === categoryFilter));
        }
    }, [categoryFilter, products]);


    return (
        <div className="w-full p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-red-600">📦 All Products</h1>

                <Link
                    to="/admin-page/add-product"
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow"
                >
                    + Add Product
                </Link>
            </div>

            {/* Category Filter */}
            <div className="mb-5 flex gap-3">
                <select
                    className="border px-4 py-2 rounded-lg"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="all">All Categories</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="child">Child</option>
                </select>
            </div>

            {/* Loading */}
            {loading && (
                <div className="text-center py-10 text-gray-500 font-medium">
                    Loading products...
                </div>
            )}

            {/* Product Table */}
            {!loading && (
                <div className="bg-white shadow-lg rounded-xl border border-red-200 overflow-hidden">
                    <table className="w-full table-auto">
                        <thead className="bg-red-600 text-white">
                            <tr>
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Image</th>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Category</th>
                                <th className="p-3 text-left">Sizes</th>
                                <th className="p-3 text-left">Price (Rs)</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-6 text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((product) => (
                                    <tr
                                        key={product.product_id}
                                        className="border-b hover:bg-red-50 transition"
                                    >

                                        {/* Product ID */}
                                        <td className="p-3 font-semibold text-gray-700">
                                            {product.product_id}
                                        </td>

                                        {/* Image */}
                                        <td className="p-3">
                                            {product.images?.length > 0 ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt="product"
                                                    className="w-16 h-16 object-cover rounded-lg border"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                                            )}
                                        </td>

                                        {/* Name */}
                                        <td className="p-3 font-semibold">{product.name}</td>

                                        {/* Category */}
                                        <td className="p-3 capitalize">{product.main_category}</td>

                                        {/* Sizes */}
                                        <td className="p-3">
                                            {product.sizes?.length === 0 ? (
                                                <span className="text-gray-500">No sizes</span>
                                            ) : (
                                                <div className="space-y-1">
                                                    {product.sizes.map((s, index) => (
                                                        <div key={index} className="flex gap-2">
                                                            <span className="font-medium">
                                                                Size {s.size_value}:
                                                            </span>
                                                            <span className="text-red-600">
                                                                {s.stock} in stock
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </td>

                                        {/* Price */}
                                        <td className="p-3 font-medium text-red-600">
                                            Rs. {Number(product.price).toLocaleString()}
                                        </td>

                                        {/* Actions */}
                                        <td className="p-3 flex justify-center gap-3">

                                            {/* View */}
                                            <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                                <Eye size={18} />
                                            </button>

                                            {/* Edit */}
                                            <button
                                                onClick={() =>
                                                    navigate("/admin-page/edit-product", {
                                                        state: product,
                                                    })
                                                }
                                                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                            >
                                                <Edit size={18} />
                                            </button>

                                            {/* Delete */}
                                            <button
                                                onClick={() => handleDelete(product.product_id)}
                                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                            >
                                                <Trash size={18} />
                                            </button>

                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
