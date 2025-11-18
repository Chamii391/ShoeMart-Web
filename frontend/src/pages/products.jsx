import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/productCart";
import Header from "../components/header";


export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProducts() {
            try {
                const res = await axios.get("http://localhost:3000/api/products/view_products");
                setProducts(res.data);
            } catch (error) {
                console.error("Error loading products:", error);
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, []);

    return (
        <>
        <Header />
        <div className="w-full min-h-screen bg-gray-50 p-6">

            <h1 className="text-3xl font-bold text-red-600 mb-6">🛍 All Products</h1>

            {loading ? (
                <div className="text-gray-500 text-center py-20 text-xl">
                    Loading products...
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.product_id} product={product} />
                    ))}
                </div>
            )}
        </div>
    </>
    );
    
}
