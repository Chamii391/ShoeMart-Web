import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

import { ArrowLeft, Plus, Upload, Image as ImageIcon, Trash2 } from "lucide-react";
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

  // image preview
  useEffect(() => {
    if (images.length > 0) {
      const previews = Array.from(images).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewImages(previews);

      return () => previews.forEach((url) => URL.revokeObjectURL(url));
    }
  }, [images]);

  // -------- ADD NEW SIZE ROW ----------
  const addSizeRow = () => {
    setSizes([...sizes, { size_value: "", stock: "" }]);
  };

  // -------- REMOVE SIZE ROW ----------
  const removeSizeRow = (index) => {
    const updated = sizes.filter((_, i) => i !== index);
    setSizes(updated);
  };

  // -------- UPDATE SIZE FIELD ----------
  const updateSizeField = (index, field, value) => {
    const updated = [...sizes];
    updated[index][field] = value;
    setSizes(updated);
  };

  // -------- SUBMIT ----------
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
      toast.loading("Uploading images...");

      const uploadedUrls = [];
      for (let file of images) {
        const url = await mediaUpload(file);
        uploadedUrls.push(url);
      }

      toast.dismiss();
      toast.loading("Saving product...");

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
          <p className="text-red-600">Supun Shoe Mart Admin Panel</p>
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
                className="w-full border p-3 rounded-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="font-semibold text-black">Alternative Names</label>
              <input
                type="text"
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
                <option value="">Select</option>
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
                type="text"
                className="w-full border p-3 rounded-lg"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>

            <div>
              <label className="font-semibold text-black">Country</label>
              <input
                type="text"
                className="w-full border p-3 rounded-lg"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            {/* SIZES SECTION */}
            <div>
              <label className="font-semibold text-black text-lg">Product Sizes *</label>

              <div className="space-y-4 mt-3">
                {sizes.map((row, index) => (
                  <div key={index} className="flex gap-3">

                    <input
                      type="text"
                      placeholder="Size (e.g., 40)"
                      value={row.size_value}
                      onChange={(e) =>
                        updateSizeField(index, "size_value", e.target.value)
                      }
                      className="w-1/2 border p-3 rounded-lg"
                    />

                    <input
                      type="number"
                      placeholder="Stock"
                      value={row.stock}
                      onChange={(e) =>
                        updateSizeField(index, "stock", e.target.value)
                      }
                      className="w-1/2 border p-3 rounded-lg"
                    />

                    {sizes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSizeRow(index)}
                        className="bg-red-500 px-3 rounded-lg text-white"
                      >
                        <Trash2 />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addSizeRow}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus /> Add Size
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE – IMAGE UPLOAD */}
          <div className="space-y-5">
            <label className="flex items-center gap-2 font-semibold text-lg text-black">
              <ImageIcon className="w-5 h-5" /> Upload Images *
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
                  onChange={(e) => setImages(e.target.files)}
                />
              </label>
            </div>

            {previewImages.length > 0 && (
              <div>
                <h4 className="font-semibold text-black mb-2">
                  Preview ({previewImages.length})
                </h4>

                <div className="grid grid-cols-3 gap-3">
                  {previewImages.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      className="w-full h-28 object-cover rounded-xl border"
                    />
                  ))}
                </div>
              </div>
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
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>

      </form>
    </div>
  );
}
