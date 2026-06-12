import { Link, useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import toast from "react-hot-toast";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Re-read token on every route change so navbar stays in sync
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully.");
    navigate("/");
  };

  return (
    <nav className="w-full absolute top-0 left-0 z-50 px-8 py-6 flex items-center justify-between">
      
      <h1 className="text-3xl font-bold text-blue-500">
        ApplyWise
      </h1>

      <div className="flex gap-4 items-center">
        <ThemeToggle />

        {token && (
          <Link
            to="/documents"
            className="bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20 text-[var(--text-primary)] px-5 py-2 rounded-xl hover:bg-black/20 dark:hover:bg-white/20 transition-all duration-300"
          >
            Documents
          </Link>
        )}

        {token && (
          <Link
            to="/profile"
            className="bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20 text-[var(--text-primary)] p-2 rounded-xl hover:bg-black/20 dark:hover:bg-white/20 transition-all duration-300"
            title="Profile"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
        )}

        {!token ? (
          <Link
            to="/register"
            className="bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20 text-[var(--text-primary)] px-5 py-2 rounded-xl hover:bg-black/20 dark:hover:bg-white/20 transition-all duration-300"
          >
            Register
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl transition-all duration-300"
          >
            Logout
          </button>
        )}

      </div>
    </nav>
  );
}

export default Navbar;