import toast from "react-hot-toast";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import DeliveryOrder from "./deliveryOrder";


export default function DeliveryPage() {

    const navigate = useNavigate();

    function logOut() {
        localStorage.removeItem("token");
       
        toast.success("Log out successful");
        navigate("/");
    }

    return (
        <div className="w-full h-screen flex">

            {/* Sidebar */}
            <div className="h-full w-[300px] flex flex-col justify-between p-4 bg-gray-100">

                {/* Top Links */}
                <div className="flex flex-col space-y-4">
                
                    <Link to="/deliver-page/orders" className="hover:text-gray-400">Orders</Link>
                 

                </div>

                {/* Logout Button */}
                <button
                    onClick={logOut}
                    className="mt-6 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                    Logout
                </button>
            </div>

            {/* Routes Area */}
            <div className="h-full w-[calc(100%-300px)] p-4">
                <Routes>
                    
                   
                  
                    <Route path="orders" element={<DeliveryOrder/>} />
                    
                </Routes>
            </div>

        </div>
    );
}
