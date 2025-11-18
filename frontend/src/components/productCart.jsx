import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
    const image = product.images?.[0] || null;

    return (
        
        <Link to = {"/overview/"+product.product_id}  className="w-full bg-white shadow-md rounded-xl overflow-hidden border border-red-300 hover:shadow-xl transition">
        <div className="w-full bg-white shadow-md rounded-xl overflow-hidden border border-red-300 hover:shadow-xl transition">

            {/* Product Image */}
            <div className="w-full h-56 bg-gray-100 flex items-center justify-center">
                {image ? (
                    <img
                        src={image}
                        alt="product"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="text-gray-500">No Image</div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h2 className="text-xl font-bold text-black">
                    {product.name}
                </h2>

                <p className="text-gray-600 text-sm mt-1">
                    {product.altNames || "—"}
                </p>

                <p className="text-red-600 text-xl font-bold mt-3">
                    Rs. {Number(product.price).toLocaleString()}
                </p>

                <button className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-semibold">
                    View Details
                </button>
            </div>

        </div>
        </Link>
    );
}
