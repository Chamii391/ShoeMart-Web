import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, Upload, Trash2, Image as ImageIcon } from "lucide-react";
import mediaUpload from "../utils/mediaUpload";

export default function EditProduct() {
    const { state: product } = useLocation();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [altNames, setAltNames] = useState("");
    const [description, setDescription] = useState("");
    const [mainCategory, setMainCategory] = useState("");
    const [price, setPrice] = useState("");
    const [color, setColor] = useState("");
    const [country, setCountry] = useState("");
    const [images, setImages] = useState([]); // NEW UPLOADED FILES
    const [previewImages, setPreviewImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]); // URLs already in database

    const [sizes, setSizes] = useState([{ size_value: "", stock: "" }]);

    const [loading, setLoading] = useState(false);

    // Load initial product details
    useEffect(() => {
        if (!product) {
            toast.error("No product selected");
            navigate("/admin-page/products");
            return;
        }

        setName(product.name);
        setAltNames(product.altNames || "");
        setDescription(product.description || "");
        setMainCategory(product.main_category);
        setPrice(product.price);
        setColor(product.color || "");
        setCountry(product.country || "");
        setExistingImages(product.images || []);
        setSizes(product.sizes || []);
    }, [product]);

    // Preview new uploaded images
    useEffect(() => {
        if (images.length > 0) {
            const previews = Array.from(images).map((file) =>
                URL.createObjectURL(file)
            );
            setPreviewImages(previews);

            return () => previews.forEach((url) => URL.revokeObjectURL(url));
        }
    }, [images]);

    // Add Size Row
    const addSizeRow = () => setSizes([...sizes, { size_value: "", stock: "" }]);

    // Remove Size Row
    const removeSizeRow = (index) => {
        const updated = sizes.filter((_, i) => i !== index);
        setSizes(updated);
    };

    // Update Size Field
    const updateSizeField = (index, field, value) => {
        const updated = [...sizes];
        updated[index][field] = value;
        setSizes(updated);
    };

    // Submit Update
    async function handleUpdateProduct(e) {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) return toast.error("Unauthorized");

        try {
            setLoading(true);

            toast.loading("Updating product...");

            // Upload new images if selected
            let uploaded = [];
            if (images.length > 0) {
                for (let f of images) {
                    const url = await mediaUpload(f);
                    uploaded.push(url);
                }
            }

            const payload = {
                name,
                altNames,
                description,
                main_category: mainCategory,
                price: Number(price),
                color,
                country,
                images: [...existingImages, ...uploaded],
                sizes: sizes.map((s) => ({
                    size_value: s.size_value,
                    stock: Number(s.stock),
                })),
            };

            await axios.put(
                `http://localhost:3000/api/products/update_product/${product.product_id}`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.dismiss();
            toast.success("Product updated!");

            navigate("/admin-page/products");

        } catch (err) {
            toast.dismiss();
            toast.error(err.response?.data?.message || "Update failed");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full min-h-screen bg-white p-6">

            {/* Header */}
            <div className="bg-red-100 p-5 rounded-xl mb-6 flex items-center gap-4 shadow">
                <Link 
                    to="/admin-page/products"
                    className="bg-red-500 p-2 rounded-lg hover:bg-red-600 transition"
                >
                    <ArrowLeft className="text-white" />
                </Link>

                <div>
                    <h1 className="text-3xl font-bold text-red-700">Edit Product</h1>
                    <p className="text-red-600">Update product details for Supun Shoe Mart</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateProduct} className="bg-white border border-red-200 rounded-xl p-8 shadow-xl">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* LEFT SIDE */}
                    <div className="space-y-5">

                        <div>
                            <label className="font-semibold text-black">Product Name *</label>
                            <input 
                                className="w-full border p-3 rounded-lg"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="font-semibold text-black">Alternative Names</label>
                            <input 
                                className="w-full border p-3 rounded-lg"
                                value={altNames}
                                onChange={(e) => setAltNames(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="font-semibold text-black">Description</label>
                            <textarea
                                className="w-full border p-3 rounded-lg"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="font-semibold text-black">Main Category *</label>
                            <select
                                className="w-full border p-3 rounded-lg"
                                value={mainCategory}
                                onChange={(e) => setMainCategory(e.target.value)}
                            >
                                <option value="men">Men</option>
                                <option value="women">Women</option>
                                <option value="child">Child</option>
                            </select>
                        </div>

                        <div>
                            <label className="font-semibold text-black">Price *</label>
                            <input 
                                type="number"
                                className="w-full border p-3 rounded-lg"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="font-semibold text-black">Color</label>
                            <input 
                                className="w-full border p-3 rounded-lg"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="font-semibold text-black">Country</label>
                            <input 
                                className="w-full border p-3 rounded-lg"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            />
                        </div>

                        {/* SIZES */}
                        <div>
                            <label className="font-semibold text-lg">Sizes *</label>

                            <div className="space-y-3 mt-2">
                                {sizes.map((row, index) => (
                                    <div key={index} className="flex gap-3">
                                        <input 
                                            placeholder="Size"
                                            value={row.size_value}
                                            onChange={(e)=> updateSizeField(index,"size_value",e.target.value)}
                                            className="border p-3 rounded-lg w-1/2"
                                        />

                                        <input 
                                            placeholder="Stock"
                                            type="number"
                                            value={row.stock}
                                            onChange={(e)=> updateSizeField(index,"stock",e.target.value)}
                                            className="border p-3 rounded-lg w-1/2"
                                        />

                                        {sizes.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSizeRow(index)}
                                                className="bg-red-500 text-white px-3 rounded-lg"
                                            >
                                                <Trash2 />
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addSizeRow}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg flex gap-2 items-center"
                                >
                                    <Plus /> Add Size
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT SIDE – IMAGES */}
                    <div className="space-y-4">
                        <label className="flex gap-2 font-semibold text-black text-lg">
                            <ImageIcon className="w-5" /> Existing Images
                        </label>

                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {existingImages.map((img, idx) => (
                                <img key={idx} src={img} className="w-full h-28 object-cover rounded-xl border" />
                            ))}
                        </div>

                        <label className="flex gap-2 font-semibold text-black text-lg">
                            <Upload className="w-5" /> Upload New Images
                        </label>

                        <div className="border-2 border-dashed border-red-300 p-8 rounded-xl text-center">
                            <label className="cursor-pointer">
                                <Upload className="w-10 h-10 text-red-600 mx-auto" />
                                <p className="text-red-600 mt-2">Click to upload images</p>
                                <input 
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e)=> setImages(e.target.files)}
                                />
                            </label>
                        </div>

                        {previewImages.length > 0 && (
                            <>
                                <h4 className="font-semibold">New Images</h4>
                                <div className="grid grid-cols-3 gap-3">
                                    {previewImages.map((src, idx) => (
                                        <img key={idx} src={src} className="w-full h-28 object-cover rounded-xl border" />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* BUTTONS */}
                <div className="flex justify-center gap-4 mt-8">
                    <Link
                        to="/admin-page/products"
                        className="px-8 py-3 border border-gray-400 rounded-lg text-gray-600 hover:bg-gray-100"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-8 py-3 rounded-lg text-white font-semibold ${
                            loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
                        }`}
                    >
                        {loading ? "Updating..." : "Update Product"}
                    </button>
                </div>

            </form>
        </div>
    );
}
