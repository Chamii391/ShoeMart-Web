import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { 
    ArrowLeft, 
    Plus, 
    Upload, 
    Image as ImageIcon, 
    Trash2, 
    Package,
    Save,
    X,
    Info,
    Loader2
} from "lucide-react";
import mediaUpload from "../utils/mediaUpload";

export default function AddProductPage() {
    const [name, setName] = useState("");
    const [altNames, setAltNames] = useState("");
    const [description, setDescription] = useState("");
    const [mainCategory, setMainCategory] = useState("");
    const [price, setPrice] = useState("");
    const [color, setColor] = useState("");
    const [country, setCountry] = useState("");

    const [sizes, setSizes] = useState([{ size_value: "", stock: "" }]);

    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Image preview
    useEffect(() => {
        if (images.length > 0) {
            const previews = Array.from(images).map((file) =>
                URL.createObjectURL(file)
            );
            setPreviewImages(previews);
            return () => previews.forEach((url) => URL.revokeObjectURL(url));
        }
    }, [images]);

    // Size handlers
    const addSizeRow = () => {
        setSizes([...sizes, { size_value: "", stock: "" }]);
    };

    const removeSizeRow = (index) => {
        const updated = sizes.filter((_, i) => i !== index);
        setSizes(updated);
    };

    const updateSizeField = (index, field, value) => {
        const updated = [...sizes];
        updated[index][field] = value;
        setSizes(updated);
    };

    // Remove single image
    const removeImage = (index) => {
        const newImages = Array.from(images).filter((_, i) => i !== index);
        setImages(newImages);
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    };

    // Submit
    async function handleAddProduct(e) {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Unauthorized");
            return;
        }

        if (!name || !mainCategory || !price) {
            toast.error("Name, category, and price are required!");
            return;
        }

        if (!images.length) {
            toast.error("Upload at least 1 image");
            return;
        }

        if (sizes.length === 0 || !sizes[0].size_value) {
            toast.error("Add at least one size");
            return;
        }

        setLoading(true);

        try {
            const uploadedUrls = [];
            for (let file of images) {
                const url = await mediaUpload(file);
                uploadedUrls.push(url);
            }

            const payload = {
                name,
                altNames,
                description,
                main_category: mainCategory,
                price: Number(price),
                color,
                country,
                images: uploadedUrls,
                isActive: "active",
                sizes: sizes.map((s) => ({
                    size_value: s.size_value,
                    stock: Number(s.stock),
                })),
            };

            await axios.post(
                "http://localhost:3000/api/products/add_product",
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Product added successfully!");
            navigate("/admin-page/products");

        } catch (err) {
            toast.error(err.response?.data?.message || "Error adding product");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-full flex flex-col overflow-hidden bg-gray-50">

            {/* ============ HEADER - FIXED ============ */}
            <div className="flex-shrink-0 bg-black px-6 py-4">
                <div className="flex items-center justify-between">
                    
                    {/* Left */}
                    <div className="flex items-center gap-4">
                        <Link
                            to="/admin-page/products"
                            className="w-10 h-10 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-600 flex items-center justify-center">
                                <Plus className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-white">ADD PRODUCT</h1>
                                <p className="text-xs text-gray-500">Create new inventory item</p>
                            </div>
                        </div>
                    </div>

                    {/* Right - Actions */}
                    <div className="flex items-center gap-2">
                        <Link
                            to="/admin-page/products"
                            className="h-10 px-4 bg-white/10 hover:bg-white/20 text-white text-sm font-bold flex items-center gap-2 transition-all"
                        >
                            <X className="w-4 h-4" />
                            <span className="hidden sm:inline">CANCEL</span>
                        </Link>
                        <button
                            onClick={handleAddProduct}
                            disabled={loading}
                            className={`h-10 px-6 text-white text-sm font-bold flex items-center gap-2 transition-all ${
                                loading 
                                    ? "bg-gray-600 cursor-not-allowed" 
                                    : "bg-red-600 hover:bg-red-700"
                            }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="hidden sm:inline">SAVING...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span className="hidden sm:inline">SAVE PRODUCT</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ============ FORM CONTENT - SCROLLABLE ============ */}
            <div className="flex-1 overflow-y-auto">
                <form onSubmit={handleAddProduct} className="p-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* ============ LEFT COLUMN - BASIC INFO ============ */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* Basic Information */}
                                <div className="bg-white border-2 border-gray-100">
                                    <div className="px-6 py-4 border-b-2 border-gray-100">
                                        <h2 className="font-black text-sm uppercase tracking-wide">Basic Information</h2>
                                    </div>
                                    <div className="p-6 space-y-5">

                                        {/* Product Name */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                                Product Name <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter product name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full h-12 px-4 border-2 border-gray-200 focus:border-black outline-none font-medium transition-all"
                                            />
                                        </div>

                                        {/* Alternative Names */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                                Alternative Names
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Other names or keywords"
                                                value={altNames}
                                                onChange={(e) => setAltNames(e.target.value)}
                                                className="w-full h-12 px-4 border-2 border-gray-200 focus:border-black outline-none font-medium transition-all"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                placeholder="Enter product description"
                                                rows={4}
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-black outline-none font-medium transition-all resize-none"
                                            />
                                        </div>

                                        {/* Category & Price Row */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                                    Category <span className="text-red-600">*</span>
                                                </label>
                                                <select
                                                    value={mainCategory}
                                                    onChange={(e) => setMainCategory(e.target.value)}
                                                    className="w-full h-12 px-4 border-2 border-gray-200 focus:border-black outline-none font-bold bg-white cursor-pointer transition-all"
                                                >
                                                    <option value="">Select Category</option>
                                                    <option value="men">Men</option>
                                                    <option value="women">Women</option>
                                                    <option value="child">Children</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                                    Price (Rs.) <span className="text-red-600">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={price}
                                                    onChange={(e) => setPrice(e.target.value)}
                                                    className="w-full h-12 px-4 border-2 border-gray-200 focus:border-black outline-none font-bold transition-all"
                                                />
                                            </div>
                                        </div>

                                        {/* Color & Country Row */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                                    Color
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., Black, White"
                                                    value={color}
                                                    onChange={(e) => setColor(e.target.value)}
                                                    className="w-full h-12 px-4 border-2 border-gray-200 focus:border-black outline-none font-medium transition-all"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                                    Country of Origin
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., Vietnam"
                                                    value={country}
                                                    onChange={(e) => setCountry(e.target.value)}
                                                    className="w-full h-12 px-4 border-2 border-gray-200 focus:border-black outline-none font-medium transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sizes & Stock */}
                                <div className="bg-white border-2 border-gray-100">
                                    <div className="px-6 py-4 border-b-2 border-gray-100 flex items-center justify-between">
                                        <h2 className="font-black text-sm uppercase tracking-wide">
                                            Sizes & Stock <span className="text-red-600">*</span>
                                        </h2>
                                        <button
                                            type="button"
                                            onClick={addSizeRow}
                                            className="h-8 px-3 bg-black hover:bg-red-600 text-white text-xs font-bold flex items-center gap-1 transition-all"
                                        >
                                            <Plus className="w-3 h-3" />
                                            ADD SIZE
                                        </button>
                                    </div>
                                    <div className="p-6">
                                        
                                        {/* Size Header */}
                                        <div className="grid grid-cols-12 gap-3 mb-3">
                                            <div className="col-span-5">
                                                <span className="text-xs font-bold text-gray-500 uppercase">Size</span>
                                            </div>
                                            <div className="col-span-5">
                                                <span className="text-xs font-bold text-gray-500 uppercase">Stock Qty</span>
                                            </div>
                                            <div className="col-span-2"></div>
                                        </div>

                                        {/* Size Rows */}
                                        <div className="space-y-3">
                                            {sizes.map((row, index) => (
                                                <div key={index} className="grid grid-cols-12 gap-3">
                                                    <div className="col-span-5">
                                                        <input
                                                            type="text"
                                                            placeholder="e.g., 40"
                                                            value={row.size_value}
                                                            onChange={(e) =>
                                                                updateSizeField(index, "size_value", e.target.value)
                                                            }
                                                            className="w-full h-11 px-4 border-2 border-gray-200 focus:border-black outline-none font-bold text-center transition-all"
                                                        />
                                                    </div>
                                                    <div className="col-span-5">
                                                        <input
                                                            type="number"
                                                            placeholder="0"
                                                            value={row.stock}
                                                            onChange={(e) =>
                                                                updateSizeField(index, "stock", e.target.value)
                                                            }
                                                            className="w-full h-11 px-4 border-2 border-gray-200 focus:border-black outline-none font-bold text-center transition-all"
                                                        />
                                                    </div>
                                                    <div className="col-span-2 flex justify-center">
                                                        {sizes.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeSizeRow(index)}
                                                                className="w-11 h-11 bg-gray-100 hover:bg-red-600 hover:text-white text-gray-500 flex items-center justify-center transition-all"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Info */}
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <p className="text-xs text-gray-500 flex items-center gap-2">
                                                <Info className="w-4 h-4" />
                                                Add all available sizes with their stock quantities
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ============ RIGHT COLUMN - IMAGES ============ */}
                            <div className="space-y-6">

                                {/* Image Upload */}
                                <div className="bg-white border-2 border-gray-100">
                                    <div className="px-6 py-4 border-b-2 border-gray-100">
                                        <h2 className="font-black text-sm uppercase tracking-wide">
                                            Product Images <span className="text-red-600">*</span>
                                        </h2>
                                    </div>
                                    <div className="p-6">
                                        
                                        {/* Upload Area */}
                                        <label className="block cursor-pointer group">
                                            <div className="border-2 border-dashed border-gray-300 group-hover:border-red-600 p-8 text-center transition-all">
                                                <div className="w-16 h-16 bg-gray-100 group-hover:bg-red-50 flex items-center justify-center mx-auto mb-4 transition-all">
                                                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-red-600 transition-all" />
                                                </div>
                                                <p className="font-bold text-sm mb-1">Click to upload</p>
                                                <p className="text-xs text-gray-500">PNG, JPG up to 5MB each</p>
                                            </div>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => setImages(e.target.files)}
                                            />
                                        </label>

                                        {/* Preview Images */}
                                        {previewImages.length > 0 && (
                                            <div className="mt-6">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-xs font-bold text-gray-500 uppercase">
                                                        Uploaded ({previewImages.length})
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setImages([]);
                                                            setPreviewImages([]);
                                                        }}
                                                        className="text-xs font-bold text-red-600 hover:text-red-700"
                                                    >
                                                        Clear All
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {previewImages.map((src, idx) => (
                                                        <div key={idx} className="relative group">
                                                            <div className="aspect-square bg-gray-100 overflow-hidden">
                                                                <img
                                                                    src={src}
                                                                    alt={`Preview ${idx + 1}`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(idx)}
                                                                className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                            {idx === 0 && (
                                                                <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs font-bold py-1 text-center">
                                                                    MAIN
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* No Images */}
                                        {previewImages.length === 0 && (
                                            <div className="mt-4 p-4 bg-gray-50 text-center">
                                                <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                                <p className="text-xs text-gray-500">No images uploaded</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Tips */}
                                <div className="bg-black text-white p-6">
                                    <h3 className="font-black text-sm mb-4">QUICK TIPS</h3>
                                    <ul className="space-y-3 text-sm text-gray-400">
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-red-600 mt-1.5 flex-shrink-0"></span>
                                            Use high-quality product images
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-red-600 mt-1.5 flex-shrink-0"></span>
                                            First image will be the main display
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-red-600 mt-1.5 flex-shrink-0"></span>
                                            Add accurate stock for each size
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-red-600 mt-1.5 flex-shrink-0"></span>
                                            Set competitive pricing
                                        </li>
                                    </ul>
                                </div>

                                {/* Status Preview */}
                                <div className="bg-white border-2 border-gray-100 p-6">
                                    <h3 className="font-black text-sm uppercase tracking-wide mb-4">Status</h3>
                                    <div className="flex items-center gap-3">
                                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                        <span className="font-bold text-sm">Active</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Product will be visible to customers after saving
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ============ BOTTOM ACTIONS - MOBILE ============ */}
                        <div className="lg:hidden mt-6 flex gap-3">
                            <Link
                                to="/admin-page/products"
                                className="flex-1 h-12 bg-gray-100 hover:bg-gray-200 text-black font-bold flex items-center justify-center gap-2 transition-all"
                            >
                                <X className="w-4 h-4" />
                                CANCEL
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex-1 h-12 text-white font-bold flex items-center justify-center gap-2 transition-all ${
                                    loading 
                                        ? "bg-gray-400 cursor-not-allowed" 
                                        : "bg-red-600 hover:bg-red-700"
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        SAVING...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        SAVE PRODUCT
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}