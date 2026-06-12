import { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name cannot be empty.");
    setSavingName(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/api/auth/profile",
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update localStorage with new name
      localStorage.setItem("user", JSON.stringify({ ...user, name: res.data.name }));
      toast.success("Name updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update name.");
    } finally {
      setSavingName(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return toast.error("Fill in both password fields.");
    if (newPassword.length < 6) return toast.error("New password must be at least 6 characters.");
    setSavingPassword(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/auth/profile",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password.");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="min-h-screen theme-bg theme-text overflow-hidden relative">
      <div className="absolute w-72 h-72 bg-blue-500 rounded-full blur-[120px] opacity-10 top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-[120px] opacity-10 bottom-10 right-10"></div>

      <Navbar />

      <div className="relative z-10 max-w-2xl mx-auto pt-32 px-6 pb-20 space-y-6">

        {/* Account Info */}
        <div className="theme-card border backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-blue-500 mb-1">Profile</h1>
          <p className="theme-text-secondary mb-6">Manage your account details</p>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-lg">{user?.name}</p>
              <p className="theme-text-secondary text-sm">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Update Name */}
        <div className="theme-card border backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold mb-5">Update Name</h2>
          <form onSubmit={handleUpdateName} className="space-y-4">
            <div>
              <label className="theme-label text-sm">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-2 p-4 rounded-xl theme-input border outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <button disabled={savingName}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50">
              {savingName ? "Saving..." : "Save Name"}
            </button>
          </form>
        </div>

        {/* Update Password */}
        <div className="theme-card border backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold mb-5">Change Password</h2>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="theme-label text-sm">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full mt-2 p-4 rounded-xl theme-input border outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="theme-label text-sm">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full mt-2 p-4 rounded-xl theme-input border outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <button disabled={savingPassword}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50">
              {savingPassword ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full py-3 rounded-xl border border-[var(--border-color)] theme-text hover:bg-white/5 transition-all">
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Profile;
