import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Addproducts from "./addproducts";
import AdminProduct from "./adminproduct";
import EditProduct from "./editproduct";
import toast from "react-hot-toast";

export default function AdminPage() {

    const navigate = useNavigate();

    function logOut() {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        toast.success("Log out successful");
        navigate("/");
    }

    return (
        <div className="w-full h-screen flex">

            {/* Sidebar */}
            <div className="h-full w-[300px] flex flex-col justify-between p-4 bg-gray-100">

                {/* Sidebar Links */}
                <div className="flex flex-col space-y-4">
                    <Link to="/admin-page/products" className="hover:text-gray-400">Products</Link>
                    <Link to="/admin-page/add-products" className="hover:text-gray-400">Add Products</Link>
                    <Link to="/admin-page/users" className="hover:text-gray-400">Users</Link>
                    <Link to="/admin-page/orders" className="hover:text-gray-400">Orders</Link>
                </div>

                {/* Logout Button */}
                <button
                    onClick={logOut}
                    className="bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                    Logout
                </button>

            </div>

            {/* Routes Area */}
            <div className="h-full w-[calc(100%-300px)] p-4">
                <Routes>
                    <Route path="products" element={<AdminProduct />} />
                    <Route path="add-products" element={<Addproducts />} />
                    <Route path="users" element={<h1>Users</h1>} />
                    <Route path="orders" element={<h1>Orders</h1>} />
                    <Route path="edit-product" element={<EditProduct />} />
                </Routes>
            </div>

        </div>
    );
}
