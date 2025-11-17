import { Link, Route, Routes } from "react-router-dom";
import Addproducts from "./addproducts";

export default function AdminPage() {
    return (
        <div className="w-full h-screen flex">

            {/* Sidebar */}
            <div className="h-full w-[300px] flex flex-col space-y-4 p-4 bg-gray-100">
                <Link to="/admin-page/products" className="hover:text-gray-400">Products</Link>
                <Link to="/admin-page/add-products" className="hover:text-gray-400">Add Products</Link>
                <Link to="/admin-page/users" className="hover:text-gray-400">Users</Link>
                <Link to="/admin-page/orders" className="hover:text-gray-400">Orders</Link>
         
            </div>

            {/* Routes Area */}
            <div className="h-full w-[calc(100%-300px)] p-4">

                <Routes>
                    <Route path="products" element={<h1>Products</h1>} />
                    <Route path="users" element={<h1>Users</h1>} />
                    <Route path="orders" element={<h1>Orders</h1>} />
                    <Route path="add-products" element={<Addproducts/>} />
                    
                </Routes>

            </div>

        </div>
    );
}
