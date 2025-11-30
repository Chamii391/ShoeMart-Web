import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { 
    ArrowLeft, 
    Plus, 
    Upload, 
    Trash2, 
    Image as ImageIcon,
    Save,
    X,
    Info,
    Loader2,
    Edit3,
    Package,
    AlertTriangle
} from "lucide-react";
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
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [sizes, setSizes] = useState([{ size_value: "", stock: "" }]);
    const [loading, setLoading] = useState(false);
    const [isActive, setIsActive] = useState(true);

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
        setSizes(product.sizes?.length > 0 ? product.sizes : [{ size_value: "", stock: "" }]);
        setIsActive(product.isActive === "active");
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

    // Size handlers
    const addSizeRow = () => setSizes([...sizes, { size_value: "", stock: "" }]);

    const removeSizeRow = (index) => {
        const updated = sizes.filter((_, i) => i !== index);
        setSizes(updated);
    };

    const updateSizeField = (index, field, value) => {
        const updated = [...sizes];
        updated[index][field] = value;
        setSizes(updated);
    };

    // Remove existing image
    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    // Remove new preview image
    const removeNewImage = (index) => {
        const newImages = Array.from(images).filter((_, i) => i !== index);
        setImages(newImages);
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    };

    // Submit Update
    async function handleUpdateProduct(e) {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) return toast.error("Unauthorized");

        if (!name || !mainCategory || !price) {
            toast.error("Name, category, and price are required!");
            return;
        }

        if (existingImages.length === 0 && images.length === 0) {
            toast.error("At least 1 image is required");
            return;
        }

        if (sizes.length === 0 || !sizes[0].size_value) {
            toast.error("Add at least one size");
            return;
        }

        try {
            setLoading(true);

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
                isActive: isActive ? "active" : "inactive",
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

            toast.success("Product updated successfully!");
            navigate("/admin-page/products");

        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    // Calculate total stock
    const totalStock = sizes.reduce((sum, s) => sum + (Number(s.stock) || 0), 0);

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
                                <Edit3 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-white">EDIT PRODUCT</h1>
                                <p className="text-xs text-gray-500">
                                    ID: #{product?.product_id}
                                </p>
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
                            <span className="hidden sm:inline">DISCARD</span>
                        </Link>
                        <button
                            onClick={handleUpdateProduct}
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
                                    <span className="hidden sm:inline">SAVE CHANGES</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ============ FORM CONTENT - SCROLLABLE ============ */}
            <div className="flex-1 overflow-y-auto">
                <form onSubmit={handleUpdateProduct} className="p-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* ============ LEFT COLUMN - BASIC INFO ============ */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* Product Preview Card */}
                                <div className="bg-white border-2 border-gray-100 p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 flex-shrink-0 overflow-hidden">
                                            {existingImages.length > 0 ? (
                                                <img 
                                                    src={existingImages[0]} 
                                                    alt={name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="w-6 h-6 text-gray-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-lg truncate">{name || "Product Name"}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 font-bold uppercase">
                                                    {mainCategory || "Category"}
                                                </span>
                                                <span className="text-sm font-bold text-red-600">
                                                    Rs. {Number(price || 0).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right hidden sm:block">
                                            <p className="text-xs text-gray-500">Total Stock</p>
                                            <p className="text-2xl font-black">{totalStock}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Basic Information */}
                                <div className="bg-white border-2 border-gray-100">
                                    <div className="px-6 py-4 border-b-2 border-gray-100 flex items-center justify-between">
                                        <h2 className="font-black text-sm uppercase tracking-wide">Basic Information</h2>
                                        <span className="text-xs text-gray-400">* Required fields</span>
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
                                        <div>
                                            <h2 className="font-black text-sm uppercase tracking-wide">
                                                Sizes & Stock <span className="text-red-600">*</span>
                                            </h2>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {sizes.length} size(s) • {totalStock} total units
                                            </p>
                                        </div>
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
                                            <div className="col-span-2 text-center">
                                                <span className="text-xs font-bold text-gray-500 uppercase">Action</span>
                                            </div>
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
                                                            className={`w-full h-11 px-4 border-2 focus:border-black outline-none font-bold text-center transition-all ${
                                                                Number(row.stock) === 0 
                                                                    ? "border-red-300 bg-red-50" 
                                                                    : Number(row.stock) <= 5 
                                                                        ? "border-yellow-300 bg-yellow-50"
                                                                        : "border-gray-200"
                                                            }`}
                                                        />
                                                    </div>
                                                    <div className="col-span-2 flex justify-center">
                                                        {sizes.length > 1 ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeSizeRow(index)}
                                                                className="w-11 h-11 bg-gray-100 hover:bg-red-600 hover:text-white text-gray-500 flex items-center justify-center transition-all"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        ) : (
                                                            <div className="w-11 h-11"></div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Low Stock Warning */}
                                        {sizes.some(s => Number(s.stock) <= 5 && Number(s.stock) > 0) && (
                                            <div className="mt-4 p-3 bg-yellow-50 border-2 border-yellow-200 flex items-center gap-3">
                                                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                                                <p className="text-xs font-bold text-yellow-700">
                                                    Some sizes have low stock. Consider restocking soon.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ============ RIGHT COLUMN - IMAGES & STATUS ============ */}
                            <div className="space-y-6">

                                {/* Product Status */}
                                <div className="bg-white border-2 border-gray-100">
                                    <div className="px-6 py-4 border-b-2 border-gray-100">
                                        <h2 className="font-black text-sm uppercase tracking-wide">Product Status</h2>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className={`w-3 h-3 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`}></span>
                                                <span className="font-bold">{isActive ? "Active" : "Inactive"}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setIsActive(!isActive)}
                                                className={`relative w-12 h-6 transition-all ${
                                                    isActive ? "bg-green-500" : "bg-gray-300"
                                                }`}
                                            >
                                                <span className={`absolute top-1 w-4 h-4 bg-white transition-all ${
                                                    isActive ? "right-1" : "left-1"
                                                }`}></span>
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-3">
                                            {isActive 
                                                ? "Product is visible to customers" 
                                                : "Product is hidden from store"
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* Existing Images */}
                                <div className="bg-white border-2 border-gray-100">
                                    <div className="px-6 py-4 border-b-2 border-gray-100 flex items-center justify-between">
                                        <h2 className="font-black text-sm uppercase tracking-wide">
                                            Current Images
                                        </h2>
                                        <span className="text-xs font-bold text-gray-400">
                                            {existingImages.length} image(s)
                                        </span>
                                    </div>
                                    <div className="p-6">
                                        {existingImages.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-3">
                                                {existingImages.map((img, idx) => (
                                                    <div key={idx} className="relative group">
                                                        <div className="aspect-square bg-gray-100 overflow-hidden">
                                                            <img
                                                                src={img}
                                                                alt={`Product ${idx + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeExistingImage(idx)}
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
                                        ) : (
                                            <div className="p-4 bg-red-50 border-2 border-red-200 text-center">
                                                <AlertTriangle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                                                <p className="text-xs font-bold text-red-600">No images! Add at least one.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Upload New Images */}
                                <div className="bg-white border-2 border-gray-100">
                                    <div className="px-6 py-4 border-b-2 border-gray-100">
                                        <h2 className="font-black text-sm uppercase tracking-wide">
                                            Add New Images
                                        </h2>
                                    </div>
                                    <div className="p-6">
                                        
                                        {/* Upload Area */}
                                        <label className="block cursor-pointer group">
                                            <div className="border-2 border-dashed border-gray-300 group-hover:border-red-600 p-6 text-center transition-all">
                                                <div className="w-12 h-12 bg-gray-100 group-hover:bg-red-50 flex items-center justify-center mx-auto mb-3 transition-all">
                                                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-red-600 transition-all" />
                                                </div>
                                                <p className="font-bold text-sm mb-1">Click to upload</p>
                                                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                            </div>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => setImages(e.target.files)}
                                            />
                                        </label>

                                        {/* Preview New Images */}
                                        {previewImages.length > 0 && (
                                            <div className="mt-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-xs font-bold text-gray-500 uppercase">
                                                        New ({previewImages.length})
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setImages([]);
                                                            setPreviewImages([]);
                                                        }}
                                                        className="text-xs font-bold text-red-600 hover:text-red-700"
                                                    >
                                                        Clear
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {previewImages.map((src, idx) => (
                                                        <div key={idx} className="relative group">
                                                            <div className="aspect-square bg-gray-100 overflow-hidden border-2 border-green-500">
                                                                <img
                                                                    src={src}
                                                                    alt={`New ${idx + 1}`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeNewImage(idx)}
                                                                className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                            <div className="absolute bottom-0 left-0 right-0 bg-green-600 text-white text-xs font-bold py-1 text-center">
                                                                NEW
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Danger Zone */}
                                <div className="bg-white border-2 border-red-200">
                                    <div className="px-6 py-4 border-b-2 border-red-200 bg-red-50">
                                        <h2 className="font-black text-sm uppercase tracking-wide text-red-600">
                                            Danger Zone
                                        </h2>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-xs text-gray-600 mb-4">
                                            Permanently delete this product and all its data. This action cannot be undone.
                                        </p>
                                        <button
                                            type="button"
                                            className="w-full h-10 bg-white border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-sm font-bold flex items-center justify-center gap-2 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            DELETE PRODUCT
                                        </button>
                                    </div>
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
                                DISCARD
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
                                        SAVE CHANGES
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