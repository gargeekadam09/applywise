import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { loginUser } from "../services/authService";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error("Login failed. Check your credentials.");
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
          <p className="theme-text-secondary">Smart job tracking platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
            Login
          </button>

          <p className="theme-text-secondary text-center mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-500 hover:text-blue-400 cursor-pointer transition-all duration-300"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
