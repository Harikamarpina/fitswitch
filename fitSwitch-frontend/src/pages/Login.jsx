import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { Eye, EyeOff } from "lucide-react";






export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const incomingEmail = location?.state?.email;
    if (incomingEmail) {
      setForm((prev) => ({ ...prev, email: incomingEmail }));
    }
  }, [location]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim()) return setError("Email is required");
    if (!form.password.trim()) return setError("Password is required");

    try {
      setLoading(true);
      const res = await loginUser(form);

      // Check if login was successful
      if (!res.data.success) {
        setError(res.data.message || "Login failed");
        return;
      }

      // Extract data from nested response structure
      const { token, email, role, userId } = res.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      navigate("/dashboard");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
          <p className="text-zinc-400 mt-2">
            Login to continue your fitness journey
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="name@example.com"
          />
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-400 ml-1">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 transition-all placeholder:text-zinc-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-lime-500 hover:bg-lime-400 text-black font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg shadow-lime-500/10"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : "Sign In"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <p className="text-zinc-400 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-lime-500 font-semibold hover:text-lime-400 transition-colors">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-zinc-400 ml-1">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 transition-all placeholder:text-zinc-600"
      />
    </div>
  );
}
