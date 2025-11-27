import { Link } from "react-router-dom";
import { Star, ArrowRight } from "lucide-react";

export default function ProductCard({ product }) {
    const image = product.images?.[0] || null;

    return (
        <Link 
            to={"/overview/" + product.product_id}  
            className="group block"
        >
            <div className="relative bg-white overflow-hidden transition-all duration-500 hover:shadow-2xl">
                
                {/* Red Accent Line - Top */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 group-hover:bg-red-600 transition-all duration-300 z-10"></div>

                {/* Image Container */}
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 h-72">
                    {image ? (
                        <img
                            src={image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M2 18h20v2H2v-2zm2.55-7.86c-.21-.4-.17-.87.07-1.24l3.14-4.84c.28-.43.76-.69 1.27-.69h2.09c.37 0 .72.15.98.41l.93.93c.26.26.62.41.98.41h5.99c.55 0 1 .45 1 1v2c0 1.1-.9 2-2 2h-1.5L19 13h-2l-2-3h-1.5l-1-1.5H11l-2 3.5H7l-.75 1.5H4.5c-.73 0-1.41-.38-1.79-.99l-.16-.27z"/>
                            </svg>
                        </div>
                    )}

                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* View Button on Hover */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        <span className="bg-white text-black px-6 py-2 text-xs font-black tracking-widest flex items-center gap-2">
                            VIEW DETAILS
                            <ArrowRight className="w-4 h-4" />
                        </span>
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-5 bg-white">
                    
                    {/* Brand/Category Tag */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                            Premium Collection
                        </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-black text-base text-black group-hover:text-red-600 transition-colors duration-300 line-clamp-1 mb-3">
                        {product.name}
                    </h3>
                    
                    {/* Rating & Price Row */}
                    <div className="flex items-center justify-between">
                        
                        {/* Rating */}
                        <div className="flex items-center gap-1">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-red-600 text-red-600" />
                                ))}
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium ml-1">4.8</span>
                        </div>

                        {/* Price */}
                        <p className="text-red-600 font-black text-lg">
                            Rs. {Number(product.price).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Bottom Border Animation */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-red-600 group-hover:w-full transition-all duration-500"></div>
            </div>
        </Link>
    );
}