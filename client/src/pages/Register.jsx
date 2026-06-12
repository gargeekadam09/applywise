import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { registerUser } from "../services/authService";
import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      toast.success("Account created! Redirecting to login...");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.log(error);
      toast.error("Registration failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen theme-bg relative overflow-hidden flex items-center justify-center px-4">
      <Navbar />

      <div className="absolute w-72 h-72 bg-blue-500 rounded-full blur-[120px] opacity-10 top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-[120px] opacity-10 bottom-10 right-10"></div>

      <div className="relative z-10 w-full max-w-md theme-card backdrop-blur-xl border rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-blue-500 mb-3">ApplyWise</h1>
          <p className="theme-text-secondary">Create your job tracker account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="theme-label text-sm">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full mt-2 p-4 rounded-xl theme-input border outline-none focus:border-blue-500 transition-all duration-300"
            />
          </div>

          <div>
            <label className="theme-label text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full mt-2 p-4 rounded-xl theme-input border outline-none focus:border-blue-500 transition-all duration-300"
            />
          </div>

          <div>
            <label className="theme-label text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full mt-2 p-4 rounded-xl theme-input border outline-none focus:border-blue-500 transition-all duration-300"
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] transition-all duration-300 text-white py-4 rounded-xl font-semibold cursor-pointer shadow-lg shadow-blue-500/30">
            Create Account
          </button>

          <p className="theme-text-secondary text-center mt-6">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-blue-500 hover:text-blue-400 cursor-pointer transition-all duration-300"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
