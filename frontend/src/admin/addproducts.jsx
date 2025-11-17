import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

import { ArrowLeft, Plus, Upload, Image as ImageIcon } from "lucide-react";
import mediaUpload from "../utils/mediaUpload";

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [altNames, setAltNames] = useState("");
  const [description, setDescription] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [country, setCountry] = useState("");

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (images.length > 0) {
      const previews = Array.from(images).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewImages(previews);

      return () => previews.forEach((url) => URL.revokeObjectURL(url));
    }
  }, [images]);

  async function handleAddProduct(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Unauthorized");
      return;
    }

    if (!name || !mainCategory || !price) {
      toast.error("Name, category, and price are required");
      return;
    }

    if (!images.length) {
      toast.error("Upload at least 1 image");
      return;
    }

    setLoading(true);

    try {
      toast.loading("Uploading images...");

      const imageUrls = [];
      for (let file of images) {
        const url = await mediaUpload(file);
        imageUrls.push(url);
      }

      toast.dismiss();
      toast.loading("Saving product...");

      const product = {
        name,
        altNames,
        description,
        main_category: mainCategory,
        price: Number(price),
        stock: Number(stock),
        size,
        color,
        country,
        images: imageUrls,
        isActive: "active",
      };

      await axios.post(
        "http://localhost:3000/api/products/add_product",
        product,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      

      toast.dismiss();
      toast.success("Product Added Successfully!");

      navigate("/admin-page/products");
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || "Error adding product");
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
          <h1 className="text-3xl font-bold text-red-700">Add New Product</h1>
          <p className="text-red-600">Manage your Supun Shoe Mart collection</p>
        </div>
      </div>

      {/* Form */}
      <form 
        onSubmit={handleAddProduct} 
        className="bg-white border border-red-200 rounded-xl p-8 shadow-xl"
      >

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* LEFT SIDE */}
          <div className="space-y-5">

            <div>
              <label className="font-semibold text-black">Product Name *</label>
              <input 
                type="text"
                className="w-full border p-3 rounded-lg focus:border-red-500 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nike Running Shoes"
              />
            </div>

            <div>
              <label className="font-semibold text-black">Alternative Names</label>
              <input 
                type="text"
                className="w-full border p-3 rounded-lg focus:border-red-500 outline-none"
                value={altNames}
                onChange={(e) => setAltNames(e.target.value)}
                placeholder="Air Zoom, Air Max..."
              />
            </div>

            <div>
              <label className="font-semibold text-black">Description</label>
              <textarea
                className="w-full border p-3 rounded-lg focus:border-red-500 outline-none"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="High quality running shoe..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="font-semibold text-black">Main Category *</label>
              <select
                className="w-full border p-3 rounded-lg focus:border-red-500 outline-none"
                value={mainCategory}
                onChange={(e) => setMainCategory(e.target.value)}
              >
                <option value="">Select</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="child">Child</option>
              </select>
            </div>

            {/* Price / Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <label className="font-semibold text-black">Stock</label>
                <input 
                  type="number"
                  className="w-full border p-3 rounded-lg"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div>
                <label className="font-semibold text-black">Size</label>
                <input 
                  type="text"
                  className="w-full border p-3 rounded-lg"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="40, 41, 42..."
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-black">Color</label>
              <input 
                type="text"
                className="w-full border p-3 rounded-lg"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Black / White"
              />
            </div>

            <div>
              <label className="font-semibold text-black">Country</label>
              <input 
                type="text"
                className="w-full border p-3 rounded-lg"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Vietnam"
              />
            </div>

          </div>

          {/* RIGHT SIDE - UPLOAD */}
          <div className="space-y-5">
            <label className="flex items-center gap-2 font-semibold text-black text-lg">
              <ImageIcon className="w-5 h-5" /> Upload Images *
            </label>

            {/* Upload Box */}
            <div className="border-2 border-dashed border-red-300 p-8 rounded-xl text-center hover:border-red-500 transition">
              <label className="cursor-pointer">
                <Upload className="w-10 h-10 text-red-600 mx-auto" />
                <p className="text-red-600 mt-2">Click to upload images</p>

                <input 
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImages(e.target.files)}
                />
              </label>
            </div>

            {/* Preview Box */}
            {previewImages.length > 0 && (
              <div>
                <h4 className="font-semibold text-black mb-2">Preview ({previewImages.length} images)</h4>
                <div className="grid grid-cols-3 gap-3">
                  {previewImages.map((src, idx) => (
                    <div 
                      key={idx}
                      className="border rounded-xl overflow-hidden shadow"
                    >
                      <img 
                        src={src}
                        alt="preview"
                        className="w-full h-28 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Buttons */}
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
              loading
                ? "bg-gray-400"
                : "bg-red-600 hover:bg-red-700 shadow-lg"
            }`}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>

      </form>
    </div>
  );
}
