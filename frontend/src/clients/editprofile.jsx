import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { 
    ArrowLeft,
    User, 
    Lock, 
    Eye, 
    EyeOff, 
    Save, 
    Loader2,
    Shield,
    CheckCircle,
    UserCog,
    X,
    Info
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
            <div className="h-full flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col overflow-hidden bg-gray-50">

            {/* ============ HEADER - FIXED ============ */}
            <div className="flex-shrink-0 bg-black px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                    
                    {/* Left */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link
                            to="/admin-page"
                            className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                        >
                            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Link>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-red-600 flex items-center justify-center">
                                <UserCog className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-base sm:text-xl font-black text-white">EDIT PROFILE</h1>
                                <p className="text-xs text-gray-500 hidden sm:block">Update your account settings</p>
                            </div>
                        </div>
                    </div>

                    {/* Right - Actions */}
                    <div className="flex items-center gap-2">
                        <Link
                            to="/admin-page"
                            className="h-9 sm:h-10 px-3 sm:px-4 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all"
                        >
                            <X className="w-4 h-4" />
                            <span className="hidden sm:inline">CANCEL</span>
                        </Link>
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className={`h-9 sm:h-10 px-4 sm:px-6 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                                saving
                                    ? "bg-gray-600 cursor-not-allowed" 
                                    : "bg-red-600 hover:bg-red-700"
                            }`}
                        >
                            {saving ? (
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

            {/* ============ CONTENT - SCROLLABLE ============ */}
            <div className="flex-1 overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                    <div className="max-w-3xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* ============ LEFT COLUMN - PROFILE INFO ============ */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* Profile Header Card */}
                                <div className="bg-black text-white p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
                                        
                                        {/* Avatar */}
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 flex items-center justify-center font-black text-2xl sm:text-3xl flex-shrink-0">
                                            {firstname ? firstname.charAt(0).toUpperCase() : "U"}
                                        </div>

                                        {/* Info */}
                                        <div className="text-center sm:text-left flex-1">
                                            <h2 className="text-lg sm:text-xl font-black">
                                                {firstname} {lastname}
                                            </h2>
                                            <p className="text-gray-400 text-sm">@{username}</p>
                                            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                                                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                                <span className="text-xs text-emerald-400 font-bold">ACTIVE ACCOUNT</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Personal Information */}
                                <div className="bg-white border-2 border-gray-100">
                                    <div className="px-4 sm:px-6 py-4 border-b-2 border-gray-100">
                                        <h3 className="font-black text-sm uppercase tracking-wide flex items-center gap-2">
                                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                                            Personal Information
                                        </h3>
                                    </div>

                                    <div className="p-4 sm:p-6 space-y-5">

                                        {/* First & Last Name */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                                    First Name <span className="text-red-600">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={firstname}
                                                    onChange={(e) => setFirstname(e.target.value)}
                                                    placeholder="Enter first name"
                                                    disabled={saving}
                                                    className="w-full h-11 sm:h-12 px-4 border-2 border-gray-200 focus:border-black outline-none font-medium transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                                                    disabled={saving}
                                                    className="w-full h-11 sm:h-12 px-4 border-2 border-gray-200 focus:border-black outline-none font-medium transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                                                disabled={saving}
                                                className="w-full h-11 sm:h-12 px-4 border-2 border-gray-200 focus:border-black outline-none font-medium transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Change Password */}
                                <div className="bg-white border-2 border-gray-100">
                                    <div className="px-4 sm:px-6 py-4 border-b-2 border-gray-100">
                                        <h3 className="font-black text-sm uppercase tracking-wide flex items-center gap-2">
                                            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
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
                                                    disabled={saving}
                                                    className="w-full h-11 sm:h-12 px-4 pr-12 border-2 border-gray-200 focus:border-black outline-none font-medium transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    disabled={saving}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-all disabled:cursor-not-allowed"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
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
                                                    disabled={saving}
                                                    className="w-full h-11 sm:h-12 px-4 pr-12 border-2 border-gray-200 focus:border-black outline-none font-medium transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    disabled={saving}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-all disabled:cursor-not-allowed"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                                                </button>
                                            </div>

                                            {/* Password Match Indicator */}
                                            {password && confirmPassword && (
                                                <div className={`flex items-center gap-2 mt-3 text-xs font-bold ${
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

                                        {/* Password Info */}
                                        <div className="pt-2 border-t border-gray-100">
                                            <p className="text-xs text-gray-500 flex items-center gap-2">
                                                <Info className="w-4 h-4" />
                                                Password must be at least 6 characters
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ============ RIGHT COLUMN - TIPS & INFO ============ */}
                            <div className="space-y-6">

                                {/* Quick Tips */}
                                <div className="bg-black text-white p-5 sm:p-6">
                                    <h3 className="font-black text-sm mb-4">ACCOUNT TIPS</h3>
                                    <ul className="space-y-3 text-sm text-gray-400">
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-red-600 mt-1.5 flex-shrink-0"></span>
                                            Use a unique username
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-red-600 mt-1.5 flex-shrink-0"></span>
                                            Keep your password secure
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-red-600 mt-1.5 flex-shrink-0"></span>
                                            Use at least 6 characters
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-red-600 mt-1.5 flex-shrink-0"></span>
                                            Mix letters and numbers
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                                            <span className="text-emerald-400">Changes saved instantly</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Account Status */}
                                <div className="bg-white border-2 border-gray-100 p-5 sm:p-6">
                                    <h3 className="font-black text-sm uppercase tracking-wide mb-4">Account Status</h3>
                                    <div className="flex items-center gap-3">
                                        <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                                        <span className="font-bold text-sm">Active</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Your account is in good standing
                                    </p>
                                </div>

                                {/* Security Notice */}
                                <div className="bg-amber-50 border-2 border-amber-200 p-5 sm:p-6">
                                    <div className="flex items-start gap-3">
                                        <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold text-amber-900">Security Notice</p>
                                            <p className="text-xs text-amber-700 mt-1">
                                                You will be logged out after changing your password for security reasons.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ============ BOTTOM ACTIONS - MOBILE ============ */}
                        <div className="lg:hidden mt-6 flex gap-3">
                            <Link
                                to="/admin-page"
                                className="flex-1 h-12 bg-gray-100 hover:bg-gray-200 text-black font-bold flex items-center justify-center gap-2 transition-all"
                            >
                                <X className="w-4 h-4" />
                                CANCEL
                            </Link>
                            <button
                                type="submit"
                                disabled={saving}
                                className={`flex-1 h-12 text-white font-bold flex items-center justify-center gap-2 transition-all ${
                                    saving
                                        ? "bg-gray-400 cursor-not-allowed" 
                                        : "bg-red-600 hover:bg-red-700"
                                }`}
                            >
                                {saving ? (
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