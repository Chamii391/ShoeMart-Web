import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { 
    User, 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    Save, 
    Loader2,
    Shield,
    CheckCircle
} from "lucide-react";

export default function EditProfile() {

    const userid = localStorage.getItem("UserId");

    // Form State
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // UI State
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Load User Data
    useEffect(() => {
        loadUserData();
    }, []);

    async function loadUserData() {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                `http://localhost:3000/api/users/user/${userid}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setFirstname(res.data.firstname);
            setLastname(res.data.lastname);
            setUsername(res.data.username);

        } catch (error) {
            toast.error("Failed to load profile");
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    // Update Profile
    async function handleSubmit(e) {
        e.preventDefault();

        // Validation
        if (!firstname || !lastname || !username) {
            toast.error("Please fill all required fields");
            return;
        }

        if (password && password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password && password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setSaving(true);

        try {
            const token = localStorage.getItem("token");
            
            const payload = {
                firstname,
                lastname,
                username,
            };

            // Only send password if user wants to change it
            if (password) {
                payload.password = password;
            }

            await axios.put(
                `http://localhost:3000/api/users/edit-profile/${userid}`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Profile updated successfully");
            
            // Update localStorage username
            localStorage.setItem("username", username);
            
            // Clear password fields
            setPassword("");
            setConfirmPassword("");

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
            console.log(error);
        } finally {
            setSaving(false);
        }
    }

    // Loading State
    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="max-w-2xl mx-auto">

                {/* ============ PROFILE HEADER ============ */}
                <div className="bg-black text-white p-6 sm:p-8 mb-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                        
                        {/* Avatar */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-600 flex items-center justify-center font-black text-3xl sm:text-4xl">
                            {firstname ? firstname.charAt(0).toUpperCase() : "U"}
                        </div>

                        {/* Info */}
                        <div className="text-center sm:text-left">
                            <h2 className="text-xl sm:text-2xl font-black">
                                {firstname} {lastname}
                            </h2>
                            <p className="text-gray-400">@{username}</p>
                        </div>
                    </div>
                </div>

                {/* ============ EDIT FORM ============ */}
                <form onSubmit={handleSubmit}>

                    {/* Personal Information */}
                    <div className="bg-white border-2 border-gray-100 mb-6">
                        <div className="px-4 sm:px-6 py-4 border-b-2 border-gray-100">
                            <h3 className="font-black text-sm uppercase flex items-center gap-2">
                                <User className="w-5 h-5 text-red-600" />
                                Personal Information
                            </h3>
                        </div>

                        <div className="p-4 sm:p-6 space-y-5">

                            {/* First & Last Name */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                        First Name <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={firstname}
                                        onChange={(e) => setFirstname(e.target.value)}
                                        placeholder="Enter first name"
                                        className="w-full h-12 px-4 border-2 border-gray-200 focus:border-black outline-none font-medium transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                        Last Name <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={lastname}
                                        onChange={(e) => setLastname(e.target.value)}
                                        placeholder="Enter last name"
                                        className="w-full h-12 px-4 border-2 border-gray-200 focus:border-black outline-none font-medium transition-all"
                                    />
                                </div>
                            </div>

                            {/* Username */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                    Username <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter username"
                                    className="w-full h-12 px-4 border-2 border-gray-200 focus:border-black outline-none font-medium transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="bg-white border-2 border-gray-100 mb-6">
                        <div className="px-4 sm:px-6 py-4 border-b-2 border-gray-100">
                            <h3 className="font-black text-sm uppercase flex items-center gap-2">
                                <Shield className="w-5 h-5 text-red-600" />
                                Change Password
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">Leave blank to keep current password</p>
                        </div>

                        <div className="p-4 sm:p-6 space-y-5">

                            {/* New Password */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        className="w-full h-12 px-4 pr-12 border-2 border-gray-200 focus:border-black outline-none font-medium transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-all"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        className="w-full h-12 px-4 pr-12 border-2 border-gray-200 focus:border-black outline-none font-medium transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-all"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>

                                {/* Password Match Indicator */}
                                {password && confirmPassword && (
                                    <div className={`flex items-center gap-2 mt-2 text-xs font-bold ${
                                        password === confirmPassword ? "text-emerald-600" : "text-red-600"
                                    }`}>
                                        {password === confirmPassword ? (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                Passwords match
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-4 h-4" />
                                                Passwords do not match
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ============ SAVE BUTTON ============ */}
                    <button
                        type="submit"
                        disabled={saving}
                        className={`w-full h-14 text-white font-black text-sm flex items-center justify-center gap-2 transition-all ${
                            saving 
                                ? "bg-gray-400 cursor-not-allowed" 
                                : "bg-red-600 hover:bg-red-700"
                        }`}
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                SAVING...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                SAVE CHANGES
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}